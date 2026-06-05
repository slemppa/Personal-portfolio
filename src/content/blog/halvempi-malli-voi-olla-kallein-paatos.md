---
title: '"95 % halvempi malli" on monessa agenttiprojektissa kallein päätös, jonka voit tehdä'
date: 2026-06-05
description: "Tekoäly ilmainen kuulostaa hyvältä – mutta agenttien TCO voi räjähtää. Katso laskentamalli, riskimatriisi ja päätöspuu. Varaa 30 min."
tags: [tekoäly ilmainen]
draft: false
---
# Tekoäly ilmainen? Halpa malli voi maksaa eniten

Tekoäly ilmainen -ajatus on monessa agenttiprojektissa kallein oletus, jonka voit tehdä. Kun agentti ei ole “yksi prompti” vaan 50–200 pientä mallikutsua, hinta ei muodostu vain tokenirivistä vaan epäonnistumisista, viiveestä ja ylläpidosta. Tässä CTO-näkökulma siihen, milloin halpa malli oikeasti säästää – ja milloin se syö myyntituloksen.

## Mitä “tekoäly ilmainen” oikeasti tarkoittaa yrityskäytössä? (UI vs API)

Kun puhutaan **tekoäly ilmaisesta**, moni ajattelee ensisijaisesti ilmaisia chat-käyttöliittymiä, kuten ChatGPT:n tai Googlen Geminin välilehteä selaimessa. Näillä voi kokeilla ideoita, kirjoittaa sähköposteja tai generoida markkinointitekstejä ilman alkuinvestointeja. Mutta kun siirrytään yrityskäyttöön – erityisesti myynti- ja CRM-prosesseihin – “ilmainen” muuttuu nopeasti harhaanjohtavaksi käsitteeksi.

Ilmaiset käyttöliittymät on suunniteltu yksittäisille käyttäjille, ei automaatioille tai agentteille. Ne rajoittuvat usein muutamaan sataan pyyntöön päivässä, eikä niissä ole tarjolla kriittisiä ominaisuuksia, kuten tool use -toimintoja, JSON-muotoisia vastauksia tai räätälöityjä integraatioita. Lisäksi ne voivat olla hitaampia, sillä resurssit jaetaan miljoonien käyttäjien kesken. Esimerkiksi yrityksen myyntiputkessa, jossa käsitellään satoja liidejä päivässä, ilmainen chat-käyttöliittymä ei yksinkertaisesti skaalaudu.

API-käytössä tilanne on toinen. Tekoäly ilmainen -avainsanalla markkinoidut palvelut, kuten tietyt avoimen lähdekoodin mallit tai rajoitetut API-tasot, voivat tarjota alhaisemman lähtöhinnan per token. Mutta tässä piilee suurin kompastuskivi: **yrityskäytössä kustannus ei ole pelkästään tokenien hinta, vaan agentin kokonaiskustannus (TCO)**. Tämä tarkoittaa tokenien lisäksi epäonnistumisia, viiveitä, ylläpitoa ja integraatioita. Esimerkiksi jos agentti epäonnistuu 10 %:ssa tapauksista ja jokainen epäonnistuminen vaatii manuaalisen tarkistuksen, kustannus nousee nopeasti – vaikka tokenihinta olisi nolla.

Yrityksille on myös olennaista ymmärtää, missä “ilmainen” loppuu. Käyttörajat, kuten rate limitit, voivat katkaista kampanjan kesken. Saatavuusongelmat, kuten API-katkokset, voivat hidastaa myyntiprosessia. Ja jos dataa käytetään mallin koulutukseen, se voi aiheuttaa tietoturvariskejä, jotka eivät ole hyväksyttäviä yritystasolla. Ilmainen tekoäly ei myöskään tarjoa SLA-takuita, lokitusta tai tietosuojakäytäntöjä, joita yritykset tarvitsevat luotettavan toiminnan takaamiseksi.


## Agentin kokonaiskustannus (TCO): tokenit + epäonnistumiset + viive + ylläpito

Kun puhutaan tekoälyn kustannuksista yrityskäytössä, pelkkä tokenihinta on vain jäävuoren huippu. Todellinen kustannus muodostuu agentin kokonaiskustannuksesta (TCO), joka kattaa neljä keskeistä tekijää: tokenit, epäonnistumiset, viiveet ja ylläpidon. Näistä jokainen voi moninkertaistaa kustannukset, jos niitä ei hallita systemaattisesti.

Tokenikustannukset ovat suoraviivaiset: jokainen lähetetty ja vastaanotettu token maksaa. Mutta agenttien maailmassa tokenit eivät ole yksittäisiä pyyntöjä, vaan ketjuja. Esimerkiksi liidien rikastuksessa yksi agenttikeikka voi vaatia 10–20 API-kutsua: liiditietojen haku, segmentointi, viestin generointi, CRM-päivitys ja lopuksi tarkistus. Jos jokainen kutsu käsittelee 2 000 tokenia ja tokenihinta on 0,50 € per 1M tokenia, kustannus per keikka on jo 0,01–0,02 € pelkästään tokeneista. Mutta tämä on vasta alkua.

Epäonnistumiset ovat kustannusten piilotehosekoitin. Jos agentti epäonnistuu 5 %:ssa tapauksista – esimerkiksi väärän tiedon takia tai formaatin virheen vuoksi – jokainen epäonnistuminen vaatii uuden kutsun. Tämä tarkoittaa, että 100 keikasta 5 epäonnistuu, ja jokainen epäonnistunut keikka voi vaatia 2–3 retry-kutsua. Kustannus ei siis ole enää 100 × 0,02 €, vaan 115–130 × 0,02 €. Ja jos retry-kutsujen määrä nousee, kustannukset seuraavat perässä.

Viiveet ovat toinen piilokustannus. Jos agentin p95-latenssi on 5 sekuntia, se tarkoittaa, että 95 %:ssa tapauksista vastaus saadaan alle 5 sekunnissa. Mutta jos viive nousee 10–15 sekuntiin – esimerkiksi pitkän kontekstin tai monimutkaisen routingin takia – se hidastaa koko myyntiprosessia. Viiveet voivat johtaa siihen, että liidit vanhenevat, asiakkaat odottavat tai kampanjan ajoitus menee pieleen. Ja jos agentti ei skaalaudu, kustannus realisoituu menetettyinä myyntimahdollisuuksina.

Ylläpito on neljäs, usein unohdettu kustannustekijä. Agenttien rakentaminen, testaaminen, monitorointi ja päivittäminen vaativat aikaa ja osaamista. Jos yrityksellä ei ole omaa AI-tiimiä, ylläpito voi tarkoittaa ulkoistettua konsultointia, joka maksaa satoja tai tuhansia euroja kuukaudessa. Lisäksi integraatiot, kuten CRM- tai sähköpostijärjestelmät, vaativat jatkuvaa huoltoa. Jos agentti epäonnistuu, joku joutuu selvittämään syyn – ja tämä aika on pois muusta työstä.

Agenttiloopeissa virheet kertautuvat, koska yksi väärä oletus voi johtaa ketjuun epäonnistumisia. Esimerkiksi jos agentti luokittelee liidin väärin, se voi lähettää väärän viestin, päivittää CRM:n virheellisesti ja jättää follow-upin tekemättä. Jokainen näistä virheistä vaatii manuaalisen korjauksen, mikä nostaa kustannuksia entisestään. Siksi on olennaista mitata agentin suorituskykyä tunnusluvuilla, kuten success rate (onnistumisprosentti), retry rate (uudelleenyritysten määrä), p95 latency (viive) ja **cost per opportunity** (kustannus per myyntimahdollisuus). Nämä mittarit kertovat, kuinka tehokkaasti agentti todella toimii – ja missä on parantamisen varaa.


## Esimerkkilaskelma numeroilla: miksi “95 % halvempi malli” voi olla kallein

Kun vertaillaan tekoälymalleja, tokenihinta on usein ensimmäinen – ja joskus ainoa – mittari. Mutta kuten edellä todettiin, tokenihinta on vain yksi osa kokonaiskustannusta. Katsotaanpa konkreettista esimerkkilaskelmaa, jossa vertaillaan kahta vaihtoehtoa: (A) vahvempaa, kalliimpaa mallia ja (B) halvempaa, mutta epäluotettavampaa mallia. Skenaariomme on liidien rikastus, viestin generointi ja CRM-päivitys, joka vaatii keskimäärin 80 API-kutsua per keikka.

Aloitetaan oletuksista. Taulukossa on esitetty molempien mallien keskeiset tunnusluvut:

| Mittari                     | Vaihtoehto A (vahva malli) | Vaihtoehto B (halpa malli) |
|-----------------------------|---------------------------|---------------------------|
| Tokenihinta (€/1M tokenia) | 1,00 €                   | 0,05 €                   |
| Keskimääräinen tokenimäärä  | 2 000                    | 2 500                    |
| Peruskutsut per keikka      | 80                       | 80                       |
| Routing-lisäkutsut          | 5 % (4 kutsua)           | 20 % (16 kutsua)         |
| Retry-%                     | 2 %                      | 15 %                     |
| p95-viive                   | 3 s                      | 10 s                     |
| Ihmistarkistus (min/keikka) | 0,5 min                  | 2 min                    |

Lasketaan ensin tokenikustannukset. Vaihtoehdossa A jokainen keikka kuluttaa 80 kutsua × 2 000 tokenia = 160 000 tokenia. Lisäksi routing-lisäkutsut (4 kpl) ja retry-kutsut (2 % × 84 = 1,68 ≈ 2 kutsua) nostavat kokonaiskutsut 86:een. Kustannus on siis 86 × 2 000 × 1,00 € / 1 000 000 = 0,172 € per keikka. Vaihtoehdossa B tokenimäärä on suurempi (2 500 tokenia per kutsu), ja kutsut nousevat 80 + 16 (routing) + 12 (15 % retry) = 108:een. Kustannus on 108 × 2 500 × 0,05 € / 1 000 000 = 0,0135 € per keikka.

Mutta tokenikustannukset ovat vasta alkua. Lisätään ihmistyö. Vaihtoehdossa A ihmistarkistus vie 0,5 minuuttia per keikka, mikä tarkoittaa 0,5 × 30 €/h = 0,25 € per keikka. Vaihtoehdossa B tarkistus vie 2 minuuttia, eli 2 × 30 €/h = 1 € per keikka. Nyt kokonaiskustannukset ovat:

- Vaihtoehto A: 0,172 € (tokenit) + 0,25 € (ihmistyö) = 0,422 € per keikka.
- Vaihtoehto B: 0,0135 € (tokenit) + 1 € (ihmistyö) = 1,0135 € per keikka.

Vaikka vaihtoehto B on tokenikustannuksiltaan 95 % halvempi, sen kokonaiskustannus on yli kaksinkertainen. Tämä johtuu epäonnistumisista, lisätyöstä ja viiveistä. Ja jos huomioidaan vielä menetetyt myyntimahdollisuudet viiveiden takia, ero kasvaa entisestään.

Johtopäätös on selvä: **kustannus per myyntimahdollisuus** on ainoa relevantti mittari. Jos halpa malli tuottaa enemmän virheitä, viiveitä ja manuaalityötä, se on lopulta kalliimpi – vaikka tokenihinta olisi lähes ilmainen.


## Piilokulu #1 – Routing ja monimallipino: luokittelukutsu(t), virhepolut ja observability

Routing ja monimallipino ovat tehokkaita työkaluja, mutta ne tuovat mukanaan piilokuluja, joita harvoin huomioidaan “tekoäly ilmainen” -keskusteluissa. Routing tarkoittaa sitä, että agentti valitsee tehtävälle sopivimman mallin tai työkalun sen perusteella, mitä tehtävää ollaan suorittamassa. Esimerkiksi liidien segmentointi voi käyttää kevyttä mallia, kun taas tarjouspohjan generointi vaatii vahvempaa mallia. Mutta tämä valinta ei tapahdu ilmaiseksi.

Ensimmäinen piilokulu on luokittelukutsu. Ennen kuin agentti voi valita oikean mallin, sen on ensin määritettävä, mikä tehtävä on kyseessä. Tämä vaatii usein erillisen API-kutsun luokittelijamallille. Jos luokittelija epäonnistuu, koko ketju voi mennä pieleen. Esimerkiksi jos luokittelija määrittelee liidin väärin, agentti voi lähettää sille väärän viestin tai käyttää väärää mallia. Tämä johtaa retry-kutsujen ketjuun, mikä nostaa kustannuksia ja viiveitä.

Toinen piilokulu on virhepolut. Routing ei ole pelkästään onnistumisten ketju, vaan myös varasuunnitelmien verkosto. Jos ensisijainen malli epäonnistuu, agentin on osattava valita fallback-malli tai -polku. Tämä vaatii monimutkaista logiikkaa, joka on altis virheille. Esimerkiksi jos fallback-malli ei tue JSON-muotoisia vastauksia, agentin on osattava käsitellä tämä formaattiero. Ja jos formaatti muuttuu, integraatiot voivat mennä rikki, mikä vaatii manuaalista korjausta.

Kolmas piilokulu on observability. Kun agentti käyttää useita malleja ja polkuja, on olennaista tietää, mikä meni pieleen ja missä. Tämä vaatii kattavan lokituksen ja tracingin, jossa jokainen kutsu ja vastaus tallennetaan. Observability ei ole pelkästään virheiden jäljittämistä, vaan myös suorituskyvyn optimointia. Esimerkiksi jos routing-valinta johtaa toistuvasti epäonnistumisiin tietyssä polussa, tämä on korjattava. Mutta observabilityn rakentaminen ja ylläpito vaativat aikaa ja resursseja – ja ne maksavat.

Lopuksi, testaus ja regressiot ovat kriittisiä. Kun mallia tai routing-logiikkaa päivitetään, on varmistettava, että muutokset eivät riko olemassa olevia toimintoja. Tämä vaatii kattavia testejä, jotka kattavat kaikki mahdolliset polut ja virhetilanteet. Ja jos testaus epäonnistuu, seuraukset voivat olla kalliita: virheet voivat päätyä tuotantoon, mikä johtaa manuaalisiin korjauksiin ja menetettyihin myyntimahdollisuuksiin.

Routing kannattaa silloin, kun tehtävät ovat selkeästi rajattuja ja laatuvaatimukset deterministisiä. Esimerkiksi rutiinitehtävät, kuten liidien segmentointi tai yksinkertaisten viestien generointi, voivat hyötyä kevyemmistä malleista. Mutta jos tehtävä vaatii monimutkaista päätöksentekoa tai pitkää kontekstia, routing voi lisätä enemmän kustannuksia kuin hyötyä.


## Piilokulu #2 – Cache puuttuu: maksat samoista tokeneista joka ajossa

Yksi suurimmista piilokuluista tekoälyagenttien käytössä on se, että samoista tokeneista maksetaan uudestaan ja uudestaan – ellei cachea hyödynnetä systemaattisesti. Cache, eli välimuisti, tarkoittaa sitä, että agentti tallentaa aiemmin generoidut vastaukset ja käyttää niitä uudelleen samanlaisissa tilanteissa. Tämä voi vähentää kustannuksia jopa 50–80 %, mutta silti moni yritys jättää sen hyödyntämättä.

Agentit toistavat usein samoja asioita. Esimerkiksi yrityksen profiili, palvelulupaus, tone-of-voice -ohjeet tai prosessikuvaukset lähetetään agentille joka kerta, kun se generoi viestin tai päivittää CRM:ää. Jos näitä tietoja ei cacheta järkevästi, maksat samoista tokeneista yhä uudelleen – joka ajossa.

Cachea kannattaa rakentaa kahdella tasolla. Ensimmäinen on prompt/response-cache deterministisissä kohdissa: kun lämpötila (temperature) on matala ja syöte on sama, vastaus voidaan tallentaa ja palauttaa suoraan välimuistista. Cache-avain muodostetaan mallista, parametreista ja promptin hashista, jolloin sama kysely ei mene mallille kahta kertaa. Toinen on embedding-cache usein haetuille dokumenteille, kuten yritysesittelylle, palvelukuvauksille ja ohjeistuksille – näitä ei kannata laskea uudelleen joka kerta.

Sudenkuoppa piilee monimallipinossa. Jos käytössä on monta provideria, eri parametreja ja eri vastausformaatteja, cache jää usein “tehdään myöhemmin” -tasolle, koska yhtenäistä avainta ja formaattia on vaikea ylläpitää. Lopputulos on nurinkurinen: säästät senttejä per token, mutta poltat euroja toistoon. Siksi vasteformaatit kannattaa yhtenäistää ja TTL- sekä invalidointilogiikka miettiä heti, ei vasta optimointivaiheessa.


## Piilokulu #3 – Pitkä konteksti: kustannuspiikit ja hidastuva suoritus

Kolmas piilokulu syntyy siitä, että halvempaa mallia paikataan syöttämällä sille enemmän kontekstia. Kun malli ei päättele yhtä luotettavasti, houkutus on lisätä ohjeita, esimerkkejä ja taustatietoa promptiin “varmuuden vuoksi”. Agenttityössä konteksti ei ole vain chat-historia, vaan CRM-merkinnät, verkkosivutekstit, aiemmat sähköpostit, kilpailija- ja toimialadata sekä työjonot ja sääntökirjat. Jokainen lisätty rivi maksaa tokeneina joka kutsulla.

Pitkä konteksti kostautuu kolmella tavalla. Se nostaa tokenimäärää suoraan, se hidastaa suoritusta (pidempi syöte = suurempi viive), ja se alkaa maksaa myös ihmisajassa: odotus, tarkistus, korjaus ja uudelleenajo. Halvan mallin “säästö” valuu siis hukkaan, kun sama tieto työnnetään ketjun läpi yhä uudelleen.

Ratkaisu ei ole dumpata kaikkea promptiin. Käytä RAGia (retrieval-augmented generation) hakemaan vain relevantit pätkät, pilko muisti loogisiin osiin (esimerkiksi CRM, tuote ja tone-of-voice erikseen) ja ota käyttöön context budgeting: rajaa erikseen, kuinka monta tokenia varataan lähteille, ohjeille ja itse tuotokselle. Jos siitä huolimatta joudut kasvattamaan kontekstia vain siksi, että halpa malli ymmärtäisi tehtävän, vaihto parempaan malliin kriittisessä vaiheessa on yleensä halvempi kuin jatkuva kontekstin paisuttaminen.


## Usein kysytyt kysymykset

### Onko tekoäly oikeasti ilmainen vai maksatko piilokuluina (aika, virheet, viive, integraatiot)?

Usein “ilmainen” koskee vain chat-käyttöä tai lyhyttä kokeilua. Yrityksen agentissa maksat tokeneiden lisäksi epäonnistumisista (retry-ajot), viiveestä (ihmisen odotus ja tarkistus) sekä integraatioiden ja monitoroinnin ylläpidosta. Siksi kannattaa mitata TCO per ajokerta ja lopulta cost per myyntimahdollisuus, ei vain €/token.

### Milloin “halpa malli” on agenttiprojektissa kallein päätös?

Kun tehtävä vaatii päätöksentekoa (liidien priorisointi, viestikulma, riskit) ja virheen hinta on korkea (asiakasviestit, CRM-toimet). Halpa malli “korjataan” usein lisäämällä kontekstia ja reittejä, mikä nostaa kutsumäärää, retry-prosenttia ja ihmistyötä. Lopputulos: heikompi luotettavuus ja lähes sama kustannus.

### Miten routing (useampi malli) vaikuttaa kustannuksiin ja luotettavuuteen käytännössä?

Routing lisää yleensä 1–2 mallikutsua luokitteluun sekä lisää virhepolkuja: jos valinta on väärä, koko ketju ajetaan uudelleen. Lisäksi tulee observability- ja testauskuormaa (miksi reitti vaihtui, missä formaatti hajosi). Routing kannattaa vain, jos rutiiniosuudet ovat selkeästi rajattavissa ja mittarit (success/retry/latency) ohjaavat päätöstä.

### Miten toteutan välimuistin (prompt/response cache ja embedding-cache) agentille, jotta säästöt oikeasti toteutuvat?

Aloita prompt/response-cachella deterministisissä kohdissa: pidä temperature matalana ja tee cache-avain mallista, parametreista ja promptin hashista (sekä prosessiversiosta). Lisää embedding-cache dokumenteille, joita haet usein (yritysesittely, palvelut, ohjeet), ja käytä TTL:ää + invalidointia lähteen muuttuessa. Yhtenäistä vasteformaatit, jotta cache toimii moniprovider-pinossa.

### Miten hallitsen pitkän kontekstin kustannuspiikit (RAG, tiivistys, context budgeting) ja milloin kannattaa vaihtaa parempaan malliin?

Älä dumppaa kaikkea promptiin. Käytä RAGia hakemaan vain relevantit pätkät, pilko muisti (esim. CRM vs tuote vs tone) ja ota käyttöön context budgeting: rajaa tokenit lähteille, ohjeille ja tuotokselle erikseen. Jos silti joudut kasvattamaan kontekstia “että halpa malli ymmärtää”, vaihto parempaan malliin kriittisessä vaiheessa on usein halvempi.


## Yhteenveto

“Tekoäly ilmainen” on hyvä lähtö kokeiluun, mutta agenttien maailmassa se harvoin on ilmainen lopputulos. Kun mittaat tokenit, retryt, p95-viiveen ja ihmistyön, huomaat nopeasti missä halpa backend riittää ja missä se syö myyntiputken luotettavuuden. Varaa 30 min konsultaatio: käydään teidän agentti-/automaatio-setup läpi ja päätetään selkeästi, missä kannattaa maksaa paremmasta mallista.
