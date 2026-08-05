// Build-ajan SEO: sivusto on client-rendattu SPA, joten <head> syntyy vasta
// JS:n ajettua. Google renderöi JS:n, mutta LinkedIn, Slack, WhatsApp ja X
// eivät — ilman tätä jokainen jaettu linkki näyttää saman etusivun otsikon.
//
// Ratkaisu: build kirjoittaa jokaiselle reitille oman index.html:n, jossa
// title, description, canonical, hreflang, OG/Twitter ja JSON-LD ovat valmiina
// staattisessa HTML:ssä. Vercel tarjoilee tiedostojärjestelmän ennen
// rewritea, joten /blog/slug osuu dist/blog/slug/index.html:ään; SPA hydratoi
// päälle normaalisti ja applyHead korvaa data-managed-tagit navigoinnissa.
import { readdirSync, readFileSync, mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import type { Plugin } from 'vite'
import { parsePost, selectPosts, type Lang, type Post } from '../src/lib/parsePost'
import { getCases } from '../src/lib/cases'
import { blogListPath, blogPostPath, casePath, homePath } from '../src/lib/i18n'
import { homeCopy } from '../src/site/copy'
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL, absoluteUrl, ogLocale, postJsonLd } from '../src/lib/seo'

const BLOG_DIR = 'src/content/blog'
const LANGS: Lang[] = ['fi', 'en']

type Route = {
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
  priority: string
  lastmod?: string
}

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function loadPosts(root: string): Post[] {
  const dir = join(root, BLOG_DIR)
  const parsed = readdirSync(dir)
    .filter((f) => f.endsWith('.md'))
    .map((f) => parsePost(readFileSync(join(dir, f), 'utf8'), f))
    .filter((p): p is Post => p !== null)
  // Prerender only what production actually serves — drafts stay dev-only.
  return selectPosts(parsed, false)
}

export function collectRoutes(root: string): Route[] {
  const posts = loadPosts(root)
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
      priority: '1.0',
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
      priority: '0.8',
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
        priority: '0.8',
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
      priority: '0.7',
      lastmod: post.date,
    })
  }

  return routes
}

export function headTags(route: Route): string {
  const image = absoluteUrl(route.image ?? DEFAULT_OG_IMAGE)
  const tags: string[] = [
    `<link rel="canonical" href="${escapeAttr(absoluteUrl(route.path))}" data-managed />`,
    ...route.alternates.map(
      (a) => `<link rel="alternate" hreflang="${a.hreflang}" href="${escapeAttr(absoluteUrl(a.path))}" data-managed />`,
    ),
    `<meta property="og:type" content="${route.type}" data-managed />`,
    `<meta property="og:site_name" content="${escapeAttr(SITE_NAME)}" data-managed />`,
    `<meta property="og:locale" content="${ogLocale(route.lang)}" data-managed />`,
    `<meta property="og:title" content="${escapeAttr(route.title)}" data-managed />`,
    `<meta property="og:url" content="${escapeAttr(absoluteUrl(route.path))}" data-managed />`,
    `<meta property="og:image" content="${escapeAttr(image)}" data-managed />`,
    `<meta name="twitter:card" content="summary_large_image" data-managed />`,
    `<meta name="twitter:title" content="${escapeAttr(route.title)}" data-managed />`,
    `<meta name="twitter:image" content="${escapeAttr(image)}" data-managed />`,
  ]
  if (route.description) {
    tags.push(`<meta property="og:description" content="${escapeAttr(route.description)}" data-managed />`)
    tags.push(`<meta name="twitter:description" content="${escapeAttr(route.description)}" data-managed />`)
  }
  if (route.type === 'article' && route.publishedTime) {
    tags.push(`<meta property="article:published_time" content="${route.publishedTime}" data-managed />`)
  }
  for (const block of route.jsonLd) {
    // `<` escaped so a stray "</script>" in content can never close the tag.
    tags.push(
      `<script type="application/ld+json" data-managed>${JSON.stringify(block).replace(/</g, '\\u003c')}</script>`,
    )
  }
  return tags.join('\n    ')
}

export function renderRouteHtml(template: string, route: Route): string {
  return template
    .replace(/<html lang="[^"]*"/, `<html lang="${route.lang}"`)
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${escapeAttr(route.title)}</title>`)
    .replace(
      /<meta name="description" content="[^"]*" \/>/,
      `<meta name="description" content="${escapeAttr(route.description ?? '')}" data-managed />`,
    )
    .replace('</head>', `  ${headTags(route)}\n  </head>`)
}

export function renderSitemap(routes: Route[]): string {
  const urls = routes
    .map((r) => {
      const alts = r.alternates
        .map((a) => `    <xhtml:link rel="alternate" hreflang="${a.hreflang}" href="${absoluteUrl(a.path)}" />`)
        .join('\n')
      return [
        '  <url>',
        `    <loc>${absoluteUrl(r.path)}</loc>`,
        r.lastmod ? `    <lastmod>${r.lastmod}</lastmod>` : '',
        `    <priority>${r.priority}</priority>`,
        alts,
        '  </url>',
      ]
        .filter(Boolean)
        .join('\n')
    })
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`
}

export function renderRobots(): string {
  return `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`
}

/** Kirjoittaa per-reitti-HTML:t, sitemapin ja robots.txt:n buildin jälkeen. */
export function seoBuild(): Plugin {
  return {
    name: 'seo-build',
    apply: 'build',
    closeBundle() {
      const root = process.cwd()
      const outDir = join(root, 'dist')
      const template = readFileSync(join(outDir, 'index.html'), 'utf8')
      const routes = collectRoutes(root)

      for (const route of routes) {
        const html = renderRouteHtml(template, route)
        const file = route.path === '/' ? join(outDir, 'index.html') : join(outDir, route.path, 'index.html')
        mkdirSync(dirname(file), { recursive: true })
        writeFileSync(file, html)
      }
      writeFileSync(join(outDir, 'sitemap.xml'), renderSitemap(routes))
      writeFileSync(join(outDir, 'robots.txt'), renderRobots())
      console.log(`[seo] prerendered ${routes.length} routes + sitemap.xml + robots.txt`)
    },
  }
}
