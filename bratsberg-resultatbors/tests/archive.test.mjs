import test from 'node:test';
import assert from 'node:assert/strict';
import {selectArchivePage} from '../dist/archive.js';

const races=Array.from({length:25},(_,i)=>({id:'race-'+i,name:'Løp '+i,date:'2026-01-'+String(i+1).padStart(2,'0'),location:'Trondheim',demo:false,
  results:[{name:'Løper '+i,sourceName:i===0?'Unikt kildenavn':'',gender:i%2?'K':'M',distance:'10 km',time:'40:00',status:'finished'}]}));

test('archive shows ten newest races and keeps every older race reachable without mutating input',()=>{
  const original=structuredClone(races),first=selectArchivePage(races),second=selectArchivePage(races,{},2),third=selectArchivePage(races,{},3);
  assert.equal(first.items.length,10);assert.equal(first.items[0].race.id,'race-24');
  assert.equal(first.pageCount,3);assert.equal(second.from,11);assert.equal(second.to,20);assert.equal(third.items.length,5);
  const all=[...first.items,...second.items,...third.items].map(item=>item.race.id);
  assert.equal(new Set(all).size,25);assert.deepEqual(races,original);
});

test('search and gender filters run over the complete archive before pagination',()=>{
  const searched=selectArchivePage(races,{query:'unikt kildenavn'},1);
  assert.equal(searched.total,1);assert.equal(searched.items[0].race.id,'race-0');
  const women=selectArchivePage(races,{gender:'K'},1);
  assert.equal(women.total,12);assert.equal(women.pageCount,2);assert.equal(women.items.length,10);
  assert.equal(selectArchivePage(races,{gender:'K'},2).items.length,2);
});

test('a deep-linked race selects its correct page and page requests clamp safely',()=>{
  const deep=selectArchivePage(races,{},1,{focusRaceId:'race-0'});
  assert.equal(deep.page,3);assert.ok(deep.items.some(({race})=>race.id==='race-0'));
  assert.equal(selectArchivePage(races,{},999).page,3);assert.equal(selectArchivePage(races,{},-5).page,1);
  const empty=selectArchivePage(races,{query:'No match'},8);
  assert.equal(empty.page,1);assert.equal(empty.total,0);assert.deepEqual(empty.items,[]);
});

test('demo races stay excluded and combined filters count only matching entries',()=>{
  const input=[...races,{...races[0],id:'example',demo:true,date:'2027-01-01'}];
  const result=selectArchivePage(input,{distance:'10 km',status:'finished',year:'2026',gender:'M'});
  assert.equal(result.total,13);assert.equal(result.resultCount,13);
  assert.equal(selectArchivePage(input,{onlyRecords:true}).total,0);
});

test('non-finishers stay absent even when raw rows reach the archive; PB comes from history',()=>{
  const input=[{...races[0],results:[
    {...races[0].results[0],name:'Finished'},
    {...races[0].results[0],name:'Improved',performanceHistory:{isPersonalBest:true}},
    {...races[0].results[0],name:'Old flag',pb:true},
    {...races[0].results[0],name:'Did not start',status:'DNS'},
    {...races[0].results[0],name:'Did not finish',status:'DNF'}
  ]}];
  const result=selectArchivePage(input);
  assert.equal(result.resultCount,3);
  assert.deepEqual(selectArchivePage(input,{onlyRecords:true}).items[0].matching.map(r=>r.name),['Improved']);
  assert.equal(selectArchivePage(input,{query:'Did not'}).total,0);
});

test('points sorting prioritizes scores inside each race and leaves ungraded results last',()=>{
  const row=(name,time,score)=>({name,time,gender:'M',distance:'10 km',status:'finished',ageGrade:{eligible:score!==null,score}});
  const input=[{...races[0],results:[row('Unknown','30:00',null),row('Faster','33:00',72),row('Older','35:00',85)]}];
  const original=structuredClone(input);
  assert.deepEqual(selectArchivePage(input).items[0].matching.map(result=>result.name),['Unknown','Faster','Older']);
  assert.deepEqual(selectArchivePage(input,{sort:'age-grade'}).items[0].matching.map(result=>result.name),['Older','Faster','Unknown']);
  assert.deepEqual(input,original);
});
