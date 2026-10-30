import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {selectArchivePage} from '../dist/archive.js';
import {createWidgetSlots,selectWidgetHighlights} from '../dist/widget.js';
import {gradeRaceResult} from '../dist/age-grading.js';
import {parsePerformanceTime} from '../dist/record-check.js';
import {renderAthleteCard} from '../dist/athlete-cards.js';

const root=new URL('../dist/',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const manifest=await json('data/index.json');
const raw={...manifest,races:await Promise.all(manifest.races.map(json)),athletes:await json(manifest.athletes),records:await json(manifest.records),relays:await json(manifest.relays),upcoming:await json(manifest.upcoming)};

test('public pipeline removes non-finishers everywhere without deleting audit rows',()=>{
  const original=JSON.stringify(raw),data=prepareResultsData(raw);
  const finished=raw.races.flatMap(r=>r.results).filter(r=>r.status==='finished');
  assert.equal(data.races.flatMap(r=>r.results).length,finished.length);
  assert.equal(selectArchivePage(data.races).resultCount,finished.length);
  assert.ok(data.races.every(r=>r.results.every(r=>r.status==='finished')));
  assert.ok(data.races.flatMap(selectWidgetHighlights).every(r=>r.status==='finished'));
  assert.equal(JSON.stringify(raw),original);
  assert.ok(raw.races.some(r=>r.results.some(r=>r.status==='DNS')));
  assert.equal(createWidgetSlots(data.races).length,10);
});

test('stored results contain facts only; Berlin uses net times and registered participants resolve',()=>{
  for(const result of raw.races.flatMap(r=>r.results)){
    assert.ok(!Object.hasOwn(result,'pb'));
    assert.ok(!Object.hasOwn(result,'previousBest'));
  }
  const data=prepareResultsData(raw),berlin=data.races.find(r=>r.id==='berlin-halvmaraton-2026');
  assert.ok(berlin.results.every(r=>r.time===r.netTime));
  assert.equal(berlin.results.find(r=>r.athleteId==='markus-valas-hagen').time,'1:21:03');
  assert.equal(data.upcoming.find(r=>r.id==='valencia-maraton-2026').participants.length,10);
  assert.equal(data.upcoming.find(r=>r.id==='jessheim-vintermaraton-2026').participants.length,3);
  assert.equal(data.unresolvedAthletes.length,0);
});

test('profile birth years produce road points without modifying source data or grading unknown ages',()=>{
  const original=JSON.stringify(raw),data=prepareResultsData(raw);
  const profiles=Array.isArray(raw.athletes)?raw.athletes:raw.athletes.athletes;
  assert.equal(profiles.filter(profile=>Number.isInteger(profile.birthYear)).length,37);
  const graded=data.races.flatMap(race=>race.results.filter(result=>result.ageGrade.eligible));
  assert.equal(graded.length,83);
  for(const race of data.races){
    for(const result of race.results){
      const profile=profiles.find(profile=>profile.id===result.athleteId);
      assert.deepEqual(result.ageGrade,gradeRaceResult(race,result,profile));
      assert.ok(!Object.hasOwn(raw.races.find(source=>source.id===race.id).results.find(source=>source.athleteId===result.athleteId&&source.distance===result.distance)||{},'ageGrade'));
      if(race.type==='trail')assert.equal(result.ageGrade.eligible,false);
      if(result.athleteId==='markus-valas-hagen')assert.equal(result.ageGrade.eligible,false);
    }
  }
  assert.equal(JSON.stringify(raw),original);
});

test('each imported distance has verified overall winners with a recorded source and valid time',()=>{
  let pairs=0;
  for(const race of raw.races){
    assert.deepEqual(new Set(race.winners.map(pair=>pair.distance)),new Set(race.distances));
    for(const pair of race.winners){
      pairs++;
      for(const gender of ['men','women']){
        const winner=pair[gender];
        assert.equal(winner.verified,true);
        assert.ok(winner.name&&parsePerformanceTime(winner.time)>0);
        assert.ok(new URL(winner.sourceUrl).protocol==='https:');
      }
    }
  }
  assert.equal(pairs,16);
  const copenhagen=raw.races.find(race=>race.id==='kobenhavn-halvmaraton-2026');
  assert.equal(copenhagen.news[0].url,'https://www.bratsbergfriidrett.no/2026/09/20/klubbrekorder-i-koben/');
});

test('Markus confirmed Berlin and Nidaros PBs appear without inventing a previous time',()=>{
  const data=prepareResultsData(raw);
  const mine=data.races.flatMap(race=>race.results.filter(result=>result.athleteId==='markus-valas-hagen').map(result=>({raceId:race.id,result})));
  assert.equal(mine.length,3);
  for(const {raceId,result} of mine){
    const confirmed=['berlin-halvmaraton-2026','nidaros-lopefest-2026'].includes(raceId);
    assert.equal(result.performanceHistory.isPersonalBest,confirmed);
    assert.equal(result.performanceHistory.isManualPersonalBest,confirmed);
    const card=renderAthleteCard(result);
    if(confirmed){
      assert.equal(result.performanceHistory.previousBest,null);
      assert.equal(result.performanceHistory.improvementSeconds,null);
      assert.match(card,/badge pb/);
      assert.match(card,/bekreftet i utøverregisteret/);
      assert.doesNotMatch(card,/athlete-card-improvement/);
    }else assert.doesNotMatch(card,/badge pb/);
  }
  const filtered=selectArchivePage(data.races,{query:'Markus Valås Hagen',onlyRecords:true});
  assert.equal(filtered.resultCount,2);
});
