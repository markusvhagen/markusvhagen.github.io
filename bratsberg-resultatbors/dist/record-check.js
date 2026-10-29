/** Return elapsed seconds, or null for malformed / non-finish values.
 * Supports Norwegian decimal commas, decimal points, M:SS and H:MM:SS.
 * Colon-separated fields after the first must be in [0, 60).
 */
export function parsePerformanceTime(value) {
  if (typeof value !== 'string') return null;
  const text = value.trim().replace(',', '.');
  if (!/^(?:\d+:){0,2}\d+(?:\.\d+)?$/.test(text)) return null;
  const parts = text.split(':');
  if (parts.length > 1 && parts.slice(1).some(part => Number(part) >= 60)) return null;
  const seconds = parts.reduce((total, part) => total * 60 + Number(part), 0);
  return Number.isFinite(seconds) && seconds > 0 ? seconds : null;
}

/** Normalize event names only within an explicitly known race surface/type.
 * A road 5 km and a track 5 000 m remain different records through category.
 * Unknown, trail, indoor and unsupported events are intentionally not matched.
 */
export function normalizeDistance(distance, type) {
  if (typeof distance !== 'string' || !['track', 'road'].includes(type)) return null;
  const normalized = distance.toLowerCase().trim().replace(/\s+/g, '').replace(',', '.');
  if (type === 'track') {
    if (['3000mh', '3000mhinder', '3000msteeplechase', '3kmhinder', '3kmsteeplechase'].includes(normalized)) return '3000mh';
    const matches = normalized.match(/^(800|1500|2000|3000|5000|10000)m$/);
    if (matches) return matches[1] + 'm';
    const km = normalized.match(/^(0\.8|1\.5|2|3|5|10)km$/);
    return km ? String(Number(km[1]) * 1000) + 'm' : null;
  }
  const roadNames = {
    '5km':'5km', '5000m':'5km', '10km':'10km', '10000m':'10km',
    'halvmaraton':'half', 'halfmarathon':'half', 'half':'half', '21.0975km':'half', '21097.5m':'half',
    'maraton':'marathon', 'marathon':'marathon', '42.195km':'marathon', '42195m':'marathon'
  };
  return roadNames[normalized] ?? null;
}

/** Find review candidates without changing the official club-record array.
 * The scraper must explicitly assert both real data and record eligibility.
 * recordEligible covers membership, course/certification, event classification,
 * timing and any applicable conditions; this UI cannot establish those facts.
 * Track candidates also require race.environment === 'outdoor', so an indoor
 * result cannot be silently compared to the outdoor-only record collection.
 */
export function findRecordCandidates(races, records) {
  if (!Array.isArray(races) || !Array.isArray(records)) return [];
  const recordMap = new Map(records.map(record => [
    `${record.category}|${record.gender}|${record.discipline}`, record
  ]));
  const candidates = [];
  for (const race of races) {
    if (!race || race.demo !== false || !['track', 'road'].includes(race.type)) continue;
    if (race.type === 'track' && race.environment !== 'outdoor') continue;
    if (!Array.isArray(race.results)) continue;
    for (const result of race.results) {
      if (!result || result.recordEligible !== true || result.demo === true) continue;
      if (!['K','M'].includes(result.gender)) continue;
      if (result.status && !['OK','FINISHED','VALID'].includes(String(result.status).trim().toUpperCase())) continue;
      if (race.verified === false || result.verified === false) continue;
      const discipline = normalizeDistance(result.distance, race.type);
      if (!discipline) continue;
      const record = recordMap.get(`${race.type}|${result.gender}|${discipline}`);
      if (!record) continue;
      const seconds = parsePerformanceTime(result.time);
      if (seconds === null) continue;
      const isFirstRecord = record.status === 'unlisted' && record.time === null;
      const previousSeconds = parsePerformanceTime(record.time);
      if (!isFirstRecord && (previousSeconds === null || seconds >= previousSeconds)) continue;
      candidates.push({
        record, race, result, seconds, previousSeconds, isFirstRecord,
        improvementSeconds: previousSeconds === null ? null : previousSeconds - seconds
      });
    }
  }
  return candidates;
}
