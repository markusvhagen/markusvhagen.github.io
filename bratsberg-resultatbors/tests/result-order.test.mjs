import test from 'node:test';
import assert from 'node:assert/strict';
import {sortResultsByTime} from '../dist/result-order.js';
import {selectArchivePage} from '../dist/archive.js';
import {readFile} from 'node:fs/promises';
import {parsePerformanceTime} from '../dist/record-check.js';

test('numeric time ordering supports hours, decimals and stable ties without mutating raw data',()=>{
  const rows=[{time:'1:02:00'},{time:'59:59'},{time:'9:59'},{time:'10:00'},
    {time:'16:30,20',name:'first tie'},{time:'16:30.2',name:'second tie'},
    {time:'16:30.19'},{time:null},{time:'1:99:00'}];
  const original=structuredClone(rows);
  assert.deepEqual(sortResultsByTime(rows).map(r=>r.time),['9:59','10:00','16:30.19','16:30,20','16:30.2','59:59','1:02:00',null,'1:99:00']);
  assert.deepEqual(rows,original);
  assert.deepEqual(sortResultsByTime(undefined),[]);
});

test('Trønder-Østløpet archive is fastest-first within each distance, including after gender filtering',async()=>{
  const race=JSON.parse(await readFile(new URL('../dist/data/races/tronder-ostlopet-2026.json',import.meta.url),'utf8'));
  const original=JSON.stringify(race);
  for(const gender of ['', 'K', 'M']){
    const matching=selectArchivePage([race],{gender}).items[0].matching;
    for(const distance of race.distances){
      const times=matching.filter(r=>r.distance===distance).map(r=>parsePerformanceTime(r.time));
      assert.deepEqual(times,[...times].sort((a,b)=>a-b));
    }
  }
  assert.equal(JSON.stringify(race),original);
});
