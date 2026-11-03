import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gradeRaceResult} from '../dist/age-grading.js';
import {renderPointsReferences} from '../dist/points-view.js';
const data=JSON.parse(await readFile(new URL('../dist/data/national-points.json',import.meta.url),'utf8'));

test('all eight national references are dated, sourced, and computed with the shared calculator',()=>{
 assert.equal(data.entries.length,8);
 assert.equal(new Set(data.entries.map(e=>e.gender+'|'+e.distance)).size,8);
 const sources=new Set(data.sources.map(s=>s.url));
 for(const entry of data.entries){
  assert.equal(entry.verified,true);
  assert.ok(sources.has(entry.sourceUrl));
  assert.ok(entry.date.startsWith(String(data.year))&&entry.date<=data.checkedAt);
  assert.equal(new URL(entry.sourceUrl).protocol,'https:');
  assert.ok(!Object.hasOwn(entry,'score'));
  const grade=gradeRaceResult({date:entry.date,type:'road'},{...entry,status:'finished'},{birthYear:entry.birthYear});
  assert.equal(grade.eligible,true,entry.name);
  assert.equal(grade.age,2026-entry.birthYear);
  assert.ok(grade.score>90&&grade.score<110);
 }
 const html=renderPointsReferences(data);
 assert.doesNotMatch(html,/Ikke bekreftet/);
 assert.equal((html.match(/points-reference-score/g)||[]).length,8);
 assert.match(html,/ingen offisiell rekordliste/);
});

test('national points above the age standard remain above 100 and gender filter preserves every distance',()=>{
 const women=renderPointsReferences(data,'K'),men=renderPointsReferences(data,'M');
 assert.match(women,/101,3 <small>poeng/);
 assert.doesNotMatch(women,/Jakob Ingebrigtsen/);
 assert.doesNotMatch(men,/Synøve Brox/);
 for(const html of [women,men]){
  assert.equal((html.match(/class="points-reference-card"/g)||[]).length,4);
  assert.equal((html.match(/points-reference-score/g)||[]).length,4);
 }
});
