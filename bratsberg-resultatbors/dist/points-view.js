import {selectPointsLeaderboard} from './points-leaderboard.js';
import {gradeRaceResult} from './age-grading.js';

const pointsViewEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pointsViewNumber=value=>new Intl.NumberFormat('nb-NO',{minimumFractionDigits:1,maximumFractionDigits:1}).format(value);
const pointsViewDistances=['5 km','10 km','Halvmaraton','Maraton'];
const pointsViewGender=gender=>gender==='K'?'Kvinner':'Menn';
function pointsViewDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
  const date=new Date(value+'T12:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?new Intl.DateTimeFormat('nb-NO',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(date):'';
}
function pointsViewSource(value){
  try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}
}

/** Reference scores use the same calculator as club results, never stored points. */
export function renderPointsReferences(references={},gender=''){
  const year=Number.isInteger(references?.year)?references.year:2026;
  const byDistance=new Map();
  for(const entry of Array.isArray(references?.entries)?references.entries:[]){
    if(entry?.verified!==true||!['K','M'].includes(entry.gender)||!pointsViewDate(entry.date)||entry.date.slice(0,4)!==String(year)||!pointsViewSource(entry.sourceUrl))continue;
    const grade=gradeRaceResult({date:entry.date,type:'road'},{gender:entry.gender,distance:entry.distance,time:entry.time,status:'finished'},{birthYear:entry.birthYear,birthDate:entry.birthDate});
    if(!grade.eligible||!Number.isFinite(grade.score)||grade.score<=0)continue;
    const key=grade.distance+'|'+entry.gender,previous=byDistance.get(key);
    if(!previous||grade.score>previous.grade.score)byDistance.set(key,{entry,grade});
  }
  const genders=['K','M'].includes(gender)?[gender]:['K','M'];
  const checked=pointsViewDate(references?.checkedAt);
  return `<section class="points-national" aria-labelledby="points-national-title"><div class="points-national-heading"><div><p class="points-kicker">NORGE · ${pointsViewEscape(year)}</p><h2 id="points-national-title">Beste norske poengnoteringer</h2><p>Beregnet fra publiserte Kondis-lister.</p></div>${checked?`<span class="points-checked">Kontrollert ${pointsViewEscape(checked)}</span>`:''}</div><div class="points-reference-grid">${pointsViewDistances.map(distance=>`<article class="points-reference-card"><h3>${pointsViewEscape(distance)}</h3>${genders.map(sex=>{
    const item=byDistance.get(distance+'|'+sex);
    if(!item)return `<div class="points-reference-entry points-reference-${sex} is-unlisted"><span class="points-reference-sex">${pointsViewGender(sex)}</span><p>Ikke bekreftet</p></div>`;
    const {entry,grade}=item;
    return `<div class="points-reference-entry points-reference-${sex}"><div class="points-reference-top"><span class="points-reference-sex">${pointsViewGender(sex)}</span><span class="points-reference-score">${pointsViewNumber(grade.score)} <small>poeng</small></span></div><p class="points-reference-name">${pointsViewEscape(entry.name)}</p><p class="points-reference-time">${pointsViewEscape(entry.time)} · ${grade.age} år</p><div class="points-reference-bottom"><time datetime="${pointsViewEscape(entry.date)}">${pointsViewEscape(pointsViewDate(entry.date))}</time><a href="${pointsViewEscape(pointsViewSource(entry.sourceUrl))}" target="_blank" rel="noopener noreferrer" aria-label="Kilde for ${pointsViewEscape(entry.name)}, ${pointsViewEscape(distance)}">Kilde ↗</a></div></div>`;
  }).join('')}</article>`).join('')}</div><p class="points-national-note">${pointsViewEscape(references?.note||'Høyeste beregnede poeng blant de kildebelagte resultatene som er lagt inn. Dette er ingen offisiell rekordliste.')} Alder beregnes med samme metode som i resultatportalen.</p></section>`;
}

export function renderPointsTable(view,{sort='asc'}={}){
  const rows=Array.isArray(view?.rows)?view.rows:[];
  if(!rows.length)return '<div class="points-empty"><h3>Ingen poengnoteringer i dette utvalget</h3><p>Prøv et annet filter, eller legg inn manglende alder i løpsresultatene.</p><a href="#resultater">Åpne løpsresultater ↗</a></div>';
  const best=rows.reduce((current,row)=>row.score>current.score?row:current,rows[0]);
  return `<div class="points-table-scroll" role="region" aria-label="Klubbens poengtabell" tabindex="0"><table class="points-table"><caption class="sr-only">Én beste poengnotering per utøver i valgt utvalg. ${sort==='desc'?'Høyeste poeng først.':'Høyeste poeng nederst.'}</caption><thead><tr><th scope="col">Navn</th><th scope="col" aria-sort="${sort==='desc'?'descending':'ascending'}">Poeng <span aria-hidden="true">${sort==='desc'?'↓':'↑'}</span></th><th scope="col">Tid / distanse</th><th scope="col">Dato</th></tr></thead><tbody>${rows.map(row=>{
    const linked=typeof row.raceId==='string'&&row.raceId.trim();
    const name=linked?`<a href="#lop/${encodeURIComponent(row.raceId)}">${pointsViewEscape(row.name)} <span aria-hidden="true">↗</span></a>`:pointsViewEscape(row.name);
    const local=row.result?.ageGrade?.localOverride===true||row.ageBasis==='local-birth-year';
    const age=Number.isInteger(row.age)?row.age+' år':'';
    const gender=['K','M'].includes(row.gender)?pointsViewGender(row.gender):'';
    return `<tr${row===best?' class="points-best-row"':''}><th scope="row"><span class="points-athlete-name">${name}</span><span class="points-cell-meta">${pointsViewEscape([gender,age].filter(Boolean).join(' · '))}${local?' · alder angitt manuelt':''}</span></th><td class="points-score-cell"><strong>${pointsViewNumber(row.score)}</strong>${row===best?'<span class="points-best-mark">Beste i utvalget</span>':''}</td><td><strong class="points-result-time">${pointsViewEscape(row.time)}</strong><span class="points-cell-meta">${pointsViewEscape(row.distance)}</span></td><td><time datetime="${pointsViewEscape(row.date)}">${pointsViewEscape(pointsViewDate(row.date))}</time><span class="points-cell-meta">${pointsViewEscape(row.raceName)}</span></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

/** Mount once; render() refreshes data while preserving the visitor's filters. */
export function mountPointsView(root,{getRaces,references={}}={}){
  if(!root)return {render(){}};
  let gender='';
  root.innerHTML=`<section class="points-club" aria-labelledby="points-club-title"><div class="points-club-heading"><div><p class="points-kicker">BRATSBERG FRIIDRETT</p><h2 id="points-club-title">Klubbens beste poeng</h2><p>Én beste notering per utøver i utvalget du velger. Samme alders- og kjønnsjusterte poeng som i løpsresultatene.</p></div><div class="points-gender" role="group" aria-label="Velg kjønn i poengoversikten"><button type="button" data-points-gender="" aria-pressed="true" class="active">Alle</button><button type="button" data-points-gender="K" aria-pressed="false">Kvinner</button><button type="button" data-points-gender="M" aria-pressed="false">Menn</button></div></div><aside class="age-grade-guide" aria-labelledby="points-grade-help-title"><div class="age-grade-guide-heading"><div><h3 id="points-grade-help-title">Alders- og kjønnsjusterte poeng</h3><p>Poengene justerer for alder og kjønn. <strong>Høyere poeng er bedre.</strong></p></div><div class="age-grade-formula"><strong>100 poeng ≈ verdensrekordnivå</strong><span>For din alder og ditt kjønn på denne distansen.</span></div></div><details class="age-grade-help"><summary>Slik beregnes poengene</summary><p>Poeng = referansetid ÷ løpstid × 100. Referansetidene bygger på verdensbeste prestasjoner og er tilpasset alder, kjønn og distanse. De er ikke nødvendigvis dagens offisielle rekorder, og poeng over 100 er mulig. Dette er samme beregning som i løpsresultatene.</p></details></aside><div class="points-filters"><label class="points-search"><span>Søk etter løper eller løp</span><input type="search" data-points-query placeholder="Navn eller løp …" autocomplete="off"></label><label><span>Distanse</span><select data-points-distance><option value="">Alle distanser</option></select></label><label><span>År</span><select data-points-year><option value="">Alle år</option></select></label></div><p class="points-summary" data-points-summary role="status"></p><div data-points-table></div><p class="points-coverage" data-points-coverage></p></section><div data-points-national></div>`;
  const query=root.querySelector('[data-points-query]'),distance=root.querySelector('[data-points-distance]'),year=root.querySelector('[data-points-year]');
  function setOptions(control,values,label){
    const selected=control.value;
    control.innerHTML=`<option value="">${label}</option>`+values.map(value=>`<option value="${pointsViewEscape(value)}">${pointsViewEscape(value)}</option>`).join('');
    control.value=values.includes(selected)?selected:'';
  }
  function render(){
    const races=typeof getRaces==='function'?getRaces():[];
    const actual=Array.isArray(races)?races.filter(race=>race&&race.demo!==true):[];
    setOptions(distance,[...new Set(actual.flatMap(race=>(race.results||[]).map(result=>result.distance)).filter(value=>typeof value==='string'&&value))].sort((a,b)=>a.localeCompare(b,'nb-NO',{numeric:true})),'Alle distanser');
    setOptions(year,[...new Set(actual.map(race=>String(race.date||'').slice(0,4)).filter(value=>/^\d{4}$/.test(value)))].sort().reverse(),'Alle år');
    const view=selectPointsLeaderboard(actual,{gender,distance:distance.value,year:year.value,query:query.value,sort:'desc'});
    root.querySelector('[data-points-national]').innerHTML=renderPointsReferences(references,gender);
    root.querySelector('[data-points-table]').innerHTML=renderPointsTable(view,{sort:'desc'});
    root.querySelector('[data-points-summary]').textContent=`${view.athleteCount} ${view.athleteCount===1?'utøver':'utøvere'} · ${view.eligibleResults} ${view.eligibleResults===1?'poengberegnet resultat':'poengberegnede resultater'} · Høyeste poeng øverst`;
    const notes=[];
    if(view.missingAgeResults)notes.push(`${view.missingAgeResults} ${view.missingAgeResults===1?'resultat mangler':'resultater mangler'} gyldig alder.`);
    if(view.unsupportedResults)notes.push(`${view.unsupportedResults} ${view.unsupportedResults===1?'resultat har':'resultater har'} ikke grunnlag for poengberegning.`);
    notes.push('Poengene vises med én desimal, men sorteres før avrunding.');
    const local=view.rows.some(row=>row.result?.ageGrade?.localOverride===true||row.ageBasis==='local-birth-year');
    if(local)notes.push('Manuelt angitt alder i denne nettleseren er med i beregningen.');
    root.querySelector('[data-points-coverage]').innerHTML=pointsViewEscape(notes.join(' '))+(view.missingAgeResults?' <a href="#resultater">Legg inn alder i løpsresultatene ↗</a>':'');
  }
  root.addEventListener('click',event=>{
    const button=event.target?.closest?.('[data-points-gender]');
    if(!button||!root.contains(button))return;
    gender=['K','M'].includes(button.dataset.pointsGender)?button.dataset.pointsGender:'';
    root.querySelectorAll('[data-points-gender]').forEach(control=>{const active=control.dataset.pointsGender===gender;control.setAttribute('aria-pressed',String(active));control.classList.toggle('active',active);});
    render();
  });
  query.addEventListener('input',render);
  [distance,year].forEach(control=>control.addEventListener('change',render));
  render();
  return {render};
}
