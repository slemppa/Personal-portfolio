import { describe, expect, it } from 'vitest'
import { pickService, splitForCallout } from './serviceMatch'

describe('pickService', () => {
  it('matches automation posts to n8n', () => {
    expect(pickService({ title: 'Markkinoinnin automaatio käytäntöön', tags: ['AI'] })).toBe('n8n')
  })
  it('matches price posts to cost', () => {
    expect(pickService({ title: 'Sisältöstrategia: hinta ja mistä kustannus syntyy', tags: [] })).toBe('cost')
  })
  it('matches CRM comparison to mvp', () => {
    expect(pickService({ title: 'Rascal CRM vs HubSpot, Salesforce, Pipedrive', tags: ['CRM'] })).toBe('mvp')
  })
  it('falls back to mvp', () => {
    expect(pickService({ title: 'Ajatuksia', tags: [] })).toBe('mvp')
  })
  it('weighs title over body', () => {
    expect(
      pickService({ title: 'n8n-työnkulut tuotantoon', tags: [], content: 'hinta '.repeat(5) }),
    ).toBe('n8n')
  })
})

describe('splitForCallout', () => {
  it('splits before the second H2', () => {
    const md = 'Intro\n\n## Eka\n\nteksti\n\n## Toka\n\nlisää'
    expect(splitForCallout(md)).toEqual(['Intro\n\n## Eka\n\nteksti\n\n', '## Toka\n\nlisää'])
  })
  it('ignores ### and returns null with one H2', () => {
    expect(splitForCallout('Intro\n\n## Eka\n\n### Ali\n\nx')).toBeNull()
  })
})
