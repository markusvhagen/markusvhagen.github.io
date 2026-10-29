#!/usr/bin/env node
/**
 * Read-only import check:
 *   node scripts/check-athletes.mjs [path-to-new-race.json]
 * Exit 0: all matched; 1: review unresolved entries; 2: invalid input.
 * athleteId must be a stable club registry ID. Keep timing-provider IDs in
 * sourceParticipantId (or another separate field); omit athleteId to match names.
 */
import {readFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyAthleteRegistry,createAthleteRegistry} from '../dist/athlete-registry.js';

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const readJSON=async path=>JSON.parse(await readFile(path,'utf8'));
const isObject=value=>value!==null&&typeof value==='object'&&!Array.isArray(value);
const requireArray=(value,label)=>{if(!Array.isArray(value))throw new Error(label+' må være en liste.');return value;};
const dataPath=path=>{
  if(typeof path!=='string'||!path)throw new Error('Manifestet mangler en datasti.');
  const full=resolve(dist,path),rel=relative(dist,full);
  if(rel==='..'||rel.startsWith('../')||isAbsolute(rel))throw new Error('Datastier må ligge i dist/.');
  return full;
};
const hasIdentity=person=>typeof person?.name==='string'&&person.name.trim()||typeof person?.athleteId==='string'&&person.athleteId.trim();
const checkPeople=(people,label,{emptySlots=false}={})=>{
  requireArray(people,label).forEach((person,index)=>{
    if(!isObject(person)||!hasIdentity(person)&&!(emptySlots&&person.status==='unlisted'))throw new Error(`${label}[${index}] mangler navn eller athleteId.`);
  });
};
const checkRace=race=>{
  if(!isObject(race))throw new Error('Løpsfilen må inneholde ett JSON-objekt.');
  checkPeople(race.results,'results');
  return race;
};
const peopleIn=data=>[
  ...data.races.flatMap(race=>race.results),
  ...data.relays.flatMap(event=>event.records.flatMap(record=>record.legs)),
  ...data.upcoming.flatMap(event=>event.participants),
  ...data.records.filter(person=>hasIdentity(person)||person.sourceAthleteId),
];

try{
  const args=process.argv.slice(2);
  if(args.length>1)throw new Error('Bruk: node scripts/check-athletes.mjs [path-to-new-race.json]');
  const index=await readJSON(resolve(dist,'data/index.json'));
  if(!isObject(index))throw new Error('Ugyldig datamanifest.');
  const athletes=await readJSON(dataPath(index.athletes));
  createAthleteRegistry(athletes); // A checker requires a valid registry, never legacy fallback.
  let data={athletes,races:[],records:[],relays:[],upcoming:[]};
  if(args[0]){
    data.races=[checkRace(await readJSON(resolve(process.cwd(),args[0])))];
  }else{
    const [races,records,relays,upcoming]=await Promise.all([
      Promise.all(requireArray(index.races,'races').map(path=>readJSON(dataPath(path)))),
      readJSON(dataPath(index.records)),
      index.relays?readJSON(dataPath(index.relays)):Promise.resolve([]),
      index.upcoming?readJSON(dataPath(index.upcoming)):Promise.resolve([]),
    ]);
    races.forEach(checkRace);
    checkPeople(records,'records',{emptySlots:true});
    requireArray(upcoming,'upcoming').forEach(event=>{if(!isObject(event))throw new Error('Ugyldig terminlisteoppføring.');checkPeople(event.participants,'participants');});
    requireArray(relays,'relays').forEach(event=>{
      if(!isObject(event))throw new Error('Ugyldig stafett.');
      requireArray(event.records,'relay.records').forEach(record=>{if(!isObject(record))throw new Error('Ugyldig stafettrekord.');checkPeople(record.legs,'legs');});
    });
    data={...data,races,records,relays,upcoming};
  }
  const resolved=applyAthleteRegistry(data),people=peopleIn(resolved);
  const matched=people.filter(person=>person.athleteId);
  const report={mode:args[0]?'new-race':'all-data',totalEntries:people.length,matched:matched.length,uniqueMatchedAthletes:new Set(matched.map(person=>person.athleteId)).size,unresolvedEntries:people.length-matched.length,unresolvedAthletes:resolved.unresolvedAthletes};
  process.stdout.write(JSON.stringify(report,null,2)+'\n');
  process.exitCode=report.unresolvedEntries?1:0;
}catch(error){
  process.stdout.write(JSON.stringify({error:error.message},null,2)+'\n');
  process.exitCode=2;
}
