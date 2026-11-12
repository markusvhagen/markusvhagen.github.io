import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {selectPointsLeaderboard} from '../dist/points-leaderboard.js';
import {gradeRaceResult} from '../dist/age-grading.js';

const root=new URL('../dist/',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const manifest=await json('data/index.json');
// National reference performances never participate in the club leaderboard.
const raw={...manifest,races:await Promise.all(manifest.races.map(json)),athletes:await json(manifest.athletes),
  records:await json(manifest.records),relays:await json(manifest.relays),upcoming:await json(manifest.upcoming)};
const original=JSON.stringify(raw);
const data=prepareResultsData(raw);
const profiles=Array.isArray(raw.athletes)?raw.athletes:raw.athletes.athletes;
const profilesById=new Map(profiles.map(profile=>[profile.id,profile]));

test('expanded club archive yields one best per athlete and accounts for every completed result',()=>{
  const view=selectPointsLeaderboard(data.races);
  const scored=data.races.flatMap(race=>race.results.filter(result=>result.ageGrade.eligible));
  const supportedRoadDistances=new Set(['5 km','10 km','Halvmaraton','Maraton']);
  const roadResults=data.races.filter(race=>race.type==='road')
    .flatMap(race=>race.results.filter(result=>supportedRoadDistances.has(result.distance)));
  const missingAges=roadResults.filter(result=>{
    const profile=profilesById.get(result.athleteId);
    return result.age==null && result.birthDate==null && profile.birthDate==null && profile.birthYear==null;
  });
  assert.equal(view.missingAgeResults,missingAges.length);
  assert.equal(view.unsupportedResults,data.races.flatMap(race=>race.results).length-roadResults.length);
  assert.equal(view.eligibleResults,scored.length);
  assert.equal(view.athleteCount,new Set(scored.map(result=>result.athleteId)).size);
  assert.equal(view.rows.length,new Set(scored.map(result=>result.athleteId)).size);
  assert.equal(new Set(view.rows.map(row=>row.athleteId)).size,view.rows.length);
  assert.equal(view.eligibleResults+view.missingAgeResults+view.unsupportedResults,data.races.reduce((sum,race)=>sum+race.results.length,0));
  for(const row of view.rows){
    const best=Math.max(...scored.filter(result=>result.athleteId===row.athleteId).map(result=>result.ageGrade.score));
    assert.equal(row.score,best,row.name);
    assert.equal(row.name,profilesById.get(row.athleteId).name);
    if(row.ageBasis==='birth-year'){
      assert.equal(row.age,Number(row.date.slice(0,4))-profilesById.get(row.athleteId).birthYear);
    }
    assert.equal(row.result.status,'finished');
    assert.ok(Number.isFinite(row.score)&&row.score>0);
  }
  const nidaros=data.races.find(race=>race.id==='nidaros-lopefest-2026');
  const markus=selectPointsLeaderboard([nidaros],{query:'Markus Valås Hagen'}).rows[0];
  assert.equal(markus.age,27);
  assert.equal(markus.time,'36:56.0');
  assert.equal(JSON.stringify(raw),original);
});

test('scores sort in either direction and verified historical performances reproduce their known scores',()=>{
  const ascending=selectPointsLeaderboard(data.races),descending=selectPointsLeaderboard(data.races,{sort:'desc'});
  for(let i=1;i<ascending.rows.length;i++)assert.ok(ascending.rows[i-1].score<=ascending.rows[i].score);
  for(let i=1;i<descending.rows.length;i++)assert.ok(descending.rows[i-1].score>=descending.rows[i].score);
  assert.equal(ascending.rows.at(-1).score,descending.rows[0].score);
  assert.deepEqual(new Set(ascending.rows.map(row=>row.athleteId)),new Set(descending.rows.map(row=>row.athleteId)));

  const examples=[
    {raceId:'valencia-10k-2026',athleteId:'tommy-bangjord-hove',distance:'10 km',time:'28:44',date:'2026-01-11',age:34,score:92.4013921113689},
    {raceId:'kobenhavn-5k-2026',athleteId:'petter-vea-monseth',distance:'5 km',time:'14:20',date:'2026-09-19',age:16,score:90.69767441860465},
    {raceId:'hytteplanmila-2026',athleteId:'sofie-karoline-haugen',distance:'10 km',time:'31:31',date:'2026-10-17'}
  ];
  for(const example of examples){
    const race=data.races.find(r=>r.id===example.raceId);
    const row=selectPointsLeaderboard([race]).rows.find(row=>row.athleteId===example.athleteId);
    assert.ok(row,example.athleteId);
    for(const field of ['distance','time','date'])assert.equal(row[field],example[field]);
    if(example.age!==undefined)assert.equal(row.age,example.age);
    if(example.score!==undefined)assert.ok(Math.abs(row.score-example.score)<1e-10);
  }
});

test('gender, distance and year filters choose each best inside the selected performances',()=>{
  const allResults=data.races.flatMap(race=>race.results);
  for(const gender of ['K','M']){
    const matching=allResults.filter(result=>result.gender===gender && result.ageGrade.eligible);
    const view=selectPointsLeaderboard(data.races,{gender});
    assert.equal(view.eligibleResults,matching.length);
    assert.deepEqual(new Set(view.rows.map(row=>row.athleteId)),new Set(matching.map(result=>result.athleteId)));
    assert.ok(view.rows.every(row=>row.gender===gender));
  }
  for(const distance of ['5 km','Maraton']){
    const matching=allResults.filter(result=>result.distance===distance && result.ageGrade.eligible);
    const view=selectPointsLeaderboard(data.races,{distance});
    assert.equal(view.eligibleResults,matching.length);
    assert.deepEqual(new Set(view.rows.map(row=>row.athleteId)),new Set(matching.map(result=>result.athleteId)));
    assert.ok(view.rows.every(row=>row.distance===distance));
  }
  const ids=new Set(['orasprinten-2026','kobenhavn-5k-2026','kobenhavn-halvmaraton-2026',
    'berlin-halvmaraton-2026','barcelona-halvmaraton-2026','trondheim-maraton-2026']);
  const knownRaces=data.races.filter(race=>ids.has(race.id));
  const five=selectPointsLeaderboard(knownRaces,{distance:'5 km'});
  assert.equal(five.rows.find(row=>row.athleteId==='markus-valas-hagen').raceId,'orasprinten-2026');
  const half=selectPointsLeaderboard(knownRaces,{distance:'Halvmaraton',gender:'K',year:'2026'});
  assert.ok(half.rows.every(row=>row.distance==='Halvmaraton'&&row.gender==='K'&&row.date.startsWith('2026-')));
  const sofie=half.rows.find(row=>row.athleteId==='sofie-karoline-haugen');
  assert.equal(sofie.raceId,'kobenhavn-halvmaraton-2026');
  assert.equal(sofie.time,'1:09:17');
  const markusHalf=selectPointsLeaderboard(knownRaces,{distance:'Halvmaraton',query:'Markus Valås Hagen'});
  assert.equal(markusHalf.eligibleResults,2);
  assert.equal(markusHalf.rows.length,1);
  assert.equal(markusHalf.rows[0].raceId,'berlin-halvmaraton-2026');
  const marathon=selectPointsLeaderboard(knownRaces,{distance:'Maraton'}).rows.find(row=>row.name==='Natalie St. John');
  assert.ok(marathon);assert.equal(marathon.time,'3:26:26');
  assert.equal(selectPointsLeaderboard(knownRaces,{year:'2025'}).rows.length,0);
  assert.equal(JSON.stringify(raw),original);
});

test('WA rankings include athletes without birth years and preserve age grading and raw data',()=>{
  const scored=data.races.flatMap(race=>race.results.filter(result=>result.waScore.eligible));
  const view=selectPointsLeaderboard(data.races,{metric:'wa',sort:'desc'});
  assert.ok(scored.length>244);
  assert.equal(view.eligibleResults,scored.length);
  assert.equal(view.rows.length,new Set(scored.map(result=>result.athleteId)).size);
  assert.ok(view.rows.some(row=>row.ageScore===null));
  for(let i=1;i<view.rows.length;i++)assert.ok(view.rows[i-1].waScore>=view.rows[i].waScore);
  for(const row of view.rows){
    assert.equal(row.score,Math.max(...scored.filter(result=>result.athleteId===row.athleteId).map(result=>result.waScore.score)));
    assert.equal(row.waScore,row.result.waScore.score);
    assert.equal(row.ageScore,row.result.ageGrade.eligible?row.result.ageGrade.score:null);
  }
  const nm=data.races.find(race=>race.id==='nm-bane-2026')||data.races.find(race=>race.type==='track'&&race.results.some(result=>result.date));
  assert.ok(nm);
  const track=selectPointsLeaderboard([nm],{metric:'wa',sort:'desc'});
  assert.ok(track.rows.length);
  assert.ok(track.rows.every(row=>row.ageScore===null));
  for(const row of track.rows)assert.equal(row.date,row.result.date||nm.date);
  const missing=view.rows.find(row=>row.ageScore===null&&row.result.ageGrade.reason==='missing-age');
  assert.ok(missing);
  const withOverride=data.races.map(race=>({...race,results:race.results.map(result=>result.athleteId===missing.athleteId?{...result,ageGrade:{eligible:true,score:123.456,age:75,ageBasis:'local-birth-year'}}:result)}));
  const after=selectPointsLeaderboard(withOverride,{metric:'wa',sort:'desc'});
  assert.deepEqual(after.rows.map(row=>[row.athleteId,row.raceId,row.waScore]),view.rows.map(row=>[row.athleteId,row.raceId,row.waScore]));
  assert.equal(JSON.stringify(raw),original);
});

test('points rankings retain age at the performance even when viewed ten years later',()=>{
  const RealDate=globalThis.Date;
  try{
    globalThis.Date=class extends RealDate {
      constructor(...args){super(...(args.length?args:['2036-11-11T12:00:00Z']));}
      static now(){return RealDate.parse('2036-11-11T12:00:00Z');}
    };
    const futureData=prepareResultsData(raw);
    for(const metric of ['age','wa']){
      assert.deepEqual(selectPointsLeaderboard(futureData.races,{metric,sort:'desc'}),selectPointsLeaderboard(data.races,{metric,sort:'desc'}));
    }
    const races=[2025,2026].map(year=>({id:'race-'+year,name:'Race '+year,date:year+'-05-01',type:'road',results:[
      {athleteId:'historical-runner',name:'Historical runner',gender:'M',distance:'10 km',time:'40:00',status:'finished'}
    ]}));
    // This is the same local-birth-year path used by racesWithLocalAges().
    const local=races.map(race=>({...race,results:race.results.map(result=>({...result,ageGrade:gradeRaceResult(race,{...result,age:null,birthDate:null,birthYear:1980},{birthDate:null,birthYear:1980})}))}));
    assert.equal(local[0].results[0].ageGrade.age,45);
    assert.equal(local[1].results[0].ageGrade.age,46);
    assert.equal(selectPointsLeaderboard(local,{year:'2025'}).rows[0].age,45);
    assert.equal(selectPointsLeaderboard(local,{year:'2026'}).rows[0].age,46);
    assert.notEqual(local[0].results[0].ageGrade.score,local[1].results[0].ageGrade.score);
  }finally{globalThis.Date=RealDate;}
});
