import yaml from 'js-yaml'

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

const FRONTMATTER_RE = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/

function normalizeDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  if (typeof value === 'string') return value
  return ''
}

export function parsePost(raw: string, filename: string): Post | null {
  // A trailing `.fi`/`.en` before `.md` selects the language; both variants of
  // a post share the same slug (e.g. `foo.fi.md` and `foo.en.md` → slug `foo`).
  const langMatch = filename.match(/\.(fi|en)\.md$/)
  const lang: Lang = (langMatch?.[1] as Lang | undefined) ?? DEFAULT_LANG
  const slug = filename.replace(/(\.(fi|en))?\.md$/, '')
  const match = raw.match(FRONTMATTER_RE)
  if (!match) {
    console.warn(`[blog] ${filename}: ei frontmatteria, skipataan`)
    return null
  }

  let data: Record<string, unknown>
  try {
    data = (yaml.load(match[1]) ?? {}) as Record<string, unknown>
  } catch (e) {
    console.warn(`[blog] ${filename}: virheellinen frontmatter, skipataan`, e)
    return null
  }

  const title = typeof data.title === 'string' ? data.title : ''
  const date = normalizeDate(data.date)
  if (!title || !date) {
    console.warn(`[blog] ${filename}: title tai date puuttuu, skipataan`)
    return null
  }

  return {
    slug,
    lang,
    title,
    date,
    description: typeof data.description === 'string' ? data.description : undefined,
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    cover: typeof data.cover === 'string' ? data.cover : undefined,
    draft: data.draft === true,
    content: match[2].trim(),
  }
}

export function selectPosts(posts: Post[], includeDrafts: boolean): Post[] {
  return posts
    .filter((p) => includeDrafts || !p.draft)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0))
}
