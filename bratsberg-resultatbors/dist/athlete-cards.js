import {displayTime} from './display-format.js';
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
  if(['heat','round','qualifying'].includes(result.positionScope))return null;
  if(result.positionGenderVerified===false)return null;
  const valid=value=>Number.isInteger(value)&&value>0;
  if(result.positionGenderVerified===true&&valid(result.positionGender))return result.positionGender;
  return result.positionScope==='gender'&&valid(result.position)?result.position:null;
}

/** Class podiums require an explicit championship award and verified class rank. */
export function awardPosition(result){
  if(['heat','round','qualifying'].includes(result.positionScope))return null;
  if(result.awardScope==='championship-class'){
    return result.positionClassVerified===true&&Number.isInteger(result.positionClass)&&result.positionClass>0&&typeof result.category==='string'&&result.category.trim()?result.positionClass:null;
  }
  const gender=result.gender||result.category?.[0];
  return ['K','M'].includes(gender)?genderPosition(result):null;
}

/** Optional track context; source round labels never determine medals. */
function athleteResultContext(result){
  const round=typeof result.roundLabel==='string'?result.roundLabel.trim():'';
  let date='';
  if(typeof result.date==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(result.date)){
    const parsed=new Date(result.date+'T12:00:00Z');
    if(Number.isFinite(parsed.getTime())&&parsed.toISOString().slice(0,10)===result.date){
      const label=new Intl.DateTimeFormat('nb-NO',{day:'numeric',month:'long',timeZone:'UTC'}).format(parsed);
      date=`<time datetime="${esc(result.date)}">${esc(label)}</time>`;
    }
  }
  return date||round?`<p class="athlete-card-round">${date}${date&&round?' · ':''}${esc(round)}</p>`:'';
}

/** Decorative icon: the adjacent text supplies the accessible award name. */
export function renderAwardIcon(kind='medal'){
  const path=kind==='trophy'?'<path d="M8 3h8v5c0 4-2 6-4 6s-4-2-4-6V3Z"/><path d="M8 5H4v2c0 3 2 5 5 5m7-7h4v2c0 3-2 5-5 5M12 14v5m-4 2h8m-7-2h6"/>':'<path d="m8 3 4 6 4-6M5 3h4m6 0h4"/><circle cx="12" cy="15" r="6"/><path d="m12 11 1.2 2.4 2.7.4-2 1.9.5 2.7-2.4-1.3-2.4 1.3.5-2.7-2-1.9 2.7-.4Z"/>';
  return `<svg class="award-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${path}</svg>`;
}

/** WA result points use the event's gender table and never an age adjustment. */
function renderWaScore(result){
  const grade=result.waScore;
  const sourceGender=result.gender??result.category?.[0];
  const gender=sourceGender==='male'?'M':sourceGender==='female'?'K':sourceGender;
  const matchesGender=['M','K'].includes(gender)&&grade?.gender===gender;
  const available=grade?.eligible===true&&matchesGender&&Number.isInteger(grade.score)&&grade.score>0;
  const genderLabel=gender==='K'?'kvinner':'menn';
  const notes={
    'unsupported-discipline':'WA-poeng er ikke tilgjengelige for denne typen løp.',
    'unsupported-environment':'Denne baneøvelsen støttes ikke av de innlagte WA-tabellene.',
    'unsupported-distance':'Øvelsen finnes ikke i de innlagte WA-tabellene.',
    'unsupported-gender':'Kjønn må være kjent for å velge riktig WA-tabell.',
    'above-table-range':'Tiden ligger utenfor poengområdet i den publiserte WA-tabellen.',
    'below-table-range':'Tiden ligger utenfor poengområdet i den publiserte WA-tabellen.'
  };
  const note=available?`World Athletics-poeng fra tabellen for ${genderLabel} på denne øvelsen. Alder påvirker ikke poengene.`:grade?.eligible&&!matchesGender?notes['unsupported-gender']:notes[grade?.reason]||'WA-poeng er ikke beregnet for dette resultatet.';
  return `<div class="athlete-wa-score${available?'':' is-unavailable'}" title="${esc(note)}"><span>WA-poeng</span><strong>${available?grade.score:'—'}</strong></div>`;
}

export function renderAthleteCard(result,portraits={}, {compact=false,showWaScore=false,raceType}={}) {
  const photo=portraits[result.athleteId],status=resultStatus(result),finished=status==='finished';
  const statusLabel=status==='DNS'?'Ikke startet':status==='DNF'?'Brutt':status==='DSQ'?'Diskvalifisert':'Tid mangler';
  const gender=result.gender||result.category?.[0],position=finished?awardPosition(result):null;
  const genderLabel=gender==='K'?'kvinner':'menn';
  const championshipClass=result.awardScope==='championship-class'&&position!==null;
  const placementLabel=championshipClass?result.category.trim():genderLabel;
  const placementTitle=championshipClass?`Plassering i mesterskapsklassen ${placementLabel} på distansen`:`Plassering blant ${genderLabel} på distansen`;
  const medal=position===1?'gold':position===2?'silver':position===3?'bronze':null;
  const category=typeof result.category==='string'&&/^(?:[KMGJ]\d|(?:[KM]\s*)?U\d)/.test(result.category)?result.category:'';
  const isPersonalBest=result.performanceHistory?.isPersonalBest===true;
  const roundMarkup=athleteResultContext(result);
  const medalLabel={gold:'Gull',silver:'Sølv',bronze:'Bronse'}[medal];
  const rankMarkup=position!==null?`<span class="athlete-card-position${medal?' award-medal medal-'+medal:''}" title="${esc(placementTitle)}">${medal?renderAwardIcon()+`<span class="sr-only">${medalLabel}: </span>`:''}Nr. ${position} ${esc(placementLabel)}</span>`:'';
  return `<article data-athlete-id="${esc(result.athleteId||'')}" class="athlete-card${compact?' compact':''}${!finished?' is-unfinished':result.clubRecord?' is-record':isPersonalBest?' is-pb':''}${medal?' podium-'+medal:''}"><div class="athlete-card-portrait" aria-hidden="true"><span>${esc(initials(result.name))}</span>${renderPortraitImage(photo,{width:96,height:120})}</div><div class="athlete-card-content"><div class="athlete-card-top"><span class="athlete-card-distance">${esc(result.distance)}</span>${rankMarkup}</div>${roundMarkup}<h4>${esc(result.name)}</h4><p class="athlete-card-time${finished?'':' athlete-card-status'}">${finished?esc(displayTime(result.time,result.measuredTime,raceType)):status==='unknown'?'—':status}</p><div class="athlete-card-bottom"><span class="athlete-card-badges">${finished?badges(result,raceType):`<span class="athlete-status-label">${statusLabel}</span>`}</span>${category?`<span class="athlete-card-category" title="Aldersklasse">${esc(category)}</span>`:''}</div>${showWaScore&&finished?renderWaScore(result):''}</div></article>`;
}

export function installPortraitFallback(root=document){
  installPortraitErrors(root);
}
