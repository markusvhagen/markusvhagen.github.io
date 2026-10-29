import test from 'node:test';
import assert from 'node:assert/strict';
import {collectManualPersonalBests,derivePerformanceHistory} from '../dist/performance-history.js';
import {prepareResultsData} from '../dist/data.js';

const result=(time,extra={})=>({athleteId:'runner',name:'Runner',distance:'10 km',status:'finished',time,...extra});
const race=(id,date,time,extra={})=>({id,name:id,date,type:'road',demo:false,distances:['10 km'],results:[result(time)],...extra});
const pb=(time,date='2025-09-14',extra={})=>({type:'road',distance:'10 km',time,date,...extra});
const registry=personalBests=>({athletes:[{id:'runner',name:'Runner',kind:'member',personalBests}]});
const history=event=>event.results[0].performanceHistory;

test('an undated PB only establishes a baseline after its explicit known-by date',()=>{
  const athletes=registry([{type:'road',distance:'5 km',time:'18:11',date:null,asOf:'2026-10-29'}]);
  const makeRace=(id,date,time)=>race(id,date,time,{results:[result(time,{distance:'5 km'})]});
  const input=[makeRace('older','2026-01-01','18:30'),makeRace('known-day','2026-10-29','18:20'),makeRace('future','2026-11-08','18:10')];
  const before=JSON.stringify({input,athletes});
  const out=derivePerformanceHistory(input,athletes);
  assert.equal(history(out[0]).previousBest,null);
  assert.equal(history(out[1]).previousBest,'18:30');
  assert.equal(history(out[1]).hasManualBaseline,false);
  assert.equal(history(out[2]).previousBest,'18:11');
  assert.equal(history(out[2]).isPersonalBest,true);
  assert.equal(history(out[2]).improvementSeconds,1);
  assert.equal(history(out[2]).previousPersonalBests[0].date,null);
  assert.equal(history(out[2]).previousPersonalBests[0].asOf,'2026-10-29');
  assert.equal(JSON.stringify({input,athletes}),before);
  const noDate=registry([{type:'road',distance:'5 km',time:'18:11',asOf:'2026-10-29'}]);
  assert.equal(collectManualPersonalBests(noDate).entries.length,1);
  for(const entry of [
    {type:'road',distance:'5 km',time:'18:11',date:null,asOf:'2026-02-30'},
    {type:'road',distance:'5 km',time:'18:11',date:'incorrect',asOf:'2026-10-29'}
  ]){
    const checked=collectManualPersonalBests(registry([entry]));
    assert.equal(checked.entries.length,0);
    assert.equal(checked.issues.length,1);
  }
});

test('an earlier manual PB establishes a baseline for the first archived race without changing sources',()=>{
  const athletes=registry([pb('40:00','2025-09-14',{eventName:'Earlier race',source:'Member supplied'})]);
  const races=[race('first','2026-01-01','39:00')];
  const snapshot=JSON.stringify({athletes,races});
  const out=derivePerformanceHistory(races,athletes),h=history(out[0]);
  assert.equal(h.isPersonalBest,true);
  assert.equal(h.previousBest,'40:00');
  assert.equal(h.improvementSeconds,60);
  assert.equal(h.hasManualBaseline,true);
  assert.equal(h.basis,'manual-and-recorded-history');
  assert.deepEqual(h.previousRaceIds,[]);
  assert.deepEqual(h.previousPersonalBests,[{athleteId:'runner',index:0,date:'2025-09-14',time:'40:00',type:'road',distance:'10 km',eventName:'Earlier race',source:'Member supplied'}]);
  assert.deepEqual(derivePerformanceHistory(races,athletes.athletes),out);
  assert.equal(out.length,1);
  assert.equal(out[0].results.length,1);
  h.previousPersonalBests[0].time='changed in output';
  assert.equal(JSON.stringify({athletes,races}),snapshot);
});

test('same-day and future manual PBs do not establish earlier baselines, but count towards the known best',()=>{
  const athletes=registry([pb('40:00','2026-01-01'),pb('37:00','2026-03-01')]);
  const out=derivePerformanceHistory([
    race('same-day','2026-01-01','39:00'),
    race('between','2026-02-01','38:00'),
    race('after-future','2026-04-01','37:30')
  ],athletes);
  assert.equal(history(out[0]).previousBest,null);
  assert.equal(history(out[0]).isPersonalBest,false);
  assert.equal(history(out[0]).hasManualBaseline,false);
  assert.equal(history(out[0]).basis,'recorded-history');
  assert.equal(history(out[0]).isBestRecorded,false);
  assert.equal(history(out[0]).bestRecorded,'37:00');
  assert.equal(history(out[1]).previousBest,'39:00');
  assert.equal(history(out[1]).isPersonalBest,true);
  assert.equal(history(out[2]).previousBest,'37:00');
  assert.equal(history(out[2]).isPersonalBest,false);
  assert.equal(history(out[2]).previousPersonalBests[0].index,1);
});

test('slower manual entries never weaken a faster archived best and historical improvements survive',()=>{
  const athletes=registry([pb('39:00','2026-03-01'),pb('40:00','2025-12-01')]);
  const input=[race('later','2026-04-01','38:30'),race('improved','2026-02-01','38:00'),race('latest','2026-05-01','37:00')];
  const out=derivePerformanceHistory(input,athletes);
  assert.equal(history(out[0]).previousBest,'38:00');
  assert.equal(history(out[0]).isPersonalBest,false);
  assert.equal(history(out[0]).hasManualBaseline,true);
  assert.deepEqual(history(out[0]).previousRaceIds,['improved']);
  assert.deepEqual(history(out[0]).previousPersonalBests,[]);
  assert.equal(history(out[1]).isPersonalBest,true);
  assert.equal(history(out[1]).previousBest,'40:00');
  assert.equal(history(out[1]).isBestRecorded,false);
  assert.equal(history(out[2]).isPersonalBest,true);
  assert.deepEqual(out.map(event=>event.id),input.map(event=>event.id));
});

test('ties and duplicate baselines do not manufacture PBs or fake race IDs',()=>{
  const athletes=registry([pb('40:00','2025-01-01'),pb('40:00','2025-01-01')]);
  const out=derivePerformanceHistory([
    race('old-race','2025-01-01','40:00'),race('tie','2026-01-01','40:00'),race('faster','2026-02-01','39:59')
  ],athletes);
  assert.equal(history(out[1]).isPersonalBest,false);
  assert.equal(history(out[1]).reason,'equal-previous-best');
  assert.deepEqual(history(out[1]).previousRaceIds,['old-race']);
  assert.deepEqual(history(out[1]).previousPersonalBests.map(entry=>entry.index),[0,1]);
  assert.equal(history(out[2]).isPersonalBest,true);
  assert.equal(history(out[2]).improvementSeconds,1);
  assert.deepEqual(history(out[2]).previousRaceIds,['old-race','tie']);
  const tiedBest=derivePerformanceHistory([race('equal','2026-01-01','40:00')],athletes);
  assert.equal(history(tiedBest[0]).isBestRecorded,true);
  assert.equal(history(tiedBest[0]).isPersonalBest,false);
});

test('manual baselines use the profile ID and preserve distance, surface and trail-course boundaries',()=>{
  const athletes=registry([
    pb('40:00','2025-01-01',{athleteId:'other'}),
    pb('35:00','2025-01-01',{type:'track',environment:'outdoor',distance:'10000 m'}),
    pb('50:00','2025-01-01',{type:'trail',courseId:'course-a'})
  ]);
  const out=derivePerformanceHistory([
    race('road','2026-01-01','39:00',{results:[result('39:00',{distance:'10000 m'})]}),
    race('track','2026-01-01','36:00',{type:'track',environment:'outdoor',results:[result('36:00',{distance:'10000 m'})]}),
    race('other','2026-01-01','39:00',{results:[result('39:00',{athleteId:'other'})]}),
    race('half','2026-01-01','1:20:00',{results:[result('1:20:00',{distance:'Halvmaraton'})]}),
    race('trail-a','2026-01-01','49:00',{type:'trail',courseId:'course-a'}),
    race('trail-b','2026-01-01','49:00',{type:'trail',courseId:'course-b'})
  ],athletes);
  assert.equal(history(out[0]).previousBest,'40:00');
  assert.equal(history(out[0]).isPersonalBest,true);
  assert.equal(history(out[1]).previousBest,'35:00');
  assert.equal(history(out[1]).isPersonalBest,false);
  assert.equal(history(out[2]).previousBest,null);
  assert.equal(history(out[3]).previousBest,null);
  assert.equal(history(out[4]).previousBest,'50:00');
  assert.equal(history(out[4]).isPersonalBest,true);
  assert.equal(history(out[5]).previousBest,null);
});

test('invalid manual values are reported and cannot establish a best',()=>{
  const athletes=registry([
    null,
    pb('40:00','2025-02-30'),
    pb('40:00',null),
    pb('DNF'),
    pb('10:00','2025-01-01',{status:'DNF'}),
    pb('40:00','2025-01-01',{type:'track',environment:'indoor',distance:'10000 m'}),
    pb('40:00','2025-01-01',{type:'trail'}),
    pb('40:00','2025-01-01',{distance:'unknown'}),
    pb('40:00','2025-01-01',{demo:true})
  ]);
  athletes.athletes.push({id:'broken',personalBests:{}},{id:'',personalBests:[pb('40:00')]},{id:'demo',kind:'demo',personalBests:[pb('10:00')]});
  const snapshot=JSON.stringify(athletes),{entries,issues}=collectManualPersonalBests(athletes);
  assert.equal(entries.length,0);
  assert.equal(issues.length,11);
  assert.deepEqual(issues.filter(issue=>issue.athleteId==='runner').map(issue=>issue.index),[0,1,2,3,4,5,6,7,8]);
  assert.deepEqual(issues.find(issue=>issue.athleteId==='broken'),{athleteId:'broken',index:null,reason:'personal-bests-not-array'});
  assert.ok(issues.every(issue=>typeof issue.reason==='string'&&issue.reason));
  const out=derivePerformanceHistory([race('first','2026-01-01','39:00')],athletes);
  assert.equal(history(out[0]).previousBest,null);
  assert.equal(history(out[0]).isPersonalBest,false);
  assert.equal(JSON.stringify(athletes),snapshot);
});

test('the public data pipeline applies manual PBs after profile matching and still removes nonfinishers',()=>{
  const athletes=registry([pb('40:00')]);
  const input={athletes,races:[race('new','2026-01-01','39:00',{results:[result('39:00',{athleteId:undefined}),result(null,{status:'DNS'})]})],records:[],upcoming:[],relays:[]};
  const snapshot=JSON.stringify(input),data=prepareResultsData(input);
  assert.equal(data.races[0].results.length,1);
  assert.equal(data.races[0].results[0].athleteId,'runner');
  assert.equal(history(data.races[0]).isPersonalBest,true);
  assert.equal(history(data.races[0]).previousBest,'40:00');
  assert.equal(JSON.stringify(input),snapshot);
});
