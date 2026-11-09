import {esc,initials} from './data.js';
import {renderPortraitImage} from './portrait.js';

const osloDay = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Europe/Oslo', year: 'numeric', month: '2-digit', day: '2-digit'
});

export function selectUpcomingEvents(events, now = new Date()) {
  const today = osloDay.format(now);
  return events
    .filter(event => /^\d{4}-\d{2}-\d{2}$/.test(event.date) && event.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

/** Oslo midnight always falls on a UTC hour boundary, including across DST changes. */
export function watchUpcomingEvents(events, render) {
  const hour = 60 * 60 * 1000;
  let timer;
  let displayed;

  function refresh() {
    clearTimeout(timer);
    const now = new Date();
    const upcoming = selectUpcomingEvents(events, now);
    if (!displayed || upcoming.length !== displayed.length ||
        upcoming.some((event, index) => event !== displayed[index])) {
      displayed = upcoming;
      render(upcoming);
    }
    if (!document.hidden) timer = setTimeout(refresh, hour - now.getTime() % hour);
  }

  document.addEventListener('visibilitychange', refresh);
  window.addEventListener('pagehide', () => clearTimeout(timer));
  window.addEventListener('pageshow', refresh);
  refresh();
}

/** Calendar entries use the resolved athlete ID, just like result and relay cards. */
export function renderCalendarParticipant(person,portraits={}){
  const name=String(person?.name||'Ukjent utøver');
  const photo=person?.athleteId?portraits?.[person.athleteId]:null;
  return `<article class="calendar-person"><span class="calendar-person-photo" aria-hidden="true"><span>${esc(initials(name))}</span>${renderPortraitImage(photo,{width:80,height:100})}</span><span class="calendar-person-details"><strong>${esc(name)}</strong>${person?.distance?`<span class="calendar-person-distance">${esc(person.distance)}</span>`:''}</span></article>`;
}

/** Decorative previews share the exact same photo/crop as the expanded entries. */
export function renderParticipantPreview(participants,portraits={}, {limit=3}={}){
  const people=Array.isArray(participants)?participants:[];
  const count=Number.isInteger(limit)?Math.max(0,Math.min(limit,6)):3;
  if(!people.length||!count)return '';
  return `<span class="participant-preview" aria-hidden="true">${people.slice(0,count).map(person=>{
    const name=String(person?.name||'Ukjent utøver');
    const photo=person?.athleteId?portraits?.[person.athleteId]:null;
    return `<span class="participant-preview-photo"><span>${esc(initials(name))}</span>${renderPortraitImage(photo,{width:32,height:40})}</span>`;
  }).join('')}</span>`;
}
