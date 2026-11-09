import {parsePerformanceTime} from './record-check.js';

/** Display whole seconds from the selected timing basis, without rounding. */
export function displayTime(officialTime, measuredTime) {
  const value = parsePerformanceTime(measuredTime) === null ? officialTime : measuredTime;
  if (parsePerformanceTime(value) === null) return '—';

  const fields = value.trim().replace(/[.,]\d+$/, '').split(':');
  if (fields.length === 3 && Number(fields[0]) === 0) fields.shift();
  fields[0] = String(Number(fields[0]));
  return fields.join(':');
}

const wholePointFormatter = new Intl.NumberFormat('nb-NO', {maximumFractionDigits: 0});

export function displayPoints(score) {
  return Number.isFinite(score) ? wholePointFormatter.format(Math.trunc(score)) : '—';
}
