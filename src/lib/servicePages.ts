// Suomenkieliset myynti- ja tietoa-sivut (/tietoa, /mvp-kehitys,
// /n8n-automaatiot, /ohjelmistokehityksen-hinta). Yksi lähde sekä sivulle että
// sen metatiedoille ja JSON-LD:lle (lib/routes.ts).
//
// Sääntö: tähän kirjoitetaan vain faktoja, jotka löytyvät jo repon sisällöstä
// (cases.ts, site/copy.ts). Kaikki muu — hinnat, kestot, lupaukset,
// asiakasesimerkit — on muodossa `TODO(Sami): …`, ja sivu näyttää ne
// lihavoituna, jotta ne erottuvat esikatselussa. FAQ-vastaukset, joissa on
// TODO, jätetään pois FAQPage-merkinnästä (ks. publishedFaq).
import { getCases } from './cases'
import { casePath } from './i18n'
import { stripInlineMarkdown, type FaqItem } from './seo'

export type ServiceSection = { heading: string; /** Markdown. */ body: string }

export type ServicePage = {
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

/** Markdown-lista case-sivuista; tekstit tulevat suoraan cases.ts:stä. */
function caseList(slugs?: string[]): string {
  const cases = getCases('fi').filter((c) => !slugs || slugs.includes(c.slug))
  return cases
    .map((c) => {
      const outcome = c.outcomes[0] ? ` (${c.outcomes[0].value} ${c.outcomes[0].label})` : ''
      return `- **[${c.title}](${casePath('fi', c.slug)})** — ${c.tagline}. Rooli: ${c.role}${outcome}.`
    })
    .join('\n')
}

const CONTACT_LINKS =
  'Sähköposti: [sami@mak8r.fi](mailto:sami@mak8r.fi). Vastaan yleensä saman päivän aikana. Voit myös käyttää alla olevaa lomaketta.'

const SERVICE_LINKS = [
  '- [MVP-kehitys](/mvp-kehitys): ensimmäinen versio tuotteesta tuotantoon',
  '- [n8n-automaatiot](/n8n-automaatiot): työnkulut ja integraatiot, jotka pyörivät tuotannossa',
  '- [Ohjelmistokehityksen hinta](/ohjelmistokehityksen-hinta): mistä kustannus syntyy',
].join('\n')

const pages: ServicePage[] = [
  {
    slug: 'tietoa',
    kind: 'about',
    metaTitle: 'Tietoa: Sami Kiias, fullstack-tuoterakentaja ja CTO',
    metaDescription:
      'Sami Kiias on fullstack-tuoterakentaja ja Rascal AI:n CTO. Kuusi rakennettua tuotetta ja 11 vuotta yrittäjänä. Tausta, projektit ja yhteystiedot.',
    h1: 'Sami Kiias – fullstack-tuoterakentaja ja CTO',
    lead:
      'Olen Sami Kiias, fullstack-tuoterakentaja ja Rascal AI:n CTO. Rakennan tuotteita ideasta tuotantoon: multi-tenant SaaS, mobiilisovellukset ja AI-integraatiot. Olen rakentanut kuusi tuotetta, ja niistä kolme on tuotannossa maksavilla asiakkailla.',
    sections: [
      {
        heading: 'Mitä Sami Kiias rakentaa?',
        body: [
          'Fullstack-tuotteita, jotka pyörivät tuotannossa, en demoja. Rakennan sekä käyttöliittymän, backendin, tietokannan että AI-integraatiot. Sama stack pyörittää omia tuotteitani ja asiakasprojekteja.',
          '',
          '- **SaaS:** multi-tenant-alustat, joissa data on eristetty tietokantatasolla (RLS)',
          '- **Mobiilisovellukset:** iOS, Android ja web yhdestä koodipohjasta (Expo, React Native)',
          '- **AI-integraatiot:** Claude, ElevenLabs ja MCP-serverit tuotantokäytössä',
          '- **Automaatiot:** self-hosted n8n, webhookit ja integraatiot järjestelmästä toiseen',
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
          '- **[Rascal AI](https://rascalai.fi):** CTO. AI-markkinointi ja -myynti pk-yrityksille, kolme tuotetta.',
          '- **Altio:** solo developer. AI-valmennussovellus treeniin, ravintoon ja palautumiseen.',
          '- **[Mak8r.fi](https://mak8r.fi):** perustaja. Tuotekehitys- ja AI-projektit toimeksiannosta.',
        ].join('\n'),
      },
      { heading: 'Mitä Sami on rakentanut?', body: caseList() },
      {
        heading: 'Mistä löydän Samin sisältöjä?',
        body: [
          '- [Blogi](/blog): kirjoituksia tekoälystä, markkinoinnin automaatiosta ja tuotekehityksestä',
          '- [YouTube @samikiias](https://www.youtube.com/@samikiias): Build in Public, eli tutoriaaleja ja projektien läpikäyntejä',
          '- [GitHub](https://github.com/slemppa)',
          `- LinkedIn: **${TODO_MARK}: LinkedIn-profiilin URL**`,
          `- Instagram: **${TODO_MARK}: Instagram-profiilin URL**`,
        ].join('\n'),
      },
      { heading: 'Millaisissa projekteissa Sami voi auttaa?', body: SERVICE_LINKS },
      { heading: 'Miten saan Samiin yhteyden?', body: CONTACT_LINKS },
    ],
    faq: [],
    cta: {
      title: 'Rakennetaanko seuraava tuotteesi?',
      body: 'Kerro tilanteestasi, oli kyse uudesta tuotteesta, MVP:stä tai AI-ominaisuudesta olemassa olevaan järjestelmään.',
    },
  },
  {
    slug: 'mvp-kehitys',
    kind: 'service',
    serviceType: 'MVP-kehitys',
    metaTitle: 'MVP-kehitys ideasta tuotantoon · Sami Kiias',
    metaDescription:
      'Freelance fullstack-kehittäjä MVP:n rakentamiseen: prosessi vaiheittain, aikataulu, hintahaarukka ja tuotantoon viedyt caset. Sami Kiias.',
    h1: 'MVP-kehitys: tuotteesi ensimmäinen versio tuotantoon',
    lead: `Rakennan MVP:n ideasta tuotantoon yksin, fullstack-tekijänä: käyttöliittymä, backend, tietokanta, AI-integraatiot ja julkaisu. Olen rakentanut kuusi tuotetta, ja niistä kolme on tuotannossa maksavilla asiakkailla. **${TODO_MARK}: tyypillinen kesto ja hintahaarukka euroina yhdellä lauseella.**`,
    sections: [
      {
        heading: 'Kenelle MVP-kehitys sopii?',
        body: [
          '- Yritykselle tai yrittäjälle, jolla on tuoteidea ja joka haluaa sen oikeiden käyttäjien käsiin',
          '- Tiimille, joka tarvitsee AI-ominaisuuden olemassa olevaan järjestelmään',
          '- Tilanteeseen, jossa tarvitaan yksi tekijä koko pinoon eikä erillisiä frontend-, backend- ja AI-toimittajia',
          '',
          `**${TODO_MARK}: kenelle MVP-kehitys ei sovi (esim. budjetti- tai laajuusraja).**`,
        ].join('\n'),
      },
      {
        heading: 'Miten MVP-projekti etenee?',
        body: [
          `1. **Kartoitus:** mitä rakennetaan ensin ja mitä jätetään tarkoituksella pois. **${TODO_MARK}: kesto ja mitä asiakas saa tästä vaiheesta.**`,
          `2. **Speksi ennen koodia:** kirjallinen määrittely ennen rakentamista. **${TODO_MARK}: kesto.**`,
          `3. **Rakentaminen pienissä julkaisuissa:** testit ennen mergeä ja julkaisu jatkuvasti, jotta näet edistymisen tuotannossa. **${TODO_MARK}: kuinka usein asiakas näkee välidemon.**`,
          `4. **Tuotantoon ja luovutus:** julkaisu oikeille käyttäjille. **${TODO_MARK}: mitä luovutukseen kuuluu (koodi, dokumentaatio, tunnukset).**`,
        ].join('\n'),
      },
      {
        heading: 'Kauanko MVP:n rakentaminen kestää?',
        body: [
          `**${TODO_MARK}: tyypillinen aikataulu viikkoina.**`,
          '',
          'Toteutuneita esimerkkejä: [Arkireitti](/projektit/perhe-app), perheen tehtävätaulu, rakennettiin kolmessa päivässä. [Rascal AI](/projektit/rascal-ai) on julkaissut 423 versiota noin 13 kuukaudessa.',
        ].join('\n'),
      },
      {
        heading: 'Paljonko MVP maksaa?',
        body: [
          `**${TODO_MARK}: hintahaarukka euroina (alv 0 %) ja mistä se riippuu.**`,
          '',
          'Erittely hinnan osista: [Ohjelmistokehityksen hinta: mistä kustannus syntyy](/ohjelmistokehityksen-hinta).',
        ].join('\n'),
      },
      {
        heading: 'Millaisia tuotteita olen rakentanut?',
        body: [
          caseList(['rascal-ai', 'altio', 'perhe-app']),
          '',
          'Kaikki projektit: [Tietoa Samista](/tietoa).',
        ].join('\n'),
      },
      {
        heading: 'Millä teknologioilla MVP rakennetaan?',
        body:
          'Tuotannossa käytän React- ja TypeScript-pohjaista stackia: Supabase tai Neon Postgres, rivitason käyttöoikeudet (RLS), Vercel, mobiiliin Expo ja React Native, AI-ominaisuuksiin Claude ja automaatioihin n8n. Sama stack pyörittää Rascal AI:ta ja omia sovelluksiani.',
      },
      { heading: 'Miten pääsemme alkuun?', body: CONTACT_LINKS },
    ],
    faq: [
      { question: 'Omistanko MVP:n lähdekoodin?', answer: `**${TODO_MARK}: koodin ja IP:n omistus.**` },
      { question: 'Teetkö työn yksin vai tiimin kanssa?', answer: `**${TODO_MARK}: yksin / alihankkijat.**` },
      {
        question: 'Voiko MVP:hen rakentaa AI-ominaisuuksia?',
        answer:
          'Voi. Olen rakentanut tuotantoon muun muassa AI-sisältöputken, ääniagentteja (ElevenLabs) ja MCP-serverin, jonka kautta Claude käyttää tuotetta. Esimerkkejä on [Rascal AI -casessa](/projektit/rascal-ai).',
      },
      {
        question: 'Mitä tapahtuu julkaisun jälkeen?',
        answer: `**${TODO_MARK}: ylläpito, jatkokehitys ja sen hinnoittelu.**`,
      },
    ],
    cta: {
      title: 'Kerro MVP-ideastasi',
      body: 'Kuvaa lyhyesti, mitä olet rakentamassa ja kenelle, niin katsotaan miten se kannattaa toteuttaa.',
    },
  },
  {
    slug: 'n8n-automaatiot',
    kind: 'service',
    serviceType: 'n8n-konsultointi ja automaatiot',
    metaTitle: 'n8n-automaatiot tuotantoon – n8n-konsultti · Sami Kiias',
    metaDescription:
      'n8n-konsultti: rakennan n8n-työnkulut, jotka pyörivät tuotannossa. AI-putket, integraatiot ja webhookit. Esimerkit, hinnoittelumalli ja UKK.',
    h1: 'n8n-automaatiot, jotka pyörivät tuotannossa',
    lead:
      'Rakennan n8n-työnkulkuja, jotka tekevät tuotannossa oikeaa työtä: AI-sisältöputkia, integraatioita järjestelmien välille ja webhook-pohjaisia automaatioita. Käytän n8n:ää itse Rascal AI:n ja Rascal Pagesin tuotantoputkissa.',
    sections: [
      {
        heading: 'Mihin n8n:ää käytetään tuotannossa?',
        body: [
          'n8n on koneiston liimaa. Se hoitaa työnkulut, webhookit ja integraatiot palasta toiseen. Ajan sitä self-hostattuna, jolloin data pysyy omassa hallinnassa.',
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
          '',
          `**${TODO_MARK}: 2–3 oikeaa asiakasesimerkkiä (mitä automatisoitiin ja mitä se säästi), jos ne saa julkaista.**`,
        ].join('\n'),
      },
      {
        heading: 'Milloin n8n kannattaa ja milloin ei?',
        body:
          'Periaatteeni on, että kolmas toisto automatisoidaan: kahdesti käsin, kolmannella kerralla koneelle. Rakennan itse, kun se on kilpailuetu, ja ostan valmiin, kun ei ole. Kaiken, minkä voi laskea deterministisesti, lasken koodilla, ja tekoäly saa vain harkintaa vaativat vaiheet.\n\n' +
          `**${TODO_MARK}: konkreettiset merkit siitä, milloin n8n ei ole oikea työkalu (esim. milloin kannattaa kirjoittaa oma palvelu).**`,
      },
      {
        heading: 'Self-hosted n8n vai n8n Cloud?',
        body: `Omissa tuotteissani ajan n8n:ää self-hostattuna, jotta data pysyy täysin omassa hallinnassa. **${TODO_MARK}: suositus asiakkaalle ja millä perusteella.**`,
      },
      {
        heading: 'Miten n8n-projekti hinnoitellaan?',
        body: `**${TODO_MARK}: hinnoittelumalli (kiinteä per työnkulku / tuntiperusteinen / kuukausiylläpito) ja esimerkkihinta.** Yleiskuva hinnan osista: [Ohjelmistokehityksen hinta](/ohjelmistokehityksen-hinta).`,
      },
      { heading: 'Miten pääsemme alkuun?', body: CONTACT_LINKS },
    ],
    faq: [
      {
        question: 'Voiko n8n-työnkulkuun kytkeä tekoälyn?',
        answer:
          'Voi. Esimerkiksi Rascal Pagesissa n8n ja Claude generoivat yrityksen verkkosivun konfiguraation ääniagentin keräämästä haastattelusta.',
      },
      { question: 'Kuka ylläpitää työnkulkuja käyttöönoton jälkeen?', answer: `**${TODO_MARK}: ylläpitomalli.**` },
      { question: 'Voitko korjata tai jatkaa olemassa olevaa n8n-työnkulkua?', answer: `**${TODO_MARK}: kyllä/ei ja ehdot.**` },
    ],
    cta: {
      title: 'Mikä prosessi teillä toistuu käsin?',
      body: 'Kerro, mitä teette käsin joka viikko, niin katsotaan kannattaako se automatisoida n8n:llä.',
    },
  },
  {
    slug: 'ohjelmistokehityksen-hinta',
    kind: 'guide',
    metaTitle: 'Ohjelmistokehityksen hinta: mistä kustannus syntyy',
    metaDescription:
      'Paljonko ohjelmisto tai mobiilisovellus maksaa? Mistä hinta koostuu, esimerkkihaarukat ja omat luvut yhden SaaS-tuotteen rakentamisesta.',
    h1: 'Ohjelmistokehityksen hinta: mistä kustannus syntyy?',
    lead: `**${TODO_MARK}: suora vastaus, eli tyypillinen hintahaarukka euroina MVP:lle ja mobiilisovellukselle.** Hinta riippuu ennen kaikkea laajuudesta: montako käyttäjäroolia, integraatiota ja alustaa (web, iOS, Android) tarvitaan.`,
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
          `**${TODO_MARK}: miten nämä näkyvät omassa hinnoittelussa (esim. painoarvot tai esimerkkilaskelma).**`,
        ].join('\n'),
      },
      {
        heading: 'Paljonko MVP maksaa?',
        body: `**${TODO_MARK}: hintahaarukka euroina ja mitä siihen sisältyy.** Prosessi ja aikataulu: [MVP-kehitys](/mvp-kehitys).`,
      },
      {
        heading: 'Paljonko mobiilisovellus maksaa?',
        body: [
          `**${TODO_MARK}: hintahaarukka euroina.**`,
          '',
          'Yksi kustannukseen vaikuttava valinta on koodipohjien määrä. Esimerkiksi [Altio](/projektit/altio) ja [Pesä](/projektit/pesa) toimivat iOS:llä, Androidilla ja webissä yhdestä koodipohjasta. Erilliset natiivisovellukset tarkoittaisivat useampaa toteutusta.',
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
          `**${TODO_MARK}: halutaanko julkaista työmäärä tai kustannus euroina.**`,
        ].join('\n'),
      },
      {
        heading: 'Mitä juoksevia kuluja julkaisun jälkeen tulee?',
        body: `**${TODO_MARK}: tyypilliset kuukausikulut (hosting, tietokanta, AI-mallit, ylläpito) esimerkkeineen.**`,
      },
      {
        heading: 'Miten ohjelmistokehityksen kustannuksia voi pienentää?',
        body: [
          '- **Rajaa ensimmäinen versio:** rakenna se, millä idea validoidaan, ja jätä loput myöhemmäksi',
          '- **Tylsä matikka ensin, AI vasta sitten:** deterministinen koodi on auditoitavaa eikä maksa mallikuluja',
          '- **Rakenna kun se on etu, osta kun ei ole:** valmis palvelu siellä, missä oma toteutus ei erota tuotetta',
          '- **Yksi koodipohja usealle alustalle,** kun se sopii tuotteeseen',
        ].join('\n'),
      },
      { heading: 'Miten saan arvion omasta projektistani?', body: CONTACT_LINKS },
    ],
    faq: [
      { question: 'Onko hinta kiinteä vai tuntiperusteinen?', answer: `**${TODO_MARK}: hinnoittelumalli.**` },
      { question: 'Mitä tuntihinta on?', answer: `**${TODO_MARK}: tuntihinta tai päivähinta.**` },
      { question: 'Saako arvion ennen sitoutumista?', answer: `**${TODO_MARK}: maksuton arvio / kartoituksen hinta.**` },
    ],
    cta: {
      title: 'Haluatko arvion omasta projektistasi?',
      body: 'Kerro mitä olet rakentamassa, niin arvioidaan laajuus ja kustannus.',
    },
  },
]

export function getServicePages(): ServicePage[] {
  return pages
}

export function getServicePage(slug: string): ServicePage | undefined {
  return pages.find((p) => p.slug === slug)
}

export const servicePath = (slug: string): string => `/${slug}`

/** UKK-kohdat, joiden vastaus on valmis, pelkkänä tekstinä JSON-LD:tä varten. */
export function publishedFaq(page: ServicePage): FaqItem[] {
  return page.faq
    .filter((f) => !f.answer.includes(TODO_MARK))
    .map((f) => ({ question: f.question, answer: stripInlineMarkdown(f.answer) }))
}
