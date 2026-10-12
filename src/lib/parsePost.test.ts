import { describe, it, expect } from 'vitest'
import { postFromCms } from './parsePost'
import { selectPosts } from './parsePost'

const make = (slug: string, date: string, draft = false): import('./parsePost').Post => ({
  slug, lang: 'fi', title: slug, date, tags: [], draft, content: '',
})

const CMS = 'https://cms.example.com'

const DOC = {
  slug: 'tervetuloa',
  lang: 'fi',
  title: 'Tervetuloa',
  date: '2026-06-04T12:00:00.000Z',
  description: 'Kuvaus',
  tags: ['react', 'payload'],
  cover: { id: 1, url: '/api/media/file/x.png' },
  _status: 'published',
  markdown: 'Sisältö **tähän**.\n',
}

describe('postFromCms', () => {
  it('maps all fields of a Payload post', () => {
    const post = postFromCms(DOC, CMS)
    expect(post).toEqual({
      slug: 'tervetuloa',
      lang: 'fi',
      title: 'Tervetuloa',
      date: '2026-06-04',
      description: 'Kuvaus',
      tags: ['react', 'payload'],
      cover: 'https://cms.example.com/api/media/file/x.png',
      draft: false,
      content: 'Sisältö **tähän**.',
    })
  })

  it('reads the language and keeps the shared slug', () => {
    expect(postFromCms({ ...DOC, lang: 'en' }, CMS)!.lang).toBe('en')
    expect(postFromCms({ ...DOC, lang: 'en' }, CMS)!.slug).toBe('tervetuloa')
  })

  it('keeps absolute cover URLs (Vercel Blob) as they are', () => {
    const url = 'https://abc.public.blob.vercel-storage.com/x.png'
    expect(postFromCms({ ...DOC, cover: { url } }, CMS)!.cover).toBe(url)
  })

  it('marks drafts and defaults optional fields', () => {
    const post = postFromCms({ ...DOC, _status: 'draft', tags: null, cover: null, description: null }, CMS)
    expect(post!.draft).toBe(true)
    expect(post!.tags).toEqual([])
    expect(post!.cover).toBeUndefined()
    expect(post!.description).toBeUndefined()
  })

  it('returns null when slug, title or date is missing', () => {
    expect(postFromCms({ ...DOC, slug: '' }, CMS)).toBeNull()
    expect(postFromCms({ ...DOC, title: undefined }, CMS)).toBeNull()
    expect(postFromCms({ ...DOC, date: null }, CMS)).toBeNull()
  })
})

describe('selectPosts', () => {
  it('sorts by date descending', () => {
    const out = selectPosts([make('a', '2026-01-01'), make('b', '2026-03-01'), make('c', '2026-02-01')], true)
    expect(out.map(p => p.slug)).toEqual(['b', 'c', 'a'])
  })

  it('excludes drafts when includeDrafts is false', () => {
    const out = selectPosts([make('pub', '2026-01-01'), make('hid', '2026-02-01', true)], false)
    expect(out.map(p => p.slug)).toEqual(['pub'])
  })

  it('includes drafts when includeDrafts is true', () => {
    const out = selectPosts([make('pub', '2026-01-01'), make('hid', '2026-02-01', true)], true)
    expect(out.map(p => p.slug)).toEqual(['hid', 'pub'])
  })
})
