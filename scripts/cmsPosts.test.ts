import { describe, it, expect } from 'vitest'
import { fetchCmsPosts } from './cmsPosts'

const doc = { slug: 'a', lang: 'fi', title: 'A', date: '2026-01-01T12:00:00.000Z', _status: 'published', markdown: 'x' }

function fakeFetch(body: unknown, status = 200) {
  const calls: { url: string; headers: Record<string, string> }[] = []
  const impl = (async (url: string, init?: { headers?: Record<string, string> }) => {
    calls.push({ url, headers: init?.headers ?? {} })
    return new Response(JSON.stringify(body), { status })
  }) as unknown as typeof fetch
  return { impl, calls }
}

describe('fetchCmsPosts', () => {
  it('fetches all published posts without auth', async () => {
    const { impl, calls } = fakeFetch({ docs: [doc] })
    const posts = await fetchCmsPosts({ CMS_URL: 'https://cms.test/', CMS_API_KEY: 'k' }, { fetchImpl: impl })
    expect(posts.map((p) => p.slug)).toEqual(['a'])
    expect(calls[0].url).toBe('https://cms.test/api/posts?pagination=false&depth=1')
    expect(calls[0].headers.Authorization).toBeUndefined()
  })

  it('asks for drafts with the API key when requested', async () => {
    const { impl, calls } = fakeFetch({ docs: [] })
    await fetchCmsPosts({ CMS_URL: 'https://cms.test', CMS_API_KEY: 'k' }, { includeDrafts: true, fetchImpl: impl })
    expect(calls[0].url).toContain('draft=true')
    expect(calls[0].headers.Authorization).toBe('users API-Key k')
  })

  it('throws without CMS_URL or on an error response', async () => {
    await expect(fetchCmsPosts({})).rejects.toThrow('CMS_URL')
    const { impl } = fakeFetch({ errors: [] }, 500)
    await expect(fetchCmsPosts({ CMS_URL: 'https://cms.test' }, { fetchImpl: impl })).rejects.toThrow('500')
  })
})
