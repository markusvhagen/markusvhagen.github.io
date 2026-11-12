import {displayTime} from './display-format.js';
import {loadData,esc,dateTile,badges,dateParts,shortDate,initials,participantCount,avatarStack,showError} from './data.js';
import {mountWidget} from './widget.js';
import {renderAthleteCard,installPortraitFallback,resultStatus} from './athlete-cards.js';
import {renderRelays} from './relays.js';
import {selectArchivePage} from './archive.js';
import {renderCalendarParticipant,renderParticipantPreview,watchUpcomingEvents} from './calendar.js';
import {renderRaceWinners,installRaceWinnerControls,renderRaceNews} from './race-extras.js';
import {gradeRaceResult} from './age-grading.js';
import {readBirthYearOverrides,writeBirthYearOverrides,validateBirthYear} from './age-grade-ui.js';
import {mountPointsView} from './points-view.js';
const portal=document.body.dataset.page==='portal';
let data;
installPortraitFallback();
try{data=await loadData();if(portal)initPortal();else initHome();}catch(error){console.error(error);showError(document.querySelector(portal?'#race-list':'#result-widget'));if(!portal)document.querySelector('#home-upcoming').innerHTML='<p class="loading">Kommende løp kunne ikke hentes.</p>';}
function initHome(){
  mountWidget(document.querySelector('#result-widget'),data);
  watchUpcomingEvents(data.upcoming, upcoming => {
    document.querySelector('#home-upcoming').innerHTML=upcoming.slice(0,3).map(event=>{
      const participants=Array.isArray(event.participants)?event.participants:[];
      return `<a class="mini-event" href="resultater.html#terminliste/${encodeURIComponent(event.id)}">${dateTile(event.date)}<span class="mini-event-name"><strong>${esc(event.name)}</strong><span>${esc(event.location)} <span aria-hidden="true">·</span> ${esc(event.distances.join(' / '))}</span></span>${participants.length?`<span class="mini-event-members">${renderParticipantPreview(participants,data.portraits)}${participants.length} fra klubben</span>`:''}<span aria-hidden="true">↗</span></a>`;
    }).join('')||'<p class="loading">Ingen nye løp er lagt inn ennå.</p>';
  });
}
function initPortal(){
  const portalRaces=data.races.slice().sort((a,b)=>b.date.localeCompare(a.date));
  const toolbar=document.querySelector('#archive-toolbar');
  const filterDialog=document.querySelector('#archive-filter-dialog');
  const filterForm=document.querySelector('#archive-filter-form');
  const filterToggle=document.querySelector('#archive-filter-toggle');
  const filterCount=document.querySelector('#archive-filter-count');
  const quickGender=document.querySelector('#result-gender');
  const quickSort=document.querySelector('#archive-quick-sort');
  const distance=filterForm.elements.distance;
  const year=filterForm.elements.year;
  const defaultFilters={query:'',distance:'',year:'',gender:'',sort:'time',onlyRecords:false};
  let filters={...defaultFilters},dialogAnchor=null;
  [...new Set(portalRaces.flatMap(r=>r.distances))].forEach(d=>{const o=document.createElement('option');o.value=d;o.textContent=d;distance.append(o);});
  [...new Set(portalRaces.map(r=>r.date.slice(0,4)))].sort().reverse().forEach(y=>{const o=document.createElement('option');o.value=y;o.textContent=y;year.append(o);});
  const firstRace=portalRaces[0];
  const raceExpansion=new Map(firstRace?[[firstRace.id,true]]:[]);
  const raceList=document.querySelector('#race-list');
  const profileList=Array.isArray(data.athletes)?data.athletes:data.athletes?.athletes||[];
  const profilesById=new Map(profileList.map(athlete=>[athlete.id,athlete]));
  const birthYearOverrides=readBirthYearOverrides(undefined,data.athletes?.mergedAthleteIds);
  installRaceWinnerControls(raceList);
  let archivePage=1;
  const pager=document.querySelector('#archive-pagination');
  function syncFilterBar(){
    quickGender.value=filters.gender;
    quickSort.value=filters.sort;
    const count=Object.keys(defaultFilters).filter(key=>filters[key]!==defaultFilters[key]).length;
    filterCount.textContent=String(count);
    filterCount.hidden=count===0;
    filterToggle.setAttribute('aria-label',count?`Filtre og sortering, ${count} aktive valg`:'Filtre og sortering');
  }
  function clearFilters(){
    filters={...defaultFilters};
    archivePage=1;
    syncFilterBar();
  }
  function racesWithLocalAges(){
    return portalRaces.map(race=>({...race,results:race.results.map(result=>{
      const birthYear=birthYearOverrides[result.athleteId];
      if(!Number.isInteger(birthYear))return result;
      const profile=profilesById.get(result.athleteId)||{};
      const ageGrade=gradeRaceResult(race,{...result,age:null,birthDate:null,birthYear},{...profile,birthDate:null,birthYear});
      return {...result,ageGrade:{...ageGrade,ageBasis:'local-birth-year',localOverride:true}};
    })}));
  }
  const pointsView=mountPointsView(document.querySelector('#points-root'),{getRaces:racesWithLocalAges,references:data.nationalPoints});
  function raceSource(race){
    let sourceLink='';
    try{const url=new URL(race.sourceUrl);if(url.protocol==='https:'&&!url.username&&!url.password)sourceLink=`<a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Åpne resultatkilden ↗</a>`;}catch{}
    const rankingNote='Plassering vises innen kjønn når den er kontrollert.';
    const pdfNote=race.source?.type==='pdf'?'Tidene er gjengitt fra PDF-en. '+(race.source.timeBasis==='unspecified'?'Kilden oppgir ikke om dette er netto- eller bruttotid. ':''):'';
    return `<div class="race-source-note">${sourceLink}<p>${pdfNote}${rankingNote}</p>${race.source?.displayNote?`<p>${esc(race.source.displayNote)}</p>`:''}</div>`;
  }
  function resultGroups(matching){
    const groups=new Map();
    matching.forEach(result=>{if(!groups.has(result.distance))groups.set(result.distance,[]);groups.get(result.distance).push(result);});
    return [...groups].map(([label,entries])=>`<section class="race-distance-group" aria-label="${esc(label)}"><div class="race-distance-heading"><h3>${esc(label)}</h3><span>${entries.length} resultater${filters.sort==='age-grade'?' · høyeste poeng først':''}</span></div><div class="result-hero-grid">${entries.map(r=>renderAthleteCard(r,data.portraits,{compact:false,showAgeGrade:true})).join('')}</div></section>`).join('');
  }
  function renderResults(focusRaceId=null){
    const view=selectArchivePage(racesWithLocalAges(),filters,archivePage,{focusRaceId});
    archivePage=view.page;
    const filtering=Boolean(filters.query||filters.distance||filters.gender||filters.onlyRecords||filters.year);
    document.querySelector('#result-count').textContent=view.total?`${view.from}–${view.to} av ${view.total} løp · ${view.resultCount} resultater`:'Ingen treff';
    document.querySelector('#race-list').innerHTML=view.items.map(({race,matching})=>{
      const pbs=matching.filter(r=>r.performanceHistory?.isPersonalBest).length,krs=matching.filter(r=>r.clubRecord).length,expanded=raceExpansion.get(race.id)??Boolean(filters.query);
      return `<article class="race-card race-card-grid" id="race-${esc(race.id)}"><div class="race-header"><button class="race-summary" type="button" data-open-race="${esc(race.id)}" aria-expanded="${expanded}" aria-controls="detail-${esc(race.id)}"><span class="race-title"><strong>${esc(race.name)}</strong></span><span class="race-flag-list">${krs?`<span class="badge cr"><span class="award-icon" aria-hidden="true">★</span> ${krs} ${krs===1?'Klubbrekord':'klubbrekorder'}</span>`:''}${pbs?`<span class="badge pb">${pbs} PB</span>`:''}</span><span class="race-athlete-count">${matching.length} resultater</span><span class="chevron" aria-hidden="true">⌄</span></button><div class="race-metadata-row">${renderRaceWinners(race,{selectedDistance:filters.distance})}<time datetime="${esc(race.date)}" title="${esc(dateParts(race.date).full)}">${esc(shortDate(race.date))} ${esc(race.date.slice(0,4))}</time>${renderRaceNews(race)}</div></div><div class="race-detail" id="detail-${esc(race.id)}"${expanded?'':' hidden'}>${resultGroups(matching)}${filtering?`<p class="detail-footnote">Viser ${matching.length} av ${race.results.length} klubbresultater.</p>`:''}${raceSource(race)}</div></article>`;
    }).join('')||'<div class="empty-state"><h3>Ingen løp passer søket</h3><p>Prøv et annet navn, eller fjern noen filtre.</p><button class="filter-reset" id="reset-filters">Nullstill filtrene</button></div>';
    pager.hidden=view.pageCount<2;
    pager.innerHTML=`<button type="button" data-archive-step="-1"${view.page===1?' disabled':''}>← Nyere løp</button><span aria-live="polite">Side <strong>${view.page}</strong> av ${view.pageCount}</span><button type="button" data-archive-step="1"${view.page===view.pageCount?' disabled':''}>Eldre løp →</button>`;
    document.querySelector('#reset-filters')?.addEventListener('click',()=>{clearFilters();renderResults();filterToggle.focus();});
  }
  raceList.addEventListener('click',event=>{
    const button=event.target.closest('[data-open-race]');
    if(!button)return;
    const id=button.dataset.openRace;
    const expanded=button.getAttribute('aria-expanded')!=='true';
    button.setAttribute('aria-expanded',String(expanded));
    document.getElementById('detail-'+id).hidden=!expanded;
    raceExpansion.set(id,expanded);
  });
  function readingAnchor(){
    const bar=toolbar.getBoundingClientRect();
    if(bar.top>parseFloat(getComputedStyle(toolbar).top)+1)return null;
    const readingLine=bar.bottom+8;
    const crossesLine=element=>{
      const rect=element.getBoundingClientRect();
      return rect.top<=readingLine && rect.bottom>readingLine;
    };
    if(raceList.getBoundingClientRect().top>readingLine)return null;
    const race=[...raceList.children].find(card=>{
      if(!card.classList.contains('race-card'))return false;
      const rect=card.getBoundingClientRect();
      return rect.bottom>readingLine && rect.top<window.innerHeight;
    });
    if(!race)return null;
    const group=[...race.querySelectorAll('.race-distance-group')].find(crossesLine);
    const athlete=group && [...group.querySelectorAll('.athlete-card')].find(crossesLine);
    return {
      id:race.id.slice(5),
      open:race.querySelector('[data-open-race]').getAttribute('aria-expanded')==='true',
      distance:group?.getAttribute('aria-label'),
      athleteId:athlete?.dataset.athleteId,
      athleteTop:athlete?.getBoundingClientRect().top
    };
  }
  function restoreReadingAnchor(anchor){
    if(!anchor)return;
    const race=document.getElementById('race-'+anchor.id);
    const group=race && [...race.querySelectorAll('.race-distance-group')].find(item=>item.getAttribute('aria-label')===anchor.distance);
    const athlete=anchor.athleteId && group && [...group.querySelectorAll('.athlete-card')]
      .find(card=>card.dataset.athleteId===anchor.athleteId);
    const target=athlete||group||race||raceList;
    const top=athlete?anchor.athleteTop:toolbar.getBoundingClientRect().bottom+8;
    window.scrollBy({top:target.getBoundingClientRect().top-top,behavior:'instant'});
  }
  function applyFilters(next,anchor){
    filters=next;
    archivePage=1;
    if(anchor)raceExpansion.set(anchor.id,anchor.open);
    syncFilterBar();
    renderResults(anchor?.id);
    restoreReadingAnchor(anchor);
  }
  quickGender.addEventListener('change',()=>applyFilters({...filters,gender:quickGender.value},readingAnchor()));
  quickSort.addEventListener('change',()=>applyFilters({...filters,sort:quickSort.value},readingAnchor()));
  filterToggle.addEventListener('click',()=>{
    dialogAnchor=readingAnchor();
    for(const [key,value] of Object.entries(filters)){
      const field=filterForm.elements.namedItem(key);
      if(field.type==='checkbox')field.checked=value;
      else field.value=value;
    }
    filterDialog.showModal();
  });
  filterForm.addEventListener('submit',event=>{
    event.preventDefault();
    const values=new FormData(filterForm);
    const next={
      query:values.get('query').trim(),distance:values.get('distance'),
      year:values.get('year'),gender:values.get('gender'),sort:values.get('sort'),
      onlyRecords:values.has('onlyRecords')
    };
    filterDialog.close();
    applyFilters(next,dialogAnchor);
  });
  document.querySelector('#cancel-archive-filter').addEventListener('click',()=>filterDialog.close());
  filterDialog.addEventListener('close',()=>{
    if(!filterDialog.open && !document.querySelector('#results-panel').hidden){
      filterToggle.focus({preventScroll:true});
    }
  });
  syncFilterBar();
  const ageDialog=document.querySelector('#age-grade-dialog'),ageForm=document.querySelector('#age-grade-form'),birthYearInput=document.querySelector('#birth-year-input'),ageReset=document.querySelector('#reset-birth-year'),ageStatus=document.querySelector('#age-grade-status');
  let editingAthleteId=null,editingRaceId=null,editingRaceYear=null;
  raceList.addEventListener('click',event=>{
    const button=event.target.closest('[data-edit-birth-year]');
    if(!button)return;
    const id=button.dataset.editBirthYear,profile=profilesById.get(id);
    if(!profile)return;
    const raceId=button.closest('.race-card')?.id.slice(5);
    const race=portalRaces.find(candidate=>candidate.id===raceId);
    if(!race)return;
    editingAthleteId=id;editingRaceId=raceId;editingRaceYear=Number(race.date.slice(0,4));
    document.querySelector('#age-grade-person').textContent=profile.name;
    document.querySelector('#age-grade-context').textContent=`${race.name} · ${editingRaceYear}. Poengene bruker alderen utøveren fyller i løpsåret.`;
    birthYearInput.min=String(Math.max(1900,editingRaceYear-100));
    birthYearInput.max=String(Math.min(2100,editingRaceYear-5));
    birthYearInput.value=birthYearOverrides[id]??profile.birthYear??'';
    birthYearInput.setCustomValidity('');
    ageReset.disabled=!Object.hasOwn(birthYearOverrides,id);
    ageDialog.showModal();birthYearInput.focus();birthYearInput.select();
  });
  birthYearInput.addEventListener('input',()=>birthYearInput.setCustomValidity(''));
  ageForm.addEventListener('submit',event=>{
    event.preventDefault();
    if(!editingAthleteId)return;
    const birthYear=Number(birthYearInput.value);
    if(!validateBirthYear(birthYear,editingRaceYear)){
      birthYearInput.setCustomValidity('Oppgi et fødselsår som gir en alder fra 5 til 100 år ved løpet.');birthYearInput.reportValidity();return;
    }
    birthYearOverrides[editingAthleteId]=birthYear;
    const stored=writeBirthYearOverrides(birthYearOverrides);
    ageStatus.hidden=false;
    ageStatus.textContent=stored?'Fødselsåret er lagret i denne nettleseren og brukes på utøverens resultater.':'Fødselsåret brukes i denne økten. Nettleseren tillater ikke at det lagres til neste besøk.';
    renderResults();ageDialog.close();
  });
  ageReset.addEventListener('click',()=>{
    if(!editingAthleteId)return;
    delete birthYearOverrides[editingAthleteId];
    const stored=writeBirthYearOverrides(birthYearOverrides);
    ageStatus.hidden=false;ageStatus.textContent=stored?'Din lokale endring er fjernet. Utøverregisterets opplysninger brukes igjen.':'Endringen er fjernet for denne økten. Nettleseren tillater ikke at valget lagres.';
    renderResults();ageDialog.close();
  });
  document.querySelector('#cancel-birth-year').addEventListener('click',()=>ageDialog.close());
  ageDialog.addEventListener('close',()=>requestAnimationFrame(()=>{
    const raceCard=document.getElementById('race-'+editingRaceId);
    const detail=raceCard?.querySelector('.race-detail');
    const button=detail&&!detail.hidden?[...detail.querySelectorAll('[data-edit-birth-year]')].find(candidate=>candidate.dataset.editBirthYear===editingAthleteId):null;
    (button||raceCard?.querySelector('[data-open-race]'))?.focus({preventScroll:true});
  }));
  pager.addEventListener('click',event=>{
    const button=event.target.closest('[data-archive-step]');if(!button||button.disabled)return;
    archivePage+=Number(button.dataset.archiveStep);renderResults();
    filterToggle.focus({preventScroll:true});
    document.querySelector('#results-panel').scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
  let gender='K';
  function renderRecordCard(r){
    const missing=r.status==='unlisted'||!r.time;
    return `<article class="record-card official-record${missing?' record-unlisted':''}"><div class="record-card-top"><span class="record-distance">${esc(r.distance)}</span>${r.ageClass?`<span class="record-age">${esc(r.ageClass)}</span>`:''}</div><p class="record-time">${missing?'—':esc(displayTime(r.time,r.measuredTime))}</p><p class="record-owner">${missing?'Ingen registrert rekord':esc(r.name)}</p>${r.location?`<p class="record-race">${esc(r.location)}</p>`:''}${r.date?`<p class="record-date">${esc(dateParts(r.date).full)}</p>`:''}</article>`;
  }
  function renderRecords(){
    const updated=data.recordsUpdatedAt||'2026-10-17';
    document.querySelector('#records-updated').textContent='Oppdatert '+new Intl.DateTimeFormat('nb-NO',{day:'2-digit',month:'2-digit',year:'numeric'}).format(new Date(updated+'T12:00:00'));
    const selected=data.records.filter(r=>r.gender===gender);
    document.querySelector('#record-grid').innerHTML=[['track','Bane (utendørs)'],['road','Gate']].map(([category,label])=>`<section class="record-category" aria-label="${label}"><div class="record-category-heading"><h3>${label}</h3><span>${selected.filter(r=>r.category===category&&r.time).length} registrerte rekorder</span></div><div class="record-grid">${selected.filter(r=>r.category===category).map(renderRecordCard).join('')}</div></section>`).join('');
    const candidates=(data.recordCandidates||[]).filter(c=>c.result.gender===gender);
    const candidatePanel=document.querySelector('#record-candidates');
    candidatePanel.hidden=!candidates.length;
    candidatePanel.innerHTML=candidates.length?`<h3>Nye resultater til kontroll</h3><ul>${candidates.map(c=>`<li><strong>${esc(c.result.name)} · ${esc(displayTime(c.result.time,c.result.measuredTime))}</strong><span>${esc(c.result.distance)} · ${esc(c.race.name)}</span></li>`).join('')}</ul><p>Resultatene er raskere enn den registrerte rekorden. Rekordlisten oppdateres etter kontroll.</p>`:'';
    const relayList=(data.relays||[]).flatMap(event=>(event.records||[]).filter(record=>record.gender===gender).map(record=>({event,record})));
    document.querySelector('#relay-record-links').innerHTML=relayList.map(({event,record})=>`<a class="relay-record-link" href="#stafettrekorder/${encodeURIComponent(event.id)}/${gender}"><span><strong>${esc(event.name)}</strong><small>${esc(record.year)} · ${event.legCount} etapper</small></span><span class="relay-record-time">${esc(displayTime(record.time,record.measuredTime))}</span><span class="relay-link-arrow" aria-hidden="true">↗</span></a>`).join('')||'<p class="muted small">Ingen stafettrekorder er lagt inn ennå.</p>';
  }
  document.querySelectorAll('[data-gender]').forEach(button=>button.addEventListener('click',()=>{gender=button.dataset.gender;document.querySelectorAll('[data-gender]').forEach(b=>{b.classList.toggle('active',b===button);b.setAttribute('aria-pressed',String(b===button));});renderRecords();}));
  const calendarList = document.querySelector('#calendar-list');
  const calendarPanel = document.querySelector('#calendar-panel');
  let calendarEvents;
  watchUpcomingEvents(data.upcoming, upcoming => {
    calendarEvents = upcoming;
    if (calendarPanel.hidden) return;
    const expanded = calendarList.querySelectorAll('[data-calendar][aria-expanded="true"]');
    renderCalendar(new Set([...expanded].map(button => button.dataset.calendar)));
  });
  function renderCalendar(openIds) {
    calendarList.innerHTML=calendarEvents.map(event=>{
      const participants=Array.isArray(event.participants)?event.participants:[];
      let sourceLink='';
      try{const url=new URL(event.sourceUrl);if(url.protocol==='https:'&&!url.username&&!url.password)sourceLink=`<p class="calendar-source"><a href="${esc(url.href)}" target="_blank" rel="noopener noreferrer">Arrangørens nettside ↗</a></p>`;}catch{}
      return `<article class="calendar-card" id="event-${esc(event.id)}"><button type="button" class="calendar-summary" data-calendar="${esc(event.id)}" aria-expanded="${openIds.has(event.id)}" aria-controls="participants-${esc(event.id)}">${dateTile(event.date)}<span class="race-title"><strong>${esc(event.name)}</strong><span class="race-meta">${esc(event.location)} <b>·</b> ${esc(event.distances.join(' / '))} <b>·</b> ${event.date.slice(0,4)}</span></span>${participants.length?`${renderParticipantPreview(participants,data.portraits)}<span class="race-athlete-count">${participants.length} fra klubben</span>`:''}<span class="chevron" aria-hidden="true">⌄</span></button><div class="participant-list" id="participants-${esc(event.id)}"${openIds.has(event.id)?'':' hidden'}>${participants.map(person=>renderCalendarParticipant(person,data.portraits)).join('')||'<p>Ingen klubbpåmeldinger er registrert ennå.</p>'}${sourceLink}</div></article>`;
    }).join('')||'<div class="empty-state">Ingen kommende løp er lagt inn ennå.</div>';
  }
  calendarList.addEventListener('click',e=>{const b=e.target.closest('[data-calendar]');if(!b)return;const opened=b.getAttribute('aria-expanded')!=='true';b.setAttribute('aria-expanded',String(opened));document.getElementById('participants-'+b.dataset.calendar).hidden=!opened;});
  function route(){
    if(filterDialog.open)filterDialog.close();
    let [tab,id,relayGender]=location.hash.slice(1).split('/');
    try{id=id?decodeURIComponent(id):null;}catch{id=null;}
    const linkedRace=tab==='lop'?id:null;
    if(tab==='lop'){tab='resultater';if(id){clearFilters();raceExpansion.set(id,true);}}
    if(tab==='stafetter')tab='stafettrekorder';
    if(tab==='poeng')tab='poengnoteringer';
    if(!['resultater','poengnoteringer','klubbrekorder','stafettrekorder','terminliste'].includes(tab))tab='resultater';
    document.querySelectorAll('[data-tab]').forEach(a=>{a.classList.toggle('active',a.dataset.tab===tab);if(a.dataset.tab===tab)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');});
    const activeTab=document.querySelector('.portal-tabs [aria-current="page"]');
    const menu=activeTab?.parentElement;
    if(menu?.clientWidth&&menu.scrollWidth>menu.clientWidth){
      const left=activeTab.offsetLeft,right=left+activeTab.offsetWidth;
      if(left<menu.scrollLeft+6)menu.scrollLeft=Math.max(0,left-6);
      else if(right>menu.scrollLeft+menu.clientWidth-6)menu.scrollLeft=right-menu.clientWidth+6;
    }
    document.querySelector('#results-panel').hidden=tab!=='resultater';
    document.querySelector('#points-panel').hidden=tab!=='poengnoteringer';
    document.querySelector('#records-panel').hidden=tab!=='klubbrekorder';
    document.querySelector('#relays-panel').hidden=tab!=='stafettrekorder';
    document.querySelector('#calendar-panel').hidden=tab!=='terminliste';
    if(tab==='resultater'){renderResults(linkedRace);if(linkedRace)requestAnimationFrame(()=>document.getElementById('race-'+linkedRace)?.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'}));}
    if(tab==='klubbrekorder')renderRecords();
    if(tab==='poengnoteringer')pointsView.render();
    if(tab==='stafettrekorder')renderRelays(document.querySelector('#relay-root'),data,id,relayGender);
    if(tab==='terminliste')renderCalendar(new Set(id ? [id] : []));
    const pageNames={resultater:'Løpsresultater',poengnoteringer:'Poengnoteringer',klubbrekorder:'Klubbrekorder',stafettrekorder:'Stafettrekorder',terminliste:'Terminliste'};
    document.title=pageNames[tab]+' · Bratsberg Friidrett';
  }
  window.addEventListener('hashchange',route);route();
}
