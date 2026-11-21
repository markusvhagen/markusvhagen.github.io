import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {derivePerformanceHistory,collectManualPersonalBests} from '../dist/performance-history.js';
import {badges,prepareResultsData} from '../dist/data.js';
import {parsePerformanceTime} from '../dist/record-check.js';

const result=(time,extra={})=>({athleteId:'runner',distance:'10 km',time,...extra});
const race=(time,date='2026-06-01',extra={})=>({id:'race-'+date,date,type:'road',results:[result(time)],...extra});
const registry=(time='40:00',extra={})=>({athletes:[{id:'runner',personalBests:[{type:'road',distance:'10 km',time,asOf:'2026-11-20',...extra}]}]});
const history=(races,athletes)=>derivePerformanceHistory(races,athletes).flatMap(r=>r.results).map(r=>r.performanceHistory);
const waReference=(time='40:00',extra={})=>({type:'road',distance:'10 km',time,date:'2026-01-01',sourceProvider:'world-athletics',evidenceKind:'profile-personal-best',userApproved:true,checkedAt:'2026-11-20',...extra});

test('a first result and an archive-only improvement never establish PB',()=>{
  const records=derivePerformanceHistory([race('41:00','2026-05-01'),race('40:00')]);
  assert.deepEqual(records.map(r=>r.results[0].performanceHistory.isPersonalBest),[false,false]);
  assert.equal(records[1].results[0].performanceHistory.isBestRecorded,true);
  assert.equal(badges(records[1].results[0]),'');
});

test('equal and faster times qualify; slower times do not',()=>{
  for(const [time,expected] of [['40:00',true],['39:59',true],['40:01',false]]){
    const [h]=history([race(time)],registry());
    assert.equal(h.isPersonalBest,expected,time);
    assert.equal(h.hasManualBaseline,true);
    assert.equal(h.manualBaselineSeconds,2400);
  }
});

test('an undated manual PB with asOf can verify an older matching result without raceId',()=>{
  const [h]=history([race('40:00')],registry());
  assert.equal(h.isPersonalBest,true);
  assert.equal(h.isManualPersonalBest,true);
  assert.equal(h.confirmedPersonalBests[0].date,null);
  assert.equal(h.confirmedPersonalBests[0].asOf,'2026-11-20');
});

test('a manual PB on the same date needs no raceId; numeric time equality is exact',()=>{
  const [h]=history([race('40:00.00')],registry('40:00,00',{date:'2026-06-01'}));
  assert.equal(h.isPersonalBest,true);
  const [slower]=history([race('40:00.01')],registry('40:00'));
  assert.equal(slower.isPersonalBest,false);
});

test('only the fastest manual reference is accepted, independent of reference order',()=>{
  const athletes=registry('40:00');
  athletes.athletes[0].personalBests.push({type:'road',distance:'10 km',time:'39:00',date:'2026-07-01'});
  assert.equal(history([race('39:30')],athletes)[0].isPersonalBest,false);
  assert.equal(history([race('39:00')],athletes)[0].isPersonalBest,true);
  athletes.athletes[0].personalBests.reverse();
  assert.equal(history([race('39:30')],athletes)[0].isPersonalBest,false);
});

test('a faster previous result prevents a later slower PB claim; repeats qualify',()=>{
  const h=history([race('39:00','2026-04-01'),race('39:30','2026-05-01'),race('39:00')],registry());
  assert.deepEqual(h.map(x=>x.isPersonalBest),[true,false,true]);
  assert.equal(h[1].reason,'slower-than-previous-best');
});

test('road, outdoor track, indoor track and different athletes never share a manual baseline',()=>{
  const track=race('39:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('39:00',{distance:'10 000 m'})]});
  assert.equal(history([track],registry())[0].isPersonalBest,false);
  const manualTrack=registry('40:00',{type:'track',environment:'outdoor',distance:'10 000 m'});
  assert.equal(history([track],manualTrack)[0].isPersonalBest,true);
  assert.equal(history([{...track,environment:'indoor'}],manualTrack)[0].isPersonalBest,false);
  assert.equal(history([race('39:00','2026-06-01',{results:[result('39:00',{athleteId:'someone-else'})]})],registry())[0].isPersonalBest,false);
});

test('indoor PB references enable indoor results but remain separate from outdoor track',()=>{
  const indoor=race('3:59','2026-06-01',{type:'track',environment:'indoor',results:[result('3:59',{distance:'1500 m'})]});
  const athletes=registry('4:00',{type:'track',environment:'indoor',distance:'1500 m'});
  assert.equal(history([indoor],athletes)[0].isPersonalBest,true);
  assert.equal(history([{...indoor,environment:'outdoor'}],athletes)[0].isPersonalBest,false);
  assert.equal(history([{...indoor,environment:undefined}],athletes)[0].isPersonalBest,false);
  athletes.athletes[0].personalBests.push({type:'track',environment:'outdoor',distance:'1500 m',time:'3:50',date:'2026-01-01'});
  assert.equal(history([indoor],athletes)[0].isPersonalBest,true);
});

test('2000 m steeplechase PB references never become flat 2000 m references',()=>{
  const hurdle=race('6:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('6:00',{distance:'2 000 m hinder'})]});
  const athletes=registry('6:00',{type:'track',environment:'outdoor',distance:'2000mhinder'});
  assert.equal(history([hurdle],athletes)[0].isPersonalBest,true);
  const flat={...hurdle,results:[result('6:00',{distance:'2000 m'})]};
  assert.equal(history([flat],athletes)[0].isPersonalBest,false);
  athletes.athletes[0].personalBests[0].distance='2000 m';
  assert.equal(history([hurdle],athletes)[0].isPersonalBest,false);
});

test('World Athletics references require explicit approval and a supported evidence kind',()=>{
  for(const approval of [undefined,false,'true']){
    const athletes={athletes:[{id:'runner',personalBests:[waReference('40:00',{userApproved:approval})]}]};
    assert.equal(collectManualPersonalBests(athletes).entries.length,0);
    assert.equal(history([race('39:00')],athletes)[0].isPersonalBest,false);
  }
  for(const evidenceKind of ['profile-personal-best','competition-result']){
    const athletes={athletes:[{id:'runner',personalBests:[waReference('40:00',{evidenceKind})]}]};
    assert.equal(collectManualPersonalBests(athletes).entries.length,1);
    const [h]=history([race('40:00')],athletes);
    assert.equal(h.isPersonalBest,true);
    assert.equal(h.confirmedPersonalBests[0].sourceProvider,'world-athletics');
    assert.equal(h.confirmedPersonalBests[0].userApproved,true);
  }
  assert.equal(history([race('39:00')],{athletes:[{id:'runner',personalBests:[waReference('40:00',{evidenceKind:'unknown'})]}]})[0].isPersonalBest,false);
});

test('manual PB overrides faster WA data including previous best and best recorded',()=>{
  const athletes=registry('40:00');
  athletes.athletes[0].personalBests.push(waReference('39:00'));
  const [h]=history([race('40:00')],athletes);
  assert.equal(h.isPersonalBest,true);
  assert.equal(h.manualBaselineSeconds,2400);
  assert.equal(h.previousBest,null);
  assert.equal(h.isBestRecorded,true);
  assert.equal(h.bestRecorded,'40:00');
  assert.equal(h.confirmedPersonalBests.length,1);
  assert.equal(h.confirmedPersonalBests[0].sourceProvider,undefined);
});

test('manual PB overrides slower WA data without weakening the threshold or adding history',()=>{
  const athletes=registry('40:00');
  athletes.athletes[0].personalBests.unshift(waReference('41:00'));
  const [h]=history([race('40:30')],athletes);
  assert.equal(h.isPersonalBest,false);
  assert.equal(h.manualBaselineSeconds,2400);
  assert.equal(h.previousBest,null);
  assert.deepEqual(h.previousPersonalBests,[]);
  assert.equal(h.improvementSeconds,null);
});

test('200 m, 400 m and 1000 m PB support leaves club-record normalisation unchanged',async()=>{
  const {normalizeDistance,findRecordCandidates}=await import('../dist/record-check.js');
  for(const [distance,alias,time] of [['200 m','0.2 km','22.50'],['400 m','0.4 km','50.00'],['1000 m','1 km','2:30.00']]){
    const track=race(time,'2026-06-01',{type:'track',environment:'outdoor',results:[result(time,{distance,recordEligible:true,gender:'M'})]});
    const athletes=registry(time,{type:'track',environment:'outdoor',distance:alias});
    assert.equal(history([track],athletes)[0].isPersonalBest,true,distance);
    assert.equal(normalizeDistance(distance,'track'),null,distance);
    assert.deepEqual(findRecordCandidates([track],[{category:'track',gender:'M',discipline:distance.replace(/\s/g,''),time:'9:59'}]),[]);
  }
  assert.equal(normalizeDistance('2000 m hinder','track'),null);
});

test('trail times require the same explicitly identified course',()=>{
  const trail=race('39:00','2026-06-01',{type:'trail',courseId:'course-a'});
  assert.equal(history([trail],registry('40:00',{type:'trail',courseId:'course-a'}))[0].isPersonalBest,true);
  assert.equal(history([trail],registry('40:00',{type:'trail',courseId:'course-b'}))[0].isPersonalBest,false);
});

test('DNF, DNS and malformed times never become PB',()=>{
  for(const row of [result('39:00',{status:'DNF'}),result('39:00',{status:'DNS'}),result('DNF'),result('39:99')]){
    assert.equal(history([race('','2026-06-01',{results:[row]})],registry())[0].isPersonalBest,false);
  }
});

test('a net-time comparison uses the explicitly selected timing basis',()=>{
  const rows=[result('40:02',{netTime:'39:59'})];
  const net=derivePerformanceHistory([race('','2026-06-01',{timeBasis:'net',results:rows})],registry())[0].results[0];
  assert.equal(net.time,'39:59');
  assert.equal(net.performanceHistory.isPersonalBest,true);
  const gun=derivePerformanceHistory([race('','2026-06-01',{timeBasis:'gun',results:rows})],registry())[0].results[0];
  assert.equal(gun.time,'40:02');
  assert.equal(gun.performanceHistory.isPersonalBest,false);
});

test('malformed manual dates and manual non-finishes cannot enable PB',()=>{
  for(const extra of [{date:'2026-02-30'},{status:'DNF'}]){
    const athletes=registry('40:00',extra);
    assert.equal(collectManualPersonalBests(athletes).entries.length,0);
    assert.equal(history([race('39:00')],athletes)[0].isPersonalBest,false);
  }
});

test('derived flags are recalculated and source data remains unchanged',()=>{
  const races=[race('39:00','2026-06-01',{results:[result('39:00',{pb:true,previousBest:'40:00',performanceHistory:{isPersonalBest:true}})]})];
  const athletes=registry();
  const original=structuredClone({races,athletes});
  derivePerformanceHistory(races,athletes);
  assert.deepEqual({races,athletes},original);
  const cleared=derivePerformanceHistory(races)[0].results[0];
  assert.equal(cleared.performanceHistory.isPersonalBest,false);
  assert.equal('pb' in cleared,false);
});

test('standalone page embeds the same PB logic and badge rendering as the hosted files',async()=>{
  const html=await readFile(new URL('../Bratsberg-resultatbors.html',import.meta.url),'utf8');
  const strip=s=>s.replace(/^import .*\n/gm,'').replace(/\bexport /g,'');
  const historyModule=strip(await readFile(new URL('../dist/performance-history.js',import.meta.url),'utf8'));
  const dataModule=strip(await readFile(new URL('../dist/data.js',import.meta.url),'utf8'));
  assert.equal(html.includes(historyModule),true);
  assert.equal(html.includes(dataModule.slice(dataModule.indexOf('function badges'),dataModule.indexOf('const dateTile'))),true);
  assert.equal(html.includes('Forbedring mot tidligere løp og manuelt registrerte perser'),false);
});

test('every PB in the real data has a valid registered threshold; no references means zero PBs',async()=>{
  const read=async path=>JSON.parse(await readFile(new URL('../dist/'+path,import.meta.url),'utf8'));
  const index=await read('data/index.json');
  const races=await Promise.all(index.races.map(read));
  const athletes=await read(index.athletes),records=await read(index.records);
  const data=prepareResultsData({races,athletes,records});
  const pbs=data.races.flatMap(r=>r.results).filter(r=>r.performanceHistory.isPersonalBest);
  assert.ok(pbs.length>0);
  assert.equal(data.personalBestIssues.length,0);
  for(const row of pbs){
    assert.equal(row.performanceHistory.hasManualBaseline,true);
    assert.ok(row.performanceHistory.manualBaselineSeconds>0);
    assert.ok(parsePerformanceTime(row.time)<=row.performanceHistory.manualBaselineSeconds);
    const reference=collectManualPersonalBests(athletes).entries.find(entry=>entry.key===row.performanceHistory.comparisonKey&&entry.seconds===row.performanceHistory.manualBaselineSeconds);
    assert.ok(reference);
    if(reference.manual.sourceProvider==='world-athletics')assert.equal(reference.manual.userApproved,true);
  }
  const withoutManual=structuredClone(athletes);
  for(const athlete of withoutManual.athletes)athlete.personalBests=[];
  assert.equal(prepareResultsData({races,athletes:withoutManual,records}).races.flatMap(r=>r.results).filter(r=>r.performanceHistory.isPersonalBest).length,0);
});
