import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router'
import { Check, Copy, FileText, Printer, Sparkles } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { formatDate } from '../lib/format'
import { applyHead } from '../lib/head'
import { decodeOfferToken, offerTokenFromLocation, type Offer } from '../lib/offer'

// Bilingual UI labels for the offer page. Content comes from the offer itself;
// only the chrome (section headings, buttons) is localised here.
const UI = {
  fi: {
    deliverables: 'Työn sisältö',
    timeline: 'Aikataulu',
    investment: 'Investointi',
    why: 'Miksi minä',
    next: 'Seuraavat askeleet',
    valid: 'Voimassa',
    total: 'Yhteensä',
    copy: 'Kopioi linkki',
    copied: 'Kopioitu!',
    print: 'Tallenna PDF',
    aiBadge: 'Räätälöity tarjous',
    notFoundTitle: 'Tarjousta ei löytynyt',
    notFoundBody: 'Linkki on virheellinen tai vanhentunut. Pyydä lähettäjältä uusi linkki.',
    home: '← Etusivulle',
  },
  en: {
    deliverables: 'Scope of work',
    timeline: 'Timeline',
    investment: 'Investment',
    why: 'Why me',
    next: 'Next steps',
    valid: 'Valid until',
    total: 'Total',
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
            <p>{offer.understanding}</p>
            <p>{offer.approach}</p>
          </div>

          <Section title={t.deliverables}>
            <div className="grid gap-3 sm:grid-cols-2">
              {offer.deliverables.map((d, i) => (
                <div key={i} className="rounded-xl border border-border bg-bg-secondary p-4">
                  <h3 className="font-semibold text-text-primary">{d.title}</h3>
                  <p className="mt-1 text-sm text-text-secondary">{d.description}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title={t.timeline}>
            <p className="text-text-secondary">{offer.timeline}</p>
          </Section>

          <Section title={t.investment}>
            <p className="text-text-secondary">{offer.investment.summary}</p>
            <ul className="mt-4 divide-y divide-border overflow-hidden rounded-xl border border-border">
              {offer.investment.items.map((it, i) => (
                <li key={i} className="flex items-start justify-between gap-4 bg-bg-secondary px-4 py-3">
                  <div>
                    <p className="font-medium text-text-primary">{it.title}</p>
                    <p className="text-sm text-text-muted">{it.description}</p>
                  </div>
                  {it.price && <span className="shrink-0 text-sm font-medium text-text-secondary">{it.price}</span>}
                </li>
              ))}
            </ul>
            {offer.investment.total && (
              <p className="mt-3 text-right font-semibold text-text-primary">
                {t.total}: {offer.investment.total}
              </p>
            )}
            {offer.investment.note && <p className="mt-3 text-xs text-text-muted">{offer.investment.note}</p>}
          </Section>

          <Section title={t.why}>
            <ul className="space-y-2">
              {offer.whyMe.map((w, i) => (
                <li key={i} className="flex gap-2.5 text-text-secondary">
                  <Check size={18} className="mt-0.5 shrink-0 text-accent" />
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Section>

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
            <p className="flex items-start gap-2.5 text-lg text-text-primary">
              <FileText size={20} className="mt-1 shrink-0 text-accent" />
              <span>{offer.cta}</span>
            </p>
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
