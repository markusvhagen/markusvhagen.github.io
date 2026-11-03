import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {selectPointsLeaderboard} from '../dist/points-leaderboard.js';

const root=new URL('../dist/',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const manifest=await json('data/index.json');
// National reference performances never participate in the club leaderboard.
const raw={...manifest,races:await Promise.all(manifest.races.map(json)),athletes:await json(manifest.athletes),
  records:await json(manifest.records),relays:await json(manifest.relays),upcoming:await json(manifest.upcoming)};
const original=JSON.stringify(raw);
const data=prepareResultsData(raw);

test('expanded club archive yields one best per athlete and accounts for every completed result',()=>{
  const view=selectPointsLeaderboard(data.races);
  // Coverage snapshot includes the sourced road and outdoor track imports.
  assert.equal(view.athleteCount,90);
  assert.equal(view.eligibleResults,226);
  assert.equal(view.missingAgeResults,80);
  assert.equal(view.unsupportedResults,30);
  const scored=data.races.flatMap(race=>race.results.filter(result=>result.ageGrade.eligible));
  assert.equal(view.rows.length,new Set(scored.map(result=>result.athleteId)).size);
  assert.equal(new Set(view.rows.map(row=>row.athleteId)).size,view.rows.length);
  assert.equal(view.eligibleResults+view.missingAgeResults+view.unsupportedResults,data.races.reduce((sum,race)=>sum+race.results.length,0));
  for(const row of view.rows){
    const best=Math.max(...scored.filter(result=>result.athleteId===row.athleteId).map(result=>result.ageGrade.score));
    assert.equal(row.score,best,row.name);
    assert.equal(row.result.status,'finished');
    assert.ok(Number.isFinite(row.score)&&row.score>0);
  }
  const markus=view.rows.find(row=>row.athleteId==='markus-valas-hagen');
  assert.equal(markus.age,27);
  assert.equal(markus.raceId,'nidaros-lopefest-2026');
  assert.equal(markus.time,'36:56.0');
  assert.equal(JSON.stringify(raw),original);
});

test('Valencia net time puts Tommy first in descending club scores while Sofie remains first among women',()=>{
  const ascending=selectPointsLeaderboard(data.races),descending=selectPointsLeaderboard(data.races,{sort:'desc'});
  for(let i=1;i<ascending.rows.length;i++)assert.ok(ascending.rows[i-1].score<=ascending.rows[i].score);
  for(let i=1;i<descending.rows.length;i++)assert.ok(descending.rows[i-1].score>=descending.rows[i].score);
  const best=descending.rows[0];
  assert.equal(best.athleteId,'tommy-bangjord-hove');
  assert.equal(best.raceId,'valencia-10k-2026');
  assert.equal(best.distance,'10 km');
  assert.equal(best.time,'28:44');
  assert.equal(best.date,'2026-01-11');
  assert.equal(best.age,34);
  assert.ok(Math.abs(best.score-92.4013921113689)<1e-10);
  assert.equal(ascending.rows.at(-1).athleteId,best.athleteId);
  assert.equal(ascending.rows.at(-1).score,best.score);
  assert.deepEqual(new Set(ascending.rows.map(row=>row.athleteId)),new Set(descending.rows.map(row=>row.athleteId)));
  const bestWoman=selectPointsLeaderboard(data.races,{gender:'K',sort:'desc'}).rows[0];
  assert.equal(bestWoman.athleteId,'sofie-karoline-haugen');
  assert.equal(bestWoman.raceId,'hytteplanmila-2026');
  assert.equal(bestWoman.time,'31:31');
  const petter=descending.rows[2];
  assert.equal(petter.athleteId,'petter-vea-monseth');
  assert.equal(petter.raceId,'kobenhavn-5k-2026');
  assert.equal(petter.distance,'5 km');assert.equal(petter.time,'14:20');
  assert.equal(petter.date,'2026-09-19');assert.equal(petter.age,16);
  assert.ok(Math.abs(petter.score-90.69767441860465)<1e-10);
});

test('gender, distance and year filters choose each best inside the selected performances',()=>{
  const women=selectPointsLeaderboard(data.races,{gender:'K'}),men=selectPointsLeaderboard(data.races,{gender:'M'});
  assert.equal(women.athleteCount,28);assert.equal(women.eligibleResults,74);
  assert.equal(men.athleteCount,62);assert.equal(men.eligibleResults,152);
  assert.ok(women.rows.every(row=>row.gender==='K'));assert.ok(men.rows.every(row=>row.gender==='M'));
  assert.equal(men.rows.at(-1).athleteId,'tommy-bangjord-hove');
  const five=selectPointsLeaderboard(data.races,{distance:'5 km'});
  assert.equal(five.athleteCount,58);assert.equal(five.eligibleResults,84);
  assert.ok(five.rows.every(row=>row.distance==='5 km'));
  assert.equal(five.rows.at(-1).athleteId,'petter-vea-monseth');
  assert.equal(five.rows.at(-1).raceId,'kobenhavn-5k-2026');
  assert.equal(five.rows.find(row=>row.athleteId==='markus-valas-hagen').raceId,'orasprinten-2026');
  const half=selectPointsLeaderboard(data.races,{distance:'Halvmaraton',gender:'K',year:'2026'});
  assert.ok(half.rows.every(row=>row.distance==='Halvmaraton'&&row.gender==='K'&&row.date.startsWith('2026-')));
  const sofie=half.rows.find(row=>row.athleteId==='sofie-karoline-haugen');
  assert.equal(sofie.raceId,'kobenhavn-halvmaraton-2026');
  assert.equal(sofie.time,'1:09:17');
  const markusHalf=selectPointsLeaderboard(data.races,{distance:'Halvmaraton',query:'Markus Valås Hagen'});
  assert.equal(markusHalf.eligibleResults,2);
  assert.equal(markusHalf.rows.length,1);
  assert.equal(markusHalf.rows[0].raceId,'berlin-halvmaraton-2026');
  const marathon=selectPointsLeaderboard(data.races,{distance:'Maraton'});
  assert.equal(marathon.rows.length,1);assert.equal(marathon.missingAgeResults,3);
  assert.equal(marathon.rows[0].name,'Natalie St. John');
  assert.equal(marathon.rows[0].time,'3:26:26');
  assert.equal(selectPointsLeaderboard(data.races,{year:'2025'}).rows.length,0);
  assert.equal(JSON.stringify(raw),original);
});
