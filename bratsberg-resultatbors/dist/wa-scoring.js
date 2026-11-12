import {WA_SCORING_TABLES,WA_SCORING_INFO} from './wa-scoring-tables.js';
import {parsePerformanceTime,normalizeDistance} from './record-check.js';
import {isFinishedResult,performanceTime} from './performance-history.js';

const waFailed=(reason,extra={})=>({eligible:false,score:null,event:null,gender:null,actualSeconds:null,scoringSeconds:null,edition:WA_SCORING_INFO.edition,method:WA_SCORING_INFO.method,reason,...extra});

function waEvent(distance,type){
  if(typeof distance!=='string')return null;
  const alias=distance.trim().toLowerCase().replace(/\s+/g,'');
  return type==='road'?({'5k':'5km','10k':'10km','hm':'half','m':'marathon'}[alias]??normalizeDistance(distance,type)):normalizeDistance(distance,type);
}

/**
 * Match the table precision without ever truncating a measured result.
 * Decimal-string handling avoids floating-point promotion at exact boundaries.
 * Road results use full seconds, track results hundredths. A longer fractional
 * tail is moved up to the next scoring unit, never rounded to a faster time.
 */
function waScoringCentiseconds(time,type){
  const precision=type==='road'?0:2;
  const [whole,fraction='']=time.trim().replace(',','.').split('.');
  const seconds=whole.split(':').reduce((total,field)=>total*60+Number(field),0);
  const units=seconds*10**precision+Number(fraction.slice(0,precision).padEnd(precision,'0'))+(/[1-9]/.test(fraction.slice(precision))?1:0);
  return units*(precision===0?100:1);
}

/**
 * Exact lookup in the 2025 revised World Athletics scoring tables.
 * This is a result-only table comparison, not a World Rankings performance
 * score (which can include placing points and course deductions).
 * Age never enters this calculation. No formula fitting or interpolation.
 */
export function gradeWaResult(race={},result={}){
  const time=performanceTime(result,race);
  if(!isFinishedResult({...result,time}))return waFailed('not-finished');
  const type=race.type;
  if(!['road','track'].includes(type))return waFailed('unsupported-discipline');
  if(type==='track'&&race.environment!=='outdoor')return waFailed('unsupported-environment');
  const genderValue=result.gender??result.category?.[0];
  const gender=genderValue==='male'?'M':genderValue==='female'?'K':genderValue;
  if(!['M','K'].includes(gender))return waFailed('unsupported-gender');
  const event=waEvent(result.distance,type),table=WA_SCORING_TABLES[gender][type][event];
  if(!table)return waFailed('unsupported-distance',{gender});
  const actualSeconds=parsePerformanceTime(time),centiseconds=waScoringCentiseconds(time,type);
  const context={event,gender,actualSeconds,scoringSeconds:centiseconds/100};
  if(centiseconds<table[0][0])return waFailed('above-table-range',context);
  if(centiseconds>table[table.length-1][0])return waFailed('below-table-range',context);
  // First published threshold at least as slow as this performance. For a
  // result between two rows, WA requires the lower (slower row's) score.
  let low=0,high=table.length-1;
  while(low<high){
    const middle=Math.floor((low+high)/2);
    if(table[middle][0]<centiseconds)low=middle+1;
    else high=middle;
  }
  return {eligible:true,score:table[low][1],...context,edition:WA_SCORING_INFO.edition,method:WA_SCORING_INFO.method,reason:null};
}
