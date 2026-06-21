import { buildActivity } from './_lib/activity.js'

// Vercel serverless function: GET /api/activity
// Returns the live build-in-public payload, CDN-cached ~15 min.
export default async function handler(
  _req: { method?: string },
  res: {
    setHeader: (k: string, v: string) => void
    status: (n: number) => { json: (b: unknown) => void }
  },
): Promise<void> {
  try {
    const data = await buildActivity({
      GITHUB_TOKEN: process.env.GITHUB_TOKEN,
      GITHUB_USER: process.env.GITHUB_USER,
      YT_HANDLE: process.env.YT_HANDLE,
    })
    res.setHeader(
      'Cache-Control',
      's-maxage=900, stale-while-revalidate=3600',
    )
    res.status(200).json(data)
  } catch {
    res.setHeader('Cache-Control', 'no-store')
    res.status(200).json({
      youtube: { channelUrl: 'https://www.youtube.com/@samikiias', videos: [] },
      github: {
        totalContributions: null,
        weeks: null,
        recent: [],
        profileUrl: 'https://github.com/slemppa',
      },
      generatedAt: new Date().toISOString(),
    })
  }
}
