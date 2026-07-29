import { describe, it, expect } from 'vitest'
import { parseLead } from './leads.js'

const base = { name: 'Testi', email: 'a@b.fi', message: 'Moi' }

describe('parseLead consent', () => {
  it('defaults marketingConsent to false', () => {
    const r = parseLead(base)
    expect(r.ok && r.lead.marketingConsent).toBe(false)
  })
  it.each([true, 'true', 'on'])('accepts %s as consent', (v) => {
    const r = parseLead({ ...base, marketingConsent: v })
    expect(r.ok && r.lead.marketingConsent).toBe(true)
  })
  it('rejects garbage without failing the lead', () => {
    const r = parseLead({ ...base, marketingConsent: 'banana' })
    expect(r.ok && r.lead.marketingConsent).toBe(false)
  })
  it('newsletter source with consent needs no long message', () => {
    const r = parseLead({ name: 'Tilaaja', email: 'a@b.fi', message: '(newsletter)', source: 'newsletter:blog', marketingConsent: true })
    expect(r.ok).toBe(true)
  })
})
