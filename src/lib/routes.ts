// SEO-reitit: yksi lähde sekä sivujen metadatalle (generateMetadata) että
// sitemapille. Puhtaita funktioita, jotta molemmat tuottavat saman tuloksen.
import type { Metadata, MetadataRoute } from 'next'
import { selectPosts, type Lang, type Post } from './parsePost'
import { getCases } from './cases'
import { blogListPath, blogPostPath, casePath, homePath } from './i18n'
import { homeCopy } from '../site/copy'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, ogLocale, postJsonLd } from './seo'

const LANGS: Lang[] = ['fi', 'en']

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
      title: lang === 'fi' ? 'Sami Kiias — Fullstack-tuoterakentaja' : 'Sami Kiias — Fullstack product builder',
      description: homeCopy[lang].heroBody,
      type: 'website',
      alternates: [
        { hreflang: 'fi', path: '/' },
        { hreflang: 'en', path: '/en' },
        { hreflang: 'x-default', path: '/' },
      ],
      jsonLd: [
        {
          '@context': 'https://schema.org',
          '@type': 'Person',
          name: SITE_NAME,
          url: SITE_URL,
          jobTitle: lang === 'fi' ? 'Fullstack-tuoterakentaja' : 'Fullstack product builder',
        },
      ],
      priority: 1,
    })

    routes.push({
      path: blogListPath(lang),
      lang,
      title: lang === 'fi' ? 'Blogi · Sami Kiias' : 'Blog · Sami Kiias',
      description: lang === 'fi' ? 'Ajatuksia ja muistiinpanoja.' : 'Thoughts and notes.',
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
        title: `${study.title} — Sami Kiias`,
        description: study.summary,
        image: study.gallery[0]?.src,
        type: 'website',
        alternates: [
          { hreflang: 'fi', path: casePath('fi', study.slug) },
          { hreflang: 'en', path: casePath('en', study.slug) },
          { hreflang: 'x-default', path: casePath('fi', study.slug) },
        ],
        jsonLd: [],
        priority: 0.8,
      })
    }
  }

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
      title: `${post.title} · Sami Kiias`,
      description: post.description,
      image: post.cover,
      type: 'article',
      publishedTime: post.date,
      alternates,
      jsonLd: postJsonLd(post, path),
      priority: 0.7,
      lastmod: post.date,
    })
  }

  routes.push(...noindexRoutes())

  return routes
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

