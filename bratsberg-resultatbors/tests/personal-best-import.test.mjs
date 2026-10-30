import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,copyFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
import {prepareResultsData} from '../dist/data.js';
import {renderAthleteCard} from '../dist/athlete-cards.js';

test('new-race CLI and public pipeline share athlete aliases, manual baselines and validation',async()=>{
  const root=await mkdtemp(join(tmpdir(),'bratsberg-pb-import-'));
  try{
    await mkdir(join(root,'dist/data'),{recursive:true});
    await mkdir(join(root,'scripts'));
    for(const path of ['dist/athlete-registry.js','dist/performance-history.js','dist/record-check.js','scripts/check-personal-bests.mjs']){
      await copyFile(new URL('../'+path,import.meta.url),join(root,path));
    }
    const athlete={id:'test-runner',name:'Test Løper',aliases:['Testløper'],personalBests:[{type:'road',distance:'Halvmaraton',time:'1:25:00',date:'2025-09-14'}]};
    const athletes={athletes:[athlete]};
    const race={id:'new-race',name:'Testløp',date:'2026-09-20',type:'road',timeBasis:'net',distances:['Halvmaraton'],results:[{name:'Testløper',distance:'Halvmaraton',gender:'K',category:'K35-39',time:'1:25:30',netTime:'1:24:30',status:'finished'}]};
    const writeJSON=(path,value)=>writeFile(join(root,path),JSON.stringify(value));
    await writeJSON('dist/data/index.json',{races:[],athletes:'data/athletes.json'});
    await writeJSON('dist/data/athletes.json',athletes);
    await writeJSON('new-race.json',race);
    const run=()=>spawnSync(process.execPath,[join(root,'scripts/check-personal-bests.mjs'),join(root,'new-race.json')],{encoding:'utf8'});
    const first=run();
    assert.equal(first.status,0,first.stderr);
    const report=JSON.parse(first.stdout);
    assert.equal(report.personalBestImprovements,1);
    assert.equal(report.manualPersonalBestsChecked,1);
    assert.deepEqual(report.personalBestIssues,[]);
    assert.equal(report.performances[0].previousBest,'1:25:00');
    const input={races:[race],athletes,records:[]},snapshot=JSON.stringify(input);
    const view=prepareResultsData(input),performance=view.races[0].results[0];
    assert.equal(performance.performanceHistory.isPersonalBest,true);
    assert.equal(performance.performanceHistory.previousBest,report.performances[0].previousBest);
    assert.equal(performance.time,'1:24:30');
    assert.equal(performance.athleteId,'test-runner');
    assert.equal(view.races[0].results.length,1);
    assert.equal(JSON.stringify(input),snapshot);
    const card=renderAthleteCard(performance);
    assert.match(card,/badge pb/);
    assert.match(card,/manuelt registrerte perser/);
    assert.match(card,/>K35-39</);
    assert.doesNotMatch(card,/athlete-card-improvement|−30 s/);

    athlete.personalBests[0].date='2025-02-30';
    await writeJSON('dist/data/athletes.json',athletes);
    const invalid=run();
    assert.equal(invalid.status,1);
    const invalidReport=JSON.parse(invalid.stdout);
    assert.equal(invalidReport.personalBestImprovements,0);
    assert.equal(invalidReport.personalBestIssues.length,1);
    const invalidView=prepareResultsData(input);
    assert.deepEqual(invalidView.personalBestIssues,invalidReport.personalBestIssues);
    assert.doesNotMatch(renderAthleteCard(invalidView.races[0].results[0]),/badge pb/);
  }finally{
    await rm(root,{recursive:true,force:true});
  }
});
