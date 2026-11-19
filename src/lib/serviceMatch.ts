import type { ServiceKey } from './servicePages'

type Matchable = { title: string; tags: string[]; description?: string; content?: string }

// Keyword stems per service, checked against the post's title, tags and
// description (strong signal) and body (weak signal). Lowercase, FI + EN.
const KEYWORDS: Record<Exclude<ServiceKey, 'about'>, string[]> = {
  n8n: ['n8n', 'automaati', 'automation', 'automate', 'workflow', 'työnkul', 'integraati', 'integration', 'zapier', 'make.com', 'webhook'],
  cost: ['hinta', 'hinnoittel', 'kustannu', 'budjet', 'price', 'pricing', 'cost', 'budget', 'maksaa'],
  mvp: ['mvp', 'startup', 'sovellu', 'saas', 'tuotekehity', 'ohjelmistokehity', 'prototyy', 'app ', 'product', 'kehittäjä', 'developer', 'crm'],
}

const count = (text: string, stems: string[]) =>
  stems.reduce((n, s) => n + (text.split(s).length - 1), 0)

/**
 * The service page most related to a blog post, so the post can link to it
 * in context. Falls back to MVP development (the main offer) when nothing
 * matches.
 */
export function pickService(post: Matchable): Exclude<ServiceKey, 'about'> {
  const head = [post.title, post.description ?? '', ...post.tags].join(' ').toLowerCase()
  const body = (post.content ?? '').toLowerCase()
  let best: Exclude<ServiceKey, 'about'> = 'mvp'
  let bestScore = 0
  for (const key of ['n8n', 'cost', 'mvp'] as const) {
    const score = count(head, KEYWORDS[key]) * 5 + Math.min(count(body, KEYWORDS[key]), 10)
    if (score > bestScore) {
      best = key
      bestScore = score
    }
  }
  return best
}

/**
 * Split markdown so a callout can sit mid-article: before the second H2
 * (`## `), i.e. after the intro and first section. Returns null when the post
 * has fewer than two H2 sections.
 */
export function splitForCallout(markdown: string): [string, string] | null {
  const re = /^## /gm
  re.exec(markdown)
  const second = re.exec(markdown)
  if (!second) return null
  return [markdown.slice(0, second.index), markdown.slice(second.index)]
}
