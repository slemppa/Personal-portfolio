import 'server-only'
import config from '@payload-config'
import { getPayload } from 'payload'
import { cache } from 'react'
import { postFromCms, selectPosts, type CmsPostDoc, type Lang, type Post } from './parsePost'

// Posts come straight from Payload's Local API (same app, same database).
// Pages that call these render statically; publishing in the admin calls
// revalidatePath (see cms/collections/Posts.ts) so they rebuild on demand.
// Drafts are visible in `next dev` only.
const includeDrafts = process.env.NODE_ENV !== 'production'

// cache(): metadata and page share one query per request.
export const getEveryPost = cache(async (): Promise<Post[]> => {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'posts',
    pagination: false,
    depth: 1,
    draft: includeDrafts,
    where: includeDrafts ? {} : { _status: { equals: 'published' } },
  })
  const posts = res.docs.map((d) => postFromCms(d as CmsPostDoc)).filter((p): p is Post => p !== null)
  return selectPosts(posts, includeDrafts)
})

export async function getAllPosts(lang: Lang): Promise<Post[]> {
  return (await getEveryPost()).filter((p) => p.lang === lang)
}

export async function getPost(slug: string, lang: Lang): Promise<Post | undefined> {
  return (await getAllPosts(lang)).find((p) => p.slug === slug)
}

export type { Post }
