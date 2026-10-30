import test from 'node:test';
import assert from 'node:assert/strict';
import {renderRaceWinners,installRaceWinnerControls,renderRaceNews} from '../dist/race-extras.js';

const winner=(name,time,extra={})=>({name,time,verified:true,...extra});
const race={id:'race',name:'Fjordløpet',distances:['5 km','10 km'],winners:[
  {distance:'5 km',men:winner('Mann En','14:30'),women:winner('Kvinne En','16:20')},
  {distance:'10 km',men:winner('Mann To','29:57.2'),women:winner('Kvinne To','33:30.6',{timeBasis:'net'}),scope:'Alle fullførte'}
]};

test('a native distance selector exposes just one verified pair at a time',()=>{
  const snapshot=JSON.stringify(race);
  const html=renderRaceWinners(race,{selectedDistance:'10 km'});
  assert.match(html,/<select data-winner-distance>/);
  assert.match(html,/<option value="10 km" selected>/);
  assert.match(html,/data-winner-panel="5 km" hidden/);
  assert.doesNotMatch(html,/data-winner-panel="10 km" hidden/);
  assert.match(html,/race-winner-men/);
  assert.match(html,/race-winner-women/);
  assert.match(html,/Vinner kvinner, 10 km:/);
  assert.match(html,/Kvinne To · 33:30.6 · Nettotid · Alle fullførte/);
  assert.match(html,/<span class="race-winner-name">Mann To<\/span><strong>29:57.2<\/strong>/);
  assert.match(html,/<span class="race-winner-name">Kvinne To<\/span><strong>33:30.6<\/strong>/);
  assert.equal(JSON.stringify(race),snapshot);
});

test('single-distance races omit the select and unknown winners never come from club results',()=>{
  const html=renderRaceWinners({id:'single',distances:['Maraton'],results:[{name:'Fastest club runner',time:'2:01:00',positionGender:1}]});
  assert.doesNotMatch(html,/<select|2:01:00|Fastest club runner/);
  assert.equal((html.match(/<strong>—<\/strong>/g)||[]).length,2);
  assert.match(html,/Ikke bekreftet/);
  for(const value of ['DNF','0:00','12:70','x']){
    const invalid=renderRaceWinners({distances:['5 km'],winners:[{distance:'5 km',men:winner('Invalid',value),women:winner('Unverified','17:00',{verified:false})}]});
    assert.equal((invalid.match(/<strong>—<\/strong>/g)||[]).length,2);
    assert.doesNotMatch(invalid,/17:00/);
  }
  assert.equal(renderRaceWinners({}), '');
});

test('winner components escape source text and keep carousel clone controls out of tab order',()=>{
  const html=renderRaceWinners({id:'"><script>',name:'<Race>',distances:['<5 km>','10 km'],winners:[{distance:'<5 km>',men:winner('<Runner>','14:30')}]},{clone:true,instanceId:'"><img>'});
  assert.match(html,/disabled tabindex="-1"/);
  assert.doesNotMatch(html,/<script>|<Runner>|<Race>|<img>/);
  assert.match(html,/&lt;Runner&gt;/);
  assert.match(html,/<span class="race-winner-name">&lt;Runner&gt;<\/span>/);
  assert.match(html,/data-race-winners="&quot;&gt;&lt;script&gt;"/);
  assert.match(renderRaceWinners(race,{selectedDistance:'not-present'}),/<option value="5 km" selected>/);
});

test('distance changes synchronize only copies of the same race and install once',()=>{
  const makeWrapper=(id,{disabled=false}={})=>{
    const panels=['5 km','10 km'].map(distance=>({hidden:distance!=='5 km',getAttribute:()=>distance}));
    const wrapper={getAttribute:()=>id,querySelectorAll:()=>panels,querySelector:()=>control,panels};
    const control={value:'5 km',disabled,options:[{value:'5 km'},{value:'10 km'}],closest:()=>wrapper};
    wrapper.control=control;
    return wrapper;
  };
  const original=makeWrapper('race'),clone=makeWrapper('race',{disabled:true}),other=makeWrapper('other');
  const nodes=[original,clone,other];
  let installs=0,listener;
  const root={addEventListener:(event,fn)=>{assert.equal(event,'change');installs++;listener=fn;},contains:node=>nodes.includes(node),querySelectorAll:()=>nodes};
  installRaceWinnerControls(root);installRaceWinnerControls(root);
  assert.equal(installs,1);
  original.control.value='10 km';
  listener({target:{closest:()=>original.control}});
  for(const node of [original,clone]){
    assert.equal(node.control.value,'10 km');
    assert.deepEqual(node.panels.map(panel=>panel.hidden),[true,false]);
  }
  assert.equal(other.control.value,'5 km');
  assert.deepEqual(other.panels.map(panel=>panel.hidden),[false,true]);
  original.control.value='unknown';
  listener({target:{closest:()=>original.control}});
  assert.deepEqual(original.panels.map(panel=>panel.hidden),[true,false]);
  clone.control.value='5 km';
  listener({target:{closest:()=>clone.control}});
  assert.deepEqual(clone.panels.map(panel=>panel.hidden),[true,false]);
});

test('news links are explicit, deduplicated, escaped and confined to the club website',()=>{
  const url='https://www.bratsbergfriidrett.no/2026/09/20/klubbrekorder-i-koben/';
  const input={news:[
    {title:'Klubbrekorder <i> Køben',url},
    {title:'Duplicate',url},
    {title:'Unsafe',url:'javascript:alert(1)'},
    {title:'Wrong domain',url:'https://www.bratsbergfriidrett.no.evil.example/post'},
    {title:'Credentials',url:'https://user:pass@www.bratsbergfriidrett.no/post'},
    {title:'Port',url:'https://www.bratsbergfriidrett.no:8443/post'},
    {title:'Insecure',url:'http://bratsbergfriidrett.no/post'}
  ]};
  const html=renderRaceNews(input,{clone:true,embedded:true,compact:true});
  assert.equal((html.match(/<a /g)||[]).length,1);
  assert.match(html,/Klubbrekorder &lt;i&gt; Køben/);
  assert.match(html,/target="_top" rel="noopener noreferrer" tabindex="-1"/);
  assert.match(html,/>Klubboppslag<\/span>/);
  assert.doesNotMatch(html,/javascript:|Wrong domain|Duplicate|Credentials|8443|<i>/);
  assert.match(renderRaceNews({news:[{url:'https://bratsbergfriidrett.no/post'}]}),/target="_blank"/);
  assert.equal(renderRaceNews({news:[]}), '');
  assert.equal(renderRaceNews({sourceUrl:url}), '');
});
