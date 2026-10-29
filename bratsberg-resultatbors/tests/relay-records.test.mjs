import test from 'node:test';
import assert from 'node:assert/strict';
import {renderRelays,relayPace} from '../dist/relays.js';

// A small rendering surface exercises selection and output, without pretending
// to be a browser or asserting visual layout.
class RenderSurface {
  dataset={};
  html='';
  lineup={innerHTML:''};
  summary={textContent:''};
  set innerHTML(value){this.html=value;this.lineup.innerHTML='';}
  get innerHTML(){return this.html;}
  querySelector(selector){
    if(selector==='.relay-lineup')return this.html.includes('class="relay-lineup"')?this.lineup:null;
    if(selector==='.relay-lineup-summary')return this.summary;
    return null;
  }
  querySelectorAll(){return [];}
  addEventListener(){}
}
const leg={number:1,name:'Testløper',athleteId:'test',time:'3:00',pace:'2:59',distanceMeters:1000};
const data={portraits:{},relays:[
  {id:'registered',name:'Registrert stafett',legCount:1,records:[
    {gender:'K',year:2026,time:'3:00',legs:[leg]},
    {gender:'M',year:2026,time:'2:50',legs:[{...leg,name:'Mannlig løper',time:'2:50'}]},
  ]},
  {id:'unregistered',name:'Uregistrert stafett',records:[],history:[{time:'2:00'}],demoTeam:{demo:true,legs:[leg]}},
]};

test('an explicit gender link overrides the prior relay selection',()=>{
  const root=new RenderSurface();
  renderRelays(root,data,'registered','M');
  assert.match(root.innerHTML,/<strong>2:50<\/strong>/);
  assert.match(root.lineup.innerHTML,/Mannlig løper/);
  renderRelays(root,data,'registered','K');
  assert.match(root.innerHTML,/<strong>3:00<\/strong>/);
  assert.doesNotMatch(root.lineup.innerHTML,/Mannlig løper/);
});

test('only recorded teams appear; old links to unrecorded events stay empty',()=>{
  const root=new RenderSurface();
  renderRelays(root,data);
  assert.doesNotMatch(root.innerHTML,/href="#stafettrekorder\/unregistered/);
  assert.doesNotMatch(root.innerHTML,/Tidligere deltakelser|Eksempeloppstilling/);
  renderRelays(root,data,'unregistered');
  assert.match(root.innerHTML,/Ingen stafettrekord er lagt inn/);
  assert.equal(root.querySelector('.relay-lineup'),null);
});

test('source pace is retained instead of deriving a different rounded pace',()=>{
  const root=new RenderSurface();
  renderRelays(root,data,'registered','K');
  assert.match(root.lineup.innerHTML,/<strong>2:59<\/strong>/);
  assert.equal(relayPace('3:00',1000),'3:00');
  assert.equal(relayPace('1:29,5',500),'2:59');
  for(const [time,metres] of [['DNF',1000],['3:60',1000],['0:00',1000],['3:00',0],['3:00',null],['3:00',Infinity]]){
    assert.equal(relayPace(time,metres),'–');
  }
});

test('imported names and sources cannot inject markup or active links',()=>{
  const root=new RenderSurface();
  const unsafe=structuredClone(data);
  unsafe.relays[0].records[0].legs[0].name='<img src=x onerror=alert(1)>';
  unsafe.relays[0].records[0].sourceUrl='javascript:alert(1)';
  unsafe.portraits.test={src:'javascript:alert(1)'};
  renderRelays(root,unsafe,'registered','K');
  assert.match(root.lineup.innerHTML,/&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.doesNotMatch(root.lineup.innerHTML,/<img\b/);
  assert.doesNotMatch(root.innerHTML,/href="javascript:/);
});

test('only the placement gets medal color and gold keeps its trophy',()=>{
  for(const [position,medal] of [[1,'gold'],[2,'silver'],[3,'bronze']]){
    const root=new RenderSurface(),fixture=structuredClone(data);
    Object.assign(fixture.relays[0].records[0],{position,positionScope:'kjønn totalt'});
    renderRelays(root,fixture,'registered','K');
    assert.match(root.innerHTML,new RegExp('relay-position award-medal medal-'+medal));
    assert.match(root.innerHTML,/class="relay-record-banner"/);
    assert.doesNotMatch(root.innerHTML,/relay-podium-|relay-record-label|>Klubbrekord</);
    assert.match(root.lineup.innerHTML,/class="relay-runner-card"/);
    assert.doesNotMatch(root.lineup.innerHTML,/relay-podium-|medal-/);
    assert.match(root.innerHTML,new RegExp(position+'\\. plass blant kvinner'));
    if(position===1)assert.match(root.innerHTML,/M8 3h8v5/);
  }
});
test('class podiums keep the class qualifier and unscoped ranks do not imply a medal',()=>{
  const root=new RenderSurface(),fixture=structuredClone(data);
  Object.assign(fixture.relays[0].records[0],{position:2,positionScope:'klasse'});
  renderRelays(root,fixture,'registered','K');
  assert.match(root.innerHTML,/relay-position award-medal medal-silver/);
  assert.match(root.innerHTML,/2\. plass i klassen/);
  delete fixture.relays[0].records[0].positionScope;
  renderRelays(root,fixture,'registered','K');
  assert.doesNotMatch(root.innerHTML,/award-medal|medal-/);
});
test('Holmenkollstafetten displays official record time without a net-time alternative',()=>{
  const root=new RenderSurface(),fixture=structuredClone(data);
  fixture.relays[0].id='holmenkollstafetten';
  Object.assign(fixture.relays[0].records[0],{time:'1:00:31',netTime:'1:00:30',position:6,positionScope:'klasse'});
  renderRelays(root,fixture,'holmenkollstafetten','K');
  assert.match(root.innerHTML,/<strong>1:00:31<\/strong>/);
  assert.doesNotMatch(root.innerHTML,/Nettotid|1:00:30|award-medal|relay-record-label|>Klubbrekord</);
});
