/** Deterministic name matching. Norwegian letters are preserved; no fuzzy matching. */
export function normalizeAthleteName(value){
  return typeof value==='string'?value.normalize('NFC').toLocaleLowerCase('nb-NO').replace(/[\p{P}\p{Z}\s]+/gu,' ').trim():'';
}

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
    const athlete={...entry,aliases:Array.isArray(entry.aliases)?entry.aliases.filter(alias=>typeof alias==='string'):[],photo:copyAthletePhoto(entry.photo)};
    athletes.push(athlete);byId.set(athlete.id,athlete);
    if(athlete.photo)portraitsById[athlete.id]=copyAthletePhoto(athlete.photo);
    for(const name of [athlete.name,...athlete.aliases]){
      const normalized=normalizeAthleteName(name);if(!normalized)continue;
      if(!byName.has(normalized))byName.set(normalized,new Set());
      byName.get(normalized).add(athlete.id);
    }
  }
  const mergedIds = registryData?.mergedAthleteIds;
  const mergedProfiles = new Map();
  if (mergedIds !== undefined) {
    if (!mergedIds || typeof mergedIds !== 'object' || Array.isArray(mergedIds)) {
      throw new Error('Ugyldig kart over sammenslåtte utøver-ID-er.');
    }
    for (const [formerId, canonicalId] of Object.entries(mergedIds)) {
      if (!formerId.trim() || formerId.trim() !== formerId || byId.has(formerId)) {
        throw new Error('Ugyldig eller allerede registrert tidligere utøver-ID: ' + formerId);
      }
      const athlete = byId.get(canonicalId);
      if (!athlete) throw new Error('Ukjent mål for sammenslått utøver-ID: ' + formerId);
      mergedProfiles.set(formerId, athlete);
    }
  }
  const resolve=(person={})=>{
    const suppliedId=typeof person.athleteId==='string'?person.athleteId.trim():typeof person.sourceAthleteId==='string'?person.sourceAthleteId.trim():'';
    if(suppliedId){
      const athlete=byId.get(suppliedId)||mergedProfiles.get(suppliedId);
      if(!athlete)return {status:'unresolved',reason:'unknown-id',candidates:[]};
      return {status:'resolved',matchedBy:'id',athlete};
    }
    const name=normalizeAthleteName(person.name);
    if(!name)return {status:'unresolved',reason:'missing-name',candidates:[]};
    const candidates=[...(byName.get(name)||[])];
    if(candidates.length!==1)return {status:'unresolved',reason:candidates.length?'ambiguous-name':'unknown-name',candidates};
    const athlete=byId.get(candidates[0]);
    return {status:'resolved',matchedBy:normalizeAthleteName(athlete.name)===name?'name':'alias',athlete};
  };
  return {athletes,portraitsById,resolve};
}

/** Resolve every person once at the data boundary; renderers only need athleteId. */
export function applyAthleteRegistry(data){
  // Compatibility for older manifests that only supplied portraits.json.
  if(!data.athletes||typeof data.athletes==='string')return {...data,unresolvedAthletes:[]};
  const registry=createAthleteRegistry(data.athletes),unresolved=new Map();
  const attach=(person,occurrence)=>{
    if(!person||typeof person!=='object')return person;
    if(!person.name&&!person.athleteId)return {...person}; // Empty official record slot.
    const match=registry.resolve(person);
    if(match.status==='resolved'){
      return {...person,...(person.name&&person.name!==match.athlete.name&&!person.sourceName?{sourceName:person.name}:{}),athleteId:match.athlete.id,name:match.athlete.name};
    }
    const sourceId=person.athleteId||person.sourceAthleteId||null;
    const key=JSON.stringify([sourceId||'',normalizeAthleteName(person.name),match.reason]);
    if(!unresolved.has(key))unresolved.set(key,{name:person.name||'',athleteId:sourceId,reason:match.reason,candidates:match.candidates,occurrences:[]});
    unresolved.get(key).occurrences.push(occurrence);
    // A mismatched ID must not accidentally select another person's portrait.
    return {...person,...(person.athleteId?{sourceAthleteId:person.athleteId}:{}),athleteId:null};
  };
  const races=(data.races||[]).map(race=>({...race,results:(race.results||[]).map((result,index)=>attach(result,{type:'race',eventId:race.id,eventName:race.name,index}))}));
  const upcoming=(data.upcoming||[]).map(event=>({...event,participants:(event.participants||[]).map((person,index)=>attach(person,{type:'upcoming',eventId:event.id,eventName:event.name,index}))}));
  const records=(data.records||[]).map((record,index)=>attach(record,{type:'record',discipline:record.discipline,gender:record.gender,index}));
  const relays=(data.relays||[]).map(event=>({...event,records:(event.records||[]).map(record=>({...record,legs:(record.legs||[]).map(leg=>attach(leg,{type:'relay',eventId:event.id,eventName:event.name,gender:record.gender,leg:leg.number}))}))}));
  return {...data,races,upcoming,records,relays,portraits:registry.portraitsById,unresolvedAthletes:[...unresolved.values()]};
}
