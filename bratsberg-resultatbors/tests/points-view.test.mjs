import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPointsReferences,renderPointsTable,mountPointsView} from '../dist/points-view.js';

const performance=(athleteId,gender,waScore,ageScore=80,distance='10 km')=>({athleteId,name:athleteId,gender,time:'35:00',distance,status:'finished',waScore:{eligible:true,score:waScore},ageGrade:ageScore===null?{eligible:false,reason:'missing-age'}:{eligible:true,score:ageScore,age:40,ageBasis:'birth-year'}});
function mockView(){
  const node=(value='')=>({value,innerHTML:'',textContent:'',handlers:{},addEventListener(type,handler){this.handlers[type]=handler;}});
  const nodes=Object.fromEntries(['query','distance','year','national','table','summary','coverage','filter-count'].map(name=>[name,node()]));
  const buttons=['','K','M'].map(gender=>({dataset:{pointsGender:gender},pressed:false,setAttribute(name,value){if(name==='aria-pressed')this.pressed=value==='true';},classList:{toggle(){}}}));
  const ageButtons=[];
  const root={innerHTML:'',handlers:{},querySelector(selector){return nodes[selector.slice(13,-1)];},querySelectorAll(){return buttons;},contains(button){return [...buttons,...ageButtons].includes(button);},addEventListener(type,handler){this.handlers[type]=handler;}};
  const clickGender=index=>root.handlers.click({target:{closest(selector){return selector==='[data-points-gender]'?buttons[index]:null;}}});
  const clickAge=athleteId=>{const button={dataset:{pointsEditAge:athleteId}};ageButtons.push(button);root.handlers.click({target:{closest(selector){return selector==='[data-points-edit-age]'?button:null;}}});};
  return {root,nodes,buttons,clickGender,clickAge};
}

test('national references recalculate both scores and require verified dated sources',()=>{
  const references={year:2026,checkedAt:'2026-11-03',entries:[
    {name:'Verified <runner>',gender:'K',distance:'10 km',date:'2026-05-01',time:'31:00',birthYear:1981,score:9999,verified:true,sourceUrl:'https://example.org/result'},
    {name:'Unverified',gender:'K',distance:'5 km',date:'2026-05-01',time:'15:00',birthYear:1980,verified:false,sourceUrl:'https://example.org/result'},
    {name:'Wrong season',gender:'M',distance:'Maraton',date:'2025-05-01',time:'2:10:00',birthYear:1980,verified:true,sourceUrl:'https://example.org/result'},
    {name:'Unsafe source',gender:'M',distance:'Halvmaraton',date:'2026-05-01',time:'1:00:00',birthYear:1980,verified:true,sourceUrl:'javascript:alert(1)'}
  ]};
  const html=renderPointsReferences(references);
  assert.match(html,/Verified &lt;runner&gt;/);
  assert.match(html,/100,0<\/strong>/);
  assert.match(html,/WA-poeng/);
  assert.match(html,/Beste norske WA-noteringer/);
  assert.doesNotMatch(html,/9999|Unverified|Wrong season|Unsafe source|javascript:/);
  assert.match(html,/Kontrollert 03\.11\.2026/);
  assert.equal((html.match(/Ikke bekreftet/g)||[]).length,7);
  assert.doesNotMatch(renderPointsReferences(references,'M'),/Verified &lt;runner&gt;|points-reference-K/);
});

test('points table sorts WA descending, safely links races and highlights the best row without mutating input',()=>{
  const row={athleteId:'runner',name:'Runner <script>',score:703,ageScore:75.99,waScore:703,gender:'K',age:45,date:'2026-05-01',raceId:'race/one',raceName:'Race & field',distance:'10 km',time:'41:00',result:{measuredTime:'00:40:59.900'},ageBasis:'birth-year'};
  const input={rows:[row,{...row,athleteId:'runner2',name:'Second',score:850,waScore:850,ageScore:70}]};
  const before=structuredClone(input),html=renderPointsTable(input);
  assert.match(html,/aria-sort="descending"/);
  assert.match(html,/Runner &lt;script&gt;/);
  assert.match(html,/href="#lop\/race%2Fone"/);
  assert.match(html,/Race &amp; field/);
  assert.match(html,/<strong>76,0<\/strong>/);
  assert.match(html,/class="points-result-time">40:59<\/strong>/);
  assert.match(html,/<table class="points-table" role="table">/);
  assert.match(html,/scope="row" role="rowheader" class="points-name-cell" id="points-athlete-0"/);
  assert.match(html,/headers="points-athlete-0 points-col-score"/);
  assert.match(html,/headers="points-athlete-0 points-col-performance"/);
  assert.match(html,/headers="points-athlete-0 points-col-date"/);
  assert.equal((html.match(/class="points-best-row"/g)||[]).length,1);
  assert.ok(html.indexOf('Second')<html.indexOf('Runner &lt;script&gt;'));
  assert.match(renderPointsTable({rows:[]}),/Ingen poengnoteringer/);
  assert.deepEqual(input,before);
});

test('mounted filters stay selected when data refreshes, with fixed WA ranking and independent gender controls',()=>{
  const {root,nodes,buttons,clickGender}=mockView();
  let races=[{id:'race',name:'Race',date:'2026-05-01',type:'road',results:[performance('Woman','K',850),performance('Man','M',750)]}];
  const view=mountPointsView(root,{getRaces:()=>races});
  assert.match(nodes.summary.textContent,/2 utøvere/);
  clickGender(1);
  assert.equal(buttons[1].pressed,true);
  assert.doesNotMatch(nodes.table.innerHTML,/>Man</);
  nodes.distance.value='10 km';nodes.distance.handlers.change();
  races=[{...races[0],results:[...races[0].results,performance('Other woman','K',910)]}];
  view.render();
  assert.doesNotMatch(root.innerHTML,/data-points-sort|Rekkefølge|data-points-metric|Ranger etter/);
  assert.ok(root.innerHTML.indexOf('100 poeng ≈ verdensrekordnivå')<root.innerHTML.indexOf('data-points-table'));
  assert.ok(root.innerHTML.indexOf('data-points-table')<root.innerHTML.indexOf('data-points-national'));
  assert.match(root.innerHTML,/<details class="points-guide"><summary/);
  assert.match(root.innerHTML,/<details class="points-filter-panel" data-points-filter-panel><summary/);
  assert.equal(nodes['filter-count'].textContent,'1');
  assert.equal(nodes['filter-count'].hidden,false);
  assert.match(root.innerHTML,/For din alder og ditt kjønn på denne distansen/);
  assert.doesNotMatch(root.innerHTML,/samme.*som i løpsresultatene|manuelt i løpsresultatene/i);
  assert.match(nodes.table.innerHTML,/aria-sort="descending"/);
  assert.equal(nodes.distance.value,'10 km');
  assert.match(nodes.summary.textContent,/2 utøvere.*Høyeste WA-poeng øverst/);
  assert.ok(nodes.table.innerHTML.indexOf('Other woman')<nodes.table.innerHTML.indexOf('>Woman'));
});

test('WA rows show both independent scales and a clear missing-age state',()=>{
  const html=renderPointsTable({rows:[{athleteId:'runner',name:'Runner',score:1088,waScore:1088,ageScore:null,gender:'M',age:null,date:'2026-05-01',raceId:'race',raceName:'Race',distance:'10 km',time:'29:00',result:{ageGrade:{eligible:false,reason:'missing-age'}}}]});
  assert.match(html,/Rangert etter WA-poeng/);
  assert.match(html,/points-score-wa is-ranked/);
  assert.doesNotMatch(html,/points-score-age is-ranked/);
  assert.match(html,/<strong>1088<\/strong>/);
  assert.match(html,/Aldersjustert<\/span><strong>—<\/strong>/);
  assert.match(html,/Mangler gyldig alder/);
  assert.doesNotMatch(html,/NaN|undefined/);
});

test('WA is the default ranking and stays unchanged by higher age points or missing birth years',()=>{
  const {root,nodes}=mockView();
  const races=[{id:'race',name:'Race',date:'2026-05-01',type:'road',results:[performance('Age leader','K',850,95.8),performance('WA leader','K',1100,91.2),performance('Unknown age','K',950,null)]}];
  const view=mountPointsView(root,{getRaces:()=>races});
  assert.match(nodes.summary.textContent,/3 utøvere/);
  assert.ok(nodes.table.innerHTML.indexOf('WA leader')<nodes.table.innerHTML.indexOf('Unknown age'));
  assert.ok(nodes.table.innerHTML.indexOf('Unknown age')<nodes.table.innerHTML.indexOf('Age leader'));
  nodes.distance.value='10 km';nodes.year.value='2026';nodes.distance.handlers.change();
  assert.match(nodes.summary.textContent,/3 utøvere.*Høyeste WA-poeng øverst/);
  assert.match(nodes.table.innerHTML,/95,8/);
  assert.match(nodes.table.innerHTML,/1100/);
  assert.equal(nodes.distance.value,'10 km');assert.equal(nodes.year.value,'2026');
  assert.equal(nodes['filter-count'].textContent,'2');assert.equal(nodes['filter-count'].hidden,false);
  races[0].results[2].ageGrade={eligible:true,score:123.45,age:75};
  view.render();
  assert.ok(nodes.table.innerHTML.indexOf('WA leader')<nodes.table.innerHTML.indexOf('Unknown age'));
  assert.match(nodes.table.innerHTML,/123,5/);
});

test('manual age editing is available on points and passes the exact selected WA performance',()=>{
  const {root,nodes,clickAge}=mockView(),calls=[];
  const faster=performance('Ada','K',1050,null),olderBest=performance('Ada','K',900,99);
  const races=[{id:'fast-race',name:'Fast',date:'2026-05-01',results:[faster]},{id:'older-race',name:'Old',date:'2026-01-01',results:[olderBest]}];
  mountPointsView(root,{getRaces:()=>races,onEditAge:selection=>calls.push(selection)});
  assert.match(nodes.table.innerHTML,/data-points-edit-age="Ada"/);
  assert.match(nodes.table.innerHTML,/aria-controls="age-grade-dialog"/);
  assert.match(nodes.table.innerHTML,/Legg inn alder/);
  clickAge('Ada');
  assert.equal(calls.length,1);
  assert.equal(calls[0].athleteId,'Ada');assert.equal(calls[0].raceId,'fast-race');assert.equal(calls[0].result,faster);
  clickAge('not-present');assert.equal(calls.length,1);
});

test('national reference selection uses WA and keeps age points attached to that same performance',()=>{
  const references={year:2026,entries:[
    {name:'Age leader',gender:'K',distance:'10 km',date:'2026-05-01',time:'31:00',birthYear:1981,verified:true,sourceUrl:'https://example.org/older'},
    {name:'Faster runner',gender:'K',distance:'10 km',date:'2026-05-01',time:'30:00',birthYear:2000,verified:true,sourceUrl:'https://example.org/younger'},
    {name:'No birth year',gender:'M',distance:'5 km',date:'2026-05-01',time:'13:00',verified:true,sourceUrl:'https://example.org/no-age'}
  ]};
  const html=renderPointsReferences(references,'K');
  assert.match(html,/Faster runner/);
  assert.doesNotMatch(html,/Age leader|31:00/);
  assert.match(html,/30:00/);
  assert.match(html,/WA-poeng/);
  assert.doesNotMatch(html,/100,0<\/strong>/);
  assert.match(renderPointsReferences(references,'M'),/No birth year/);
});
