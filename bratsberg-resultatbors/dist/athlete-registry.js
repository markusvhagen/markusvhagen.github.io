/** Deterministic name matching. Norwegian letters are preserved; no fuzzy matching. */
export function normalizeAthleteName(value){
  return typeof value==='string'?value.normalize('NFC').toLocaleLowerCase('nb-NO').replace(/[\p{P}\p{Z}\s]+/gu,' ').trim():'';
}

const athleteKind=value=>value==='demo'?'demo':'member';
const copyAthletePhoto=photo=>photo&&typeof photo==='object'&&!Array.isArray(photo)?{...photo,...(photo.crop&&typeof photo.crop==='object'?{crop:{...photo.crop}}:{})}:null;

/**
 * IDs are authoritative. An unknown supplied ID is deliberately not rescued by
 * a name match: the importer must correct it or remove it before matching again.
 */
export function createAthleteRegistry(registryData){
  const source=Array.isArray(registryData)?registryData:registryData?.athletes;
  if(!Array.isArray(source))throw new Error('Ugyldig utøverregister.');
  const athletes=[],byId=new Map(),byName=new Map(),portraitsById=Object.create(null);
  for(const entry of source){
    if(!entry||typeof entry.id!=='string'||!entry.id.trim()||typeof entry.name!=='string'||!normalizeAthleteName(entry.name))throw new Error('En utøver mangler gyldig ID eller navn.');
    if(byId.has(entry.id))throw new Error('Duplisert utøver-ID: '+entry.id);
    if(entry.kind!==undefined&&!['member','demo'].includes(entry.kind))throw new Error('Ugyldig utøvertype: '+entry.id);
    const athlete={...entry,kind:athleteKind(entry.kind),aliases:Array.isArray(entry.aliases)?entry.aliases.filter(alias=>typeof alias==='string'):[],photo:copyAthletePhoto(entry.photo)};
    athletes.push(athlete);byId.set(athlete.id,athlete);
    if(athlete.photo)portraitsById[athlete.id]=copyAthletePhoto(athlete.photo);
    for(const name of [athlete.name,...athlete.aliases]){
      const normalized=normalizeAthleteName(name);if(!normalized)continue;
      const key=athlete.kind+'|'+normalized;
      if(!byName.has(key))byName.set(key,new Set());
      byName.get(key).add(athlete.id);
    }
  }
  const resolve=(person={},options={})=>{
    const kind=athleteKind(options.kind??person.kind??(person.demo===true?'demo':'member'));
    const suppliedId=typeof person.athleteId==='string'?person.athleteId.trim():typeof person.sourceAthleteId==='string'?person.sourceAthleteId.trim():'';
    if(suppliedId){
      const athlete=byId.get(suppliedId);
      if(!athlete)return {status:'unresolved',reason:'unknown-id',kind,candidates:[]};
      if(athlete.kind!==kind)return {status:'unresolved',reason:'kind-mismatch',kind,candidates:[]};
      return {status:'resolved',matchedBy:'id',athlete,kind};
    }
    const name=normalizeAthleteName(person.name);
    if(!name)return {status:'unresolved',reason:'missing-name',kind,candidates:[]};
    const candidates=[...(byName.get(kind+'|'+name)||[])];
    if(candidates.length!==1)return {status:'unresolved',reason:candidates.length?'ambiguous-name':'unknown-name',kind,candidates};
    const athlete=byId.get(candidates[0]);
    return {status:'resolved',matchedBy:normalizeAthleteName(athlete.name)===name?'name':'alias',athlete,kind};
  };
  return {athletes,portraitsById,resolve};
}

const personRegistryKind=(person,fallback='member')=>person?.kind==='demo'||person?.demo===true?'demo':person?.kind==='member'||person?.demo===false?'member':fallback;

/** Resolve every person once at the data boundary; renderers only need athleteId. */
export function applyAthleteRegistry(data){
  // Compatibility for older manifests that only supplied portraits.json.
  if(!data.athletes||typeof data.athletes==='string')return {...data,unresolvedAthletes:[]};
  const registry=createAthleteRegistry(data.athletes),unresolved=new Map();
  const attach=(person,kind,occurrence)=>{
    if(!person||typeof person!=='object')return person;
    if(!person.name&&!person.athleteId)return {...person}; // Empty official record slot.
    const match=registry.resolve(person,{kind:personRegistryKind(person,kind)});
    if(match.status==='resolved'){
      return {...person,...(person.name&&person.name!==match.athlete.name&&!person.sourceName?{sourceName:person.name}:{}),athleteId:match.athlete.id,name:match.athlete.name};
    }
    const sourceId=person.athleteId||person.sourceAthleteId||null;
    const key=JSON.stringify([match.kind,sourceId||'',normalizeAthleteName(person.name),match.reason]);
    if(!unresolved.has(key))unresolved.set(key,{name:person.name||'',athleteId:sourceId,kind:match.kind,reason:match.reason,candidates:match.candidates,occurrences:[]});
    unresolved.get(key).occurrences.push(occurrence);
    // A mismatched ID must not accidentally select another person's portrait.
    return {...person,...(person.athleteId?{sourceAthleteId:person.athleteId}:{}),athleteId:null};
  };
  const races=(data.races||[]).map(race=>({...race,results:(race.results||[]).map((result,index)=>attach(result,personRegistryKind(race),{type:'race',eventId:race.id,eventName:race.name,index}))}));
  const upcoming=(data.upcoming||[]).map(event=>({...event,participants:(event.participants||[]).map((person,index)=>attach(person,personRegistryKind(event),{type:'upcoming',eventId:event.id,eventName:event.name,index}))}));
  const records=(data.records||[]).map((record,index)=>attach(record,personRegistryKind(record),{type:'record',discipline:record.discipline,gender:record.gender,index}));
  const relays=(data.relays||[]).map(event=>({...event,records:(event.records||[]).map(record=>({...record,legs:(record.legs||[]).map(leg=>attach(leg,personRegistryKind(record,personRegistryKind(event)),{type:'relay',eventId:event.id,eventName:event.name,gender:record.gender,leg:leg.number}))}))}));
  return {...data,races,upcoming,records,relays,portraits:registry.portraitsById,unresolvedAthletes:[...unresolved.values()]};
}
