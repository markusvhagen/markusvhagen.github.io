import test from 'node:test';
import assert from 'node:assert/strict';
import {derivePerformanceHistory,isFinishedResult,performanceTime} from '../dist/performance-history.js';

const result=(time,extra={})=>({athleteId:'runner',name:'Runner',distance:'10 km',status:'finished',time,...extra});
const race=(id,date,results,extra={})=>({id,name:id,date,type:'road',demo:false,results,...extra});
const history=race=>race.results[0].performanceHistory;

test('unsorted history uses strictly earlier dates and never trusts stored PB flags',()=>{
  const input=[race('latest','2026-03-01',[result('39:00',{pb:true,previousBest:'45:00'})]),race('first','2026-01-01',[result('40:00',{pb:true})]),race('improved','2026-02-01',[result('38:00')])];
  const snapshot=JSON.stringify(input),out=derivePerformanceHistory(input);
  assert.equal(JSON.stringify(input),snapshot);
  assert.deepEqual(out.map(r=>r.id),input.map(r=>r.id));
  assert.equal(history(out[1]).isPersonalBest,false);
  assert.equal(history(out[2]).isPersonalBest,true);
  assert.equal(history(out[2]).previousBest,'40:00');
  assert.equal(history(out[2]).improvementSeconds,120);
  assert.equal(history(out[0]).isPersonalBest,false);
  assert.equal(history(out[0]).previousBest,'38:00');
  assert.equal(history(out[2]).isBestRecorded,true);
  for(const r of out){assert.equal('pb' in r.results[0],false);assert.equal('previousBest' in r.results[0],false);}
});

test('same-day order is unknown, ties are not PBs, later improvements preserve historical PBs',()=>{
  const initial=[race('first','2026-01-01',[result('40:00')]),race('morning','2026-02-01',[result('39:00')]),race('afternoon','2026-02-01',[result('38:00')]),race('tie','2026-03-01',[result('38:00')])];
  const out=derivePerformanceHistory([...initial,race('future','2026-04-01',[result('37:00')])]);
  assert.equal(history(out[1]).previousBest,'40:00');
  assert.equal(history(out[2]).previousBest,'40:00');
  assert.equal(history(out[1]).isPersonalBest,true);
  assert.equal(history(out[1]).isBestRecorded,false);
  assert.equal(history(out[3]).isPersonalBest,false);
  assert.equal(history(out[3]).reason,'equal-previous-best');
  const sameDateOnly=derivePerformanceHistory(initial.slice(1,3));
  assert.ok(sameDateOnly.every(r=>!history(r).isPersonalBest));
});

test('DNF, DNS, disqualifications and malformed times never establish a best',()=>{
  for(const status of ['DNF','DNS','DSQ','DQ','unknown'])assert.equal(isFinishedResult(result('10:00',{status})),false);
  assert.equal(isFinishedResult(result('bad')),false);
  assert.equal(isFinishedResult(result('40:00',{status:undefined})),true);
  const out=derivePerformanceHistory([race('bad','2026-01-01',[result('10:00',{status:'DNF'}),result(null,{status:'DNS'})]),race('first','2026-02-01',[result('40:00')])]);
  assert.equal(history(out[0]).eligible,false);
  assert.equal(history(out[1]).previousBest,null);
  assert.equal(history(out[1]).isPersonalBest,false);
});

test('net timing is used for Berlin even when gun time was accidentally supplied as time',()=>{
  const berlin=race('berlin','2026-03-29',[result('1:21:39',{distance:'Halvmaraton',netTime:'1:21:03',gunTime:'1:21:39'})],{source:{timeBasis:'net'}});
  assert.equal(performanceTime(berlin.results[0],berlin),'1:21:03');
  const out=derivePerformanceHistory([race('old','2026-02-01',[result('1:21:20',{distance:'Halvmaraton'})]),berlin]);
  assert.equal(out[1].results[0].time,'1:21:03');
  assert.equal(history(out[1]).isPersonalBest,true);
  assert.equal(history(out[1]).improvementSeconds,17);
  assert.equal(berlin.results[0].time,'1:21:39');
});

test('distance aliases normalize but athlete IDs, surfaces, and trail courses remain separate',()=>{
  const out=derivePerformanceHistory([
    race('road','2026-01-01',[result('40:00')]),
    race('alias','2026-02-01',[result('39:00',{distance:'10000 m'})]),
    race('track','2026-03-01',[result('38:00',{distance:'10000 m'})],{type:'track',environment:'outdoor'}),
    race('other-person','2026-03-01',[result('38:00',{athleteId:'other'})]),
    race('trail-unknown','2026-03-01',[result('38:00')],{type:'trail'}),
    race('trail-a','2026-04-01',[result('50:00')],{type:'trail',courseId:'a'}),
    race('trail-b','2026-05-01',[result('49:00')],{type:'trail',courseId:'b'}),
    race('trail-a-again','2026-06-01',[result('48:00')],{type:'trail',courseId:'a'})
  ]);
  assert.equal(history(out[1]).isPersonalBest,true);
  assert.equal(history(out[2]).previousBest,null);
  assert.equal(history(out[3]).previousBest,null);
  assert.equal(history(out[4]).eligible,false);
  assert.equal(history(out[6]).previousBest,null);
  assert.equal(history(out[7]).previousBest,'50:00');
  assert.equal(history(out[7]).isPersonalBest,true);
});

test('unknown identity, invalid date, indoor track and demo data cannot claim PB',()=>{
  const out=derivePerformanceHistory([
    race('invalid-date','2026-02-30',[result('40:00')]),
    race('unresolved','2026-03-01',[result('39:00',{athleteId:null})]),
    race('indoor','2026-03-01',[result('38:00',{distance:'10000 m'})],{type:'track',environment:'indoor'}),
    race('demo','2026-03-01',[result('37:00')],{demo:true}),
    race('real','2026-04-01',[result('40:00')])
  ]);
  assert.ok(out.slice(0,4).every(r=>!history(r).eligible));
  assert.equal(history(out[4]).previousBest,null);
  assert.equal(history(out[4]).isBestRecorded,true);
  assert.equal(history(out[4]).isPersonalBest,false);
});

test('multi-day meetings use each performance date for PB chronology without reordering the source',()=>{
  const track={type:'track',environment:'outdoor'};
  const input=[
    race('nm','2026-07-23',[
      result('3:59',{distance:'1500 m',date:'2026-07-25'}),
      result('4:05',{distance:'1500 m',date:'2026-07-23'})
    ],track),
    race('between','2026-07-24',[result('4:03',{distance:'1500 m'})],track),
    race('earlier','2026-07-22',[result('4:10',{distance:'1500 m'})],track)
  ];
  const snapshot=JSON.stringify(input),out=derivePerformanceHistory(input);
  assert.equal(history(out[0]).previousBest,'4:03');
  assert.equal(history(out[0]).improvementSeconds,4);
  assert.deepEqual(history(out[0]).previousRaceIds,['between']);
  assert.equal(out[0].results[1].performanceHistory.previousBest,'4:10');
  assert.equal(history(out[1]).previousBest,'4:05');
  assert.deepEqual(out.map(event=>event.id),input.map(event=>event.id));
  assert.deepEqual(out[0].results.map(entry=>entry.date),['2026-07-25','2026-07-23']);
  assert.equal(JSON.stringify(input),snapshot);
});

test('a manually confirmed PB must match the performance date, not the meeting start date',()=>{
  const meeting=race('nm','2026-07-23',[
    result('3:59.0',{distance:'1500 m',date:'2026-07-25'})
  ],{type:'track',environment:'outdoor'});
  const registry=date=>({athletes:[{id:'runner',personalBests:[{
    raceId:'nm',type:'track',environment:'outdoor',distance:'1500 m',time:'3:59',date
  }]}]});
  const confirmed=history(derivePerformanceHistory([meeting],registry('2026-07-25'))[0]);
  assert.equal(confirmed.isManualPersonalBest,true);
  assert.equal(confirmed.reason,'manual-confirmed-personal-best');
  assert.equal(confirmed.confirmedPersonalBests[0].date,'2026-07-25');
  assert.equal(history(derivePerformanceHistory([meeting],registry('2026-07-23'))[0]).isManualPersonalBest,false);
});

test('invalid result dates fall back to the race date while valid result dates can rescue an invalid race date',()=>{
  const out=derivePerformanceHistory([
    race('earlier','2026-07-23',[result('40:00')]),
    race('invalid-result-date','2026-07-24',[result('39:00',{date:'2026-02-30'})]),
    race('invalid-race-date','invalid',[result('38:00',{date:'2026-07-25'})]),
    race('no-valid-date','2026-02-30',[result('37:00',{date:'2026-13-01'})])
  ]);
  assert.equal(history(out[1]).previousBest,'40:00');
  assert.equal(history(out[2]).previousBest,'39:00');
  assert.equal(history(out[2]).isPersonalBest,true);
  assert.equal(history(out[3]).eligible,false);
  assert.equal(history(out[3]).reason,'invalid-race-date');
});
