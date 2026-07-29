# Portfolio-remontti: 6 projektia, yhtenäinen ilme, lead capture

**Päivämäärä:** 2026-07-29
**Status:** Hyväksytty (design-keskustelu käyty, laajuus B valittu)
**Tavoite:** Sivusto myy itse itseään niin, että inbound-keikkaa alkaa tulla merkittävästi.

## Lukitut päätökset

1. **Positiointi:** Fullstack-tuoterakentaja. Hero myy tuotantovalmiiden tuotteiden rakentamista, ei automaatiokonsultointia. Automaatio/Mak8r.fi jää omaksi palvelukerroksekseen.
2. **Kieli:** Koko sivusto fi + en samalla `/en`-prefiksimallilla, jota blogi jo käyttää.
3. **Kuvat:** Otetaan Chrome-automaatiolla oikeista tuotteista, 2–4 kpl/case, `public/cases/<slug>/`.
4. **Rehellisyys:** Kaikki sivun luvut ovat todennettavia (repoista mitattuja tai tuotannosta). Keksityt telemetrialuvut (127 liidiä / 17 s / 94 %) poistetaan.
5. **Laajuus B:** Sisältöremontti + yhtenäistäminen. Ei täyttä rebuildia, ei SSG-remonttia.

## 1. Positiointi & hero

- Kärkiviesti: rakentaa tuotantovalmiita tuotteita yksin tai tiimin kärkenä — "tuotantojärjestelmiä, ei demoja" säilyy sloganina.
- Heron todennettavat luvut: **6 tuotantotuotetta · yli 400 000 riviä koodia · ~3 000 automaattitestiä · 423 julkaisua** (summat mitattu repoista 2026-07; julkaisut = Rascal AI:n release-tagit).
- Titteli: Sami Kiias · CTO @ Rascal AI · Founder @ Mak8r.fi (ennallaan).
- Hero-CTA:t: ensisijainen → lead-lomake (ei mailto), toissijainen → projektit.

## 2. Rakenne & yksi totuuden lähde

- `src/lib/cases.ts` on ainoa paikka, jossa projektidata asuu. Etusivun projektikortit generoidaan siitä React-saarekkeena (markup.ts:n käsinkirjoitettu projektiosio poistetaan ja korvataan mount-pisteellä, kuten Build in Public -osiossa jo tehdään).
- `CaseStudy`-tyyppiin lisätään `lang`-tuki rinnakkaisina fi/en-kenttinä. EN-reitti on `/en/projektit/:slug` — sama prefiksimalli kuin blogissa (`/en/blog`), slugit pysyvät samoina molemmilla kielillä. Kielivaihto säilyttää nykyisen sivun.
- Projektit ja järjestys:
  1. **rascal-ai** (featured)
  2. **rascal-crm** (featured)
  3. **rascal-pages** (featured, UUSI)
  4. **altio** (ent. superhuman)
  5. **pesa**
  6. **perhe-app** (UUSI)
- Home-sivun muut osiot (manifesti, tech, tarina, yhteys) säilyvät, mutta copy päivitetään positioinnin mukaiseksi ja käännetään.

## 3. Case-sisällöt — kärki per projekti

Jokainen case: ongelma → ratkaisu (3–4 numeroitua askelta) → todennettavat luvut → tekninen kohokohta, jonka ostaja muistaa. Luvut tutkimuksesta (2026-07-29, repoista mitattu):

| Case | Muistettava kärki | Todennettavat luvut |
|---|---|---|
| Rascal AI | Tuote on itse MCP-serveri, jossa itse rakennettu OAuth 2.1 -auktorisointipalvelin (PKCE, DCR, token-rotaatio). AI-äänihaastattelu → sisältöstrategia -putki. | ~207 000 riviä, 423 julkaisua, ~1 280 yksikkötestiä + 113 e2e, 78 taulua, 27 edge-funktiota, 56 reittiä |
| Rascal CRM | Soittokeskus selaimessa: Twilio-rinnakkaissoitto + live-AI-coach (~700 ms). Workflow-moottori 13 step-tyypillä. Kahden Supabase-projektin tenanttieristys. | ~123 000 riviä, 192 API-reittiä, ~1 594 testiä, 50 taulua, 101 migraatiota |
| Rascal Pages | Repo-per-site: jokainen asiakassivu on oma GitHub-repo + Vercel-projekti, provisiointi täysin automaattinen. Sivun voi luoda puhumalla (ElevenLabs → Claude). Asiakas omistaa koodinsa — handoff-komento olemassa. | ~28 000 riviä, 17 blokkia + 16 editoria, 8 templatea, 216 testiä |
| Altio | Kaksitasoinen valmennus: deterministinen progressiomoottori (auditoitava, ilmainen, välitön) + LLM-viikkokatsaus. Offline-jono dead-letterillä. pgvector-muisti + yökonsolidointi. Pearson-korrelaatio-insightit. | ~70 000 riviä, 35 näyttöä, 15 edge-funktiota, 50 migraatiota, iOS+Android+PWA yhdestä koodipohjasta |
| Pesä | Senttitarkka velkavyörytys-allokaattori (summa täsmää aina, deterministinen jäännösjako — yksikkötestattu). Kaksinkertainen kirjanpito velanmaksuissa. Raha aina minor units -kokonaislukuina. | ~12 000 riviä, 19 API-reittiä, 13 taulua, fi+en |
| Perhe-app | Auth käyttäjille, joilla ei voi olla tiliä: lapset 5-merkkisellä koodilla, security definer -RPC:t RLS:ää heikentämättä. Realtime-synkka tabletin ja vanhemman puhelimen välillä. Rakennettu 3 päivässä. | ~3 900 riviä, 6 taulua, 16 Postgres-funktiota, 7 RLS-policya |

Rehellisyyssäännöt caseissa:
- Altio: private beta — ei väitetä App Store -julkaisua. HealthKit on roadmapilla, ei integroitu → nykyinen "iOS HealthKit-data" -outcome korjataan (Strava-integraatio on todellinen).
- Pesä: nykyinen "Local-first data laitteella" -väite on vanhentunut (nyt Neon-pilvibackend) → korjataan.
- Perhe-app: viikkonäkymä on placeholder — ei mainita kalenteria featurena.
- Rascal-luvut merkitään mittaushetken mukaan ("heinäkuu 2026").

## 4. Designin yhtenäistäminen

- Yksi tokenisto: etusivun mustavalkoinen koneisto-ilme (#0a0b0d-tausta, valkoinen teksti, mono-eyebrowt, hiusviivat) viedään `index.css`:n `@theme`-tokeneiksi, ja case-/blog-/contact-/offer-sivut siirretään niihin. Sininen aksentti (#3b82f6) poistuu.
- Fontit kaikkialla: Space Grotesk (UI/otsikot) + JetBrains Mono (labelit, luvut, eyebrowt).
- `markup.ts`:n HTML-string-rakenne saa jäädä muille osioille — vain projektiosio korvataan React-saarekkeella.
- Kielivaihtokytkin naviin (fi ⇄ en), sama mekanismi kuin blogissa.

## 5. Lead capture & konversio

Olemassa oleva pohja (säilyy): `/api/contact` → Neon `portfolio_leads` (honeypot, Brevo/Resend-notifikaatio), `/hallinta`-admin, `/yhteys`-sivu.

Uutta:
1. **Kaikki CTA:t lomakkeeseen.** `mailto:` poistuu CTA:ista (CaseStudy, hero, yhteys-osio, footer). Case-sivun CTA-osioon inline-ContactForm. Sähköpostiosoite saa näkyä yhteystietona, mutta ensisijainen polku on lomake.
2. **Source-attribuutio.** Jokainen lomake lähettää `source`-arvon (`hero`, `case:rascal-crm`, `blog:<slug>`, `yhteys`, `footer`) → nähdään mikä sisältö konvertoi.
3. **Brevo-listasynkkaus.** `/api/contact` lisää liidin Brevon kontaktilistalle, **jos** käyttäjä rastitti markkinointiluvan. Lomakkeeseen valinnainen checkbox: "Saa lähettää sähköpostia projekteista ja kirjoituksista". Ilman rastia liidi tallentuu vain Neoniin yhteydenottona (GDPR: suostumus eksplisiittinen, consent-tieto talteen `portfolio_leads`-tauluun).
4. **Blogin newsletter-kaappaus.** Kevyt pelkkä-email-lomake blogilistaan ja postausten loppuun ("Saat uudet kirjoitukset mailiin") → sama `/api/contact` eri sourcella + pakollinen consent (newsletter on aina markkinointilupa).
5. **Live-koneisto → totta.** Osio kytketään omaan todelliseen liidiputkeen: visualisoi lomake → Neon → Brevo → notifikaatio -virran ja näyttää todelliset luvut (esim. liidien määrä `/api/contact?list=1`-datasta tai staattisesti päivittyvä). Keksityt luvut pois.

Schema-muutos: `portfolio_leads` + `marketing_consent boolean not null default false` (+ mahd. `consent_at timestamptz`).

## 6. Kuvakaappaukset

- Chrome-automaatiolla: rascalai.fi (tuote-UI), CRM (pipeline/soittonäkymä), Pages (editori + julkaistu sivu), Altio (web-app + marketing), Pesä (budjettinäkymä), Perhe-app (lapsinäkymä + vanhempi-dashboard).
- Tallennus `public/cases/<slug>/`, `gallery`-kenttään caption molemmilla kielillä.
- Tuotteista, joihin ei pääse kirjautumaan selaimella, otetaan julkinen näkymä tai jätetään galleria-slotti käyttäjän täydennettäväksi — ei feikkikuvia.

## 7. Rajaukset (ei tehdä nyt)

- Ei SSG/per-sivu-meta-remonttia (SPA-rajoite hyväksytään toistaiseksi).
- Ei uusia blogipostauksia.
- Ei muutoksia Offer/Admin-toiminnallisuuteen (paitsi tokenisto-ilme).
- Ei rascal-admin/auth/id/design -paketeille omia caseja (mainitaan korkeintaan Rascal-alustan osana).

## Testaus

- `parsePost`/`cases`-datamuutoksille yksikkötestit olemassa olevaan Vitest-settiin (mm. case-datan eheys: kaikilla caseilla molemmat kielet, kuvatiedostot olemassa).
- Lead-flown testit: consent-logiikka (`parseLead`-laajennus) yksikkötestataan `api/_lib`-tasolla.
- Manuaalinen savutesti: molemmat kielet, kaikki 6 casea, lomake submit → Neon-rivi + Brevo-kontakti (testiavaimella).

## Onnistumiskriteerit

- Kaikki 6 projektia esillä kuvineen ja todennettavine lukuineen, fi + en.
- Yksi ilme kaikilla sivuilla; projektin lisäys = yksi muutos `cases.ts`:ään.
- Yksikään CTA ei ole mailto; liidit tallentuvat Neoniin ja luvalliset Brevoon source-tiedolla.
- Sivulla ei yhtään keksittyä lukua.
