---
title: "Näin Superhuman on rakennettu"
date: 2026-06-04
description: "Avaava postaus siitä, miten henkilökohtainen Superhuman-valmennussovellus on rakennettu — iOS-sovellus, Supabase-backend, AI-valmentaja ja integraatiot."
tags:
  - superhuman
  - ios
  - supabase
  - arkkitehtuuri
cover: 
draft: false
---

Tämä on avaava postaus uudesta projektista nimeltä **Superhuman** — henkilökohtaisesta
iOS-sovelluksesta, joka kerää terveys-, treeni-, ravinto- ja tapatiedot yhteen
paikkaan ja antaa niiden päälle AI-valmentajan. Tässä postauksessa avaan, miten
sovellus on teknisesti rakennettu: mistä data tulee, missä se asuu ja miten
valmentaja päättelee.

## Iso kuva

Superhuman koostuu kolmesta kerroksesta:

1. **iOS-sovellus** näyttää datan ja kerää sitä — ennen kaikkea Apple HealthKitin
   kautta (syke, HRV, uni, askeleet, aktiivinen energia).
2. **Supabase-backend** on totuuden lähde: Postgres-tietokanta, jossa jokaisella
   taululla on rivitason käyttöoikeudet (Row Level Security), sekä joukko
   Edge-funktioita (Deno) raskaampaan logiikkaan ja integraatioihin.
3. **AI-valmentaja** istuu datan päällä ja keskustelee käyttäjän kanssa — mutta
   ei tyhjästä, vaan oman datan ja muistin pohjalta.

Kaikki käyttäjäkohtainen data on eristetty RLS:llä: data kuuluu aina yhdelle
`user_id`:lle, eikä sitä pääse näkemään kukaan muu. Tämä on perusta, jonka päälle
kaikki muu rakentuu.

## Data: terveys, treeni, ravinto ja tavat

Sovelluksen tietomalli jakautuu muutamaan selkeään alueeseen.

**Terveysmetriikat** virtaavat `daily_metrics`-tauluun: lepo- ja keskisyke, HRV,
unen vaiheet, askeleet ja aktiivinen energia. Jokaisella rivillä on `source`-kenttä
(esimerkiksi Apple Health), joten tiedetään mistä luku on peräisin.

**Treenimoottori** on sovelluksen sydän. Se on suunniteltu niin, että ohjelma
purkautuu hierarkiana: `training_programs` → `program_weeks` → `planned_sessions` →
`planned_exercises` ja juoksun puolella `running_plans` → `running_segments`.
Toteutuneet treenit kirjataan erikseen (`training_sessions`, `exercise_logs`,
`running_logs`), jolloin suunniteltua ja tehtyä voidaan verrata. Päälle tulee
viikkoanalyysi (`weekly_analyses`), joka tuottaa varoituksia (`engine_flags`) ja
adaptaatioita (`adaptations`) — eli ohjelma elää sen mukaan, miten keho vastaa.

**Ravinto** koostuu omasta ruokatietokannasta (`custom_foods`,
`exercises_catalog`-tyyppiset hakemistot) ja päiväkirjasta (`food_log_entries`).

**Tavat ja rutiinit** (`routines`, `routine_steps`, `routine_completions`) tukevat
identiteettipohjaista tekemistä: jokaiseen rutiiniin liittyy "identity" ja
ankkuri (kellonaika tai tapahtuma), ja jokaiselle askeleelle on myös "kahden
minuutin versio" matalan kynnyksen suorittamiseen.

Lisäksi mukana on tavoitteet ja virstanpylväät (`goals`, `goal_metrics`,
`goal_milestones`), painonseuranta, sekä luetun ja kuunnellun media-arkisto
(`books`, joka tukee myös Spotify-podcasteja).

## AI-valmentaja: RAG oman datan päälle

Valmentaja ei ole pelkkä chatbot. Se on rakennettu hakuavusteisen generoinnin
(RAG) periaatteella oman datan päälle:

- Keskustelut tallennetaan (`coach_messages`) lähdeviittauksineen (`citations`),
  jolloin vastaukset voidaan jäljittää takaisin oikeaan dataan.
- Pitkäkestoinen muisti (`coach_memories`) tallentaa tiivistelmiä **vektoreina**
  — käytössä on Postgresin `pgvector`-laajennus HNSW-indeksillä, joten valmentaja
  löytää relevantit muistot semanttisella haulla.
- Telemetria (`coach_telemetry`) seuraa, mitä työkaluja valmentaja käytti, kuinka
  kauan ne kestivät ja menivätkö ne läpi — eli valmentajan toimintaa voi
  havainnoida ja virittää.

Embeddingit lasketaan omassa `embed`-Edge-funktiossa ja muisti tiivistetään
taustalla `coach-consolidate-memory`-funktiolla. Erillinen `insight-miner` kaivaa
datasta huomioita (`insights`) ilman, että käyttäjän tarvitsee kysyä mitään.

## Edge-funktiot ja integraatiot

Raskaampi ja ulospäin puhuva logiikka on eristetty Supabasen Edge-funktioihin
(Deno/TypeScript). Karkeasti kolmessa ryhmässä:

- **Strava-integraatio:** `strava-oauth-callback`, `strava-sync`, `strava-push`,
  `strava-refresh-activity` ja `strava-backfill-routes` hoitavat OAuthin, suoritusten
  synkronoinnin ja reittien (polyline) tuonnin.
- **Ravinto-AI:** `food-search`, `food-parse` ja `nutrition-coach` hakevat,
  jäsentävät ja valmentavat ruokakirjauksia.
- **Valmentajan tausta-ajot:** `embed`, `coach-consolidate-memory` ja
  `insight-miner`.

Tietokannan puolella hyödynnetään muutamaa tehokasta laajennusta: `pg_cron`
ajastaa toistuvat työt, `pg_net` hoitaa asynkroniset HTTP-kutsut tietokannasta
käsin, ja `pgvector` mahdollistaa valmentajan semanttisen muistin. Reitit ja
sijainnit nojaavat Mapbox-profiileihin (`planned_routes`, `route_history`).

## Mikä tässä on kiinnostavaa

Lopputulos on järjestelmä, jossa **data, päättely ja toiminta ovat samassa
ympyrässä**: HealthKit ja Strava tuovat raakadatan, Postgres pitää sen
turvassa ja jäsenneltynä, treenimoottori muuttaa sen ohjelmaksi, ja AI-valmentaja
sulkee silmukan keskustelulla, joka perustuu juuri sinun lukuihisi — ei
yleisneuvoihin.

Seuraavissa postauksissa sukellan syvemmälle yksittäisiin osiin: ensin
treenimoottorin periodisointiin ja adaptaatioihin, sitten valmentajan muistiin ja
RAG-putkeen. Tervetuloa mukaan rakentamaan superihmistä — yksi commit kerrallaan.
