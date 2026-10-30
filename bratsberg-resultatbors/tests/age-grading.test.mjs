import test from 'node:test';
import assert from 'node:assert/strict';
import {AGE_GRADE_TABLES,AGE_GRADING_INFO} from '../dist/age-standards.js';
import {calculateAgeGrade,resolveRaceAge,gradeRaceResult} from '../dist/age-grading.js';

const grade=extra=>calculateAgeGrade({age:30,gender:'M',distance:'10 km',time:'36:56',type:'road',...extra});
const near=(actual,expected)=>assert.ok(Math.abs(actual-expected)<1e-10,`${actual} != ${expected}`);

test('standards preserve the Kjapp snapshot, both sexes and all supported age boundaries',()=>{
  assert.equal(AGE_GRADING_INFO.edition,null);
  assert.equal(AGE_GRADING_INFO.upstreamLicense,'CC0-1.0');
  assert.equal(AGE_GRADING_INFO.sourceSha256,'56a54e0c58265d72810a7e08883b613650ebab39c4dbed1f3ba27fe74db8003b');
  const samples={
    K:{5:[1208,2520,6204,14424],20:[834,1729,3802,8161],45:[919,1860,4085,8306],100:[4929,12172,34043,124736]},
    M:{5:[1265,3122,5676,11900],20:[769,1589,3451,7293],45:[843,1710,3731,7719],100:[3720,7468,18154,37702]}
  };
  for(const gender of ['K','M']){
    assert.equal(AGE_GRADE_TABLES[gender].length,96);
    for(const [age,expected] of Object.entries(samples[gender]))assert.deepEqual(AGE_GRADE_TABLES[gender][Number(age)-5],expected);
    for(const row of AGE_GRADE_TABLES[gender]){
      assert.equal(row.length,4);
      assert.ok(row.every(v=>Number.isFinite(v)&&v>0));
      assert.ok(Object.isFrozen(row));
    }
  }
});

test('points equal 100 times the original Kjapp ratio; equivalents use the same age and sex',()=>{
  const result=grade();
  assert.equal(result.eligible,true);
  assert.equal(result.standardSeconds,1584);
  assert.equal(result.actualSeconds,2216);
  near(result.score,1584/2216*100);
  near(result.ratio,1584/2216);
  assert.equal(result.equivalentTimes.length,4);
  assert.deepEqual(result.equivalentTimes.map(e=>e.distance),['5 km','10 km','Halvmaraton','Maraton']);
  near(result.equivalentTimes[0].seconds,769/(1584/2216));
  assert.equal(result.equivalentTimes[0].time,'0:17:55');
  assert.equal(result.equivalentTimes[1].time,'0:36:56');
  assert.equal(grade({age:45,gender:'K',time:'31:00'}).score,100);
  assert.equal(grade({age:45,gender:'K',time:'15:30'}).score,200);
});

test('distance aliases and Norwegian fractions do not change the score',()=>{
  const aliases=[['5 km','5K','5000 m'],['10 km','10K','10000 m'],['Halvmaraton','HM','21.0975km'],['Maraton','M','42.195 km']];
  for(const group of aliases){
    const scores=group.map(distance=>grade({distance,time:'40:00,5'}).score);
    assert.ok(scores.every(score=>score===scores[0]));
  }
  assert.equal(grade({time:'36:56.5'}).score,grade({time:'36:56,5'}).score);
  assert.equal(grade({gender:'female'}).score,grade({gender:'K'}).score);
  assert.equal(grade({gender:'male'}).score,grade({gender:'M'}).score);
});

test('unsupported events and malformed input never create a score or extrapolated standard',()=>{
  const failures=[
    [{type:'trail'},'unsupported-discipline'],
    [{type:'track'},'unsupported-discipline'],
    [{distance:'3000 m'},'unsupported-distance'],
    [{distance:'Kvartmaraton'},'unsupported-distance'],
    [{gender:'X'},'unsupported-gender'],
    [{age:null},'missing-age'],
    [{age:'45'},'invalid-age'],
    [{age:45.5},'invalid-age'],
    [{age:4},'age-out-of-range'],
    [{age:101},'age-out-of-range'],
    [{time:'DNF'},'invalid-time'],
    [{time:'0:00'},'invalid-time'],
    [{time:'36:99'},'invalid-time']
  ];
  for(const [input,reason] of failures){
    const result=grade(input);
    assert.equal(result.eligible,false);
    assert.equal(result.score,null);
    assert.equal(result.reason,reason);
  }
  assert.equal(calculateAgeGrade().eligible,false);
});

test('birthdays use race day while birth year is clearly identified as calendar-year age',()=>{
  const athlete={birthDate:'1980-06-10',birthYear:1980};
  assert.deepEqual(resolveRaceAge({date:'2026-06-09'},{},athlete),{age:45,basis:'birth-date',reason:null});
  assert.deepEqual(resolveRaceAge({date:'2026-06-10'},{},athlete),{age:46,basis:'birth-date',reason:null});
  assert.deepEqual(resolveRaceAge({date:'2026-01-01'},{birthYear:1980}),{age:46,basis:'birth-year',reason:null});
  assert.deepEqual(resolveRaceAge({date:'2026-01-01'},{},{birthYear:1980}),{age:46,basis:'birth-year',reason:null});
  assert.deepEqual(resolveRaceAge({date:'2026-01-01'},{age:44},athlete),{age:44,basis:'result-age',reason:null});
  assert.equal(resolveRaceAge({date:'2026-02-28'},{},{birthDate:'1980-02-29'}).age,45);
  assert.equal(resolveRaceAge({date:'2026-03-01'},{},{birthDate:'1980-02-29'}).age,46);
});

test('age brackets are never silently replaced by a midpoint and invalid ages are not rescued',()=>{
  assert.deepEqual(resolveRaceAge({date:'2026-05-23'},{category:'M40-44'},{}),{age:null,basis:null,reason:'missing-age'});
  assert.equal(resolveRaceAge({date:'2026-05-23'},{},{birthDate:null}).reason,'missing-age');
  assert.equal(resolveRaceAge({date:'2026-05-23'},{age:'44'},{birthYear:1982}).reason,'invalid-age');
  assert.equal(resolveRaceAge({date:'2026-02-30'},{},{birthYear:1982}).reason,'invalid-race-date');
  assert.equal(resolveRaceAge({date:'2026-05-23'},{},{birthDate:'1982-02-30',birthYear:1982}).reason,'invalid-birth-date');
  assert.equal(resolveRaceAge({date:'2026-05-23'},{},{birthYear:'1982'}).reason,'invalid-birth-year');
  assert.equal(resolveRaceAge({date:'2026-05-23'},{},{birthYear:2025}).reason,'age-out-of-range');
  assert.equal(resolveRaceAge({date:'2026-05-23'},{},{birthDate:'2027-01-01'}).reason,'age-out-of-range');
});

test('race integration uses selected net timing and rejects unfinished or unsupported results',()=>{
  const race={date:'2026-03-29',type:'road',timeBasis:'net'};
  const result={distance:'Halvmaraton',gender:'M',time:'1:21:39',netTime:'1:21:03',age:30};
  const athlete={id:'test',birthYear:1996};
  const before=JSON.stringify({race,result,athlete});
  const output=gradeRaceResult(race,result,athlete);
  assert.equal(output.actualSeconds,4863);
  assert.equal(output.ageBasis,'result-age');
  near(output.score,3451/4863*100);
  for(const status of ['DNS','DNF','DSQ'])assert.equal(gradeRaceResult(race,{...result,status},athlete).eligible,false);
  assert.equal(gradeRaceResult({...race,type:'trail'},{...result,age:undefined},{}).reason,'unsupported-discipline');
  assert.equal(gradeRaceResult(race,{...result,age:undefined},{}).reason,'missing-age');
  assert.equal(gradeRaceResult({...race,demo:true},result,athlete).reason,'demo');
  assert.equal(JSON.stringify({race,result,athlete}),before);
});
