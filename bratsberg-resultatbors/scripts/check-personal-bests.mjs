#!/usr/bin/env node
/** Read-only history calculation: node scripts/check-personal-bests.mjs [new-race.json] */
import {readFile} from 'node:fs/promises';
import {resolve,relative,isAbsolute} from 'node:path';
import {fileURLToPath} from 'node:url';
import {applyAthleteRegistry} from '../dist/athlete-registry.js';
import {derivePerformanceHistory,collectManualPersonalBests} from '../dist/performance-history.js';

const dist=fileURLToPath(new URL('../dist/',import.meta.url));
const readJSON=async path=>JSON.parse(await readFile(path,'utf8'));
const dataPath=path=>{
  if(typeof path!=='string'||!path)throw new Error('Manifestet mangler en datasti.');
  const full=resolve(dist,path),rel=relative(dist,full);
  if(rel==='..'||rel.startsWith('../')||isAbsolute(rel))throw new Error('Datastier må ligge i dist/.');
  return full;
};
try{
  const args=process.argv.slice(2);
  if(args.length>1)throw new Error('Bruk: node scripts/check-personal-bests.mjs [new-race.json]');
  const index=await readJSON(resolve(dist,'data/index.json'));
  const [races,athletes]=await Promise.all([Promise.all(index.races.map(path=>readJSON(dataPath(path)))),readJSON(dataPath(index.athletes))]);
  let importedId=null;
  if(args[0]){
    const imported=await readJSON(resolve(process.cwd(),args[0]));
    if(!imported.id||!Array.isArray(imported.results))throw new Error('Løpet må ha id og results.');
    importedId=imported.id;
    const existing=races.findIndex(race=>race.id===imported.id);
    if(existing<0)races.push(imported);else races[existing]=imported;
  }
  const resolved=applyAthleteRegistry({races,athletes});
  const calculated=derivePerformanceHistory(resolved.races,resolved.athletes);
  const manual=collectManualPersonalBests(resolved.athletes);
  const performances=calculated.filter(race=>!importedId||race.id===importedId).flatMap(race=>race.results.filter(result=>result.performanceHistory.eligible).map(result=>({raceId:race.id,race:race.name,date:race.date,athleteId:result.athleteId,name:result.name,distance:result.distance,time:result.time,...result.performanceHistory})));
  process.stdout.write(JSON.stringify({basis:'Tidligere sammenlignbare resultater og manuelle perser. En bekreftet pers kan kobles til et bestemt løp med raceId, dato og tid. Første kjente resultat er ikke automatisk PB.',mode:importedId?'new-race':'all-data',racesChecked:calculated.length,performancesChecked:performances.length,personalBestResults:performances.filter(result=>result.isPersonalBest).length,personalBestImprovements:performances.filter(result=>result.isPersonalBest&&result.improvementSeconds>0).length,manuallyConfirmedResults:performances.filter(result=>result.isManualPersonalBest).length,manualPersonalBestsChecked:manual.entries.length,personalBestIssues:manual.issues,unresolvedAthletes:resolved.unresolvedAthletes,performances},null,2)+'\n');
  process.exitCode=resolved.unresolvedAthletes.length||manual.issues.length?1:0;
}catch(error){
  process.stdout.write(JSON.stringify({error:error.message},null,2)+'\n');
  process.exitCode=2;
}
