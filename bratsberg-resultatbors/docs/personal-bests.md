# PB-markering

PB vises bare når utøveren har en gyldig `personalBests`-referanse i samme øvelse, og løpstiden er lik eller bedre enn denne. Manuelle referanser uten `sourceProvider` har forrang. Når en slik referanse finnes for øvelsen, brukes ingen WA-referanse i terskelen eller historikksammenligningen. Ellers kan brukerens godkjente WA-referanser brukes. Blant gjeldende referanser brukes den raskeste. Et raskere tidligere registrert resultat hindrer at en senere svakere tid får PB.

Registrerte løp alene etablerer aldri en PB. Uten en manuell eller brukergodkjent WA-referanse vises ingen PB, selv om løperen forbedrer tidligere tider i arkivet. «Beste registrerte» beregnes fortsatt separat.

Sammenligningen skiller mellom gate, bane utendørs, bane innendørs og terrengløyper. Terrengløp krever identisk `courseId`. Hinder og flatt er separate øvelser. PB-støtten for 200 m, 400 m, 1000 m og 2000 m hinder utvider ikke klubbrekordreglene. DNF, DNS og ugyldige tider gir aldri PB. Løpets eksplisitt valgte tidsgrunnlag (`net` eller `gun`) beholdes.

Referansen må ha en gyldig `date` eller, når løpsdato er ukjent, `asOf`. Referansetiden gjelder også for eldre resultater. `asOf` skal ikke fremstilles som datoen rekorden ble satt. Lik numerisk tid er tilstrekkelig; match krever ikke `raceId`.

De eksisterende 13 manuelle PB-referansene er bevart. WA-importen 20.11.2026 la til 71 referanser etter brukerens godkjenning. Nye manuelle referanser kan senere legges i `dist/data/athletes.json` og får forrang i den aktuelle øvelsen.

WA-referanser krever `sourceProvider:"world-athletics"`, `userApproved:true` og `evidenceKind` lik `profile-personal-best` eller `competition-result`. Den siste kategorien er et dokumentert løpsresultat brukeren har godkjent som referanse, ikke en påstand om at WA har bekreftet livstids-PB. `sourceUrl`, `checkedAt` og eventuell datoperiode følger oppføringen.

Alle godkjente kildeopplysninger ligger separat i utøverens `worldAthletics.performances`, også langsommere/utdaterte tider og punkter som allerede har en manuell referanse. Dette feltet gir aldri PB i seg selv. Den raskeste egnede nye tiden per øvelse er kopiert til `personalBests`. Tider langsommere enn eksisterende resultater er ikke aktivert som referanser; netto/brutto-avvik er bevart uten endring av resultatene. Se `world-athletics-import-2026-11-20.md` for avvik og omfang.

Både `dist/` og den selvstendige `Bratsberg-resultatbors.html` bruker samme regel. Arkivfilter, PB-teller, resultatkort og PB-merker leser det sentralt beregnede feltet `performanceHistory.isPersonalBest`.

Kjør kontrollene med:

```sh
node --test tests/personal-bests.test.mjs
```
