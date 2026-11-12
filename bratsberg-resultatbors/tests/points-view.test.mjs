import test from 'node:test';
import assert from 'node:assert/strict';
import {renderPointsReferences,renderPointsTable,mountPointsView} from '../dist/points-view.js';

test('national references recalculate scores and require verified dated sources',()=>{
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
  assert.match(html,/Beste norske aldersjusterte noteringer/);
  assert.doesNotMatch(html,/9999|Unverified|Wrong season|Unsafe source|javascript:/);
  assert.match(html,/Kontrollert 03\.11\.2026/);
  assert.equal((html.match(/Ikke bekreftet/g)||[]).length,7);
  assert.doesNotMatch(renderPointsReferences(references,'M'),/Verified &lt;runner&gt;|points-reference-K/);
});

test('points table preserves supplied ascending order, safely links races and highlights only the best row',()=>{
  const row={athleteId:'runner',name:'Runner <script>',score:75.99,ageScore:75.99,waScore:703,gender:'K',age:45,date:'2026-05-01',raceId:'race/one',raceName:'Race & field',distance:'10 km',time:'41:00',result:{measuredTime:'00:40:59.900'},ageBasis:'birth-year'};
  const html=renderPointsTable({rows:[row,{...row,athleteId:'runner2',name:'Second',score:85,ageScore:85}]},{sort:'asc'});
  assert.match(html,/aria-sort="ascending"/);
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
  assert.ok(html.indexOf('Runner &lt;script&gt;')<html.indexOf('Second'));
  assert.match(renderPointsTable({rows:[row]},{sort:'desc'}),/aria-sort="descending"/);
  assert.match(renderPointsTable({rows:[]}),/Ingen poengnoteringer/);
});

test('mounted filters stay selected when source data refreshes and gender controls remain independent',()=>{
  const node=(value='')=>({value,innerHTML:'',textContent:'',handlers:{},addEventListener(type,handler){this.handlers[type]=handler;}});
  const names=['query','distance','year','metric','national','table','summary','coverage','filter-count'];
  const nodes=Object.fromEntries(names.map(name=>[name,node()]));
  const buttons=['','K','M'].map(gender=>({dataset:{pointsGender:gender},pressed:false,setAttribute(name,value){if(name==='aria-pressed')this.pressed=value==='true';},classList:{toggle(){}}}));
  const root={innerHTML:'',handlers:{},querySelector(selector){return nodes[selector.slice(13,-1)];},querySelectorAll(){return buttons;},contains(button){return buttons.includes(button);},addEventListener(type,handler){this.handlers[type]=handler;}};
  const performance=(athleteId,gender,score,distance='10 km')=>({athleteId,name:athleteId,gender,time:'40:00',distance,status:'finished',waScore:{eligible:true,score:gender==='K'?800:600},ageGrade:{eligible:true,score,age:40,ageBasis:'birth-year'}});
  let races=[{id:'race',name:'Race',date:'2026-05-01',type:'road',results:[performance('Woman','K',85),performance('Man','M',75)]}];
  const view=mountPointsView(root,{getRaces:()=>races});
  assert.match(nodes.summary.textContent,/2 utøvere/);
  root.handlers.click({target:{closest(){return buttons[1];}}});
  assert.equal(buttons[1].pressed,true);
  assert.doesNotMatch(nodes.table.innerHTML,/>Man</);
  nodes.distance.value='10 km';nodes.distance.handlers.change();
  races=[{...races[0],results:[...races[0].results,performance('Other woman','K',91)]}];
  view.render();
  assert.doesNotMatch(root.innerHTML,/data-points-sort|Rekkefølge/);
  assert.ok(root.innerHTML.indexOf('100 poeng ≈ verdensrekordnivå')<root.innerHTML.indexOf('data-points-table'));
  assert.ok(root.innerHTML.indexOf('data-points-table')<root.innerHTML.indexOf('data-points-national'));
  assert.match(root.innerHTML,/Ranger etter/);
  assert.match(root.innerHTML,/data-points-metric/);
  assert.match(root.innerHTML,/<details class="points-guide"><summary/);
  assert.match(root.innerHTML,/<details class="points-filter-panel" data-points-filter-panel><summary/);
  assert.ok(root.innerHTML.indexOf('data-points-metric')<root.innerHTML.indexOf('data-points-filter-panel'));
  assert.equal(nodes['filter-count'].textContent,'1');
  assert.equal(nodes['filter-count'].hidden,false);
  assert.match(root.innerHTML,/For din alder og ditt kjønn på denne distansen/);
  assert.match(nodes.table.innerHTML,/aria-sort="descending"/);
  assert.equal(nodes.distance.value,'10 km');
  assert.match(nodes.summary.textContent,/2 utøvere.*Høyeste poeng øverst/);
  assert.ok(nodes.table.innerHTML.indexOf('Other woman')<nodes.table.innerHTML.indexOf('>Woman'));
});


test('WA rows show both independent scales and a clear missing-age state',()=>{
  const html=renderPointsTable({rows:[{athleteId:'runner',name:'Runner',score:1088,waScore:1088,ageScore:null,gender:'M',age:null,date:'2026-05-01',raceId:'race',raceName:'Race',distance:'10 km',time:'29:00',result:{ageGrade:{eligible:false,reason:'missing-age'}}}]},{metric:'wa'});
  assert.match(html,/Rangert etter WA-poeng/);
  assert.match(html,/points-score-wa is-ranked/);
  assert.doesNotMatch(html,/points-score-age is-ranked/);
  assert.match(html,/<strong>1088<\/strong>/);
  assert.match(html,/Aldersjustert<\/span><strong>—<\/strong>/);
  assert.match(html,/Mangler gyldig alder/);
  assert.doesNotMatch(html,/NaN|undefined/);
});

test('changing score type keeps filters and includes WA performances without birth years',()=>{
  const node=(value='')=>({value,innerHTML:'',textContent:'',handlers:{},addEventListener(type,handler){this.handlers[type]=handler;}});
  const nodes=Object.fromEntries(['query','distance','year','metric','national','table','summary','coverage','filter-count'].map(name=>[name,node()]));
  const root={innerHTML:'',querySelector(selector){return nodes[selector.slice(13,-1)];},addEventListener(){}};
  const result=(name,ageScore,waScore)=>({athleteId:name,name,gender:'K',time:'35:00',distance:'10 km',status:'finished',waScore:{eligible:true,score:waScore},ageGrade:ageScore===null?{eligible:false,reason:'missing-age'}:{eligible:true,score:ageScore,age:40,ageBasis:'birth-year'}});
  const races=[{id:'race',name:'Race',date:'2026-05-01',type:'road',results:[result('Age leader',95.8,850),result('WA leader',91.2,1100),result('Unknown age',null,950)]}];
  const view=mountPointsView(root,{getRaces:()=>races});
  assert.match(nodes.summary.textContent,/2 utøvere/);
  assert.ok(nodes.table.innerHTML.indexOf('Age leader')<nodes.table.innerHTML.indexOf('WA leader'));
  nodes.metric.value='wa';nodes.distance.value='10 km';nodes.year.value='2026';nodes.metric.handlers.change();
  assert.match(nodes.summary.textContent,/3 utøvere.*Høyeste poeng øverst/);
  assert.match(nodes.table.innerHTML,/Rangert etter WA-poeng/);
  assert.ok(nodes.table.innerHTML.indexOf('WA leader')<nodes.table.innerHTML.indexOf('Unknown age'));
  assert.ok(nodes.table.innerHTML.indexOf('Unknown age')<nodes.table.innerHTML.indexOf('Age leader'));
  assert.match(nodes.table.innerHTML,/95,8/);
  assert.match(nodes.table.innerHTML,/1100/);
  assert.equal(nodes.distance.value,'10 km');assert.equal(nodes.year.value,'2026');
  assert.equal(nodes['filter-count'].textContent,'2');assert.equal(nodes['filter-count'].hidden,false);
  view.render();assert.equal(nodes.metric.value,'wa');
});

test('national reference selection stays age-adjusted while showing WA for that same performance',()=>{
  const references={year:2026,entries:[
    {name:'Age leader',gender:'K',distance:'10 km',date:'2026-05-01',time:'31:00',birthYear:1981,verified:true,sourceUrl:'https://example.org/older'},
    {name:'Faster runner',gender:'K',distance:'10 km',date:'2026-05-01',time:'30:00',birthYear:2000,verified:true,sourceUrl:'https://example.org/younger'}
  ]};
  const html=renderPointsReferences(references,'K');
  assert.match(html,/Age leader/);
  assert.doesNotMatch(html,/Faster runner/);
  assert.match(html,/31:00/);
  assert.match(html,/100,0<\/strong>/);
  assert.match(html,/WA-poeng/);
  assert.match(html,/ikke en toppliste for WA-poeng/);
});
