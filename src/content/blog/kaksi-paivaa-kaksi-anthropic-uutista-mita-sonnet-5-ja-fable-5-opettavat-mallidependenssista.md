---
title: "Kun malli katoaa yön yli — miksi ajan tuotannossa useaa mallia"
date: 2026-07-01
description: "Sonnet 5 halpensi agenttitehon ja Fable 5 katosi kahdeksi viikoksi vientirajoitusten takia. Kaksi Anthropic-uutista kahden päivän sisään, ja se miksi en enää nojaa yhteen malliin."
tags:
  - mallidependenssi
  - anthropic
  - tekoäly
  - ai-agentit
  - riskienhallinta
draft: false
---
Pyöritän sisältö- ja automaatiostackini n8n:n ja Claude Coden päällä, ja ajan tuotannossa useampaa mallia rinnakkain eri tehtäviin. Se on tuntunut ajoittain ylisuunnittelulta. Kesäkuun lopun kahtena päivänä sain aika suoran muistutuksen siitä, miksi teen niin.

30. kesäkuuta Anthropic julkaisi uuden mallin, joka teki agenttitason työstä selvästi halvempaa. Seuraavana aamuna se selitti, miksi yksi sen malleista oli ollut kokonaan poissa käytöstä yli kaksi viikkoa. Kaksi uutista, jotka näyttävät päinvastaisilta — hyvä ja huono — mutta jotka minulle kertoivat saman asian: mitä mallit tänään osaavat, ja miten vähän voit luottaa siihen, että saat käyttää niitä huomenna.

## Sonnet 5 halpensi sen, mikä oli äsken kallista

Sonnet 5:n juttu on yhdellä lauseella tämä: se tekee suunnilleen sitä mitä Opus 4.8, mutta murto-osalla hinnasta.

"Sitä mitä Opus" tarkoittaa tässä agenttimaista työtä — mallia, joka suunnittelee, käyttää työkaluja, debuggaa ja vie monivaiheisen homman loppuun asti ilman että sitä paimennetaan joka askeleella. Tähän asti se on ollut Opus-tason juttu. Halvemmat mallit olivat nopeampia, mutta vaativan tehtävän kohdalla ne tyypillisesti pysähtyivät kesken, kysyivät varmistusta tai jättivät oman virheensä huomaamatta.

Minua vakuutti eniten yksi testaajien kuvaama esimerkki. Malli sai bugiraportin, kirjoitti bugille toistavan testin, korjasi bugin — ja perui korjauksen hetkeksi varmistaakseen, että testi todella menee punaiselle ilman fixiä. Kaikki yhdellä ajolla, ilman että sitä käskettiin tekemään niin. Juuri tuo on agenttiputken heikoin lenkki: ei raaka älykkyys, vaan se luottaako malliin sen verran, että uskaltaa jättää sen tekemään loppuun yksin. Kun malli tarkistaa oman jälkensä, uskallan antaa sille enemmän.

Hinta ratkaisee, kun tällaista ajaa isolla volyymilla. Lanseeraushinta on 2 ja 10 dollaria per miljoona input- ja output-tokenia elokuun loppuun, sen jälkeen 3 ja 15. Opus 4.8 maksaa 5 ja 25. Käytännössä ne agenttitason ajot, jotka ennen kannatti kustannussyistä varata vain Opukselle, voi nyt ajaa Sonnet-hinnalla ilman että laatu romahtaa. Hinta-suorituskykykäyrä liikkuu koko ajan alaspäin, ja se on hyvä uutinen kaikille jotka rakentavat mallien varaan.

Mutta se ei ole koko kuva. Seuraava uutinen muistutti siitä, mitä hintalappu ei kerro.

## Fable 5 katosi kolme päivää julkaisunsa jälkeen

1. heinäkuuta Anthropic kertoi, mitä Fable 5:lle oli tapahtunut. Malli oli julkaistu 9. kesäkuuta, ja se oli ollut poissa käytöstä kaikilta, kaikkialla, yli kaksi viikkoa. Syy ei ollut tekninen vika vaan Yhdysvaltain hallituksen määräämät vientirajoitukset.

Taustaksi: Fable 5 ja Mythos 5 jakavat saman pohjamallin. Fable julkaistiin laajaan käyttöön vahvoilla turvarajoilla, Mythos taas kevyemmillä rajoilla vain pienelle joukolle luotettuja Project Glasswing -kumppaneita puolustukselliseen kyberkäyttöön. 12. kesäkuuta, kolme päivää Fablen julkaisun jälkeen, hallitus sovelsi vientirajoituksia molempiin. Taustalla oli Amazonin tutkijoiden raportti: he olivat löytäneet tavan kiertää Fablen turvarajat niin, että malli tunnisti ohjelmistohaavoittuvuuksia, ja yhdessä tapauksessa tuotti koodin, joka näytti miten haavoittuvuutta voisi käyttää. Määräys astui voimaan heti, eikä Anthropicilla ollut tapaa varmistaa käyttäjän kansalaisuutta reaaliajassa. Niinpä pääsy suljettiin kaikilta.

Kiinnostavin osa ei ole itse blokkaus vaan se, mitä Anthropicin oma jälkiselvitys paljasti. Kyse ei ollutkaan ainutlaatuisen vaarallisesta kyvystä. Samat haavoittuvuudet, jotka Fable raportissa tunnisti, löysivät myös selvästi heikommat mallit: Opus 4.8, GPT-5.5, Kimi K2.7. Ja se yksittäinen exploit-demo, joka koko kohun aiheutti, onnistui käytännössä jokaisella testatulla mallilla, mukaan lukien Haiku 4.5, Sonnet 4.6 sekä Opus 4.6 ja 4.7. Kyseessä oli siis melko rutiininomainen, pääosin puolustuksellinen kyberturvatehtävä. Fablen tarkoituksella laaja turvamarginaali vain sattui blokkaamaan sen "varmuuden vuoksi".

Se turvamarginaali on tässä olennainen käsite. Anthropicin turvaluokittelija on viritetty laukeamaan myös osaan täysin vaarattomia pyyntöjä, jotta yksikään aidosti haitallinen ei livahda läpi. Fablelle marginaali asetettiin isommaksi kuin koskaan aiemmin — tietoinen vaihtokauppa, jossa hyväksyttiin enemmän vääriä hälytyksiä, jotta muut kyvyt voitiin julkaista laajasti. Ja silti se ei riittänyt hallitukselle.

Korjaus oli uusi turvaluokittelija, joka kohdistuu juuri raportoituun tekniikkaan ja blokkaa sen yli 99-prosenttisesti; blokattu pyyntö ohjautuu automaattisesti Opus 4.8:lle. Kauppaministeriön CAISI-tutkijat testasivat toimet ja pitivät niitä poikkeuksellisen vahvoina. Malli palautettiin porrastetusti:

- **1.7.**: Fable palaa globaalisti, mutta vain Anthropicin omille pinnoille — API, Claude.ai, Claude Code, Cowork.
- **Ei vielä**: AWS, Google Cloud ja Microsoft Foundry. Pääsy luvataan "niin pian kuin mahdollista", ilman päivämäärää.
- **1.–7.7.**: Pro-, Max-, Team- ja valituilla Enterprise-tileillä Fable sisältyy tilaukseen, mutta katettuna puoleen viikoittaisesta käyttörajasta.
- **7.7. jälkeen**: käyttö siirtyy usage-crediteille. Standardi-Enterprisessä ei ole sisältyvää kiintiötä lainkaan.

Sivuvaikutus, jonka Anthropic myöntää itse suoraan: uusi luokittelija blokkaa nyt aiempaa useammin myös ihan tavallisia koodaus- ja debuggaustehtäviä. Vääriä hälytyksiä tulee lisää, ei vähemmän. Samassa yhteydessä Anthropic rakentaa Amazonin, Microsoftin, Googlen ja muiden Glasswing-kumppanien kanssa yhteistä tapaa arvioida jailbreakien vakavuutta — neljä kriteeriä: kuinka paljon pidemmälle ohitus vie kuin olemassa olevat työkalut, moneenko eri hyökkäystehtävään sama temppu toimii, kuinka helppo se on aseistaa, ja kuinka laajasti se on jo tiedossa. Vakavimman luokan tapauksille luvataan välittömät väliaikaissuojat ja 24/7-päivystys. Hyödyllistä alalle, mutta minun kannaltani sivujuonne.

## Mitä nämä kaksi päivää minulle opettivat

Erikseen luettuna toinen on lanseeraus ja toinen kriisiviestintää. Yhdessä ne piirtävät saman kuvan: mallidependenssi ei ole pelkkä hinta- ja laatukysymys. Se on myös geopolitiikkaa, ja se on "turvarajat voivat kiristyä yön yli ilman että kysytään sinulta".

Fablen tapaus ei lopulta ollut mallin oma vika sillä tavalla kuin ensimmäinen otsikko antoi ymmärtää. Se oli sääntelypäätös, joka tuli kolme päivää julkaisusta ja osui koko markkinaan yhtä lailla. Jos tuote nojaa yhteen malliin ilman varasuunnitelmaa, se on riippuvainen päätöksistä, joihin sen tekijällä ei ole mitään sananvaltaa. Ja koska turvarajat ovat liikkuva kohde, sama putki, joka toimii tänään, saattaa huomenna blokata täysin harmittoman koodianalyysin, jos se vain sivuaa sanaa "kyberturva".

Tästä syystä ajan tuotannossa useaa mallia rinnakkain. Se tuntuu turhalta niin kauan kuin kaikki toimii, ja juuri siksi sen huomaa vasta kun ei toimi. Kun yksi malli katoaa, alkaa kieltäytyä herkemmin tai muuttaa ehtojaan kesken viikon, työ reitittyy toiselle sen sijaan että koko putki pysähtyy. Sonnet 5 osoittaa, että agenttitason teho on nyt halvempaa ja luotettavampaa kuin koskaan. Fable 5 osoittaa, ettei "luotettava" tarkoita "aina saatavilla ehdoilla, jotka voit ennakoida". Molemmat pitävät paikkansa yhtä aikaa, ja sen kannattaa antaa vaikuttaa siihen, minkä varaan oman tuotteensa rakentaa.
