import { describe, it, expect } from 'vitest'
import { mirrorPath } from './i18n'

describe('mirrorPath', () => {
  it('mirrors the Finnish home to the English home', () => {
    expect(mirrorPath('/')).toBe('/en')
  })

  it('mirrors the English home back to the Finnish home', () => {
    expect(mirrorPath('/en')).toBe('/')
  })

  it('mirrors a Finnish case study to its English counterpart', () => {
    expect(mirrorPath('/projektit/pesa')).toBe('/en/projektit/pesa')
  })

  it('mirrors an English blog post back to Finnish', () => {
    expect(mirrorPath('/en/blog/x')).toBe('/blog/x')
  })

  it('falls back to the English home for fi-only pages', () => {
    expect(mirrorPath('/yhteys')).toBe('/en')
  })
})
