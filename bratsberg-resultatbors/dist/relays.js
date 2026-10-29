import {esc,initials,dateParts} from './data.js';
import {renderAwardIcon} from './athlete-cards.js';
import {renderPortraitImage,installPortraitErrors,safePortraitUrl} from './portrait.js';

const relayStates=new WeakMap();
const relayTimeSeconds=value=>{
  if(typeof value!=='string')return null;
  const parts=value.replace(',','.').split(':');
  if(parts.length<2||parts.length>3||parts.some(part=>!/^\d+(?:\.\d+)?$/.test(part)))return null;
  const numbers=parts.map(Number);
  if(numbers.some((part,index)=>!Number.isFinite(part)||part<0||(index>0&&part>=60)))return null;
  const seconds=numbers.reduce((sum,part)=>sum*60+part,0);
  return seconds>0?seconds:null;
};
export function relayPace(time,distanceMeters){
  const seconds=relayTimeSeconds(time);
  if(seconds===null||!Number.isFinite(distanceMeters)||distanceMeters<=0)return '–';
  const pace=Math.round(seconds*1000/distanceMeters);
  return `${Math.floor(pace/60)}:${String(pace%60).padStart(2,'0')}`;
}
const relayDistance=meters=>meters>=1000?`${new Intl.NumberFormat('nb-NO',{maximumFractionDigits:2}).format(meters/1000)} km`:`${meters} m`;
const relayPhoto=(leg,portraits)=>{
  return `<span class="relay-portrait" aria-hidden="true"><span>${esc(initials(leg.name||''))}</span>${renderPortraitImage(portraits?.[leg.athleteId],{width:88,height:112})}</span>`;
};
const relayImageSources=(legs,portraits)=>{
  const groups=new Map();
  for(const leg of legs){
    const photo=portraits?.[leg.athleteId];
    if(!photo?.src||(!photo.credit&&!photo.source))continue;
    const src=safePortraitUrl(photo.src)||safePortraitUrl(photo.fallbackSrc);let source='';
    if(!src)continue;
    try{const url=new URL(photo.source);if(url.protocol==='https:')source=url.href;}catch{}
    const credit=photo.credit||'Bildekilde';
    const key=source+'|'+credit;
    if(!groups.has(key))groups.set(key,{source,credit,names:new Set()});
    groups.get(key).names.add(leg.name);
  }
  if(!groups.size)return '';
  return `<details class="relay-image-sources"><summary>Bildekilder</summary><ul>${[...groups.values()].map(group=>`<li>${group.source?`<a href="${esc(group.source)}" target="_blank" rel="noopener noreferrer">${esc(group.credit)} ↗</a>`:esc(group.credit)}<span>${esc([...group.names].join(', '))}</span></li>`).join('')}</ul></details>`;
};
const relayRecordList=event=>Array.isArray(event?.records)?event.records.filter(record=>record.time&&Array.isArray(record.legs)):[];
const relayGenderName=gender=>gender==='K'?'Kvinner':gender==='M'?'Menn':gender||'Lag';
const relayHeader='<div class="section-heading relay-heading"><div><p class="eyebrow">BRATSBERG FRIIDRETT</p><h2>Stafettrekorder</h2></div><a class="text-link" href="#klubbrekorder">Til klubbrekorder <span aria-hidden="true">↗</span></a></div>';

/** Each event contains current records only; historical starts and fictional teams are excluded. */
export function renderRelays(root,data,selectedId,selectedGender){
  if(!root)return;
  const allEvents=Array.isArray(data.relays)?data.relays:[];
  const events=allEvents.filter(event=>relayRecordList(event).length);
  let state=relayStates.get(root);
  if(!state){state={id:events[0]?.id,gender:'K',day:'1',query:''};relayStates.set(root,state);}
  if(selectedId&&selectedId!==state.id){state.id=selectedId;state.day='1';state.query='';}
  if(['K','M'].includes(selectedGender)&&selectedGender!==state.gender){state.gender=selectedGender;state.day='1';state.query='';}
  const requested=allEvents.find(event=>event.id===state.id);
  const event=selectedId?requested||events[0]:relayRecordList(requested).length?requested:events[0];
  const tabs=events.length?`<nav class="relay-event-tabs" aria-label="Velg stafettrekord">${events.map(item=>`<a href="#stafettrekorder/${encodeURIComponent(item.id)}/${encodeURIComponent(state.gender)}" class="${item.id===event?.id?'active':''}"${item.id===event?.id?' aria-current="page"':''}>${esc(item.name)}<span>${esc(item.legCount||relayRecordList(item)[0]?.legs.length)} etapper</span></a>`).join('')}</nav>`:'';
  const records=relayRecordList(event);
  if(!records.length){
    root.innerHTML=relayHeader+tabs+`<div class="empty-state">${event?`<h3>${esc(event.name)}</h3>`:''}<p>Ingen stafettrekord er lagt inn${event?' for denne stafetten':''} ennå.</p></div>`;
    root.onclick=null;root.oninput=null;
    return;
  }
  state.id=event.id;
  const record=records.find(item=>item.gender===state.gender)||records[0];
  state.gender=record.gender;
  const legs=record.legs;
  const days=[...new Set(legs.map(leg=>String(leg.day??1)))];
  if(days.length&&!days.includes(state.day))state.day=days[0];
  const isMultiDay=days.length>1;
  const when=record.date?dateParts(record.date).full:String(record.year||'');
  const medal=['kjønn totalt','klasse','gender','class'].includes(record.positionScope)?({1:'gold',2:'silver',3:'bronze'}[record.position]||null):null;
  const medalLabel={gold:'Gull',silver:'Sølv',bronze:'Bronse'}[medal];
  const positionSuffix=['klasse','class'].includes(record.positionScope)?' i klassen':['kjønn totalt','gender'].includes(record.positionScope)?' blant '+relayGenderName(record.gender).toLocaleLowerCase('nb-NO'):'';
  const source=typeof record.source==='string'?record.source:'';
  let sourceUrl='';try{const url=new URL(record.sourceUrl||source);if(url.protocol==='https:')sourceUrl=url.href;}catch{}
  root.innerHTML=relayHeader+tabs+`<div class="relay-event-heading"><div><h3>${esc(event.name)}</h3><p>${esc(when)}<span aria-hidden="true"> · </span>${esc(event.legCount||legs.length)} etapper</p></div><div class="relay-gender-tabs" role="group" aria-label="Velg lag">${records.map(item=>`<button type="button" data-relay-gender="${esc(item.gender)}" class="relay-gender-${item.gender==='K'?'women':'men'}${item===record?' active':''}" aria-pressed="${item===record}">${esc(relayGenderName(item.gender))}</button>`).join('')}</div></div><div class="relay-record-banner"><div class="relay-record-summary"><strong>${esc(record.time)}</strong></div><div class="relay-record-meta">${record.position!=null?`<span class="relay-position${medal?' award-medal medal-'+medal:''}">${medal?renderAwardIcon(medal==='gold'?'trophy':'medal')+`<span class="sr-only">${medalLabel}: </span>`:''}${esc(record.position)}. plass${esc(positionSuffix)}</span>`:''}${record.category?`<span>${esc(record.category)}</span>`:''}<span>${esc(relayGenderName(record.gender))} · ${esc(when)}</span></div></div>${record.note?`<p class="relay-record-note">${esc(record.note)}</p>`:''}<div class="relay-lineup-toolbar"><h4>Rekordlaget</h4>${isMultiDay?`<div class="relay-day-tabs" aria-label="Velg dag">${days.map(day=>`<button type="button" data-relay-day="${esc(day)}" aria-pressed="${day===state.day}" class="${day===state.day?'active':''}">Dag ${esc(day)}</button>`).join('')}</div>`:`<span>${legs.length} løpere</span>`}</div>${isMultiDay?'<label class="relay-search"><span class="search-icon" aria-hidden="true"></span><span class="sr-only">Søk etter løper eller etappe, på alle dager</span><input type="search" data-relay-search placeholder="Søk etter løper eller etappe …" autocomplete="off"></label>':''}<div class="relay-lineup" aria-live="polite"></div><div class="relay-lineup-summary"></div>${source||sourceUrl?`<p class="relay-source">Kilde: ${sourceUrl?`<a href="${esc(sourceUrl)}" target="_blank" rel="noopener noreferrer">Resultatliste ↗</a>`:esc(source)}</p>`:''}${relayImageSources(legs,data.portraits)}`;

  const drawLineup=()=>{
    const q=state.query.trim().toLocaleLowerCase('nb-NO');
    const shown=legs.filter(leg=>q?`${leg.name} etappe ${leg.number}`.toLocaleLowerCase('nb-NO').includes(q):!isMultiDay||String(leg.day??1)===state.day);
    const grid=root.querySelector('.relay-lineup');if(!grid)return;
    grid.innerHTML=shown.map(leg=>{
      const pace=leg.pace||relayPace(leg.time,leg.distanceMeters);
      const distance=Number.isFinite(leg.distanceMeters)&&leg.distanceMeters>0?relayDistance(leg.distanceMeters):'';
      return `<article class="relay-runner-card">${relayPhoto(leg,data.portraits)}<div class="relay-runner-content"><div class="relay-leg-number"><span>ETAPPE ${esc(leg.number)}</span>${isMultiDay?`<span>Dag ${esc(leg.day??1)}</span>`:''}</div><h5>${esc(leg.name)}</h5>${leg.section||distance?`<p class="relay-leg-distance">${esc(leg.section||'')}${leg.section&&distance?' · ':''}${esc(distance)}</p>`:''}<div class="relay-runner-stats"><div><strong>${esc(leg.time||'–')}</strong><span>Etappetid</span></div><div><strong>${esc(pace)}</strong><span>min/km</span></div></div></div></article>`;
    }).join('')||'<p class="relay-no-match">Ingen etapper passer søket.</p>';
    root.querySelector('.relay-lineup-summary').textContent=q?`${shown.length} treff på tvers av dagene`:isMultiDay?`${shown.length} etapper · dag ${state.day}`:'';
    root.querySelectorAll('[data-relay-day]').forEach(button=>{button.classList.toggle('active',!q&&button.dataset.relayDay===state.day);button.setAttribute('aria-pressed',String(!q&&button.dataset.relayDay===state.day));});
  };
  const input=root.querySelector('[data-relay-search]');if(input)input.value=state.query;
  root.onclick=e=>{
    const gender=e.target.closest('[data-relay-gender]');
    if(gender){state.gender=gender.dataset.relayGender;state.day='1';state.query='';history.replaceState(null,'',`#stafettrekorder/${encodeURIComponent(state.id)}/${state.gender}`);renderRelays(root,data,state.id);root.querySelector(`[data-relay-gender="${state.gender}"]`)?.focus({preventScroll:true});return;}
    const day=e.target.closest('[data-relay-day]');
    if(day){state.day=day.dataset.relayDay;state.query='';if(input)input.value='';drawLineup();}
  };
  root.oninput=e=>{if(e.target.matches('[data-relay-search]')){state.query=e.target.value;drawLineup();}};
  // Image errors do not bubble. Capture once, including after tab changes.
  installPortraitErrors(root);
  drawLineup();
}
