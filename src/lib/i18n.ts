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
