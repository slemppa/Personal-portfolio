import Link from 'next/link'
import type { Lang } from '../lib/parsePost'
import { PRICES, serviceHref, type ServiceKey } from '../lib/servicePages'

type Key = Exclude<ServiceKey, 'about'>

/** Short card copy for each service page (the pages themselves hold the detail). */
export const SERVICE_COPY: Record<Lang, Record<Key, { title: string; body: string; meta: string }>> = {
  fi: {
    mvp: {
      title: 'MVP-kehitys',
      body: 'Tuotteesi ensimmäinen versio ideasta tuotantoon: frontend, backend, tietokanta ja AI-integraatiot.',
      meta: `Alkaen ${PRICES.mvpFrom} (alv 0 %)`,
    },
    n8n: {
      title: 'n8n-automaatiot',
      body: 'Työnkulut, AI-putket ja integraatiot, jotka pyörivät tuotannossa eivätkä hajoa hiljaa.',
      meta: `Alkaen ${PRICES.n8nFrom} (alv 0 %)`,
    },
    cost: {
      title: 'Ohjelmistokehityksen hinta',
      body: 'Mistä kustannus syntyy, mitä vaikuttaa hintaan ja miten budjetin saa pysymään hallussa.',
      meta: 'Opas ja esimerkkihinnat',
    },
  },
  en: {
    mvp: {
      title: 'MVP development',
      body: 'Your product’s first version from idea to production: frontend, backend, database and AI integrations.',
      meta: 'From €4,900 (excl. VAT)',
    },
    n8n: {
      title: 'n8n automation',
      body: 'Workflows, AI pipelines and integrations that run in production and don’t fail silently.',
      meta: 'From €790 (excl. VAT)',
    },
    cost: {
      title: 'Software development cost',
      body: 'Where the cost comes from, what drives the price and how to keep the budget under control.',
      meta: 'Guide and example prices',
    },
  },
}

const SECTION = {
  fi: {
    eyebrow: 'Palvelut',
    title: 'Miten voin auttaa',
    lead: 'Rakennan saman tason järjestelmiä myös asiakkaille. Valitse lähin vaihtoehto ja lue tarkemmin.',
    more: 'Lue lisää',
  },
  en: {
    eyebrow: 'Services',
    title: 'How I can help',
    lead: 'I build systems of the same calibre for clients. Pick the closest fit and read more.',
    more: 'Read more',
  },
} as const

const KEYS: Key[] = ['mvp', 'n8n', 'cost']

function Card({ k, lang }: { k: Key; lang: Lang }) {
  const c = SERVICE_COPY[lang][k]
  return (
    <Link
      href={serviceHref(k, lang)}
      className="group flex flex-col rounded-[14px] border border-border bg-white/[.015] p-7 transition-colors hover:border-border-hover hover:bg-white/[.03]"
    >
      <h3 className="text-xl font-semibold text-text-primary">{c.title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-text-secondary">{c.body}</p>
      <div className="mt-6 flex items-center justify-between gap-3 font-mono text-[12px] tracking-[.06em]">
        <span className="text-text-secondary">{c.meta}</span>
        <span className="text-text-primary transition-transform group-hover:translate-x-1">
          {SECTION[lang].more} →
        </span>
      </div>
    </Link>
  )
}

/** Homepage section linking the three service pages. */
export function ServicesSection({ lang }: { lang: Lang }) {
  const s = SECTION[lang]
  return (
    <section id="palvelut" className="border-t border-white/[.06] bg-bg-primary">
      <div className="mx-auto max-w-[1280px] px-[clamp(20px,5vw,56px)] py-[clamp(70px,10vh,120px)]">
        <p className="font-mono text-[12px] uppercase tracking-[.16em] text-text-secondary">{s.eyebrow}</p>
        <h2 className="mt-4 text-[clamp(30px,4.2vw,52px)] font-semibold leading-[1.05] tracking-[-.02em] text-text-primary">
          {s.title}
        </h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-text-secondary">{s.lead}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {KEYS.map((k) => (
            <Card key={k} k={k} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  )
}

/** In-article callout pointing to the service most related to the post. */
export function ServiceCallout({ k, lang }: { k: Key; lang: Lang }) {
  const c = SERVICE_COPY[lang][k]
  const label = lang === 'fi' ? 'Aiheeseen liittyvä palvelu' : 'Related service'
  return (
    <aside className="not-prose my-10 rounded-2xl border border-border bg-bg-secondary p-6">
      <p className="font-mono text-[11px] uppercase tracking-[.14em] text-text-secondary">{label}</p>
      <p className="mt-2 text-lg font-semibold text-text-primary">
        <Link href={serviceHref(k, lang)} className="underline-offset-4 hover:underline">
          {c.title} →
        </Link>
      </p>
      <p className="mt-1 text-sm text-text-secondary">
        {c.body} <span className="whitespace-nowrap">{c.meta}.</span>
      </p>
    </aside>
  )
}
