// /llms.txt — a plain-text map of the site for AI assistants (llmstxt.org
// convention). Generated from the same data as the pages, so it never drifts.
// It is a convention, not a ranking signal.
import { getCases } from '@/lib/cases'
import { casePath } from '@/lib/i18n'
import { SITE_URL, aboutPath } from '@/lib/seo'
import { PRICES, getServicePages, servicePath } from '@/lib/servicePages'

export const dynamic = 'force-static'

export function GET() {
  const fi = getServicePages().filter((p) => p.lang === 'fi')
  const en = getServicePages().filter((p) => p.lang === 'en')
  const url = (path: string) => SITE_URL + path

  const body = [
    '# Sami Kiias',
    '',
    `> Sami Kiias on fullstack-tuoterakentaja ja Rascal AI:n CTO. Hän rakentaa SaaS-tuotteita, MVP:itä, AI-integraatioita ja n8n-automaatioita ideasta tuotantoon. MVP-kehitys alkaen ${PRICES.mvpFrom} ja n8n-työnkulku alkaen ${PRICES.n8nFrom} (alv 0 %). Sami Kiias is a fullstack product builder and the CTO of Rascal AI.`,
    '',
    `Yhteys / contact: sami@mak8r.fi · ${url(aboutPath('fi'))}`,
    '',
    '## Palvelut ja tietoa (suomi)',
    ...fi.map((p) => `- [${p.h1}](${url(servicePath(p.slug))}): ${p.metaDescription}`),
    '',
    '## Services and about (English)',
    ...en.map((p) => `- [${p.h1}](${url(servicePath(p.slug))}): ${p.metaDescription}`),
    '',
    '## Projektit / Case studies',
    ...getCases('fi').map((c) => `- [${c.title}](${url(casePath('fi', c.slug))}): ${c.metaDescription}`),
    '',
    '## Optional',
    `- [Blogi](${url('/blog')}): kirjoituksia tekoälystä, markkinoinnin automaatiosta ja tuotekehityksestä`,
    `- [Blog (English)](${url('/en/blog')})`,
    `- [Sitemap](${url('/sitemap.xml')})`,
    '',
  ].join('\n')

  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } })
}
