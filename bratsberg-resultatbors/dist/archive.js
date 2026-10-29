import {resultStatus} from './athlete-cards.js';
import {sortResultsByTime} from './result-order.js';

/** Filter the entire archive before choosing a page; never discard older races. */
export function selectArchivePage(races,filters={},requestedPage=1,{focusRaceId=null,pageSize=10}={}){
  const query=String(filters.query||'').trim().toLocaleLowerCase('nb-NO');
  const size=Number.isInteger(pageSize)&&pageSize>0?pageSize:10;
  const ordered=(Array.isArray(races)?races:[]).filter(race=>race.demo!==true).slice().sort((a,b)=>String(b.date).localeCompare(String(a.date))||a.id.localeCompare(b.id));
  const matches=ordered.map(race=>{
    const raceMatch=(race.name+' '+(race.location||'')).toLocaleLowerCase('nb-NO').includes(query);
    const matching=sortResultsByTime((race.results||[]).filter(result=>
      resultStatus(result)==='finished'&&
      (!filters.distance||result.distance===filters.distance)&&
      (!filters.gender||(result.gender||result.category?.[0])===filters.gender)&&
      (!filters.status||resultStatus(result)===filters.status)&&
      (!filters.onlyRecords||result.performanceHistory?.isPersonalBest||result.clubRecord)&&
      (!query||raceMatch||(result.name+' '+(result.sourceName||'')).toLocaleLowerCase('nb-NO').includes(query))));
    return {race,matching};
  }).filter(({race,matching})=>(!filters.year||race.date.startsWith(filters.year))&&matching.length);
  const total=matches.length,pageCount=Math.max(1,Math.ceil(total/size));
  let page=Number.isFinite(Number(requestedPage))?Math.floor(Number(requestedPage)):1;
  const focusIndex=focusRaceId?matches.findIndex(({race})=>race.id===focusRaceId):-1;
  if(focusIndex>=0)page=Math.floor(focusIndex/size)+1;
  page=Math.max(1,Math.min(page,pageCount));
  const start=(page-1)*size;
  return {items:matches.slice(start,start+size),page,pageCount,total,
    from:total?start+1:0,to:Math.min(start+size,total),
    resultCount:matches.reduce((sum,{matching})=>sum+matching.length,0)};
}
