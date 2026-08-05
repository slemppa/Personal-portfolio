import type { Lang } from './parsePost'
import { DEFAULT_OG_IMAGE, SITE_NAME, absoluteUrl, ogLocale } from './seo'

export type Alternate = { hreflang: string; path: string }

// SPA head management: we render client-side, so per-page <title>, meta
// description, canonical and hreflang links are set imperatively on navigation.
// Every tag we own is marked data-managed so we can clear the previous page's
// tags before writing the current one's.
const MANAGED = 'data-managed'

function origin(): string {
  return typeof window !== 'undefined' ? window.location.origin : ''
}

function clearManaged(selector: string): void {
  document.head.querySelectorAll(`${selector}[${MANAGED}]`).forEach((el) => el.remove())
}

function setDescription(description?: string): void {
  if (!description) return
  // Update the existing description meta in place (index.html ships a static
  // one) so the first — and only — description tag is the current page's.
  let meta = document.head.querySelector<HTMLMetaElement>('meta[name="description"]')
  if (!meta) {
    meta = document.createElement('meta')
    meta.setAttribute('name', 'description')
    document.head.appendChild(meta)
  }
  meta.setAttribute('content', description)
  meta.setAttribute(MANAGED, '')
}

function setCanonical(path: string): void {
  clearManaged('link[rel="canonical"]')
  const link = document.createElement('link')
  link.setAttribute('rel', 'canonical')
  link.setAttribute('href', origin() + path)
  link.setAttribute(MANAGED, '')
  document.head.appendChild(link)
}

function setAlternates(alternates: Alternate[]): void {
  clearManaged('link[rel="alternate"]')
  for (const alt of alternates) {
    const link = document.createElement('link')
    link.setAttribute('rel', 'alternate')
    link.setAttribute('hreflang', alt.hreflang)
    link.setAttribute('href', origin() + alt.path)
    link.setAttribute(MANAGED, '')
    document.head.appendChild(link)
  }
}

// og:*/twitter:* are written fresh on every navigation: social crawlers read the
// prerendered tags (see scripts/seoBuild.ts), but an in-app navigation must not
// leave the previous page's card behind for anything that reads the live DOM.
function setSocial(opts: {
  lang: Lang
  title: string
  description?: string
  canonical: string
  image?: string
  type: 'website' | 'article'
  publishedTime?: string
}): void {
  clearManaged('meta[property^="og:"]')
  clearManaged('meta[property^="article:"]')
  clearManaged('meta[name^="twitter:"]')

  const tags: [attr: 'property' | 'name', key: string, value: string | undefined][] = [
    ['property', 'og:type', opts.type],
    ['property', 'og:site_name', SITE_NAME],
    ['property', 'og:locale', ogLocale(opts.lang)],
    ['property', 'og:title', opts.title],
    ['property', 'og:description', opts.description],
    ['property', 'og:url', absoluteUrl(opts.canonical)],
    ['property', 'og:image', absoluteUrl(opts.image ?? DEFAULT_OG_IMAGE)],
    ['property', 'article:published_time', opts.type === 'article' ? opts.publishedTime : undefined],
    ['name', 'twitter:card', 'summary_large_image'],
    ['name', 'twitter:title', opts.title],
    ['name', 'twitter:description', opts.description],
    ['name', 'twitter:image', absoluteUrl(opts.image ?? DEFAULT_OG_IMAGE)],
  ]

  for (const [attr, key, value] of tags) {
    if (!value) continue
    const meta = document.createElement('meta')
    meta.setAttribute(attr, key)
    meta.setAttribute('content', value)
    meta.setAttribute(MANAGED, '')
    document.head.appendChild(meta)
  }
}

function setJsonLd(blocks: Record<string, unknown>[]): void {
  clearManaged('script[type="application/ld+json"]')
  for (const block of blocks) {
    const script = document.createElement('script')
    script.type = 'application/ld+json'
    script.textContent = JSON.stringify(block)
    script.setAttribute(MANAGED, '')
    document.head.appendChild(script)
  }
}

export function applyHead(opts: {
  lang: Lang
  title: string
  description?: string
  canonical: string
  alternates: Alternate[]
  /** Site-absolute path to the share image; falls back to the site default. */
  image?: string
  /** `article` for blog posts, `website` for everything else. */
  type?: 'website' | 'article'
  publishedTime?: string
  jsonLd?: Record<string, unknown>[]
}): void {
  document.documentElement.lang = opts.lang
  document.title = opts.title
  setDescription(opts.description)
  setCanonical(opts.canonical)
  setAlternates(opts.alternates)
  setSocial({ ...opts, type: opts.type ?? 'website' })
  setJsonLd(opts.jsonLd ?? [])
}
