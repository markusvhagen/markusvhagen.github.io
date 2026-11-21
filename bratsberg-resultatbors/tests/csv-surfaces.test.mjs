import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {derivePerformanceHistory} from '../dist/performance-history.js';

test('reviewed CSV road and track references remain separate in both directions',async()=>{
  const athletes=JSON.parse(await readFile(new URL('../dist/data/athletes.json',import.meta.url),'utf8'));
  const h=(athleteId,type,distance,time,environment)=>derivePerformanceHistory([{
    id:'surface-regression',date:'2026-11-21',type,...(environment?{environment}:{}),
    results:[{athleteId,distance,time,status:'finished'}]
  }],athletes)[0].results[0].performanceHistory;
  assert.equal(h('magnus-cato-andersen','road','5 km','15:50').isPersonalBest,false);
  assert.equal(h('magnus-cato-andersen','track','5000 m','15:50','outdoor').isPersonalBest,true);
  assert.equal(h('magnus-cato-andersen','road','10 km','32:36.35').hasManualBaseline,false);
  assert.equal(h('magnus-cato-andersen','track','10000 m','32:36.35','outdoor').isPersonalBest,true);
  assert.equal(h('anders-aamodt-resell','road','10 km','33:07').hasManualBaseline,false);
  assert.equal(h('anders-aamodt-resell','track','10000 m','33:07','outdoor').isPersonalBest,true);
  assert.equal(h('vibeke-jensen','road','5 km','16:29').hasManualBaseline,false);
  assert.equal(h('vibeke-jensen','track','5000 m','16:29','outdoor').isPersonalBest,true);
  assert.equal(h('simen-haugland','road','5 km','18:29').isPersonalBest,true);
  assert.equal(h('simen-haugland','track','5000 m','18:29','outdoor').hasManualBaseline,false);
  assert.equal(h('trond-sliper','road','5 km','16:38').isPersonalBest,true);
  assert.equal(h('trond-sliper','track','5000 m','16:38','outdoor').hasManualBaseline,false);
});

test('road submissions use whole seconds for PB while preserving the measured source',async()=>{
  const athletes=JSON.parse(await readFile(new URL('../dist/data/athletes.json',import.meta.url),'utf8'));
  for(const [time,expected] of [['37:07.9',true],['37:08',false]]){
    const row=derivePerformanceHistory([{
      id:'precision-regression',date:'2026-11-21',type:'road',
      results:[{athleteId:'mads-holmefjord-lund',distance:'10 km',time,status:'finished'}]
    }],athletes)[0].results[0];
    assert.equal(row.time,time);
    assert.equal(row.performanceHistory.manualBaseline,'37:07');
    assert.equal(row.performanceHistory.isPersonalBest,expected,time);
  }
});

test('user-confirmed Trond, Øivind and Vemund references use the agreed surfaces and precision',async()=>{
  const athletes=JSON.parse(await readFile(new URL('../dist/data/athletes.json',import.meta.url),'utf8'));
  const h=(athleteId,type,distance,time,environment)=>derivePerformanceHistory([{
    id:'confirmed-surface-regression',date:'2026-11-21',type,...(environment?{environment}:{}),
    results:[{athleteId,distance,time,status:'finished'}]
  }],athletes)[0].results[0].performanceHistory;
  assert.equal(h('trond-sliper','road','10 km','35:12.9').isPersonalBest,true);
  assert.equal(h('trond-sliper','road','10 km','35:13').isPersonalBest,false);
  assert.equal(h('trond-sliper','track','10000 m','35:24.00','indoor').isManualPersonalBest,true);
  assert.equal(h('trond-sliper','track','10000 m','35:24.01','outdoor').isPersonalBest,false);
  assert.equal(h('trond-sliper','road','1 mile','4:59.9').isManualPersonalBest,true);
  assert.equal(h('oivind-estensen','track','3000 m','10:00.01','indoor').isManualPersonalBest,true);
  assert.equal(h('oivind-estensen','track','3000 m','10:00.02','outdoor').isPersonalBest,false);
  assert.equal(h('oivind-estensen','road','3 km','10:00').hasManualBaseline,false);
  for(const [road,track,time] of [['3 km','3000 m','8:48'],['5 km','5000 m','15:01'],['10 km','10000 m','30:51']]){
    assert.equal(h('vemund-gurholt','road',road,time).isManualPersonalBest,true,road);
    for(const environment of ['indoor','outdoor'])assert.equal(h('vemund-gurholt','track',track,time,environment).isManualPersonalBest,true,track+' '+environment);
  }
});
