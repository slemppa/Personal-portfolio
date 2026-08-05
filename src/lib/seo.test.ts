import { describe, it, expect } from 'vitest'
import { absoluteUrl, extractFaq, postJsonLd, stripInlineMarkdown, SITE_URL } from './seo'
import type { Post } from './parsePost'

const post = (content: string, extra: Partial<Post> = {}): Post => ({
  slug: 'testi',
  lang: 'fi',
  title: 'Testipostaus',
  date: '2026-08-05',
  description: 'Kuvaus',
  tags: ['crm'],
  draft: false,
  content,
  ...extra,
})

describe('absoluteUrl', () => {
  it('prefixes a site-absolute path with the site URL', () => {
    expect(absoluteUrl('/blog/x')).toBe(`${SITE_URL}/blog/x`)
  })

  it('passes an existing absolute URL through untouched', () => {
    expect(absoluteUrl('https://www.rascalai.fi')).toBe('https://www.rascalai.fi')
  })
})

describe('stripInlineMarkdown', () => {
  it('unwraps links, bold, italics and code', () => {
    expect(stripInlineMarkdown('**Ei**, katso [tämä](/blog/x) ja `koodi`')).toBe('Ei, katso tämä ja koodi')
  })
})

describe('extractFaq', () => {
  const content = `# Otsikko

Johdanto.

## Usein kysytyt kysymykset

### Kysymys yksi?

Vastaus yksi.

### Kysymys kaksi?

Vastaus kaksi jatkuu
toisella rivillä.

## Yhteenveto

Tämä ei kuulu FAQ:hon.`

  it('pairs each h3 with the paragraph that follows it', () => {
    expect(extractFaq(content)).toEqual([
      { question: 'Kysymys yksi?', answer: 'Vastaus yksi.' },
      { question: 'Kysymys kaksi?', answer: 'Vastaus kaksi jatkuu toisella rivillä.' },
    ])
  })

  it('stops at the next h2 so later sections never leak in', () => {
    expect(extractFaq(content).some((f) => f.answer.includes('ei kuulu'))).toBe(false)
  })

  it('recognises the English heading too', () => {
    const en = '## Frequently asked questions\n\n### Q?\n\nA.'
    expect(extractFaq(en)).toEqual([{ question: 'Q?', answer: 'A.' }])
  })

  it('returns nothing when the post has no FAQ section', () => {
    expect(extractFaq('# Otsikko\n\nPelkkää tekstiä.')).toEqual([])
  })
})

describe('postJsonLd', () => {
  it('emits a BlogPosting with canonical url, image and keywords', () => {
    const [blogPosting] = postJsonLd(post('Ei FAQ:ta.'), '/blog/testi')
    expect(blogPosting['@type']).toBe('BlogPosting')
    expect(blogPosting.url).toBe(`${SITE_URL}/blog/testi`)
    expect(blogPosting.keywords).toBe('crm')
    expect(blogPosting.image).toBe(`${SITE_URL}/portfolio-hero-fix.png`)
  })

  it('prefers the post cover as the image when one is set', () => {
    const [blogPosting] = postJsonLd(post('x', { cover: '/cases/rascal-crm/rascal-id.jpg' }), '/blog/testi')
    expect(blogPosting.image).toBe(`${SITE_URL}/cases/rascal-crm/rascal-id.jpg`)
  })

  it('adds a FAQPage only when the post actually has questions', () => {
    expect(postJsonLd(post('Ei FAQ:ta.'), '/blog/testi')).toHaveLength(1)
    const withFaq = postJsonLd(post('## Usein kysytyt kysymykset\n\n### Q?\n\nA.'), '/blog/testi')
    expect(withFaq).toHaveLength(2)
    expect(withFaq[1]['@type']).toBe('FAQPage')
  })
})
