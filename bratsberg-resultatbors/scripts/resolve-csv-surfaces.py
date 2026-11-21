#!/usr/bin/env python3
"""Resolve reviewed CSV surfaces after the user's road/track clarification.

Explicit per-submission decisions, not a rule for future CSV imports.
Preserves submitted times; evidence is used to classify event/surface only.
"""
from pathlib import Path
from collections import Counter
from copy import deepcopy
import json,re

PROJECT=Path(__file__).resolve().parents[1]
PATH=PROJECT/'dist/data/athletes.json'
DATE='2026-11-21'
registry=json.loads(PATH.read_text())
before=deepcopy(registry)
assert not any(a.get('manualPbSurfaceReview') for a in registry['athletes']), 'Review already applied'
nfif='https://www.minfriidrettsstatistikk.info/php/LandsStatistikk.php?outdoor=Y&showclass=11&showclub=0&showevent=0&showseason=2020'
sources={
 'magnus-road':'https://www.kondis.no/files/2025/08/19/Resultater_5_km_lbsmw7ltzwnbzz.pdf',
 'trond-road':'https://www.kondis.no/statistikk/de-beste-2022-5-km-menn/469435',
 'rannei-road':'https://www.kondis.no/statistikk/veteranstatistikk-2022-5-km-kvinner/469121',
 'ingvild-road':'https://www.kondis.no/statistikk/de-beste-2024-5-km-kvinner/469761',
 'anders-track':'https://10kpb.no/om-lopet/',
 'anders-result':'https://www.kondis.no/resultater/resultater-fra-10-km-pacing-bislett/1597247',
 'vemund-review':'https://www.friidrett.no/contentassets/e10002c32a654c2a9a67f3426e8ddbf2/telebest---revidert.pdf'
}
races=[json.loads(p.read_text()) for p in (PROJECT/'dist/data/races').glob('*.json')]
def seconds(t):
 if not isinstance(t,str):return None
 try:
  vals=[float(x) for x in t.replace(',','.').split(':')]
  if len(vals)>3 or any(x>=60 for x in vals[1:]):return None
  total=0
  for x in vals:total=total*60+x
  return total if total>0 else None
 except ValueError:return None
def dist(p):
 return re.sub(r'\s+','',p.get('distance','').lower()).replace('5000m','5km').replace('10000m','10km')
def evidence(athlete,p,typ,distance,environment=None,urls=None,reason=None):
 refs=[]
 for race in races:
  if race.get('type')!=typ or (typ=='track' and race.get('environment')!=environment):continue
  for result in race.get('results',[]):
   if result.get('athleteId')!=athlete['id'] or dist(result)!=dist({'distance':distance}):continue
   value=result.get('netTime') if result.get('timeBasis',race.get('timeBasis'))=='net' and result.get('netTime') else result.get('time')
   t=seconds(value)
   if t is not None and abs(t-seconds(p['time']))<1:
    refs.append({'raceId':race['id'],'distance':result['distance'],'time':value,
                 'timeDifferenceSeconds':round(t-seconds(p['time']),3),'sourceUrl':result.get('sourceUrl') or race.get('sourceUrl')})
 status='source-supported' if refs or urls else 'context-inference'
 return {'status':status,'checkedAt':DATE,
         'basis':reason or ('Gate støttet av eksisterende løp på samme distanse med samme eller sub-sekundnær tid.' if refs else
         'Tolket som gate etter brukerens presisering om CSV-en, enkel 5/10-km-oppføring og løpsprofil; ingen motsigende banekilde funnet.'),
         'sources':urls or [],'supportingResults':refs}
# These row numbers were individually reviewed in this specific 44-row survey.
road_rows={2,3,4,6,7,9,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,37,39,40,44}
changes=[]
for athlete in registry['athletes']:
 for submission in athlete.get('manualPbSubmissions',[]):
  row=submission['sourceRow']
  for field in submission['fields']:
   for p in field['performances']:
    if p['status']!='needs-review':continue
    typ=environment=distance=None;urls=[];reason=None
    if row==14:
     if p['distance'] in ['3000 m','10000 m'] or p['time']=='15:54.85':
      typ='track';environment='outdoor';distance=p['distance'];urls=[nfif]
      reason='Eksakt navn, øvelse og innsendt tid i NFIFs utendørsstatistikk 2020.'
     elif p['time']=='15:49':
      typ='road';distance='5 km';urls=[sources['magnus-road']]
      reason='Eksakt tid og navn i Perseløpet 5 km 30.05.2020; adskilt fra 5000 m-banetiden.'
    elif row==26 and p['distance']=='10000 m':
     typ='track';environment='outdoor';distance='10000 m'
     urls=[sources['anders-track'],sources['anders-result']]
     reason='33:07 matcher 10 km Pacing Bislett; arrangøren beskriver 25 runder på utendørs 400-meterbane.'
    elif row==34 and p['distance']=='5000 m':
     typ='track';environment='outdoor';distance='5000 m'
     wa=next(x for x in athlete['worldAthletics']['performances'] if x['type']=='track' and dist(x)=='5km')
     urls=[wa['sourceUrl']]
     reason='WA har 5000 m utendørs 16:29.36. CSV-ens hele sekunder 16:29 bevares; denne oppføringen tolkes som bane.'
    elif row==10 and p['type']=='track':
     typ='track';environment='outdoor';distance=p['distance']
     wa=next(x for x in athlete['worldAthletics']['performances'] if dist(x)==dist(p))
     urls=[wa['sourceUrl']]
     reason='CSV angir bane eksplisitt; eksisterende WA-kilde støtter utendørs i samme øvelse. Innsendt tid beholdes selv ved avvik.'
    elif row==15 and p['distance'] in ['800 m','400 m']:
     wa=next(x for x in athlete['worldAthletics']['performances'] if x['type']=='track' and x['distance']==p['distance'] and seconds(x['time'])==seconds(p['time']))
     typ='track';environment=wa['environment'];distance=p['distance'];urls=[wa['sourceUrl']]
     reason='Eksakt øvelse og tid i eksisterende WA-kilde avklarer inne/ute.'
    elif row in road_rows and p['type']=='combined' and p['distance'] in ['5000 m','10000 m'] and p.get('reason')!='multiple-times-without-surface':
     typ='road';distance='5 km' if p['distance']=='5000 m' else '10 km'
     if row==44:urls=[sources['trond-road']];reason='Trond Sliper 16:38 er registrert på Trønder-Østløpet 5 km i 2022.'
     elif row==9 and distance=='5 km':urls=[sources['rannei-road']];reason='Rannei Sæther 19:40 er registrert på Norgestesten 1 i gatestatistikken for 2022.'
     elif row==30 and distance=='5 km':urls=[sources['ingvild-road']];reason='Ingvild Saksvik-Lehouillier 19:43 er registrert på Sommernattsløpet Trondheim i gatestatistikken for 2024.'
     elif row==34:
      wa=next(x for x in athlete['worldAthletics']['performances'] if x['type']=='road' and dist(x)=='10km')
      urls=[wa['sourceUrl']];reason='Eksakt 33:15 i eksisterende WA-kilde for 10 km gate.'
    if typ is None:continue
    old=deepcopy(p)
    classification=evidence(athlete,p,typ,distance,environment,urls,reason)
    pb={'type':typ,'distance':distance,'time':p['time'],'date':None,'asOf':submission['asOf'],
        'source':'PB oppgitt av utøveren i CSV-skjemaet; underlaget er gjennomgått separat.',
        'sourceFile':submission['sourceFile'],'sourceLibraryFileId':submission['sourceLibraryFileId'],
        'sourceRow':row,'sourceColumn':field['column'],'rawValue':field['rawValue'],
        'evidenceKind':'athlete-submitted-personal-best','userApproved':True,'importedAt':DATE,
        'classification':classification}
    if environment:pb['environment']=environment
    athlete['personalBests'].append(pb)
    p.update(status='imported',resolvedType=typ,resolvedDistance=distance,
             personalBestIndex=len(athlete['personalBests'])-1,classification=classification)
    if environment:p['resolvedEnvironment']=environment
    p.pop('reason',None)
    changes.append({'athleteId':athlete['id'],'name':athlete['name'],'sourceRow':row,
                    'column':field['column'],'rawValue':field['rawValue'],'previous':old,
                    'reference':deepcopy(pb),'personalBestIndex':p['personalBestIndex']})
   statuses={p['status'] for p in field['performances']}
   if statuses:
    field['status']='partial' if 'needs-review' in statuses and len(statuses)>1 else ('needs-review' if 'needs-review' in statuses else 'imported-or-confirmed')
  # Drop only blocks belonging to a fully resolved source field. A partial field
  # retains its existing, narrower blocks (e.g. Thomas's unresolved track time).
  unresolved_columns={f['column'] for f in submission['fields'] if any(p['status']=='needs-review' for p in f['performances'])}
  athlete['personalBestReviewBlocks']=[b for b in athlete.get('personalBestReviewBlocks',[])
    if b.get('sourceRow')!=row or b.get('sourceFile')!=submission['sourceFile'] or b.get('sourceColumn') in unresolved_columns]
  athlete['manualPbSurfaceReview']={'checkedAt':DATE,'policy':'Bane/gate holdes adskilt. Kildestøttet klassifisering der mulig; øvrige gjennomgåtte enkle 5/10-km-tider tolket som gate i lys av brukerens presisering. Ingen felles terskel.'}
old_by={a['id']:a for a in before['athletes']}
for a in registry['athletes']:
 old=old_by[a['id']]
 assert a['personalBests'][:len(old['personalBests'])]==old['personalBests']
 for k,v in old.items():
  if k not in ['personalBests','personalBestReviewBlocks','manualPbSubmissions']:assert a[k]==v,(a['id'],k)
assert len(registry['athletes'])==177
counts=Counter(p['status'] for a in registry['athletes'] for s in a.get('manualPbSubmissions',[]) for f in s['fields'] for p in f['performances'])
summary={'newlyClassified':len(changes),'newRoad':sum(c['reference']['type']=='road' for c in changes),
         'newTrack':sum(c['reference']['type']=='track' for c in changes),
         'classificationBasis':dict(Counter(c['reference']['classification']['status'] for c in changes)),
         'csvPoints':dict(counts),'registeredReferences':sum(len(a['personalBests']) for a in registry['athletes'])}
report={'checkedAt':DATE,'sourceVersion':40,'summary':summary,'changes':changes,
        'stillPending':[{'athleteId':a['id'],'name':a['name'],'sourceRow':s['sourceRow'],'column':f['column'],
                         'rawValue':f['rawValue'],'point':p}
             for a in registry['athletes'] for s in a.get('manualPbSubmissions',[]) for f in s['fields'] for p in f['performances'] if p['status']=='needs-review'],
        'reviewNotes':[
          {'athleteId':'vemund-gurholt','sourceUrl':sources['vemund-review'],'note':'CSV 8:48/15:01/30:51 er mye raskere enn eldre tilgjengelig statistikk. Det kan være nyere tider; de er bevart og trenger avklaring før underlag velges.'},
          {'athleteId':'vidar-bjornas','note':'Et eksternt 30:41-gatetreff gjelder Vidar Jr Bjørnås. Identiteten er ikke bekreftet; ikke koblet automatisk.'},
          {'athleteId':'trond-sliper','note':'35:12/35:24 mangler forklaring på hvilken tid som gjelder hvilket underlag/tidsgrunnlag.'}
        ]}
PATH.write_text(json.dumps(registry,ensure_ascii=False,indent=2)+'\n')
(PROJECT/'docs/manual-pb-surface-review-2026-11-21.json').write_text(json.dumps(report,ensure_ascii=False,indent=2)+'\n')
print(json.dumps(summary,ensure_ascii=False,indent=2))

