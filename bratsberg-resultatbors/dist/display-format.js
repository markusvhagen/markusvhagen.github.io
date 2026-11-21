import {parsePerformanceTime} from './record-check.js';

/** Preserve track precision; truncate all other displayed times to whole seconds. */
export function displayTime(officialTime, measuredTime, raceType) {
  const value = parsePerformanceTime(measuredTime) === null ? officialTime : measuredTime;
  if (parsePerformanceTime(value) === null) return '—';

  const text = raceType === 'track' ? value.trim() : value.trim().replace(/[.,]\d+$/, '');
  const fields = text.split(':');
  if (fields.length === 3 && Number(fields[0]) === 0) fields.shift();
  fields[0] = fields[0].replace(/^0+(?=\d)/, '');
  return fields.join(':');
}

const pointFormatter = new Intl.NumberFormat('nb-NO', {
  minimumFractionDigits: 1,
  maximumFractionDigits: 1
});

export function displayPoints(score) {
  return Number.isFinite(score) ? pointFormatter.format(score) : '—';
}
