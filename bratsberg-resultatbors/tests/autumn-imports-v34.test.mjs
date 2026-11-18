import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {genderPosition} from '../dist/athlete-cards.js';
import {createWidgetSlots} from '../dist/widget.js';

const root=new URL('../dist/',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const manifest=await json('data/index.json');
const raw={...manifest,races:await Promise.all(manifest.races.map(json)),athletes:await json(manifest.athletes),records:await json(manifest.records),relays:await json(manifest.relays),upcoming:await json(manifest.upcoming)};
const prepared=prepareResultsData(raw);

test('Amsterdam and Berlin retain checked net times, gender ranks and existing athlete identities',()=>{
  // Transcribed from Sporthive participant records and the sourced Berlin timing mirror.
  const expected={
    'amsterdam-maraton-2026':{
      'rannei-saether':['Halvmaraton','1:35:43','1:37:04','K',154],
      'trond-sliper':['Halvmaraton','1:18:32','1:19:11','M',107],
      'ingvild-saksvik-lehouillier':['Halvmaraton','1:30:17','1:30:58','K',92],
      'eline-bjorgvik':['Maraton','2:54:41','2:57:16','K',56],
      'heidi-stokka-skullerud':['Maraton','3:19:26','3:27:48','K',356],
      'alex-mauro':['Maraton','2:30:11','2:30:45','M',142],
      'bjarne-austad':['Maraton','3:01:13','3:02:31','M',1945],
      'merete-elvan':['Halvmaraton','1:41:23','1:56:07','K',434]
    },
    'berlin-maraton-2026':{
      'alexander-solnor':['Maraton','2:30:04','2:30:35','M',283],
      'mats-flaaten':['Maraton','2:40:13','2:41:02','M',900],
      'camilla-marie-flaaten':['Maraton','2:40:13','2:41:02','K',40]
    }
  };
  for(const [raceId,rows] of Object.entries(expected)){
    const race=prepared.races.find(r=>r.id===raceId);
    assert.equal(race.date,raceId.startsWith('amsterdam')?'2026-10-18':'2026-09-27');
    assert.equal(race.results.length,Object.keys(rows).length);
    for(const result of race.results){
      assert.deepEqual([result.distance,result.time,result.gunTime,result.gender,genderPosition(result)],rows[result.athleteId]);
      assert.equal(result.time,result.netTime);assert.equal(result.timeBasis,'net');
      assert.equal(result.waScore.eligible,true);assert.equal(result.waScore.gender,result.gender);
      assert.match(result.sourceUrl,/^https:\/\//);
    }
  }
  const berlin=prepared.races.find(r=>r.id==='berlin-maraton-2026');
  assert.equal(berlin.source.type,'secondary-results');
  const camilla=berlin.results.find(r=>r.athleteId==='camilla-marie-flaaten');
  assert.equal(camilla.waScore.score,1024);
  assert.equal(camilla.ageGrade.age,36);
  assert.ok(prepared.portraits[camilla.athleteId]);
  assert.equal(prepared.unresolvedAthletes.length,0);
  const slots=createWidgetSlots(prepared.races);
  for(const raceId of Object.keys(expected))assert.ok(slots.some(r=>r?.id===raceId));
});

test('confirmed DNS and missing finish times never enter Amsterdam cards, histories or points',()=>{
  const rawRace=raw.races.find(r=>r.id==='amsterdam-maraton-2026');
  const anita=rawRace.results.find(r=>r.athleteId==='anita-kvam');
  const agnes=rawRace.results.find(r=>r.athleteId==='agnes-holstad');
  assert.equal(anita.status,'DNS');assert.equal(anita.distance,undefined);
  assert.equal(agnes.status,'unknown');assert.equal(agnes.time,undefined);
  const race=prepared.races.find(r=>r.id===rawRace.id);
  assert.ok(race.results.every(r=>!['anita-kvam','agnes-holstad'].includes(r.athleteId)));
  assert.ok(raw.athletes.athletes.some(a=>a.id==='eline-megard-bjorgvik'));
  assert.ok(raw.athletes.athletes.some(a=>a.id==='eline-bjorgvik'));
});
