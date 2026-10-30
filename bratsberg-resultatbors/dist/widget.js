import {esc,shortDate} from './data.js';
import {renderAthleteCard,installPortraitFallback,genderPosition} from './athlete-cards.js';
import {createCarouselClock} from './carousel-clock.js';
import {parsePerformanceTime} from './record-check.js';
import {compareResultTimes} from './result-order.js';
import {renderRaceWinners,installRaceWinnerControls,renderRaceNews} from './race-extras.js';

/** Only published club results belong on the front page; newest ten first. */
export function selectWidgetRaces(races) {
  return (Array.isArray(races)?races:[]).filter(race=>race?.demo===false).sort((a,b)=>String(b.date??'').localeCompare(String(a.date??''))).slice(0,10);
}

/** Null slots are presentation-only: never pretend that an event exists. */
export function createWidgetSlots(races) {
  const selected=selectWidgetRaces(races);
  return Array.from({length:10},(_,index)=>selected[index]??null);
}

export function renderWidgetPlaceholder() {
  return '<article class="bf-card bf-placeholder" aria-label="Her kommer det flere løp snart"><div class="bf-placeholder-content"><span class="bf-placeholder-mark" aria-hidden="true">…</span><h3>Her kommer det flere løp snart</h3></div></article>';
}

const widgetAwardPriority=result=>{
  if(result.clubRecord)return 0;
  const gender=result.gender||result.category?.[0];
  const position=['K','M'].includes(gender)?genderPosition(result):null;
  return position>=1&&position<=3?position:4;
};

/** Automatic row-major order: club record, gold, silver, bronze, then others. */
export function selectWidgetHighlights(race) {
  const finishers=(Array.isArray(race.results)?race.results:[]).filter(result=>
    result && (!result.status || ['OK','FINISHED','VALID'].includes(String(result.status).trim().toUpperCase()))
    && parsePerformanceTime(result.time)!==null);
  // Numeric time breaks ties within an award tier; equal times retain source order.
  const ordered=finishers.sort((a,b)=>widgetAwardPriority(a)-widgetAwardPriority(b)||compareResultTimes(a,b));
  const selected=[],seen=new Set();
  for(const result of ordered){
    const key=typeof result.athleteId==='string'&&result.athleteId.trim()?result.athleteId:result;
    if(seen.has(key))continue;
    seen.add(key);selected.push(result);
    if(selected.length===6)break;
  }
  return selected;
}

/** Two race grids. Duplicate groups join the strip; the clock is independent of layout. */
export function mountWidget(el,data,{embedded=false}={}) {
  const slots=createWidgetSlots(data.races),raceCount=slots.filter(Boolean).length,target=embedded?' target="_top"':'',clock=createCarouselClock();
  const card=(race,clone=false)=>{
    if(!race)return renderWidgetPlaceholder();
    const href=`resultater.html#lop/${encodeURIComponent(race.id)}`,tab=clone?' tabindex="-1"':'';
    const highlights=selectWidgetHighlights(race);
    return `<article class="bf-card" aria-label="${esc(race.name)}"><div class="bf-race-heading"><h3><a href="${href}"${target}${tab}>${esc(race.name)}</a></h3></div><div class="bf-race-metadata">${renderRaceWinners(race,{clone})}<time datetime="${esc(race.date)}">${esc(shortDate(race.date))}</time></div><div class="athlete-grid bf-athlete-grid">${highlights.map(r=>renderAthleteCard(r,data.portraits,{compact:true})).join('')}</div><div class="bf-card-footer">${renderRaceNews(race,{compact:true,clone,embedded})}<a class="bf-card-link" href="${href}"${target}${tab}>Se alle ${race.results.length} klubbresultater <span aria-hidden="true">↗</span></a></div></article>`;
  };
  el.innerHTML=`<div class="bf-titlebar"><div class="bf-brandline"><span class="bf-brand-dot" aria-hidden="true"></span><div><p class="eyebrow">BRATSBERG FRIIDRETT</p><h2>Resultatbørsen<span>.</span></h2></div></div><a class="bf-portal-link" href="resultater.html"${target}>Åpne resultatportalen <span aria-hidden="true">↗</span></a><div class="bf-track-art" aria-hidden="true"></div></div><div class="bf-carousel"><div class="bf-toolbar"><span class="bf-section-label"><span class="bf-heading-dot"></span> SISTE LØP</span><div class="bf-controls"><span class="bf-motion-label">Neste om ${clock.read().remaining} s</span><button class="bf-motion-button" type="button" aria-label="Sett automatisk blaing på pause" aria-pressed="false" title="Pause"><svg viewBox="0 0 44 44" aria-hidden="true"><circle class="bf-clock-track" cx="22" cy="22" r="19"/><circle class="bf-clock-progress" cx="22" cy="22" r="19" pathLength="100"/></svg><span class="bf-timer-glyph" aria-hidden="true">Ⅱ</span></button></div></div><div class="bf-viewport" tabindex="0" role="region" aria-roledescription="karusell" aria-label="Siste løp – sveip eller bruk piltastene"><div class="bf-track"><div class="bf-group" aria-hidden="true">${slots.map(r=>card(r,true)).join('')}</div><div class="bf-group bf-original">${slots.map(r=>card(r)).join('')}</div><div class="bf-group" aria-hidden="true">${slots.map(r=>card(r,true)).join('')}</div></div></div><div class="bf-bottom"><span class="bf-position"></span><div class="bf-dots" aria-label="Velg løpsgruppe"></div><div class="bf-arrows"><button type="button" class="bf-prev" aria-label="Forrige løp">←</button><button type="button" class="bf-next" aria-label="Neste løp">→</button></div></div></div>`;
  const viewport=el.querySelector('.bf-viewport'),original=el.querySelector('.bf-original'),motion=el.querySelector('.bf-motion-button'),label=el.querySelector('.bf-motion-label'),dots=el.querySelector('.bf-dots'),position=el.querySelector('.bf-position'),ring=el.querySelector('.bf-clock-progress'),glyph=el.querySelector('.bf-timer-glyph');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const count=slots.length,mod=n=>(n%count+count)%count;
  // Autoplay starts normally. Reduced-motion affects transitions, not the play state.
  let userPaused=false,keyboardPaused=false,visible=true,ready=false,moving=false,disposed=false;
  let stride=0,period=0,current=0,perView=2,settleTimer=0,resizeFrame=0,raf=0,last=0,interactionUntil=0,lastLabel='',resumeRequested=false;
  const canMove=()=>count>perView;
  const blocked=timestamp=>userPaused||keyboardPaused||!visible||document.hidden||!ready||moving||timestamp<interactionUntil||!canMove();
  const behavior=()=>reduced.matches?'instant':'smooth';
  function paintClock(state=clock.read()){
    ring.style.strokeDashoffset=String(100-state.progress*100);
    let text=!canMove()?'Alle løp vises':userPaused?'Pauset':keyboardPaused?'Tastaturpause':`Neste om ${state.remaining} s`;
    if(text!==lastLabel){label.textContent=text;lastLabel=text;}
    const wantsResume=userPaused||keyboardPaused;
    glyph.textContent=wantsResume?'▶':'Ⅱ';
    motion.setAttribute('aria-pressed',String(wantsResume));
    motion.setAttribute('aria-label',wantsResume?'Start automatisk blaing':'Sett automatisk blaing på pause');
    motion.title=wantsResume?'Start':'Pause';motion.disabled=!canMove();
  }
  function updatePosition(){
    current=mod(Math.round((viewport.scrollLeft-period)/stride));
    const final=mod(current+Math.min(perView,count)-1);
    position.innerHTML=`<span>Plass </span><strong>${String(current+1).padStart(2,'0')}${perView>1&&count>1?'–'+String(final+1).padStart(2,'0'):''}</strong><span> / ${count}</span><span class="bf-race-count">${raceCount} løp i visningen</span>`;
    [...dots.children].forEach((b,i)=>{const active=i===Math.floor(current/perView);b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
  }
  function settle(){
    clearTimeout(settleTimer);if(!ready||!period)return;
    let x=viewport.scrollLeft;
    if(x<period-stride/2)x+=period;
    else if(x>=2*period-stride/2)x-=period;
    if(Math.abs(x-viewport.scrollLeft)>1)viewport.scrollTo({left:x,behavior:'instant'});
    const previous=current;updatePosition();
    if(previous!==current)clock.reset();
    moving=false;paintClock();
  }
  function move(delta,manual=true){
    if(!ready||!canMove())return;
    clock.reset();moving=true;
    if(manual)interactionUntil=performance.now()+800;
    const index=Math.round(viewport.scrollLeft/stride);
    viewport.scrollTo({left:(index+delta)*stride,behavior:behavior()});
    clearTimeout(settleTimer);settleTimer=setTimeout(settle,700);
  }
  function measure(){
    if(!viewport.clientWidth)return;
    const nextPerView=Math.min(count,viewport.clientWidth<=700?1:2);
    const gap=parseFloat(getComputedStyle(original).columnGap)||20;
    const cardWidth=(viewport.clientWidth-gap*(nextPerView-1))/nextPerView;
    const unchanged=ready&&nextPerView===perView&&Math.abs(stride-cardWidth-gap)<.5;
    if(unchanged)return;
    perView=nextPerView;
    el.style.setProperty('--bf-visible',String(perView));el.style.setProperty('--bf-card-width',`${cardWidth}px`);
    stride=original.firstElementChild.getBoundingClientRect().width+gap;period=stride*count;
    if(!stride)return;
    viewport.scrollTo({left:period+current*stride,behavior:'instant'});
    viewport.style.overflowX=canMove()?'auto':'hidden';
    dots.innerHTML=Array.from({length:Math.ceil(count/perView)},(_,i)=>`<button type="button" data-page="${i}"${canMove()?'':' disabled'} aria-label="Vis plass ${i*perView+1}${perView>1?' og '+Math.min(i*perView+2,count):''}" aria-pressed="false"></button>`).join('');
    el.querySelector('.bf-prev').disabled=!canMove();el.querySelector('.bf-next').disabled=!canMove();
    ready=true;updatePosition();paintClock();
  }
  function tick(timestamp){
    const delta=last?Math.min(timestamp-last,250):0;last=timestamp;
    const state=clock.advance(delta,blocked(timestamp));paintClock(state);
    if(state.due)move(perView,false);
    if(!disposed)raf=requestAnimationFrame(tick);
  }
  const observer=new ResizeObserver(()=>{cancelAnimationFrame(resizeFrame);resizeFrame=requestAnimationFrame(measure);});observer.observe(viewport);
  motion.addEventListener('pointerdown',()=>{resumeRequested=userPaused||keyboardPaused;});
  motion.addEventListener('pointercancel',()=>{resumeRequested=false;});
  motion.addEventListener('click',()=>{userPaused=!(resumeRequested||userPaused||keyboardPaused);resumeRequested=false;keyboardPaused=false;last=0;paintClock();});
  el.querySelector('.bf-prev').addEventListener('click',()=>move(-perView));el.querySelector('.bf-next').addEventListener('click',()=>move(perView));
  dots.addEventListener('click',e=>{const b=e.target.closest('[data-page]');if(!b||!canMove())return;clock.reset();moving=true;interactionUntil=performance.now()+800;viewport.scrollTo({left:period+Number(b.dataset.page)*perView*stride,behavior:behavior()});clearTimeout(settleTimer);settleTimer=setTimeout(settle,700);});
  viewport.addEventListener('scroll',()=>{moving=true;clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);},{passive:true});
  viewport.addEventListener('scrollend',settle);
  // Reading with the mouse no longer leaves autoplay stuck. Manual scrolling gets a short grace period.
  viewport.addEventListener('pointerdown',()=>{interactionUntil=performance.now()+1200;clock.reset();keyboardPaused=false;});
  viewport.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>2){interactionUntil=performance.now()+1200;clock.reset();}},{passive:true});
  viewport.addEventListener('focusin',e=>{keyboardPaused=e.target.matches(':focus-visible');paintClock();});
  viewport.addEventListener('focusout',()=>queueMicrotask(()=>{keyboardPaused=viewport.contains(document.activeElement)&&document.activeElement.matches(':focus-visible');paintClock();}));
  viewport.addEventListener('keydown',e=>{if(e.target===viewport&&(e.key==='ArrowLeft'||e.key==='ArrowRight')){e.preventDefault();keyboardPaused=true;move(e.key==='ArrowLeft'?-perView:perView);}});
  installPortraitFallback(el);
  installRaceWinnerControls(el);
  const visibility=()=>{last=0;};document.addEventListener('visibilitychange',visibility);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;});intersection.observe(el);
  window.addEventListener('pageshow',()=>{last=0;measure();});
  window.addEventListener('pagehide',event=>{last=0;if(event.persisted)return;disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);clearTimeout(settleTimer);observer.disconnect();intersection.disconnect();document.removeEventListener('visibilitychange',visibility);});
  measure();raf=requestAnimationFrame(tick);
}
