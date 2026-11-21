import {isFinishedResult} from './performance-history.js';
import {performanceDate} from './record-check.js';

const pointsMissingAgeReasons=new Set(['missing-age','invalid-age','age-out-of-range','invalid-birth-date','invalid-birth-year']);
const pointsText=value=>typeof value==='string'?value:'';
const pointsSearchText=value=>pointsText(value).normalize('NFC').toLocaleLowerCase('nb-NO');
const pointsNameOrder=(first,second)=>first.name.localeCompare(second.name,'nb-NO')||first.athleteId.localeCompare(second.athleteId,'nb-NO');
const pointsAchievementOrder=(first,second)=>(first.date||'9999-12-31').localeCompare(second.date||'9999-12-31')||first.raceId.localeCompare(second.raceId)||first.distance.localeCompare(second.distance,'nb-NO')||first.time.localeCompare(second.time);

/**
 * Select each athlete's highest WA score inside the filters, highest first.
 * Both score columns always belong to that same selected performance.
 * Counters describe filtered, real, finished rows before selecting one per person.
 * Scores are supplied by the shared calculation pipeline; this function never
 * estimates age, recalculates points or mutates races, results or source data.
 */
export function selectPointsLeaderboard(races,filters={}){
  const selected=filters&&typeof filters==='object'?filters:{};
  const query=pointsSearchText(selected.query).trim(),year=String(selected.year??'');
  const bestByAthlete=new Map();
  let eligibleResults=0,missingAgeResults=0,unsupportedResults=0;
  for(const race of Array.isArray(races)?races:[]){
    if(!race)continue;
    const raceId=pointsText(race.id),raceName=pointsText(race.name);
    for(const result of Array.isArray(race.results)?race.results:[]){
      if(!result||!isFinishedResult(result))continue;
      const date=performanceDate(race,result)||'';
      if(year&&date.slice(0,4)!==year)continue;
      const athleteId=pointsText(result.athleteId).trim();
      if(!athleteId)continue;
      const ageGrade=result.ageGrade,waGrade=result.waScore,name=pointsText(result.name)||athleteId;
      const ageScore=ageGrade?.eligible===true&&Number.isFinite(ageGrade.score)&&ageGrade.score>0?ageGrade.score:null;
      const waScore=waGrade?.eligible===true&&Number.isInteger(waGrade.score)&&waGrade.score>0?waGrade.score:null;
      const gender=pointsText(result.gender)||pointsText(waGrade?.gender)||pointsText(result.category).slice(0,1);
      const distance=pointsText(result.distance);
      if(selected.gender&&gender!==selected.gender)continue;
      if(selected.distance&&distance!==selected.distance)continue;
      if(query&&!pointsSearchText(name).includes(query)&&!pointsSearchText(raceName).includes(query))continue;
      const score=waScore;
      if(score===null){
        unsupportedResults++;
        continue;
      }
      if(pointsMissingAgeReasons.has(ageGrade?.reason))missingAgeResults++;
      eligibleResults++;
      const row={athleteId,name,gender,score,waScore,ageScore,age:ageGrade?.age??null,ageBasis:ageGrade?.ageBasis??null,
        raceId,raceName,raceType:race.type,date,distance,time:pointsText(result.time),result};
      const previous=bestByAthlete.get(athleteId);
      if(!previous||row.score>previous.score||row.score===previous.score&&pointsAchievementOrder(row,previous)<0)bestByAthlete.set(athleteId,row);
    }
  }
  const rows=[...bestByAthlete.values()].sort((first,second)=>second.score-first.score||pointsNameOrder(first,second));
  return {rows,eligibleResults,athleteCount:rows.length,missingAgeResults,unsupportedResults};
}
