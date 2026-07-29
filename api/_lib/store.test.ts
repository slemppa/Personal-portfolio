import { describe, it, expect } from 'vitest'
import { shortId } from './db.js'
import { parseLead } from './leads.js'

describe('shortId', () => {
  it('returns a url-safe id of the requested length', () => {
    const id = shortId()
    expect(id).toHaveLength(8)
    expect(id).toMatch(/^[A-Za-z0-9]+$/)
    expect(shortId(12)).toHaveLength(12)
  })

  it('is practically unique across many draws', () => {
    const seen = new Set<string>()
    for (let i = 0; i < 1000; i++) seen.add(shortId())
    expect(seen.size).toBe(1000)
  })
})

describe('parseLead', () => {
  it('accepts and trims a valid submission', () => {
    const r = parseLead({ name: '  Matti ', email: 'matti@yritys.fi', message: ' Moi ', company: ' Yritys ' })
    expect(r.ok).toBe(true)
    if (r.ok) {
      expect(r.lead).toEqual({
        name: 'Matti',
        email: 'matti@yritys.fi',
        message: 'Moi',
        company: 'Yritys',
        source: undefined,
        marketingConsent: false,
      })
    }
  })

  it('rejects a missing name', () => {
    const r = parseLead({ name: '', email: 'a@b.fi', message: 'hi' })
    expect(r).toEqual({ ok: false, error: 'invalid_name' })
  })

  it('rejects a bad email', () => {
    expect(parseLead({ name: 'A', email: 'nope', message: 'hi' })).toEqual({ ok: false, error: 'invalid_email' })
  })

  it('rejects an empty message', () => {
    expect(parseLead({ name: 'A', email: 'a@b.fi', message: '   ' })).toEqual({ ok: false, error: 'invalid_message' })
  })

  it('tolerates junk input', () => {
    expect(parseLead(null).ok).toBe(false)
    expect(parseLead('nope').ok).toBe(false)
  })
})
