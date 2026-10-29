import {esc,initials,badges} from './data.js';
import {parsePerformanceTime} from './record-check.js';
import {renderPortraitImage,installPortraitErrors} from './portrait.js';

export function resultStatus(result){
  const status=String(result.status||'').toUpperCase();
  if(status==='DNS'||status==='DNF')return status;
  if(['DSQ','DQ','DISQUALIFIED'].includes(status))return 'DSQ';
  return parsePerformanceTime(result.time)!==null?'finished':'unknown';
}

/** Overall and age-class placings never imply a gender podium. */
export function genderPosition(result){
  if(result.positionGenderVerified===false)return null;
  const valid=value=>Number.isInteger(value)&&value>0;
  if(result.positionGenderVerified===true&&valid(result.positionGender))return result.positionGender;
  return result.positionScope==='gender'&&valid(result.position)?result.position:null;
}

/** Decorative icon: the adjacent text supplies the accessible award name. */
export function renderAwardIcon(kind='medal'){
  const path=kind==='trophy'?'<path d="M8 3h8v5c0 4-2 6-4 6s-4-2-4-6V3Z"/><path d="M8 5H4v2c0 3 2 5 5 5m7-7h4v2c0 3-2 5-5 5M12 14v5m-4 2h8m-7-2h6"/>':'<path d="m8 3 4 6 4-6M5 3h4m6 0h4"/><circle cx="12" cy="15" r="6"/><path d="m12 11 1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4Z"/>';
  return `<svg class="award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

export function renderAthleteCard(result,portraits={}, {compact=false}={}) {
  const photo=portraits[result.athleteId],status=resultStatus(result),finished=status==='finished';
  const statusLabel=status==='DNS'?'Ikke startet':status==='DNF'?'Brutt':status==='DSQ'?'Diskvalifisert':'Tid mangler';
  const gender=result.gender||result.category?.[0],position=finished&&['K','M'].includes(gender)?genderPosition(result):null;
  const genderLabel=gender==='K'?'kvinner':'menn';
  const medal=position===1?'gold':position===2?'silver':position===3?'bronze':null;
  const category=typeof result.category==='string'&&/^[KM]\d/.test(result.category)?result.category:'';
  const isPersonalBest=result.performanceHistory?.isPersonalBest===true;
  const previous=parsePerformanceTime(result.performanceHistory?.previousBest),current=parsePerformanceTime(result.time);
  const delta=previous!==null&&current!==null?Math.round((previous-current)*100)/100:0;
  const improvement=isPersonalBest&&delta>0?`−${delta>=60?Math.floor(delta/60)+' min ':''}${delta%60?Number((delta%60).toFixed(2)).toLocaleString('nb-NO')+' s':''}`:'';
  const improvementTitle='Forbedring fra beste kjente tid før dette løpet';
  const medalLabel={gold:'Gull',silver:'Sølv',bronze:'Bronse'}[medal];
  const rankMarkup=position!==null?`<span class="athlete-card-position${medal?' award-medal medal-'+medal:''}" title="Plassering blant ${genderLabel} på distansen">${medal?renderAwardIcon()+`<span class="sr-only">${medalLabel}: </span>`:''}Nr. ${position} ${genderLabel}</span>`:'';
  return `<article class="athlete-card${compact?' compact':''}${!finished?' is-unfinished':result.clubRecord?' is-record':isPersonalBest?' is-pb':''}${medal?' podium-'+medal:''}"><div class="athlete-card-portrait" aria-hidden="true"><span>${esc(initials(result.name))}</span>${renderPortraitImage(photo,{width:96,height:120})}</div><div class="athlete-card-content"><div class="athlete-card-top"><span class="athlete-card-distance">${esc(result.distance)}</span>${rankMarkup}</div><h4>${esc(result.name)}</h4><p class="athlete-card-time${finished?'':' athlete-card-status'}">${finished?esc(result.time):status==='unknown'?'—':status}</p><div class="athlete-card-bottom"><span class="athlete-card-badges">${finished?badges(result):`<span class="athlete-status-label">${statusLabel}</span>`}</span>${finished&&improvement?`<span class="athlete-card-improvement" title="${improvementTitle}">${esc(improvement)}</span>`:category?`<span class="athlete-card-category">${esc(category)}</span>`:''}</div></div></article>`;
}

export function installPortraitFallback(root=document){
  installPortraitErrors(root);
}
