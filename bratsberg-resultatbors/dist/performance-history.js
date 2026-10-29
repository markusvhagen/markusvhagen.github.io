import {parsePerformanceTime,normalizeDistance} from './record-check.js';

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

/** Course identity is required before comparing trail performances. */
function performanceKey(race,result){
  const athleteId=typeof result.athleteId==='string'?result.athleteId.trim():'';
  if(!athleteId)return {reason:'missing-athlete-id'};
  let discipline,category;
  if(race.type==='road'){
    category='road';discipline=normalizeDistance(result.distance,'road');
  }else if(race.type==='track'&&race.environment==='outdoor'){
    category='track-outdoor';discipline=normalizeDistance(result.distance,'track');
  }else if(race.type==='trail'){
    const courseId=result.courseId??race.courseId;
    if(typeof courseId!=='string'||!courseId.trim())return {reason:'trail-course-not-specified'};
    category='trail:'+courseId.trim();
    discipline=normalizeDistance(result.distance,'road')??(typeof result.distance==='string'?result.distance.normalize('NFC').toLocaleLowerCase('nb-NO').replace(/\s+/g,'').trim():null);
  }else return {reason:'unsupported-discipline'};
  if(!discipline)return {reason:'unsupported-distance'};
  return {key:JSON.stringify([athleteId,category,discipline])};
}

/** Validate manually registered performances without inventing missing dates. */
export function collectManualPersonalBests(registryData){
  const athletes=Array.isArray(registryData)?registryData:registryData?.athletes;
  const entries=[],issues=[];
  if(!Array.isArray(athletes))return {entries,issues};
  for(const athlete of athletes){
    if(!athlete||athlete.kind==='demo'||athlete.demo===true)continue;
    if(athlete.personalBests===undefined)continue;
    const athleteId=typeof athlete.id==='string'?athlete.id.trim():'';
    if(!Array.isArray(athlete.personalBests)){
      issues.push({athleteId,index:null,reason:'personal-bests-not-array'});continue;
    }
    athlete.personalBests.forEach((pb,index)=>{
      const issue=reason=>issues.push({athleteId,index,reason});
      if(!pb||typeof pb!=='object'||Array.isArray(pb)){issue('invalid-personal-best');return;}
      const achievedDate=historyDate(pb.date);
      // An undated PB is known by asOf, never assumed to predate older races.
      // A malformed supplied date remains invalid even if asOf is valid.
      const date=pb.date==null?historyDate(pb.asOf):achievedDate;
      const seconds=parsePerformanceTime(pb.time);
      const comparison=performanceKey(pb,{...pb,athleteId});
      if(!athleteId){issue('missing-athlete-id');return;}
      if(!date){issue('invalid-personal-best-date');return;}
      if(!isFinishedResult(pb)){issue('invalid-personal-best-time-or-status');return;}
      if(!comparison.key){issue(comparison.reason);return;}
      if(pb.demo===true){issue('demo');return;}
      const manual={athleteId,index,date:achievedDate,...(!achievedDate?{asOf:date}:{}),time:pb.time,type:pb.type,distance:pb.distance};
      for(const key of ['environment','courseId','eventName','source','sourceUrl']){
        if(typeof pb[key]==='string')manual[key]=pb[key];
      }
      entries.push({key:comparison.key,date,time:pb.time,seconds,raceId:null,manual});
    });
  }
  return {entries,issues};
}

/**
 * Recalculate from the archive and dated manual PBs without changing sources.
 * A PB means a strict improvement on a comparable result on an earlier date;
 * it is a best in the registered history, not proof of a lifetime best.
 * Same-day results are evaluated together because start order is unknown.
 * isBestRecorded describes the current archive; isPersonalBest describes the
 * event on its original date and therefore survives later improvements.
 */
export function derivePerformanceHistory(races,registryData=null){
  if(!Array.isArray(races))return [];
  const groups=new Map();
  for(const entry of collectManualPersonalBests(registryData).entries){
    if(!groups.has(entry.key))groups.set(entry.key,[]);
    groups.get(entry.key).push(entry);
  }
  const output=races.map(race=>({...race,results:(race.results||[]).map(source=>{
    const {pb,previousBest,performanceHistory,...result}=source;
    result.time=performanceTime(result,race);
    const history={eligible:false,basis:'recorded-history',hasManualBaseline:false,previousBest:null,previousBestSeconds:null,previousRaceIds:[],previousPersonalBests:[],isPersonalBest:false,isBestRecorded:false,bestRecorded:null,improvementSeconds:null,reason:null};
    result.performanceHistory=history;
    const date=historyDate(race.date),comparison=performanceKey(race,result);
    if(race.demo===true||result.demo===true)history.reason='demo';
    else if(!isFinishedResult(result))history.reason='not-finished';
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
    let priorBest=null,priorEntries=[],hasManualBaseline=false;
    for(let start=0;start<entries.length;){
      let end=start+1;
      while(end<entries.length&&entries[end].date===entries[start].date)end++;
      const sameDay=entries.slice(start,end);
      for(const entry of sameDay){
        if(!entry.result)continue; // A manual baseline is never a race result.
        const history=entry.result.performanceHistory;
        history.hasManualBaseline=hasManualBaseline;
        history.basis=hasManualBaseline?'manual-and-recorded-history':'recorded-history';
        history.previousBest=priorBest?.time??null;
        history.previousBestSeconds=priorBest?.seconds??null;
        history.previousRaceIds=[...new Set(priorEntries.map(previous=>previous.raceId).filter(Boolean))];
        history.previousPersonalBests=priorEntries.filter(previous=>previous.manual).map(previous=>({...previous.manual}));
        history.isPersonalBest=priorBest!==null&&entry.seconds<priorBest.seconds;
        history.isBestRecorded=entry.seconds===absoluteBest.seconds;
        history.bestRecorded=absoluteBest.time;
        history.improvementSeconds=history.isPersonalBest?Math.round((priorBest.seconds-entry.seconds)*1000)/1000:null;
        history.reason=priorBest===null?'first-recorded-result':history.isPersonalBest?'improvement':entry.seconds===priorBest.seconds?'equal-previous-best':'slower-than-previous-best';
      }
      for(const entry of sameDay){
        if(entry.manual)hasManualBaseline=true;
        if(priorBest===null||entry.seconds<priorBest.seconds){priorBest=entry;priorEntries=[entry];}
        else if(entry.seconds===priorBest.seconds)priorEntries.push(entry);
      }
      start=end;
    }
  }
  return output;
}
