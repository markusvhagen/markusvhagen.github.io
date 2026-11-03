import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {prepareResultsData} from '../dist/data.js';
import {selectArchivePage} from '../dist/archive.js';
import {createWidgetSlots,selectWidgetHighlights} from '../dist/widget.js';
import {gradeRaceResult} from '../dist/age-grading.js';
import {parsePerformanceTime,performanceDate} from '../dist/record-check.js';
import {awardPosition,genderPosition,renderAthleteCard} from '../dist/athlete-cards.js';

const root=new URL('../dist/',import.meta.url);
const json=async path=>JSON.parse(await readFile(new URL(path,root),'utf8'));
const manifest=await json('data/index.json');
const raw={...manifest,races:await Promise.all(manifest.races.map(json)),athletes:await json(manifest.athletes),records:await json(manifest.records),relays:await json(manifest.relays),upcoming:await json(manifest.upcoming)};

test('all imported races remain reachable while only finishers and the ten newest races enter the widget',()=>{
  const original=JSON.stringify(raw),data=prepareResultsData(raw);
  const finished=raw.races.flatMap(r=>r.results).filter(r=>r.status==='finished');
  assert.equal(raw.races.length,18);
  assert.equal(new Set(raw.races.map(race=>race.id)).size,raw.races.length);
  assert.equal(raw.races.reduce((sum,race)=>sum+race.results.length,0),351);
  assert.equal(finished.length,336);
  assert.equal(data.races.flatMap(r=>r.results).length,finished.length);
  const first=selectArchivePage(data.races),second=selectArchivePage(data.races,{},2);
  assert.equal(first.resultCount,finished.length);
  assert.equal(first.items.length,10);assert.equal(second.items.length,8);assert.equal(first.pageCount,2);
  assert.deepEqual(second.items.map(({race})=>race.id),['tronder-ostlopet-2026','rekordmila-2026','nidaros-lopefest-2026','tordenskioldlopet-2026','orasprinten-2026','berlin-halvmaraton-2026','barcelona-halvmaraton-2026','valencia-10k-2026']);
  assert.ok(data.races.every(r=>r.results.every(r=>r.status==='finished')));
  assert.ok(data.races.flatMap(selectWidgetHighlights).every(r=>r.status==='finished'));
  const slots=createWidgetSlots(data.races);
  assert.equal(slots.length,10);assert.ok(slots.every(Boolean));
  assert.deepEqual(slots.map(race=>race.id),first.items.map(({race})=>race.id));
  assert.equal(slots[0].id,'hytteplanmila-2026');assert.equal(slots.at(-1).id,'nm-bane-2026');
  assert.ok(raw.races.some(r=>r.results.some(r=>r.status==='DNS')));
  assert.equal(JSON.stringify(raw),original);
});

test('new Spanish imports preserve net times and verified gender positions, while every participant resolves',()=>{
  for(const result of raw.races.flatMap(r=>r.results)){
    assert.ok(!Object.hasOwn(result,'pb'));
    assert.ok(!Object.hasOwn(result,'previousBest'));
  }
  const data=prepareResultsData(raw);
  for(const id of ['berlin-halvmaraton-2026','barcelona-halvmaraton-2026','valencia-10k-2026']){
    assert.ok(data.races.find(r=>r.id===id).results.every(r=>r.time===r.netTime&&r.timeBasis==='net'));
  }
  const valencia=data.races.find(r=>r.id==='valencia-10k-2026');
  assert.deepEqual(Object.fromEntries(valencia.results.map(r=>[r.athleteId,r.time])),{
    'tommy-bangjord-hove':'28:44','stig-almasbakk':'32:24','tor-magne-volden':'37:36','simen-haugland':'38:07'
  });
  const tommy=valencia.results.find(r=>r.athleteId==='tommy-bangjord-hove');
  assert.equal(tommy.gunTime,'28:49');assert.equal(tommy.clubRecordTime,'28:49');assert.equal(tommy.clubRecordTimeBasis,'gun');
  assert.equal(tommy.positionGender,85);assert.equal(tommy.positionGenderNet,83);
  const barcelona=data.races.find(r=>r.id==='barcelona-halvmaraton-2026');
  assert.deepEqual(Object.fromEntries(barcelona.results.map(r=>[r.athleteId,[r.time,r.positionGender]])),{
    'markus-valas-hagen':['1:22:04',1668],'ingrid-lunde-steen':['1:20:00',83],
    'magnus-cato-andersen':['1:21:58',1644],'thea-elise-andersen':['1:50:00',2991],
    'tommy-bangjord-hove':['1:03:01',30]
  });
  assert.ok([...valencia.results,...barcelona.results].every(r=>r.positionGenderVerified===true));
  const pal=data.races.find(r=>r.id==='orasprinten-2026').results.find(r=>r.athleteId==='pal-kleveland');
  assert.equal(pal.position,20);assert.equal(pal.positionGender,19);
  assert.equal(data.upcoming.find(r=>r.id==='valencia-maraton-2026').participants.length,10);
  assert.equal(data.upcoming.find(r=>r.id==='jessheim-vintermaraton-2026').participants.length,3);
  assert.equal(data.unresolvedAthletes.length,0);
});

test('source-checked birth years grade old and new road results without changing raw data',()=>{
  const original=JSON.stringify(raw),data=prepareResultsData(raw);
  const profiles=Array.isArray(raw.athletes)?raw.athletes:raw.athletes.athletes;
  assert.equal(profiles.length,166);
  assert.equal(profiles.filter(profile=>Number.isInteger(profile.birthYear)).length,91);
  assert.equal(profiles.find(profile=>profile.id==='markus-valas-hagen').birthYear,1999);
  const graded=data.races.flatMap(race=>race.results.filter(result=>result.ageGrade.eligible));
  assert.equal(graded.length,226);
  for(const race of data.races){
    for(const result of race.results){
      const profile=profiles.find(profile=>profile.id===result.athleteId);
      assert.deepEqual(result.ageGrade,gradeRaceResult(race,result,profile));
      assert.ok(!Object.hasOwn(raw.races.find(source=>source.id===race.id).results.find(source=>source.athleteId===result.athleteId&&source.distance===result.distance)||{},'ageGrade'));
      if(['trail','track'].includes(race.type))assert.equal(result.ageGrade.eligible,false);
      if(result.athleteId==='markus-valas-hagen'){
        assert.equal(result.ageGrade.eligible,true);
        assert.equal(result.ageGrade.age,27);
      }
    }
  }
  assert.equal(JSON.stringify(raw),original);
});

test('every imported distance has sourced winners in its scope, with explicit championship class exceptions',()=>{
  let pairs=0,winners=0;
  const excluded=[];
  const classExceptions={
    'junior-nm-2026|3 000 m|men':{scope:'U20',category:'U20',reason:'Ikke på programmet i U20'},
    'junior-nm-2026|5 000 m|women':{scope:'U20',category:'U20',reason:'Ikke på programmet i U20'},
    'um-2026|3 000 m|women':{scope:'G16',category:'G16',reason:'Denne vinneroppføringen gjelder gutter 16 år.'}
  };
  for(const race of raw.races){
    assert.deepEqual(new Set(race.winners.map(pair=>pair.distance)),new Set(race.distances));
    for(const pair of race.winners){
      pairs++;
      for(const gender of ['men','women']){
        const winner=pair[gender];
        if(winner.applicable===false){
          const key=[race.id,pair.distance,gender].join('|'),expected=classExceptions[key];
          assert.ok(expected,`Unexpected missing winner: ${key}`);excluded.push(key);
          assert.equal(pair.scope,expected.scope);assert.equal(pair.category,expected.category);
          assert.deepEqual(winner,{applicable:false,reason:expected.reason});
          continue;
        }
        winners++;
        assert.equal(winner.verified,true);
        assert.ok(winner.name&&parsePerformanceTime(winner.time)>0);
        assert.ok(new URL(winner.sourceUrl).protocol==='https:');
      }
    }
  }
  assert.equal(pairs,30);assert.equal(winners,57);
  assert.deepEqual(new Set(excluded),new Set(Object.keys(classExceptions)));
  const copenhagen=raw.races.find(race=>race.id==='kobenhavn-halvmaraton-2026');
  assert.equal(copenhagen.news[0].url,'https://www.bratsbergfriidrett.no/2026/09/20/klubbrekorder-i-koben/');
  assert.equal(raw.races.find(race=>race.id==='trondheim-maraton-2026').news[0].url,'https://www.bratsbergfriidrett.no/2026/09/06/14-klassevinnere-og-historisk-andreplass/');
});

test('Copenhagen uses Petter’s verified net time and gender rank without promoting his age-class silver',()=>{
  const data=prepareResultsData(raw),race=data.races.find(r=>r.id==='kobenhavn-5k-2026');
  assert.equal(race.date,'2026-09-19');assert.equal(race.results.length,1);
  const petter=race.results[0];
  assert.equal(petter.athleteId,'petter-vea-monseth');
  assert.equal(petter.time,'14:20');assert.equal(petter.netTime,'14:20');assert.equal(petter.timeBasis,'net');
  assert.equal(petter.sourceTimingRaw.grossTimeUsable,false);
  assert.equal(Object.hasOwn(petter,'gunTime'),false);
  assert.equal(petter.positionGenderVerified,true);assert.equal(genderPosition(petter),52);
  assert.equal(petter.positionClass,2);assert.equal(petter.clubRecord,true);
  const card=renderAthleteCard(petter);
  assert.match(card,/is-record/);assert.match(card,/Klubbrekord/);assert.match(card,/Nr\. 52 menn/);
  assert.doesNotMatch(card,/podium-|medal-silver/);
});

test('Junior-NM preserves U20 ranks and a dated track PB separately from Petter’s road 5 km',()=>{
  const data=prepareResultsData(raw),race=data.races.find(r=>r.id==='junior-nm-2026');
  assert.equal(race.type,'track');assert.equal(race.environment,'outdoor');assert.equal(race.results.length,2);
  const oda=race.results.find(r=>r.athleteId==='oda-randli-elden'),petter=race.results.find(r=>r.athleteId==='petter-vea-monseth');
  assert.equal(oda.time,'10:42,58');assert.equal(oda.category,'K-U20');assert.equal(oda.positionClass,8);
  assert.equal(petter.time,'14:38,08');assert.equal(petter.category,'M-U20');assert.equal(petter.positionClass,7);
  for(const result of race.results){
    assert.equal(result.positionScope,'class');assert.equal(result.positionClassVerified,true);
    assert.equal(genderPosition(result),null);assert.equal(result.ageGrade.eligible,false);
    assert.equal(performanceDate(race,result),'2026-08-30');
    assert.doesNotMatch(renderAthleteCard(result),/podium-|award-medal/);
  }
  assert.equal(petter.performanceHistory.isPersonalBest,true);
  assert.equal(petter.performanceHistory.isManualPersonalBest,true);
  assert.match(renderAthleteCard(petter),/badge pb/);
  const road=data.races.find(r=>r.id==='kobenhavn-5k-2026').results[0];
  assert.equal(road.performanceHistory.isPersonalBest,false);
  assert.equal(road.ageGrade.eligible,true);
});

test('UM awards verified championship-class medals and dated PBs without inventing gender podiums',()=>{
  const data=prepareResultsData(raw),race=data.races.find(r=>r.id==='um-2026');
  assert.equal(race.results.length,3);assert.equal(race.date,'2026-09-13');
  const expected={
    'kristian-stokke-selnes':{time:'5:53,69',distance:'2 000 m',rank:3,category:'G15',medal:'bronze',record:true,pb:true},
    'oda-randli-elden':{time:'6:42,55',distance:'2 000 m',rank:2,category:'J15',medal:'silver',record:false,pb:true},
    'petter-vea-monseth':{time:'8:23,56',distance:'3 000 m',rank:1,category:'G16',medal:'gold',record:true,pb:false}
  };
  assert.deepEqual(new Set(race.results.map(result=>result.athleteId)),new Set(Object.keys(expected)));
  for(const result of race.results){
    const known=expected[result.athleteId],card=renderAthleteCard(result);
    assert.equal(result.time,known.time);assert.equal(result.distance,known.distance);
    assert.equal(result.positionScope,'class');assert.equal(result.positionClassVerified,true);
    assert.equal(result.awardScope,'championship-class');assert.equal(awardPosition(result),known.rank);
    assert.equal(genderPosition(result),null);assert.equal(result.category,known.category);
    assert.equal(result.clubRecord,known.record);assert.equal(result.ageGrade.eligible,false);
    assert.equal(performanceDate(race,result),'2026-09-13');
    assert.equal(result.performanceHistory.isPersonalBest,known.pb);
    assert.equal(result.performanceHistory.isManualPersonalBest,known.pb);
    assert.match(card,new RegExp('medal-'+known.medal));
    assert.match(card,new RegExp('Nr\\. '+known.rank+' '+known.category));
    assert.doesNotMatch(card,/Nr\. [123] (menn|kvinner)/);
    if(known.pb)assert.match(card,/badge pb/);
    if(known.record)assert.match(card,/is-record/);
  }
  assert.deepEqual(data.personalBestIssues,[]);
});

test('NM event dates and combined rankings survive rendering without treating heat places as medals',()=>{
  const data=prepareResultsData(raw),race=data.races.find(r=>r.id==='nm-bane-2026');
  assert.equal(race.date,'2026-07-23');assert.equal(race.endDate,'2026-07-25');assert.equal(race.results.length,10);
  assert.equal(new Set(race.results.map(result=>result.athleteId)).size,6);
  const eventDates={'5 000 m':'2026-07-23','1 500 m':'2026-07-24','10 000 m':'2026-07-25'};
  for(const result of race.results){
    assert.equal(performanceDate(race,result),eventDates[result.distance]);
    assert.match(renderAthleteCard(result),new RegExp('datetime="'+eventDates[result.distance]+'"'));
    assert.equal(result.ageGrade.eligible,false);
  }
  const sofie=race.results.filter(result=>result.athleteId==='sofie-karoline-haugen');
  assert.deepEqual(sofie.map(result=>[result.distance,result.time,genderPosition(result)]),[
    ['5 000 m','15:35.36',3],['10 000 m','32:28.89',2]
  ]);
  for(const result of sofie){assert.equal(result.clubRecord,true);assert.match(renderAthleteCard(result),/is-record/);}
  assert.match(renderAthleteCard(sofie[0]),/medal-bronze/);assert.match(renderAthleteCard(sofie[1]),/medal-silver/);
  const eira=race.results.find(result=>result.athleteId==='eira-rapp'&&result.distance==='5 000 m');
  assert.equal(eira.positionHeat,1);assert.equal(genderPosition(eira),11);
  assert.match(renderAthleteCard(eira),/Nr\. 11 kvinner/);assert.doesNotMatch(renderAthleteCard(eira),/podium-|award-medal/);
  const sebastian=race.results.find(result=>result.athleteId==='sebastian-reinertsen'&&result.distance==='1 500 m');
  assert.equal(sebastian.positionScope,'heat');assert.equal(sebastian.positionHeat,5);assert.equal(genderPosition(sebastian),null);
  assert.match(renderAthleteCard(sebastian),/Forsøk · heat 2 · 5\. plass/);
  assert.doesNotMatch(renderAthleteCard(sebastian),/podium-|award-medal|Nr\. 5 menn/);
});

test('imported Barcelona history supports Berlin PB and dated Ørasprinten confirms the registered 5 km PB',()=>{
  const data=prepareResultsData(raw);
  const mine=data.races.flatMap(race=>race.results.filter(result=>result.athleteId==='markus-valas-hagen').map(result=>({raceId:race.id,result})));
  assert.equal(mine.length,5);
  const confirmedIds=['berlin-halvmaraton-2026','nidaros-lopefest-2026','orasprinten-2026'];
  for(const {raceId,result} of mine){
    const confirmed=confirmedIds.includes(raceId),history=result.performanceHistory;
    assert.equal(history.isPersonalBest,confirmed);
    assert.equal(history.isManualPersonalBest,confirmed);
    const card=renderAthleteCard(result);
    if(confirmed){
      assert.match(card,/badge pb/);
      assert.match(card,/bekreftet i utøverregisteret/);
      assert.doesNotMatch(card,/athlete-card-improvement/);
      if(raceId==='berlin-halvmaraton-2026'){
        assert.equal(history.previousBest,'1:22:04');
        assert.deepEqual(history.previousRaceIds,['barcelona-halvmaraton-2026']);
        assert.equal(history.improvementSeconds,61);
      }else{
        assert.equal(history.previousBest,null);
        assert.equal(history.improvementSeconds,null);
      }
    }else assert.doesNotMatch(card,/badge pb/);
  }
  const barcelona=mine.find(({raceId})=>raceId==='barcelona-halvmaraton-2026').result;
  assert.equal(barcelona.performanceHistory.reason,'first-recorded-result');
  const filtered=selectArchivePage(data.races,{query:'Markus Valås Hagen',onlyRecords:true});
  assert.equal(filtered.resultCount,3);
});
