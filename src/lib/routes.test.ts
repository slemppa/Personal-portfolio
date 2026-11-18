import { describe, it, expect } from 'vitest'
import { collectRoutes, findRoute, routeMetadata, sitemapEntries } from './routes'
import type { Post } from './parsePost'
import robots from '../app/robots'
import { getServicePages } from './servicePages'

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

describe('otsikot ja kuvaukset', () => {
  const all = collectRoutes([
    post('long', 'fi', { title: 'x'.repeat(55), description: 'kuvaus '.repeat(40) }),
    post('seo', 'fi', { title: 'Otsikko', metaTitle: 'Oma SEO-otsikko hakutulokseen', metaDescription: 'Oma kuvaus' }),
    post('none', 'fi', { content: '## Väliotsikko\n\nEnsimmäinen kappale kertoo aiheesta.' }),
  ]).filter((r) => !r.noindex)

  it('ovat yksilöllisiä kaikilla julkisilla sivuilla', () => {
    const titles = all.map((r) => r.title)
    expect(new Set(titles).size).toBe(titles.length)
  })

  it('pysyvät 60 / 160 merkissä', () => {
    for (const r of all) {
      expect(r.title.length, r.path).toBeLessThanOrEqual(60)
      expect(r.description?.length ?? 0, r.path).toBeLessThanOrEqual(160)
    }
  })

  it('casejen ja listojen kuvaukset ovat vähintään 70 merkkiä', () => {
    for (const r of all.filter((r) => r.type === 'website')) expect(r.description!.length, r.path).toBeGreaterThanOrEqual(70)
  })

  it('käyttävät SEO-kenttiä ja ensimmäistä kappaletta varalla', () => {
    expect(findRoute(all, '/blog/seo')).toMatchObject({ title: 'Oma SEO-otsikko hakutulokseen', description: 'Oma kuvaus' })
    expect(findRoute(all, '/blog/none')?.description).toBe('Ensimmäinen kappale kertoo aiheesta.')
  })
})

describe('entiteetti ja uudet sivut', () => {
  const NEW = [
    '/tietoa', '/mvp-kehitys', '/n8n-automaatiot', '/ohjelmistokehityksen-hinta',
    '/en/about', '/en/mvp-development', '/en/n8n-automation', '/en/software-development-cost',
  ]

  it('uudet sivut ovat sitemapissa ja canonical osoittaa itseensä', () => {
    for (const path of NEW) {
      expect(urls, path).toContain(`https://www.samikiias.fi${path}`)
      expect(routeMetadata(findRoute(routes, path)!).alternates?.canonical).toBe(`https://www.samikiias.fi${path}`)
    }
  })

  it('palvelusivut on paritettu fi ↔ en, x-default → fi', () => {
    const expected = {
      fi: 'https://www.samikiias.fi/mvp-kehitys',
      en: 'https://www.samikiias.fi/en/mvp-development',
      'x-default': 'https://www.samikiias.fi/mvp-kehitys',
    }
    expect(routeMetadata(findRoute(routes, '/mvp-kehitys')!).alternates?.languages).toEqual(expected)
    expect(routeMetadata(findRoute(routes, '/en/mvp-development')!).alternates?.languages).toEqual(expected)
  })

  it('/tietoa on ProfilePage, jonka mainEntity on #person', () => {
    const [page] = findRoute(routes, '/tietoa')!.jsonLd
    expect(page).toMatchObject({ '@type': 'ProfilePage', mainEntity: { '@id': 'https://www.samikiias.fi/#person' } })
  })

  it('case-sivun JSON-LD viittaa tekijään @id:llä', () => {
    const [cw] = findRoute(routes, '/projektit/rascal-ai')!.jsonLd
    expect(cw).toMatchObject({ '@type': 'CreativeWork', creator: { '@id': 'https://www.samikiias.fi/#person' } })
  })

  it('sivuilla ei ole jäljellä TODO-kohtia', () => {
    expect(JSON.stringify(getServicePages())).not.toContain('TODO')
  })

  it('FAQPage sisältää vain valmiit vastaukset, ei TODO-kohtia', () => {
    for (const path of NEW) {
      expect(JSON.stringify(findRoute(routes, path)!.jsonLd), path).not.toContain('TODO')
    }
  })

  it('blogipostauksen lastmod on päivityspäivä', () => {
    const r = collectRoutes([post('u', 'fi', { updated: '2026-09-01' })])
    expect(findRoute(r, '/blog/u')?.lastmod).toBe('2026-09-01')
  })
})
