// Imports the old Obsidian markdown posts (seed/blog) into Payload. Safe to
// re-run: posts are upserted by slug + lang. Used by the seed migration
// (src/migrations) and by `pnpm import:markdown`.
import { readdirSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import yaml from 'js-yaml'
import type { Payload, PayloadRequest } from 'payload'

import { markdownToLexical } from './markdown'

// Resolved from the project root (cwd for `payload migrate` / `payload run`).
const SEED_DIR = path.resolve(process.cwd(), 'seed/blog')
// Covers were site paths like /cases/x.jpg, served from public/.
const PUBLIC_DIR = path.resolve(process.cwd(), 'public')

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

export type MarkdownPost = {
  slug: string
  lang: 'fi' | 'en'
  title: string
  date: string
  description?: string
  tags: string[]
  cover?: string
  draft: boolean
  content: string
}

function parse(raw: string, filename: string): MarkdownPost | null {
  const lang = (filename.match(/\.(fi|en)\.md$/)?.[1] ?? 'fi') as MarkdownPost['lang']
  const slug = filename.replace(/(\.(fi|en))?\.md$/, '')
  const match = raw.match(FRONTMATTER_RE)
  if (!match) return null
  const data = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date ?? '')
  const title = typeof data.title === 'string' ? data.title : ''
  if (!title || !date) return null
  return {
    slug,
    lang,
    title,
    date,
    description: typeof data.description === 'string' ? data.description : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === 'string' && data.cover ? data.cover : undefined,
    draft: data.draft === true,
    content: match[2].trim(),
  }
}

const context = { skipRevalidate: true }

function seedPosts(): MarkdownPost[] {
  return readdirSync(SEED_DIR)
    .filter((f) => f.endsWith('.md') && f !== 'template.md')
    .map((f) => {
      const post = parse(readFileSync(path.join(SEED_DIR, f), 'utf8'), f)
      if (!post) console.warn(`skip ${f}: no valid frontmatter`)
      return post
    })
    .filter((p): p is MarkdownPost => p !== null)
}

/** Uploads a seed cover (a public/ path) to Media once; returns its id. */
async function coverId(
  payload: Payload,
  cover: string | undefined,
  cache: Map<string, number>,
  req?: PayloadRequest,
): Promise<number | undefined> {
  if (!cover) return undefined
  // On Vercel the build disk is thrown away: without Blob storage the file
  // would be lost, so skip the cover (it can be set in the admin later).
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
    console.warn(`  cover skipped (no BLOB_READ_WRITE_TOKEN): ${cover}`)
    return undefined
  }
  if (cache.has(cover)) return cache.get(cover)
  const file = path.join(PUBLIC_DIR, cover)
  if (!existsSync(file)) {
    console.warn(`  cover not found: ${cover}`)
    return undefined
  }
  const filename = path.basename(file)
  const existing = await payload.find({ collection: 'media', where: { filename: { equals: filename } }, limit: 1, req })
  const media =
    existing.docs[0] ??
    (await payload.create({ collection: 'media', data: { alt: filename }, filePath: file, context, req }))
  cache.set(cover, media.id)
  return media.id
}

async function findPost(payload: Payload, post: MarkdownPost, req?: PayloadRequest) {
  const res = await payload.find({
    collection: 'posts',
    where: { and: [{ slug: { equals: post.slug } }, { lang: { equals: post.lang } }] },
    limit: 1,
    depth: 0,
    draft: true,
    req,
  })
  return res.docs[0]
}

/**
 * Creates or updates (by slug + lang) one post from markdown. Updating a
 * published post with `draft: true` saves a new draft and leaves the live
 * version as is.
 */
export async function upsertMarkdownPost(
  payload: Payload,
  post: MarkdownPost,
  opts: { req?: PayloadRequest; cover?: number; context?: Record<string, unknown> } = {},
): Promise<{ id: number; created: boolean }> {
  const { req } = opts
  const data = {
    title: post.title,
    slug: post.slug,
    lang: post.lang,
    date: new Date(`${post.date}T12:00:00Z`).toISOString(),
    description: post.description,
    tags: post.tags,
    ...(opts.cover ? { cover: opts.cover } : {}),
    content: await markdownToLexical(payload.config, post.content),
    _status: post.draft ? ('draft' as const) : ('published' as const),
  }
  const existing = await findPost(payload, post, req)
  const ctx = opts.context ?? {}
  if (existing) {
    await payload.update({ collection: 'posts', id: existing.id, data, draft: post.draft, context: ctx, req })
    return { id: existing.id, created: false }
  }
  const doc = await payload.create({ collection: 'posts', data, draft: post.draft, context: ctx, req })
  return { id: doc.id, created: true }
}

/** `req` keeps the writes inside a migration's transaction. */
export async function importMarkdownPosts(payload: Payload, req?: PayloadRequest) {
  const mediaByPath = new Map<string, number>()
  let created = 0
  let updated = 0

  for (const post of seedPosts()) {
    const cover = await coverId(payload, post.cover, mediaByPath, req)
    const res = await upsertMarkdownPost(payload, post, { req, cover, context })
    if (res.created) created++
    else updated++
    console.log(`${post.draft ? 'draft    ' : 'published'} ${post.lang} ${post.slug}`)
  }

  console.log(`\nDone: ${created} created, ${updated} updated.`)
}

/**
 * Sets the seed cover on imported posts that have none yet (the first import
 * ran before Blob storage existed). Touches nothing else, so edits made in
 * the admin are kept.
 */
export async function attachSeedCovers(payload: Payload, req?: PayloadRequest) {
  const mediaByPath = new Map<string, number>()
  for (const post of seedPosts()) {
    if (!post.cover) continue
    const existing = await findPost(payload, post, req)
    if (!existing || existing.cover) continue
    const cover = await coverId(payload, post.cover, mediaByPath, req)
    if (!cover) continue
    await payload.update({ collection: 'posts', id: existing.id, data: { cover }, context, req })
    console.log(`cover set: ${post.lang} ${post.slug}`)
  }
}
