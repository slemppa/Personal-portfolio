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

type Parsed = {
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

function parse(raw: string, filename: string): Parsed | null {
  const lang = (filename.match(/\.(fi|en)\.md$/)?.[1] ?? 'fi') as Parsed['lang']
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

/** `req` keeps the writes inside a migration's transaction. */
export async function importMarkdownPosts(payload: Payload, req?: PayloadRequest) {
  const context = { skipRevalidate: true }
  const mediaByPath = new Map<string, number>()

  async function coverId(cover: string | undefined) {
    if (!cover) return undefined
    // On Vercel the build disk is thrown away: without Blob storage the file
    // would be lost, so skip the cover (it can be set in the admin later).
    if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) {
      console.warn(`  cover skipped (no BLOB_READ_WRITE_TOKEN): ${cover}`)
      return undefined
    }
    if (mediaByPath.has(cover)) return mediaByPath.get(cover)
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
    mediaByPath.set(cover, media.id)
    return media.id
  }

  const files = readdirSync(SEED_DIR).filter((f) => f.endsWith('.md') && f !== 'template.md')
  let created = 0
  let updated = 0

  for (const file of files) {
    const post = parse(readFileSync(path.join(SEED_DIR, file), 'utf8'), file)
    if (!post) {
      console.warn(`skip ${file}: no valid frontmatter`)
      continue
    }
    const data = {
      title: post.title,
      slug: post.slug,
      lang: post.lang,
      date: new Date(`${post.date}T12:00:00Z`).toISOString(),
      description: post.description,
      tags: post.tags,
      cover: await coverId(post.cover),
      content: await markdownToLexical(payload.config, post.content),
      _status: post.draft ? ('draft' as const) : ('published' as const),
    }
    const existing = await payload.find({
      collection: 'posts',
      where: { and: [{ slug: { equals: post.slug } }, { lang: { equals: post.lang } }] },
      limit: 1,
      draft: true,
      req,
    })
    if (existing.docs[0]) {
      await payload.update({ collection: 'posts', id: existing.docs[0].id, data, draft: post.draft, context, req })
      updated++
    } else {
      await payload.create({ collection: 'posts', data, draft: post.draft, context, req })
      created++
    }
    console.log(`${post.draft ? 'draft    ' : 'published'} ${post.lang} ${post.slug}`)
  }

  console.log(`\nDone: ${created} created, ${updated} updated.`)
}
