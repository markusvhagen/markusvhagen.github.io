import {displayTime,displayPoints} from './display-format.js';
import {selectPointsLeaderboard} from './points-leaderboard.js';
import {gradeRaceResult} from './age-grading.js';
import {gradeWaResult} from './wa-scoring.js';

const pointsViewEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const pointsViewDistances=['5 km','10 km','Halvmaraton','Maraton'];
const pointsViewGender=gender=>gender==='K'?'Kvinner':'Menn';
const pointsViewHasScore=value=>typeof value==='number'&&Number.isFinite(value);
const pointsViewMissingAge=new Set(['missing-age','invalid-age','age-out-of-range','invalid-birth-date','invalid-birth-year']);
function pointsViewDate(value){
  if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value))return '';
  const date=new Date(value+'T12:00:00Z');
  return Number.isFinite(date.getTime())&&date.toISOString().slice(0,10)===value?new Intl.DateTimeFormat('nb-NO',{day:'2-digit',month:'2-digit',year:'numeric',timeZone:'UTC'}).format(date):'';
}
function pointsViewSource(value){
  try{const url=new URL(value);return url.protocol==='https:'&&!url.username&&!url.password?url.href:'';}catch{return '';}
}
function pointsViewScores({waScore,ageScore,ageReason,waReason}){
  const waMissing=['above-table-range','below-table-range'].includes(waReason)?'Utenfor tabellen':'Ikke beregnet';
  const ageMissing=pointsViewMissingAge.has(ageReason)?'Mangler gyldig alder':'Ikke beregnet';
  return `<div class="points-score-pair"><span class="points-score points-score-wa is-ranked"><span class="points-score-label">WA-poeng</span><strong>${pointsViewHasScore(waScore)?Math.trunc(waScore):'—'}</strong>${pointsViewHasScore(waScore)?'':`<span class="points-score-note">${waMissing}</span>`}</span><span class="points-score points-score-age"><span class="points-score-label">Aldersjustert</span><strong>${pointsViewHasScore(ageScore)?displayPoints(ageScore):'—'}</strong>${pointsViewHasScore(ageScore)?'':`<span class="points-score-note">${ageMissing}</span>`}</span></div>`;
}

/** Source-backed national references use the highest WA score per event and sex. */
export function renderPointsReferences(references={},gender=''){
  const year=Number.isInteger(references?.year)?references.year:2026;
  const byDistance=new Map();
  for(const entry of Array.isArray(references?.entries)?references.entries:[]){
    if(entry?.verified!==true||!['K','M'].includes(entry.gender)||!pointsViewDate(entry.date)||entry.date.slice(0,4)!==String(year)||!pointsViewSource(entry.sourceUrl))continue;
    const race={date:entry.date,type:'road'},result={gender:entry.gender,distance:entry.distance,time:entry.time,status:'finished'};
    const waGrade=gradeWaResult(race,result);
    if(!waGrade.eligible||!Number.isInteger(waGrade.score)||waGrade.score<=0)continue;
    const grade=gradeRaceResult(race,result,{birthYear:entry.birthYear,birthDate:entry.birthDate});
    const distance=({'5km':'5 km','10km':'10 km','half':'Halvmaraton','marathon':'Maraton'})[waGrade.event];
    const key=distance+'|'+entry.gender,previous=byDistance.get(key);
    if(!previous||waGrade.score>previous.waGrade.score)byDistance.set(key,{entry,grade,waGrade});
  }
  const genders=['K','M'].includes(gender)?[gender]:['K','M'];
  const checked=pointsViewDate(references?.checkedAt);
  const referenceScore=(distance,sex)=>byDistance.get(distance+'|'+sex)?.waGrade.score??-1;
  const referenceDistances=pointsViewDistances.slice().sort((first,second)=>Math.max(...genders.map(sex=>referenceScore(second,sex)))-Math.max(...genders.map(sex=>referenceScore(first,sex))));
  return `<section class="points-national" aria-labelledby="points-national-title"><div class="points-national-heading"><div><p class="points-kicker">NORGE · ${pointsViewEscape(year)}</p><h2 id="points-national-title">Beste norske WA-noteringer</h2><p>Høyeste WA-poeng per distanse og kjønn blant de kontrollerte resultatene.</p></div>${checked?`<span class="points-checked">Kontrollert ${pointsViewEscape(checked)}</span>`:''}</div><div class="points-reference-grid">${referenceDistances.map(distance=>`<article class="points-reference-card"><h3>${pointsViewEscape(distance)}</h3>${genders.slice().sort((first,second)=>referenceScore(distance,second)-referenceScore(distance,first)).map(sex=>{
    const item=byDistance.get(distance+'|'+sex);
    if(!item)return `<div class="points-reference-entry points-reference-${sex} is-unlisted"><span class="points-reference-sex">${pointsViewGender(sex)}</span><p>Ikke bekreftet</p></div>`;
    const {entry,grade,waGrade}=item;
    return `<div class="points-reference-entry points-reference-${sex}"><div class="points-reference-top"><span class="points-reference-sex">${pointsViewGender(sex)}</span></div><p class="points-reference-name">${pointsViewEscape(entry.name)}</p><p class="points-reference-time">${pointsViewEscape(displayTime(entry.time,entry.measuredTime))}${Number.isInteger(grade.age)?' · '+grade.age+' år':''}</p><div class="points-reference-score">${pointsViewScores({ageScore:grade.eligible?grade.score:null,waScore:waGrade.score,ageReason:grade.reason})}</div><div class="points-reference-bottom"><time datetime="${pointsViewEscape(entry.date)}">${pointsViewEscape(pointsViewDate(entry.date))}</time><a href="${pointsViewEscape(pointsViewSource(entry.sourceUrl))}" target="_blank" rel="noopener noreferrer" aria-label="Kilde for ${pointsViewEscape(entry.name)}, ${pointsViewEscape(distance)}">Kilde ↗</a></div></div>`;
  }).join('')}</article>`).join('')}</div><p class="points-national-note">${pointsViewEscape(references?.note||'Høyeste beregnede WA-poeng blant de kildebelagte resultatene som er lagt inn. Dette er ingen offisiell rekordliste eller garantert uttømmende norsk toppliste.')}</p></section>`;
}

export function renderPointsTable(view,{editableAge=false}={}){
  const rows=(Array.isArray(view?.rows)?view.rows:[]).slice().sort((first,second)=>second.waScore-first.waScore);
  if(!rows.length)return '<div class="points-empty"><h3>Ingen poengnoteringer i dette utvalget</h3><p>Prøv et annet filter. WA-poeng krever en gyldig tid, kjønn og en øvelse som finnes i tabellen.</p><a href="#resultater">Åpne løpsresultater ↗</a></div>';
  const best=rows[0];
  return `<div class="points-table-scroll" role="region" aria-label="Klubbens poengtabell" tabindex="0"><table class="points-table" role="table"><caption class="sr-only">Én beste notering per utøver, valgt etter WA-poeng. Begge poengsummer gjelder samme resultat. Høyeste WA-poeng først.</caption><thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader" id="points-col-name">Navn</th><th scope="col" role="columnheader" id="points-col-score" aria-sort="descending">Poeng <span aria-hidden="true">↓</span><span class="points-column-note">Rangert etter WA-poeng</span></th><th scope="col" role="columnheader" id="points-col-performance">Tid / distanse</th><th scope="col" role="columnheader" id="points-col-date">Dato</th></tr></thead><tbody role="rowgroup">${rows.map((row,index)=>{
    const linked=typeof row.raceId==='string'&&row.raceId.trim();
    const name=linked?`<a href="#lop/${encodeURIComponent(row.raceId)}">${pointsViewEscape(row.name)} <span aria-hidden="true">↗</span></a>`:pointsViewEscape(row.name);
    const local=row.result?.ageGrade?.localOverride===true||row.ageBasis==='local-birth-year';
    const age=Number.isInteger(row.age)?row.age+' år':'';
    const gender=['K','M'].includes(row.gender)?pointsViewGender(row.gender):'';
    const canEditAge=editableAge&&linked&&(Boolean(age)||pointsViewMissingAge.has(row.result?.ageGrade?.reason));
    const ageControl=canEditAge?`<button type="button" class="points-edit-age" data-points-edit-age="${pointsViewEscape(row.athleteId)}" aria-haspopup="dialog" aria-controls="age-grade-dialog" aria-label="${age?'Endre':'Legg inn'} fødselsår for ${pointsViewEscape(row.name)}">${age||'Legg inn alder'}</button>`:pointsViewEscape(age);
    return `<tr role="row" data-athlete-id="${pointsViewEscape(row.athleteId)}"${row===best?' class="points-best-row"':''}><th scope="row" role="rowheader" class="points-name-cell" id="points-athlete-${index}"><span class="points-athlete-name">${name}</span><span class="points-cell-meta">${pointsViewEscape(gender)}${gender&&ageControl?' · ':''}${ageControl}${local?' · alder angitt manuelt':''}</span></th><td role="cell" headers="points-athlete-${index} points-col-score" class="points-score-cell">${pointsViewScores({waScore:row.waScore,ageScore:row.ageScore,ageReason:row.result?.ageGrade?.reason,waReason:row.result?.waScore?.reason})}${row===best?'<span class="points-best-mark">Beste WA-poeng i utvalget</span>':''}</td><td role="cell" headers="points-athlete-${index} points-col-performance" class="points-performance-cell"><strong class="points-result-time">${pointsViewEscape(displayTime(row.time,row.result?.measuredTime))}</strong><span class="points-cell-meta">${pointsViewEscape(row.distance)}</span></td><td role="cell" headers="points-athlete-${index} points-col-date" class="points-date-cell"><time datetime="${pointsViewEscape(row.date)}">${pointsViewEscape(pointsViewDate(row.date))}</time><span class="points-cell-meta">${pointsViewEscape(row.raceName)}</span></td></tr>`;
  }).join('')}</tbody></table></div>`;
}

/** Mount once; render() refreshes data while preserving the visitor's filters. */
export function mountPointsView(root,{getRaces,references={},onEditAge}={}){
  if(!root)return {render(){}};
  let gender='',currentRows=[];
  root.innerHTML=`<section class="points-club" aria-labelledby="points-club-title"><div class="points-club-heading"><h2 id="points-club-title">Klubbens beste WA-poeng</h2><div class="points-gender" role="group" aria-label="Velg kjønn i poengoversikten"><button type="button" data-points-gender="" aria-pressed="true" class="active">Alle</button><button type="button" data-points-gender="K" aria-pressed="false">Kvinner</button><button type="button" data-points-gender="M" aria-pressed="false">Menn</button></div></div><details class="points-guide"><summary id="points-grade-help-title">Om WA-poeng og aldersjustering <span class="points-disclosure-chevron" aria-hidden="true">⌄</span></summary><div class="points-guide-content"><p class="points-guide-intro">Én beste notering per utøver, valgt og sortert etter høyeste WA-poeng. Begge poengsummene gjelder den samme prestasjonen.</p><div class="points-guide-grid"><div class="points-guide-wa"><h3>WA-poeng</h3><p>World Athletics-tabellen vurderer tiden ut fra øvelse og kjønn, uten aldersjustering.</p><strong>Høyere poeng er bedre</strong></div><div class="points-guide-age"><h3>Aldersjusterte poeng</h3><p>Referansetid for alder, kjønn og distanse sammenlignes med løpstiden.</p><strong>100 poeng ≈ verdensrekordnivå</strong><span>For din alder og ditt kjønn på denne distansen.</span></div></div><div class="points-guide-details"><p><strong>WA-poeng</strong> hentes fra World Athletics sine poengtabeller fra 2025. De vises som hele poeng og har en egen skala. Ingen bonus for plassering er lagt til. Dette er beregnet poengverdi for den registrerte tiden, ikke en offisiell verdensranking. <a href="https://worldathletics.org/about-iaaf/documents/technical-information" target="_blank" rel="noopener noreferrer">World Athletics-tabellene ↗</a></p><p><strong>Aldersjusterte poeng</strong> beregnes som referansetid ÷ løpstid × 100 med tabellene fra Kjapp-kalkulatoren. Referansene bygger på verdensbeste prestasjoner tilpasset alder, kjønn og distanse. De er ikke nødvendigvis dagens offisielle rekorder. Poeng over 100 er mulig. Alderen beregnes ved løpet, ikke i dag. Med fødselsår bruker vi alderen utøveren fyller i løpsåret; med full fødselsdato bruker vi alderen på løpsdagen.</p><p>Skalaene kan ikke sammenlignes direkte. Om alderen din ikke ligger inne i systemet, kan du skrive den inn manuelt ved utøveren i tabellen. Det lagres bare i denne nettleseren. WA-poeng krever ikke alder, og rangeringen påvirkes ikke av aldersjusteringen.</p></div></div></details><div class="points-controls points-filters"><p class="points-summary" data-points-summary role="status"></p><details class="points-filter-panel" data-points-filter-panel><summary>Filtrer <span class="points-filter-count" data-points-filter-count hidden></span><span class="points-disclosure-chevron" aria-hidden="true">⌄</span></summary><div class="points-filter-fields"><label class="points-search"><span>Søk etter løper eller løp</span><input type="search" data-points-query placeholder="Navn eller løp …" autocomplete="off"></label><label><span>Distanse</span><select data-points-distance><option value="">Alle distanser</option></select></label><label><span>År</span><select data-points-year><option value="">Alle år</option></select></label></div></details></div><div data-points-table></div><p class="points-coverage" data-points-coverage></p></section><div data-points-national></div>`;
  const query=root.querySelector('[data-points-query]'),distance=root.querySelector('[data-points-distance]'),year=root.querySelector('[data-points-year]');
  function setOptions(control,values,label){
    const selected=control.value;
    control.innerHTML=`<option value="">${label}</option>`+values.map(value=>`<option value="${pointsViewEscape(value)}">${pointsViewEscape(value)}</option>`).join('');
    control.value=values.includes(selected)?selected:'';
  }
  function render(){
    const races=typeof getRaces==='function'?getRaces():[];
    const actual=Array.isArray(races)?races.filter(Boolean):[];
    setOptions(distance,[...new Set(actual.flatMap(race=>(race.results||[]).map(result=>result.distance)).filter(value=>typeof value==='string'&&value))].sort((a,b)=>a.localeCompare(b,'nb-NO',{numeric:true})),'Alle distanser');
    setOptions(year,[...new Set(actual.map(race=>String(race.date||'').slice(0,4)).filter(value=>/^\d{4}$/.test(value)))].sort().reverse(),'Alle år');
    const view=selectPointsLeaderboard(actual,{gender,distance:distance.value,year:year.value,query:query.value});
    currentRows=view.rows;
    root.querySelector('[data-points-national]').innerHTML=renderPointsReferences(references,gender);
    root.querySelector('[data-points-table]').innerHTML=renderPointsTable(view,{editableAge:typeof onEditAge==='function'});
    root.querySelector('[data-points-summary]').textContent=`${view.athleteCount} ${view.athleteCount===1?'utøver':'utøvere'} · Høyeste WA-poeng øverst`;
    const filterCount=[query.value.trim(),distance.value,year.value].filter(Boolean).length;
    const countLabel=root.querySelector('[data-points-filter-count]');
    countLabel.textContent=String(filterCount);countLabel.hidden=filterCount===0;
    const notes=[];
    if(view.missingAgeResults)notes.push(`${view.missingAgeResults} ${view.missingAgeResults===1?'resultat mangler':'resultater mangler'} gyldig alder. WA-poeng er beregnet uavhengig av dette.`);
    if(view.unsupportedResults)notes.push(`${view.unsupportedResults} ${view.unsupportedResults===1?'resultat har':'resultater har'} ikke grunnlag for WA-poeng. WA-poeng beregnes her bare for standardøvelser på bane og vei, og tiden må være innenfor tabellens poengområde.`);
    notes.push('WA-poeng vises som heltall og avgjør rangeringen. Aldersjusterte poeng vises med én desimal og bruker alderen ved løpet.');
    const local=view.rows.some(row=>row.result?.ageGrade?.localOverride===true||row.ageBasis==='local-birth-year');
    if(local)notes.push('Manuelt angitt alder i denne nettleseren er med i aldersjusteringen.');
    root.querySelector('[data-points-coverage]').textContent=notes.join(' ');
  }
  root.addEventListener('click',event=>{
    const ageButton=event.target?.closest?.('[data-points-edit-age]');
    if(ageButton&&root.contains(ageButton)&&typeof onEditAge==='function'){
      const row=currentRows.find(item=>item.athleteId===ageButton.dataset.pointsEditAge);
      if(row)onEditAge({athleteId:row.athleteId,raceId:row.raceId,result:row.result});
      return;
    }
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
