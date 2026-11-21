#!/usr/bin/env python3
"""Apply the user's explicit 21 November clarifications to the reviewed CSV.

One-time migration from package v41. Original CSV fields and all race results
are preserved. The accompanying report records every added/corrected reference.
"""
from pathlib import Path
from copy import deepcopy
from collections import Counter
import json
import math
import re

PROJECT = Path(__file__).resolve().parents[1]
PATH = PROJECT / 'dist/data/athletes.json'
DATE = '2026-11-21'
registry = json.loads(PATH.read_text())
before = deepcopy(registry)
assert not any(a.get('manualPbUserClarification') for a in registry['athletes']), 'Already applied'
races = [json.loads(p.read_text()) for p in (PROJECT / 'dist/data/races').glob('*.json')]
added, corrections = [], []


def normalized_distance(value):
    return re.sub(r'\s+', '', value.lower()).replace('10000m', '10km').replace('5000m', '5km')


def seconds(value):
    total = 0
    for part in value.replace(',', '.').split(':'):
        total = total * 60 + float(part)
    return total


def evidence_for(athlete, typ, distance, source_time):
    evidence = []
    for race in races:
        if race['type'] != typ:
            continue
        for result in race['results']:
            value = result.get('netTime') if result.get('timeBasis', race.get('timeBasis')) == 'net' and result.get('netTime') else result.get('time')
            if result.get('athleteId') == athlete['id'] and normalized_distance(result['distance']) == normalized_distance(distance) and value == source_time:
                evidence.append({'raceId': race['id'], 'date': race['date'], 'time': value,
                                 'sourceUrl': result.get('sourceUrl') or race.get('sourceUrl')})
    for pb in athlete.get('worldAthletics', {}).get('performances', []):
        if pb['type'] == typ and normalized_distance(pb['distance']) == normalized_distance(distance) and pb['time'] == source_time:
            evidence.append({'sourceProvider': 'world-athletics', 'time': pb['time'],
                             'date': pb.get('date'), 'sourceUrl': pb['sourceUrl']})
    assert evidence, (athlete['id'], distance, source_time, 'missing source')
    return evidence


for athlete in registry['athletes']:
    for submission in athlete.get('manualPbSubmissions', []):
        for field in submission['fields']:
            for point in field['performances']:
                if point['status'] != 'needs-review':
                    continue
                original = deepcopy(point)
                time = point.get('time')
                distance = point['distance']
                typ = point['type']
                course = None
                explanation = 'Brukeren bekreftet bane; innendørs og utendørs har felles PB-klasse.'
                if athlete['id'] == 'vemund-gurholt':
                    assert distance in ['3000 m', '5000 m', '10000 m']
                    variants = [('track', distance), ('road', {'3000 m': '3 km', '5000 m': '5 km', '10000 m': '10 km'}[distance])]
                    explanation = 'Brukeren bekreftet tiden og godkjente uttrykkelig samme referanse for Vemund på både bane og gate.'
                else:
                    if athlete['id'] == 'trond-sliper' and distance == '10000 m':
                        if time == '35:12':
                            typ, distance = 'road', '10 km'
                        else:
                            assert time == '35:24'
                            typ, time = 'track', '35:24.00'
                        explanation = 'Brukeren avklarte Tronds 10 km gate til 35:12 og 10000 m bane til 35:24.00.'
                    elif athlete['id'] == 'trond-sliper' and distance == '1 mile':
                        typ = 'road'
                        explanation = 'Brukeren bekreftet engelsk mil (1609,344 m) gate på 4:59.'
                    elif athlete['id'] == 'vidar-bjornas':
                        typ, distance = 'road', '10 km'
                        explanation = 'Brukeren bekreftet 30:41 som Vidar Bjørnås sin 10 km gate; ingen ny WA-identitet er koblet.'
                    elif athlete['id'] == 'michael-brian-watts' and distance in ['Halvmaraton', 'Maraton']:
                        typ = 'road'
                        time = {'Halvmaraton': '1:14:46', 'Maraton': '2:42:15'}[distance]
                        explanation = 'Brukeren supplerte Michael Brian Watts sine manglende sekunder.'
                    elif typ == 'trail':
                        assert distance in ['Birkebeinerløpet', 'Løpebirken']
                        course, distance = 'birkebeinerlopet', 'Birkebeinerløpet'
                        explanation = 'Brukeren godkjente Birkebeinerløpet/Løpebirken som egen PB-klasse på tvers av år.'
                    else:
                        assert typ == 'track' or (typ == 'combined' and distance == '3000 m'), (athlete['id'], point)
                        typ = 'track'
                    variants = [(typ, distance)]
                classification = {'status': 'user-confirmed', 'checkedAt': DATE, 'basis': explanation}
                indexes = []
                references = []
                for typ, distance in variants:
                    pb = {'type': typ, 'distance': distance, 'time': time, 'date': None, 'asOf': submission['asOf'],
                          'source': 'PB fra CSV-skjemaet, avklart og bekreftet av brukeren 21.11.2026.',
                          'sourceFile': submission['sourceFile'], 'sourceLibraryFileId': submission['sourceLibraryFileId'],
                          'sourceRow': submission['sourceRow'], 'sourceColumn': field['column'], 'rawValue': field['rawValue'],
                          'evidenceKind': 'athlete-submitted-personal-best', 'userApproved': True,
                          'approvedAt': DATE, 'importedAt': DATE, 'classification': deepcopy(classification)}
                    if course:
                        pb['courseId'] = course
                    if len(variants) > 1:
                        pb['crossSurfaceApproval'] = {'approvedAt': DATE, 'scope': 'vemund-gurholt-only', 'distances': ['3000 m / 3 km', '5000 m / 5 km', '10000 m / 10 km']}
                    indexes.append(len(athlete['personalBests']))
                    athlete['personalBests'].append(pb)
                    references.append(deepcopy(pb))
                point.update(status='imported', resolvedTime=time, resolvedType=variants[0][0],
                             resolvedDistance=variants[0][1], personalBestIndex=indexes[0],
                             classification=classification)
                if len(indexes) > 1:
                    point.update(personalBestIndexes=indexes, resolvedTypes=['track', 'road'])
                if course:
                    point['resolvedCourseId'] = course
                for key in ['reason', 'normalizationNeedsConfirmation']:
                    point.pop(key, None)
                added.append({'athleteId': athlete['id'], 'name': athlete['name'], 'sourceRow': submission['sourceRow'],
                              'column': field['column'], 'rawValue': field['rawValue'], 'previous': original,
                              'personalBestIndexes': indexes, 'references': references})
            if field['performances']:
                assert all(p['status'] != 'needs-review' for p in field['performances'])
                field['status'] = 'imported-or-confirmed'
        athlete['personalBestReviewBlocks'] = []
        athlete['manualPbUserClarification'] = {'confirmedAt': DATE, 'report': 'manual-pb-user-clarifications-2026-11-21.json',
            'policy': 'Alle avvik er avklart. Bane har felles inne/ute-PB; gate holdes separat. Ikke-banetider sammenlignes nedrundet til hele sekunder. Vemunds 3/5/10 km har uttrykkelig unntak for begge underlag.'}

# Explicitly approved replacements from the 16-item discrepancy list. Source
# precision is retained for track; outside track the approved PB uses floor.
decisions = [
    ('ingvild-saksvik-lehouillier', 'road', 'Halvmaraton', '1:30:18', '1:30:17', '1:30:17'),
    ('jorgen-skevik', 'road', 'Maraton', '2:33:34', '2:33:23', '2:33:23'),
    ('rune-lysgard-fagerheim', 'road', '10 km', '37:50', '37:48', '37:48'),
    ('tor-magne-volden', 'road', '10 km', '37:34', '37:33.6', '37:33'),
    ('mads-holmefjord-lund', 'road', '10 km', '37:07', '37:07.2', '37:07'),
    ('iris-roe-kalafati', 'road', '10 km', '39:30', '39:30.1', '39:30'),
    ('ane-korsvold', 'road', '10 km', '39:27', '39:27.5', '39:27'),
    ('stian-granheim-skaland', 'road', '10 km', '34:44', '34:44.9', '34:44'),
    ('kjell-marius-vollan', 'road', '10 km', '39:47', '39:47.8', '39:47'),
    ('henrik-nordahl', 'road', '10 km', '33:00', '33:00.9', '33:00'),
    ('signe-by-eide', 'road', '10 km', '35:46', '35:46.2', '35:46'),
    ('signe-by-eide', 'road', 'Halvmaraton', '1:19:17', '1:19:17.1', '1:19:17'),
    ('oivind-estensen', 'road', 'Maraton', '2:49:40', '2:49:40.2', '2:49:40'),
    ('vibeke-jensen', 'track', '5000 m', '16:29', '16:29.36', '16:29.36'),
    ('oyvind-ytterhus-utengen', 'track', '3000 m', '8:33', '8:33.61', '8:33.61'),
    ('oyvind-ytterhus-utengen', 'track', '10000 m', '31:17', '31:18.16', '31:18.16'),
]
for athlete_id, typ, distance, previous_time, source_time, approved_time in decisions:
    athlete = next(a for a in registry['athletes'] if a['id'] == athlete_id)
    matches = [(i, pb) for i, pb in enumerate(athlete['personalBests']) if not pb.get('sourceProvider') and pb['type'] == typ and normalized_distance(pb['distance']) == normalized_distance(distance)]
    assert len(matches) == 1, (athlete_id, matches)
    index, pb = matches[0]
    assert pb['time'] == previous_time
    assert seconds(approved_time) == (seconds(source_time) if typ == 'track' else math.floor(seconds(source_time)))
    evidence = evidence_for(athlete, typ, distance, source_time)
    correction = {'confirmedAt': DATE, 'previousTime': previous_time, 'sourceTime': source_time, 'approvedTime': approved_time,
                  'basis': 'Brukeren godkjente kildetiden i avvikslisten som PB, med nedrunding til hele sekunder utenfor bane.',
                  'evidence': evidence}
    pb.update(time=approved_time, userApproved=True, approvedAt=DATE, userCorrection=deepcopy(correction))
    if previous_time != approved_time:
        pb['source'] = 'PB fra CSV-skjemaet; referansetiden er rettet til resultat-/WA-kildetiden etter uttrykkelig brukergodkjenning 21.11.2026.'
    for submission in athlete.get('manualPbSubmissions', []):
        for field in submission['fields']:
            for point in field['performances']:
                if point.get('personalBestIndex') == index:
                    point.update(resolvedTime=approved_time, userCorrection=deepcopy(correction))
    corrections.append({'athleteId': athlete_id, 'name': athlete['name'], 'type': typ, 'distance': distance,
                        'personalBestIndex': index, **correction})

counts = Counter(p['status'] for a in registry['athletes'] for s in a.get('manualPbSubmissions', []) for f in s['fields'] for p in f['performances'])
summary = {'resolvedCsvPoints': len(added), 'addedReferences': sum(len(c['references']) for c in added),
           'reviewedTimeDiscrepancies': len(corrections), 'changedReferenceTimes': sum(c['previousTime'] != c['approvedTime'] for c in corrections),
           'csvPoints': dict(counts), 'pendingCsvPoints': counts['needs-review'],
           'registeredReferences': sum(len(a['personalBests']) for a in registry['athletes']),
           'athletes': len(registry['athletes']), 'remainingReviewBlocks': sum(len(a.get('personalBestReviewBlocks', [])) for a in registry['athletes'])}
assert summary['resolvedCsvPoints'] == 41 and summary['addedReferences'] == 44
assert summary['registeredReferences'] == 258 and sum(counts.values()) == 176
assert summary['pendingCsvPoints'] == 0 and summary['remainingReviewBlocks'] == 0
assert summary['athletes'] == 179
for old, new in zip(before['athletes'], registry['athletes']):
    # No identity changes or replacement of WA source data.
    for key, value in old.items():
        if key not in ['personalBests', 'manualPbSubmissions', 'personalBestReviewBlocks']:
            assert new[key] == value, (old['id'], key)
    for s_old, s_new in zip(old.get('manualPbSubmissions', []), new.get('manualPbSubmissions', [])):
        for f_old, f_new in zip(s_old['fields'], s_new['fields']):
            assert f_old['rawValue'] == f_new['rawValue']

report = {'confirmedAt': DATE, 'sourceVersion': 41, 'summary': summary, 'resolvedPoints': added,
          'timeDiscrepancies': corrections,
          'policy': {'trackIndoorOutdoor': 'shared', 'roadTrack': 'separate', 'nonTrackPrecision': 'floor-whole-seconds',
                     'trackPrecision': 'source-decimals', 'birkenCourseId': 'birkebeinerlopet',
                     'vemundException': '3/5/10 km references explicitly registered for both road and track',
                     'manualReferencesOverrideWa': True, 'pbRequiresApprovedReference': True}}
PATH.write_text(json.dumps(registry, ensure_ascii=False, indent=2) + '\n')
(PROJECT / 'docs/manual-pb-user-clarifications-2026-11-21.json').write_text(json.dumps(report, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(summary, ensure_ascii=False, indent=2))
