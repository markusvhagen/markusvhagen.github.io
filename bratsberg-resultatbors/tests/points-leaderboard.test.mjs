import test from 'node:test';
import assert from 'node:assert/strict';
import {selectPointsLeaderboard} from '../dist/points-leaderboard.js';

const runner=(athleteId,score,extra={})=>({athleteId,name:athleteId,gender:'K',distance:'10 km',time:'40:00',status:'finished',ageGrade:{eligible:true,score,age:40,ageBasis:'birth-year'},...extra});
const race=(id,date,results,extra={})=>({id,name:id,date,type:'road',results,...extra});

test('one highest unrounded performance per athlete appears in ascending order without changing sources',()=>{
  const input=[
    race('new','2026-09-01',[runner('Åse',80.049),runner('Berit',80.041),runner('Cecilie',101.3)]),
    race('old','2026-05-01',[runner('Åse',70),runner('Berit',76),runner('Dina',65)])
  ];
  const before=structuredClone(input),view=selectPointsLeaderboard(input);
  assert.deepEqual(view.rows.map(row=>row.name),['Dina','Berit','Åse','Cecilie']);
  assert.equal(view.rows.find(row=>row.name==='Åse').score,80.049);
  assert.equal(view.rows.find(row=>row.name==='Åse').raceId,'new');
  assert.equal(view.eligibleResults,6);assert.equal(view.athleteCount,4);
  assert.deepEqual(selectPointsLeaderboard(input,{sort:'desc'}).rows.map(row=>row.name),['Cecilie','Åse','Berit','Dina']);
  assert.deepEqual(input,before);
});

test('gender, distance, year and search filters apply before selecting each athlete best',()=>{
  const input=[
    race('Berlin','2025-04-01',[runner('Ida',90,{distance:'Halvmaraton'})]),
    race('Nidaros','2026-05-23',[runner('Ida',80),runner('Ole',82,{gender:'M'})]),
    race('København','2026-09-20',[runner('Ida',85,{distance:'Halvmaraton'})])
  ];
  assert.equal(selectPointsLeaderboard(input).rows.find(row=>row.name==='Ida').raceId,'Berlin');
  const ten=selectPointsLeaderboard(input,{distance:'10 km',gender:'K',year:'2026'});
  assert.equal(ten.rows.length,1);assert.equal(ten.rows[0].score,80);assert.equal(ten.eligibleResults,1);
  assert.equal(selectPointsLeaderboard(input,{year:'2026',gender:'K'}).rows[0].score,85);
  assert.equal(selectPointsLeaderboard(input,{query:'nidaros',gender:'K'}).rows[0].score,80);
  assert.equal(selectPointsLeaderboard(input,{query:' iDA '}).rows.find(row=>row.name==='Ida').score,90);
  assert.equal(selectPointsLeaderboard(input,{gender:'M'}).rows[0].name,'Ole');
  assert.equal(selectPointsLeaderboard(input,{query:'Missing'}).athleteCount,0);
});

test('ties retain the earliest achievement, then stable race ID; equal athletes sort by Norwegian name',()=>{
  const input=[
    race('z-race','2026-05-01',[runner('same',80)]),
    race('a-race','2026-05-01',[runner('same',80)]),
    race('late','2026-09-01',[runner('same',80)]),
    race('names','2026-05-02',[runner('aase',70,{name:'Åse'}),runner('oystein',70,{name:'Øystein'}),runner('aegir',70,{name:'Ægir'}),runner('anna-b',70,{name:'Anna'}),runner('anna-a',70,{name:'Anna'})])
  ];
  const view=selectPointsLeaderboard(input);
  assert.equal(view.rows.find(row=>row.athleteId==='same').raceId,'a-race');
  assert.deepEqual(view.rows.filter(row=>row.score===70).map(row=>row.athleteId),['anna-a','anna-b','aegir','oystein','aase']);
  assert.deepEqual(selectPointsLeaderboard(input.toReversed()).rows.map(row=>[row.athleteId,row.raceId]),view.rows.map(row=>[row.athleteId,row.raceId]));
});

test('scoped counters distinguish missing ages while excluding nonfinishers and unknown identities',()=>{
  const input=[race('valid','2026-06-01',[
    runner('ready',75),
    runner('no-age',null,{ageGrade:{eligible:false,reason:'missing-age'}}),
    runner('bad-year',null,{ageGrade:{eligible:false,reason:'invalid-birth-year'}}),
    runner('trail',null,{ageGrade:{eligible:false,reason:'unsupported-discipline'}}),
    runner('invalid-score',Infinity),
    runner('dnf',99,{status:'DNF'}),runner('dns',99,{status:'DNS'}),
    runner('bad-time',99,{time:'bad'}),runner('',99)
  ])];
  const view=selectPointsLeaderboard(input);
  assert.deepEqual(view.rows.map(row=>row.athleteId),['ready']);
  assert.equal(view.eligibleResults,1);assert.equal(view.missingAgeResults,2);assert.equal(view.unsupportedResults,2);
  assert.equal(selectPointsLeaderboard(input,{query:'no-age'}).missingAgeResults,1);
  assert.deepEqual(selectPointsLeaderboard(null),{rows:[],eligibleResults:0,athleteCount:0,missingAgeResults:0,unsupportedResults:0});
});

test('ranking metric selects one performance and keeps both scores tied to that performance',()=>{
  const input=[
    race('fast','2026-05-01',[runner('Ada',80,{waScore:{eligible:true,score:1050}})]),
    race('age-best','2026-10-01',[runner('Ada',85,{waScore:{eligible:true,score:1000}})])
  ];
  const age=selectPointsLeaderboard(input,{metric:'age'}).rows[0];
  assert.equal(age.raceId,'age-best');
  assert.equal(age.ageScore,85);
  assert.equal(age.waScore,1000);
  const wa=selectPointsLeaderboard(input,{metric:'wa'}).rows[0];
  assert.equal(wa.raceId,'fast');
  assert.equal(wa.score,1050);
  assert.equal(wa.ageScore,80);
  assert.equal(wa.waScore,1050);
  assert.equal(selectPointsLeaderboard(input,{metric:'wa',query:'age-best'}).rows[0].raceId,'age-best');
});

test('WA leaderboard includes missing ages and track, but excludes nonfinishers and unsupported WA rows',()=>{
  const input=[race('race','2026-06-01',[
    runner('known',70,{waScore:{eligible:true,score:800}}),
    runner('missing',null,{ageGrade:{eligible:false,reason:'missing-age'},waScore:{eligible:true,score:900}}),
    runner('track',null,{ageGrade:{eligible:false,reason:'unsupported-discipline'},waScore:{eligible:true,score:950}}),
    runner('trail',80,{waScore:{eligible:false,score:null,reason:'unsupported-discipline'}}),
    runner('dnf',90,{status:'DNF',waScore:{eligible:true,score:1000}})
  ])];
  const view=selectPointsLeaderboard(input,{metric:'wa',sort:'desc'});
  assert.deepEqual(view.rows.map(row=>row.athleteId),['track','missing','known']);
  assert.equal(view.rows[1].ageScore,null);
  assert.equal(view.eligibleResults,3);
  assert.equal(view.missingAgeResults,1);
  assert.equal(view.unsupportedResults,1);
});

test('WA date and year filters use the individual performance date in a multi-day meeting',()=>{
  const input=[race('meeting','2025-12-31',[
    runner('Ada',null,{date:'2026-01-01',ageGrade:{eligible:false,reason:'unsupported-discipline'},waScore:{eligible:true,score:1000}})
  ],{type:'track'})];
  const view=selectPointsLeaderboard(input,{metric:'wa',year:'2026'});
  assert.equal(view.rows[0].date,'2026-01-01');
  assert.equal(selectPointsLeaderboard(input,{metric:'wa',year:'2025'}).rows.length,0);
});
