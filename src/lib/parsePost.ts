export type Lang = 'fi' | 'en'

export const LANGS: Lang[] = ['fi', 'en']
export const DEFAULT_LANG: Lang = 'fi'

export type Post = {
  slug: string
  lang: Lang
  title: string
  date: string
  /** Viimeisin muutos (CMS:n updatedAt, YYYY-MM-DD). */
  updated?: string
  description?: string
  /** Hakukoneelle erikseen kirjoitettu otsikko; muuten `title`. */
  metaTitle?: string
  /** Hakukoneelle erikseen kirjoitettu kuvaus; muuten `description`. */
  metaDescription?: string
  tags: string[]
  cover?: string
  coverAlt?: string
  draft: boolean
  content: string
}

/** The subset of a Payload `posts` document (depth=1) the site uses. */
export type CmsPostDoc = {
  slug?: unknown
  lang?: unknown
  title?: unknown
  date?: unknown
  updatedAt?: unknown
  description?: unknown
  metaTitle?: unknown
  metaDescription?: unknown
  tags?: unknown
  cover?: unknown
  _status?: unknown
  markdown?: unknown
}

/**
 * Maps a Payload post to the site's Post shape. Cover URLs are either Vercel
 * Blob URLs or same-origin `/api/media/file/...` paths — both usable as-is.
 */
export function postFromCms(doc: CmsPostDoc): Post | null {
  const slug = typeof doc.slug === 'string' ? doc.slug : ''
  const title = typeof doc.title === 'string' ? doc.title : ''
  const date = typeof doc.date === 'string' ? doc.date.slice(0, 10) : ''
  if (!slug || !title || !date) {
    console.warn(`[blog] CMS-postaus "${slug || title}": slug, title tai date puuttuu, skipataan`)
    return null
  }
  const cover = doc.cover && typeof doc.cover === 'object' ? (doc.cover as { url?: unknown; alt?: unknown }) : undefined
  const coverUrl = typeof cover?.url === 'string' ? cover.url : undefined
  const nonEmpty = (v: unknown) => (typeof v === 'string' && v.trim() ? v.trim() : undefined)
  return {
    slug,
    lang: doc.lang === 'en' ? 'en' : DEFAULT_LANG,
    title,
    date,
    updated: typeof doc.updatedAt === 'string' ? doc.updatedAt.slice(0, 10) : undefined,
    description: nonEmpty(doc.description),
    metaTitle: nonEmpty(doc.metaTitle),
    metaDescription: nonEmpty(doc.metaDescription),
    tags: Array.isArray(doc.tags) ? doc.tags.map(String) : [],
    cover: coverUrl,
    // Seed-import tallensi altiksi tiedostonimen; se ei kuvaa kuvaa, joten
    // sivu käyttää silloin postauksen otsikkoa.
    coverAlt: coverUrl && !/\.(jpe?g|png|webp|gif|avif)$/i.test(String(cover?.alt)) ? nonEmpty(cover?.alt) : undefined,
    draft: doc._status === 'draft',
    content: typeof doc.markdown === 'string' ? doc.markdown.trim() : '',
  }
}

export function selectPosts(posts: Post[], includeDrafts: boolean): Post[] {
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
