import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAthleteCard,resultStatus,genderPosition,awardPosition} from '../dist/athlete-cards.js';

const runner={name:'Test Løper',athleteId:'test-loper',distance:'10 km',category:'K35-39'};
test('non-finishers never receive a time, rank, record badge or medal',()=>{
  for(const status of ['DNS','DNF','DSQ']){
    const result={...runner,status,time:status==='DSQ'?'31:57':null,position:1,positionScope:'gender',positionGender:1,positionGenderVerified:true,pb:true,clubRecord:true};
    const html=renderAthleteCard(result);
    assert.equal(resultStatus(result),status);
    assert.match(html,new RegExp(`>${status}</p>`));
    assert.match(html,status==='DNS'?/Ikke startet/:status==='DNF'?/Brutt/:/Diskvalifisert/);
    assert.doesNotMatch(html,/Nr\. 1|badge cr|badge pb|podium-|>null<|>31:57</);
  }
});
test('overall and age-class placings never appear as gender ranks or podiums',()=>{
  for(const positionScope of ['overall','class','ageGroup',undefined]){
    const html=renderAthleteCard({...runner,status:'finished',time:'31:57',position:1,positionScope});
    assert.match(html,/>31:57</);
    assert.match(html,/>K35-39</);
    assert.doesNotMatch(html,/Nr\.|podium-|badge cr|badge pb/);
  }
});
test('verified gender placing takes precedence over mixed-gender PDF placing',()=>{
  const html=renderAthleteCard({...runner,status:'finished',time:'31:57',position:4,positionScope:'overall',positionGender:2,positionGenderVerified:true});
  assert.match(html,/podium-silver/);
  assert.match(html,/Nr\. 2 kvinner/);
  assert.doesNotMatch(html,/Nr\. 4|podium-gold|podium-bronze|totalt/);
});
test('gender podium colors coexist with record and PB badges',()=>{
  for(const [position,medal] of [[1,'gold'],[2,'silver'],[3,'bronze'],[4,null]]){
    const html=renderAthleteCard({...runner,gender:'M',status:'finished',time:'31:57',position,positionScope:'gender',performanceHistory:{isPersonalBest:true,previousBest:'33:00'},clubRecord:true});
    assert.match(html,new RegExp('Nr\\. '+position+' menn'));
    assert.match(html,/badge cr/);assert.match(html,/badge pb/);
    if(medal)assert.match(html,new RegExp('podium-'+medal));
    else assert.doesNotMatch(html,/podium-/);
  }
});
test('gender placing requires an explicit verified source and positive integer',()=>{
  assert.equal(genderPosition({positionGender:1}),null);
  assert.equal(genderPosition({positionGender:1,positionGenderVerified:false,positionScope:'gender',position:1}),null);
  for(const position of [0,-1,1.5,'1',NaN,Infinity])assert.equal(genderPosition({positionGender:position,positionGenderVerified:true}),null);
  assert.doesNotMatch(renderAthleteCard({...runner,gender:null,category:null,time:'15:01',position:1,positionScope:'gender'}),/podium-|Nr\./);
});
test('legacy timed results still render and missing times are not finishers',()=>{
  assert.equal(resultStatus({...runner,time:'1:12:49'}),'finished');
  assert.equal(resultStatus({...runner,status:'finished',time:null}),'unknown');
  const html=renderAthleteCard({...runner,time:null});
  assert.match(html,/>—</);
  assert.match(html,/Tid mangler/);
});

test('a red club-record poster keeps a separate silver medal and full record label',()=>{
  const html=renderAthleteCard({...runner,gender:'K',time:'31:57',clubRecord:true,positionGender:2,positionGenderVerified:true});
  assert.match(html,/athlete-card is-record podium-silver/);
  assert.match(html,/award-medal medal-silver/);
  assert.match(html,/Sølv: /);
  assert.match(html,/Klubbrekord/);
  assert.doesNotMatch(html,/>KR(?: |<)/);
});
test('computed PBs keep their badge and age class without showing improvement margins',()=>{
  const legacy=renderAthleteCard({...runner,time:'31:57',pb:true,previousBest:'33:00'});
  assert.doesNotMatch(legacy,/is-pb|badge pb|athlete-card-improvement/);
  const computed=renderAthleteCard({...runner,time:'31:57',performanceHistory:{isPersonalBest:true,previousBest:'33:00'}});
  assert.match(computed,/is-pb/);
  assert.match(computed,/badge pb/);
  assert.match(computed,/>K35-39</);
  assert.doesNotMatch(computed,/athlete-card-improvement|−1 min 3 s/);
  assert.match(computed,/tidligere registrerte løp/);
});

test('track round context is escaped and heat placings cannot create podium cards',()=>{
  for(const positionScope of ['heat','round','qualifying']){
    const entry={...runner,time:'4:10.00',distance:'1500 m',gender:'K',position:1,positionGender:1,positionGenderVerified:true,positionScope,roundLabel:'Forsøk · heat 2 · 1. plass'};
    assert.equal(genderPosition(entry),null);
    const html=renderAthleteCard(entry);
    assert.match(html,/Forsøk · heat 2 · 1\. plass/);
    assert.doesNotMatch(html,/podium-|award-medal|Nr\. 1 kvinner/);
  }
  const final=renderAthleteCard({...runner,time:'4:10.00',distance:'1500 m',positionScope:'gender',positionGender:11,positionGenderVerified:true,roundLabel:'B-finale · 1. i heatet <test>'});
  assert.match(final,/Nr\. 11 kvinner/);
  assert.match(final,/B-finale · 1\. i heatet &lt;test&gt;/);
  assert.doesNotMatch(final,/podium-|<test>/);
});

test('explicit result date is shown with its round and invalid dates are omitted',()=>{
  const base={...runner,time:'32:28.89',distance:'10000 m'};
  const html=renderAthleteCard({...base,date:'2026-07-25',roundLabel:'Finale'});
  assert.match(html,/<p class="athlete-card-round"><time datetime="2026-07-25">25\. juli<\/time> · Finale<\/p>/);
  for(const date of ['2026-02-30','not-a-date','2026-07-25<script>',null]){
    const invalid=renderAthleteCard({...base,date,roundLabel:'Finale'});
    assert.doesNotMatch(invalid,/<time|<script>|Invalid Date/);
    assert.match(invalid,/<p class="athlete-card-round">Finale<\/p>/);
  }
  assert.doesNotMatch(renderAthleteCard(base),/athlete-card-round/);
});

test('verified championship class awards show the exact class without changing gender ranking semantics',()=>{
  const base={...runner,time:'5:53.69',distance:'2000 m',positionScope:'class',awardScope:'championship-class',positionClassVerified:true};
  for(const [positionClass,category,medal] of [[1,'G16','gold'],[2,'J15','silver'],[3,'G15','bronze'],[7,'U20',null]]){
    const result={...base,positionClass,category};
    assert.equal(genderPosition(result),null);
    assert.equal(awardPosition(result),positionClass);
    const html=renderAthleteCard(result);
    assert.match(html,new RegExp(`Nr\\. ${positionClass} ${category}`));
    assert.match(html,new RegExp(`>${category}<`));
    assert.doesNotMatch(html,/Nr\. \d+ kvinner|Nr\. \d+ menn/);
    if(medal)assert.match(html,new RegExp('podium-'+medal));
    else assert.doesNotMatch(html,/podium-|award-medal/);
  }
});

test('ordinary age-class wins and unverified or heat class placings cannot create championship awards',()=>{
  const base={...runner,time:'35:00',position:1,positionScope:'class',positionClass:1,positionClassVerified:true};
  for(const result of [base,{...base,awardScope:'class'},...[
    {positionClassVerified:false},{positionClassVerified:undefined},{positionClass:0},{positionClass:1.5},{positionClass:'1'},{category:''},{category:null},
    {positionScope:'heat'},{positionScope:'round'},{positionScope:'qualifying'}
  ].map(extra=>({...base,awardScope:'championship-class',...extra}))]){
    assert.equal(awardPosition(result),null);
    assert.doesNotMatch(renderAthleteCard(result),/podium-|award-medal|Nr\. 1/);
  }
  const escaped=renderAthleteCard({...base,awardScope:'championship-class',category:'U20 <test>'});
  assert.match(escaped,/Nr\. 1 U20 &lt;test&gt;/);
  assert.doesNotMatch(escaped,/<test>/);
});
