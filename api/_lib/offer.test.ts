import { describe, it, expect } from 'vitest'
import {
  normalizeInput,
  toList,
  buildOffer,
  offerToMarkdown,
  encodeOfferToken,
  decodeOfferToken,
} from './offer.js'

describe('toList', () => {
  it('passes arrays through, trimming and dropping empties', () => {
    expect(toList([' a ', 'b', ''])).toEqual(['a', 'b'])
  })

  it('splits strings on commas, semicolons, newlines and bullets', () => {
    expect(toList('a, b; c\n- d\n• e')).toEqual(['a', 'b', 'c', 'd', 'e'])
  })

  it('returns [] for non-list values', () => {
    expect(toList(undefined)).toEqual([])
    expect(toList(42)).toEqual([])
  })
})

describe('normalizeInput', () => {
  it('maps common CRM field aliases', () => {
    const input = normalizeInput({
      account: 'Acme Oy',
      person: 'Liisa',
      mail: 'liisa@acme.fi',
      sector: 'Retail',
      needs: 'chatbot, automaatio',
      challenges: ['hidas asiakaspalvelu'],
      objectives: 'säästää aikaa',
      budgetRange: '5-10k',
      when: 'Q3',
      details: 'kiireellinen',
    })
    expect(input.company).toBe('Acme Oy')
    expect(input.contactName).toBe('Liisa')
    expect(input.contactEmail).toBe('liisa@acme.fi')
    expect(input.industry).toBe('Retail')
    expect(input.services).toEqual(['chatbot', 'automaatio'])
    expect(input.painPoints).toEqual(['hidas asiakaspalvelu'])
    expect(input.goals).toEqual(['säästää aikaa'])
    expect(input.budget).toBe('5-10k')
    expect(input.timeline).toBe('Q3')
    expect(input.notes).toBe('kiireellinen')
  })

  it('defaults language to fi and currency to €, with a default sender', () => {
    const input = normalizeInput({})
    expect(input.language).toBe('fi')
    expect(input.currency).toBe('€')
    expect(input.sender.name).toBe('Sami Kiias')
  })

  it('detects English and honours a custom sender', () => {
    const input = normalizeInput({
      language: 'en-US',
      from: { name: 'Alex', title: 'Partner', email: 'a@x.io' },
    })
    expect(input.language).toBe('en')
    expect(input.sender).toEqual({ name: 'Alex', title: 'Partner', email: 'a@x.io', company: 'Sami Kiias' })
  })

  it('tolerates junk input without throwing', () => {
    expect(() => normalizeInput(null)).not.toThrow()
    expect(() => normalizeInput('nope')).not.toThrow()
    expect(normalizeInput(null).services).toEqual([])
  })
})

describe('buildOffer', () => {
  const now = new Date('2026-07-27T00:00:00.000Z')

  it('produces a complete Finnish offer with a 30-day validity', () => {
    const offer = buildOffer(
      normalizeInput({ company: 'Acme Oy', contact: 'Liisa', services: ['chatbot'], challenges: ['hidas tuki'] }),
      now,
    )
    expect(offer.language).toBe('fi')
    expect(offer.title).toBe('Tarjous – Acme Oy')
    expect(offer.greeting).toBe('Hei Liisa,')
    expect(offer.recipient.company).toBe('Acme Oy')
    expect(offer.understanding).toContain('hidas tuki')
    expect(offer.deliverables.length).toBeGreaterThanOrEqual(3)
    expect(offer.investment.items.every((i) => i.price)).toBe(true)
    expect(offer.validUntil).toBe('2026-08-26')
    expect(offer.aiGenerated).toBe(false)
    expect(offer.id).toMatch(/^of_/)
  })

  it('produces an English offer when language is en', () => {
    const offer = buildOffer(normalizeInput({ company: 'Acme', language: 'en' }), now)
    expect(offer.title).toBe('Proposal – Acme')
    expect(offer.greeting).toBe('Hi,')
    expect(offer.timeline).toMatch(/production/)
  })

  it('uses the given timeline when provided', () => {
    const offer = buildOffer(normalizeInput({ timeline: 'Aloitus elokuussa' }), now)
    expect(offer.timeline).toBe('Aloitus elokuussa.')
  })
})

describe('offerToMarkdown', () => {
  it('renders headings, deliverables and the sender signature', () => {
    const offer = buildOffer(normalizeInput({ company: 'Acme Oy', services: ['chatbot'] }))
    const md = offerToMarkdown(offer)
    expect(md).toContain('# Tarjous – Acme Oy')
    expect(md).toContain('## Työn sisältö')
    expect(md).toContain('## Investointi')
    expect(md).toContain('— Sami Kiias')
  })
})

describe('offer token round-trip', () => {
  it('encodes and decodes an offer losslessly', () => {
    const offer = buildOffer(normalizeInput({ company: 'Ääkkös Oy', contact: 'Väinö', services: ['AI'] }))
    const token = encodeOfferToken(offer)
    expect(token).not.toMatch(/[+/=]/) // url-safe
    expect(decodeOfferToken(token)).toEqual(offer)
  })

  it('returns null for malformed tokens', () => {
    expect(decodeOfferToken('not-a-real-token')).toBeNull()
    expect(decodeOfferToken('')).toBeNull()
  })
})
