# WA-poeng

Vanlige WA-poeng beregnes fra **World Athletics Scoring Tables of Athletics, 2025 revised edition**, sist oppdatert 23. april 2025. Dette er utgaven World Athletics lenket til fra sin side for teknisk informasjon ved kontroll 11. november 2026.

- [Offisiell oversikt](https://worldathletics.org/about-iaaf/documents/technical-information)
- [Offisiell tabell-PDF](https://worldathletics.org/download/download?filename=4f77dcb3-2945-4c58-ad8b-955a999b13e8.pdf&urlslug=World+Athletics+Scoring+Tables+of+Athletics)
- [World Athletics om oppdateringen](https://worldathletics.org/news/news/scoring-tables-2025)

`dist/wa-scoring-tables.js` inneholder nøyaktige numeriske terskler fra denne PDF-en, med kildeadresse og SHA256. `scripts/extract-wa-tables.py` regenererer dataene fra original-PDF med `pypdf` installert og kontrollerer at samtlige 1400 poengrader er lest i hver tabellgruppe. PDF-en følger ikke med prosjektet.

## Omfang og beregning

Det finnes egne tabeller for kvinner og menn. Vi støtter gateøvelsene 5 km, 10 km, halvmaraton og maraton, samt 800, 1500, 2000, 3000, 5000 og 10000 meter på utendørsbane. Innendørs, terreng og øvrige øvelser får ingen WA-poeng i denne utgaven. Alderen er uten betydning for vanlige WA-poeng.

Et resultat mellom to tabellverdier får den lavere poengsummen, etter forfatterinnledningen på side 4. WA-poeng er heltall. Tomme celler i særlig 5 km-tabellen beholdes som hull og fylles ikke ved interpolasjon. Resultater utenfor tabellens publiserte område får ingen oppdiktet poengsum.

`gradeWaResult(race, result)` velger samme `performanceTime` som resultatarkivet og aldersberegningen, inkludert eksplisitt valgt nettotid. Det beregnes fra full tid, aldri den avkortede tiden som vises i kortet. Road-tider går opp til neste hele sekund og banetider til neste hundredel dersom rådata har flere desimaler. Dette følger tabellpresisjonen og hindrer at resultatet blir raskere i beregningen. `measuredTime` er kun et visningsfelt og brukes ikke for å overstyre den valgte offisielle tiden.

Poengsummen er en lokal **tabellsammenligning av prestasjonen**. Den er ikke en offisiell World Rankings-poengsum. Det legges ikke til plasseringspoeng, og løypefall, gyldighet for rangering og annen WA-ratifikasjon er ikke evaluert her. Nettotid beholdes der klubbens resultatgrunnlag eksplisitt bruker dette.

## Kontroller

Uavhengig av ekstraksjonskodens valgte kolonner er 1000-poengradene lest fra sidene 137, 167, 197, 227 og 257 for menn og 556, 586, 616, 646 og 676 for kvinner. Disse brukes som fasit i testene for alle 20 støttede tabeller. Tester dekker også grenseverdier, desimaler, sparsomme gatekolonner, kjønn/underlag, net/gun-valg, DNF/DNS og manglende alder. Alle ekstraherte tidsterskler kjøres tilbake gjennom beregningen.

WA-poeng og eksisterende alders-/kjønnsjusterte Kjapp-poeng er forskjellige målestokker. 100 poeng ≈ verdensrekordnivå gjelder den eksisterende aldersjusterte skalaen, ikke WA-poengene.
