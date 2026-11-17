import { describe, it, expect } from 'vitest'
import { collectRoutes } from './routes'
import { siteGraph } from './seo'
import { getServicePages } from './servicePages'
import type { Post } from './parsePost'

const post = (slug: string, lang: 'fi' | 'en'): Post => ({
  slug, lang, title: slug, date: '2026-08-05', tags: [], draft: false, content: '## Usein kysytyt kysymykset\n\n### Q?\n\nA.',
})
const routes = collectRoutes([post('a', 'fi'), post('a', 'en')]).filter((r) => !r.noindex)

/** Every @id defined and every { '@id' } reference in a JSON-LD tree. */
function ids(node: unknown, defined: Set<string>, refs: Set<string>) {
  if (Array.isArray(node)) return node.forEach((n) => ids(n, defined, refs))
  if (!node || typeof node !== 'object') return
  const obj = node as Record<string, unknown>
  if (typeof obj['@id'] === 'string') (Object.keys(obj).length === 1 ? refs : defined).add(obj['@id'])
  Object.values(obj).forEach((v) => ids(v, defined, refs))
}

describe('JSON-LD jokaisella julkisella sivulla', () => {
  it('parsii JSONina ja jokainen @id-viittaus osuu samalla sivulla olevaan solmuun', () => {
    for (const r of routes) {
      const blocks = [siteGraph(r.lang), ...r.jsonLd].map((b) => JSON.parse(JSON.stringify(b)))
      const defined = new Set<string>()
      const refs = new Set<string>()
      // A WebPage `mainEntityOfPage` carries @type too, so it counts as defined.
      ids(blocks, defined, refs)
      for (const ref of refs) expect(defined.has(ref), `${r.path}: ${ref}`).toBe(true)
    }
  })
})

describe('palvelusivut', () => {
  const paths = new Set(routes.map((r) => r.path))

  it('sisäiset linkit osuvat olemassa oleviin sivuihin', () => {
    for (const page of getServicePages()) {
      const md = [page.lead, ...page.sections.map((s) => s.body), ...page.faq.map((f) => f.answer)].join('\n')
      for (const [, href] of md.matchAll(/\]\((\/[^)#\s]*)\)/g)) {
        expect(paths.has(href), `${page.slug} → ${href}`).toBe(true)
      }
    }
  })

  it('jokaisella on yksi H1, H2-kysymykset ja UKK vain kun sille on sisältöä', () => {
    for (const page of getServicePages()) {
      expect(page.h1.length, page.slug).toBeGreaterThan(10)
      for (const s of page.sections) expect(s.heading.endsWith('?'), `${page.slug}: ${s.heading}`).toBe(true)
      expect(page.metaTitle.length, page.slug).toBeLessThanOrEqual(60)
    }
  })
})
