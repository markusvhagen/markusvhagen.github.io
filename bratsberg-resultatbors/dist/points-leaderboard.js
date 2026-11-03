import {isFinishedResult} from './performance-history.js';

const pointsMissingAgeReasons=new Set(['missing-age','invalid-age','age-out-of-range','invalid-birth-date','invalid-birth-year']);
const pointsText=value=>typeof value==='string'?value:'';
const pointsSearchText=value=>pointsText(value).normalize('NFC').toLocaleLowerCase('nb-NO');
const pointsNameOrder=(first,second)=>first.name.localeCompare(second.name,'nb-NO')||first.athleteId.localeCompare(second.athleteId,'nb-NO');
const pointsAchievementOrder=(first,second)=>(first.date||'9999-12-31').localeCompare(second.date||'9999-12-31')||first.raceId.localeCompare(second.raceId)||first.distance.localeCompare(second.distance,'nb-NO')||first.time.localeCompare(second.time);

/**
 * Select each athlete's highest unrounded score inside the active filters.
 * Default ordering is lowest first, so the highest scores appear at the bottom.
 * Counters describe filtered, real, finished rows before selecting one per person.
 * Scores are supplied by the shared age-grade pipeline; this function never
 * estimates age, recalculates points or mutates races, results or source data.
 */
export function selectPointsLeaderboard(races,filters={}){
  const selected=filters&&typeof filters==='object'?filters:{};
  const query=pointsSearchText(selected.query).trim(),year=String(selected.year??'');
  const bestByAthlete=new Map();
  let eligibleResults=0,missingAgeResults=0,unsupportedResults=0;
  for(const race of Array.isArray(races)?races:[]){
    if(!race||race.demo===true)continue;
    const raceId=pointsText(race.id),raceName=pointsText(race.name),date=pointsText(race.date);
    if(year&&date.slice(0,4)!==year)continue;
    for(const result of Array.isArray(race.results)?race.results:[]){
      if(!result||result.demo===true||!isFinishedResult(result))continue;
      const athleteId=pointsText(result.athleteId).trim();
      if(!athleteId)continue;
      const grade=result.ageGrade,name=pointsText(result.name)||athleteId;
      const gender=pointsText(result.gender)||pointsText(grade?.gender)||pointsText(result.category).slice(0,1);
      const distance=pointsText(result.distance);
      if(selected.gender&&gender!==selected.gender)continue;
      if(selected.distance&&distance!==selected.distance)continue;
      if(query&&!pointsSearchText(name).includes(query)&&!pointsSearchText(raceName).includes(query))continue;
      if(grade?.eligible!==true||!Number.isFinite(grade.score)||grade.score<=0){
        if(pointsMissingAgeReasons.has(grade?.reason))missingAgeResults++;
        else unsupportedResults++;
        continue;
      }
      eligibleResults++;
      const row={athleteId,name,gender,score:grade.score,age:grade.age??null,ageBasis:grade.ageBasis??null,
        raceId,raceName,date,distance,time:pointsText(result.time),result};
      const previous=bestByAthlete.get(athleteId);
      if(!previous||row.score>previous.score||row.score===previous.score&&pointsAchievementOrder(row,previous)<0)bestByAthlete.set(athleteId,row);
    }
  }
  const direction=selected.sort==='desc'?-1:1;
  const rows=[...bestByAthlete.values()].sort((first,second)=>direction*(first.score-second.score)||pointsNameOrder(first,second));
  return {rows,eligibleResults,athleteCount:rows.length,missingAgeResults,unsupportedResults};
}
