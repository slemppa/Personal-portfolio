// Build-time sitemap generator. Reads the published blog posts and case studies
// from source so the sitemap never goes stale, and writes public/sitemap.xml
// (which Vite then copies into the build output). Run automatically before the
// production build — see the "build" script in package.json.

import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'
import yaml from 'js-yaml'

const SITE_URL = 'https://samikiias.fi'
const BLOG_DIR = join(process.cwd(), 'src/content/blog')
const CASES_FILE = join(process.cwd(), 'src/lib/cases.ts')
const OUT_FILE = join(process.cwd(), 'public/sitemap.xml')

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/

const today = new Date().toISOString().slice(0, 10)

function normalizeDate(value) {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string' && value.length >= 10) return value.slice(0, 10)
  return today
}

// Published (non-draft) blog posts with their last-modified date.
function blogEntries() {
  return readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith('.md'))
    .map((file) => {
      const raw = readFileSync(join(BLOG_DIR, file), 'utf8')
      const match = raw.match(FRONTMATTER_RE)
      if (!match) return null
      let data
      try {
        data = yaml.load(match[1]) ?? {}
      } catch {
        return null // unparseable frontmatter -> treat as draft, skip
      }
      if (data.draft === true || !data.title || !data.date) return null
      return { path: `/blog/${file.replace(/\.md$/, '')}`, lastmod: normalizeDate(data.date) }
    })
    .filter(Boolean)
}

// Case-study slugs, read straight from the single source of truth.
function caseEntries() {
  const src = readFileSync(CASES_FILE, 'utf8')
  const slugs = [...src.matchAll(/slug:\s*'([^']+)'/g)].map((m) => m[1])
  return [...new Set(slugs)].map((slug) => ({ path: `/projektit/${slug}`, lastmod: today }))
}

const staticEntries = [
  { path: '/', lastmod: today, priority: '1.0' },
  { path: '/blog', lastmod: today, priority: '0.7' },
]

const urls = [...staticEntries, ...blogEntries(), ...caseEntries()]

const body = urls
  .map(({ path, lastmod, priority }) => {
    const loc = `${SITE_URL}${path}`
    return [
      '  <url>',
      `    <loc>${loc}</loc>`,
      `    <lastmod>${lastmod}</lastmod>`,
      priority ? `    <priority>${priority}</priority>` : null,
      '  </url>',
    ]
      .filter(Boolean)
      .join('\n')
  })
  .join('\n')

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`

writeFileSync(OUT_FILE, xml)
console.log(`[sitemap] wrote ${urls.length} urls -> public/sitemap.xml`)
