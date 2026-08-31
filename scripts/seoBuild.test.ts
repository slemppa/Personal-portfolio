import { describe, it, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import { collectRoutes, headTags, renderRobots, renderSitemap, renderRouteHtml } from './seoBuild'

const routes = collectRoutes(process.cwd())
const sensitive = ['/hallinta', '/tarjous', '/offer']

describe('noindex-reitit', () => {
  it('prerenderöi jokaisen arkaluontoisen polun', () => {
    for (const path of sensitive) {
      const route = routes.find((r) => r.path === path)
      expect(route, `puuttuu: ${path}`).toBeDefined()
      expect(route?.noindex).toBe(true)
    }
  })

  it('jättää ne pois sitemapista', () => {
    const xml = renderSitemap(routes)
    for (const path of sensitive) {
      expect(xml).not.toContain(`<loc>https://www.samikiias.fi${path}</loc>`)
    }
  })

  it('pitää julkiset sivut sitemapissa', () => {
    const xml = renderSitemap(routes)
    expect(xml).toContain('<loc>https://www.samikiias.fi/</loc>')
    expect(xml).toContain('<loc>https://www.samikiias.fi/blog</loc>')
    expect(xml).toContain('<loc>https://www.samikiias.fi/en</loc>')
  })

  it('kirjoittaa robots-direktiivin eikä jako- tai canonical-tageja', () => {
    const route = routes.find((r) => r.path === '/hallinta')!
    const tags = headTags(route)
    expect(tags).toContain('<meta name="robots" content="noindex, nofollow" />')
    expect(tags).not.toContain('rel="canonical"')
    expect(tags).not.toContain('og:title')
    expect(tags).not.toContain('application/ld+json')
  })

  it('ei merkitse robots-tagia data-managediksi, jotta SPA ei siivoa sitä', () => {
    const route = routes.find((r) => r.path === '/tarjous')!
    expect(headTags(route)).not.toContain('data-managed')
  })

  it('päätyy prerenderöityyn HTML:ään', () => {
    const template = readFileSync('index.html', 'utf8')
    const html = renderRouteHtml(template, routes.find((r) => r.path === '/offer')!)
    expect(html).toContain('<meta name="robots" content="noindex, nofollow" />')
    expect(html).toContain('<title>Offer · Sami Kiias</title>')
  })
})

describe('julkiset reitit', () => {
  it('säilyttävät canonicalin ja OG-tagit', () => {
    const home = routes.find((r) => r.path === '/')!
    const tags = headTags(home)
    expect(tags).toContain('rel="canonical"')
    expect(tags).toContain('og:title')
    expect(tags).not.toContain('name="robots"')
  })
})

describe('renderRobots', () => {
  it('sallii crawlin ja osoittaa sitemapiin', () => {
    const robots = renderRobots()
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain('Sitemap: https://www.samikiias.fi/sitemap.xml')
  })

  it('ei disallowaa noindex-polkuja — muuten crawler ei näkisi noindexia', () => {
    const robots = renderRobots()
    for (const path of sensitive) {
      expect(robots).not.toContain(`Disallow: ${path}`)
    }
  })
})
