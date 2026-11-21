#!/usr/bin/env python3
"""Import the authorized PB survey, retaining every raw field and review decision.

Unspecified surfaces/environments are kept for review; they never establish a PB.
Run against a copy of v39. Refuses to repeat the same submission import.
"""
from pathlib import Path
from collections import Counter
from copy import deepcopy
import csv
import json
import re
import unicodedata

PROJECT = Path(__file__).resolve().parents[1]
DATA = PROJECT / 'dist/data'
SOURCE_FILE = 'Bratsberg Friidrett - Dine PBs.csv'
SOURCE_ID = 'libfile_fde3_f-7fcdec51f9208191a969d675df0ee5e0_6216c7925b388191ae76510d1395fadc'
IMPORTED_AT = '2026-11-21'
CSV_PATH = PROJECT / 'docs/manual-pbs-2026-11-20.csv'
rows = list(csv.DictReader(CSV_PATH.open(newline='', encoding='utf-8')))
registry_path = DATA / 'athletes.json'
registry = json.loads(registry_path.read_text())
original = deepcopy(registry)
assert len(rows) == 44
assert not any(a.get('manualPbSubmissions') for a in registry['athletes']), 'CSV already imported'
headers = list(rows[0])
special_matches = {
    'Simen Sørlie Haugland': 'simen-haugland',
    'Kristian Mølbach Lian': 'kristian-lian',
    'Kjell Marius Vollan': 'kjell-marius-vollan',
}
match_evidence = {
    'simen-haugland': 'Unikt for-/etternavn; både 5 km 18:29 og 10 km 38:07 matcher eksisterende resultater.',
    'kristian-lian': 'Unikt for-/etternavn; 10 km 37:55 matcher eksisterende nettotid på Hytteplanmila.',
    'kjell-marius-vollan': 'Bindestrekvariant; kildenavn Kjell Marius VOLLAN og 5 km 19:02 matcher.',
}
new_ids = {
    'Thomas Kjetland': 'thomas-kjetland', 'Magnus Langseth': 'magnus-langseth',
    'Marita Ramfjord Sætran': 'marita-ramfjord-saetran', 'Kevin Gray': 'kevin-gray',
    'Martin Uglem': 'martin-uglem', 'Erika Skaslien': 'erika-skaslien',
    'Ståle Kvam': 'stale-kvam', 'Vidar Bjørnås': 'vidar-bjornas',
}
def name_key(s):
    return unicodedata.normalize('NFC', s.strip()).casefold()
def seconds(s):
    total = 0
    for i,part in enumerate(s.split(':')):
        n = float(part)
        assert i == 0 or n < 60, s
        total = total * 60 + n
    return total
def normalized(raw, marathon=False):
    s = raw.strip().lower()
    if s == '2min':
        return '2:00'
    if ':' in s:
        s = s.replace(',', '.')
    else:
        parts = re.split(r'[.,]', s)
        if marathon:
            s = ':'.join(parts)
        elif len(parts) == 3:
            s = parts[0] + ':' + parts[1] + '.' + parts[2]
        elif len(parts) == 2:
            s = ':'.join(parts)
    # Survey runners use M:SS:hh for short track events.
    if not marathon and s.count(':') == 2:
        a,b,c = s.split(':')
        s = a + ':' + b + '.' + c
    parts=s.split(':')
    parts[0]=str(int(parts[0]))
    s=':'.join(parts)
    assert re.fullmatch(r'\d+(?::\d{2}){0,2}(?:\.\d+)?', s), (raw, s)
    assert seconds(s) > 0
    if marathon and len(parts) == 2:
        minutes, sec = parts
        assert int(minutes) >= 60, ('ambiguous short time', raw)
        s = f'{int(minutes)//60}:{int(minutes)%60:02d}:{sec}'
    return s
def event_key(p):
    d = re.sub(r'\s+', '',p['distance'].lower())
    if p['type'] == 'road':
        d={'5000m':'5km','10000m':'10km','half':'halvmaraton','marathon':'maraton'}.get(d,d)
    return p['type'],p.get('environment'),d
def scopes(p):
    typ=p['type'];d=p['distance']
    if typ == 'combined':
        out=[{'type':'track','distance':d}]
        if d != '3000 m':
            out.append({'type':'road','distance':str(int(d.split()[0])//1000)+' km'})
        return out
    if typ=='road':return [{'type':'road','distance':d}]
    if typ=='track' and d not in ['100 m','1 mile']:
        return [{'type':'track','distance':d,**({'environment':p['environment']} if p.get('environment') else {})}]
    return []
def candidate(time, typ, distance, **kw):
    return {'time':time,'type':typ,'distance':distance,**kw}

audit=[]
for rownum,row in enumerate(rows,1):
    name=row[headers[1]].strip()
    matches=[a for a in registry['athletes'] if any(name_key(name)==name_key(n) for n in [a['name'],*a.get('aliases',[])])]
    assert len(matches)<=1
    match_kind='exact-name-or-alias'
    if matches:
        athlete=matches[0]
    elif name in special_matches:
        athlete=next(a for a in registry['athletes'] if a['id']==special_matches[name])
        if name not in athlete['aliases']:athlete['aliases'].append(name)
        match_kind='reviewed-name-variant'
    else:
        assert name in new_ids, name
        athlete={'id':new_ids[name],'name':name,'aliases':[],'personalBests':[]}
        assert not any(a['id']==athlete['id'] for a in registry['athletes'])
        registry['athletes'].append(athlete)
        match_kind='new-athlete'
    as_of=row[headers[0]].split()[0].replace('/','-')
    submission={'sourceFile':SOURCE_FILE,'sourceLibraryFileId':SOURCE_ID,'sourceVersion':'0',
                'sourceRow':rownum,'submittedAtRaw':row[headers[0]],'asOf':as_of,
                'importedAt':IMPORTED_AT,'submittedName':row[headers[1]],'fields':[]}
    person={'sourceRow':rownum,'name':name,'athleteId':athlete['id'],'match':match_kind,
            'matchEvidence':match_evidence.get(athlete['id']),'fields':submission['fields']}
    for col in range(2,10):
        raw=row[headers[col]]
        if not raw.strip():continue
        value=raw.strip()
        field={'column':headers[col],'rawValue':raw,'performances':[]}
        ps=field['performances']
        if value.lower()=='har ikke tid':
            field['status']='no-time-provided'
            submission['fields'].append(field)
            continue
        if col in [7,8]:
            distance='Halvmaraton' if col==7 else 'Maraton'
            if name=='Michael Brian Watts':
                ps.append({'type':'road','distance':distance,'rawTime':value,'status':'needs-review','reason':'missing-seconds'})
            else:
                ps.append(candidate(normalized(value,marathon=True),'road',distance))
        elif col in [2,3]:
            ps.append(candidate(normalized(value),'track','800 m' if col==2 else '1500 m'))
        elif col in [4,5,6]:
            distance={4:'3000 m',5:'5000 m',6:'10000 m'}[col]
            if name=='Thomas Kjetland':
                if col==4:ps.append(candidate('8:59.6','track','3000 m'))
                elif col==5:
                    ps.extend([candidate('15:37','road','5 km'),candidate('15:33','track','5000 m')])
                else:ps.append(candidate('32:38','road','10 km'))
            elif name=='Øyvind Ytterhus Utengen':
                if col==4:ps.append(candidate('8:33','track','3000 m'))
                elif col==5:ps.append(candidate('15:00','road','5 km'))
                else:ps.extend([candidate('31:17','track','10000 m'),candidate('31:59','road','10 km')])
            elif name=='Magnus Cato Andersen' and col==5:
                ps.extend([candidate('15:54.85','combined',distance,reason='multiple-times-without-surface'),
                           candidate('15:49','combined',distance,reason='multiple-times-without-surface')])
            elif name=='Trond Sliper' and col==6:
                ps.extend([candidate('35:12','combined',distance,reason='multiple-times-without-surface'),
                           candidate('35:24','combined',distance,reason='multiple-times-without-surface')])
            elif 'gate' in value.lower():
                time=re.sub(r'\s*\(?gate\)?','',value,flags=re.I).strip()
                ps.append(candidate(normalized(time),'road',str(int(distance.split()[0])//1000)+' km'))
            else:
                extra={'normalizationNeedsConfirmation':True} if name=='Øivind Estensen' and col==4 else {}
                ps.append(candidate(normalized(value),'combined',distance,**extra))
        else:
            if name=='Thomas Kjetland':
                ps.append(candidate('1:15:38','trail','Birkebeinerløpet'))
            elif name=='Kristian Selbekk Liaklev':
                ps.append(candidate('1:29:35','trail','Løpebirken'))
            elif name=='Rannei Sæther':
                ps.extend([candidate('12.7','track','100 m'),candidate('27.5','track','200 m'),candidate('57.5','track','400 m')])
            elif name=='Hanna Eid':
                ps.extend([candidate('58.41','track','400 m'),candidate('3:02.99','track','1000 m')])
            elif name=='Trond Sliper':
                ps.append(candidate('4:59','unspecified','1 mile'))
            else:raise AssertionError((name,value))
        for p in ps:
            metadata={'sourceFile':SOURCE_FILE,'sourceLibraryFileId':SOURCE_ID,'sourceRow':rownum,
                      'sourceColumn':headers[col],'rawValue':raw,'asOf':as_of}
            if p.get('status')=='needs-review':
                pass
            elif p['type']=='road':
                matching=[(i,old) for i,old in enumerate(athlete['personalBests'])
                          if not old.get('sourceProvider') and event_key(old)==event_key(p)
                          and seconds(old['time'])==seconds(p['time'])]
                if matching:
                    p.update(status='existing-reference',personalBestIndex=matching[0][0])
                else:
                    entry={k:v for k,v in p.items() if k in ['type','distance','time','environment']}
                    entry.update(date=None,asOf=as_of,source='PB oppgitt av utøveren i CSV-skjemaet.',
                                 evidenceKind='athlete-submitted-personal-best',userApproved=True,
                                 importedAt=IMPORTED_AT,**{k:v for k,v in metadata.items() if k!='asOf'})
                    athlete['personalBests'].append(entry)
                    p.update(status='imported',personalBestIndex=len(athlete['personalBests'])-1)
            elif name=='Markus Valås Hagen' and col in [4,5,6]:
                # Already confirmed manual references establish the known event.
                expected={4:('track','outdoor','3000m'),5:('road',None,'5km'),6:('road',None,'10km')}[col]
                match=[(i,old) for i,old in enumerate(athlete['personalBests'])
                       if not old.get('sourceProvider') and event_key(old)==expected
                       and seconds(old['time'])==seconds(p['time'])]
                assert len(match)==1
                p.update(status='existing-reference',personalBestIndex=match[0][0],
                         resolvedType=match[0][1]['type'],resolvedDistance=match[0][1]['distance'],
                         resolution='Eksisterende manuelt bekreftet PB i samme tid.')
            else:
                reason=p.get('reason') or {'combined':'surface-unspecified','track':'environment-unspecified',
                                          'trail':'course-not-confirmed','unspecified':'event-and-surface-unspecified'}[p['type']]
                p.update(status='needs-review',reason=reason)
            if p['status']=='needs-review':
                for scope in scopes(p):
                    block={**scope,**metadata,'reason':p['reason']}
                    blocks=athlete.setdefault('personalBestReviewBlocks',[])
                    if block not in blocks:blocks.append(block)
        statuses={p['status'] for p in ps}
        field['status']='partial' if 'needs-review' in statuses and len(statuses)>1 else ('needs-review' if 'needs-review' in statuses else 'imported-or-confirmed')
        submission['fields'].append(field)
    athlete.setdefault('manualPbSubmissions',[]).append(submission)
    audit.append(person)

counts=Counter(p['status'] for person in audit for field in person['fields'] for p in field['performances'])
summary={'responses':len(rows),'athletesBefore':len(original['athletes']),'athletesAfter':len(registry['athletes']),
         'nameMatches':dict(Counter(p['match'] for p in audit)),'performances':dict(counts),
         'nonemptyFields':sum(len(p['fields']) for p in audit),
         'registeredReferencesBefore':sum(len(a.get('personalBests',[])) for a in original['athletes']),
         'registeredReferencesAfter':sum(len(a.get('personalBests',[])) for a in registry['athletes']),
         'reviewBlockCount':sum(len(a.get('personalBestReviewBlocks',[])) for a in registry['athletes'])}
assert len(registry['athletes'])==177
assert counts['existing-reference']==5
original_by_id={a['id']:a for a in original['athletes']}
for athlete in registry['athletes']:
    if athlete['id'] in original_by_id:
        old=original_by_id[athlete['id']]
        for k,v in old.items():
            if k not in ['personalBests','aliases']:assert athlete[k]==v,(athlete['id'],k)
        assert athlete['personalBests'][:len(old.get('personalBests',[]))]==old.get('personalBests',[])
        assert athlete['aliases'][:len(old.get('aliases',[]))]==old.get('aliases',[])
registry_path.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
index_path=DATA/'index.json'
index=json.loads(index_path.read_text());index['updatedAt']=IMPORTED_AT
index_path.write_text(json.dumps(index,ensure_ascii=False,indent=2)+'\n')
report={'sourceFile':SOURCE_FILE,'sourceLibraryFileId':SOURCE_ID,'sourceVersion':'0',
        'importedAt':IMPORTED_AT,'summary':summary,'athletes':audit}
(PROJECT/'docs/manual-pb-import-2026-11-21.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))

