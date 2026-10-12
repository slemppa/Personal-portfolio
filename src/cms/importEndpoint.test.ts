import { describe, it, expect } from 'vitest'
import { parseImportBody } from './importEndpoint'

describe('parseImportBody', () => {
  it('maps the n8n payload and defaults to a draft', () => {
    const r = parseImportBody({
      slug: 'pesä-koti', lang: 'en', title: ' Home ', date: '2026-10-12',
      description: 'D', tags: ['a', ''], markdown: '## Hi\n\nText',
    })
    expect(r).toEqual({
      ok: true,
      post: {
        slug: 'pesa-koti', lang: 'en', title: 'Home', date: '2026-10-12',
        description: 'D', tags: ['a'], draft: true, content: '## Hi\n\nText',
      },
    })
  })

  it('derives slug from title, defaults lang to fi and date to today', () => {
    const r = parseImportBody({ title: 'Ääkköset ja Öljy', markdown: 'x' })
    expect(r.ok && r.post.slug).toBe('aakkoset-ja-oljy')
    expect(r.ok && r.post.lang).toBe('fi')
    expect(r.ok && r.post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/)
  })

  it('publishes only when draft is explicitly false', () => {
    const r = parseImportBody({ title: 'T', markdown: 'x', draft: false })
    expect(r.ok && r.post.draft).toBe(false)
  })

  it('rejects missing title/markdown and bad lang', () => {
    expect(parseImportBody({ markdown: 'x' })).toEqual({ ok: false, error: 'title is required' })
    expect(parseImportBody({ title: 'T' })).toEqual({ ok: false, error: 'markdown is required' })
    expect(parseImportBody({ title: 'T', markdown: 'x', lang: 'sv' }).ok).toBe(false)
    expect(parseImportBody(null).ok).toBe(false)
  })
})
