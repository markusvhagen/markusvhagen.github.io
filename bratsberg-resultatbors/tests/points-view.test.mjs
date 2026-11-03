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
  assert.match(html,/100,0 <small>poeng/);
  assert.doesNotMatch(html,/9999|Unverified|Wrong season|Unsafe source|javascript:/);
  assert.match(html,/Kontrollert 03\.11\.2026/);
  assert.equal((html.match(/Ikke bekreftet/g)||[]).length,7);
  assert.doesNotMatch(renderPointsReferences(references,'M'),/Verified &lt;runner&gt;|points-reference-K/);
});

test('points table preserves supplied ascending order, safely links races and highlights only the best row',()=>{
  const row={athleteId:'runner',name:'Runner <script>',score:75.25,gender:'K',age:45,date:'2026-05-01',raceId:'race/one',raceName:'Race & field',distance:'10 km',time:'41:00',ageBasis:'birth-year'};
  const html=renderPointsTable({rows:[row,{...row,athleteId:'runner2',name:'Second',score:85}]});
  assert.match(html,/aria-sort="ascending"/);
  assert.match(html,/Runner &lt;script&gt;/);
  assert.match(html,/href="#lop\/race%2Fone"/);
  assert.match(html,/Race &amp; field/);
  assert.equal((html.match(/class="points-best-row"/g)||[]).length,1);
  assert.ok(html.indexOf('Runner &lt;script&gt;')<html.indexOf('Second'));
  assert.match(renderPointsTable({rows:[row]},{sort:'desc'}),/aria-sort="descending"/);
  assert.match(renderPointsTable({rows:[]}),/Ingen poengnoteringer/);
});

test('mounted filters stay selected when source data refreshes and gender controls remain independent',()=>{
  const node=(value='')=>({value,innerHTML:'',textContent:'',handlers:{},addEventListener(type,handler){this.handlers[type]=handler;}});
  const names=['query','distance','year','national','table','summary','coverage'];
  const nodes=Object.fromEntries(names.map(name=>[name,node()]));
  const buttons=['','K','M'].map(gender=>({dataset:{pointsGender:gender},pressed:false,setAttribute(name,value){if(name==='aria-pressed')this.pressed=value==='true';},classList:{toggle(){}}}));
  const root={innerHTML:'',handlers:{},querySelector(selector){return nodes[selector.slice(13,-1)];},querySelectorAll(){return buttons;},contains(button){return buttons.includes(button);},addEventListener(type,handler){this.handlers[type]=handler;}};
  const performance=(athleteId,gender,score,distance='10 km')=>({athleteId,name:athleteId,gender,time:'40:00',distance,status:'finished',ageGrade:{eligible:true,score,age:40,ageBasis:'birth-year'}});
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
  assert.match(root.innerHTML,/For din alder og ditt kjønn på denne distansen/);
  assert.match(nodes.table.innerHTML,/aria-sort="descending"/);
  assert.equal(nodes.distance.value,'10 km');
  assert.match(nodes.summary.textContent,/2 utøvere.*Høyeste poeng øverst/);
  assert.ok(nodes.table.innerHTML.indexOf('Other woman')<nodes.table.innerHTML.indexOf('>Woman'));
});
