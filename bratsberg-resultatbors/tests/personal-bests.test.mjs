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

test('a manual PB on the same date needs no raceId',()=>{
  const [h]=history([race('40:00.00')],registry('40:00,00',{date:'2026-06-01'}));
  assert.equal(h.isPersonalBest,true);
});

test('road compares both sides in whole seconds, while track keeps exact decimals',()=>{
  for(const [time,expected] of [['37:07',true],['37:07.9',true],['37:08',false]]){
    for(const reference of ['37:07','37:07.1','37:07.99']){
      const [h]=history([race(time)],registry(reference));
      assert.equal(h.isPersonalBest,expected,`${time} against ${reference}`);
      assert.equal(h.manualBaseline,'37:07');
      assert.equal(h.manualBaselineSeconds,2227);
    }
  }
  for(const [time,expected] of [['37:07',true],['37:07.00',true],['37:07.01',false]]){
    const track=race(time,'2026-06-01',{type:'track',environment:'outdoor',results:[result(time,{distance:'10000 m'})]});
    const [h]=history([track],registry('37:07',{type:'track',distance:'10000 m'}));
    assert.equal(h.isPersonalBest,expected,time);
    assert.equal(h.comparisonTime,time);
    assert.equal(h.comparisonSeconds,parsePerformanceTime(time));
  }
});

test('normalized comparison history retains original source times and uses whole-second improvements',()=>{
  const athletes=registry('37:07.8',{date:'2026-01-01'});
  const races=[race('37:07.9','2026-05-01'),race('37:06.9')];
  const original=structuredClone({races,athletes});
  const rows=derivePerformanceHistory(races,athletes).flatMap(r=>r.results);
  const [first,next]=rows.map(r=>r.performanceHistory);
  assert.deepEqual({races,athletes},original);
  assert.deepEqual(rows.map(row=>row.time),['37:07.9','37:06.9']);
  assert.equal(first.comparisonTime,'37:07');
  assert.equal(first.comparisonSeconds,2227);
  assert.equal(first.manualBaseline,'37:07');
  assert.equal(first.previousBest,'37:07');
  assert.equal(first.previousBestSeconds,2227);
  assert.equal(first.previousPersonalBests[0].time,'37:07');
  assert.equal(first.previousPersonalBests[0].sourceTime,'37:07.8');
  assert.equal(first.confirmedPersonalBests[0].time,'37:07');
  assert.equal(first.confirmedPersonalBests[0].sourceTime,'37:07.8');
  assert.equal(first.bestRecorded,'37:06');
  assert.equal(next.previousBest,'37:07');
  assert.equal(next.improvementSeconds,1);
  assert.equal(next.bestRecorded,'37:06');
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

test('road and track and different athletes never share a manual baseline',()=>{
  const track=race('39:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('39:00',{distance:'10 000 m'})]});
  assert.equal(history([track],registry())[0].isPersonalBest,false);
  const manualTrack=registry('40:00',{type:'track',environment:'outdoor',distance:'10 000 m'});
  assert.equal(history([track],manualTrack)[0].isPersonalBest,true);
  assert.equal(history([{...track,environment:'indoor'}],manualTrack)[0].isPersonalBest,true);
  assert.equal(history([race('39:00','2026-06-01',{results:[result('39:00',{athleteId:'someone-else'})]})],registry())[0].isPersonalBest,false);
});

test('indoor and outdoor track share references and history, retaining environment metadata',()=>{
  const indoor=race('3:59','2026-06-01',{type:'track',environment:'indoor',results:[result('3:59',{distance:'1500 m'})]});
  const athletes=registry('4:00',{type:'track',environment:'indoor',distance:'1500 m'});
  assert.equal(history([indoor],athletes)[0].isPersonalBest,true);
  assert.equal(history([{...indoor,environment:'outdoor'}],athletes)[0].isPersonalBest,true);
  assert.equal(history([{...indoor,environment:undefined}],athletes)[0].isPersonalBest,true);
  const derived=derivePerformanceHistory([indoor,{...indoor,id:'outdoor',date:'2026-07-01',environment:'outdoor',results:[result('4:00',{distance:'1500 m'})]}],athletes);
  assert.deepEqual(derived.map(r=>r.environment),['indoor','outdoor']);
  assert.equal(derived[1].results[0].performanceHistory.previousBest,'3:59');
  assert.equal(derived[1].results[0].performanceHistory.reason,'slower-than-previous-best');
  assert.equal(collectManualPersonalBests(athletes).entries[0].manual.environment,'indoor');
  athletes.athletes[0].personalBests.push({type:'track',environment:'outdoor',distance:'1500 m',time:'3:50',date:'2026-01-01'});
  assert.equal(history([indoor],athletes)[0].isPersonalBest,false);
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

test('a manual track reference takes precedence over WA across indoor and outdoor',()=>{
  const athletes=registry('4:00',{type:'track',environment:'indoor',distance:'1500 m'});
  athletes.athletes[0].personalBests.push(waReference('3:50',{type:'track',environment:'outdoor',distance:'1500 m'}));
  const track=race('4:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('4:00',{distance:'1500 m'})]});
  const [h]=history([track],athletes);
  assert.equal(h.isManualPersonalBest,true);
  assert.equal(h.manualBaseline,'4:00');
  assert.equal(h.previousBest,null);
  assert.equal(h.bestRecorded,'4:00');
  assert.equal(h.confirmedPersonalBests.length,1);
  assert.equal(h.confirmedPersonalBests[0].environment,'indoor');
  assert.equal(h.confirmedPersonalBests[0].sourceProvider,undefined);
});

test('a review block removes only the matching athlete and road distance WA reference',()=>{
  const athletes={athletes:[
    {id:'runner',personalBests:[waReference('39:00'),waReference('20:00',{distance:'5 km'}),waReference('40:00',{type:'track',environment:'outdoor',distance:'10000 m'})],personalBestReviewBlocks:[{type:'road',distance:'10 km',reason:'surface-unspecified'}]},
    {id:'another',personalBests:[waReference()]}
  ]};
  const races=[race('40:00'),race('20:00','2026-06-01',{results:[result('20:00',{distance:'5 km'})]}),race('40:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('40:00',{distance:'10000 m'})]}),race('40:00','2026-06-01',{results:[result('40:00',{athleteId:'another'})]})];
  const before=structuredClone({athletes,races});
  const [blocked,...unaffected]=history(races,athletes);
  assert.equal(blocked.isPersonalBest,false);
  assert.equal(blocked.hasManualBaseline,false);
  assert.equal(blocked.previousBest,null);
  assert.deepEqual(blocked.previousPersonalBests,[]);
  assert.equal(blocked.bestRecorded,'40:00');
  assert.equal(blocked.isBestRecorded,true);
  assert.ok(unaffected.every(h=>h.isPersonalBest));
  assert.deepEqual(collectManualPersonalBests(athletes).issues,[]);
  assert.deepEqual({athletes,races},before);
});

test('track review blocks always exclude the combined track category and leave road active',()=>{
  const athletes={athletes:[{id:'runner',personalBests:[
    ...['indoor','outdoor'].map(environment=>waReference('20:00',{type:'track',environment,distance:'5000m'})),
    waReference('20:00',{distance:'5 km'})
  ],personalBestReviewBlocks:[{type:'track',distance:'5 000 m'}]}]};
  const races=['indoor','outdoor'].map(environment=>race('20:00','2026-06-01',{type:'track',environment,results:[result('20:00',{distance:'5000m'})]}));
  races.push(race('20:00','2026-06-01',{results:[result('20:00',{distance:'5 km'})]}));
  assert.deepEqual(history(races,athletes).map(h=>h.isPersonalBest),[false,false,true]);
  athletes.athletes[0].personalBestReviewBlocks[0].environment='indoor';
  assert.deepEqual(history(races,athletes).map(h=>h.isPersonalBest),[false,false,true]);
});

test('review blocks cannot disable confirmed manual PBs or contribute a time to history',()=>{
  const athletes=registry();
  athletes.athletes[0].personalBests.push(waReference('38:00'));
  athletes.athletes[0].personalBestReviewBlocks=[{type:'road',distance:'10 km',time:'30:00',rawValue:'30:00',sourceRow:44}];
  const [h]=history([race('40:00')],athletes);
  assert.equal(h.isPersonalBest,true);
  assert.equal(h.manualBaseline,'40:00');
  assert.equal(h.previousBest,null);
  assert.equal(h.bestRecorded,'40:00');
  assert.equal(h.confirmedPersonalBests.length,1);
  assert.equal(h.confirmedPersonalBests[0].sourceProvider,undefined);
  athletes.athletes[0].personalBests=[];
  const [withoutReference]=history([race('29:00')],athletes);
  assert.equal(withoutReference.isPersonalBest,false);
  assert.equal(withoutReference.hasManualBaseline,false);
  assert.equal(withoutReference.previousBest,null);
});

test('review blocks support PB sprint events and keep hurdles separate from flat running',()=>{
  for(const distance of ['100 m','200 m','400 m','1000 m','2000 m hinder']){
    const athletes={athletes:[{id:'runner',personalBests:[waReference('2:00',{type:'track',environment:'outdoor',distance})],personalBestReviewBlocks:[{type:'track',distance}]}]};
    const races=[race('2:00','2026-06-01',{type:'track',environment:'outdoor',results:[result('2:00',{distance})]})];
    assert.equal(history(races,athletes)[0].isPersonalBest,false,distance);
    assert.deepEqual(collectManualPersonalBests(athletes).issues,[],distance);
    if(distance==='2000 m hinder'){
      athletes.athletes[0].personalBestReviewBlocks[0].distance='2000 m';
      assert.equal(history(races,athletes)[0].isPersonalBest,true);
    }
  }
});

test('malformed review blocks are reported explicitly and never broaden their scope',()=>{
  for(const [blocks,reason] of [
    [{},'personal-best-review-blocks-not-array'],
    [[null],'invalid-personal-best-review-block'],
    [[{type:'trail',distance:'10 km'}],'invalid-personal-best-review-block-type'],
    [[{type:'road',distance:'10 km',environment:'outdoor'}],'invalid-personal-best-review-block-environment'],
    [[{type:'track',distance:'10000m',environment:null}],'invalid-personal-best-review-block-environment'],
    [[{type:'track',distance:'10000m',environment:'all'}],'invalid-personal-best-review-block-environment'],
    [[{type:'road',distance:'2 km'}],'unsupported-personal-best-review-block-distance'],
    [[{type:'road'}],'unsupported-personal-best-review-block-distance']
  ]){
    const athletes={athletes:[{id:'runner',personalBests:[waReference()],personalBestReviewBlocks:blocks}]};
    const collected=collectManualPersonalBests(athletes);
    assert.deepEqual(collected.reviewBlockKeys,[]);
    assert.equal(collected.issues.length,1);
    assert.equal(collected.issues[0].field,'personalBestReviewBlocks');
    assert.equal(collected.issues[0].reason,reason);
    assert.equal(history([race('40:00')],athletes)[0].isPersonalBest,true);
  }
});

test('unresolved survey submissions alone never act as PB references',()=>{
  const athletes={athletes:[{id:'runner',manualPbSubmissions:[{distance:'10 km',time:'40:00',status:'needs-review'}],personalBestReviewBlocks:[{type:'road',distance:'10 km'}]}]};
  const [h]=history([race('39:00')],athletes);
  assert.equal(h.isPersonalBest,false);
  assert.equal(h.manualBaseline,null);
  assert.equal(h.previousBest,null);
  assert.deepEqual(collectManualPersonalBests(athletes).issues,[]);
});

test('100 m, 200 m, 400 m and 1000 m PB support leaves club-record normalisation unchanged',async()=>{
  const {normalizeDistance,findRecordCandidates}=await import('../dist/record-check.js');
  for(const [distance,alias,time] of [['100 m','0.1 km','11.50'],['200 m','0.2 km','22.50'],['400 m','0.4 km','50.00'],['1000 m','1 km','2:30.00']]){
    const track=race(time,'2026-06-01',{type:'track',environment:'outdoor',results:[result(time,{distance,recordEligible:true,gender:'M'})]});
    const athletes=registry(time,{type:'track',environment:'outdoor',distance:alias});
    assert.equal(history([track],athletes)[0].isPersonalBest,true,distance);
    assert.equal(normalizeDistance(distance,'track'),null,distance);
    assert.deepEqual(findRecordCandidates([track],[{category:'track',gender:'M',discipline:distance.replace(/\s/g,''),time:'9:59'}]),[]);
  }
  assert.equal(normalizeDistance('2000 m hinder','track'),null);
});

test('road 3 km and English mile PB aliases do not expand club records or cross surfaces',async()=>{
  const {normalizeDistance}=await import('../dist/record-check.js');
  for(const [distance,aliases,time] of [['3 km',['3000 m'],'9:30'],['1 mile',['Mile','Miles','1 engelsk mil','1609.344 m','1.609344 km'],'4:59']]){
    const athletes=registry(time,{distance});
    for(const alias of aliases){
      const road=race(time,'2026-06-01',{results:[result(time,{distance:alias})]});
      assert.equal(history([road],athletes)[0].isPersonalBest,true,alias);
      assert.equal(history([{...road,type:'track',environment:'outdoor'}],athletes)[0].hasManualBaseline,false,alias);
    }
    assert.equal(normalizeDistance(distance,'road'),null,distance);
  }
  assert.equal(history([race('4:59')],registry('4:59',{distance:'1 mile'}))[0].hasManualBaseline,false);
});

test('trail times require the same explicitly identified course',()=>{
  const trail=race('39:00','2026-06-01',{type:'trail',courseId:'course-a'});
  assert.equal(history([trail],registry('40:00',{type:'trail',courseId:'course-a'}))[0].isPersonalBest,true);
  assert.equal(history([trail],registry('40:00',{type:'trail',courseId:'course-b'}))[0].isPersonalBest,false);
});

test('Birkebeinerløpet and Løpebirken share one annual course class with whole-second times',()=>{
  const athletes=registry('1:30:00.2',{type:'trail',courseId:'birkebeinerlopet',distance:'Birkebeinerløpet',date:'2024-06-01'});
  const birken=(time,date,distance='Løpebirken',courseId='birkebeinerlopet')=>race(time,date,{type:'trail',courseId,results:[result(time,{distance})]});
  const [first,next]=history([birken('1:30:00.9','2025-06-01'),birken('1:29:59.9','2026-06-01','Birkebeinerløpet')],athletes);
  assert.equal(first.isManualPersonalBest,true);
  assert.equal(first.manualBaseline,'1:30:00');
  assert.equal(first.comparisonTime,'1:30:00');
  assert.equal(next.isPersonalBest,true);
  assert.equal(next.previousBest,'1:30:00');
  assert.equal(next.improvementSeconds,1);
  for(const distance of ['12 km','21 km','Halvbirken'])assert.equal(history([birken('1:00:00','2026-06-01',distance)],athletes)[0].hasManualBaseline,false,distance);
  assert.equal(history([birken('1:00:00','2026-06-01','Løpebirken','other-course')],athletes)[0].hasManualBaseline,false);
  assert.equal(history([{...birken('1:00:00','2026-06-01'),courseId:undefined}],athletes)[0].hasManualBaseline,false);
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
  const pbs=data.races.flatMap(race=>race.results.filter(row=>row.performanceHistory.isPersonalBest).map(row=>({race,row})));
  assert.ok(pbs.length>0);
  assert.equal(data.personalBestIssues.length,0);
  const collected=collectManualPersonalBests(athletes);
  const manualKeys=new Set(collected.entries.filter(entry=>!entry.manual.sourceProvider).map(entry=>entry.key));
  const applicable=collected.entries.filter(entry=>entry.manual.sourceProvider!=='world-athletics'||(!collected.reviewBlockKeys.includes(entry.key)&&!manualKeys.has(entry.key)));
  for(const {race,row} of pbs){
    assert.equal(row.performanceHistory.hasManualBaseline,true);
    assert.ok(row.performanceHistory.manualBaselineSeconds>0);
    const seconds=parsePerformanceTime(row.time),comparisonSeconds=race.type==='track'?seconds:Math.floor(seconds);
    assert.equal(row.performanceHistory.comparisonSeconds,comparisonSeconds);
    assert.ok(comparisonSeconds<=row.performanceHistory.manualBaselineSeconds);
    const reference=applicable.find(entry=>entry.key===row.performanceHistory.comparisonKey&&entry.seconds===row.performanceHistory.manualBaselineSeconds);
    assert.ok(reference);
    if(reference.manual.sourceProvider==='world-athletics'){
      assert.equal(reference.manual.userApproved,true);
      assert.equal(collected.reviewBlockKeys.includes(reference.key),false);
    }
  }
  const withoutManual=structuredClone(athletes);
  for(const athlete of withoutManual.athletes)athlete.personalBests=[];
  assert.equal(prepareResultsData({races,athletes:withoutManual,records}).races.flatMap(r=>r.results).filter(r=>r.performanceHistory.isPersonalBest).length,0);
});

test('Trond Sliper matches his Amsterdam half PB; slower 5 km and 10 km stay unclaimed',async()=>{
  const read=async path=>JSON.parse(await readFile(new URL('../dist/'+path,import.meta.url),'utf8'));
  const index=await read('data/index.json');
  const races=await Promise.all(index.races.map(read));
  const athletes=await read(index.athletes),records=await read(index.records);
  const data=prepareResultsData({races,athletes,records});
  const amsterdam=data.races.find(r=>r.id==='amsterdam-maraton-2026').results.find(row=>row.athleteId==='trond-sliper');
  assert.equal(amsterdam.time,'1:18:32');
  assert.equal(amsterdam.timeBasis,'net');
  assert.equal(amsterdam.performanceHistory.isPersonalBest,true);
  assert.equal(amsterdam.performanceHistory.isManualPersonalBest,true);
  assert.ok(amsterdam.performanceHistory.confirmedPersonalBests.some(pb=>!pb.sourceProvider&&pb.time==='1:18:32'));
  const trondRows=data.races.flatMap(r=>r.results).filter(row=>row.athleteId==='trond-sliper');
  for(const time of ['16:48','35:43']){
    const row=trondRows.find(row=>parsePerformanceTime(row.time)===parsePerformanceTime(time));
    assert.ok(row,'expected Trond result '+time);
    assert.equal(row.performanceHistory.isPersonalBest,false,time);
  }
});
