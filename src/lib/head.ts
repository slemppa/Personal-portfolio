import type { Lang } from './parsePost'

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

export function applyHead(opts: {
  lang: Lang
  title: string
  description?: string
  canonical: string
  alternates: Alternate[]
}): void {
  document.documentElement.lang = opts.lang
  document.title = opts.title
  setDescription(opts.description)
  setCanonical(opts.canonical)
  setAlternates(opts.alternates)
}
