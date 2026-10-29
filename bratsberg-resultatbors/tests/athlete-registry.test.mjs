import test from 'node:test';
import assert from 'node:assert/strict';
import {createAthleteRegistry,applyAthleteRegistry,normalizeAthleteName} from '../dist/athlete-registry.js';

const registryData={schemaVersion:1,athletes:[
  {id:'petter',name:'Petter Vea Monseth',kind:'member',aliases:['Petter Monseth'],photo:{src:'https://example.com/petter.jpg',crop:{x:50,y:25,zoom:1.2}}},
  {id:'camilla',name:'Camilla-Marie Flaaten',kind:'member',aliases:[],photo:null},
  {id:'demo-petter',name:'Petter Vea Monseth',kind:'demo',aliases:[],photo:{src:'https://example.com/stock.jpg'}},
]};

test('ID wins; names use full normalized names or explicit aliases only',()=>{
  const registry=createAthleteRegistry(registryData);
  assert.equal(registry.resolve({athleteId:'petter',name:'Something else'}).athlete.id,'petter');
  assert.equal(registry.resolve({name:'  PETTER  MONSETH '}).athlete.id,'petter');
  assert.equal(registry.resolve({name:'Camilla–Marie  Flaaten'}).athlete.id,'camilla');
  assert.equal(normalizeAthleteName('  ØYEN\u00a0 Åse '),'øyen åse');
  assert.equal(normalizeAthleteName('A\u030ase'),normalizeAthleteName('Åse'));
  assert.equal(registry.resolve({name:'Petter'}).reason,'unknown-name');
  assert.equal(registry.resolve({name:'Petter Vea Monsen'}).reason,'unknown-name');
  assert.equal(registry.resolve({athleteId:'typo-id',name:'Petter Vea Monseth'}).reason,'unknown-id');
});

test('ambiguous names and aliases never select a picture automatically',()=>{
  const data=structuredClone(registryData);
  data.athletes.push({id:'another',name:'Petter Monseth',aliases:[],kind:'member',photo:{src:'https://example.com/other.jpg'}});
  const registry=createAthleteRegistry(data);
  const result=registry.resolve({name:'Petter Monseth'});
  assert.equal(result.reason,'ambiguous-name');
  assert.deepEqual(result.candidates,['petter','another']);
  assert.equal(registry.resolve({athleteId:'petter',name:'Petter Monseth'}).athlete.id,'petter');
  assert.throws(()=>createAthleteRegistry({athletes:[...data.athletes,data.athletes[0]]}),/Duplisert utøver-ID/);
});

test('demo and member identities remain separate even when names match',()=>{
  const registry=createAthleteRegistry(registryData);
  assert.equal(registry.resolve({name:'Petter Vea Monseth'},{kind:'demo'}).athlete.id,'demo-petter');
  assert.equal(registry.resolve({name:'Petter Vea Monseth'},{kind:'member'}).athlete.id,'petter');
  assert.equal(registry.resolve({athleteId:'petter'},{kind:'demo'}).reason,'kind-mismatch');
});

const inputData=()=>({athletes:structuredClone(registryData),portraits:{petter:{src:'https://example.com/obsolete.jpg'}},
  races:[{id:'race',name:'Løp',demo:false,results:[{name:'Petter Monseth',time:'14:20'}]}],
  relays:[{id:'relay',name:'Stafett',records:[{gender:'M',legs:[{number:1,name:'Petter Vea Monseth',time:'3:00'}]}]}],
  records:[{name:'Petter Monseth',time:'14:20',gender:'M'},{name:null,time:null}],
  upcoming:[{id:'future',demo:false,participants:[{name:'Petter Monseth'}]}],
});

test('one registry photo change reaches all appearances without rewriting results',()=>{
  const input=inputData(),before=structuredClone(input);
  const first=applyAthleteRegistry(input);
  const appearances=[first.races[0].results[0],first.relays[0].records[0].legs[0],first.records[0],first.upcoming[0].participants[0]];
  for(const appearance of appearances){
    assert.equal(appearance.athleteId,'petter');
    assert.equal(first.portraits[appearance.athleteId].src,'https://example.com/petter.jpg');
  }
  assert.equal(first.races[0].results[0].sourceName,'Petter Monseth');
  assert.equal(first.races[0].results[0].name,'Petter Vea Monseth');
  assert.equal(first.unresolvedAthletes.length,0);
  assert.deepEqual(input,before);
  input.athletes.athletes[0].photo={src:'https://example.com/new.jpg'};
  const second=applyAthleteRegistry(input);
  assert.equal(second.portraits[second.relays[0].records[0].legs[0].athleteId].src,'https://example.com/new.jpg');
  assert.equal(first.portraits.petter.src,'https://example.com/petter.jpg');
  input.athletes.athletes[0].photo=null;
  assert.equal(applyAthleteRegistry(input).portraits.petter,undefined);
});

test('unresolved entries get no photo ID and are grouped for importer review',()=>{
  const input=inputData();
  input.races[0].results=[{name:'Ny løper'},{name:'Ny løper'},{athleteId:'wrong',name:'Petter Monseth'}];
  input.upcoming[0].demo=true;
  input.upcoming[0].participants=[{athleteId:'petter',name:'Petter Vea Monseth'}];
  const output=applyAthleteRegistry(input);
  assert.deepEqual(output.races[0].results.map(result=>result.athleteId),[null,null,null]);
  assert.equal(output.races[0].results[2].sourceAthleteId,'wrong');
  assert.equal(output.upcoming[0].participants[0].athleteId,null);
  assert.equal(output.unresolvedAthletes.find(person=>person.name==='Ny løper').occurrences.length,2);
  assert.equal(output.unresolvedAthletes.length,3);
  assert.equal(applyAthleteRegistry(output).races[0].results[2].athleteId,null);
});

test('legacy manifests remain compatible until a registry is supplied',()=>{
  const data={races:[],portraits:{old:{src:'https://example.com/old.jpg'}}};
  assert.equal(applyAthleteRegistry(data).portraits.old.src,data.portraits.old.src);
});
