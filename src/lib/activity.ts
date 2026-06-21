// Client-side types + fetch for the live build-in-public data served by
// /api/activity (Vercel function in prod, Vite middleware in dev). Types mirror
// api/_lib/types.ts; kept separate so the app build doesn't reach into /api.

export type Video = {
  id: string
  title: string
  published: string
  url: string
  thumbnail: string
  durationText?: string
}

export type RecentCommit = {
  repo: string
  message: string
  url: string
  at: string
}

export type GithubActivity = {
  totalContributions: number | null
  weeks: number[][] | null
  recent: RecentCommit[]
  profileUrl: string
}

export type Activity = {
  youtube: { channelUrl: string; videos: Video[] }
  github: GithubActivity
  generatedAt: string
}

export async function fetchActivity(signal?: AbortSignal): Promise<Activity> {
  const res = await fetch('/api/activity', { signal })
  if (!res.ok) throw new Error(`activity ${res.status}`)
  return (await res.json()) as Activity
}
