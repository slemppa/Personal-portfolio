import allPosts from 'virtual:blog-posts'
import { selectPosts, type Post, type Lang } from './parsePost'

export function getAllPosts(lang: Lang): Post[] {
  return selectPosts(
    allPosts.filter((p) => p.lang === lang),
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
