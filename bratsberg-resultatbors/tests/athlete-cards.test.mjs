import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAthleteCard,resultStatus,genderPosition} from '../dist/athlete-cards.js';

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
test('only computed historical improvements create PB styling and improvement text',()=>{
  const legacy=renderAthleteCard({...runner,time:'31:57',pb:true,previousBest:'33:00'});
  assert.doesNotMatch(legacy,/is-pb|badge pb|athlete-card-improvement/);
  const computed=renderAthleteCard({...runner,time:'31:57',performanceHistory:{isPersonalBest:true,previousBest:'33:00'}});
  assert.match(computed,/is-pb/);
  assert.match(computed,/badge pb/);
  assert.match(computed,/−1 min 3 s/);
  assert.match(computed,/tidligere registrerte løp/);
});
