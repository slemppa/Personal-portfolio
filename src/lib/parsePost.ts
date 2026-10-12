export type Lang = 'fi' | 'en'

export const LANGS: Lang[] = ['fi', 'en']
export const DEFAULT_LANG: Lang = 'fi'

export type Post = {
  slug: string
  lang: Lang
  title: string
  date: string
  description?: string
  tags: string[]
  cover?: string
  draft: boolean
  content: string
}

/** The subset of a Payload `posts` document (REST, depth=1) the site uses. */
export type CmsPostDoc = {
  slug?: unknown
  lang?: unknown
  title?: unknown
  date?: unknown
  description?: unknown
  tags?: unknown
  cover?: unknown
  _status?: unknown
  markdown?: unknown
}

/**
 * Maps a Payload post to the site's Post shape. `cmsUrl` makes relative media
 * URLs (local uploads: `/api/media/file/x.jpg`) absolute.
 */
export function postFromCms(doc: CmsPostDoc, cmsUrl: string): Post | null {
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const title = typeof doc.title === 'string' ? doc.title : ''
  const date = typeof doc.date === 'string' ? doc.date.slice(0, 10) : ''
  if (!slug || !title || !date) {
    console.warn(`[blog] CMS-postaus "${slug || title}": slug, title tai date puuttuu, skipataan`)
    return null
  }
  const coverUrl =
    doc.cover && typeof doc.cover === 'object' && typeof (doc.cover as { url?: unknown }).url === 'string'
      ? (doc.cover as { url: string }).url
      : undefined
  return {
    slug,
    lang: doc.lang === 'en' ? 'en' : DEFAULT_LANG,
    title,
    date,
    description: typeof doc.description === 'string' && doc.description ? doc.description : undefined,
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    cover: coverUrl && !/^https?:\/\//.test(coverUrl) ? cmsUrl.replace(/\/$/, '') + coverUrl : coverUrl,
    draft: doc._status === 'draft',
    content: typeof doc.markdown === 'string' ? doc.markdown.trim() : '',
  }
}

export function selectPosts(posts: Post[], includeDrafts: boolean): Post[] {
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
