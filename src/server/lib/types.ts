// Shape of the live "build in public" payload returned by /api/activity.
// Shared between the Vercel function, the Vite dev middleware, and the client.

export type Video = {
  id: string
  title: string
  /** Relative publish text from YouTube (e.g. "2 weeks ago"), best-effort. */
  published: string
  url: string
  thumbnail: string
  /** Duration like "12:45" when available. */
  durationText?: string
}

export type RecentCommit = {
  repo: string
  message: string
  url: string
  at: string
}

export type GithubActivity = {
  /** Total contributions in the last year, or null when no token is configured. */
  totalContributions: number | null
  /** Weeks of daily contribution counts (oldest→newest), or null without a token. */
  weeks: number[][] | null
  recent: RecentCommit[]
  profileUrl: string
}

export type Activity = {
  youtube: { channelUrl: string; videos: Video[] }
  github: GithubActivity
  generatedAt: string
}
