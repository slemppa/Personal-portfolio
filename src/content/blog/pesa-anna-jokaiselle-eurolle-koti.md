---
title: "Pesä: anna jokaiselle eurolle koti"
date: 2026-06-05
description: Miksi rakensin local-first-budjetointisovelluksen, joka kääntää rahankäytön päälaelleen — ja miten se toimii.
tags:
  - budjetointi
  - [henkilökohtainentalous](/blog/nain-superhuman-on-rakennettu)
  - talousapp
  - mobiilisovellus
  - react-native
draft: false
---
## Ongelma: useimmat meistä budjetoivat peruutuspeilistä

Suurin osa talous- ja budjetointisovelluksista tekee saman asian: ne yhdistyvät pankkiisi, imevät tilitapahtumat sisään ja näyttävät kauniin kaavion siitä, mihin rahasi _jo menivät_. Kuukauden lopussa saat ilmoituksen, että ravintoloihin paloi taas liikaa. Kiitos vaan — sen tiesin jo.

Tämä on budjetointia peruutuspeilistä. Se kertoo menneestä, mutta ei auta tekemään parempia päätöksiä tulevasta. Ja se vaatii, että annat sovellukselle suoran pääsyn pankkitiliisi — eli luovutat kaikkein arkaluontoisimman datasi pilveen, jotta saat vastineeksi raportin.

Halusin jotain muuta: työkalun, joka auttaa _suunnittelemaan_ rahankäytön ennen kuin se tapahtuu, ja joka pitää datani omassa hallinnassani. Niin syntyi **Pesä**.

## Ratkaisu: kirjekuoribudjetointi, modernisti

Pesä perustuu vanhaan ja todistettuun ideaan — **kirjekuorimenetelmään**. Ajatus on yksinkertainen: kun rahaa tulee, jaat sen heti “kirjekuoriin” eri tarkoituksia varten. Vuokra, ruoka, polttoaine, lomarahasto, yllätyslasku. Jokaisella eurolla on tehtävä jo ennen kuin sitä on käytetty.

Tämä on sama filosofia, jonka YNAB (You Need A Budget) on tehnyt maailmankuuluksi. Pesä tuo sen suomalaiseen arkeen — suomeksi, eurolla, ja yksityisyys edellä.

Sovelluksen slogan tiivistää kaiken: **“Joka eurolle koti.”**

## YNAB:n neljä sääntöä — ja miten ne näkyvät Pesässä

Pesä mallintaa YNAB-metodologian neljä sääntöä suoraan tuotteen ytimeen:

**1. Anna jokaiselle eurolle tehtävä.**  
Kaiken keskiössä on **Jaettavissa**-luku (Ready to Assign). Se kertoo, paljonko rahaa odottaa kotia. Tavoite on saada se nollaan — ei siksi että raha loppuu, vaan siksi että jokainen euro on osoitettu johonkin.

**2. Varaudu todellisiin kuluihin.**  
Vakuutukset, joulu, auton katsastus — ne eivät ole yllätyksiä, ne ovat ennustettavia. Pesän kategoriatavoitteet voivat olla _kuukausittaisia_, _päivämäärään tähtääviä_ tai _uudelleentäyttyviä_, jotta isot harvat menot muuttuvat pieniksi kuukausittaisiksi siirroiksi.

**3. Jousta yli menneissä.**  
Budjetti ei ole kiveen hakattu. Jos ruokakassi ylittyy, siirrät rahaa toisesta kategoriasta. Pesä tekee tämän napilla — ei syyllisyyttä, vaan sopeutumista.

**4. Vanhenna rahaasi.**  
Pitkän aikavälin tavoite on käyttää tässä kuussa viime kuussa ansaittua rahaa. Pesän tapahtumahistoria luo pohjan tälle “rahan iän” seurannalle.

## Palkkavetoinen rytmi: “Palkka tuli” -rituaali

Tämä on Pesän selkein ero verrattuna automaattisiin sovelluksiin. Pesä **ei pollaa pankkiasi taustalla**. Sen sijaan se rakentuu yhden tietoisen hetken ympärille: palkkapäivän.

Kun palkka kolahtaa tilille, avaat **“Palkka tuli”** -näkymän. Se kirjaa tulon, lisää summan jaettavaan ja kutsuu sinut jakamaan rahat kirjekuoriin. Se on pieni kuukausittainen rituaali, joka tekee rahankäytöstä tietoista — viisi minuuttia, jotka antavat sinulle [hallinnan tunteen koko kuukaudeksi](/blog/nain-superhuman-on-rakennettu).

Pesä tukee erilaisia palkkasyklejä:

- kiinteä päivä kuussa,
- kuun viimeinen pankkipäivä,
- joka toinen viikko,
- tai täysin manuaalinen, jos tulosi vaihtelevat.

## Mitä Pesällä voi tehdä

**Onboarding-velho.** Ensimmäisellä käynnistyksellä luot budjetin, valitset valuutan, asetat palkkapäivän, saat YNAB-tyylisen valmiin kategoriapohjan ja lisäät ensimmäisen tilin. Muutamassa minuutissa olet valmis.

**Budjettinäkymä.** Kuukausittainen näkymä, jossa näet jokaisen kategorian kohdalla paljonko on _allokoitu_, _käytetty_ ja _käytettävissä_. Allokoi rahaa, siirrä kategorioiden välillä, aseta tavoitteita ja käytä pikatäyttöä.

**Tilit.** Manuaaliset tilit ja seurantatilit, työsaldo, sekä täsmäytys. Pidät kirjaa siitä, paljonko sinulla oikeasti on.

**Tapahtumat.** Lisää tuloja ja menoja, merkitse maksunsaaja, kategoria, muistio ja päivämäärä. Tuki jaetuille tapahtumille ja selvitetty/selvittämätön-tilalle.

**Kaksikielinen.** Täysi suomi (fi-FI) ja englanti (en-US) i18next-pohjalla.

## Yksityisyys ei ole ominaisuus — se on arkkitehtuuri

Pesä on **local-first ja offline-first**. Datasi elää laitteellasi paikallisessa SQLite-tietokannassa, ei jonkun pilvipalvelimella. Ensimmäisessä versiossa sovellus toimii kokonaan ilman verkkoa eikä lähetä taloustietojasi minnekään.

Tämä on tietoinen valinta. Talousdata on yhtä henkilökohtaista kuin terveysdata, ja mielestäni sen kuuluu pysyä käyttäjän hallinnassa oletuksena — ei vaihtokauppana ominaisuuksia vastaan.

Samalla arkkitehtuuri on suunniteltu kasvamaan. Tietokantaskeema on rakennettu valmiiksi tulevaa pilvisynkronointia varten (Supabase Postgres + rivitason käyttöoikeudet), ja tulonlähde-skeema on valmis vastaanottamaan avoimen pankkitoiminnan integraation (GoCardless / Enable Banking) — silloin kun käyttäjä sen _itse valitsee_, ei pakotettuna.

## Konepellin alla

Pesä on rakennettu modernilla, tyyppiturvallisella stackilla:

|Osa-alue|Teknologia|
|---|---|
|Sovelluskehys|Expo SDK 54 · Expo Router 6 · React Native 0.81|
|Kieli|TypeScript (strict)|
|Paikallinen tietokanta|Drizzle ORM + expo-sqlite|
|Tila|TanStack Query (data) + Zustand (UI)|
|Tyylit|NativeWind v4, tummasävyinen paletti|
|Lomakkeet|React Hook Form + Zod|
|Tallennus|MMKV profiilille, SecureStore tokeneille|
|Kielet|i18next (fi-FI, en-US)|
|Pilvi (suunniteltu)|Supabase Postgres + RLS + Edge Functions|

Rahaa käsitellään johdonmukaisesti **minoriyksiköissä** (sentteinä), jotta liukulukuvirheet eivät pääse mukaan — pieni mutta tärkeä yksityiskohta talussovelluksessa.

## Tiekartta: mitä on tulossa

Pesä on tarkoituksella aloittanut tiukasti rajatusta, viimeistellystä ytimestä. Seuraavaksi luvassa:

- **Pilvisynkronointi** laitteiden välillä (skeema valmiina),
- **Avoimen pankkitoiminnan integraatio** tulojen automaattiseen tunnistukseen,
- **Raportit ja “rahan ikä”** -mittari,
- **CSV-tuonti ja -vienti**,
- **Push-ilmoitukset**, ajastetut tapahtumat ja monivaluuttatuki.

## Lopuksi

Pesä syntyi yksinkertaisesta uskomuksesta: budjetoinnin ei pitäisi tarkoittaa menneen suremista, vaan tulevan suunnittelua — eikä sen pitäisi vaatia luovuttamaan yksityisyyttäsi. Anna jokaiselle eurolle koti, tee rauhassa se viiden minuutin palkkapäivärituaali, ja anna rahan tehdä töitä puolestasi.

**Pesä — joka eurolle koti.**