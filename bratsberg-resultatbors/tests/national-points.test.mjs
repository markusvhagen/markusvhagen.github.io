import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {gradeRaceResult} from '../dist/age-grading.js';
import {gradeWaResult} from '../dist/wa-scoring.js';
import {renderPointsReferences} from '../dist/points-view.js';
const data=JSON.parse(await readFile(new URL('../dist/data/national-points.json',import.meta.url),'utf8'));

test('all eight national references are dated, sourced, and computed with the shared calculator',()=>{
 assert.equal(data.entries.length,8);
 assert.equal(data.rankingMetric,'wa');
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
  assert.ok(Number.isFinite(grade.score)&&grade.score>0);
  const wa=gradeWaResult({date:entry.date,type:'road'},{...entry,status:'finished'});
  assert.equal(wa.eligible,true,entry.name);
  assert.equal(wa.gender,entry.gender);
  assert.ok(Number.isInteger(wa.score)&&wa.score>1000);
 }
 const html=renderPointsReferences(data);
 assert.doesNotMatch(html,/Ikke bekreftet/);
 assert.equal((html.match(/points-reference-score/g)||[]).length,8);
 assert.match(html,/ingen offisiell rekordliste/);
});

test('national WA references show separate gender leaders and preserve every distance',()=>{
 const women=renderPointsReferences(data,'K'),men=renderPointsReferences(data,'M');
 assert.match(women,/Amalie Sæten/);
 assert.match(women,/Therese Johaug/);
 assert.match(women,/Sofie Karoline Haugen/);
 assert.doesNotMatch(women,/Jakob Ingebrigtsen/);
 assert.match(men,/Sondre Nordstad Moen/);
 assert.match(men,/Awet Nftalem Kibrab/);
 const menNames=[...men.matchAll(/class="points-reference-name">([^<]+)</g)].map(match=>match[1]);
 assert.ok(menNames.every(name=>!['Amalie Sæten','Therese Johaug','Sofie Karoline Haugen'].includes(name)));
 for(const html of [women,men]){
  assert.equal((html.match(/class="points-reference-card"/g)||[]).length,4);
  assert.equal((html.match(/points-reference-score/g)||[]).length,4);
 }
});

test('the newer verified Málaga performance supplements the older national marathon list',()=>{
 const reference=data.entries.find(entry=>entry.gender==='K'&&entry.distance==='Maraton');
 assert.equal(reference.name,'Sofie Karoline Haugen');
 assert.equal(reference.time,'2:27:13');
 assert.equal(reference.measuredTime,'2:27:12.259');
 assert.equal(reference.date,'2026-11-08');
 assert.equal(reference.verification.nationalListUpdatedAt,'2026-11-06');
 assert.equal(gradeWaResult({type:'road'},reference).score,1143);
});
