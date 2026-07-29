import { describe, it, expect } from 'vitest'
import { getCases, getCaseStudy } from './cases'

const SLUGS = ['rascal-ai', 'rascal-crm', 'rascal-pages', 'altio', 'pesa', 'perhe-app']

describe('case data integrity', () => {
  it('exposes all six cases in order, both languages', () => {
    for (const lang of ['fi', 'en'] as const) {
      expect(getCases(lang).map((c) => c.slug)).toEqual(SLUGS)
    }
  })

  it('every case has complete copy in both languages', () => {
    for (const lang of ['fi', 'en'] as const) {
      for (const c of getCases(lang)) {
        expect(c.title.length, c.slug).toBeGreaterThan(0)
        expect(c.tagline.length, c.slug).toBeGreaterThan(0)
        expect(c.problem.length, c.slug).toBeGreaterThan(50)
        expect(c.approach.length, c.slug).toBeGreaterThanOrEqual(3)
        expect(c.outcomes.length, c.slug).toBe(3)
        expect(c.highlights.length, c.slug).toBeGreaterThanOrEqual(4)
      }
    }
  })

  it('resolves the legacy superhuman alias to altio', () => {
    expect(getCaseStudy('superhuman', 'fi')?.slug).toBe('altio')
  })

  it('banned claims are gone', () => {
    const all = JSON.stringify([getCases('fi'), getCases('en')])
    expect(all).not.toMatch(/HealthKit/) // Altio: not integrated yet
    expect(all).not.toMatch(/[Ll]ocal-first/) // Pesä: now cloud-backed (Neon)
  })

  it('first three cases are featured, rest not', () => {
    expect(getCases('fi').map((c) => c.featured)).toEqual([true, true, true, false, false, false])
  })
})
