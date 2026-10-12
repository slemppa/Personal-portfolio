// POST /api/posts/import — lets automations (the n8n "Portfolio Blog"
// workflow) publish markdown posts. Authenticated with a Payload user API key:
//   Authorization: users API-Key <key>
// Body: { slug?, lang, title, date?, description?, tags?, draft?, markdown }
// Upserts by slug + lang, so the fi and en versions share a slug.
import { addDataAndFileToRequest, type Endpoint } from 'payload'

import { slugify } from './slugify'
import { upsertMarkdownPost, type MarkdownPost } from './importMarkdownPosts'

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function parseImportBody(body: unknown): { ok: true; post: MarkdownPost } | { ok: false; error: string } {
  if (!body || typeof body !== 'object') return { ok: false, error: 'body must be a JSON object' }
  const b = body as Record<string, unknown>
  const title = typeof b.title === 'string' ? b.title.trim() : ''
  const markdown = typeof b.markdown === 'string' ? b.markdown.trim() : ''
  if (!title) return { ok: false, error: 'title is required' }
  if (!markdown) return { ok: false, error: 'markdown is required' }
  if (b.lang !== undefined && b.lang !== 'fi' && b.lang !== 'en') return { ok: false, error: 'lang must be fi or en' }
  const slug = slugify(typeof b.slug === 'string' && b.slug ? b.slug : title)
  if (!slug) return { ok: false, error: 'could not derive a slug' }
  const date = typeof b.date === 'string' && DATE_RE.test(b.date) ? b.date : new Date().toISOString().slice(0, 10)
  return {
    ok: true,
    post: {
      slug,
      lang: b.lang === 'en' ? 'en' : 'fi',
      title,
      date,
      description: typeof b.description === 'string' && b.description ? b.description : undefined,
      tags: Array.isArray(b.tags) ? b.tags.map(String).filter(Boolean) : [],
      // Default to draft: an automation proposes, a human publishes in /admin.
      draft: b.draft !== false,
      content: markdown,
    },
  }
}

export const importEndpoint: Endpoint = {
  path: '/import',
  method: 'post',
  handler: async (req) => {
    if (!req.user) return Response.json({ error: 'unauthorized' }, { status: 401 })
    await addDataAndFileToRequest(req)
    const parsed = parseImportBody(req.data)
    if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 })
    const { id, created } = await upsertMarkdownPost(req.payload, parsed.post, { req })
    const { slug, lang, draft } = parsed.post
    return Response.json({ id, slug, lang, status: draft ? 'draft' : 'published', created }, { status: created ? 201 : 200 })
  },
}
