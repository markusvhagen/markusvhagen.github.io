# Bratsberg · Resultatbørs

Resultatbørs og portal i HTML, CSS og JavaScript. Alle fiktive løp, demoprofiler og eksempeloppføringer er fjernet fra datagrunnlaget.

## Åpne og bygge

Dobbeltklikk `Bratsberg-resultatbors.html`. Filen inneholder widget, arkiv, rekorder, stafetter, terminliste og data. Eksterne portretter og nettskrifter krever nett; initialer og lokale skrifter er reserve. Markus sitt opplastede portrett er innebygd. Kjør `python3 build_demo.py` etter kildeendringer. Det historiske filnavnet er beholdt; byggingen lager ikke demodata.

For separate JSON-filer og moduler: kjør `python3 -m http.server 8080 --directory dist` fra prosjektmappen og åpne `http://localhost:8080`. Ved publisering lastes innholdet i `dist/` opp til klubbens nettsted.

## Visning

- Forsiden velger de ti nyeste faktiske løpene etter løpsdato. Nå er det ni løp og ett ikke-klikkbart «Her kommer det flere løp snart»-kort.
- Karusellen viser to løp på desktop og ett på mobil. Den skifter etter 20 sekunder med rød fremdriftsring. Manuell pause, tastaturstyring og redusert bevegelse støttes.
- Forsiden velger automatisk inntil seks forskjellige utøvere fra hvert løp: klubbrekord først, deretter gull, sølv, bronse og øvrige resultater. Medaljer krever kontrollert kjønnsplassering. Innen samme prioritet kommer raskeste tid først; like tider beholder kilderekkefølgen. Rekkefølgen følger kortene fra venstre mot høyre og deretter nedover. Tidligere `featuredAthleteIds`-utvalg og PB-merker overstyrer ikke denne prioriteringen.
- Arkivet viser ti løp per side, nyeste først. Søk og filtre gjelder hele arkivet før paginering. Direktelenker åpner riktig side. Åpnede løp viser alle fullførte resultater, gruppert etter distanse og sortert fra raskeste til langsomste tid. `result-order.js` sammenligner tider numerisk og sorterer en kopi før visning; rådataenes rekkefølge endres ikke. DNS/DNF vises verken som kort, i tellinger eller som filtre.
- Gull, sølv og bronse gjelder første-, andre- og tredjeplass innen kjønn på distansen. Aldersklasseplassering og samlet plassering på tvers av kjønn gir ikke medaljefarge.
- Bekreftede klubbrekorder får røde kort og hele teksten «Klubbrekord». Pallplass beholdes som et separat medaljeikon med skygge, også på røde kort.
- Aldersklassen fra resultatkilden vises på løperkortene, også ved PB. Forbedringsmarginer som «−33 s» vises ikke; historikkberegningen og PB-merkene er bevart.
- Rektangulære portretter ligger til venstre på mørke løperkort. Portalen viser fem kort per rad på brede flater og tilpasser seg mindre skjermer. Ingen global header/footer.

## Innlagte løp

| Løp | Dato | Kildeoppføringer | Vises på nettsiden |
| --- | --- | ---: | ---: |
| Hytteplanmila | 17.10.2026 | 10 | 10 |
| Trondheim Skogsmaraton | 03.10.2026 | 16 | 15 |
| Heim Halvmaraton | 27.09.2026 | 7 | 6 |
| København halvmaraton | 20.09.2026 | 10 | 10 |
| Trondheim Maraton | 06.09.2026 | 83 | 71 |
| Trønderenergi-mila | 12.08.2026 | 39 | 38 |
| Trønder-Østløpet | 16.06.2026 | 37 | 37 |
| Nidaros Løpefest | 23.05.2026 | 39 | 39 |
| Berlin halvmaraton | 29.03.2026 | 3 | 3 |
| **Sum** | | **244** | **229** |

229 oppføringer har sluttid og vises. De 12 DNS- og 3 DNF-oppføringene beholdes bare i kildedataene for etterkontroll. `prepareResultsData` filtrerer dem bort før nettsidens visninger bygges. Kilde-URL, startnummer, originalnavn, klasse og kildens plassering er bevart. Trondheim-PDF-ens ene treff på etternavnet «Bratsberg» med en annen klubb er utelatt. Trønder-Østløpet-PDF-en dekker alle klubber; bare Bratsberg-oppføringer er importert. Sofia Malene Sliper representerer Ranheim i akkurat denne kilden, men er med for Bratsberg i Trønderenergi-importen.

Hytteplanmila er hentet fra arrangørens komplette UltimateLIVE-søk etter Bratsberg: 10 med sluttid, samt fem påmeldinger uten tid som ikke er tatt inn som resultater. Kjønns-, total- og klasseplassering er kontrollert mot de offisielle deltakerkortene. Nettotid vises; bruttotid bevares separat.

Nidaros Løpefest inneholder alle 39 Bratsberg-oppføringer fra de komplette kjønnsdelte 5 km- og 10 km-listene hos Sportsidioten, kontrollert mot Kondis (431 fullførte totalt). Sportsidiotens tideler er bevart. Tidene er ikke merket netto/brutto når kildene ikke angir dette. Direkte uthenting fra EQs dynamiske resultatliste var ikke tilgjengelig; dette er dokumentert i kildemetadata.

## Plasseringer og tider

`position` og `positionScope` beskriver kildens plassering; `positionClass` bevarer aldersklasseplassering. Kortene bruker `positionGender` bare når `positionGenderVerified` er `true`, eller `position` når `positionScope` uttrykkelig er `gender`. Ukjente kjønnsplasseringer skjules.

EQ-PDF-ene blander kjønn i «Rank». Sofie Karoline Haugens 4 i Trondheim er samlet plassering; hun ble **nummer 2 blant kvinnene** på 10 km. Verifisert kjønnsplassering lagres separat. `positionGenderSource` og eventuell `rankingReview` dokumenterer kontrollgrunnlaget.

Alle 71 fullførte Trondheim-resultater er kontrollert mot Sportsbasens komplette resultatkopier med EQ Timing som oppgitt kilde. Kjønnsplassering avledes som én pluss antall av samme kjønn med lavere publisert totalplassering. Navn, tid, distanse og totalplassering kobler kontrollen til PDF-oppføringen; delte plasseringer bevares. Disse listene avklarer tidligere usikre halvmaratonplasseringer og erstatter eldre avvikende rangeringer. Dette er kontroll mot sekundære resultatkopier; direkte uthenting av EQs dynamiske resultatlister var ikke tilgjengelig.

Trønder-Østløpets kjønnsplasseringer er beregnet fra alle 265 fullførte i den komplette PDF-en. Der flere har lik publisert sekundtid, vises ingen plassering; et mulig intervall ligger i `positionGenderRange`. Klasseplasseringen er bevart. Klubbens fem pallplasseringer er entydige.

De 57 øvrige kontrollerte kjønnsplasseringene fra Heim, Trønderenergi-mila og Skogsmaraton samsvarer med publiserte kjønnsdelte resultatlister.

Rikard Sundes publiserte kjønnsplassering i Heim avviker fra PDF-ens totalplassering sammenholdt med kvinnetidene. Plasseringen holdes skjult, og avviket er dokumentert.

Vibeke Stenhaug på Trønderenergi-milas 5 km har ulikt etternavn i PDF-en og en ekstern resultatkopi. PDF-navnet og tiden beholdes, uten automatisk overføring av kjønnsplassering.

Berlin bruker skjermbildets nettotid (`time`/`netTime`) og separat `gunTime`. Arrangørens regler bekrefter netto-rangering utenfor topp 50 per kjønn. København og EQ-PDF-ene har `timeBasis: "unspecified"` når kilden ikke skiller netto-/bruttotid. Små avvik mot eldre nettsider er dokumentert; skjermbildets opplysninger beholdes. Ola Rossvolls 1:11:24 i København er kontrollert mot klubbens artikkel.

Sofie Karoline Haugens 16:07 i Trønder-Østløpet, 1:09:17 i København og 31:31 i Hytteplanmila er merket «Klubbrekord» fordi dato, utøver og tid samsvarer med klubbens oppgitte rekordliste. Andre historiske klubbrekordmerker krever kontroll.

## Vinnertider og klubboppslag

Alle ni løp har vinnertider for menn og kvinner på hver registrerte distanse: 16 distanser og 32 vinnere. Blått og rosa merke viser hele vinnernavnet over tiden ved datoen på forsiden og i arkivet. Lange navn brytes over flere linjer. Løp med flere distanser får en liten nedtrekksmeny som viser ett vinnerpar om gangen; menyen åpner ikke selve resultatlisten. Tidstype og eventuelt omfang vises ved å holde pekeren over merket.

Hvert løpsobjekt kan ha `winners`, en liste med `distance`, `men` og `women`. Hver vinner har `name`, `time`, `sourceUrl`, `verified: true`, `timeBasis` (`net`, `gun` eller `unspecified`) og `checkedAt`. Valgfri `scope` beskriver et viktig avvik i hva resultatlisten omfatter. Bare verifiserte, gyldige tider vises; manglende opplysninger vises som strek. Vinnerne hentes aldri automatisk fra klubbens eget utvalg av resultater.

København viser vinnerne av arrangørens samlede resultatliste, inkludert VM-eliten. Hytteplanmila bruker publisert nettotid. For EQ-løpene er komplette kjønnsdelte resultatkopier kontrollgrunnlaget der den dynamiske originalvisningen ikke kunne hentes; de nøyaktige kildene og forbeholdene ligger i løpsfilene. Dette er kontrollerte registreringer, ikke automatisk oppdatering fra arrangørene.

Valgfri `news` på et løp inneholder objekter med `title` og `url`. København er koblet til [Klubbrekorder i Køben](https://www.bratsbergfriidrett.no/2026/09/20/klubbrekorder-i-koben/). Lenken vises som en knapp med rødtonet bakgrunn og ramme både i karusellen og i arkivet. Bare HTTPS-lenker til `bratsbergfriidrett.no` eller `www.bratsbergfriidrett.no` godtas.

## Alders- og kjønnsjusterte poeng

Resultatkortene i portalen viser **referansetid / løpstid × 100**, beregnet med nøyaktig de numeriske tabellene fra [Kjapp-kalkulatoren](https://markusvhagen.github.io/kjapp/), hentet 30.10.2026. Høyere er bedre; 100 poeng tilsvarer referansetiden for alder, kjønn og distanse. I forklaringsfeltet står «100 poeng ≈ verdensrekordnivå». Tabellene bygger på verdensbeste prestasjoner og tilpassede kurver, og referansetidene er ikke nødvendigvis dagens offisielle rekorder. Poeng over 100 er mulig. Velg «Høyeste justerte poeng først» for å sortere innen hvert løp og hver distanse; resultater uten poeng kommer sist. Standardvisningen er fortsatt raskeste tid først.

`age-standards.js` inneholder et lokalt tabelløyeblikksbilde, kildeadresser og SHA-256 for originalscriptet. Kjapp viser til [Alan Jones' Age-Grade-Tables](https://github.com/AlanLyttonJones/Age-Grade-Tables), som er publisert under CC0-1.0. Kalkulatoren oppgir ikke tabellutgave; derfor kalles metoden «Kjapp-tabellen», uten et antatt WMA-årstall. Tallene er beholdt uten justering, inkludert avviket i mennenes yngste halvmaratonrad. Ingen eksterne tabeller lastes ved bruk.

`age-grading.js` støtter gate på 5 km, 10 km, halvmaraton og maraton for alder 5–100 år. Bane, terreng, andre distanser og ikke-fullførte resultater får ingen poeng. Kjønn og den samme visningstiden som resultatkortet brukes, inkludert nettotid der dette er definert. Beregnet `ageGrade` finnes bare i minnet, ikke som et vedlikeholdt felt i løpsfilene.

Aldersgrunnlaget prioriteres slik: eksplisitt heltallsalder i `result.age`, deretter `birthDate` (ISO-dato), deretter `birthYear` (heltall). Fødselsdato/-år på resultatet har prioritet over samme felt i utøverregisteret. Med fødselsdato brukes alder på løpsdagen. Med bare fødselsår brukes alderen utøveren fyller i løpsåret, tydelig forklart i visningen. Aldersklasser omgjøres aldri til en antatt alder.

37 profiler har kildebelagt `birthYear` hentet fra «Født»-kolonnen i den innsendte komplette Trønder-Østløpet-PDF-en. Kilden er bevart i `birthYearSource`. Dette gir poeng for 83 av dagens 229 resultater. For øvrige profiler kan et bekreftet fødselsår eller en fødselsdato legges til i `dist/data/athletes.json` og brukes automatisk i alle løp.

Knappen «Legg inn alder», eller alderen ved en beregnet poengsum, åpner en fødselsårdialog. Slike endringer gjelder bare egen nettleser, lagres per utøver-ID og kan tilbakestilles til registeret. De oppdaterer alle utøverens arkivresultater, men skriver ikke til JSON-filer eller andre besøkendes visning. Hvis nettleseren blokkerer lokal lagring, virker endringen i gjeldende økt med en tydelig beskjed.

## Beregnet personlig historikk

Løpsfilene lagrer ikke `pb` eller `previousBest`. `performance-history.js` leser hele arkivet og manuelt registrerte perser i utøverregisteret etter profilkoblingen. Den beregner `performanceHistory` i minnet uten å endre JSON-filene. Den samme JavaScript-funksjonen brukes i nettsiden og kontrollscriptet; PB-beregningen trenger ikke et Python-script.

`isPersonalBest` betyr enten en strengt raskere tid enn utøverens beste kjente sammenlignbare tid fra en tidligere dato, eller en manuelt bekreftet pers koblet til akkurat dette løpet. Første arkivresultat kan få PB når det slår en eldre manuell pers, eller er eksplisitt bekreftet slik det er beskrevet nedenfor. Første registrering og beste registrerte tid får ikke automatisk PB. Lik tid med en tidligere prestasjon og ikke-fullførte løp gir heller ikke PB. Resultater på samme dato sammenlignes ikke innbyrdes når startrekkefølgen er ukjent. Senere forbedringer fjerner ikke en tidligere historisk PB. `isBestRecorded` angir separat om tiden fortsatt er best i alle kjente data, inkludert manuelle oppføringer.

For å merke en bekreftet pers i et allerede registrert løp, legg løpets eksakte `raceId` på den daterte oppføringen i utøverens `personalBests`. Utøver-ID, øvelse/underlag, `raceId`, dato og numerisk tid må alle samsvare. `36:56` og `36:56.0` er samme tid. Ukjent løpsdato (`asOf`), et annet løp eller en tidligere like rask/raskere tid gir ingen slik bekreftelse. Beregningen setter `isManualPersonalBest` og `confirmedPersonalBests` i `performanceHistory`, og kortets PB-merke forklarer at persen er bekreftet i utøverregisteret. Når eldre tid mangler, forblir `previousBest` og forbedringsmargin tomme.

Hver utøver kan ha en valgfri `personalBests`-liste i `dist/data/athletes.json`. Tom liste betyr at ingen manuelle perser er lagt inn. Dette er et **fiktivt dokumentasjonseksempel**, ikke en registrert utøver eller virkelig tid:

```json
{
  "id": "eksempel-utover",
  "name": "Eksempelutøver",
  "personalBests": [
    {
      "type": "road",
      "distance": "Halvmaraton",
      "time": "1:25:00",
      "date": "2025-09-14",
      "eventName": "Tidligere halvmaraton",
      "source": "Oppgitt av utøveren"
    }
  ]
}
```

Legg listen inn på den eksisterende profilen og behold de øvrige feltene. `type`, `distance` og `time` er påkrevd, sammen med en gyldig ISO-dato (`YYYY-MM-DD`) i `date` eller `asOf`. `date` er dagen tiden ble løpt, ikke dagen den ble skrevet inn. `eventName` og `source` er valgfrie kildeopplysninger. Bane krever også `"environment": "outdoor"`; terreng krever `courseId` som samsvarer med løpsfilen. Hvis løpsdatoen er ukjent, bruk `"date": null` og `"asOf": "2026-10-29"` (datoen persen ble bekreftet). Denne tiden brukes bare som tidligere sammenligningsgrunnlag for løp etter `asOf`; den endrer ikke tidligere løps historiske PB-vurdering. Ikke gjett løpsdatoer som mangler.

Markus Valås Hagen har fire brukerbekreftede perser: 3000 m 10:10 (registrert som bane utendørs), 5 km 18:11, 10 km 36:56 (Nidaros Løpefest 23.05.2026) og halvmaraton 1:21:03 (nettotid, Berlin 29.03.2026). Nidaros og Berlin er koblet til sine løp med `raceId` og vises med PB-merke. De to første har ukjent løpsdato og `asOf: "2026-10-29"`; ingen tilhørende arkivresultater er lagt inn.

**Behold tidligere manuelle oppføringer når du legger til en nyere pers.** De trengs for å vurdere historiske løp riktig. Raskeste tidligere tid brukes uansett om den kommer fra arkivet eller utøverregisteret; en langsommere manuell oppføring svekker aldri sammenligningsgrunnlaget. Nye løpsresultater som finnes i arkivet trenger ikke også legges inn manuelt. Manuelle perser vises ikke som egne løp eller resultater.

`performanceHistory.previousRaceIds` peker på tidligere arkivløp som gir sammenligningsgrunnlaget, og `previousPersonalBests` på manuelle oppføringer som gjør det samme. `hasManualBaseline` angir om det finnes en tidligere gyldig manuell tid i samme øvelse, også når arkivet senere har en raskere tid. `basis` er da `manual-and-recorded-history`, ellers `recorded-history`. Ugyldige manuelle oppføringer brukes ikke; `collectManualPersonalBests()` rapporterer dem med utøver-ID, indeks i listen og årsak.

Sammenligningen bruker stabil utøver-ID og normalisert distanse, og skiller gate fra bane utendørs. Terrengløp må ha eksplisitt `courseId` for å kunne sammenlignes; dagens skogsmaratonresultater vises, men får ingen beregnet PB. Berlin sammenlignes med nettotid. Automatisk beregnede PB-merker bygger på registrert historikk; manuelt bekreftede merker har eget kildegrunnlag i utøverregisteret.

Kontroller hele arkivet med `node scripts/check-personal-bests.mjs`, eller et nytt løp mot arkivet og manuelle perser med `node scripts/check-personal-bests.mjs sti/nytt-lop.json`. Scriptet skriver en JSON-rapport til standardutdata og endrer ingen filer.

## Neste løp

- Jessheim Vintermaraton: **8. november 2026**, 10 km, halvmaraton og maraton. [Arrangør](https://www.vintermaraton.no/event-details/jessheim-vintermaraton-2026).
- Valencia Maraton: **6. desember 2026**, maraton. [Arrangørens regler](https://www.valenciaciudaddelrunning.com/en/marathon/regulations-valencia-marathon/).

13 planlagte starter er registrert: Øivind Estensen på maraton og Markus Valås Hagen / Øystein Haugen på halvmaraton i Jessheim; ti løpere på maraton i Valencia. Navnene og distansene ligger i `upcoming.json`. Både terminlisten og forhåndsvisningen av påmeldte henter profilbilder fra fellesregisteret via `athleteId`. Terminlisten har større rektangulære portretter; initialer brukes bare når bilde mangler eller ikke kan lastes.

## Data og videre import

`dist/data/index.json` lister alle løpsfiler og datakildene. `races/` har ett objekt per løp. `athletes.json` er felles profiler, `records.json` er individuelle rekorder, `relays.json` er lagrekorder og `upcoming.json` er terminlisten.

Et nytt løp trenger `id`, `name`, ISO-dato i `date`, `location`, `type`, `distances`, `demo: false`, `results` og kildehenvisning. `type` er `road`, `track` eller `trail`. Resultater har utøver-ID/navn, `gender` (`K`/`M`), distanse, `status` og `time`. Bruk `time: null` for DNS/DNF i kildedata; de skjules på nettsiden. Ikke legg inn `pb` eller `previousBest`—disse opplysningene beregnes fra historikken. Startnummer og kilde-ID er separate felt, ikke klubbens `athleteId`.

Legg løpsfilens sti i `races` i `index.json`, oppdater `updatedAt`, og bygg den samlede HTML-filen på nytt. Nettleseren leser JSON ved lasting, men overvåker ikke mappen. Det finnes foreløpig ingen automatisk scraper eller bakgrunnsjobb. Python eller Node.js kan senere hente og normalisere data. Disse PDF-importene er kontrollerte engangsimporter, ikke en generell parser.

## Profiler og bilder

Registeret har 152 profiler for faktiske utøvere, hvorav 34 har bilder. Det er ikke et bekreftet medlemsregister; nye profiler følger resultatkildens klubbtilhørighet. Samme `athleteId` brukes i alle løp og stafetter.

Navnekoblingen bruker kjent ID først, deretter fullt normalisert navn eller eksplisitt alias. Den bruker ikke ansiktsgjenkjenning eller omtrentlig navnelikhet. `identityReview` beskriver uavklarte navnevarianter: Jonas Olaf Onshuus og Anders Resell er foreløpig separate profiler med mulig kobling til eksisterende profiler. Rolf Solheimsdal Johansen / Rolf Solheimdal Johansen / Rolf Johansen og Julie Selboe / Julie Maaø Selboe er også holdt separate inntil navnevariantene er bekreftet. Nye mulige varianter fra de siste importene er Henrik Berg Kristensen / Henrik Kristensen, Stig Almåsbakk / Stig Erlend Almåsbakk, Kristian Selnes / Kristian Stokke Selnes og Knut Bjørtomt Ødegaard / Knut Ødegaard. Disse har `identityReview` og er ikke slått sammen automatisk.

Markus Valås Hagens portrett bruker det opplastede fjellbildet, med utsnitt rundt personen til høyre. Originalbildet ligger innebygd i profilen, så det fungerer også i den samlede HTML-filen uten en ekstern bildelenke.

Bytt `photo.src` én gang for å endre bildet overalt. `crop.x`/`y` angir utsnitt i prosent; `zoom` kan være 1–4. `fallbackSrc` er valgfri. Hvis bildene ikke lastes, vises initialer. Kilde og kreditering er bevart. Hedda Leirviks nummer i bildeutsnittet er bekreftet til 557.

Kjør `node scripts/check-athletes.mjs` for å kontrollere alle profilkoblinger, eller legg til filstien til ett nytt løp. Kontrollen endrer ingen data.

## Rekorder og stafetter

Individuell rekordliste har 20 registrerte rekorder og to tomme øvelser: 800 m menn og 3000 m hinder kvinner. Oppdateringsdato 17.10.2026 følger den nyeste oppgitte rekorden. Sofies halvmaratonrekord er København.

`record-check.js` lager kontrollkandidater fra reelle, eksplisitt kvalifiserte resultater (`recordEligible: true`) og skiller gate fra bane utendørs. Den overskriver ikke rekordlisten. Importene har ikke fått slik kvalifisering automatisk.

| Stafett | Kvinner | Menn | Etapper |
| --- | --- | --- | ---: |
| Trondheim-stafetten 2026 | 1:11:05 · 1. plass | 1:01:22 · 1. plass | 10 |
| Holmenkollstafetten 2026 | 1:00:31 · 6. plass i klassen | 53:01 · 4. plass i klassen | 15 |

Offisiell sluttid brukes som rekord, ikke summen av avrundede etappetider. Holmenkoll-nettotidene 1:00:30/53:00 er bevart i kildedataene, men vises ikke på nettsiden. Lagets første-, andre- eller tredjeplass markeres med gull, sølv eller bronse bare på plasseringsmerket; gull får pokal. Banneret er nøytralt, løperkortene er mørke, og et ekstra «Klubbrekord»-merke er utelatt. Plasseringens omfang, blant kjønn eller i klassen, følger den registrerte kilden. Trondheim sisteetappe følger arrangørens etapperekorder: Petter 7:09, Eira 8:09; avvik mot delstrekker er dokumentert. Bare stafetter med registrert rekord vises. Olavstafetten og St. Olavsloppet har ennå ingen registrerte rekorder; sistnevnte støtter fremtidig dagfiltrering.

## Innbygging og tester

Et iframe til `/resultater/widget.html` kan bygges inn etter opplasting av `dist/`. Bruk full bredde og tilpass høyden, omtrent 840 px. Widgetlenker åpner portalen i hele vinduet. Direktelenker bruker `resultater.html#lop/trondheim-maraton-2026`; stafetter bruker `#stafettrekorder/trondheim-stafetten/K`.

```sh
node --test tests/*.test.mjs
node scripts/check-athletes.mjs
node scripts/check-personal-bests.mjs
python3 build_demo.py
```

Testene dekker profilkobling, bildereserver, tider, beregnet personlig historikk, filtrering av ikke-fullførte, rekordlogikk, medaljer, plasseringstype, ti karusellplasser, arkivpaginering, direktelenker, nedtelling, vinnertider, klubboppslag, alders- og kjønnsjustering, poengsortering og lokal alderslagring. Isolerte testdata er ikke en del av nettstedets datagrunnlag. Visuell nettlesertesting og publisering har ikke vært tilgjengelig i byggemiljøet.
