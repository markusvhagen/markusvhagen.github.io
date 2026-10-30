import {compareResultTimes} from './result-order.js';

const ageUiEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const ageUiStorageKey='bratsberg-birth-year-overrides-v1';
const ageUiValidYear=year=>Number.isInteger(year)&&year>=1900&&year<=2100;
const ageUiValidId=id=>typeof id==='string'&&/^[a-z0-9][a-z0-9-]{0,159}$/.test(id)&&!['constructor','prototype','__proto__'].includes(id);
const ageUiScore=result=>result?.ageGrade?.eligible===true&&Number.isFinite(result.ageGrade.score)&&result.ageGrade.score>0?result.ageGrade.score:null;

/** Higher scores first. Missing grades stay after scored results; ties use time. */
export function compareAgeGradeResults(a,b){
  const first=ageUiScore(a),second=ageUiScore(b);
  if(first!==null&&second!==null&&first!==second)return second-first;
  if(first!==null&&second===null)return -1;
  if(first===null&&second!==null)return 1;
  return compareResultTimes(a,b);
}

/** Birth-year grading uses age reached in the race's calendar year, ages 5–100. */
export function validateBirthYear(year,raceYear){
  return ageUiValidYear(year)&&Number.isInteger(raceYear)&&raceYear>=1900&&raceYear<=2200&&raceYear-year>=5&&raceYear-year<=100;
}

function ageUiCleanOverrides(value){
  const clean=Object.create(null);
  if(!value||typeof value!=='object'||Array.isArray(value))return clean;
  for(const [id,year] of Object.entries(value)){
    if(ageUiValidId(id)&&ageUiValidYear(year))clean[id]=year;
  }
  return clean;
}

/** Browser-local settings are optional; blocked storage must never break results. */
export function readBirthYearOverrides(storage){
  try{
    const target=storage===undefined?globalThis.localStorage:storage;
    return ageUiCleanOverrides(JSON.parse(target.getItem(ageUiStorageKey)));
  }catch{return Object.create(null);}
}

export function writeBirthYearOverrides(overrides,storage){
  try{
    const target=storage===undefined?globalThis.localStorage:storage;
    target.setItem(ageUiStorageKey,JSON.stringify(ageUiCleanOverrides(overrides)));
    return true;
  }catch{return false;}
}

/** A small score row for portal result cards. Never infer age from a class. */
export function renderAgeGrade(result,{athleteId=result?.athleteId}={}){
  const grade=result?.ageGrade,score=ageUiScore(result);
  const unsupported=['unsupported-discipline','unsupported-distance','unsupported-gender','invalid-time','not-finished','demo'].includes(grade?.reason);
  if(unsupported){
    const note=grade.reason==='unsupported-discipline'?'Kjapp-tabellen gjelder gateløp, ikke bane eller terreng.':grade.reason==='unsupported-distance'?'Denne distansen finnes ikke i Kjapp-tabellen.':'Resultatet har ikke grunnlag for alders- og kjønnsjusterte poeng.';
    return `<div class="age-grade-row is-unavailable"><span class="age-grade-unavailable" title="${ageUiEscape(note)}">Ikke beregnet</span></div>`;
  }
  const knownAge=Number.isInteger(grade?.age)&&grade.age>=5&&grade.age<=100;
  const basis=grade?.ageBasis==='birth-year'?'Alder i løpsåret, beregnet fra fødselsår.':grade?.ageBasis==='birth-date'?'Alder på løpsdagen, beregnet fra fødselsdato.':grade?.ageBasis==='local-birth-year'?'Alder i løpsåret, fra fødselsår angitt i denne nettleseren.':'Alder oppgitt for dette løpet.';
  const title=score!==null?`100 poeng tilsvarer omtrent verdensrekordnivå for alder, kjønn og distanse. Vi bruker referansetiden i Kjapp-tabellen, som ikke nødvendigvis er lik dagens offisielle rekord.${knownAge?' '+grade.age+' år. '+basis:''}`:'Legg inn fødselsår for å beregne alders- og kjønnsjusterte poeng. Aldersklassen brukes ikke som en nøyaktig alder.';
  const scoreText=score===null?'—':new Intl.NumberFormat('nb-NO',{minimumFractionDigits:1,maximumFractionDigits:1}).format(score);
  const button=typeof athleteId==='string'&&athleteId.trim()?`<button class="age-grade-edit" type="button" data-edit-birth-year="${ageUiEscape(athleteId)}" aria-haspopup="dialog" title="Rediger fødselsår">${score!==null&&knownAge?ageUiEscape(grade.age)+' år':'Legg inn alder'}</button>`:'';
  return `<div class="age-grade-row${score===null?' is-missing-age':''}"><span class="age-grade-score" title="${ageUiEscape(title)}"><span class="sr-only">Alders- og kjønnsjustert resultat: </span><strong>${ageUiEscape(scoreText)}</strong> poeng</span>${button}</div>`;
}
