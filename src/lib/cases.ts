// Case-studyjen sisältö. Yksi totuuden lähde sekä etusivun Cases-osiolle
// että /projektit/:slug -detail-sivuille. Tekstit on johdettu oikeista
// projekteista ja blogiposteista — ei keksittyjä lukuja.

export type Outcome = { value: string; label: string }
export type ApproachStep = { title: string; body: string }
export type StackGroup = { group: string; items: string[] }
export type GalleryShot = { src: string; caption: string }

export type CaseStudy = {
  slug: string
  title: string
  tagline: string
  client: string
  role: string
  year: string
  featured: boolean
  /** Lyhyt kuvaus etusivun kortille. */
  summary: string
  problem: string
  approach: ApproachStep[]
  stack: StackGroup[]
  outcomes: Outcome[]
  highlights: string[]
  links: { label: string; href: string }[]
  /** Lisää kuvat kansioon public/cases/<slug>/ ja viittaa tähän. */
  gallery: GalleryShot[]
}

export const caseStudies: CaseStudy[] = [
  {
    slug: 'rascal-ai',
    title: 'Rascal AI',
    tagline: 'Markkinointikoneisto pk-yritykselle — yhdellä klikkauksella',
    client: 'Rascal Company',
    role: 'CTO & Founder',
    year: '2025',
    featured: true,
    summary:
      'Multi-tenant SaaS-alusta joka automatisoi pk-yritysten markkinoinnin: somepostaukset, uutiskirjeet ja sisällöntuotanto yhdestä paikasta.',
    problem:
      'Pk-yrityksellä on harvoin aikaa tai osaamista pyörittää jatkuvaa markkinointia. Sisältö jää tekemättä, kanavat hiljenevät ja kasvu pysähtyy — ei siksi ettei haluttaisi, vaan koska arki vie ajan. Tarvittiin järjestelmä joka hoitaa toistuvan työn puolesta mutta pitää brändin äänen.',
    approach: [
      {
        title: 'Multi-tenant arkkitehtuuri alusta asti',
        body: 'Jokaisen asiakkaan data on eristetty Postgresin rivitason käyttöoikeuksilla (RLS). Yksi alusta, ei jaettua dataa — skaalautuu asiakkaasta toiseen ilman erillistä pystytystä.'
      },
      {
        title: 'AI-sisältöputki, joka pitää äänen',
        body: 'Brändin tiedot ohjaavat LLM-generointia niin että postaukset, uutiskirjeet ja kampanjat kuulostavat asiakkaalta — eivät geneeriseltä botilta. Ihminen hyväksyy, kone tekee raskaan työn.'
      },
      {
        title: 'n8n liimaa palaset yhteen',
        body: 'Self-hosted n8n hoitaa ajastukset, julkaisut ja integraatiot kanaviin. Koko putki ajetaan rajapintojen yli, ei käsin klikkaillen.'
      }
    ],
    stack: [
      { group: 'Reasoning', items: ['OpenAI', 'Claude'] },
      { group: 'Product', items: ['React', 'Supabase', 'RLS', 'TypeScript'] },
      { group: 'Automation', items: ['n8n'] }
    ],
    outcomes: [
      { value: '8–10h', label: 'Aikasäästö / asiakas / viikko' },
      { value: '50+', label: 'Aktiivista käyttäjää' },
      { value: 'Multi-tenant', label: 'Org-eristetty data (RLS)' }
    ],
    highlights: [
      'Somepostaukset, uutiskirjeet ja sisältö yhdestä näkymästä',
      'Brändin ääni säilyy AI-generoinnissa',
      'Rivitason käyttöoikeudet eristävät jokaisen asiakkaan datan',
      'Sama koneisto skaalautuu uusille asiakkaille ilman pystytystä'
    ],
    links: [{ label: 'rascalai.fi', href: 'https://rascalai.fi' }],
    gallery: []
  },
  {
    slug: 'rascal-crm',
    title: 'Rascal CRM',
    tagline: 'Asiakkuudenhallinta + Voice AI samassa putkessa',
    client: 'Rascal Company',
    role: 'CTO & Founder',
    year: '2025',
    featured: true,
    summary:
      'Rascal-ekosysteemin myyntiputki: liidit, kontaktit ja kampanjat yhdessä — mukana AI-puhelut, viestiautomaatio ja GDPR-yhteensopiva opt-out-hallinta.',
    problem:
      'Myyntiputki, viestintä ja puhelut elävät tyypillisesti eri työkaluissa, eikä data keskustele keskenään. Rascalin asiakkaille tarvittiin yksi paikka jossa liidi etenee kontaktista kampanjaan ja puheluun — ilman että GDPR-velvoitteet jäävät jälkikäteen paikattaviksi.',
    approach: [
      {
        title: 'Liidi → kampanja → puhelu yhdessä putkessa',
        body: 'CRM yhdistää kontaktit, kampanjat ja viestiautomaation niin että koko myyntiprosessi näkyy yhdessä paikassa, org-tasolla eristettynä.'
      },
      {
        title: 'Voice AI -puhelukampanjat',
        body: 'VAPI-integraatio mahdollistaa AI-puhelut osana kampanjaa — soitot ajetaan automaatiosta, tulokset palaavat samaan putkeen.'
      },
      {
        title: 'GDPR sisäänrakennettuna',
        body: 'Opt-out-hallinta on osa tietomallia, ei jälkikäteen liimattu lisäosa. Suostumukset ja kiellot kulkevat datan mukana.'
      }
    ],
    stack: [
      { group: 'Product', items: ['React', 'Supabase', 'RLS', 'TypeScript'] },
      { group: 'Voice', items: ['VAPI'] },
      { group: 'Automation', items: ['n8n'] }
    ],
    outcomes: [
      { value: 'Voice AI', label: 'Puhelukampanjat (VAPI)' },
      { value: 'Multi-tenant', label: 'Org-eristetty data' },
      { value: 'GDPR', label: 'Opt-out tietomallissa' }
    ],
    highlights: [
      'Liidit, kontaktit ja kampanjat yhdessä näkymässä',
      'AI-puhelut osana automaatioputkea',
      'Viestiautomaatio kanavien yli',
      'Suostumukset ja opt-out osa tietomallia'
    ],
    links: [{ label: 'rascalai.fi', href: 'https://rascalai.fi' }],
    gallery: []
  },
  {
    slug: 'superhuman',
    title: 'Superhuman',
    tagline: 'Valmentaja, joka tuntee sinut — ja perustelee neuvonsa datallasi',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    year: '2026',
    featured: false,
    summary:
      'Henkilökohtainen valmennussovellus joka yhdistää terveysdatan, periodisoidun treeniohjelman ja AI-valmentajan, joka muistaa ja perustelee neuvonsa omalla datallasi.',
    problem:
      'Useimmilla terveys on hajallaan: uni yhdessä sovelluksessa, treenit toisessa, ravinto kolmannessa. Dataa on enemmän kuin koskaan, mutta ymmärrystä ei yhtään enempää. Numerot eivät kerro mitä niille pitäisi tehdä.',
    approach: [
      {
        title: 'Kaikki yhdessä näkymässä',
        body: 'Uni, syke, palautuminen, treeni ja ravinto saman katon alle suoraan puhelimen terveysdatasta — niin että alat nähdä yhteyksiä huonon yön ja heikon treenin välillä.'
      },
      {
        title: 'AI-valmentaja, joka muistaa ja perustelee',
        body: 'Valmentaja ei toista internetin yleisviisauksia vaan katsoo sinun dataasi. Se muistaa aiemmat keskustelut (pgvector-muisti) ja näyttää aina mihin lukuihin neuvo nojaa.'
      },
      {
        title: 'Treeni, joka mukautuu palautumiseen',
        body: 'Periodisoitu ohjelma elää sen mukaan miten keho vastaa: hyvän viikon jälkeen rima nousee, kuormittavan jakson jälkeen tulee tilaa. Oikea määrä oikeaan aikaan.'
      }
    ],
    stack: [
      { group: 'App', items: ['React Native', 'Expo', 'HealthKit'] },
      { group: 'Backend', items: ['Supabase', 'Deno', 'pgvector'] }
    ],
    outcomes: [
      { value: 'iOS', label: 'HealthKit-data' },
      { value: 'AI-valmentaja', label: 'pgvector-muisti' },
      { value: 'Adaptiivinen', label: 'Treeni mukautuu palautumiseen' }
    ],
    highlights: [
      'Terveys, treeni ja ravinto yhdessä tarinassa',
      'Valmentaja perustelee neuvonsa omalla datallasi',
      'Muistaa aiemmat keskustelut yli sessioiden',
      'Treeniohjelma päivittyy viikosta toiseen'
    ],
    links: [
      { label: 'Live', href: 'https://superhuman-ios.vercel.app/' },
      { label: 'Blogi: näin se on rakennettu', href: '/blog/nain-superhuman-on-rakennettu' }
    ],
    gallery: []
  },
  {
    slug: 'pesa',
    title: 'Pesä',
    tagline: 'Anna jokaiselle eurolle koti — yksityisyys edellä',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    year: '2026',
    featured: false,
    summary:
      'Local-first budjetointisovellus joka tuo YNAB-kirjekuorimetodin suomalaiseen arkeen. Palkkavetoinen rytmi, täysi tavoite- ja tapahtumahallinta, data pysyy laitteella.',
    problem:
      'Useimmat budjetointisovellukset budjetoivat peruutuspeilistä: ne imevät tilitapahtumat pankistasi ja näyttävät mihin rahasi jo menivät. Se kertoo menneestä mutta ei auta suunnittelemaan tulevaa — ja vaatii luovuttamaan arkaluontoisimman datasi pilveen.',
    approach: [
      {
        title: 'Kirjekuoribudjetointi, modernisti',
        body: 'Kun rahaa tulee, jaat sen heti kirjekuoriin eri tarkoituksia varten. Jokaisella eurolla on tehtävä jo ennen kuin sitä on käytetty — YNAB:n neljä sääntöä tuotteen ytimessä.'
      },
      {
        title: 'Palkkavetoinen rytmi',
        body: 'Pesä ei pollaa pankkiasi taustalla. Se rakentuu yhden tietoisen hetken ympärille: kun palkka kolahtaa, avaat "Palkka tuli" -näkymän ja jaat rahat. Viisi minuuttia, jotka antavat hallinnan koko kuukaudeksi.'
      },
      {
        title: 'Yksityisyys on arkkitehtuuri, ei ominaisuus',
        body: 'Data elää laitteella paikallisessa SQLite-tietokannassa, ei pilvessä. Skeema on silti rakennettu valmiiksi tulevaa Supabase-synkronointia ja avoimen pankkitoiminnan integraatiota varten — silloin kun käyttäjä sen itse valitsee.'
      }
    ],
    stack: [
      { group: 'App', items: ['React Native', 'Expo', 'TypeScript'] },
      { group: 'Data', items: ['Drizzle ORM', 'SQLite', 'TanStack Query', 'Zustand'] },
      { group: 'Pilvi (suunniteltu)', items: ['Supabase', 'RLS'] }
    ],
    outcomes: [
      { value: 'Kirjekuoret', label: 'YNAB-metodi' },
      { value: 'Local-first', label: 'Data pysyy laitteella' },
      { value: '2 kieltä', label: 'fi-FI ja en-US' }
    ],
    highlights: [
      'Onboarding-velho: budjetti valmiina muutamassa minuutissa',
      'Kuukausinäkymä: allokoitu / käytetty / käytettävissä',
      'Rahaa käsitellään sentteinä — ei liukulukuvirheitä',
      'Offline-first, ei lähetä taloustietoja minnekään'
    ],
    links: [{ label: 'Blogi: miksi rakensin Pesän', href: '/blog/pesa-anna-jokaiselle-eurolle-koti' }],
    gallery: []
  }
]

export function getCaseStudy(slug: string): CaseStudy | undefined {
  return caseStudies.find((c) => c.slug === slug)
}
