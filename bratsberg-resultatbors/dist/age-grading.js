import {AGE_GRADE_TABLES,AGE_GRADING_INFO} from './age-standards.js';
import {parsePerformanceTime,normalizeDistance} from './record-check.js';
import {isFinishedResult,performanceTime} from './performance-history.js';

const ageGradeDistances=Object.freeze([
  {key:'5km',label:'5 km'},
  {key:'10km',label:'10 km'},
  {key:'half',label:'Halvmaraton'},
  {key:'marathon',label:'Maraton'}
]);
const validGradeAge=age=>Number.isInteger(age)&&age>=AGE_GRADING_INFO.minAge&&age<=AGE_GRADING_INFO.maxAge;
const failedGrade=(reason,extra={})=>({eligible:false,score:null,ratio:null,standardSeconds:null,actualSeconds:null,age:null,gender:null,distance:null,equivalentTimes:[],method:AGE_GRADING_INFO.method,reason,...extra});

function gradeDistance(value){
  if(typeof value!=='string')return null;
  const alias=value.trim().toLowerCase().replace(/\s+/g,'');
  return ({'5k':'5km','10k':'10km','hm':'half','m':'marathon'})[alias]??normalizeDistance(value,'road');
}

/** Match Kjapp's displayed equivalents: truncate each time to whole seconds. */
function gradeEquivalentTime(seconds){
  const whole=Math.floor(seconds),hours=Math.floor(whole/3600),minutes=Math.floor(whole%3600/60),remainder=whole%60;
  return hours+':'+String(minutes).padStart(2,'0')+':'+String(remainder).padStart(2,'0');
}

/**
 * Kjapp uses standard(age, sex, distance) / elapsed time as its grade ratio.
 * We expose 100 × ratio as points. 100 points means the table standard, and
 * performances exceeding the standard may score above 100; never clamp them.
 * This exact snapshot supports road 5 km, 10 km, half marathon and marathon.
 */
export function calculateAgeGrade({age,gender,distance,time,type='road'}={}){
  if(type!=='road')return failedGrade('unsupported-discipline');
  const key=gradeDistance(distance),index=ageGradeDistances.findIndex(entry=>entry.key===key);
  if(index<0)return failedGrade('unsupported-distance');
  const canonicalGender=gender==='male'?'M':gender==='female'?'K':gender;
  if(!['K','M'].includes(canonicalGender))return failedGrade('unsupported-gender');
  if(age===undefined||age===null)return failedGrade('missing-age');
  if(!Number.isInteger(age))return failedGrade('invalid-age');
  if(!validGradeAge(age))return failedGrade('age-out-of-range');
  const seconds=parsePerformanceTime(time);
  if(seconds===null)return failedGrade('invalid-time');
  const standards=AGE_GRADE_TABLES[canonicalGender][age-AGE_GRADING_INFO.minAge];
  const standardSeconds=standards[index],ratio=standardSeconds/seconds;
  return {eligible:true,score:100*ratio,ratio,standardSeconds,actualSeconds:seconds,age,gender:canonicalGender,distance:ageGradeDistances[index].label,
    equivalentTimes:ageGradeDistances.map((entry,i)=>({distance:entry.label,seconds:standards[i]/ratio,time:gradeEquivalentTime(standards[i]/ratio)})),
    method:AGE_GRADING_INFO.method,reason:null};
}

function gradeDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return null;
  const stamp=Date.parse(value+'T12:00:00Z');
  if(!Number.isFinite(stamp)||new Date(stamp).toISOString().slice(0,10)!==value)return null;
  const [year,month,day]=value.split('-').map(Number);
  return {year,month,day};
}

const ageResolution=(age,basis)=>validGradeAge(age)?{age,basis,reason:null}:{age:null,basis,reason:'age-out-of-range'};

/**
 * Resolve only supplied age data. Category brackets never imply an exact age.
 * Explicit result.age is age at that race. birthDate gives completed years on
 * race day. With birthYear only, use age reached in the race's calendar year
 * and expose basis='birth-year' so the UI can make that convention visible.
 * A malformed supplied value is rejected rather than masked by a fallback.
 */
export function resolveRaceAge(race={},result={},athlete={}){
  if(result.age!==undefined&&result.age!==null){
    if(!Number.isInteger(result.age))return {age:null,basis:'result-age',reason:'invalid-age'};
    return ageResolution(result.age,'result-age');
  }
  const birthDate=result.birthDate??athlete?.birthDate;
  const birthYear=result.birthYear??athlete?.birthYear;
  if(birthDate==null&&birthYear==null)return {age:null,basis:null,reason:'missing-age'};
  const when=gradeDate(race.date);
  if(!when)return {age:null,basis:null,reason:'invalid-race-date'};
  if(birthDate!==undefined&&birthDate!==null){
    const born=gradeDate(birthDate);
    if(!born)return {age:null,basis:'birth-date',reason:'invalid-birth-date'};
    const birthdayPassed=when.month>born.month||when.month===born.month&&when.day>=born.day;
    return ageResolution(when.year-born.year-(birthdayPassed?0:1),'birth-date');
  }
  if(!Number.isInteger(birthYear))return {age:null,basis:'birth-year',reason:'invalid-birth-year'};
  return ageResolution(when.year-birthYear,'birth-year');
}

/** Compute a display-only grade after profile resolution; source rows stay intact. */
export function gradeRaceResult(race={},result={},athlete={}){
  if(race.demo===true||result.demo===true||athlete?.kind==='demo')return failedGrade('demo');
  const time=performanceTime(result,race);
  if(!isFinishedResult({...result,time}))return failedGrade('not-finished');
  // Report unsupported events before missing age: no age can grade this trail.
  if(race.type!=='road')return failedGrade('unsupported-discipline');
  if(!gradeDistance(result.distance))return failedGrade('unsupported-distance');
  const resolvedAge=resolveRaceAge(race,result,athlete);
  if(resolvedAge.age===null)return failedGrade(resolvedAge.reason,{ageBasis:resolvedAge.basis});
  const grade=calculateAgeGrade({age:resolvedAge.age,gender:result.gender??result.category?.[0],distance:result.distance,time,type:race.type});
  return {...grade,ageBasis:resolvedAge.basis};
}
