import { parsePost, selectPosts, type Post } from './parsePost'

const modules = import.meta.glob('../content/blog/*.md', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>

const allParsed: Post[] = Object.entries(modules)
  .map(([path, raw]) => parsePost(raw, path.split('/').pop()!))
  .filter((p): p is Post => p !== null)

export function getAllPosts(): Post[] {
  return selectPosts(allParsed, !import.meta.env.PROD)
}

export function getPost(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug)
}

export type { Post }
