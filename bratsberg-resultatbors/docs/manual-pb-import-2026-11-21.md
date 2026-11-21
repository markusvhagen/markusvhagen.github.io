> Historisk rapport: Gjenstående spørsmål, tidsavvik og tidligere presisjonsregler er senere avklart av brukeren. Se [gjeldende avklaringer](manual-pb-user-clarifications-2026-11-21.md).

# CSV-import av manuelle PB-er – 21. november 2026

> Denne rapporten beskriver første CSV-import i versjon 40. En senere gjennomgang har klassifisert flere tider som bane eller gate. Se [oppdatert underlagsvurdering](manual-pb-surface-review-2026-11-21.md) for gjeldende klassifiseringer og tellinger.

CSV-filen «Bratsberg Friidrett - Dine PBs.csv» inneholder 44 svar. Denne filen var ikke importert i forrige leveranse. Importen er nå gjennomgått og alle utfylte felt er bevart med kildenavn, radnummer, originaltekst og vurdering.

## Resultat

- 65 nye, entydige manuelle PB-referanser er lagt til. Fem andre tider var allerede korrekt registrert.
- 106 oppgitte eller foreløpig tolkede tider er lagret for avklaring. Disse gir ingen PB-merker.
- 36 svar er koblet til eksisterende profiler. Åtte nye profiler gir totalt 177 registrerte utøver-ID-er. Tidligere mulige navneduplikater er ikke slått sammen.
- Alle 13 tidligere manuelle referanser og 71 WA-referanser er bevart. Av WA-referansene viker fire for nye manuelle referanser og sju er sperret mens det manuelle feltet avklares.
- 34 resultater får PB, mot 22 før denne importen. Alle 12 nye merker har en entydig manuell referanse. Ingen tidligere PB-merker forsvinner.
- Trond Slipers netto 1:18:32 i Amsterdam 18. oktober 2026 får PB, fordi den matcher hans innsendte halvmaraton-PB.
- 27 automatiske kontroller bestod. Løpsresultater, netto-/bruttotider og klubbens offisielle rekorder er uendret.

## Avklaringer som gjenstår

Felleskolonnene 3000m/3K gate, 5000m/5K gate og 10000m/10K gate angir ikke alltid underlag. Det er ikke antatt at én tid er to separate PB-er. Tidene beholdes inaktive til det avklares om de skal være en felles grense eller knyttes til et bestemt underlag. Rene banetider mangler ofte opplysning om inne/ute. Birkebeinerløpet/Løpebirken trenger bekreftet løype/utgave før sammenligning. Alle usikre felt står i tabellen nedenfor og i JSON-rapporten.

| Utøver | Originalopplysning | Avklaring |
|---|---|---|
| Trond Sliper | 10000m/10K: 35:12/35:24 | Hvilken tid gjelder bane/gate, eventuelt netto/brutto? |
| Magnus Cato Andersen | 5000m/5K: 15:54.85, 15:49 | Hvilken tid gjelder bane/gate? |
| Michael Brian Watts | Halvmaraton 1:14; maraton 2:42 | Er dette 1:14:00 og 2:42:00, eller mangler sekunder? |
| Øivind Estensen | 3000m/3K: 10:00:01 | Foreløpig tolket som 10:00.01, men ikke aktivert. |
| Trond Sliper | Miles 4:59 | Bekreft én engelsk mile samt bane/gate og eventuell inne/ute. |

## Avvik mot registrerte tider

| Utøver | CSV | Eksisterende resultat | Behandling |
|---|---|---|
| Ingvild Saksvik-Lehouillier, halvmaraton | 1:30:18 | Amsterdam 1:30:17 | CSV beholdes som referanse; den ett sekund raskere løpstiden kvalifiserer. |
| Jørgen Skevik, maraton | 2:33:34 | Hamburg/WA 2:33:23 | CSV beholdes som manuell referanse; eksisterende løp og WA-kilde bevares uendret. |

## Alle 44 svar

«Venter» betyr at dataene er lagret, men ikke kan opprette PB-merker. Tidene i denne kolonnen er normaliserte kandidater, ikke bekreftede nye PB-er. En utfylt celle kan inneholde flere øvelser eller tider.

| Rad | Utøver | Aktive / allerede bekreftede referanser | Venter på avklaring |
|---|---|---|---|
| 1 | Markus Valås Hagen | 3000 m 10:10 (allerede registrert); 5 km 18:11 (allerede registrert); 10 km 36:56 (allerede registrert); Halvmaraton 1:21:03 (allerede registrert); Maraton 3:58:06 | — |
| 2 | Mads Holmefjord Lund | Halvmaraton 1:23:18; Maraton 3:00:27 | 3000 m 10:24; 10000 m 37:07 |
| 3 | Simen Sørlie Haugland | Halvmaraton 1:24:23; Maraton 3:04:53 | 3000 m 11:08; 5000 m 18:29; 10000 m 38:07 |
| 4 | Kristian Mølbach Lian | Halvmaraton 1:26:36 | 10000 m 37:55 |
| 5 | Vemund Gurholt | Halvmaraton 1:18:32; Maraton 2:59:38 | 3000 m 8:48; 5000 m 15:01; 10000 m 30:51 |
| 6 | Michael Brian Watts | — | 800 m 2:00; 3000 m 9:13; 5000 m 16:14; 10000 m 33:50; Halvmaraton 1:14; Maraton 2:42 |
| 7 | Luca Bessems | Halvmaraton 1:22:30; Maraton 3:04:29 | 3000 m 11:46; 5000 m 19:08; 10000 m 38:35 |
| 8 | Thomas Kjetland | 5 km 15:37; 10 km 32:38; Halvmaraton 1:10:55; Maraton 2:32:54 | 3000 m 8:59.6; 5000 m 15:33; Birkebeinerløpet 1:15:38 |
| 9 | Rannei Sæther | Halvmaraton 1:29:39; Maraton 3:11:14 | 800 m 2:13.04; 1500 m 4:47; 3000 m 11:23; 5000 m 19:40; 10000 m 39:51; 100 m 12.7; 200 m 27.5; 400 m 57.5 |
| 10 | Øyvind Ytterhus Utengen | 5 km 15:00; 10 km 31:59; Halvmaraton 1:09:13 | 3000 m 8:33; 10000 m 31:17 |
| 11 | Morten Schei | Halvmaraton 1:12:59; Maraton 2:34:27 | 5000 m 16:35; 10000 m 33:18 |
| 12 | Anita Kvam | Halvmaraton 1:30:12 | 3000 m 11:28; 5000 m 20:03; 10000 m 41:46 |
| 13 | Iris Røe Kalafati | Halvmaraton 1:29:46 | 10000 m 39:30 |
| 14 | Magnus Cato Andersen | Halvmaraton 1:12:03 | 3000 m 9:03.44; 5000 m 15:54.85; 5000 m 15:49; 10000 m 32:36.35 |
| 15 | Hanna Eid | — | 800 m 2:15.95; 1500 m 4:58.45; 5000 m 19:10; 400 m 58.41; 1000 m 3:02.99 |
| 16 | Magnus Langseth | Halvmaraton 1:29:24; Maraton 3:21:40 | 3000 m 10:19.5; 5000 m 18:14; 10000 m 37:59.5 |
| 17 | Vegard høiseth | — | 1500 m 4:50; 3000 m 9:50; 5000 m 16:08; 10000 m 36:05 |
| 18 | Tor Magne Volden | Halvmaraton 1:22:53; Maraton 2:59:55 | 3000 m 10:48; 5000 m 19:10; 10000 m 37:34 |
| 19 | Kristian Selbekk Liaklev | Halvmaraton 1:22:26 | 3000 m 9:52; 5000 m 17:20; 10000 m 37:09; Løpebirken 1:29:35 |
| 20 | Ane Korsvold | Halvmaraton 1:27:27 | 10000 m 39:27 |
| 21 | Marita Ramfjord Sætran | Halvmaraton 1:44:17 | 5000 m 21:18; 10000 m 44:59 |
| 22 | Sofie Søraunet Wangberg | — | 10000 m 39:42 |
| 23 | Kevin Gray | Halvmaraton 1:37:57 | 10000 m 42:52 |
| 24 | Stian Granheim Skåland | Halvmaraton 1:19:27; Maraton 2:58:32 | 3000 m 9:37; 5000 m 16:43; 10000 m 34:44 |
| 25 | Kjell Marius Vollan | Halvmaraton 1:29:19 | 3000 m 11:09; 5000 m 19:02; 10000 m 39:47 |
| 26 | Anders Aamodt Resell | Halvmaraton 1:14:43 | 3000 m 9:13; 5000 m 15:53; 10000 m 33:07 |
| 27 | Martin Uglem | Halvmaraton 1:14:03 | 5000 m 16:48; 10000 m 33:59 |
| 28 | Grete Helgesen | — | 5000 m 17:40; 10000 m 36:30 |
| 29 | Kristin Rønning | Halvmaraton 1:33:14 | 5000 m 19:23; 10000 m 40:32 |
| 30 | Ingvild Saksvik-Lehouillier | Halvmaraton 1:30:18 | 800 m 2:17.04; 1500 m 4:59.49; 3000 m 11:03; 5000 m 19:43; 10000 m 41:20 |
| 31 | Øivind Estensen | Halvmaraton 1:19:08; Maraton 2:49:40 | 3000 m 10:00.01; 5000 m 17:01; 10000 m 35:26 |
| 32 | Rune Lysgård Fagerheim | Halvmaraton 1:26:48; Maraton 3:46:22 | 5000 m 17:57; 10000 m 37:50 |
| 33 | Jørgen Skevik | Halvmaraton 1:11:00; Maraton 2:33:34 | 10000 m 32:19 |
| 34 | Vibeke Jensen | Halvmaraton 1:13:20; Maraton 2:33:11 (allerede registrert) | 5000 m 16:29; 10000 m 33:15 |
| 35 | Erika Skaslien | Halvmaraton 1:29:38; Maraton 3:19:41 | 10000 m 39:44 |
| 36 | Henrik Nordahl | 5 km 15:50; 10 km 33:00; Halvmaraton 1:12:47; Maraton 2:31:25 | — |
| 37 | Bjarne Austad | Halvmaraton 1:26:54; Maraton 3:01:13 | 3000 m 10:33; 5000 m 18:28; 10000 m 37:46 |
| 38 | Stine Helena Bang Svendsen | Halvmaraton 1:30:14; Maraton 3:19:43 | — |
| 39 | Ståle Kvam | Halvmaraton 1:40:01 | 5000 m 20:07 |
| 40 | Beate Glørstad Laukholm | — | 5000 m 21:58; 10000 m 46:04 |
| 41 | Jonatan Olander | 5 km 16:16; 10 km 33:18; Halvmaraton 1:16:42; Maraton 2:43:48 | — |
| 42 | Signe By Eide | 10 km 35:46; Halvmaraton 1:19:17; Maraton 2:48:32 | — |
| 43 | Vidar Bjørnås | — | 10000 m 30:41 |
| 44 | Trond Sliper | Halvmaraton 1:18:32 | 3000 m 9:51; 5000 m 16:38; 10000 m 35:12; 10000 m 35:24; 1 mile 4:59 |

## Navnekoblinger

- Simen Sørlie Haugland → eksisterende Simen Haugland. To identiske resultat-tider støtter koblingen.
- Kristian Mølbach Lian → eksisterende Kristian Lian. 10 km 37:55 støtter koblingen.
- Kjell Marius Vollan → eksisterende Kjell-Marius Vollan. Navnevariant og 5 km 19:02 støtter koblingen.
- Nye profiler: Thomas Kjetland, Magnus Langseth, Marita Ramfjord Sætran, Kevin Gray, Martin Uglem, Erika Skaslien, Ståle Kvam og Vidar Bjørnås.

## Kilder og teknisk sporbarhet

- `manual-pbs-2026-11-20.csv` inneholder CSV-innholdet.
- `manual-pb-import-2026-11-21.json` inneholder samtlige felt, normaliseringer, navnekoblinger, status og kontrollresultater.
- `dist/data/athletes.json` har aktive referanser i `personalBests`, alle svar i `manualPbSubmissions` og avgrensede WA-sperrer i `personalBestReviewBlocks`.
- Svardatoen er lagret som `asOf`; det er ikke oppdiktet en løpsdato.
- Begge nettstedvariantene, `dist/` og den selvstendige HTML-filen, er oppdatert.
