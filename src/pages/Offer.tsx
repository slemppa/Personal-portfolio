import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Check, Copy, Printer, Sparkles } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { formatDate } from '../lib/format'
import { applyHead } from '../lib/head'
import { decodeOfferToken, offerTokenFromLocation, type Offer } from '../lib/offer'

// Bilingual UI labels. Content comes from the offer itself; only the chrome
// (section headings, buttons) is localised here.
const UI = {
  fi: {
    situation: 'Tilanne',
    approach: 'Ehdotus',
    build: 'Miten se rakennetaan',
    choice: 'Valinta',
    why: 'Miksi',
    alt: 'Kevyempi vaihtoehto',
    investment: 'Investointi',
    payment: 'Maksuerät',
    total: 'Yhteensä',
    scope: 'Rajaukset',
    ownership: 'Omistajuus',
    next: 'Seuraavat askeleet',
    valid: 'Voimassa',
    duration: 'Kesto',
    price: 'Investointi',
    copy: 'Kopioi linkki',
    copied: 'Kopioitu!',
    print: 'Tallenna PDF',
    aiBadge: 'Räätälöity ehdotus',
    notFoundTitle: 'Tarjousta ei löytynyt',
    notFoundBody: 'Linkki on virheellinen tai vanhentunut. Pyydä lähettäjältä uusi linkki.',
    home: '← Etusivulle',
  },
  en: {
    situation: 'Situation',
    approach: 'Proposal',
    build: "How it's built",
    choice: 'Choice',
    why: 'Why',
    alt: 'Lighter option',
    investment: 'Investment',
    payment: 'Payment',
    total: 'Total',
    scope: 'Scope',
    ownership: 'Ownership',
    next: 'Next steps',
    valid: 'Valid until',
    duration: 'Duration',
    price: 'Investment',
    copy: 'Copy link',
    copied: 'Copied!',
    print: 'Save as PDF',
    aiBadge: 'Tailored proposal',
    notFoundTitle: 'Offer not found',
    notFoundBody: 'This link is invalid or has expired. Ask the sender for a fresh link.',
    home: '← Back home',
  },
} as const

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-12">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  )
}

export default function OfferPage() {
  const offer = useMemo<Offer | null>(() => {
    if (typeof window === 'undefined') return null
    const token = offerTokenFromLocation(window.location)
    return token ? decodeOfferToken(token) : null
  }, [])

  const lang = offer?.language ?? 'fi'
  const t = UI[lang]
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    applyHead({
      lang,
      title: offer ? `${offer.title} · Sami Kiias` : `${UI[lang].notFoundTitle} · Sami Kiias`,
      description: offer?.summary,
      canonical: '/tarjous',
      alternates: [],
    })
  }, [lang, offer])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard blocked (e.g. insecure context) — silently ignore.
    }
  }

  if (!offer) {
    return (
      <>
        <Nav />
        <main className="mx-auto min-h-screen max-w-3xl px-8 pb-24 pt-32">
          <h1 className="text-3xl font-bold text-text-primary">{t.notFoundTitle}</h1>
          <p className="mt-3 text-text-secondary">{t.notFoundBody}</p>
          <Link to="/" className="mt-8 inline-block text-sm text-accent hover:text-accent-hover">
            {t.home}
          </Link>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-3xl px-8 pb-24 pt-32">
        {/* Action bar — hidden when printing/saving to PDF. */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <Link to="/" className="text-sm text-text-secondary transition-colors hover:text-text-primary">
            {t.home}
          </Link>
          <div className="flex items-center gap-2">
            <button
              onClick={copyLink}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              {copied ? t.copied : t.copy}
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-text-secondary transition-colors hover:border-border-hover hover:text-text-primary"
            >
              <Printer size={15} />
              {t.print}
            </button>
          </div>
        </div>

        <article>
          <header className="border-b border-border pb-8">
            {offer.aiGenerated && (
              <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-accent-hover">
                <Sparkles size={13} />
                {t.aiBadge}
              </span>
            )}
            <h1 className="text-4xl font-bold leading-tight text-text-primary">{offer.title}</h1>
            {(offer.recipient.company || offer.recipient.name) && (
              <p className="mt-3 text-text-secondary">
                {[offer.recipient.name, offer.recipient.company].filter(Boolean).join(' · ')}
              </p>
            )}
          </header>

          <div className="mt-8 space-y-5 text-lg leading-relaxed text-text-secondary">
            <p className="text-text-primary">{offer.greeting}</p>
            <p>{offer.summary}</p>
          </div>

          {offer.situation.length > 0 && (
            <Section title={t.situation}>
              <div className="space-y-4">
                {offer.situation.map((s, i) => (
                  <div key={i}>
                    <h3 className="font-semibold text-text-primary">{s.title}</h3>
                    <p className="mt-1 text-text-secondary">{s.body}</p>
                  </div>
                ))}
              </div>
            </Section>
          )}

          <Section title={t.approach}>
            <p className="leading-relaxed text-text-secondary">{offer.approach}</p>
            <div className="mt-6 space-y-4">
              {offer.phases.map((p, i) => (
                <div key={i} className="rounded-2xl border border-border bg-bg-secondary p-5">
                  <h3 className="text-lg font-semibold text-text-primary">{p.name}</h3>
                  {p.goal && <p className="mt-1 text-sm text-text-secondary">{p.goal}</p>}
                  {p.includes.length > 0 && (
                    <ul className="mt-4 space-y-1.5">
                      {p.includes.map((it, j) => (
                        <li key={j} className="flex gap-2.5 text-sm text-text-secondary">
                          <Check size={16} className="mt-0.5 shrink-0 text-accent" />
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {p.outcome && <p className="mt-4 text-sm italic text-text-muted">{p.outcome}</p>}
                  {(p.duration || p.price) && (
                    <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1 border-t border-border pt-3 text-xs text-text-muted">
                      {p.duration && (
                        <span>
                          <span className="uppercase tracking-wide">{t.duration}:</span> {p.duration}
                        </span>
                      )}
                      {p.price && (
                        <span>
                          <span className="uppercase tracking-wide">{t.price}:</span> {p.price}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Section>

          {offer.tradeoffs.length > 0 && (
            <Section title={t.build}>
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[36rem] border-collapse text-sm">
                  <thead>
                    <tr className="bg-bg-tertiary text-left text-xs uppercase tracking-wide text-text-muted">
                      <th className="px-4 py-3 font-semibold">{t.choice}</th>
                      <th className="px-4 py-3 font-semibold">{t.why}</th>
                      <th className="px-4 py-3 font-semibold">{t.alt}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offer.tradeoffs.map((tr, i) => (
                      <tr key={i} className="border-t border-border align-top">
                        <td className="px-4 py-3 font-medium text-text-primary">{tr.choice}</td>
                        <td className="px-4 py-3 text-text-secondary">{tr.why}</td>
                        <td className="px-4 py-3 text-text-muted">{tr.alternative ?? '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          <Section title={t.investment}>
            <p className="text-text-secondary">{offer.investment.summary}</p>
            {offer.investment.total && (
              <p className="mt-3 text-lg font-semibold text-text-primary">
                {t.total}: {offer.investment.total}
              </p>
            )}
            {offer.investment.paymentTerms && (
              <p className="mt-2 text-sm text-text-secondary">
                <span className="text-text-muted">{t.payment}:</span> {offer.investment.paymentTerms}
              </p>
            )}
            {offer.investment.note && <p className="mt-3 text-xs text-text-muted">{offer.investment.note}</p>}
          </Section>

          {(offer.scope.excludes.length > 0 || offer.scope.ownership) && (
            <Section title={t.scope}>
              {offer.scope.excludes.length > 0 && (
                <ul className="space-y-1.5">
                  {offer.scope.excludes.map((e, i) => (
                    <li key={i} className="flex gap-2.5 text-sm text-text-secondary">
                      <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-text-muted" />
                      <span>{e}</span>
                    </li>
                  ))}
                </ul>
              )}
              {offer.scope.ownership && (
                <p className="mt-4 text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">{t.ownership}. </span>
                  {offer.scope.ownership}
                </p>
              )}
            </Section>
          )}

          <Section title={t.next}>
            <ol className="space-y-2">
              {offer.nextSteps.map((s, i) => (
                <li key={i} className="flex gap-3 text-text-secondary">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent-hover">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{s}</span>
                </li>
              ))}
            </ol>
          </Section>

          <div className="mt-12 rounded-2xl border border-border bg-bg-secondary p-6">
            <p className="text-lg text-text-primary">{offer.cta}</p>
            <div className="mt-5 border-t border-border pt-5 text-sm text-text-secondary">
              <p className="font-medium text-text-primary">{offer.sender.name}</p>
              {offer.sender.title && <p>{offer.sender.title}</p>}
              {offer.sender.email && (
                <a href={`mailto:${offer.sender.email}`} className="text-accent hover:text-accent-hover">
                  {offer.sender.email}
                </a>
              )}
            </div>
          </div>

          <p className="mt-6 text-xs text-text-muted">
            {t.valid}: {formatDate(offer.validUntil, lang)}
          </p>
        </article>
      </main>
      <Footer />
    </>
  )
}
