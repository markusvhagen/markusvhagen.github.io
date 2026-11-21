import {parsePerformanceTime,normalizeDistance,performanceDate} from './record-check.js';

/** Only actual completed performances belong in the public result archive. */
export function isFinishedResult(result){
  if(!result||typeof result!=='object')return false;
  const status=String(result.status??'').trim().toUpperCase();
  if(status&&!['FINISHED','OK','VALID'].includes(status))return false;
  return parsePerformanceTime(result.time)!==null;
}

/** Use the explicitly selected timing basis, never the smaller arbitrary field. */
export function performanceTime(result,race={}){
  const basis=result?.timeBasis??race.timeBasis??race.source?.timeBasis;
  if(basis==='net'&&parsePerformanceTime(result?.netTime)!==null)return result.netTime;
  return result?.time??null;
}

function historyDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const stamp=Date.parse(value+'T12:00:00Z');
  return Number.isFinite(stamp)&&new Date(stamp).toISOString().slice(0,10)===value?value:null;
}

/** Additional PB events do not expand the separate club-record rules. */
function normalizePersonalBestDistance(distance,type){
  const standard=normalizeDistance(distance,type);
  if(standard||type!=='track'||typeof distance!=='string')return standard;
  const normalized=distance.toLowerCase().trim().replace(/\s+/g,'').replace(',','.');
  if(['2000mh','2000mhinder','2000msteeplechase','2kmhinder','2kmsteeplechase'].includes(normalized))return '2000mh';
  const metres=normalized.match(/^(200|400|1000)m$/);
  if(metres)return metres[1]+'m';
  const kilometres=normalized.match(/^(0\.2|0\.4|1)km$/);
  return kilometres?String(Number(kilometres[1])*1000)+'m':null;
}

/** Course identity is required before comparing trail performances. */
function performanceKey(race,result){
  const athleteId=typeof result.athleteId==='string'?result.athleteId.trim():'';
  if(!athleteId)return {reason:'missing-athlete-id'};
  let discipline,category;
  if(race.type==='road'){
    category='road';discipline=normalizeDistance(result.distance,'road');
  }else if(race.type==='track'&&['outdoor','indoor'].includes(race.environment)){
    category='track-'+race.environment;discipline=normalizePersonalBestDistance(result.distance,'track');
  }else if(race.type==='trail'){
    const courseId=result.courseId??race.courseId;
    if(typeof courseId!=='string'||!courseId.trim())return {reason:'trail-course-not-specified'};
    category='trail:'+courseId.trim();
    discipline=normalizeDistance(result.distance,'road')??(typeof result.distance==='string'?result.distance.normalize('NFC').toLocaleLowerCase('nb-NO').replace(/\s+/g,'').trim():null);
  }else return {reason:'unsupported-discipline'};
  if(!discipline)return {reason:'unsupported-distance'};
  return {key:JSON.stringify([athleteId,category,discipline])};
}

/** Validate PB references without inventing missing dates. The exported name
 * and entry.manual field are retained for callers of the original manual API.
 */
export function collectManualPersonalBests(registryData){
  const athletes=Array.isArray(registryData)?registryData:registryData?.athletes;
  const entries=[],issues=[];
  if(!Array.isArray(athletes))return {entries,issues};
  for(const athlete of athletes){
    if(!athlete)continue;
    if(athlete.personalBests===undefined)continue;
    const athleteId=typeof athlete.id==='string'?athlete.id.trim():'';
    if(!Array.isArray(athlete.personalBests)){
      issues.push({athleteId,index:null,reason:'personal-bests-not-array'});continue;
    }
    athlete.personalBests.forEach((pb,index)=>{
      const issue=reason=>issues.push({athleteId,index,reason});
      if(!pb||typeof pb!=='object'||Array.isArray(pb)){issue('invalid-personal-best');return;}
      if(pb.sourceProvider==='world-athletics'){
        if(pb.userApproved!==true){issue('unapproved-world-athletics-reference');return;}
        if(!['profile-personal-best','competition-result'].includes(pb.evidenceKind)){issue('invalid-world-athletics-evidence-kind');return;}
      }
      const achievedDate=historyDate(pb.date);
      // An undated PB is known by asOf, never assumed to predate older races.
      // A malformed supplied date remains invalid even if asOf is valid.
      const date=pb.date==null?historyDate(pb.asOf):achievedDate;
      const seconds=parsePerformanceTime(pb.time);
      const comparison=performanceKey(pb,{...pb,athleteId});
      if(!athleteId){issue('missing-athlete-id');return;}
      if(!date){issue('invalid-personal-best-date');return;}
      if(pb.raceId!==undefined&&(typeof pb.raceId!=='string'||!pb.raceId.trim())){issue('invalid-personal-best-race-id');return;}
      if(!isFinishedResult(pb)){issue('invalid-personal-best-time-or-status');return;}
      if(!comparison.key){issue(comparison.reason);return;}
      const manual={athleteId,index,date:achievedDate,...(!achievedDate?{asOf:date}:{}),time:pb.time,type:pb.type,distance:pb.distance};
      for(const key of ['environment','courseId','eventName','source','sourceUrl','raceId','sourceProvider','evidenceKind','checkedAt']){
        if(typeof pb[key]==='string')manual[key]=pb[key];
      }
      if(pb.userApproved===true)manual.userApproved=true;
      entries.push({key:comparison.key,date,time:pb.time,seconds,raceId:null,manual});
    });
  }
  return {entries,issues};
}

/**
 * Recalculate from the archive and registered PB references without changing sources.
 * A PB requires an equal or faster time than the fastest applicable reference for
 * this athlete and discipline. Archive results alone can never establish a PB.
 * Manual references without a provider take precedence over World Athletics
 * references for the same event. Superseded WA entries do not affect history.
 * The reference threshold applies to all results, including matches before asOf;
 * asOf records when the reference became known, not when it was achieved.
 * An earlier faster result prevents a later slower result from being a PB.
 * A valid result.date takes precedence over race.date in multi-day meetings.
 * Same-day results are evaluated together because start order is unknown.
 * isBestRecorded remains independent of PB status. A newly supplied, faster
 * reference can remove PB labels from results above that threshold.
 */
export function derivePerformanceHistory(races,registryData=null){
  if(!Array.isArray(races))return [];
  const groups=new Map();
  const references=collectManualPersonalBests(registryData).entries;
  const manualKeys=new Set(references.filter(entry=>!entry.manual.sourceProvider).map(entry=>entry.key));
  for(const entry of references){
    if(entry.manual.sourceProvider==='world-athletics'&&manualKeys.has(entry.key))continue;
    if(!groups.has(entry.key))groups.set(entry.key,[]);
    groups.get(entry.key).push(entry);
  }
  const output=races.map(race=>({...race,results:(race.results||[]).map(source=>{
    const {pb,previousBest,performanceHistory,...result}=source;
    result.time=performanceTime(result,race);
    const history={eligible:false,basis:'recorded-history',hasManualBaseline:false,manualBaseline:null,manualBaselineSeconds:null,previousBest:null,previousBestSeconds:null,previousRaceIds:[],previousPersonalBests:[],isPersonalBest:false,isManualPersonalBest:false,confirmedPersonalBests:[],isBestRecorded:false,bestRecorded:null,improvementSeconds:null,reason:null};
    result.performanceHistory=history;
    const date=performanceDate(race,result),comparison=performanceKey(race,result);
    if(!isFinishedResult(result))history.reason='not-finished';
    else if(!date)history.reason='invalid-race-date';
    else if(!comparison.key)history.reason=comparison.reason;
    else{
      history.eligible=true;history.comparisonKey=comparison.key;
      if(!groups.has(comparison.key))groups.set(comparison.key,[]);
      groups.get(comparison.key).push({date,raceId:race.id??null,result,time:result.time,seconds:parsePerformanceTime(result.time)});
    }
    return result;
  })}));
  for(const entries of groups.values()){
    entries.sort((a,b)=>a.date.localeCompare(b.date));
    const absoluteBest=entries.reduce((best,entry)=>entry.seconds<best.seconds?entry:best);
    const manualEntries=entries.filter(entry=>entry.manual);
    const manualBest=manualEntries.reduce((best,entry)=>best===null||entry.seconds<best.seconds?entry:best,null);
    let priorBest=null,priorEntries=[];
    for(let start=0;start<entries.length;){
      let end=start+1;
      while(end<entries.length&&entries[end].date===entries[start].date)end++;
      const sameDay=entries.slice(start,end);
      for(const entry of sameDay){
        if(!entry.result)continue; // A manual baseline is never a race result.
        const history=entry.result.performanceHistory;
        history.hasManualBaseline=manualBest!==null;
        history.basis=manualBest?'manual-and-recorded-history':'recorded-history';
        history.manualBaseline=manualBest?.time??null;
        history.manualBaselineSeconds=manualBest?.seconds??null;
        history.previousBest=priorBest?.time??null;
        history.previousBestSeconds=priorBest?.seconds??null;
        history.previousRaceIds=[...new Set(priorEntries.map(previous=>previous.raceId).filter(Boolean))];
        history.previousPersonalBests=priorEntries.filter(previous=>previous.manual).map(previous=>({...previous.manual}));
        const improved=priorBest!==null&&entry.seconds<priorBest.seconds;
        const meetsManualBaseline=manualBest!==null&&entry.seconds<=manualBest.seconds;
        const meetsPreviousBest=priorBest===null||entry.seconds<=priorBest.seconds;
        history.isPersonalBest=meetsManualBaseline&&meetsPreviousBest;
        history.isManualPersonalBest=history.isPersonalBest&&entry.seconds===manualBest.seconds;
        history.confirmedPersonalBests=history.isManualPersonalBest?manualEntries.filter(candidate=>candidate.seconds===entry.seconds).map(candidate=>({...candidate.manual})):[];
        history.isBestRecorded=entry.seconds===absoluteBest.seconds;
        history.bestRecorded=absoluteBest.time;
        history.improvementSeconds=improved?Math.round((priorBest.seconds-entry.seconds)*1000)/1000:null;
        history.reason=manualBest===null?'no-manual-baseline':!meetsManualBaseline?'slower-than-manual-personal-best':!meetsPreviousBest?'slower-than-previous-best':history.isManualPersonalBest?'matches-manual-personal-best':'improvement-on-manual-personal-best';
      }
      for(const entry of sameDay){
        if(priorBest===null||entry.seconds<priorBest.seconds){priorBest=entry;priorEntries=[entry];}
        else if(entry.seconds===priorBest.seconds)priorEntries.push(entry);
      }
      start=end;
    }
  }
  return output;
}
