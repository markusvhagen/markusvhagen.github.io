import test from 'node:test';
import assert from 'node:assert/strict';
import {selectPointsLeaderboard} from '../dist/points-leaderboard.js';

const runner=(athleteId,score,extra={})=>({athleteId,name:athleteId,gender:'K',distance:'10 km',time:'40:00',status:'finished',waScore:{eligible:true,score},ageGrade:{eligible:true,score:80,age:40,ageBasis:'birth-year'},...extra});
const race=(id,date,results,extra={})=>({id,name:id,date,type:'road',results,...extra});

test('highest WA result per athlete always ranks first, including with obsolete metric and order options',()=>{
  const input=[
    race('new','2026-09-01',[runner('Åse',801),runner('Berit',800),runner('Cecilie',1100)]),
    race('old','2026-05-01',[runner('Åse',700),runner('Berit',760),runner('Dina',650)])
  ];
  const before=structuredClone(input),view=selectPointsLeaderboard(input);
  assert.deepEqual(view.rows.map(row=>row.name),['Cecilie','Åse','Berit','Dina']);
  assert.equal(view.rows.find(row=>row.name==='Åse').score,801);
  assert.equal(view.rows.find(row=>row.name==='Åse').raceId,'new');
  assert.equal(view.eligibleResults,6);assert.equal(view.athleteCount,4);
  assert.deepEqual(selectPointsLeaderboard(input,{metric:'age',sort:'asc'}),view);
  assert.deepEqual(input,before);
});

test('gender, distance, year and search filters apply before selecting each athlete best',()=>{
  const input=[
    race('Berlin','2025-04-01',[runner('Ida',900,{distance:'Halvmaraton'})]),
    race('Nidaros','2026-05-23',[runner('Ida',800),runner('Ole',820,{gender:'M'})]),
    race('København','2026-09-20',[runner('Ida',850,{distance:'Halvmaraton'})])
  ];
  assert.equal(selectPointsLeaderboard(input).rows.find(row=>row.name==='Ida').raceId,'Berlin');
  const ten=selectPointsLeaderboard(input,{distance:'10 km',gender:'K',year:'2026'});
  assert.equal(ten.rows.length,1);assert.equal(ten.rows[0].score,800);assert.equal(ten.eligibleResults,1);
  assert.equal(selectPointsLeaderboard(input,{year:'2026',gender:'K'}).rows[0].score,850);
  assert.equal(selectPointsLeaderboard(input,{query:'nidaros',gender:'K'}).rows[0].score,800);
  assert.equal(selectPointsLeaderboard(input,{query:' iDA '}).rows.find(row=>row.name==='Ida').score,900);
  assert.equal(selectPointsLeaderboard(input,{gender:'M'}).rows[0].name,'Ole');
  assert.equal(selectPointsLeaderboard(input,{query:'Missing'}).athleteCount,0);
});

test('WA ties retain the earliest achievement and stable race ID; equal athletes sort by Norwegian name',()=>{
  const input=[
    race('z-race','2026-05-01',[runner('same',800)]),
    race('a-race','2026-05-01',[runner('same',800)]),
    race('late','2026-09-01',[runner('same',800,{ageGrade:{eligible:true,score:99}})]),
    race('names','2026-05-02',[runner('aase',700,{name:'Åse'}),runner('oystein',700,{name:'Øystein'}),runner('aegir',700,{name:'Ægir'}),runner('anna-b',700,{name:'Anna'}),runner('anna-a',700,{name:'Anna'})])
  ];
  const view=selectPointsLeaderboard(input);
  assert.equal(view.rows.find(row=>row.athleteId==='same').raceId,'a-race');
  assert.deepEqual(view.rows.filter(row=>row.score===700).map(row=>row.athleteId),['anna-a','anna-b','aegir','oystein','aase']);
  assert.deepEqual(selectPointsLeaderboard(input.toReversed()).rows.map(row=>[row.athleteId,row.raceId]),view.rows.map(row=>[row.athleteId,row.raceId]));
});

test('missing ages remain eligible for WA while unsupported results and nonfinishers are excluded',()=>{
  const input=[race('valid','2026-06-01',[
    runner('ready',750),
    runner('no-age',800,{ageGrade:{eligible:false,reason:'missing-age'}}),
    runner('bad-year',700,{ageGrade:{eligible:false,reason:'invalid-birth-year'}}),
    runner('trail',null,{waScore:{eligible:false,reason:'unsupported-discipline'},ageGrade:{eligible:false,reason:'unsupported-discipline'}}),
    runner('invalid-score',Infinity),
    runner('dnf',990,{status:'DNF'}),runner('dns',990,{status:'DNS'}),
    runner('bad-time',990,{time:'bad'}),runner('',990)
  ])];
  const view=selectPointsLeaderboard(input);
  assert.deepEqual(view.rows.map(row=>row.athleteId),['no-age','ready','bad-year']);
  assert.equal(view.eligibleResults,3);assert.equal(view.missingAgeResults,2);assert.equal(view.unsupportedResults,2);
  assert.equal(selectPointsLeaderboard(input,{query:'no-age'}).missingAgeResults,1);
  assert.deepEqual(selectPointsLeaderboard(null),{rows:[],eligibleResults:0,athleteCount:0,missingAgeResults:0,unsupportedResults:0});
});

test('both scores always describe the WA-best performance even when another result has higher age points',()=>{
  const input=[
    race('fast','2026-05-01',[runner('Ada',1050,{ageGrade:{eligible:true,score:80,age:40}})]),
    race('age-best','2026-10-01',[runner('Ada',1000,{ageGrade:{eligible:true,score:85,age:40}})])
  ];
  for(const filters of [{},{metric:'age'},{metric:'wa'}]){
    const row=selectPointsLeaderboard(input,filters).rows[0];
    assert.equal(row.raceId,'fast');assert.equal(row.score,1050);
    assert.equal(row.ageScore,80);assert.equal(row.waScore,1050);
  }
  assert.equal(selectPointsLeaderboard(input,{query:'age-best'}).rows[0].raceId,'age-best');
});

test('WA leaderboard includes track performances without age grades',()=>{
  const input=[race('race','2026-06-01',[
    runner('known',800),
    runner('track',950,{ageGrade:{eligible:false,reason:'unsupported-discipline'}})
  ])];
  const view=selectPointsLeaderboard(input);
  assert.deepEqual(view.rows.map(row=>row.athleteId),['track','known']);
  assert.equal(view.rows[0].ageScore,null);
});

test('WA date and year filters use the individual performance date in a multi-day meeting',()=>{
  const input=[race('meeting','2025-12-31',[
    runner('Ada',1000,{date:'2026-01-01',ageGrade:{eligible:false,reason:'unsupported-discipline'}})
  ],{type:'track'})];
  const view=selectPointsLeaderboard(input,{year:'2026'});
  assert.equal(view.rows[0].date,'2026-01-01');
  assert.equal(selectPointsLeaderboard(input,{year:'2025'}).rows.length,0);
});
