// Myynti- ja tietoa-sivut molemmilla kielillä:
//   about → /tietoa              | /en/about
//   mvp   → /mvp-kehitys         | /en/mvp-development
//   n8n   → /n8n-automaatiot     | /en/n8n-automation
//   cost  → /ohjelmistokehityksen-hinta | /en/software-development-cost
// Yksi lähde sekä sivulle että sen metatiedoille ja JSON-LD:lle (lib/routes.ts).
//
// Sisältö perustuu repon faktoihin (cases.ts, site/copy.ts) ja Samin
// vahvistamiin tietoihin (hinnat, prosessi, ehdot 18.11.2026). Markkinatasot
// ("tyypillisesti Suomessa …") ovat julkisista hintasivuista marraskuussa 2026.
// Jos joku kohta jää auki, kirjoita se muotoon `TODO(Sami): …`: sivu näyttää
// sen ja FAQPage-merkintä jättää sen pois (ks. publishedFaq).
import { getCases } from './cases'
import { casePath } from './i18n'
import { stripInlineMarkdown, type FaqItem } from './seo'
import type { Lang } from './parsePost'

export type ServiceSection = { heading: string; /** Markdown. */ body: string }
export type ServiceKey = 'about' | 'mvp' | 'n8n' | 'cost'

export type ServicePage = {
  /** Sama avain molemmilla kielillä — tällä parit löytävät toisensa (hreflang). */
  key: ServiceKey
  lang: Lang
  /** URL-polku ilman alkukauttaviivaa. */
  slug: string
  /** about → ProfilePage, service → Service, guide → Article. */
  kind: 'about' | 'service' | 'guide'
  metaTitle: string
  metaDescription: string
  h1: string
  /** 2–3 lauseen suora vastaus pääkysymykseen (markdown). */
  lead: string
  /** H2-otsikot ovat asiakkaan oikeita kysymyksiä. */
  sections: ServiceSection[]
  /** Näkyvä UKK. Vastaukset markdownia. */
  faq: FaqItem[]
  cta: { title: string; body: string }
  /** Service-merkinnän serviceType. */
  serviceType?: string
}

export const TODO_MARK = 'TODO(Sami)'

export const PRICES = { mvpFrom: '4 900 €', n8nFrom: '790 €' } as const
const PRICES_EN = { mvpFrom: '€4,900', n8nFrom: '€790' } as const

const PATHS: Record<ServiceKey, Record<Lang, string>> = {
  about: { fi: 'tietoa', en: 'en/about' },
  mvp: { fi: 'mvp-kehitys', en: 'en/mvp-development' },
  n8n: { fi: 'n8n-automaatiot', en: 'en/n8n-automation' },
  cost: { fi: 'ohjelmistokehityksen-hinta', en: 'en/software-development-cost' },
}

/** Site-absolute path of a service page in the given language. */
export const serviceHref = (key: ServiceKey, lang: Lang): string => `/${PATHS[key][lang]}`

/** Markdown-lista case-sivuista; tekstit tulevat suoraan cases.ts:stä. */
function caseList(lang: Lang, slugs?: string[]): string {
  const cases = getCases(lang).filter((c) => !slugs || slugs.includes(c.slug))
  const roleLabel = lang === 'fi' ? 'Rooli' : 'Role'
  return cases
    .map((c) => {
      const outcome = c.outcomes[0] ? ` (${c.outcomes[0].value} ${c.outcomes[0].label})` : ''
      return `- **[${c.title}](${casePath(lang, c.slug)})** — ${c.tagline}. ${roleLabel}: ${c.role}${outcome}.`
    })
    .join('\n')
}

const PROFILE_LINKS = {
  linkedin: 'https://www.linkedin.com/in/samikiias/',
  instagram: 'https://www.instagram.com/samikiias/',
  youtube: 'https://www.youtube.com/@samikiias',
  github: 'https://github.com/slemppa',
}

// ---------------------------------------------------------------- suomi

const FI_CONTACT =
  'Varaa maksuton 30 minuutin alkukeskustelu: kerro lyhyesti, mitä olet rakentamassa, niin saat kirjallisen karkean arvion. Sähköposti: [sami@mak8r.fi](mailto:sami@mak8r.fi). Vastaan yleensä saman päivän aikana.'

const FI_SERVICE_LINKS = [
  `- [MVP-kehitys](${serviceHref('mvp', 'fi')}): tuotteen ensimmäinen versio tuotantoon, alkaen ${PRICES.mvpFrom}`,
  `- [n8n-automaatiot](${serviceHref('n8n', 'fi')}): tuotannossa pyörivät työnkulut ja integraatiot, alkaen ${PRICES.n8nFrom}`,
  `- [Ohjelmistokehityksen hinta](${serviceHref('cost', 'fi')}): mistä kustannus syntyy`,
].join('\n')

const FI_SPEC = [
  'Kirjallinen arvio ja speksi sisältävät:',
  '',
  '- **Tavoite ja mittari:** mitä MVP:n pitää todistaa ja mistä sen tietää',
  '- **Käyttäjät ja roolit:** kuka tuotetta käyttää ja mitä kukin saa tehdä',
  '- **Rajaus:** mitä ensimmäiseen versioon tulee ja mitä jätetään tarkoituksella pois',
  '- **Käyttäjäpolut:** tärkeimmät tehtävät alusta loppuun',
  '- **Integraatiot ja tekniset valinnat:** mihin järjestelmiin kytketään ja millä stackilla',
  '- **Katselmointipisteet:** milloin näet toimivan version ja hyväksyt vaiheen',
  '- **Hinta ja maksuerät:** kiinteä hinta, joka on sidottu katselmointipisteisiin',
  '- **Oletukset ja riskit:** mitkä asiat voivat muuttaa laajuutta',
].join('\n')

const fiPages: ServicePage[] = [
  {
    key: 'about',
    lang: 'fi',
    slug: PATHS.about.fi,
    kind: 'about',
    metaTitle: 'Tietoa: Sami Kiias, fullstack-tuoterakentaja ja CTO',
    metaDescription:
      'Sami Kiias on fullstack-tuoterakentaja ja Rascal AI:n CTO. Kuusi rakennettua tuotetta ja 11 vuotta yrittäjänä. Tausta, projektit ja yhteystiedot.',
    h1: 'Sami Kiias – fullstack-tuoterakentaja ja CTO',
    lead:
      'Olen Sami Kiias, fullstack-tuoterakentaja ja Rascal AI:n CTO. Rakennan tuotteita ideasta tuotantoon: multi-tenant SaaS, AI-integraatiot ja automaatiot. Olen rakentanut kuusi tuotetta, ja niistä kolme on tuotannossa maksavilla asiakkailla.',
    sections: [
      {
        heading: 'Mitä Sami Kiias rakentaa?',
        body: [
          'Fullstack-tuotteita, jotka pyörivät tuotannossa, en demoja. Rakennan sekä käyttöliittymän, backendin, tietokannan että AI-integraatiot. Sama stack pyörittää omia tuotteitani ja asiakasprojekteja.',
          '',
          '- **SaaS:** multi-tenant-alustat, joissa data on eristetty tietokantatasolla (RLS)',
          '- **AI-integraatiot:** Claude, ElevenLabs ja MCP-serverit tuotantokäytössä',
          '- **Automaatiot:** n8n, webhookit ja integraatiot järjestelmästä toiseen',
          '- **Sovellukset:** iOS, Android ja web yhdestä koodipohjasta omissa tuotteissani (Ihmi, Pesä)',
        ].join('\n'),
      },
      {
        heading: 'Mikä on Samin tausta?',
        body: [
          'Polkuni kulki yrittäjästä AI-järjestelmien rakentajaksi. Siksi puhun sekä bisneksen että koodin kieltä.',
          '',
          '- **2015 – yrittäjä:** ensimmäinen yritys. Asiakkaat, myynti ja liiketoiminnan perusteet opin käytännössä.',
          '- **2022 – markkinoija:** liiketalouden tradenomi (Haaga-Helia), suuntautumisena markkinointi.',
          '- **2024 – kehittäjä:** itseoppinut full-stack-kehittäjä. React, TypeScript, Node.js ja pilvipalvelut.',
          '- **2025 – CTO ja tuoterakentaja:** Rascal AI. Kolme Rascal-tuotetta ja kolme omaa sovellusta, yhteensä yli 400 000 riviä koodia.',
        ].join('\n'),
      },
      {
        heading: 'Missä Sami on mukana nyt?',
        body: [
          '- **[Rascal AI](https://www.rascalai.fi):** CTO. AI-markkinointi ja -myynti pk-yrityksille, kolme tuotetta.',
          '- **Ihmi:** solo developer. AI-valmennussovellus treeniin, ravintoon ja palautumiseen.',
          '- **[Mak8r.fi](https://mak8r.fi):** perustaja. Tuotekehitys- ja AI-projektit toimeksiannosta.',
        ].join('\n'),
      },
      { heading: 'Mitä Sami on rakentanut?', body: caseList('fi') },
      {
        heading: 'Mistä löydän Samin sisältöjä?',
        body: [
          '- [Blogi](/blog): kirjoituksia tekoälystä, markkinoinnin automaatiosta ja tuotekehityksestä',
          `- [YouTube @samikiias](${PROFILE_LINKS.youtube}): Build in Public, eli tutoriaaleja ja projektien läpikäyntejä`,
          `- [LinkedIn](${PROFILE_LINKS.linkedin})`,
          `- [Instagram](${PROFILE_LINKS.instagram})`,
          `- [GitHub](${PROFILE_LINKS.github})`,
        ].join('\n'),
      },
      { heading: 'Millaisissa projekteissa Sami voi auttaa?', body: FI_SERVICE_LINKS },
      { heading: 'Miten saan Samiin yhteyden?', body: FI_CONTACT },
    ],
    faq: [],
    cta: {
      title: 'Rakennetaanko seuraava tuotteesi?',
      body: 'Kerro tilanteestasi, oli kyse uudesta tuotteesta, MVP:stä, AI-ominaisuudesta tai automaatiosta.',
    },
  },
  {
    key: 'mvp',
    lang: 'fi',
    slug: PATHS.mvp.fi,
    kind: 'service',
    serviceType: 'MVP-kehitys',
    metaTitle: 'MVP-kehitys ideasta tuotantoon · Sami Kiias',
    metaDescription: `Freelance fullstack-kehittäjä MVP:n rakentamiseen, alkaen ${PRICES.mvpFrom} (alv 0 %). Prosessi vaiheittain, katselmointipisteet ja tuotantoon viedyt caset.`,
    h1: 'MVP-kehitys: tuotteesi ensimmäinen versio tuotantoon',
    lead: `Rakennan MVP:n ideasta tuotantoon fullstack-tekijänä: käyttöliittymä, backend, tietokanta, AI-integraatiot ja julkaisu. MVP-kehitys alkaa ${PRICES.mvpFrom} (alv 0 %), ja hinta sovitaan kiinteästi kirjallisen arvion pohjalta. Ensimmäinen 30 minuutin keskustelu ja karkea arvio ovat maksuttomia.`,
    sections: [
      {
        heading: 'Kenelle MVP-kehitys sopii?',
        body: [
          '- Yritykselle tai yrittäjälle, jolla on tuoteidea ja joka haluaa sen oikeiden käyttäjien käsiin',
          '- Tiimille, joka tarvitsee AI-ominaisuuden olemassa olevaan järjestelmään',
          '- Tilanteeseen, jossa tarvitaan yksi tekijä koko pinoon eikä erillisiä frontend-, backend- ja AI-toimittajia',
          '',
          'Ei sovi muutaman kymmenen tai sadan euron pikakorjauksiin. Niissä kartoitus maksaa enemmän kuin itse työ.',
        ].join('\n'),
      },
      {
        heading: 'Miten MVP-projekti etenee?',
        body: [
          '1. **Maksuton alkukeskustelu (30 min):** käydään läpi idea, käyttäjät ja tavoite. Saat kirjallisen karkean arvion.',
          '2. **Speksi ja kiinteä tarjous:** rajataan, mitä ensimmäiseen versioon tulee, ja sovitaan katselmointipisteet ja hinta.',
          '3. **Rakentaminen katselmointipisteittäin:** jokaisessa pisteessä näet toimivan version ja hyväksyt sen ennen seuraavaa vaihetta. Testit ajetaan ennen jokaista muutosta.',
          '4. **Tuotantoon ja luovutus:** julkaisu oikeille käyttäjille. Ylläpidosta ja jatkokehityksestä sovitaan projektin mukaan.',
        ].join('\n'),
      },
      { heading: 'Mitä hyvä MVP-speksi ja tarjous sisältävät?', body: FI_SPEC },
      {
        heading: 'Kauanko MVP:n rakentaminen kestää?',
        body: [
          'Kesto riippuu laajuudesta, ja se sovitaan arviossa yhdessä. Markkinalla rajatun MVP:n toteutusaika on tyypillisesti 2–6 viikkoa.',
          '',
          'Toteutuneita esimerkkejä: [Arkireitti](/projektit/perhe-app), perheen tehtävätaulu, rakennettiin kolmessa päivässä. [Rascal AI](/projektit/rascal-ai) on julkaissut 423 versiota noin 13 kuukaudessa.',
        ].join('\n'),
      },
      {
        heading: 'Paljonko MVP maksaa?',
        body: [
          `MVP-kehitys alkaa **${PRICES.mvpFrom} (alv 0 %)**. Suomessa MVP-projektit maksavat tyypillisesti 5 000–20 000 € laajuudesta riippuen. Hinta on kiinteä, ja maksuerät on sidottu katselmointipisteisiin, joten tiedät kokonaissumman ennen aloitusta.`,
          '',
          `Erittely hinnan osista: [Ohjelmistokehityksen hinta: mistä kustannus syntyy](${serviceHref('cost', 'fi')}).`,
        ].join('\n'),
      },
      {
        heading: 'Millaisia tuotteita olen rakentanut?',
        body: [caseList('fi', ['rascal-ai', 'altio', 'perhe-app']), '', `Kaikki projektit: [Tietoa Samista](${serviceHref('about', 'fi')}).`].join('\n'),
      },
      {
        heading: 'Millä teknologioilla MVP rakennetaan?',
        body:
          'Tuotannossa käytän React- ja TypeScript-pohjaista stackia: Supabase tai Neon Postgres, rivitason käyttöoikeudet (RLS), Vercel, AI-ominaisuuksiin Claude ja automaatioihin n8n. Sama stack pyörittää Rascal AI:ta ja omia sovelluksiani.',
      },
      { heading: 'Miten pääsemme alkuun?', body: FI_CONTACT },
    ],
    faq: [
      {
        question: 'Kuka omistaa MVP:n lähdekoodin?',
        answer: 'Tekijänoikeudet säilyvät minulla, ellei toisin sovita. Oikeuksien siirrosta ja käyttöoikeuksista sovitaan tarjouksessa.',
      },
      {
        question: 'Teetkö työn yksin vai tiimin kanssa?',
        answer: 'Pääosin teen työn itse. Isoissa projekteissa käytän alihankintaverkostoa.',
      },
      {
        question: 'Voiko MVP:hen rakentaa AI-ominaisuuksia?',
        answer:
          'Voi. Olen rakentanut tuotantoon muun muassa AI-sisältöputken, ääniagentteja (ElevenLabs) ja MCP-serverin, jonka kautta Claude käyttää tuotetta. Esimerkkejä on [Rascal AI -casessa](/projektit/rascal-ai).',
      },
      {
        question: 'Mitä tapahtuu julkaisun jälkeen?',
        answer: 'Riippuu projektista. Ylläpidosta ja jatkokehityksestä sovitaan tapauskohtaisesti.',
      },
      {
        question: 'Maksaako arvio jotain?',
        answer: '30 minuutin alkukeskustelu ja kirjallinen karkea arvio ovat maksuttomia.',
      },
    ],
    cta: {
      title: 'Kerro MVP-ideastasi',
      body: 'Kuvaa lyhyesti, mitä olet rakentamassa ja kenelle. Saat maksuttoman karkean arvion.',
    },
  },
  {
    key: 'n8n',
    lang: 'fi',
    slug: PATHS.n8n.fi,
    kind: 'service',
    serviceType: 'n8n-konsultointi ja automaatiot',
    metaTitle: 'n8n-automaatiot tuotantoon – n8n-konsultti · Sami Kiias',
    metaDescription: `n8n-konsultti: rakennan n8n-työnkulut tuotantoon, alkaen ${PRICES.n8nFrom} (alv 0 %). AI-putket, integraatiot ja webhookit. Esimerkit, hinnoittelu ja UKK.`,
    h1: 'n8n-automaatiot, jotka pyörivät tuotannossa',
    lead: `Rakennan n8n-työnkulkuja, jotka tekevät tuotannossa oikeaa työtä: AI-putkia, integraatioita järjestelmien välille ja webhook-pohjaisia automaatioita. Yksittäinen työnkulku alkaa ${PRICES.n8nFrom} (alv 0 %). Käytän n8n:ää itse Rascal AI:n ja Rascal Pagesin tuotantoputkissa.`,
    sections: [
      {
        heading: 'Mihin n8n:ää käytetään tuotannossa?',
        body: [
          'n8n on koneiston liimaa. Se hoitaa työnkulut, webhookit ja integraatiot palasta toiseen.',
          '',
          '- **AI-putket:** tekoälymallin kutsut osana pidempää prosessia, esimerkiksi sisällön generointi ja tarkistus',
          '- **Integraatiot:** tieto liikkuu järjestelmästä toiseen ilman käsin kopiointia',
          '- **Webhookit ja ajastukset:** tapahtuma tai kellonaika käynnistää työnkulun automaattisesti',
        ].join('\n'),
      },
      {
        heading: 'Millaisia n8n-työnkulkuja olen rakentanut?',
        body: [
          '- **[Rascal AI](/projektit/rascal-ai):** AI-putket ajetaan n8n:ssä. Synkroninen työ kulkee Vercel-funktioissa ja pitkäkestoiset ajot Supabase Edge Functioneissa.',
          '- **[Rascal Pages](/projektit/rascal-pages):** ääniagentti haastattelee yrittäjän, ja n8n + Claude generoivat sivukonfiguraation 1 200-rivisellä versioidulla system promptilla.',
        ].join('\n'),
      },
      {
        heading: 'Milloin n8n kannattaa ja milloin ei?',
        body: [
          'Periaatteeni on, että kolmas toisto automatisoidaan: kahdesti käsin, kolmannella kerralla koneelle. Kaiken, minkä voi laskea deterministisesti, lasken koodilla, ja tekoäly saa vain harkintaa vaativat vaiheet.',
          '',
          'n8n ei välttämättä ole oikea ratkaisu, jos alusta tarvitsee vain suoria kutsuja rajapintaan ja käyttöliittymä on jo olemassa. Silloin integraatio kannattaa usein kirjoittaa suoraan sovelluksen koodiin.',
        ].join('\n'),
      },
      {
        heading: 'Self-hosted n8n vai n8n Cloud?',
        body:
          'Riippuu siitä, mitä asiakas haluaa. n8n Cloud on helpompi tapa aloittaa, koska palvelinta ei tarvitse ylläpitää. Self-hosted antaa täyden kontrollin dataan ja ajoympäristöön. Valinta tehdään yhdessä alkukeskustelussa.',
      },
      {
        heading: 'Miten n8n-projekti hinnoitellaan?',
        body: `Yksittäinen työnkulku alkaa **${PRICES.n8nFrom} (alv 0 %)**. Laajemmat, useita järjestelmiä yhdistävät kokonaisuudet hinnoitellaan kiinteästi arvion jälkeen. Ylläpidosta sovitaan tapauskohtaisesti. n8n Cloudilla on lisäksi oma kuukausimaksunsa, jonka asiakas maksaa suoraan n8n:lle. Yleiskuva hinnan osista: [Ohjelmistokehityksen hinta](${serviceHref('cost', 'fi')}).`,
      },
      { heading: 'Miten pääsemme alkuun?', body: FI_CONTACT },
    ],
    faq: [
      {
        question: 'Voiko n8n-työnkulkuun kytkeä tekoälyn?',
        answer:
          'Voi. Esimerkiksi Rascal Pagesissa n8n ja Claude generoivat yrityksen verkkosivun konfiguraation ääniagentin keräämästä haastattelusta.',
      },
      {
        question: 'Kuka ylläpitää työnkulkuja käyttöönoton jälkeen?',
        answer: 'Riippuu tapauksesta. Ylläpidosta sovitaan erikseen, tai työnkulut luovutetaan asiakkaan omalle tiimille.',
      },
      {
        question: 'Voitko korjata tai jatkaa olemassa olevaa n8n-työnkulkua?',
        answer: 'Kyllä, katselmoinnin jälkeen. Ilman lähtötietoja en lupaa aikataulua enkä hintaa.',
      },
    ],
    cta: {
      title: 'Mikä prosessi teillä toistuu käsin?',
      body: 'Kerro, mitä teette käsin joka viikko, niin katsotaan kannattaako se automatisoida n8n:llä.',
    },
  },
  {
    key: 'cost',
    lang: 'fi',
    slug: PATHS.cost.fi,
    kind: 'guide',
    metaTitle: 'Ohjelmistokehityksen hinta: mistä kustannus syntyy',
    metaDescription:
      'Paljonko ohjelmisto, MVP tai mobiilisovellus maksaa? Hinnan osat, markkinan tasot Suomessa ja omat luvut yhden SaaS-tuotteen rakentamisesta.',
    h1: 'Ohjelmistokehityksen hinta: mistä kustannus syntyy?',
    lead: `Suomessa MVP-projektit maksavat tyypillisesti 5 000–20 000 €, ja ohjelmistokehittäjän tuntihinta on noin 70–150 € (alv 0 %). Hinta riippuu ennen kaikkea laajuudesta: montako käyttäjäroolia, integraatiota ja alustaa tarvitaan. Minulla MVP-kehitys alkaa ${PRICES.mvpFrom} ja n8n-automaatio ${PRICES.n8nFrom} (alv 0 %).`,
    sections: [
      {
        heading: 'Mistä ohjelmistokehityksen hinta koostuu?',
        body: [
          '- **Laajuus:** näkymien, käyttäjäroolien ja liiketoimintasääntöjen määrä',
          '- **Alustat:** pelkkä web vai myös iOS ja Android',
          '- **Integraatiot:** maksut, CRM, sähköposti, somekanavat ja muut ulkoiset rajapinnat',
          '- **Tietoturva ja käyttöoikeudet:** esimerkiksi monen asiakkaan data samassa järjestelmässä',
          '- **AI-ominaisuudet:** kehitystyö sekä mallien käytöstä syntyvät juoksevat kulut',
          '- **Testaus ja julkaisuprosessi:** automaattitestit ja CI, jotka pitävät muutokset turvallisina',
          '- **Ylläpito ja infra:** palvelimet, tietokanta ja jatkokehitys julkaisun jälkeen',
          '',
          'Hinnoittelen projektit kiinteästi. Laajuus kirjataan speksiin, ja maksuerät on sidottu katselmointipisteisiin.',
        ].join('\n'),
      },
      {
        heading: 'Paljonko MVP maksaa?',
        body: `Markkinalla MVP:n alkaen-hinnat ovat noin 3 000–5 000 €, ja tyypillinen projekti asettuu 5 000–20 000 euroon. Minulla MVP-kehitys alkaa **${PRICES.mvpFrom} (alv 0 %)**. Prosessi ja aikataulu: [MVP-kehitys](${serviceHref('mvp', 'fi')}).`,
      },
      {
        heading: 'Paljonko mobiilisovellus maksaa?',
        body: [
          'Suomessa mobiilisovellusten alkaen-hinnat ovat tyypillisesti noin 6 000–20 000 €, ja laajat sovellukset maksavat selvästi enemmän. Kahdelle sovelluskaupalle julkaiseminen tuo lisäkuluja: kehittäjätilit, kauppojen tarkastusprosessit ja testaus kahdella alustalla.',
          '',
          'Useimmille kannattaa aloittaa web-sovelluksesta tai PWA:sta, joka toimii myös puhelimessa. Jos natiivisovellus tarvitaan, yksi koodipohja usealle alustalle pienentää kustannusta. Esimerkiksi omat sovellukseni [Altio](/projektit/altio) ja [Pesä](/projektit/pesa) toimivat iOS:llä, Androidilla ja webissä samasta koodista.',
        ].join('\n'),
      },
      {
        heading: 'Mitä yhden SaaS-tuotteen rakentaminen vaati?',
        body: [
          'Omat luvut [Rascal AI:n](/projektit/rascal-ai) kehityksestä antavat mittakaavaa sille, mitä tuotantotason SaaS sisältää:',
          '',
          '- noin 207 000 riviä koodia',
          '- 423 julkaisua noin 13 kuukaudessa',
          '- yli 1 400 automaattitestiä',
          '- 129 Vercel-funktiota ja 27 Supabase Edge Functionia',
          '- 78 tietokantataulua rivitason käyttöoikeuksilla',
          '',
          'MVP on tästä murto-osa: se rakennetaan todistamaan yksi asia, ja loput lisätään vasta, kun käyttäjät ovat löytäneet tuotteen.',
        ].join('\n'),
      },
      {
        heading: 'Mitä juoksevia kuluja julkaisun jälkeen tulee?',
        body: [
          '- **Hosting ja tietokanta:** pienessä tuotteessa tyypillisesti noin 50–100 €/kk vähäisellä liikenteellä (esim. Vercel + Supabase)',
          '- **AI-mallit:** käytön mukaan. Kulu kasvaa käyttäjämäärän ja mallivalinnan mukana.',
          '- **Kolmannen osapuolen palvelut:** sähköposti, maksut, tekstiviestit ja vastaavat omilla hinnoillaan',
          '- **Ylläpito ja jatkokehitys:** sovitaan projektin mukaan',
        ].join('\n'),
      },
      {
        heading: 'Miten ohjelmistokehityksen kustannuksia voi pienentää?',
        body: [
          '- **Rajaa ensimmäinen versio:** rakenna se, millä idea validoidaan, ja jätä loput myöhemmäksi',
          '- **Tylsä matikka ensin, AI vasta sitten:** deterministinen koodi on auditoitavaa eikä maksa mallikuluja',
          '- **Rakenna kun se on etu, osta kun ei ole:** valmis palvelu siellä, missä oma toteutus ei erota tuotetta',
          '- **Web ennen sovelluskauppoja,** kun se riittää käyttäjille',
        ].join('\n'),
      },
      { heading: 'Miten saan arvion omasta projektistani?', body: FI_CONTACT },
    ],
    faq: [
      {
        question: 'Onko hinta kiinteä vai tuntiperusteinen?',
        answer: 'Asiakasprojekteissa hinta on kiinteä. Se sovitaan kirjallisen arvion ja speksin pohjalta ennen aloitusta.',
      },
      {
        question: 'Mikä on ohjelmistokehittäjän tuntihinta Suomessa?',
        answer: 'Tyypillisesti noin 70–150 € tunnilta (alv 0 %) kokemuksen ja erikoistumisen mukaan. Seniorit ja erikoisosaajat ovat haarukan yläpäässä.',
      },
      {
        question: 'Saako arvion ennen sitoutumista?',
        answer: '30 minuutin alkukeskustelu ja kirjallinen karkea arvio ovat maksuttomia.',
      },
    ],
    cta: {
      title: 'Haluatko arvion omasta projektistasi?',
      body: 'Kerro mitä olet rakentamassa. Saat maksuttoman karkean arvion laajuudesta ja kustannuksesta.',
    },
  },
]

// ---------------------------------------------------------------- English

const EN_CONTACT =
  'Book a free 30-minute intro call: tell me briefly what you’re building and you’ll get a written rough estimate. Email: [sami@mak8r.fi](mailto:sami@mak8r.fi). I usually reply the same day.'

const EN_SERVICE_LINKS = [
  `- [MVP development](${serviceHref('mvp', 'en')}): your product’s first version in production, from ${PRICES_EN.mvpFrom}`,
  `- [n8n automation](${serviceHref('n8n', 'en')}): workflows and integrations that run in production, from ${PRICES_EN.n8nFrom}`,
  `- [Software development cost](${serviceHref('cost', 'en')}): where the cost comes from`,
].join('\n')

const EN_SPEC = [
  'The written estimate and spec cover:',
  '',
  '- **Goal and metric:** what the MVP must prove and how you’ll know',
  '- **Users and roles:** who uses the product and what each can do',
  '- **Scope:** what goes into the first version and what is deliberately left out',
  '- **User flows:** the key tasks end to end',
  '- **Integrations and technical choices:** which systems to connect and on which stack',
  '- **Review points:** when you see a working version and sign off a stage',
  '- **Price and payment schedule:** a fixed price tied to the review points',
  '- **Assumptions and risks:** what could change the scope',
].join('\n')

const enPages: ServicePage[] = [
  {
    key: 'about',
    lang: 'en',
    slug: PATHS.about.en,
    kind: 'about',
    metaTitle: 'About Sami Kiias, fullstack product builder and CTO',
    metaDescription:
      'Sami Kiias is a fullstack product builder and the CTO of Rascal AI. Six products built and 11 years as an entrepreneur. Background, projects, contact.',
    h1: 'Sami Kiias – fullstack product builder and CTO',
    lead:
      'I’m Sami Kiias, a fullstack product builder and the CTO of Rascal AI. I build products from idea to production: multi-tenant SaaS, AI integrations and automation. I’ve built six products, three of them in production with paying customers.',
    sections: [
      {
        heading: 'What does Sami Kiias build?',
        body: [
          'Fullstack products that run in production, not demos. I build the UI, backend, database and AI integrations. The same stack runs my own products and client projects.',
          '',
          '- **SaaS:** multi-tenant platforms with data isolated at the database level (RLS)',
          '- **AI integrations:** Claude, ElevenLabs and MCP servers in production',
          '- **Automation:** n8n, webhooks and integrations from one system to another',
          '- **Apps:** iOS, Android and web from one codebase in my own products (Ihmi, Pesä)',
        ].join('\n'),
      },
      {
        heading: 'What is Sami’s background?',
        body: [
          'My path ran from entrepreneur to builder of AI systems, so I speak both business and code.',
          '',
          '- **2015 – entrepreneur:** first company. I learned customers, sales and business fundamentals hands-on.',
          '- **2022 – marketer:** BBA (Haaga-Helia), specializing in marketing.',
          '- **2024 – developer:** self-taught full-stack developer. React, TypeScript, Node.js and cloud.',
          '- **2025 – CTO and product builder:** Rascal AI. Three Rascal products and three apps of my own, over 400,000 lines of code.',
        ].join('\n'),
      },
      {
        heading: 'What is Sami working on now?',
        body: [
          '- **[Rascal AI](https://www.rascalai.fi):** CTO. AI marketing and sales for SMBs, three products.',
          '- **Ihmi:** solo developer. An AI coaching app for training, nutrition and recovery.',
          '- **[Mak8r.fi](https://mak8r.fi):** founder. Product development and AI projects on commission.',
        ].join('\n'),
      },
      { heading: 'What has Sami built?', body: caseList('en') },
      {
        heading: 'Where can I follow Sami?',
        body: [
          '- [Blog](/en/blog): writing on AI, marketing automation and product building',
          `- [YouTube @samikiias](${PROFILE_LINKS.youtube}): Build in Public, with tutorials and project walkthroughs`,
          `- [LinkedIn](${PROFILE_LINKS.linkedin})`,
          `- [Instagram](${PROFILE_LINKS.instagram})`,
          `- [GitHub](${PROFILE_LINKS.github})`,
        ].join('\n'),
      },
      { heading: 'What kind of projects can Sami help with?', body: EN_SERVICE_LINKS },
      { heading: 'How do I contact Sami?', body: EN_CONTACT },
    ],
    faq: [],
    cta: {
      title: 'Shall we build your next product?',
      body: 'Tell me where you are: a new product, an MVP, an AI feature or an automation.',
    },
  },
  {
    key: 'mvp',
    lang: 'en',
    slug: PATHS.mvp.en,
    kind: 'service',
    serviceType: 'MVP development',
    metaTitle: 'MVP development from idea to production · Sami Kiias',
    metaDescription: `Freelance fullstack developer for your MVP, from ${PRICES_EN.mvpFrom} (excl. VAT). The process step by step, review points and case studies in production.`,
    h1: 'MVP development: your product’s first version in production',
    lead: `I build MVPs from idea to production as a fullstack builder: UI, backend, database, AI integrations and launch. MVP development starts from ${PRICES_EN.mvpFrom} (excl. VAT), with a fixed price agreed on a written estimate. The first 30-minute call and a rough estimate are free.`,
    sections: [
      {
        heading: 'Who is MVP development for?',
        body: [
          '- A company or founder with a product idea who wants it in front of real users',
          '- A team that needs an AI feature in an existing system',
          '- When you need one builder for the whole stack instead of separate frontend, backend and AI vendors',
          '',
          'Not a fit for quick fixes worth a few tens or hundreds of euros. For those, scoping costs more than the work itself.',
        ].join('\n'),
      },
      {
        heading: 'How does an MVP project work?',
        body: [
          '1. **Free intro call (30 min):** we go through the idea, users and goal. You get a written rough estimate.',
          '2. **Spec and fixed quote:** we scope the first version and agree on review points and the price.',
          '3. **Building by review points:** at each point you see a working version and sign it off before the next stage. Tests run before every change.',
          '4. **Launch and handover:** release to real users. Maintenance and further development are agreed per project.',
        ].join('\n'),
      },
      { heading: 'What should a good MVP spec and quote include?', body: EN_SPEC },
      {
        heading: 'How long does it take to build an MVP?',
        body: [
          'It depends on the scope, and we agree on it together in the estimate. A tightly scoped MVP typically takes 2–6 weeks on the market.',
          '',
          'Real examples: [Arkireitti](/en/projektit/perhe-app), a family task board, was built in three days. [Rascal AI](/en/projektit/rascal-ai) has shipped 423 releases in about 13 months.',
        ].join('\n'),
      },
      {
        heading: 'How much does an MVP cost?',
        body: [
          `MVP development starts from **${PRICES_EN.mvpFrom} (excl. VAT)**. In Finland, MVP projects typically cost €5,000–20,000 depending on scope. The price is fixed and payments are tied to review points, so you know the total before we start.`,
          '',
          `Breakdown of the cost: [Software development cost: where it comes from](${serviceHref('cost', 'en')}).`,
        ].join('\n'),
      },
      {
        heading: 'What products have I built?',
        body: [caseList('en', ['rascal-ai', 'altio', 'perhe-app']), '', `All projects: [About Sami](${serviceHref('about', 'en')}).`].join('\n'),
      },
      {
        heading: 'What technologies are used to build the MVP?',
        body:
          'In production I use a React and TypeScript stack: Supabase or Neon Postgres, row-level security (RLS), Vercel, Claude for AI features and n8n for automation. The same stack runs Rascal AI and my own apps.',
      },
      { heading: 'How do we get started?', body: EN_CONTACT },
    ],
    faq: [
      {
        question: 'Who owns the MVP’s source code?',
        answer: 'I retain the copyright unless agreed otherwise. Transfer of rights and usage rights are agreed in the quote.',
      },
      {
        question: 'Do you work alone or with a team?',
        answer: 'Mostly I do the work myself. For large projects I use a network of subcontractors.',
      },
      {
        question: 'Can the MVP include AI features?',
        answer:
          'Yes. I’ve built an AI content pipeline, voice agents (ElevenLabs) and an MCP server that lets Claude operate the product, all in production. See the [Rascal AI case](/en/projektit/rascal-ai).',
      },
      {
        question: 'What happens after launch?',
        answer: 'It depends on the project. Maintenance and further development are agreed case by case.',
      },
      {
        question: 'Does the estimate cost anything?',
        answer: 'The 30-minute intro call and a written rough estimate are free.',
      },
    ],
    cta: {
      title: 'Tell me about your MVP idea',
      body: 'Describe briefly what you’re building and for whom. You’ll get a free rough estimate.',
    },
  },
  {
    key: 'n8n',
    lang: 'en',
    slug: PATHS.n8n.en,
    kind: 'service',
    serviceType: 'n8n consulting and automation',
    metaTitle: 'n8n automation for production – n8n consultant',
    metaDescription: `n8n consultant: I build n8n workflows that run in production, from ${PRICES_EN.n8nFrom} (excl. VAT). AI pipelines, integrations and webhooks. Examples and FAQ.`,
    h1: 'n8n automation that runs in production',
    lead: `I build n8n workflows that do real work in production: AI pipelines, integrations between systems and webhook-driven automation. A single workflow starts from ${PRICES_EN.n8nFrom} (excl. VAT). I run n8n myself in the production pipelines of Rascal AI and Rascal Pages.`,
    sections: [
      {
        heading: 'What is n8n used for in production?',
        body: [
          'n8n is the glue of the machine. It runs workflows, webhooks and integrations end to end.',
          '',
          '- **AI pipelines:** model calls as part of a longer process, such as generating and checking content',
          '- **Integrations:** data moves from one system to another without manual copying',
          '- **Webhooks and schedules:** an event or a time of day triggers the workflow automatically',
        ].join('\n'),
      },
      {
        heading: 'What n8n workflows have I built?',
        body: [
          '- **[Rascal AI](/en/projektit/rascal-ai):** the AI pipelines run in n8n. Synchronous work runs in Vercel functions and long-running jobs in Supabase Edge Functions.',
          '- **[Rascal Pages](/en/projektit/rascal-pages):** a voice agent interviews the business owner, and n8n + Claude generate the site config from a 1,200-line versioned system prompt.',
        ].join('\n'),
      },
      {
        heading: 'When does n8n make sense, and when not?',
        body: [
          'My rule: the third repetition gets automated. Twice by hand, the third time to the machine. Everything that can be computed deterministically, I compute in code, and AI only gets the steps that need judgment.',
          '',
          'n8n may not be the right choice if the platform only needs direct API calls and the frontend already exists. Then the integration is often better written straight into the application code.',
        ].join('\n'),
      },
      {
        heading: 'Self-hosted n8n or n8n Cloud?',
        body:
          'It depends on what the client wants. n8n Cloud is the easier start because there’s no server to maintain. Self-hosted gives full control of the data and the runtime. We choose together in the intro call.',
      },
      {
        heading: 'How is an n8n project priced?',
        body: `A single workflow starts from **${PRICES_EN.n8nFrom} (excl. VAT)**. Larger setups connecting several systems get a fixed price after an estimate. Maintenance is agreed case by case. n8n Cloud also has its own monthly fee, paid by the client directly to n8n. Cost overview: [Software development cost](${serviceHref('cost', 'en')}).`,
      },
      { heading: 'How do we get started?', body: EN_CONTACT },
    ],
    faq: [
      {
        question: 'Can an n8n workflow use AI?',
        answer:
          'Yes. In Rascal Pages, for example, n8n and Claude generate a company website’s config from an interview collected by a voice agent.',
      },
      {
        question: 'Who maintains the workflows after launch?',
        answer: 'It depends. Maintenance is agreed separately, or the workflows are handed over to the client’s own team.',
      },
      {
        question: 'Can you fix or extend an existing n8n workflow?',
        answer: 'Yes, after a review. Without the details I won’t promise a schedule or a price.',
      },
    ],
    cta: {
      title: 'Which process do you repeat by hand?',
      body: 'Tell me what you do manually every week and we’ll see whether n8n should take it over.',
    },
  },
  {
    key: 'cost',
    lang: 'en',
    slug: PATHS.cost.en,
    kind: 'guide',
    metaTitle: 'Software development cost: where it comes from',
    metaDescription:
      'How much does software, an MVP or a mobile app cost? What drives the price, typical Finnish market rates and real numbers from building one SaaS product.',
    h1: 'Software development cost: where does it come from?',
    lead: `In Finland, MVP projects typically cost €5,000–20,000 and a software developer’s hourly rate is about €70–150 (excl. VAT). The price depends above all on scope: how many user roles, integrations and platforms you need. With me, MVP development starts from ${PRICES_EN.mvpFrom} and n8n automation from ${PRICES_EN.n8nFrom} (excl. VAT).`,
    sections: [
      {
        heading: 'What makes up the cost of software development?',
        body: [
          '- **Scope:** the number of views, user roles and business rules',
          '- **Platforms:** web only, or iOS and Android too',
          '- **Integrations:** payments, CRM, email, social channels and other external APIs',
          '- **Security and permissions:** for example, many customers’ data in one system',
          '- **AI features:** development work plus the running cost of model usage',
          '- **Testing and release process:** automated tests and CI that keep changes safe',
          '- **Maintenance and infrastructure:** servers, database and development after launch',
          '',
          'I price projects at a fixed price. The scope is written into the spec and payments are tied to review points.',
        ].join('\n'),
      },
      {
        heading: 'How much does an MVP cost?',
        body: `On the market, MVP prices start from about €3,000–5,000, and a typical project lands at €5,000–20,000. With me, MVP development starts from **${PRICES_EN.mvpFrom} (excl. VAT)**. Process and timeline: [MVP development](${serviceHref('mvp', 'en')}).`,
      },
      {
        heading: 'How much does a mobile app cost?',
        body: [
          'In Finland, mobile app prices typically start from about €6,000–20,000, and large apps cost considerably more. Publishing to two app stores adds cost: developer accounts, store review processes and testing on two platforms.',
          '',
          'Most should start with a web app or PWA that also works on the phone. If a native app is needed, one codebase for several platforms lowers the cost. My own apps [Altio](/en/projektit/altio) and [Pesä](/en/projektit/pesa), for example, run on iOS, Android and the web from the same code.',
        ].join('\n'),
      },
      {
        heading: 'What did building one SaaS product take?',
        body: [
          'My own numbers from building [Rascal AI](/en/projektit/rascal-ai) give a sense of what a production-grade SaaS contains:',
          '',
          '- about 207,000 lines of code',
          '- 423 releases in about 13 months',
          '- 1,400+ automated tests',
          '- 129 Vercel functions and 27 Supabase Edge Functions',
          '- 78 database tables with row-level security',
          '',
          'An MVP is a fraction of this: it’s built to prove one thing, and the rest is added once users have found the product.',
        ].join('\n'),
      },
      {
        heading: 'What running costs come after launch?',
        body: [
          '- **Hosting and database:** typically about €50–100/month for a small product with low traffic (e.g. Vercel + Supabase)',
          '- **AI models:** usage-based. The cost grows with the number of users and the choice of model.',
          '- **Third-party services:** email, payments, SMS and the like at their own prices',
          '- **Maintenance and further development:** agreed per project',
        ].join('\n'),
      },
      {
        heading: 'How can I reduce software development costs?',
        body: [
          '- **Scope the first version:** build what validates the idea and leave the rest for later',
          '- **Boring math first, AI second:** deterministic code is auditable and has no model cost',
          '- **Build where it’s an edge, buy where it isn’t:** an off-the-shelf service where your own wouldn’t set the product apart',
          '- **Web before app stores,** when it’s enough for your users',
        ].join('\n'),
      },
      { heading: 'How do I get an estimate for my project?', body: EN_CONTACT },
    ],
    faq: [
      {
        question: 'Is the price fixed or hourly?',
        answer: 'Client projects have a fixed price, agreed on a written estimate and spec before we start.',
      },
      {
        question: 'What is a software developer’s hourly rate in Finland?',
        answer: 'Typically about €70–150 per hour (excl. VAT), depending on experience and specialization. Seniors and specialists sit at the top of the range.',
      },
      {
        question: 'Can I get an estimate before committing?',
        answer: 'The 30-minute intro call and a written rough estimate are free.',
      },
    ],
    cta: {
      title: 'Want an estimate for your project?',
      body: 'Tell me what you’re building. You’ll get a free rough estimate of scope and cost.',
    },
  },
]

const pages: ServicePage[] = [...fiPages, ...enPages]

export function getServicePages(): ServicePage[] {
  return pages
}

export function getServicePage(slug: string): ServicePage | undefined {
  return pages.find((p) => p.slug === slug)
}

/** The same page in the other language, for hreflang and the language switch. */
export function servicePair(page: ServicePage, lang: Lang): ServicePage | undefined {
  return pages.find((p) => p.key === page.key && p.lang === lang)
}

export const servicePath = (slug: string): string => `/${slug}`

/** UKK-kohdat, joiden vastaus on valmis, pelkkänä tekstinä JSON-LD:tä varten. */
export function publishedFaq(page: ServicePage): FaqItem[] {
  return page.faq
    .filter((f) => !f.answer.includes(TODO_MARK))
    .map((f) => ({ question: f.question, answer: stripInlineMarkdown(f.answer) }))
}
