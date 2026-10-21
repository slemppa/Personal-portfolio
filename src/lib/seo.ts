// SEO-primitiivit: yksi lähde sekä selainpuolen head-injektiolle (head.ts)
// että build-ajan prerenderille (scripts/seoBuild.ts). Puhtaita funktioita,
// jotta molemmat polut tuottavat varmasti saman tuloksen.
import type { Lang, Post } from './parsePost'

export const SITE_URL = 'https://www.samikiias.fi'
export const SITE_NAME = 'Sami Kiias'
export const AUTHOR_NAME = 'Sami Kiias'
export const DEFAULT_OG_IMAGE = '/portfolio-hero-fix.png'

// Hakutuloksen mitat: otsikko 30–60 merkkiä, kuvaus 70–160 merkkiä.
export const TITLE_MAX = 60
export const DESCRIPTION_MAX = 160
const TITLE_SUFFIX = ` · ${SITE_NAME}`

/** Lisää sivuston nimen otsikon perään vain, jos se mahtuu 60 merkkiin. */
export function pageTitle(title: string): string {
  return title.length + TITLE_SUFFIX.length <= TITLE_MAX ? title + TITLE_SUFFIX : title
}

/** Lyhentää tekstin sanarajalta enintään `max` merkkiin (… mukaan lukien). */
export function clampText(text: string, max = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  if (clean.length <= max) return clean
  const cut = clean.slice(0, max - 1)
  const lastSpace = cut.lastIndexOf(' ')
  return `${(lastSpace > max / 2 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:—–-]+$/, '')}…`
}

/** Markdownin ensimmäinen leipätekstikappale pelkkänä tekstinä (otsikot, kuvat ja listat ohitetaan). */
export function firstParagraph(markdown: string): string | undefined {
  const block = markdown
    .split(/\r?\n\s*\r?\n/)
    .map((b) => b.trim())
    .find((b) => b && !/^(#|!\[|[-*+>|]\s|\d+\.\s|```|<)/.test(b))
  return block ? stripInlineMarkdown(block.replace(/\r?\n/g, ' ')) : undefined
}

/** Site-absolute path → absolute URL. Passes through URLs that already are one. */
export function absoluteUrl(pathOrUrl: string): string {
  return /^https?:\/\//.test(pathOrUrl) ? pathOrUrl : SITE_URL + pathOrUrl
}

export type FaqItem = { question: string; answer: string }

const FAQ_HEADING = /^##\s+(usein kysytyt kysymykset|frequently asked questions)\s*$/i

/** Inline-markdownin poisto, jotta JSON-LD:hen menee luettavaa tekstiä. */
export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
    .replace(/(\*\*|__)(.*?)\1/g, '$2')
    .replace(/(\*|_)(.*?)\1/g, '$2')
    .replace(/`([^`]*)`/g, '$1')
    .trim()
}

/**
 * Poimii postauksen FAQ-osion `### kysymys` + seuraava kappale -pareina.
 * Osio päättyy seuraavaan h2:een. Ilman FAQ-otsikkoa palautuu tyhjä lista.
 */
export function extractFaq(markdown: string): FaqItem[] {
  const lines = markdown.split(/\r?\n/)
  const start = lines.findIndex((l) => FAQ_HEADING.test(l))
  if (start === -1) return []

  const items: FaqItem[] = []
  let current: FaqItem | null = null
  for (const line of lines.slice(start + 1)) {
    if (/^##\s/.test(line) && !/^###\s/.test(line)) break
    const heading = line.match(/^###\s+(.*)$/)
    if (heading) {
      if (current?.answer) items.push(current)
      current = { question: stripInlineMarkdown(heading[1]), answer: '' }
      continue
    }
    if (!current || !line.trim()) continue
    current.answer = current.answer ? `${current.answer} ${stripInlineMarkdown(line)}` : stripInlineMarkdown(line)
  }
  if (current?.answer) items.push(current)
  return items
}

/** Rakenteinen data yhdelle postaukselle: BlogPosting + mahdollinen FAQPage. */
export function postJsonLd(post: Post, path: string): Record<string, unknown>[] {
  const url = absoluteUrl(path)
  const blogPosting: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    datePublished: post.date,
    dateModified: post.date,
    inLanguage: post.lang,
    url,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    author: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
    publisher: { '@type': 'Person', name: AUTHOR_NAME, url: SITE_URL },
    image: absoluteUrl(post.cover ?? DEFAULT_OG_IMAGE),
  }
  if (post.description) blogPosting.description = post.description
  if (post.tags.length > 0) blogPosting.keywords = post.tags.join(', ')

  const faq = extractFaq(post.content)
  if (faq.length === 0) return [blogPosting]

  return [
    blogPosting,
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faq.map((item) => ({
        '@type': 'Question',
        name: item.question,
        acceptedAnswer: { '@type': 'Answer', text: item.answer },
      })),
    },
  ]
}

/** Open Graph -locale schema.org/hreflang-kielikoodista. */
export function ogLocale(lang: Lang): string {
  return lang === 'fi' ? 'fi_FI' : 'en_US'
}
