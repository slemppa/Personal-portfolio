import type { Lang } from './parsePost'

type Dict = {
  blogTitle: string
  blogSubtitle: string
  empty: string
  back: string
  notFoundTitle: string
  notFoundBody: string
  /** Label of the link that switches to the other language. */
  switchLabel: string
}

const strings: Record<Lang, Dict> = {
  fi: {
    blogTitle: 'Blogi',
    blogSubtitle: 'Ajatuksia ja muistiinpanoja.',
    empty: 'Ei vielä postauksia.',
    back: '← Takaisin blogiin',
    notFoundTitle: 'Postausta ei löytynyt',
    notFoundBody: 'Tarkista osoite tai palaa blogiin.',
    switchLabel: 'In English',
  },
  en: {
    blogTitle: 'Blog',
    blogSubtitle: 'Thoughts and notes.',
    empty: 'No posts yet.',
    back: '← Back to the blog',
    notFoundTitle: 'Post not found',
    notFoundBody: 'Check the URL or head back to the blog.',
    switchLabel: 'Suomeksi',
  },
}

export function t(lang: Lang, key: keyof Dict): string {
  return strings[lang][key]
}

export const otherLang = (lang: Lang): Lang => (lang === 'fi' ? 'en' : 'fi')

// URL scheme lives here so pages never hardcode the `/en` prefix.
export const blogListPath = (lang: Lang): string => (lang === 'fi' ? '/blog' : '/en/blog')
export const blogPostPath = (lang: Lang, slug: string): string =>
  lang === 'fi' ? `/blog/${slug}` : `/en/blog/${slug}`
