import test from 'node:test';
import assert from 'node:assert/strict';
import {renderAgeGrade,readBirthYearOverrides,writeBirthYearOverrides,validateBirthYear,compareAgeGradeResults} from '../dist/age-grade-ui.js';

const scored=(score,time='40:00')=>({time,ageGrade:{eligible:true,score,age:38,ageBasis:'birth-year'}});

test('scores sort highest first, with numeric time ties and missing grades last',()=>{
  const values=[{time:'10:00'},scored(74,'39:00'),scored(90,'1:01:00'),scored(90,'59:59'),scored(-10,'1:00'),scored(NaN,'2:00'),scored(Infinity,'3:00'),{time:'4:00',ageGrade:{eligible:false,score:1000}},scored(0,'5:00')];
  const original=[...values];
  const sorted=[...values].sort(compareAgeGradeResults);
  assert.deepEqual(sorted.slice(0,3),[values[3],values[2],values[1]]);
  assert.deepEqual(sorted.slice(3).map(row=>row.time),['1:00','2:00','3:00','4:00','5:00','10:00']);
  assert.deepEqual(values,original);
  assert.equal(compareAgeGradeResults(scored(80),scored(80)),0);
});

test('score row has one decimal, truthful year-age help, and escaped editing identifiers',()=>{
  const html=renderAgeGrade({...scored(76.249),athleteId:'runner\" onclick=\"bad'});
  assert.match(html,/<strong>76,2<\/strong> poeng/);
  assert.match(html,/100 poeng tilsvarer omtrent verdensrekordnivå/);
  assert.match(html,/Alder i løpsåret, beregnet fra fødselsår/);
  assert.match(html,/data-edit-birth-year="runner&quot; onclick=&quot;bad"/);
  assert.match(html,/>38 år<\/button>/);
  assert.doesNotMatch(html,/ onclick="bad/);
  assert.match(renderAgeGrade({...scored(105.4),athleteId:'runner'}),/<strong>105,4<\/strong>/);
});

test('missing age does not invent points; unsupported events do not offer an irrelevant age edit',()=>{
  const missing=renderAgeGrade({athleteId:'runner',category:'M40-44',ageGrade:{eligible:false,reason:'missing-age'}});
  assert.match(missing,/<strong>—<\/strong> poeng/);
  assert.match(missing,/Legg inn alder/);
  assert.doesNotMatch(missing,/>42 år|>0[,<]/);
  for(const reason of ['unsupported-distance','unsupported-discipline','unsupported-gender','not-finished','invalid-time','demo']){
    const html=renderAgeGrade({athleteId:'runner',ageGrade:{eligible:false,reason}});
    assert.match(html,/Ikke beregnet/);
    assert.doesNotMatch(html,/<button/);
  }
  assert.doesNotMatch(renderAgeGrade(scored(70)),/<button/);
  assert.match(renderAgeGrade({athleteId:'runner',ageGrade:{eligible:false,reason:'age-out-of-range'}}),/Legg inn alder/);
});

test('birth year validation requires integer years and supported calendar-year ages',()=>{
  assert.equal(validateBirthYear(1986,2026),true);
  assert.equal(validateBirthYear(2021,2026),true);
  assert.equal(validateBirthYear(1926,2026),true);
  for(const year of [2022,1925,'1986',1986.5,NaN,Infinity,1800,2200,null])assert.equal(validateBirthYear(year,2026),false);
  assert.equal(validateBirthYear(1986,'2026'),false);
});

test('local overrides filter malformed values and cannot pollute prototypes',()=>{
  let saved,key;
  const storage={getItem:()=>'{"runner":1986,"child":2020,"__proto__":{"polluted":true},"constructor":1990,"prototype":2000,"x":null,"y":"1980","z":1700}',setItem:(k,v)=>{key=k;saved=v;}};
  const read=readBirthYearOverrides(storage);
  assert.equal(Object.getPrototypeOf(read),null);
  assert.deepEqual({...read},{runner:1986,child:2020});
  assert.equal({}.polluted,undefined);
  assert.equal(writeBirthYearOverrides({...read,'bad id':1970,invalid:NaN},storage),true);
  assert.equal(key,'bratsberg-birth-year-overrides-v1');
  assert.deepEqual(JSON.parse(saved),{runner:1986,child:2020});
  for(const value of ['invalid','null','[]','"text"'])assert.deepEqual({...readBirthYearOverrides({getItem:()=>value})},{});
});

test('blocked or missing browser storage never prevents results from rendering',()=>{
  const blocked={getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}};
  assert.deepEqual({...readBirthYearOverrides(blocked)},{});
  assert.deepEqual({...readBirthYearOverrides(null)},{});
  assert.equal(writeBirthYearOverrides({runner:1986},blocked),false);
  assert.equal(writeBirthYearOverrides({runner:1986},null),false);
  const prior=Object.getOwnPropertyDescriptor(globalThis,'localStorage');
  try{
    Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('denied');}});
    assert.deepEqual({...readBirthYearOverrides()},{});
    assert.equal(writeBirthYearOverrides({runner:1986}),false);
  }finally{
    if(prior)Object.defineProperty(globalThis,'localStorage',prior);else delete globalThis.localStorage;
  }
});
