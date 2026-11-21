import test from 'node:test';
import assert from 'node:assert/strict';
import {displayTime} from '../dist/display-format.js';
import {renderAthleteCard} from '../dist/athlete-cards.js';
import {renderRaceWinners} from '../dist/race-extras.js';
import {selectPointsLeaderboard} from '../dist/points-leaderboard.js';
import {renderPointsTable} from '../dist/points-view.js';

test('track keeps source precision and all other surfaces floor displayed seconds',()=>{
  assert.equal(displayTime('35:24.00',undefined,'track'),'35:24.00');
  assert.equal(displayTime('12.70',undefined,'track'),'12.70');
  assert.equal(displayTime('2:17,04',undefined,'track'),'2:17,04');
  assert.equal(displayTime('00:09:51.09',undefined,'track'),'9:51.09');
  for(const type of ['road','trail',undefined]){
    assert.equal(displayTime('37:33.9',undefined,type),'37:33');
    assert.equal(displayTime('1:19:17,99',undefined,type),'1:19:17');
  }
  assert.equal(displayTime('37:34','37:33.6','road'),'37:33');
  assert.equal(displayTime('9:52','9:51.09','track'),'9:51.09');
  assert.equal(displayTime('35:24.00','DNF','track'),'35:24.00');
  assert.equal(displayTime('DNF',undefined,'track'),'—');
});

test('athlete cards and record tooltips use the race surface without changing source times',()=>{
  const result={athleteId:'runner',name:'Test Runner',time:'35:24.00',distance:'10000 m',status:'finished',
    clubRecord:true,clubRecordTime:'35:24.00'};
  const track=renderAthleteCard(result,{}, {raceType:'track'});
  const road=renderAthleteCard(result,{}, {raceType:'road'});
  assert.match(track,/athlete-card-time">35:24\.00</);
  assert.match(track,/Bekreftet klubbrekord: 35:24\.00/);
  assert.match(road,/athlete-card-time">35:24</);
  assert.doesNotMatch(road,/35:24\.00/);
  assert.equal(result.time,'35:24.00');
});

test('race winners preserve indoor and outdoor track precision but floor road times',()=>{
  const race={id:'race',name:'Test race',distances:['3000 m'],winners:[{
    distance:'3000 m',men:{name:'Test Runner',time:'9:51.09',verified:true},women:{applicable:false}
  }]};
  for(const environment of ['indoor','outdoor'])assert.match(renderRaceWinners({...race,type:'track',environment}),/<strong>9:51\.09<\/strong>/);
  assert.match(renderRaceWinners({...race,type:'road'}),/<strong>9:51<\/strong>/);
  assert.equal(race.winners[0].men.time,'9:51.09');
});

test('points table carries race surface and retains raw timing for score selection',()=>{
  const race=type=>({id:type,name:type,type,date:'2026-11-21',results:[{
    athleteId:type,name:type,gender:'M',distance:'3000 m',time:'9:51.09',status:'finished',
    waScore:{eligible:true,score:700,gender:'M'},ageGrade:{eligible:false,reason:'missing-age'}
  }]});
  const races=[race('track'),race('road')],view=selectPointsLeaderboard(races);
  assert.equal(view.rows.find(row=>row.athleteId==='track').raceType,'track');
  const table=renderPointsTable(view);
  assert.match(table,/<strong class="points-result-time">9:51\.09<\/strong>/);
  assert.match(table,/<strong class="points-result-time">9:51<\/strong>/);
  assert.equal(races[0].results[0].time,'9:51.09');
  assert.equal(view.rows[0].waScore,700);
});
