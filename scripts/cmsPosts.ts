// Blogipostaukset tulevat Payload CMS:stä (cms/). Build hakee ne kerran REST
// API:sta ja tarjoaa ne virtuaalimoduulina `virtual:blog-posts`, jolloin
// sivusto pysyy staattisena eikä selain koskaan kutsu CMS:ää. Julkaisu
// CMS:ssä laukaisee Vercel deploy hookin, joka ajaa tämän buildin uudelleen.
import type { Plugin } from 'vite'
import { postFromCms, type CmsPostDoc, type Post } from '../src/lib/parsePost'

const VIRTUAL_ID = 'virtual:blog-posts'
const RESOLVED_ID = '\0' + VIRTUAL_ID

export type CmsEnv = {
  /** CMS:n juuri-URL, esim. https://cms.samikiias.fi */
  CMS_URL?: string
  /** Payload-käyttäjän API-avain; dev-tilassa sillä haetaan myös luonnokset. */
  CMS_API_KEY?: string
}

export async function fetchCmsPosts(
  env: CmsEnv,
  { includeDrafts = false, fetchImpl = fetch }: { includeDrafts?: boolean; fetchImpl?: typeof fetch } = {},
): Promise<Post[]> {
  const cmsUrl = env.CMS_URL?.replace(/\/$/, '')
  if (!cmsUrl) throw new Error('CMS_URL puuttuu')
  const params = new URLSearchParams({ pagination: 'false', depth: '1' })
  const headers: Record<string, string> = {}
  if (includeDrafts && env.CMS_API_KEY) {
    params.set('draft', 'true')
    headers.Authorization = `users API-Key ${env.CMS_API_KEY}`
  }
  const res = await fetchImpl(`${cmsUrl}/api/posts?${params}`, { headers })
  if (!res.ok) throw new Error(`CMS vastasi ${res.status} ${res.statusText}`)
  const body = (await res.json()) as { docs?: CmsPostDoc[] }
  return (body.docs ?? []).map((d) => postFromCms(d, cmsUrl)).filter((p): p is Post => p !== null)
}

let cache: { key: string; posts: Promise<Post[]> } | null = null

/**
 * Hakee postit kerran per prosessi (virtuaalimoduuli + SEO-prerender jakavat
 * saman haun). Tuotantobuildissa puuttuva tai kaatuva CMS kaataa buildin —
 * muuten julkaistaisiin sivusto ilman blogia. Devissä jatketaan tyhjällä.
 */
export function loadCmsPosts(env: CmsEnv, isBuild: boolean): Promise<Post[]> {
  const key = `${env.CMS_URL}|${isBuild}`
  if (cache?.key === key) return cache.posts
  const posts = fetchCmsPosts(env, { includeDrafts: !isBuild }).catch((err) => {
    if (isBuild) throw new Error(`[blog] postausten haku CMS:stä epäonnistui: ${err.message ?? err}`)
    console.warn(`[blog] CMS ei käytettävissä (${err.message ?? err}) — blogi on tyhjä devissä`)
    return [] as Post[]
  })
  cache = { key, posts }
  return posts
}

export function cmsPosts(env: CmsEnv): Plugin {
  let isBuild = false
  return {
    name: 'cms-posts',
    configResolved(config) {
      isBuild = config.command === 'build'
    },
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
    },
    async load(id) {
      if (id !== RESOLVED_ID) return
      const posts = await loadCmsPosts(env, isBuild)
      return `export default ${JSON.stringify(posts)}`
    },
  }
}
