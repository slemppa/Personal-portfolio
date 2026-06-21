import type { Activity } from './types.js'
import { fetchLatestVideos } from './youtube.js'
import { fetchGithubActivity } from './github.js'

export type ActivityEnv = {
  GITHUB_TOKEN?: string
  GITHUB_USER?: string
  YT_HANDLE?: string
}

/**
 * Aggregate the live "build in public" sources. Each source fails
 * independently so one outage never blanks the whole section.
 */
export async function buildActivity(env: ActivityEnv): Promise<Activity> {
  const ytHandle = env.YT_HANDLE || 'samikiias'
  const ghUser = env.GITHUB_USER || 'slemppa'

  const [youtube, github] = await Promise.all([
    fetchLatestVideos(ytHandle),
    fetchGithubActivity(ghUser, env.GITHUB_TOKEN),
  ])

  return { youtube, github, generatedAt: new Date().toISOString() }
}
