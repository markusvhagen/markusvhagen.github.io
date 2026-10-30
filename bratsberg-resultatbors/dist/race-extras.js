const raceExtrasEscape=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const raceWinnerControlRoots=new WeakSet();

function raceWinnerTimeIsValid(value){
  if(typeof value!=='string')return false;
  const text=value.trim().replace(',','.');
  if(!/^(?:\d+:){0,2}\d+(?:\.\d+)?$/.test(text))return false;
  const parts=text.split(':');
  if(parts.slice(1).some(part=>Number(part)>=60))return false;
  const seconds=parts.reduce((total,part)=>total*60+Number(part),0);
  return Number.isFinite(seconds)&&seconds>0;
}

function raceWinnerDistances(race){
  const listed=Array.isArray(race?.distances)?race.distances:[];
  const fallback=Array.isArray(race?.winners)?race.winners.map(entry=>entry?.distance):[];
  return [...new Set((listed.length?listed:fallback).filter(distance=>typeof distance==='string'&&distance.trim()))];
}

function renderRaceWinnerBadge(winner,gender,distance,scope){
  const label=gender==='men'?'menn':'kvinner',short=gender==='men'?'M':'K';
  const valid=winner?.verified===true&&raceWinnerTimeIsValid(winner.time);
  const time=valid?winner.time:'—',name=valid&&typeof winner.name==='string'?winner.name.trim():'';
  const basis=valid&&winner.timeBasis==='net'?'Nettotid':valid&&winner.timeBasis==='gun'?'Bruttotid':'';
  const explanation=valid?['Vinner '+label,distance,name,time,basis,scope].filter(Boolean).join(' · '):`Vinnertid for ${label} på ${distance} er ikke bekreftet`;
  const visibleName=valid?(name||'Navn ikke oppgitt'):'Ikke bekreftet';
  return `<span class="race-winner-badge race-winner-${gender}${valid?'':' is-unavailable'}" title="${raceExtrasEscape(explanation)}"><span class="race-winner-gender" aria-hidden="true">${short}</span><span class="race-winner-copy"><span class="sr-only">Vinner ${label}, ${raceExtrasEscape(distance)}: </span><span class="race-winner-name">${raceExtrasEscape(visibleName)}</span><strong>${raceExtrasEscape(time)}</strong>${scope?`<span class="sr-only"> · ${raceExtrasEscape(scope)}</span>`:''}</span></span>`;
}

/** Standalone controls must be placed outside the race's expand/collapse button. */
export function renderRaceWinners(race,{instanceId,selectedDistance,clone=false}={}){
  const distances=raceWinnerDistances(race);
  if(!distances.length)return '';
  const current=distances.includes(selectedDistance)?selectedDistance:distances[0];
  const entries=Array.isArray(race?.winners)?race.winners:[];
  const raceName=typeof race?.name==='string'?race.name:'';
  const selector=distances.length>1?`<label class="race-winner-select"><span class="sr-only">Distanse for vinnertider${raceName?' i '+raceExtrasEscape(raceName):''}</span><select data-winner-distance${clone?' disabled tabindex="-1"':''}>${distances.map(distance=>`<option value="${raceExtrasEscape(distance)}"${distance===current?' selected':''}>${raceExtrasEscape(distance)}</option>`).join('')}</select></label>`:`<span class="race-winner-distance">${raceExtrasEscape(current)}</span>`;
  const panels=distances.map(distance=>{
    const entry=entries.find(candidate=>candidate?.distance===distance);
    const scope=typeof entry?.scope==='string'&&entry.scope!=='overall-gender'?entry.scope:'';
    return `<span class="race-winner-pair" data-winner-panel="${raceExtrasEscape(distance)}"${distance===current?'':' hidden'}>${renderRaceWinnerBadge(entry?.men,'men',distance,scope)}${renderRaceWinnerBadge(entry?.women,'women',distance,scope)}</span>`;
  }).join('');
  return `<div class="race-winners" data-race-winners="${raceExtrasEscape(race?.id??'')}"${instanceId?` data-winner-instance="${raceExtrasEscape(instanceId)}"`:''} role="group" aria-label="Vinnertider i løpet">${selector}<span class="race-winner-panels" aria-live="polite" aria-atomic="true">${panels}</span></div>`;
}

/** One delegated listener survives rerenders and synchronizes carousel copies. */
export function installRaceWinnerControls(root=document){
  if(!root||raceWinnerControlRoots.has(root))return;
  raceWinnerControlRoots.add(root);
  root.addEventListener('change',event=>{
    const select=event.target?.closest?.('[data-winner-distance]');
    if(!select||select.disabled)return;
    const wrapper=select.closest('[data-race-winners]');
    if(!wrapper||!root.contains(wrapper))return;
    const distance=select.value;
    if(!Array.from(select.options??[]).some(option=>option.value===distance))return;
    const raceId=wrapper.getAttribute('data-race-winners');
    const wrappers=raceId?Array.from(root.querySelectorAll('[data-race-winners]')).filter(node=>node.getAttribute('data-race-winners')===raceId):[wrapper];
    for(const node of wrappers){
      const panels=Array.from(node.querySelectorAll('[data-winner-panel]'));
      if(!panels.some(panel=>panel.getAttribute('data-winner-panel')===distance))continue;
      const control=node.querySelector('[data-winner-distance]');
      if(control)control.value=distance;
      for(const panel of panels)panel.hidden=panel.getAttribute('data-winner-panel')!==distance;
    }
  });
}

function raceNewsUrl(value){
  if(typeof value!=='string')return '';
  try{
    const url=new URL(value);
    if(url.protocol==='https:'&&!url.username&&!url.password&&!url.port&&['bratsbergfriidrett.no','www.bratsbergfriidrett.no'].includes(url.hostname))return url.href;
  }catch{}
  return '';
}

/** Only explicit club articles become news links; arbitrary URLs stay hidden. */
export function renderRaceNews(race,{compact=false,clone=false,embedded=false}={}){
  const articles=Array.isArray(race?.news)?race.news:[];
  const seen=new Set(),links=[];
  for(const article of articles){
    const url=raceNewsUrl(article?.url);
    if(!url||seen.has(url))continue;
    seen.add(url);
    const title=typeof article?.title==='string'?article.title.trim():'';
    const label=compact?'Klubboppslag':'Les klubboppslaget';
    links.push(`<a class="race-news-link" href="${raceExtrasEscape(url)}" target="${embedded?'_top':'_blank'}" rel="noopener noreferrer"${clone?' tabindex="-1"':''}${title?` title="${raceExtrasEscape(title)}" aria-label="${raceExtrasEscape(label+': '+title)}"`:''}><svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.4" aria-hidden="true"><path d="M4 3.5h12v13H4zM7 6.5h6M7 9.5h6M7 12.5h4"/></svg><span>${label}</span><span class="race-news-arrow" aria-hidden="true">↗</span></a>`);
  }
  return links.length?`<div class="race-news${compact?' is-compact':''}">${links.join('')}</div>`:'';
}
