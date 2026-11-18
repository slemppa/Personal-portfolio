// SEO-reitit: yksi lähde sekä sivujen metadatalle (generateMetadata) että
// sitemapille. Puhtaita funktioita, jotta molemmat tuottavat saman tuloksen.
import type { Metadata, MetadataRoute } from 'next'
import { selectPosts, type Lang, type Post } from './parsePost'
import { getCases, type CaseStudy } from './cases'
import { getServicePages, publishedFaq, servicePair, servicePath, type ServicePage } from './servicePages'
import { blogListPath, blogPostPath, casePath, homePath } from './i18n'
import {
  DEFAULT_OG_IMAGE,
  SITE_NAME,
  PERSON_ID,
  WEBSITE_ID,
  absoluteUrl,
  clampText,
  faqJsonLd,
  postModified,
  firstParagraph,
  ogLocale,
  pageTitle,
  postJsonLd,
} from './seo'

const LANGS: Lang[] = ['fi', 'en']

// Hakutulosta varten kirjoitetut tekstit (otsikko 30–60, kuvaus 70–160 merkkiä).
const HOME_META: Record<Lang, { title: string; description: string }> = {
  fi: {
    title: 'Sami Kiias — Fullstack-tuoterakentaja',
    description:
      'Rakennan fullstack-tuotteita ideasta tuotantoon: SaaS, mobiilisovellukset ja AI-integraatiot. Kuusi tuotetta, kolme tuotannossa maksavilla asiakkailla.',
  },
  en: {
    title: 'Sami Kiias — Fullstack product builder',
    description:
      'I build fullstack products from idea to production: SaaS, mobile apps and AI integrations. Six products built, three in production with paying customers.',
  },
}

const BLOG_META: Record<Lang, { title: string; description: string }> = {
  fi: {
    title: 'Blogi: AI, markkinointi ja tuotekehitys · Sami Kiias',
    description:
      'Käytännön kirjoituksia tekoälystä, markkinoinnin automaatiosta ja SaaS-tuotteiden rakentamisesta pk-yrityksen näkökulmasta.',
  },
  en: {
    title: 'Blog: AI, marketing and product building · Sami Kiias',
    description:
      'Practical writing on AI, marketing automation and building SaaS products, from the point of view of a small business.',
  },
}

export type Route = {
  path: string
  lang: Lang
  title: string
  description?: string
  image?: string
  type: 'website' | 'article'
  publishedTime?: string
  alternates: { hreflang: string; path: string }[]
  jsonLd: Record<string, unknown>[]
  /** Sitemapin painotus: etusivu > listat > sisältösivut. */
  priority: number
  lastmod?: string
  /** Pois sitemapista + `noindex, nofollow`. */
  noindex?: boolean
}

/**
 * Reitit joita ei saa indeksoida: admin-näkymä ja asiakaskohtaiset
 * tarjoussivut. Nämä jätetään sitemapista pois ja prerenderöidään
 * `noindex, nofollow` -tagilla.
 *
 * Miksi ei robots.txt:n Disallow: Disallow estää crawlin, jolloin hakukone ei
 * koskaan näe noindex-tagia — ja voi silti indeksoida paljaan URLin ulkoisen
 * linkin perusteella. Crawlattava noindex on ainoa signaali joka oikeasti
 * pitää sivun poissa indeksistä.
 *
 * Dynaamiset :id-polut (/tarjous/:id, /offer/:id) katetaan lisäksi
 * `X-Robots-Tag`-headerilla next.config.ts:ssä. Pidä listat synkassa.
 */
const NOINDEX_ROUTES: { path: string; lang: Lang; title: string }[] = [
  { path: '/hallinta', lang: 'fi', title: 'Hallinta · Sami Kiias' },
  { path: '/tarjous', lang: 'fi', title: 'Tarjous · Sami Kiias' },
  { path: '/offer', lang: 'en', title: 'Offer · Sami Kiias' },
]

function noindexRoutes(): Route[] {
  return NOINDEX_ROUTES.map(({ path, lang, title }) => ({
    path,
    lang,
    title,
    type: 'website' as const,
    alternates: [],
    jsonLd: [],
    priority: 0,
    noindex: true,
  }))
}

export function collectRoutes(allPosts: Post[]): Route[] {
  // Index only what production actually serves — drafts stay dev-only.
  const posts = selectPosts(allPosts, false)
  const routes: Route[] = []

  for (const lang of LANGS) {
    routes.push({
      path: homePath(lang),
      lang,
      title: HOME_META[lang].title,
      description: HOME_META[lang].description,
      type: 'website',
      alternates: [
        { hreflang: 'fi', path: '/' },
        { hreflang: 'en', path: '/en' },
        { hreflang: 'x-default', path: '/' },
      ],
      // Person + WebSite tulevat jokaiselle sivulle SiteDocumentista.
      jsonLd: [],
      priority: 1,
    })

    routes.push({
      path: blogListPath(lang),
      lang,
      title: BLOG_META[lang].title,
      description: BLOG_META[lang].description,
      type: 'website',
      alternates: [
        { hreflang: 'fi', path: blogListPath('fi') },
        { hreflang: 'en', path: blogListPath('en') },
        { hreflang: 'x-default', path: blogListPath('fi') },
      ],
      jsonLd: [],
      priority: 0.8,
      lastmod: posts.find((p) => p.lang === lang)?.date,
    })

    for (const study of getCases(lang)) {
      routes.push({
        path: casePath(lang, study.slug),
        lang,
        title: study.metaTitle,
        description: study.metaDescription,
        image: study.gallery[0]?.src,
        type: 'website',
        alternates: [
          { hreflang: 'fi', path: casePath('fi', study.slug) },
          { hreflang: 'en', path: casePath('en', study.slug) },
          { hreflang: 'x-default', path: casePath('fi', study.slug) },
        ],
        jsonLd: caseJsonLd(study, casePath(lang, study.slug), lang),
        priority: 0.8,
      })
    }
  }

  for (const page of getServicePages()) routes.push(serviceRoute(page))

  for (const post of posts) {
    const path = blogPostPath(post.lang, post.slug)
    const translated = posts.filter((p) => p.slug === post.slug)
    const alternates: Route['alternates'] = translated.map((p) => ({
      hreflang: p.lang,
      path: blogPostPath(p.lang, p.slug),
    }))
    const fi = translated.find((p) => p.lang === 'fi')
    alternates.push({ hreflang: 'x-default', path: blogPostPath(fi ? 'fi' : post.lang, post.slug) })

    routes.push({
      path,
      lang: post.lang,
      title: post.metaTitle ?? pageTitle(post.title),
      description: postDescription(post),
      image: post.cover,
      type: 'article',
      publishedTime: post.date,
      alternates,
      jsonLd: postJsonLd(post, path),
      priority: 0.7,
      lastmod: postModified(post),
    })
  }

  routes.push(...noindexRoutes())

  return routes
}


/**
 * Case-sivun JSON-LD: vain sivulla näkyvää tietoa. CreativeWork on itse
 * case-kuvaus; `about` kertoo, mistä tuotteesta se kertoo.
 */
function caseJsonLd(study: CaseStudy, path: string, lang: Lang): Record<string, unknown>[] {
  const url = absoluteUrl(path)
  const productUrl = study.links.find((l) => /^https?:\/\//.test(l.href))?.href
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'CreativeWork',
      '@id': `${url}#case`,
      name: study.title,
      headline: `${study.title} – ${study.tagline}`,
      description: study.summary,
      url,
      inLanguage: lang,
      image: study.gallery[0] ? absoluteUrl(study.gallery[0].src) : undefined,
      creator: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      isPartOf: { '@id': WEBSITE_ID },
      about: {
        '@type': 'SoftwareApplication',
        name: study.title,
        description: study.tagline,
        ...(productUrl ? { url: productUrl } : {}),
        creator: { '@id': PERSON_ID },
      },
    },
  ]
}

/** Palvelu-, opas- ja tietoa-sivut molemmilla kielillä (lib/servicePages.ts). */
function serviceRoute(page: ServicePage): Route {
  const path = servicePath(page.slug)
  const url = absoluteUrl(path)
  const base = { url, name: page.h1, description: page.metaDescription, inLanguage: page.lang, isPartOf: { '@id': WEBSITE_ID } }
  const main: Record<string, unknown> =
    page.kind === 'about'
      ? { '@context': 'https://schema.org', '@type': 'ProfilePage', '@id': `${url}#webpage`, ...base, mainEntity: { '@id': PERSON_ID } }
      : page.kind === 'service'
        ? {
            '@context': 'https://schema.org',
            '@type': 'Service',
            '@id': `${url}#service`,
            ...base,
            name: page.serviceType ?? page.h1,
            serviceType: page.serviceType,
            provider: { '@id': PERSON_ID },
          }
        : {
            '@context': 'https://schema.org',
            '@type': 'Article',
            '@id': `${url}#article`,
            ...base,
            headline: page.h1,
            mainEntityOfPage: { '@type': 'WebPage', '@id': url },
            author: { '@id': PERSON_ID },
            publisher: { '@id': PERSON_ID },
          }
  const faq = faqJsonLd(publishedFaq(page))
  const fi = servicePair(page, 'fi')
  const en = servicePair(page, 'en')
  return {
    path,
    lang: page.lang,
    title: page.metaTitle,
    description: page.metaDescription,
    type: 'website',
    alternates: [
      ...(fi ? [{ hreflang: 'fi', path: servicePath(fi.slug) }] : []),
      ...(en ? [{ hreflang: 'en', path: servicePath(en.slug) }] : []),
      { hreflang: 'x-default', path: servicePath((fi ?? page).slug) },
    ],
    jsonLd: faq ? [main, faq] : [main],
    priority: page.key === 'about' ? 0.6 : 0.9,
  }
}

/** SEO-kuvaus → kuvaus → ensimmäinen kappale, aina enintään 160 merkkiä. */
function postDescription(post: Post): string | undefined {
  const text = post.metaDescription ?? post.description ?? firstParagraph(post.content)
  return text ? clampText(text) : undefined
}

export function findRoute(routes: Route[], path: string): Route | undefined {
  return routes.find((r) => r.path === path)
}

/** Route → Next.js Metadata (title, description, canonical, hreflang, OG, Twitter). */
export function routeMetadata(route: Route): Metadata {
  if (route.noindex) {
    // Ei kanonisia, hreflang- eikä jakotageja sivulle jota ei haluta indeksiin.
    return { title: route.title, robots: { index: false, follow: false } }
  }
  const image = absoluteUrl(route.image ?? DEFAULT_OG_IMAGE)
  const url = absoluteUrl(route.path)
  return {
    title: route.title,
    description: route.description,
    alternates: {
      canonical: url,
      languages: Object.fromEntries(route.alternates.map((a) => [a.hreflang, absoluteUrl(a.path)])),
    },
    openGraph: {
      type: route.type,
      siteName: SITE_NAME,
      locale: ogLocale(route.lang),
      title: route.title,
      description: route.description,
      url,
      images: [image],
      ...(route.type === 'article' && route.publishedTime ? { publishedTime: route.publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title: route.title,
      description: route.description,
      images: [image],
    },
  }
}

export function sitemapEntries(routes: Route[]): MetadataRoute.Sitemap {
  return routes
    .filter((r) => !r.noindex)
    .map((r) => ({
      url: absoluteUrl(r.path),
      lastModified: r.lastmod,
      priority: r.priority,
      alternates: {
        languages: Object.fromEntries(r.alternates.map((a) => [a.hreflang, absoluteUrl(a.path)])),
      },
    }))
}

