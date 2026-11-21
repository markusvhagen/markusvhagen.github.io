# World Athletics-import 20. november 2026

Brukeren godkjente WA-profilfunnene og resultatlisten med 12 utøvere, unntatt Henning Offigstad, under vilkår om at eksisterende data ikke skulle overskrives.

## Resultat

- 89 kildeoppføringer på 31 register-ID-er er lagret i `worldAthletics.performances`. Dette tilsvarer 88 unike forskningsrader; Stigs profil er knyttet til to eksisterende ID-er.
- 71 nye referansetider er lagt i `personalBests` på 28 ID-er: 53 fra profilens PB-utdrag og 18 fra brukergodkjente resultatfunn.
- Alle 13 tidligere manuelle PB-referanser er bevart. Manuelle referanser har fortsatt forrang.
- Henning Offigstad er helt uendret. Ingen utøvere er slått sammen.
- Ingen eksisterende løpsrader, plasseringer, klubbrekorder, navn, bilder eller fødselsår er endret. Historiske WA-resultater blir ikke lagt til som nye løp eller poengnoteringer.
- De 381 fullførte resultatene er uendret. Antallet PB-merker går fra 11 til 22; alle tidligere 11 beholdes.

`evidenceKind` skiller WAs eksplisitte profil-PB-er fra enkeltresultater. En brukerautorisert referanse fra et enkeltresultat påstår ikke at WA har verifisert utøverens livstids-PB.

## Avvik og opplysninger som er bevart

| Utøver/øvelse | WA | Eksisterende eller nyere opplysning | Håndtering |
| --- | --- | --- | --- |
| Eira Rapp, maraton | 2:42:52 | Manuell PB 2:41:27 netto | Manuell PB beholdt. WA-tidsgrunnlag er ukjent. |
| Camilla-Marie Flaaten, maraton | 2:41:02 | Berlin 2:40:13 netto, samme dato | WA beholdt som kilde, ikke aktiv referanse. |
| Camilla-Marie Flaaten, 5 km | 17:49 | Nidaros 17:08.8 | WA beholdt som kilde, ikke aktiv referanse. |
| Mari Steinkjer Øyen, 5 km | 17:31 | Trønder-Østløpet 17:17 | WA beholdt som kilde, ikke aktiv referanse. |
| Ingrid Lunde Steen, halvmaraton | 1:20:27 | Barcelona 1:20:00 netto, samme dato | WA beholdt som kilde, ikke aktiv referanse. |
| Ola Rossvoll, halvmaraton | 1:11:57 | København 1:11:24 året etter | WA beholdt som kilde, ikke aktiv referanse. |
| Tommy Bangjord Hove, halvmaraton | 1:03:06 | Barcelona 1:03:01 netto, samme dato | WA beholdt som kilde, ikke aktiv referanse. |
| Tommy Bangjord Hove, 10 km | 28:49 | Valencia 28:44 netto, samme dato | WA beholdt som kilde, ikke aktiv referanse. |
| Tommy Bangjord Hove, 5 km | 14:24 | Trønder-Østløpet 14:22 | WA beholdt som kilde, ikke aktiv referanse. |
| Stig Almåsbakk / Stig Erlend Almåsbakk, 10 km | 32:29 brutto | Valencia 32:24 netto | Begge tider og begge ID-er beholdt. Ingen ny aktiv referanse. |
| Anette Leistad, maraton | Profil-PB 3:01:03 | WA-resultat Oslo 2:58:50 | Begge kilder beholdt; den raskere 2:58:50 er aktiv referanse. |
| Sebastian Reinertsen, 5000 m | 14:33.17 | Databasen har også 14:33.17; klubbomtalen sier 14:33.29 | 14:33.17 importert som referanse; klubbomtaleavviket dokumentert. |
| Kristin Waaktaar Opland, 5000/10 000 m | 16:19.96 / 34:22.59 | Bare stevneperioden 6.–8. juli 2023 er kjent | Ingen eksakt løpsdag er oppfunnet. `dateRange` og `asOf` er brukt. |

Små forskjeller i gateløp kan skyldes netto/brutto. Tidsgrunnlaget for WA-rader er beholdt som ukjent der underlaget ikke dokumenterer det. Stigs bruttotid er eksplisitt dokumentert. Innendørsresultater er holdt atskilt fra utendørs, og samme short-track-resultat er ikke lagt inn to ganger.

De eksisterende referansene for Petters 5000 m samt Sofies, Ulriks og Vibekes maraton er beholdt uten duplikater. Alex Mauros Sacramento-resultat merket «Not legal» er fortsatt utelatt.

Maskinlesbare beslutninger finnes i `world-athletics-import-2026-11-20.json`. Originalkilder, datoer og godkjenningsmetadata følger de importerte oppføringene i utøverregisteret. Resultatene er basert på kartleggingen samme dag; ingen nye resultater er hentet etter brukerens godkjenning.

## Kontroll

20 automatiske tester bestått, blant annet manuell forrang, eksplisitt WA-godkjenning, separasjon av øvelser og miljø, og ingen PB uten referanse. En separat gjennomgang kontrollerte alle 89 kilderader mot kartleggingen og bekreftet bevaring av eksisterende data.
