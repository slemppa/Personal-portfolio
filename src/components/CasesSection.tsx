import { Link } from 'react-router'
import { getCases, type CaseStudy } from '../lib/cases'
import { casePath } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'

const SECTION_COPY = {
  fi: {
    eyebrow: '01 — Projektit',
    title: 'Tuotantojärjestelmiä,\nei demoja',
    lead: 'Kuusi rakennettua tuotetta — kolme tuotannossa maksavilla asiakkailla. Klikkaa auki: jokaisessa on todennettavat luvut ja tekninen tarina.',
    featured: 'Featured',
  },
  en: {
    eyebrow: '01 — Projects',
    title: 'Production systems,\nnot demos',
    lead: 'Six products built — three in production with paying customers. Click through: each has verified numbers and a technical story.',
    featured: 'Featured',
  },
} as const

function Card({ c, lang, featured }: { c: CaseStudy; lang: Lang; featured: string }) {
  return (
    <Link
      to={casePath(lang, c.slug)}
      className="group block rounded-[14px] border border-border bg-white/[.015] p-7 transition-colors hover:border-border-hover hover:bg-white/[.03]"
    >
      <div className="flex items-center justify-between gap-3">
        <span className="font-mono text-[11px] uppercase tracking-[.14em] text-text-muted">
          {c.client} · {c.role}
        </span>
        {c.featured && (
          <span className="rounded-full border border-border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[.14em] text-text-secondary">
            {featured}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-semibold text-text-primary">{c.title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-text-secondary">{c.summary}</p>
      <div className="mt-5 flex flex-wrap gap-1.5">
        {c.stack.flatMap((g) => g.items).slice(0, 5).map((item) => (
          <span key={item} className="rounded-md border border-border px-2 py-1 font-mono text-[11px] text-text-muted">
            {item}
          </span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-3 border-t border-border pt-4">
        {c.outcomes.map((o) => (
          <div key={o.label}>
            <div className="font-mono text-sm font-semibold text-text-primary">{o.value}</div>
            <div className="mt-0.5 text-[11px] leading-tight text-text-muted">{o.label}</div>
          </div>
        ))}
      </div>
    </Link>
  )
}

export default function CasesSection({ lang }: { lang: Lang }) {
  const t = SECTION_COPY[lang]
  const cases = getCases(lang)
  return (
    <section id="projektit" className="px-[clamp(20px,5vw,56px)] py-[90px]">
      <div className="mx-auto max-w-[1280px]">
        <div className="font-mono text-xs uppercase tracking-[.2em] text-text-muted">{t.eyebrow}</div>
        <h2 className="mt-3 whitespace-pre-line text-[clamp(28px,4vw,44px)] font-semibold leading-tight text-text-primary">
          {t.title}
        </h2>
        <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-text-secondary">{t.lead}</p>
        <div className="mt-10 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {cases.map((c) => (
            <Card key={c.slug} c={c} lang={lang} featured={t.featured} />
          ))}
        </div>
      </div>
    </section>
  )
}
