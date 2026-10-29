import {findRecordCandidates} from './record-check.js';
import {applyAthleteRegistry} from './athlete-registry.js';
import {derivePerformanceHistory,isFinishedResult,collectManualPersonalBests} from './performance-history.js';
const base = new URL('.', import.meta.url);
export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const dateParts = s => {const date = new Date(s+'T12:00:00');return {day:date.getDate(),month:new Intl.DateTimeFormat('nb-NO',{month:'short'}).format(date).replace('.',''),full:new Intl.DateTimeFormat('nb-NO',{day:'numeric',month:'long',year:'numeric'}).format(date)};};
export const shortDate = s => new Intl.DateTimeFormat('nb-NO',{day:'numeric',month:'short'}).format(new Date(s+'T12:00:00'));
export const initials = s => s.split(' ').map(x=>x[0]).slice(0,2).join('');
export const badges = r => (r.clubRecord?'<span class="badge cr" title="Bekreftet klubbrekord"><span class="award-icon" aria-hidden="true">★</span> Klubbrekord</span>':'')+(r.performanceHistory?.isPersonalBest?`<span class="badge pb" title="${r.performanceHistory.hasManualBaseline?'Forbedring mot beste kjente tid, inkludert manuelt registrerte perser':'Forbedring mot tidligere registrerte løp; eldre perser kan mangle'}">PB</span>`:'');
export const dateTile = s => {const d=dateParts(s);return `<span class="date-tile"><strong>${d.day}</strong><span>${esc(d.month)}</span></span>`;};
export const participantCount = race => new Set(race.results.map((r,index)=>r.athleteId||'unresolved:'+index)).size;
export const avatarStack = names => `<span class="avatar-stack" aria-hidden="true">${names.slice(0,3).map((n,i)=>`<span class="avatar avatar-${i}">${esc(initials(n))}</span>`).join('')}</span>`;
export async function getJSON(path){const url=new URL(path,base);if(url.origin!==base.origin)throw new Error('Data må ligge på samme nettsted.');const response=await fetch(url,{cache:'no-cache'});if(!response.ok)throw new Error('Kunne ikke hente '+path);return response.json();}
/** Keep source rows for audit; expose only completed performances to every view. */
export function prepareResultsData(input){
  const resolved=applyAthleteRegistry(input);
  const races=derivePerformanceHistory(resolved.races,resolved.athletes).map(race=>({...race,results:race.results.filter(isFinishedResult)})).filter(race=>race.results.length);
  const personalBestIssues=collectManualPersonalBests(resolved.athletes).issues;
  return {...resolved,races,personalBestIssues,recordCandidates:findRecordCandidates(races,resolved.records)};
}
export async function loadData(){
  const index=await getJSON('data/index.json');
  if(!Array.isArray(index.races))throw new Error('Ugyldig løpsoversikt.');
  const [races,records,upcoming,portraits,relays,athletes]=await Promise.all([
    Promise.all(index.races.map(getJSON)),getJSON(index.records),getJSON(index.upcoming),
    index.portraits?getJSON(index.portraits).catch(()=>({})):Promise.resolve({}),
    index.relays?getJSON(index.relays):Promise.resolve([]),
    index.athletes?getJSON(index.athletes):Promise.resolve(null)
  ]);
  races.forEach(r=>{if(!r.id||!r.name||!Array.isArray(r.results)||!Array.isArray(r.distances))throw new Error('Ugyldig løpsdata.');});
  return prepareResultsData({...index,races:races.sort((a,b)=>b.date.localeCompare(a.date)),records,
    upcoming:upcoming.sort((a,b)=>a.date.localeCompare(b.date)),
    portraits:portraits&&typeof portraits==='object'&&!Array.isArray(portraits)?portraits:{},
    relays,athletes});
}
export function showError(el){el.innerHTML='<div class="error-state"><strong>Resultatene er ikke tilgjengelige akkurat nå.</strong><p>Prøv å laste siden på nytt.</p><button class="solid-button" type="button">Prøv igjen</button></div>';el.querySelector('button').addEventListener('click',()=>location.reload());}
