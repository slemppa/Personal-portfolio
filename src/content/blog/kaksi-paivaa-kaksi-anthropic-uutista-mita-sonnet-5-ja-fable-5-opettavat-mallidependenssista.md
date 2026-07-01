---
  title: "Kaksi päivää, kaksi Anthropic-uutista: mitä Sonnet 5 ja Fable 5 opettavat mallidependenssistä"
  date: 2026-07-01
  description: "Sonnet 5 tuo agenttitehon Sonnet-hintaan. Fable 5 katosi 2 viikoksi vientirajoitusten takia. Näin varaudut mallidependenssin riskeihin."
  tags: []
  draft: true
---
# Kaksi päivää, kaksi Anthropic-uutista: mitä Sonnet 5 ja Fable 5 opettavat mallidependenssistä

30. kesäkuuta ja 1. heinäkuuta 2026 Anthropic julkaisi kaksi uutista, jotka näyttävät päällisin puolin täysin erilaisilta. Toinen on lanseeraus: uusi malli, parempi hinta-suorituskykysuhde, agenttiteho josta rakentajat ovat innoissaan. Toinen on selittely: miksi yksi heidän malleistaan katosi käytöstä yli kahdeksi viikoksi ja mitä sen palauttamiseksi tehtiin.

Luettuna yhdessä ne kertovat saman tarinan kahdesta suunnasta: mitä tekoälymallit osaavat tänä päivänä, ja miten epävarmaa on se, saatko käyttää niitä huomenna.

Jos rakennat liiketoimintaa AI-mallien päälle — automaatioputkia, agentteja, sisällöntuotantoa — molemmat uutiset kannattaa lukea, ei vain sitä hauskempaa.

## Osa 1: Claude Sonnet 5 — agenttiteho tuli Sonnet-hintaan

Anthropic julkaisi Claude Sonnet 5:n 30.6. Ydinviesti on yksinkertainen mutta merkittävä: mallin agenttimainen suorituskyky on lähellä Opus 4.8:aa, mutta hinnoittelu on murto-osa siitä.

### Mikä muuttui

Viime kuukaudet agenttimainen AI — malli joka suunnittelee, käyttää työkaluja, debuggaa ja vie monivaiheisen tehtävän maaliin asti ilman jatkuvaa ohjausta — on ollut käytännössä Opus-tason juttu. Jos halusit mallin joka oikeasti hoitaa homman loppuun eikä jää puoliväliin, maksoit siitä. Sonnet-tason mallit olivat nopeampia ja halvempia, mutta tyypillisesti vaativia tehtäviä tehdessään ne pysähtyivät, kysyivät varmistusta tai jättivät virheen huomaamatta.

Sonnet 5 kuroo tämän kuilun kiinni. Testaajien kuvausten mukaan malli vie loppuun tehtäviä joissa edellinen sukupolvi pysähtyi, ja tarkistaa oman jälkensä ilman erillistä pyyntöä. Yksi konkreettinen esimerkki: malli sai bugiraportin, kirjoitti sille toistavan testin, korjasi bugin, ja palautti korjauksen väliaikaisesti varmistaakseen että testi todella epäonnistuu ilman fixiä — kaiken tämän yhdellä ajolla, ilman että sitä erikseen käskettiin tekemään niin.

Tämä on olennainen ero. Agenttiputken heikoin lenkki ei useimmiten ole raaka älykkyys — se on se, että malli luovuttaa liian aikaisin, ei huomaa omaa virhettään, tai tarvitsee ihmisen validoimaan välitulokset. Jos malli oikeasti tarkistaa itsensä luotettavasti, se muuttaa sitä, kuinka paljon työtä uskaltaa antaa agentin hoidettavaksi kokonaan ilman ihmistä väliin.

### Hinnoittelu

Lanseeraushinta on 2 dollaria per miljoona input-tokenia ja 10 dollaria per miljoona output-tokenia, voimassa elokuun loppuun asti. Sen jälkeen hinta nousee tasolle 3 / 15 dollaria. Vertailun vuoksi Opus 4.8 maksaa 5 / 25 dollaria per miljoona tokenia.

Tiimille joka pyörittää sisältö- ja automaatiostackin kokonaisuudessaan n8n:n ja Claude Coden päällä, tämä ei ole marginaalinen yksityiskohta. Se on suora marginaali- ja nopeuskysymys: samat agenttitason tehtävät, joita aiemmin oli järkevää ajaa vain Opuksella kustannussyistä, voi nyt ajaa Sonnet-hinnalla ilman että laadusta tingitään merkittävästi.

### Mitä tästä pitää muistaa

Sonnet 5:n julkaisu on hyvä esimerkki siitä, miten AI-mallien hinta-suorituskykykäyrä liikkuu jatkuvasti alaspäin. Kyky joka oli kallista pari kuukautta sitten, on nyt halpaa. Tämä on hyvä uutinen kaikille jotka rakentavat AI-riippuvaista tuotetta — mutta se ei ole koko kuva. Seuraava päivä Anthropic julkaisi toisen uutisen, joka muistuttaa siitä mitä hinta-suorituskykykäyrä ei kerro: käytettävyyden ennustettavuutta.

## Osa 2: Fable 5:n paluu — kun malli katoaa yön yli

1. heinäkuuta Anthropic julkaisi toisen, huomattavasti vakavamman uutisen: Claude Fable 5, joka julkaistiin 9. kesäkuuta, oli ollut poissa käytöstä kaikilta käyttäjiltä kaikkialla yli kaksi viikkoa — Yhdysvaltain hallituksen määräämien vientirajoitusten takia.

### Mitä tapahtui

Fable 5 ja Mythos 5 jakavat samat pohjamallin. Fable 5 julkaistiin vahvoilla turvarajoilla laajaan yleiskäyttöön; Mythos 5, jolla on kevyemmät turvarajat, jaettiin vain pienelle joukolle luotettuja Project Glasswing -kumppaneita puolustukselliseen kyberkäyttöön.

12. kesäkuuta — kolme päivää julkaisun jälkeen — Yhdysvaltain hallitus sovelsi vientirajoituksia molempiin malleihin. Taustalla oli Amazonin tutkijoiden raportti: he olivat löytäneet tavan kiertää Fable 5:n turvarajat niin, että malli tunnisti ohjelmistohaavoittuvuuksia, ja yhdessä tapauksessa tuotti koodin, joka demonstroi kuinka haavoittuvuutta voisi hyväksikäyttää. Koska määräys tuli voimaan välittömästi ja Anthropicilla ei ollut luotettavaa tapaa varmistaa käyttäjän kansalaisuutta reaaliajassa, pääsy molempiin malleihin suljettiin kaikilta.

### Se yllättävä yksityiskohta

Tässä on kohta, joka jää helposti pintaraapaisun alle mutta on olennaisin osa koko tarinaa: Anthropicin oma testaus paljasti, että kyseessä oli rajatapaus turvarajoissa — ei ainutlaatuinen, poikkeuksellisen vaarallinen kyky.

Samat haavoittuvuudet, jotka Fable 5 tunnisti raportissa, löysivät myös huomattavasti heikommat mallit: Opus 4.8, GPT-5.5, Kimi K2.7. Ja se yksittäinen exploit-demonstraatio, joka aiheutti koko kohun, onnistui käytännössä jokaisella testatulla mallilla — mukaan lukien Claude Haiku 4.5, Sonnet 4.6, Opus 4.6 ja 4.7. Kyse oli siis rutiininomaisesta, pääosin puolustuksellisesta kyberturva-tehtävästä, jonka Fable 5:n tarkoituksella laaja turvamarginaali blokkasi "varmuuden vuoksi" — ei kyvystä, joka olisi ollut vain Fable 5:llä.

Anthropic kutsuu tätä turvamarginaaliksi (*safety margin*): heidän turvaluokittelijansa on tarkoituksella viritetty laukeamaan myös osaan todennäköisesti vaarattomia pyyntöjä, jotta mikään aidosti haitallinen pyyntö ei pääse läpi. Fable 5:lle tämä marginaali asetettiin isommaksi kuin koskaan aiemmin — tietoinen vaihtokauppa, jossa hyväksyttiin enemmän vääriä positiivisia, jotta muut kyvyt voitaisiin julkaista laajasti turvallisemmin.

### Korjaus ja paluu

Anthropic koulutti uuden turvaluokittelijan, joka kohdistuu juuri raportoituun tekniikkaan ja blokkaa sen yli 99 prosentissa tapauksista. Blokattu pyyntö ohjataan automaattisesti Opus 4.8:lle. Yhdysvaltain kauppaministeriön CAISI-tutkijat (Center for AI Standards and Innovation) testasivat uudet ja vanhat turvatoimet ja pitivät niitä poikkeuksellisen vahvoina.

Malli palaa käyttöön porrastetusti:

- **1. heinäkuuta**: Fable 5 palautuu globaalisti — mutta vain Anthropicin omille pinnoille: Claude Platform (API), Claude.ai, Claude Code ja Claude Cowork.
- **Toistaiseksi ei**: AWS, Google Cloud ja Microsoft Foundry. Näille luvataan pääsy "niin pian kuin mahdollista" — ei tarkkaa päivämäärää.
- **1.–7. heinäkuuta**: Pro-, Max-, Team- ja valituilla Enterprise-tileillä Fable 5 sisältyy tilaukseen, mutta katettuna 50 prosenttiin viikoittaisesta käyttörajasta.
- **7. heinäkuuta jälkeen**: käyttö siirtyy usage crediteille. Standardi-Enterprise-tileillä ei ole sisältyvää kiintiötä lainkaan — kaikki kulkee crediteillä, ja jos niitä ei ole otettu käyttöön, malli ei toimi ollenkaan.

Uusi turvaluokittelija tarkoittaa myös sitä, että tavallisia koodaus- ja debuggaustehtäviä blokataan aiempaa useammin virheellisesti. Anthropic myöntää tämän suoraan: väärät positiivit lisääntyvät, ja he lupaavat hioa rajaa jatkossa.

### Alan yhteinen jailbreak-kehys

Yksi tämän uutisen vähemmän huomiota saanut osa on merkittävä policy-avaus: Anthropic rakentaa yhdessä Amazonin, Microsoftin, Googlen ja muiden Glasswing-kumppanien kanssa yhteistä standardia sille, miten AI-mallin turvarajojen ohituksen ("jailbreak") vakavuutta arvioidaan. Neljä kriteeriä:

1. **Capability gain** — kuinka paljon pidemmälle jailbreak vie kuin olemassa olevat työkalut (mukaan lukien muut, heikommat mallit)?
2. **Breadth of capability gain** — moneenko eri hyökkäystehtävään sama tekniikka toimii?
3. **Ease of weaponization** — vaatiiko aseistaminen paljon taitavaa promptausta ja monta yritystä, vai riittääkö yksi tai kaksi kokeilua?
4. **Discoverability** — vaatiiko tekniikka erikoisosaamista, vai on se jo laajasti tiedossa?

Vakavimman luokan jailbreakeille (esimerkiksi sellaiset joita aktiivisesti käytetään sähköverkkojen tai pankkijärjestelmien vahingoittamiseen) luvataan välittömät väliaikaiset suojatoimet heti vakavuuden vahvistamisen jälkeen, ja Anthropic perustaa 24/7-valvontatiimin keskeisille jailbreak-ilmoituskanaville. Samalla avattiin uusi HackerOne-ohjelma, jonne tietoturvatutkijat voivat ilmoittaa löytämiään Fable 5:n kyberjailbreakeja.

## Mitä näistä kahdesta uutisesta pitäisi oppia

Luettuna erikseen, Sonnet 5 on hyvä uutinen ja Fable 5 on kriisiviestintää. Luettuna yhdessä ne kertovat, että mallidependenssi ei ole vain hinta- ja laatukysymys — se on myös geopoliittinen riski ja "turvarajat voivat kiristyä yön yli" -riski.

Kolme käytännön johtopäätöstä, jos rakennat liiketoimintaa AI-mallien varaan:

**1. Yksi malli, yksi piste jossa koko putki voi pysähtyä.** Fable 5:n tapaus ei ollut mallin oma vika sillä mitalla kuin uutinen aluksi antoi ymmärtää — se oli sääntelypäätös, joka tuli kolme päivää julkaisun jälkeen ja koski käytännössä koko markkinaa yhtä lailla. Jos tuotteesi nojaa yhteen malliin ilman fallbackia, olet altis päätöksille joihin sinulla ei ole minkäänlaista vaikutusvaltaa.

**2. Turvarajat ovat liikkuva kohde, ei kertaluontoinen tarkistus.** Fable 5:n turvamarginaali kasvatettiin tarkoituksella isommaksi kuin koskaan — ja silti se ei riittänyt hallitukselle. Uusi luokittelija blokkaa nyt myös enemmän aidosti vaarattomia pyyntöjä. Jos automaatioputkesi lähettää mallille rajatapauksia (esimerkiksi tietoturva-aiheista sisältöä, koodianalyysiä, tai mitä tahansa mikä sivuaa "kyberturvaa" edes kaukaisesti), odotettavissa on enemmän false positiveja, ei vähemmän.

**3. Redundanssi ei ole ylimääräistä kompleksisuutta — se on vakuutus.** Meillä Rascal AI:lla pyörii tuotannossa viisi eri mallia eri tehtäviin. Moni on pitänyt tätä turhan monimutkaisena ratkaisuna yhden hyvän mallin sijaan. Tämän viikon uutiset ovat juuri se syy miksi arkkitehtuuri on rakennettu näin: kun yksi malli katoaa, kieltäytyy aiempaa herkemmin, tai muuttaa käytösehtojaan yön yli, työ reitittyy automaattisesti toiselle mallille sen sijaan että koko putki pysähtyy.

Sonnet 5 osoittaa, että agenttitason AI-kyky on nyt halvempaa ja luotettavampaa kuin koskaan. Fable 5 osoittaa, että "luotettava" ei tarkoita "aina saatavilla ehdoilla joita voit ennustaa". Molemmat ovat totta samaan aikaan, ja rakentajana kannattaa suunnitella molempien varalle.

---

*Jos rakennat tuotantojärjestelmää yhden AI-mallin varaan: mitä tapahtuu, jos se katoaa huomenna ilman varoitusta? Jos vastaus on "tuote ei toimi", kannattaa tämä viikko ottaa signaalina, ei poikkeuksena.*