import type { Lang } from './parsePost'

type Dict = {
  blogTitle: string
  blogSubtitle: string
  empty: string
  back: string
  notFoundTitle: string
  notFoundBody: string
  /** Label of the link that switches to the other language. */
  switchLabel: string
  // Author line
  byline: string
  published: string
  updated: string
  caseBuiltBy: string
  caseMvpCta: string
  postCtaTitle: string
  postCtaBody: string
  postCtaMvp: string
  postCtaN8n: string
  postCtaCost: string
  faqTitle: string
  // Case pages
  caseBack: string
  caseNotFound: string
  caseNotFoundBody: string
  caseProblem: string
  caseSolution: string
  caseGallery: string
  caseHighlights: string
  caseStack: string
  caseImageComing: string
  caseCtaTitle: string
  caseCtaBody: string
  caseOther: string
  // Contact form
  formName: string
  formCompany: string
  formEmail: string
  formMessage: string
  formMessagePh: string
  formConsent: string
  formSend: string
  formSending: string
  formOkTitle: string
  formOkBody: string
  formError: string
  // Newsletter
  nlTitle: string
  nlBody: string
  nlPlaceholder: string
  nlCta: string
  nlOk: string
}

const strings: Record<Lang, Dict> = {
  fi: {
    blogTitle: 'Blogi',
    blogSubtitle: 'Ajatuksia ja muistiinpanoja.',
    empty: 'Ei vielä postauksia.',
    back: '← Takaisin blogiin',
    notFoundTitle: 'Postausta ei löytynyt',
    notFoundBody: 'Tarkista osoite tai palaa blogiin.',
    switchLabel: 'In English',
    byline: 'Kirjoittaja',
    published: 'Julkaistu',
    updated: 'Päivitetty',
    caseBuiltBy: 'Rakentanut',
    caseMvpCta: 'Näin MVP-projekti etenee →',
    postCtaTitle: 'Tarvitsetko tekijän omaan projektiisi?',
    postCtaBody: 'Rakennan MVP:t, AI-integraatiot ja n8n-automaatiot ideasta tuotantoon.',
    postCtaMvp: 'MVP-kehitys',
    postCtaN8n: 'n8n-automaatiot',
    postCtaCost: 'Ohjelmistokehityksen hinta',
    faqTitle: 'Usein kysytyt kysymykset',
    // Case pages
    caseBack: 'Takaisin projekteihin',
    caseNotFound: 'Projektia ei löytynyt',
    caseNotFoundBody: 'Tarkista osoite tai palaa projekteihin.',
    caseProblem: 'Ongelma',
    caseSolution: 'Ratkaisu',
    caseGallery: 'Galleria',
    caseHighlights: 'Mitä mukana',
    caseStack: 'Stack',
    caseImageComing: 'Kuva tulossa',
    caseCtaTitle: 'Rakennetaanko sinulle vastaava?',
    caseCtaBody: 'Kerro projektistasi — vastaan yleensä saman päivän aikana.',
    caseOther: 'Muut projektit',
    // Contact form
    formName: 'Nimi',
    formCompany: 'Yritys',
    formEmail: 'Sähköposti',
    formMessage: 'Viesti',
    formMessagePh: 'Kerro lyhyesti mitä olette tekemässä ja missä voisin auttaa.',
    formConsent: 'Minulle saa lähettää sähköpostia projekteista ja kirjoituksista',
    formSend: 'Lähetä',
    formSending: 'Lähetetään…',
    formOkTitle: 'Kiitos, viesti on lähetetty!',
    formOkBody: 'Palaan sinulle pian sähköpostitse.',
    formError: 'Lähetys epäonnistui — yritä hetken päästä uudelleen.',
    // Newsletter
    nlTitle: 'Saat uudet kirjoitukset mailiin',
    nlBody: 'Ei spämmiä — vain kun julkaisen jotain.',
    nlPlaceholder: 'sahkoposti@esimerkki.fi',
    nlCta: 'Tilaa',
    nlOk: 'Kiitos! Olet listalla.',
  },
  en: {
    blogTitle: 'Blog',
    blogSubtitle: 'Thoughts and notes.',
    empty: 'No posts yet.',
    back: '← Back to the blog',
    notFoundTitle: 'Post not found',
    notFoundBody: 'Check the URL or head back to the blog.',
    switchLabel: 'Suomeksi',
    byline: 'By',
    published: 'Published',
    updated: 'Updated',
    caseBuiltBy: 'Built by',
    caseMvpCta: 'How an MVP project works →',
    postCtaTitle: 'Need a builder for your own project?',
    postCtaBody: 'I build MVPs, AI integrations and n8n automation from idea to production.',
    postCtaMvp: 'MVP development',
    postCtaN8n: 'n8n automation',
    postCtaCost: 'Software development cost',
    faqTitle: 'Frequently asked questions',
    // Case pages
    caseBack: 'Back to projects',
    caseNotFound: 'Project not found',
    caseNotFoundBody: 'Check the URL or head back to projects.',
    caseProblem: 'Problem',
    caseSolution: 'Solution',
    caseGallery: 'Gallery',
    caseHighlights: 'Highlights',
    caseStack: 'Stack',
    caseImageComing: 'Image coming',
    caseCtaTitle: 'Want one like this?',
    caseCtaBody: 'Tell me about your project — I usually reply the same day.',
    caseOther: 'Other projects',
    // Contact form
    formName: 'Name',
    formCompany: 'Company',
    formEmail: 'Email',
    formMessage: 'Message',
    formMessagePh: "Briefly: what you’re building and where I could help.",
    formConsent: 'You may email me about projects and writing',
    formSend: 'Send',
    formSending: 'Sending…',
    formOkTitle: 'Thanks — message sent!',
    formOkBody: "I’ll get back to you by email soon.",
    formError: 'Sending failed — please try again shortly.',
    // Newsletter
    nlTitle: 'Get new posts by email',
    nlBody: 'No spam — only when I publish.',
    nlPlaceholder: 'you@example.com',
    nlCta: 'Subscribe',
    nlOk: "Thanks — you’re on the list.",
  },
}

export function t(lang: Lang, key: keyof Dict): string {
  return strings[lang][key]
}

export const otherLang = (lang: Lang): Lang => (lang === 'fi' ? 'en' : 'fi')

// URL scheme lives here so pages never hardcode the `/en` prefix.
export const blogListPath = (lang: Lang): string => (lang === 'fi' ? '/blog' : '/en/blog')
export const blogPostPath = (lang: Lang, slug: string): string =>
  lang === 'fi' ? `/blog/${slug}` : `/en/blog/${slug}`
export const casePath = (lang: Lang, slug: string): string =>
  lang === 'fi' ? `/projektit/${slug}` : `/en/projektit/${slug}`
export const homePath = (lang: Lang): string => (lang === 'fi' ? '/' : '/en')

// Service/about pages have different slugs per language; keep in sync with
// lib/servicePages.ts (PATHS). Tested in i18n.test.ts.
const SERVICE_MIRRORS: [fi: string, en: string][] = [
  ['/tietoa', '/en/about'],
  ['/mvp-kehitys', '/en/mvp-development'],
  ['/n8n-automaatiot', '/en/n8n-automation'],
  ['/ohjelmistokehityksen-hinta', '/en/software-development-cost'],
]

// Maps the current path to its counterpart in the other language, for the
// nav language switcher. Pages that don't exist in the other language fall
// back to its home rather than a 404.
export function mirrorPath(pathname: string): string {
  for (const [fi, en] of SERVICE_MIRRORS) {
    if (pathname === fi) return en
    if (pathname === en) return fi
  }
  if (pathname === '/en' || pathname.startsWith('/en/')) return pathname.replace(/^\/en\/?/, '/') || '/'
  if (pathname === '/') return '/en'
  if (pathname.startsWith('/projektit/') || pathname.startsWith('/blog')) return `/en${pathname}`
  return '/en'
}
