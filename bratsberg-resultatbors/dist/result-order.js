import {parsePerformanceTime} from './record-check.js';

/** Compare elapsed times numerically, including H:MM:SS and decimal seconds. */
export function compareResultTimes(a,b){
  const first=parsePerformanceTime(a?.time)??Infinity;
  const second=parsePerformanceTime(b?.time)??Infinity;
  return first===second?0:first<second?-1:1;
}

/** Sorting is presentation-only; equal times retain their original order. */
export function sortResultsByTime(results){
  return (Array.isArray(results)?[...results]:[]).sort(compareResultTimes);
}
