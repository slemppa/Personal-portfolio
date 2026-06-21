import type { Video } from './types.js'

// A browser-like User-Agent + consent cookie avoids YouTube's EU cookie
// interstitial, which otherwise returns a page without the data we need.
const UA =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36'
const HEADERS = {
  'User-Agent': UA,
  'Accept-Language': 'en-US,en;q=0.9',
  Cookie: 'SOCS=CAI; CONSENT=YES+1',
}

function decodeJson(s: string): string {
  try {
    return JSON.parse('"' + s + '"')
  } catch {
    return s
  }
}

/**
 * Parse a channel's /videos tab HTML. That tab lists longform uploads only —
 * Shorts live on the separate /shorts tab and never appear here — so no
 * duration filtering is needed. The tab uses YouTube's `lockupViewModel`
 * format; the videoId is taken from the thumbnail URL, the title from
 * `title.content`, and the duration from the thumbnail badge. Pure + testable.
 */
export function parseVideosPage(html: string, limit = 4): Video[] {
  const out: Video[] = []
  const seen = new Set<string>()
  const blocks = html.split('"lockupViewModel":{').slice(1)
  for (const b of blocks) {
    const id =
      b.match(/i\.ytimg\.com\/vi\/([\w-]{11})\//)?.[1] ??
      b.match(/"contentId":"([\w-]{11})"/)?.[1]
    const title = b.match(/"title":\{"content":"((?:[^"\\]|\\.)*)"/)?.[1]
    if (!id || !title || seen.has(id)) continue
    seen.add(id)
    const duration = b.match(
      /"thumbnailBadgeViewModel":\{"text":"([\d:]+)"/,
    )?.[1]
    const published = b.match(
      /"text":\{"content":"((?:[^"\\]|\\.)* ago)"/,
    )?.[1]
    out.push({
      id,
      title: decodeJson(title),
      published: published ? decodeJson(published) : '',
      url: `https://www.youtube.com/watch?v=${id}`,
      thumbnail: `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
      durationText: duration,
    })
    if (out.length >= limit) break
  }
  return out
}

/** Fetch the latest longform videos from a channel's /videos tab. */
export async function fetchLatestVideos(
  handle: string,
  limit = 4,
): Promise<{ channelUrl: string; videos: Video[] }> {
  const clean = handle.replace(/^@/, '')
  const channelUrl = `https://www.youtube.com/@${clean}`
  try {
    const res = await fetch(`${channelUrl}/videos`, { headers: HEADERS })
    if (!res.ok) return { channelUrl, videos: [] }
    const html = await res.text()
    return { channelUrl, videos: parseVideosPage(html, limit) }
  } catch {
    return { channelUrl, videos: [] }
  }
}
