import {esc,initials} from './data.js';
import {renderPortraitImage} from './portrait.js';

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
