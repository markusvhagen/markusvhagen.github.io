import test from 'node:test';
import assert from 'node:assert/strict';
import {selectWidgetHighlights,selectWidgetRaces,createWidgetSlots,renderWidgetPlaceholder} from '../dist/widget.js';

test('only actual races appear, ordered newest first without mutating the archive',()=>{
  const races=[
    {id:'example-old',demo:true,date:'2026-09-07'},
    {id:'actual-old',demo:false,date:'2026-09-06'},
    {id:'example-new',demo:true,date:'2026-10-20'},
    {id:'actual-new',demo:false,date:'2026-10-01'}
  ];
  const original=structuredClone(races);
  assert.deepEqual(selectWidgetRaces(races).map(r=>r.id),['actual-new','actual-old']);
  assert.deepEqual(races,original);
  assert.equal(selectWidgetRaces(Array.from({length:12},(_,i)=>({id:i,demo:false,date:'2026-10-01'}))).length,10);
});

test('the ribbon has ten slots but placeholders never add records to the archive',()=>{
  const races=[{id:'one',demo:false,date:'2026-01-01'},{id:'two',demo:false,date:'2026-02-01'}];
  const original=structuredClone(races),slots=createWidgetSlots(races);
  assert.equal(slots.length,10);
  assert.deepEqual(slots.slice(0,2).map(race=>race.id),['two','one']);
  assert.equal(slots.filter(race=>race===null).length,8);
  assert.deepEqual(races,original);
  assert.deepEqual(createWidgetSlots([]),Array(10).fill(null));
  assert.deepEqual(createWidgetSlots(undefined),Array(10).fill(null));
  const full=createWidgetSlots(Array.from({length:12},(_,i)=>({id:i,demo:false,date:`2026-10-${String(i+1).padStart(2,'0')}`})));
  assert.deepEqual(full.map(r=>r.id),[11,10,9,8,7,6,5,4,3,2]);
});

test('placeholder cards have no navigation, fabricated dates, or athlete results',()=>{
  const html=renderWidgetPlaceholder();
  assert.match(html,/Her kommer det flere løp snart/);
  assert.doesNotMatch(html,/<a\b|<button\b|tabindex|href=|datetime=|athlete-card/);
});

test('awards determine all six highlights even when an old featured list disagrees',()=>{
  const result=(id,time,rank,extra={})=>({athleteId:id,time,gender:'K',positionGender:rank,positionGenderVerified:true,...extra});
  const results=[
    result('ordinary','15:00',8),
    result('bronze','18:00',3),
    result('silver','19:00',2),
    result('gold-slower','1:20:00',1),
    result('record','2:30:00',5,{clubRecord:true}),
    result('gold-faster','20:00',1),
    result('other-slower','22:00',9)
  ];
  const original=structuredClone(results);
  const selected=selectWidgetHighlights({results,featuredAthleteIds:['ordinary','other-slower','bronze']});
  assert.deepEqual(selected.map(r=>r.athleteId),['record','gold-faster','gold-slower','silver','bronze','ordinary']);
  assert.deepEqual(results,original);
});

test('only the same verified gender podiums as the rendered cards receive priority',()=>{
  const results=[
    {athleteId:'overall',time:'11:00',gender:'M',position:1,positionScope:'overall'},
    {athleteId:'class',time:'12:00',gender:'K',position:1,positionScope:'class'},
    {athleteId:'unverified',time:'13:00',gender:'M',positionGender:1,positionGenderVerified:false},
    {athleteId:'unknown-gender',time:'14:00',positionGender:1,positionGenderVerified:true},
    {athleteId:'gender-scoped',time:'16:00',category:'M35-39',position:2,positionScope:'gender'},
    {athleteId:'verified',time:'17:00',gender:'K',positionGender:1,positionGenderVerified:true}
  ];
  assert.deepEqual(selectWidgetHighlights({results}).map(r=>r.athleteId),['verified','gender-scoped','overall','class','unverified','unknown-gender']);
});

test('non-finishers and malformed times never become highlights, even with awards',()=>{
  const results=[
    {athleteId:'dns',time:'DNS',status:'DNS',clubRecord:true},
    {athleteId:'dnf',time:'32:10',status:'DNF',clubRecord:true},
    {athleteId:'invalid',time:'1:99:00',clubRecord:true},
    {athleteId:'finished',time:'32:11',status:'finished'},
    {athleteId:'legacy',time:'32:12'}
  ];
  assert.deepEqual(selectWidgetHighlights({results,featuredAthleteIds:['dns','dnf','invalid','finished']}).map(r=>r.athleteId),['finished','legacy']);
});

test('six distinct athletes are selected; each keeps their highest-priority performance',()=>{
  const results=[
    {athleteId:'repeat',time:'14:00'},
    {athleteId:'repeat',time:'30:00',clubRecord:true},
    ...Array.from({length:8},(_,index)=>({athleteId:String(index),time:'20:00'}))
  ];
  const selected=selectWidgetHighlights({results});
  assert.deepEqual(selected.map(r=>r.athleteId),['repeat','0','1','2','3','4']);
  assert.equal(selected[0].time,'30:00');
  assert.equal(results.length,10);
});

test('numeric times order each tier; ties are stable and PB is not an extra priority',()=>{
  const results=[
    {athleteId:'pb',time:'22:00',performanceHistory:{isPersonalBest:true}},
    {athleteId:'decimal',time:'9:59,90'},
    {athleteId:'longer',time:'10:00'},
    {athleteId:'equal-first',time:'18:00'},
    {athleteId:'equal-second',time:'18:00'},
    {athleteId:'record',time:'33:00',clubRecord:true}
  ];
  assert.deepEqual(selectWidgetHighlights({results}).map(r=>r.athleteId),['record','decimal','longer','equal-first','equal-second','pb']);
  assert.deepEqual(selectWidgetHighlights({results:[]}),[]);
  assert.deepEqual(selectWidgetHighlights({}),[]);
  assert.equal(selectWidgetHighlights({results:[{name:'A',time:'20:00'},{name:'B',time:'20:00'}]}).length,2);
});
