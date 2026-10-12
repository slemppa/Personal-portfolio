import { describe, it, expect } from 'vitest'
import { collectRoutes, findRoute, routeMetadata, sitemapEntries } from './routes'
import type { Post } from './parsePost'
import robots from '../app/robots'

const post = (slug: string, lang: 'fi' | 'en', extra: Partial<Post> = {}): Post => ({
  slug, lang, title: slug, date: '2026-08-05', tags: [], draft: false, content: '', ...extra,
})

const routes = collectRoutes([post('a', 'fi'), post('a', 'en'), post('only-fi', 'fi'), post('hidden', 'fi', { draft: true })])
const sensitive = ['/hallinta', '/tarjous', '/offer']
const urls = sitemapEntries(routes).map((e) => e.url)

describe('noindex-reitit', () => {
  it('ovat mukana ja merkitty noindexiksi', () => {
    for (const path of sensitive) expect(findRoute(routes, path)?.noindex, path).toBe(true)
  })

  it('jäävät pois sitemapista', () => {
    for (const path of sensitive) expect(urls).not.toContain(`https://www.samikiias.fi${path}`)
  })

  it('saavat robots-direktiivin eikä canonical- tai jakotageja', () => {
    const meta = routeMetadata(findRoute(routes, '/hallinta')!)
    expect(meta.robots).toEqual({ index: false, follow: false })
    expect(meta.alternates).toBeUndefined()
    expect(meta.openGraph).toBeUndefined()
  })
})

describe('julkiset reitit', () => {
  it('ovat sitemapissa', () => {
    expect(urls).toContain('https://www.samikiias.fi/')
    expect(urls).toContain('https://www.samikiias.fi/blog')
    expect(urls).toContain('https://www.samikiias.fi/en')
    expect(urls).toContain('https://www.samikiias.fi/blog/a')
  })

  it('säilyttävät canonicalin, hreflangit ja OG-tagit', () => {
    const meta = routeMetadata(findRoute(routes, '/blog/a')!)
    expect(meta.alternates?.canonical).toBe('https://www.samikiias.fi/blog/a')
    expect(meta.alternates?.languages).toEqual({
      fi: 'https://www.samikiias.fi/blog/a',
      en: 'https://www.samikiias.fi/en/blog/a',
      'x-default': 'https://www.samikiias.fi/blog/a',
    })
    expect(meta.openGraph).toMatchObject({ type: 'article', locale: 'fi_FI', publishedTime: '2026-08-05' })
    expect(meta.robots).toBeUndefined()
  })

  it('antaa kääntämättömälle postaukselle vain oman kielensä', () => {
    const meta = routeMetadata(findRoute(routes, '/blog/only-fi')!)
    expect(Object.keys(meta.alternates?.languages ?? {})).toEqual(['fi', 'x-default'])
  })

  it('jättää luonnokset pois', () => {
    expect(findRoute(routes, '/blog/hidden')).toBeUndefined()
  })
})

describe('robots', () => {
  it('sallii crawlin, osoittaa sitemapiin eikä disallowaa noindex-polkuja', () => {
    const r = robots()
    expect(r.rules).toEqual({ userAgent: '*', allow: '/' })
    expect(r.sitemap).toBe('https://www.samikiias.fi/sitemap.xml')
  })
})
