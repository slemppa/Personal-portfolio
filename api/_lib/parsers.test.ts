import { describe, it, expect } from 'vitest'
import { parseVideosPage } from './youtube.js'
import { shapeContributionCalendar, shapeEvents } from './github.js'

describe('parseVideosPage', () => {
  // Minimal shape mirroring the lockupViewModel entries on a /videos tab page.
  const html =
    'prefix' +
    '"lockupViewModel":{"contentImage":{"thumbnailViewModel":{"image":{"sources":[{"url":"https://i.ytimg.com/vi/aaa11122233/hqdefault.jpg?x"}]},"overlays":[{"thumbnailBottomOverlayViewModel":{"badges":[{"thumbnailBadgeViewModel":{"text":"12:45"}}]}}]},"metadata":{"lockupMetadataViewModel":{"title":{"content":"Mik\\u00e4 ihmeen n8n?!"},"metadata":{"contentMetadataViewModel":{"metadataRows":[{"metadataParts":[{"text":{"content":"172 views"}},{"text":{"content":"2 weeks ago"}}]}]}}}}}' +
    '"lockupViewModel":{"contentImage":{"thumbnailViewModel":{"image":{"sources":[{"url":"https://i.ytimg.com/vi/bbb44455566/hqdefault.jpg"}]},"overlays":[{"thumbnailBottomOverlayViewModel":{"badges":[{"thumbnailBadgeViewModel":{"text":"8:30"}}]}}]},"metadata":{"lockupMetadataViewModel":{"title":{"content":"Toinen video"}}}}}'

  it('extracts longform videos with decoded titles, duration and derived urls', () => {
    const videos = parseVideosPage(html)
    expect(videos).toHaveLength(2)
    expect(videos[0]).toEqual({
      id: 'aaa11122233',
      title: 'Mikä ihmeen n8n?!',
      published: '2 weeks ago',
      url: 'https://www.youtube.com/watch?v=aaa11122233',
      thumbnail: 'https://i.ytimg.com/vi/aaa11122233/hqdefault.jpg',
      durationText: '12:45',
    })
    expect(videos[1].durationText).toBe('8:30')
    expect(videos[1].published).toBe('')
  })

  it('respects the limit', () => {
    expect(parseVideosPage(html, 1)).toHaveLength(1)
  })

  it('returns empty for junk input', () => {
    expect(parseVideosPage('not html')).toEqual([])
  })
})

describe('shapeContributionCalendar', () => {
  it('shapes total + weeks from a GraphQL response', () => {
    const json = {
      data: {
        user: {
          contributionsCollection: {
            contributionCalendar: {
              totalContributions: 3190,
              weeks: [
                { contributionDays: [{ contributionCount: 0, date: '2025-06-01' }, { contributionCount: 4, date: '2025-06-02' }] },
                { contributionDays: [{ contributionCount: 2, date: '2025-06-08' }] },
              ],
            },
          },
        },
      },
    }
    expect(shapeContributionCalendar(json)).toEqual({
      totalContributions: 3190,
      weeks: [[0, 4], [2]],
    })
  })

  it('degrades to nulls when data is missing', () => {
    expect(shapeContributionCalendar({})).toEqual({
      totalContributions: null,
      weeks: null,
    })
  })
})

describe('shapeEvents', () => {
  it('keeps only push events with a last-commit message', () => {
    const json = [
      { type: 'WatchEvent', repo: { name: 'a/b' } },
      {
        type: 'PushEvent',
        repo: { name: 'slemppa/portfolio' },
        created_at: '2026-06-20T08:00:00Z',
        payload: { commits: [{ message: 'wip' }, { message: 'feat: live activity\n\nbody' }] },
      },
    ]
    expect(shapeEvents(json)).toEqual([
      {
        repo: 'slemppa/portfolio',
        message: 'feat: live activity',
        url: 'https://github.com/slemppa/portfolio',
        at: '2026-06-20T08:00:00Z',
      },
    ])
  })

  it('returns empty for non-arrays', () => {
    expect(shapeEvents(null)).toEqual([])
  })
})
