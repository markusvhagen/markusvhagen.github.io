import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {selectArchivePage} from '../dist/archive.js';
import {createWidgetSlots,selectWidgetHighlights} from '../dist/widget.js';

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
