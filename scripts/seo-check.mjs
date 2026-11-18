#!/usr/bin/env node
// Crawls a running site and checks the rendered HTML for SEO regressions.
//
//   pnpm build && pnpm start          # or pnpm dev
//   node scripts/seo-check.mjs http://localhost:3000
//
// Protected Vercel preview: pass the auth cookie from a share link, e.g.
//   SEO_CHECK_COOKIE="_vercel_jwt=…" node scripts/seo-check.mjs https://<preview>.vercel.app
//
// For every URL in sitemap.xml plus every internal link found on those pages:
//   - status is 200 (links: not 404)
//   - exactly one <h1>
//   - canonical points to the page itself (production host)
//   - every JSON-LD block parses, and every { "@id" } reference resolves to a
//     node defined on the same page
// Exits non-zero on any failure.

const BASE = (process.argv[2] ?? 'http://localhost:3000').replace(/\/$/, '')
const PROD = 'https://www.samikiias.fi'
const errors = []
const fail = (msg) => errors.push(msg)

const toLocal = (url) => url.replace(PROD, BASE)
const toPath = (url) => new URL(url, BASE).pathname

async function get(path) {
  const headers = process.env.SEO_CHECK_COOKIE ? { cookie: process.env.SEO_CHECK_COOKIE } : {}
  const res = await fetch(BASE + path, { redirect: 'manual', headers })
  return { status: res.status, body: res.status === 200 ? await res.text() : '' }
}

function walkIds(node, defined, refs) {
  if (Array.isArray(node)) return node.forEach((n) => walkIds(n, defined, refs))
  if (!node || typeof node !== 'object') return
  if (typeof node['@id'] === 'string') (Object.keys(node).length === 1 ? refs : defined).add(node['@id'])
  Object.values(node).forEach((v) => walkIds(v, defined, refs))
}

function checkPage(path, html) {
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0
  if (h1s !== 1) fail(`${path}: ${h1s} x <h1>`)

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1]
  const expected = PROD + (path === '/' ? '/' : path)
  if (canonical !== expected && !(path === '/' && canonical === PROD)) fail(`${path}: canonical ${canonical} ≠ ${expected}`)

  const defined = new Set()
  const refs = new Set()
  let blocks = 0
  for (const [, json] of html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)) {
    try {
      walkIds(JSON.parse(json), defined, refs)
      blocks++
    } catch (e) {
      fail(`${path}: JSON-LD does not parse (${e.message})`)
    }
  }
  if (blocks === 0) fail(`${path}: no JSON-LD`)
  for (const ref of refs) if (!defined.has(ref)) fail(`${path}: @id ${ref} not defined on page`)

  return [...html.matchAll(/href="(\/[^"#?]*)/g)].map((m) => m[1]).filter((h) => !h.startsWith('/_next') && !h.startsWith('/api/'))
}

const sitemap = await get('/sitemap.xml')
if (sitemap.status !== 200) {
  console.error(`sitemap.xml: ${sitemap.status}`)
  process.exit(1)
}
const pages = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => toPath(toLocal(m[1])))
const links = new Set()
const linkedFrom = new Map()

for (const path of pages) {
  const { status, body } = await get(path)
  if (status !== 200) {
    fail(`${path}: sitemap URL returns ${status}`)
    continue
  }
  for (const href of checkPage(path, body)) {
    links.add(href)
    if (!linkedFrom.has(href)) linkedFrom.set(href, new Set())
    linkedFrom.get(href).add(path)
  }
}

for (const href of links) {
  if (pages.includes(href)) continue
  const { status } = await get(href)
  if (status === 404 || status >= 500) fail(`link ${href}: ${status} (linked from ${[...linkedFrom.get(href)].join(', ')})`)
}

console.log(`Checked ${pages.length} sitemap pages and ${links.size} internal links on ${BASE}`)
if (errors.length) {
  console.error(errors.map((e) => `✗ ${e}`).join('\n'))
  process.exit(1)
}
console.log('✓ all checks passed')
