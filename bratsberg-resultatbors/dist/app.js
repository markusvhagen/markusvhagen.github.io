import {loadData,esc,dateTile,badges,dateParts,shortDate,initials,participantCount,avatarStack,showError} from './data.js';
import {mountWidget} from './widget.js';
import {renderAthleteCard,installPortraitFallback,resultStatus} from './athlete-cards.js';
import {renderRelays} from './relays.js';
import {selectArchivePage} from './archive.js';
import {renderCalendarParticipant,renderParticipantPreview} from './calendar.js';
const portal=document.body.dataset.page==='portal';
let data;
installPortraitFallback();
try{data=await loadData();if(portal)initPortal();else initHome();}catch(error){console.error(error);showError(document.querySelector(portal?'#race-list':'#result-widget'));if(!portal)document.querySelector('#home-upcoming').innerHTML='<p class="loading">Kommende løp kunne ikke hentes.</p>';}
function initHome(){
  mountWidget(document.querySelector('#result-widget'),data);
  document.querySelector('#home-upcoming').innerHTML=data.upcoming.slice(0,3).map(event=>{
    const participants=Array.isArray(event.participants)?event.participants:[];
    return `<a class="mini-event" href="resultater.html#terminliste/${encodeURIComponent(event.id)}">${dateTile(event.date)}<span class="mini-event-name"><strong>${esc(event.name)}</strong><span>${esc(event.location)} <span aria-hidden="true">·</span> ${esc(event.distances.join(' / '))}</span></span>${participants.length?`<span class="mini-event-members">${renderParticipantPreview(participants,data.portraits)}${participants.length} fra klubben</span>`:''}<span aria-hidden="true">↗</span></a>`;
  }).join('')||'<p class="loading">Ingen nye løp er lagt inn ennå.</p>';
}
function initPortal(){
  const portalRaces=data.races.filter(r=>r.demo!==true).slice().sort((a,b)=>b.date.localeCompare(a.date));
  const results=portalRaces.flatMap(r=>r.results),statsPeriod='I resultatarkivet';
  const stats=document.querySelector('#stats-strip');
  stats.setAttribute('aria-label','Statistikk for '+statsPeriod.toLocaleLowerCase('nb-NO'));
  stats.innerHTML=[[portalRaces.length,'løp'],[results.length,'resultater'],[new Set(results.map(r=>r.athleteId)).size,'løpere'],[results.filter(r=>r.clubRecord).length,'klubbrekorder']].map(([n,label])=>`<div class="stat"><strong>${n}</strong><span>${label}<br><span class="stat-period">${statsPeriod}</span></span></div>`).join('');
  const search=document.querySelector('#search'),distance=document.querySelector('#distance'),year=document.querySelector('#year'),pbOnly=document.querySelector('#only-pb'),resultGender=document.querySelector('#result-gender');
  [...new Set(portalRaces.flatMap(r=>r.distances))].forEach(d=>{const o=document.createElement('option');o.value=d;o.textContent=d;distance.append(o);});
  [...new Set(portalRaces.map(r=>r.date.slice(0,4)))].sort().reverse().forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;year.append(o);});
  const firstRace=portalRaces[0],openRaces=new Set(firstRace?[firstRace.id]:[]);
  let archivePage=1;
  const pager=document.querySelector('#archive-pagination');
  function clearFilters(){search.value='';distance.value='';year.value='';resultGender.value='';pbOnly.checked=false;archivePage=1;}
  function raceSource(race){
    let sourceLink='';
    try{const url=new URL(race.sourceUrl);if(url.protocol==='https:'&&!url.username&&!url.password)sourceLink=`<a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Åpne resultatkilden ↗</a>`;}catch{}
    const rankingNote='Plassering vises innen kjønn når den er kontrollert.';
    const pdfNote=race.source?.type==='pdf'?'Tidene er gjengitt fra PDF-en. '+(race.source.timeBasis==='unspecified'?'Kilden oppgir ikke om dette er netto- eller bruttotid. ':''):'';
    return `<div class="race-source-note">${sourceLink}<p>${pdfNote}${rankingNote}</p></div>`;
  }
  function resultGroups(matching){
    const groups=new Map();
    matching.forEach(result=>{if(!groups.has(result.distance))groups.set(result.distance,[]);groups.get(result.distance).push(result);});
    return [...groups].map(([label,entries])=>`<section class="race-distance-group" aria-label="${esc(label)}"><div class="race-distance-heading"><h3>${esc(label)}</h3><span>${entries.length} resultater</span></div><div class="result-hero-grid">${entries.map(r=>renderAthleteCard(r,data.portraits,{compact:false})).join('')}</div></section>`).join('');
  }
  function renderResults(focusRaceId=null){
    const q=search.value.trim().toLocaleLowerCase('nb-NO');
    const view=selectArchivePage(portalRaces,{query:q,distance:distance.value,gender:resultGender.value,year:year.value,onlyRecords:pbOnly.checked},archivePage,{focusRaceId});
    archivePage=view.page;
    const filtering=!!(q||distance.value||resultGender.value||pbOnly.checked||year.value);
    document.querySelector('#result-count').textContent=view.total?`${view.from}–${view.to} av ${view.total} løp · ${view.resultCount} resultater`:'Ingen treff';
    document.querySelector('#race-list').innerHTML=view.items.map(({race,matching})=>{
      const pbs=matching.filter(r=>r.performanceHistory?.isPersonalBest).length,krs=matching.filter(r=>r.clubRecord).length,expanded=openRaces.has(race.id)||filtering;
      return `<article class="race-card race-card-grid" id="race-${esc(race.id)}"><button class="race-summary" type="button" data-open-race="${esc(race.id)}" aria-expanded="${expanded}" aria-controls="detail-${esc(race.id)}"><span class="race-title"><strong>${esc(race.name)}</strong><span class="race-meta"><span>${esc(dateParts(race.date).full)}</span><b>·</b><span>${esc(race.distances.join(' / '))}</span></span></span><span class="race-flag-list">${krs?`<span class="badge cr"><span class="award-icon" aria-hidden="true">★</span> ${krs} ${krs===1?'Klubbrekord':'klubbrekorder'}</span>`:''}${pbs?`<span class="badge pb">${pbs} PB</span>`:''}</span><span class="race-athlete-count">${matching.length} resultater</span><span class="chevron" aria-hidden="true">⌄</span></button><div class="race-detail" id="detail-${esc(race.id)}"${expanded?'':' hidden'}>${resultGroups(matching)}${filtering?`<p class="detail-footnote">Viser ${matching.length} av ${race.results.length} klubbresultater.</p>`:''}${raceSource(race)}</div></article>`;
    }).join('')||'<div class="empty-state"><h3>Ingen løp passer søket</h3><p>Prøv et annet navn, eller fjern noen filtre.</p><button class="filter-reset" id="reset-filters">Nullstill filtrene</button></div>';
    pager.hidden=view.pageCount<2;
    pager.innerHTML=`<button type="button" data-archive-step="-1"${view.page===1?' disabled':''}>← Nyere løp</button><span aria-live="polite">Side <strong>${view.page}</strong> av ${view.pageCount}</span><button type="button" data-archive-step="1"${view.page===view.pageCount?' disabled':''}>Eldre løp →</button>`;
    document.querySelector('#reset-filters')?.addEventListener('click',()=>{clearFilters();renderResults();search.focus();});
  }
  document.querySelector('#race-list').addEventListener('click',event=>{const button=event.target.closest('[data-open-race]');if(!button)return;const id=button.dataset.openRace;const expanded=button.getAttribute('aria-expanded')!=='true';button.setAttribute('aria-expanded',String(expanded));document.getElementById('detail-'+id).hidden=!expanded;if(expanded)openRaces.add(id);else openRaces.delete(id);});
  const filterChanged=()=>{archivePage=1;renderResults();};
  search.addEventListener('input',filterChanged);[distance,year,resultGender,pbOnly].forEach(control=>control.addEventListener('change',filterChanged));
  pager.addEventListener('click',event=>{
    const button=event.target.closest('[data-archive-step]');if(!button||button.disabled)return;
    archivePage+=Number(button.dataset.archiveStep);renderResults();
    document.querySelector('#results-title').focus({preventScroll:true});
    document.querySelector('#results-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  let gender='K';
  function renderRecordCard(r){
    const missing=r.status==='unlisted'||!r.time;
    return `<article class="record-card official-record${missing?' record-unlisted':''}"><div class="record-card-top"><span class="record-distance">${esc(r.distance)}</span>${r.ageClass?`<span class="record-age">${esc(r.ageClass)}</span>`:''}</div><p class="record-time">${missing?'—':esc(r.time)}</p><p class="record-owner">${missing?'Ingen registrert rekord':esc(r.name)}</p>${r.location?`<p class="record-race">${esc(r.location)}</p>`:''}${r.date?`<p class="record-date">${esc(dateParts(r.date).full)}</p>`:''}</article>`;
  }
  function renderRecords(){
    const updated=data.recordsUpdatedAt||'2026-10-17';
    document.querySelector('#records-updated').textContent='Oppdatert '+new Intl.DateTimeFormat('nb-NO',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(updated+'T12:00:00'));
    const selected=data.records.filter(r=>r.gender===gender);
    document.querySelector('#record-grid').innerHTML=[['track','Bane (utendørs)'],['road','Gate']].map(([category,label])=>`<section class="record-category" aria-label="${label}"><div class="record-category-heading"><h3>${label}</h3><span>${selected.filter(r=>r.category===category&&r.time).length} registrerte rekorder</span></div><div class="record-grid">${selected.filter(r=>r.category===category).map(renderRecordCard).join('')}</div></section>`).join('');
    const candidates=(data.recordCandidates||[]).filter(c=>c.result.gender===gender);
    const candidatePanel=document.querySelector('#record-candidates');
    candidatePanel.hidden=!candidates.length;
    candidatePanel.innerHTML=candidates.length?`<h3>Nye resultater til kontroll</h3><ul>${candidates.map(c=>`<li><strong>${esc(c.result.name)} · ${esc(c.result.time)}</strong><span>${esc(c.result.distance)} · ${esc(c.race.name)}</span></li>`).join('')}</ul><p>Resultatene er raskere enn den registrerte rekorden. Rekordlisten oppdateres etter kontroll.</p>`:'';
    const relayList=(data.relays||[]).flatMap(event=>(event.records||[]).filter(record=>record.gender===gender).map(record=>({event,record})));
    document.querySelector('#relay-record-links').innerHTML=relayList.map(({event,record})=>`<a class="relay-record-link" href="#stafettrekorder/${encodeURIComponent(event.id)}/${gender}"><span><strong>${esc(event.name)}</strong><small>${esc(record.year)} · ${event.legCount} etapper</small></span><span class="relay-record-time">${esc(record.time)}</span><span class="relay-link-arrow" aria-hidden="true">↗</span></a>`).join('')||'<p class="muted small">Ingen stafettrekorder er lagt inn ennå.</p>';
  }
  document.querySelectorAll('[data-gender]').forEach(button=>button.addEventListener('click',()=>{gender=button.dataset.gender;document.querySelectorAll('[data-gender]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderRecords();}));
  function renderCalendar(openId){
    document.querySelector('#calendar-list').innerHTML=data.upcoming.map(event=>{
      const participants=Array.isArray(event.participants)?event.participants:[];
      let sourceLink='';
      try{const url=new URL(event.sourceUrl);if(url.protocol==='https:'&&!url.username&&!url.password)sourceLink=`<p class="calendar-source"><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Arrangørens nettside ↗</a></p>`;}catch{}
      return `<article class="calendar-card" id="event-${esc(event.id)}"><button type="button" class="calendar-summary" data-calendar="${esc(event.id)}" aria-expanded="${event.id===openId}" aria-controls="participants-${esc(event.id)}">${dateTile(event.date)}<span class="race-title"><strong>${esc(event.name)}</strong><span class="race-meta">${esc(event.location)} <b>·</b> ${esc(event.distances.join(' / '))} <b>·</b> ${event.date.slice(0,4)}</span></span>${participants.length?`${renderParticipantPreview(participants,data.portraits)}<span class="race-athlete-count">${participants.length} fra klubben</span>`:''}<span class="chevron" aria-hidden="true">⌄</span></button><div class="participant-list" id="participants-${esc(event.id)}"${event.id===openId?'':' hidden'}>${participants.map(person=>renderCalendarParticipant(person,data.portraits)).join('')||'<p>Ingen klubbpåmeldinger er registrert ennå.</p>'}${sourceLink}</div></article>`;
    }).join('')||'<div class="empty-state">Ingen kommende løp er lagt inn ennå.</div>';
  }
  document.querySelector('#calendar-list').addEventListener('click',e=>{const b=e.target.closest('[data-calendar]');if(!b)return;const opened=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(opened));document.getElementById('participants-'+b.dataset.calendar).hidden=!opened;});
  function route(){
    let [tab,id,relayGender]=location.hash.slice(1).split('/');
    try{id=id?decodeURIComponent(id):null;}catch{id=null;}
    const linkedRace=tab==='lop'?id:null;
    if(tab==='lop'){tab='resultater';if(id){clearFilters();openRaces.add(id);}}
    if(tab==='stafetter')tab='stafettrekorder';
    if(!['resultater','klubbrekorder','stafettrekorder','terminliste'].includes(tab))tab='resultater';
    document.querySelectorAll('[data-tab]').forEach(a=>{a.classList.toggle('active',a.dataset.tab===tab);if(a.dataset.tab===tab)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    document.querySelector('#results-panel').hidden=tab!=='resultater';
    document.querySelector('#records-panel').hidden=tab!=='klubbrekorder';
    document.querySelector('#relays-panel').hidden=tab!=='stafettrekorder';
    document.querySelector('#calendar-panel').hidden=tab!=='terminliste';
    document.querySelector('#stats-strip').hidden=tab!=='resultater';
    if(tab==='resultater'){renderResults(linkedRace);if(linkedRace)requestAnimationFrame(()=>document.getElementById('race-'+linkedRace)?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}
    if(tab==='klubbrekorder')renderRecords();
    if(tab==='stafettrekorder')renderRelays(document.querySelector('#relay-root'),data,id,relayGender);
    if(tab==='terminliste')renderCalendar(id);
    const pageNames={resultater:'Løpsresultater',klubbrekorder:'Klubbrekorder',stafettrekorder:'Stafettrekorder',terminliste:'Terminliste'};
    document.title=pageNames[tab]+' · Bratsberg Friidrett';
  }
  window.addEventListener('hashchange',route);route();
}
