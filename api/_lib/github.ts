import type { GithubActivity, RecentCommit } from './types'

const UA = 'samikiias-site/1.0 (+https://github.com/slemppa)'

type CalendarDay = { contributionCount: number; date: string }
type CalendarWeek = { contributionDays: CalendarDay[] }

/** Shape a GitHub GraphQL contributionCalendar response. Pure + testable. */
export function shapeContributionCalendar(json: unknown): {
  totalContributions: number | null
  weeks: number[][] | null
} {
  const cal = (json as { data?: { user?: { contributionsCollection?: { contributionCalendar?: { totalContributions?: number; weeks?: CalendarWeek[] } } } } })
    ?.data?.user?.contributionsCollection?.contributionCalendar
  if (!cal || typeof cal.totalContributions !== 'number' || !Array.isArray(cal.weeks)) {
    return { totalContributions: null, weeks: null }
  }
  const weeks = cal.weeks.map((w) =>
    w.contributionDays.map((d) => d.contributionCount),
  )
  return { totalContributions: cal.totalContributions, weeks }
}

/** Shape the public events feed into recent push commits. Pure + testable. */
export function shapeEvents(json: unknown, limit = 4): RecentCommit[] {
  if (!Array.isArray(json)) return []
  const out: RecentCommit[] = []
  for (const ev of json) {
    if (ev?.type !== 'PushEvent') continue
    const repo: string | undefined = ev?.repo?.name
    const commits: { message?: string }[] = ev?.payload?.commits ?? []
    const last = commits[commits.length - 1]
    if (!repo || !last?.message) continue
    out.push({
      repo,
      message: last.message.split('\n')[0].slice(0, 100),
      url: `https://github.com/${repo}`,
      at: ev?.created_at ?? '',
    })
    if (out.length >= limit) break
  }
  return out
}

const CONTRIB_QUERY = `query($login:String!){user(login:$login){contributionsCollection{contributionCalendar{totalContributions weeks{contributionDays{contributionCount date}}}}}}`

async function fetchCalendar(login: string, token: string) {
  try {
    const res = await fetch('https://api.github.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'User-Agent': UA,
      },
      body: JSON.stringify({ query: CONTRIB_QUERY, variables: { login } }),
    })
    if (!res.ok) return { totalContributions: null, weeks: null }
    return shapeContributionCalendar(await res.json())
  } catch {
    return { totalContributions: null, weeks: null }
  }
}

async function fetchEvents(login: string, token?: string): Promise<RecentCommit[]> {
  try {
    const headers: Record<string, string> = {
      'User-Agent': UA,
      Accept: 'application/vnd.github+json',
    }
    if (token) headers.Authorization = `Bearer ${token}`
    const res = await fetch(
      `https://api.github.com/users/${login}/events/public?per_page=30`,
      { headers },
    )
    if (!res.ok) return []
    return shapeEvents(await res.json())
  } catch {
    return []
  }
}

/**
 * Fetch GitHub activity. The contribution count + heatmap require a token
 * (GraphQL); recent commits work token-free. Degrades gracefully.
 */
export async function fetchGithubActivity(
  login: string,
  token: string | undefined,
): Promise<GithubActivity> {
  const profileUrl = `https://github.com/${login}`
  const [calendar, recent] = await Promise.all([
    token ? fetchCalendar(login, token) : Promise.resolve({ totalContributions: null, weeks: null }),
    fetchEvents(login, token),
  ])
  return {
    totalContributions: calendar.totalContributions,
    weeks: calendar.weeks,
    recent,
    profileUrl,
  }
}
