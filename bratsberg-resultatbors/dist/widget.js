import {esc,shortDate} from './data.js';
import {renderAthleteCard,installPortraitFallback,awardPosition} from './athlete-cards.js';
import {createCarouselClock} from './carousel-clock.js';
import {parsePerformanceTime} from './record-check.js';
import {compareResultTimes} from './result-order.js';
import {renderRaceWinners,installRaceWinnerControls,renderRaceNews} from './race-extras.js';

/** Only published club results belong on the front page; newest ten first. */
export function selectWidgetRaces(races) {
  return (Array.isArray(races)?races:[]).filter(Boolean).sort((a,b)=>String(b.date??'').localeCompare(String(a.date??''))||String(a.id??'').localeCompare(String(b.id??''))).slice(0,10);
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
  const position=awardPosition(result);
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
  const slots=createWidgetSlots(data.races),target=embedded?' target="_top"':'',clock=createCarouselClock();
  const viewportId=el.id?el.id+'-viewport':'';
  const controlsViewport=viewportId?` aria-controls="${esc(viewportId)}"`:'';
  const card=(race,clone=false)=>{
    if(!race)return renderWidgetPlaceholder();
    const href=`resultater.html#lop/${encodeURIComponent(race.id)}`,tab=clone?' tabindex="-1"':'';
    const highlights=selectWidgetHighlights(race);
    return `<article class="bf-card" aria-label="${esc(race.name)}"><div class="bf-race-heading"><h3><a href="${href}"${target}${tab}>${esc(race.name)}</a></h3></div><div class="bf-race-metadata">${renderRaceWinners(race,{clone})}<time datetime="${esc(race.date)}">${esc(shortDate(race.date))}</time></div><div class="athlete-grid bf-athlete-grid">${highlights.map(r=>renderAthleteCard(r,data.portraits,{compact:true})).join('')}</div><div class="bf-card-footer">${renderRaceNews(race,{compact:true,clone,embedded})}<a class="bf-card-link" href="${href}"${target}${tab}>Se alle ${race.results.length} klubbresultater <span aria-hidden="true">↗</span></a></div></article>`;
  };
  el.innerHTML=`
    <div class="bf-titlebar">
      <div class="bf-brandline"><span class="bf-brand-dot" aria-hidden="true"></span><div><p class="eyebrow">BRATSBERG FRIIDRETT</p><h2>Resultatbørsen<span>.</span></h2></div></div>
      <a class="bf-portal-link" href="resultater.html"${target}>Åpne resultatportalen <span aria-hidden="true">↗</span></a>
      <div class="bf-track-art" aria-hidden="true"></div>
    </div>
    <div class="bf-carousel">
      <div class="bf-toolbar">
        <span class="bf-section-label"><span class="bf-heading-dot"></span>Siste løp</span>
        <div class="bf-navigation" role="group" aria-label="Bla mellom løp">
          <button type="button" class="bf-page-button bf-prev"${controlsViewport}><span aria-hidden="true">←</span> Forrige</button>
          <span class="bf-position"></span>
          <button type="button" class="bf-page-button bf-next"${controlsViewport}>Neste <span aria-hidden="true">→</span></button>
        </div>
        <div class="bf-controls">
          <span class="bf-motion-label">Neste om ${clock.read().remaining} s</span>
          <button class="bf-motion-button" type="button" aria-label="Sett automatisk blaing på pause" aria-pressed="false" title="Pause">
            <svg viewBox="0 0 44 44" aria-hidden="true"><circle class="bf-clock-track" cx="22" cy="22" r="19"/><circle class="bf-clock-progress" cx="22" cy="22" r="19" pathLength="100"/></svg>
            <span class="bf-timer-glyph" aria-hidden="true">Ⅱ</span>
          </button>
        </div>
      </div>
      <div class="bf-viewport"${viewportId?` id="${esc(viewportId)}"`:''} tabindex="0" role="region" aria-roledescription="karusell" aria-label="Siste løp – sveip eller bruk piltastene">
        <div class="bf-track">
          <div class="bf-group" aria-hidden="true" inert>${slots.map(r=>card(r,true)).join('')}</div>
          <div class="bf-group bf-original">${slots.map(r=>card(r)).join('')}</div>
          <div class="bf-group" aria-hidden="true" inert>${slots.map(r=>card(r,true)).join('')}</div>
        </div>
      </div>
      <div class="bf-bottom"><div class="bf-dots" role="group" aria-label="Velg visning"></div></div>
      <span class="bf-announcement sr-only" role="status"></span>
    </div>`;
  const viewport=el.querySelector('.bf-viewport'),original=el.querySelector('.bf-original'),motion=el.querySelector('.bf-motion-button'),label=el.querySelector('.bf-motion-label'),dots=el.querySelector('.bf-dots'),position=el.querySelector('.bf-position'),ring=el.querySelector('.bf-clock-progress'),glyph=el.querySelector('.bf-timer-glyph');
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const count=slots.length,mod=n=>(n%count+count)%count;
  const navigation=el.querySelector('.bf-navigation');
  const announcement=el.querySelector('.bf-announcement');
  let userPaused=reduced.matches,keyboardPaused=false,visible=true,ready=false,moving=false,disposed=false;
  let stride=0,period=0,current=0,perView=2,settleTimer=0,resizeFrame=0,raf=0,last=0,interactionUntil=0,lastLabel='',resumeRequested=false;
  let targetSlot=null,announceOnSettle=false;
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
    const lastVisible=mod(current+perView-1)+1;
    const shown=perView===1?String(current+1):`${current+1}–${lastVisible}`;
    position.textContent=shown+' av '+count;
    // Keep Tab within the visible races after a button, swipe or resize.
    for(let i=0;i<original.children.length;i++){
      const card=original.children[i];
      const visible=mod(i-current)<perView;
      if(!visible&&card.contains(document.activeElement))viewport.focus({preventScroll:true});
      card.inert=!visible;
    }
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
    moving=false;
    targetSlot=null;
    if(announceOnSettle){
      const names=Array.from({length:perView},(_,i)=>slots[mod(current+i)]?.name||'Her kommer det flere løp snart');
      announcement.textContent='Viser '+position.textContent+': '+names.join(' og ')+'.';
      announceOnSettle=false;
    }
    paintClock();
  }
  function goToSlot(index,manual){
    if(!ready||!canMove())return;
    // Both adjacent copies contain the same slots as the central group.
    if(index<0)index+=count;
    if(index>3*count-perView)index-=count;
    targetSlot=index;
    announceOnSettle=manual;
    clock.reset();
    moving=true;
    if(manual)interactionUntil=performance.now()+800;
    viewport.scrollTo({left:index*stride,behavior:behavior()});
    clearTimeout(settleTimer);
    settleTimer=setTimeout(settle,700);
  }
  function move(delta,manual=true){
    if(!ready||!canMove())return;
    const index=targetSlot??Math.round(viewport.scrollLeft/stride/perView)*perView;
    goToSlot(index+delta,manual);
  }
  function measure(){
    if(!viewport.clientWidth)return;
    const nextPerView=Math.min(count,viewport.clientWidth<=700?1:2);
    const gap=parseFloat(getComputedStyle(original).columnGap)||20;
    const cardWidth=(viewport.clientWidth-gap*(nextPerView-1))/nextPerView;
    const unchanged=ready&&nextPerView===perView&&Math.abs(stride-cardWidth-gap)<.5;
    if(unchanged)return;
    perView=nextPerView;
    current=Math.floor(current/perView)*perView;
    el.dataset.perView=String(perView);
    targetSlot=null;
    announceOnSettle=false;
    el.style.setProperty('--bf-visible',String(perView));el.style.setProperty('--bf-card-width',`${cardWidth}px`);
    stride=original.firstElementChild.getBoundingClientRect().width+gap;period=stride*count;
    if(!stride)return;
    viewport.scrollTo({left:period+current*stride,behavior:'instant'});
    viewport.style.overflowX=canMove()?'auto':'hidden';
    dots.innerHTML=Array.from({length:Math.ceil(count/perView)},(_,i)=>`<button type="button" data-page="${i}"${controlsViewport}${canMove()?'':' disabled'} aria-label="Vis plass ${i*perView+1}${perView>1?' og '+Math.min(i*perView+2,count):''}" aria-pressed="false"></button>`).join('');
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
  dots.addEventListener('click',event=>{
    const button=event.target.closest('[data-page]');
    if(button)goToSlot(count+Number(button.dataset.page)*perView,true);
  });
  viewport.addEventListener('scroll',()=>{moving=true;clearTimeout(settleTimer);settleTimer=setTimeout(settle,180);},{passive:true});
  viewport.addEventListener('scrollend',settle);
  // Reading with the mouse no longer leaves autoplay stuck. Manual scrolling gets a short grace period.
  viewport.addEventListener('pointerdown',()=>{targetSlot=null;announceOnSettle=false;interactionUntil=performance.now()+1200;clock.reset();keyboardPaused=false;});
  viewport.addEventListener('wheel',e=>{if(Math.abs(e.deltaX)>2){interactionUntil=performance.now()+1200;clock.reset();}},{passive:true});
  const carousel=el.querySelector('.bf-carousel');
  function updateFocusPause(){
    const focused=document.activeElement;
    keyboardPaused=focused!==motion&&carousel.contains(focused)&&focused.matches(':focus-visible');
    paintClock();
  }
  carousel.addEventListener('focusin',updateFocusPause);
  carousel.addEventListener('focusout',()=>queueMicrotask(updateFocusPause));
  carousel.addEventListener('keydown',event=>{
    if(event.altKey||event.ctrlKey||event.metaKey||event.shiftKey)return;
    if(event.target!==viewport&&!navigation.contains(event.target))return;
    if(event.key!=='ArrowLeft'&&event.key!=='ArrowRight')return;
    event.preventDefault();
    keyboardPaused=true;
    move(event.key==='ArrowLeft'?-perView:perView);
  });
  const motionPreferenceChanged=event=>{
    if(event.matches){userPaused=true;last=0;paintClock();}
  };
  reduced.addEventListener('change',motionPreferenceChanged);
  installPortraitFallback(el);
  installRaceWinnerControls(el);
  const visibility=()=>{last=0;};document.addEventListener('visibilitychange',visibility);
  const intersection=new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;last=0;});intersection.observe(el);
  window.addEventListener('pageshow',()=>{last=0;measure();});
  window.addEventListener('pagehide',event=>{last=0;if(event.persisted)return;disposed=true;cancelAnimationFrame(raf);cancelAnimationFrame(resizeFrame);clearTimeout(settleTimer);observer.disconnect();intersection.disconnect();reduced.removeEventListener('change',motionPreferenceChanged);document.removeEventListener('visibilitychange',visibility);});
  measure();raf=requestAnimationFrame(tick);
}
