import { parsePost, selectPosts, type Post, type Lang } from './parsePost'

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const allParsed: Post[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(raw, path.split('/').pop()!))
  .filter((p): p is Post => p !== null)

export function getAllPosts(lang: Lang): Post[] {
  return selectPosts(
    allParsed.filter((p) => p.lang === lang),
    !import.meta.env.PROD,
  )
}

export function getPost(slug: string, lang: Lang): Post | undefined {
  return getAllPosts(lang).find((p) => p.slug === slug)
}

/** The same post in another language, if a (visible) translation exists. */
export function getTranslation(slug: string, lang: Lang): Post | undefined {
  return getPost(slug, lang)
}

export type { Post }
