# PB-markering

PB vises bare når utøveren har en gyldig, bekreftet `personalBests`-referanse i samme øvelse og underlag, og løpstiden er lik eller bedre enn denne. Manuelle referanser uten `sourceProvider` har forrang over WA i samme PB-klasse. Blant gjeldende referanser brukes den raskeste. Et raskere tidligere registrert resultat hindrer at en senere svakere tid får PB. Registrerte resultater alene oppretter aldri en PB-referanse.

## Øvelser og underlag

Gate og bane holdes adskilt. Bane innendørs og utendørs deler én PB-klasse; `environment` beholdes som kildemetadata, men er ikke del av PB-nøkkelen. Hinder og flatt er separate øvelser. Disse PB-reglene endrer ikke klubbrekordregler eller WA-poengberegning.

PB støtter også 3 km gate, engelsk mil gate (1609,344 m), 100/200/400/1000 m bane og 2000 m hinder uten å utvide klubbrekordstøtten. Terreng krever samme `courseId` og samme øvelse. Birkebeinerløpet og Løpebirken samles som én årlig PB-klasse når `courseId` er `birkebeinerlopet`. Kortere Birken-varianter eller andre løyper kobles ikke automatisk.

Brukeren har uttrykkelig godkjent Vemund Gurholts tider 8:48 / 15:01 / 30:51 for både 3000/5000/10000 m bane og 3/5/10 km gate. Dette er lagret som to eksplisitte referanser per punkt, ikke som en generell overgang mellom bane og gate.

## Presisjon og tidsgrunnlag

Bane bruker alle oppgitte desimaler. Utenfor bane rundes både referanser og resultater ned til hele sekunder før enhver PB- eller historikksammenligning. Dermed matcher 37:07.9 en gate-PB på 37:07, mens 37:08 ikke gjør det. På bane matcher 35:24.01 ikke en referanse på 35:24.00.

Visningen følger samme presisjonsregel. Originale CSV-felt, rå løpsresultater og WA-kildetider bevares. `performanceHistory.comparisonTime` og `comparisonSeconds` viser sammenligningsverdien. Referanser i historikken beholder den opprinnelige verdien som `sourceTime`. Rå tider til poengberegning og separate klubbrekordkontroller beholdes.

Løpets eksplisitte valg av `net` eller `gun` styrer tidsgrunnlaget. DNF, DNS og ugyldige tider gir aldri PB. En gyldig resultatdato overstyrer løpsdato for stevner som går over flere dager. Samme dags resultater vurderes samlet fordi startrekkefølgen ikke er kjent.

## Referanser og kildeprioritet

Referansen må ha gyldig `date` eller, når løpsdato er ukjent, `asOf`. Referansetiden gjelder også eldre resultater. `asOf` er datoen referansen ble kjent, og fremstilles ikke som datoen rekorden ble satt. Match krever ikke `raceId`.

WA-referanser krever `sourceProvider:"world-athletics"`, `userApproved:true` og `evidenceKind` lik `profile-personal-best` eller `competition-result`. Sistnevnte er et dokumentert løpsresultat brukeren har godkjent som referanse, ikke en påstand om at WA har bekreftet livstids-PB. `worldAthletics.performances` lagrer kildedata separat og gir aldri PB i seg selv. Se `world-athletics-import-2026-11-20.md` for importens historiske omfang.

Uavklarte nye manuelle svar kan fortsatt bevares i `manualPbSubmissions` med `needs-review`. De etablerer ingen PB. `personalBestReviewBlocks` kan sperre WA i en konkret utøvers øvelse på gate eller bane; en baneblokk gjelder nå samlet inne/ute. Blokker endrer ikke gyldige manuelle referanser. Et kombinert CSV-felt kopieres ikke automatisk til begge underlag. Manglende inne/ute for en kjent banetid krever derimot ikke avklaring.

## CSV-en etter brukerens avklaring 21. november 2026

Alle 44 svar og 176 tidspunkter er behandlet: 171 importerte punkter og 5 allerede eksisterende. De 41 siste punktene ga 44 nye referanser, inkludert Vemunds tre ekstra underlagsreferanser. 16 tidsavvik er gjennomgått og 7 tidligere referansetider er rettet med uttrykkelig brukergodkjenning. Ingen CSV-punkter eller WA-sperrer gjenstår. Registeret inneholder 258 referanseoppføringer og 179 utøvere. Antall referanser er ikke antall PB-merker.

Trond Sliper har gate 10 km 35:12, bane 10000 m 35:24.00 og engelsk mil gate 4:59. Hans halvmaraton 1:18:32 matcher fortsatt den bekreftede nettotiden fra Amsterdam. Ingvild Saksvik-Lehouilliers halvmaraton er rettet til 1:30:17. Alle øvrige avklaringer og rettelser står i [brukeravklaringsrapporten](manual-pb-user-clarifications-2026-11-21.md).

Både `dist/` og den selvstendige `Bratsberg-resultatbors.html` bruker samme regel og samme utøverdata. Arkivfilter, PB-teller, resultatkort og PB-merker leser `performanceHistory.isPersonalBest`. «Beste registrerte» beregnes separat og er ikke en PB-bekreftelse.

Kjør kontrollene med:

```sh
node --test tests/*.test.mjs
```
