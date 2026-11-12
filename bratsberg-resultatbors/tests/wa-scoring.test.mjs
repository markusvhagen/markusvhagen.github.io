import test from 'node:test';
import assert from 'node:assert/strict';
import {gradeWaResult} from '../dist/wa-scoring.js';
import {WA_SCORING_TABLES,WA_SCORING_INFO} from '../dist/wa-scoring-tables.js';

const road={type:'road',date:'2026-11-11'};
const track={type:'track',environment:'outdoor',date:'2026-11-11'};
const score=(race,gender,distance,time,extra={})=>gradeWaResult(race,{gender,distance,time,...extra});

test('matches independently read 1000-point cells in all supported official tables',()=>{
  // Official PDF pages 137/167/197/227/257 and 556/586/616/646/676.
  const fixtures={
    M:{track:{'800 m':'1:50.93','1500 m':'3:48.17','2000 m':'5:13.87','3000 m':'8:09.71','5000 m':'14:00.02','10000 m':'29:28.55'},road:{'5 km':'14:00','10 km':'29:28','Halvmaraton':'1:04:50','Maraton':'2:17:26'}},
    K:{track:{'800 m':'2:09.43','1500 m':'4:26.82','2000 m':'6:05.55','3000 m':'9:32.42','5000 m':'16:27.51','10000 m':'34:43.15'},road:{'5 km':'16:27','10 km':'34:43','Halvmaraton':'1:16:31','Maraton':'2:42:59'}}
  };
  for(const [gender,surfaces] of Object.entries(fixtures))for(const [surface,events] of Object.entries(surfaces))for(const [distance,time] of Object.entries(events)){
    const actual=score(surface==='road'?road:track,gender,distance,time);
    assert.equal(actual.eligible,true,`${gender} ${surface} ${distance}`);
    assert.equal(actual.score,1000,`${gender} ${surface} ${distance}`);
    assert.equal(actual.edition,'2025');
  }
});

test('between-row performance gets the lower published integer score',()=>{
  // Men's 1500 m 3:48.17=1000, 3:48.25=999. Men's HM 1:04:50=1000, 1:04:52=999.
  assert.equal(score(track,'M','1500 m','3:48.18').score,999);
  assert.equal(score(track,'M','1500 m','3:48.249').score,999);
  assert.equal(score(road,'M','Halvmaraton','1:04:51').score,999);
  assert.equal(score(road,'M','Halvmaraton','1:04:52').score,999);
});

test('preserves sparse road table scores rather than interpolating skipped points',()=>{
  // Published men's 5 km 12:10=1400; 12:11=1396 (1399..1397 have dashes).
  assert.equal(score(road,'M','5 km','12:10').score,1400);
  assert.equal(score(road,'M','5 km','12:10.001').score,1396);
  assert.equal(score(road,'M','5 km','12:11').score,1396);
});

test('uses full selected timing basis and never the truncated presentation time',()=>{
  assert.equal(score(road,'M','10 km','29:28.9').score,999);
  assert.equal(score(road,'M','10 km','29:28.0').score,1000);
  assert.equal(score(track,'M','1500 m','3:48,17').score,1000);
  assert.equal(score(track,'M','1500 m','3:48.1700').score,1000);
  assert.equal(score(track,'M','1500 m','3:48.1701').score,999);
  assert.equal(score(road,'M','10 km','29:29',{measuredTime:'29:28.1'}).score,999);
  assert.equal(score({...road,timeBasis:'net'},'M','10 km','29:29',{netTime:'29:28'}).score,1000);
  assert.equal(score(road,'M','10 km','29:29',{timeBasis:'gun',netTime:'29:28'}).score,999);
});

test('has no age dependency and keeps track/road/gender tables separate',()=>{
  assert.deepEqual(score(road,'M','5 km','18:11'),score(road,'M','5 km','18:11',{birthYear:1999,age:27}));
  assert.notEqual(score(road,'K','10 km','34:43').score,score(road,'M','10 km','34:43').score);
  assert.equal(score(track,'M','5 000 m','14:00.02').score,1000);
  assert.notEqual(score(road,'M','5 km','14:00.02').score,1000);
});

test('rejects nonfinishes, unsupported surfaces/events and unknown gender',()=>{
  for(const status of ['DNF','DNS','DQ','running'])assert.equal(score(road,'M','10 km','30:00',{status}).reason,'not-finished');
  for(const time of ['DNF','0','1:99','bad',''])assert.equal(score(road,'M','10 km',time).eligible,false);
  assert.equal(score({type:'trail'},'M','10 km','30:00').reason,'unsupported-discipline');
  assert.equal(score({type:'track',environment:'indoor'},'M','3000 m','9:00').reason,'unsupported-environment');
  assert.equal(score({type:'track'},'M','3000 m','9:00').eligible,false);
  assert.equal(score(road,'M','3 km','9:00').reason,'unsupported-distance');
  assert.equal(score(track,'M','3000mh','9:00').reason,'unsupported-distance');
  assert.equal(score(road,undefined,'10 km','30:00').reason,'unsupported-gender');
});

test('does not invent or clamp scores outside the published range',()=>{
  assert.equal(score(road,'M','Maraton','1:00:00').reason,'above-table-range');
  assert.equal(score(road,'M','Maraton','12:00:00').reason,'below-table-range');
});

test('supports the canonical distance aliases without mutating source rows',()=>{
  const result=Object.freeze({gender:'K',distance:'10K',time:'34:43',age:99});
  assert.equal(gradeWaResult(Object.freeze(road),result).score,1000);
  assert.equal(score(road,'M','hm','1:04:50').score,1000);
  assert.equal(score(road,'M','m','2:17:26').score,1000);
});

test('all exact table thresholds round-trip, with strictly ordered time/score pairs',()=>{
  assert.equal(WA_SCORING_INFO.updatedAt,'2025-04-23');
  let count=0;
  for(const [gender,surfaces] of Object.entries(WA_SCORING_TABLES))for(const [type,events] of Object.entries(surfaces))for(const [event,table] of Object.entries(events)){
    assert.equal(table.at(-1)[1],1);
    let previous=[0,1401];
    for(const [centiseconds,points] of table){
      assert.ok(centiseconds>previous[0]);assert.ok(points<previous[1]);
      const time=(centiseconds/100).toFixed(2);
      assert.equal(score(type==='road'?road:track,gender,event,time).score,points,`${gender}/${type}/${event}/${time}`);
      previous=[centiseconds,points];count++;
    }
  }
  assert.ok(count>25000);
});
