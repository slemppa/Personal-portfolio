import { Link, useParams } from 'react-router'
import { ArrowLeft, ArrowRight, ExternalLink, ImageIcon } from 'lucide-react'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { getCaseStudy } from '../lib/cases'
import { usePostHog } from '@posthog/react'

function isExternal(href: string) {
  return href.startsWith('http')
}

export default function CaseStudy() {
  const posthog = usePostHog()
  const { slug } = useParams()
  const study = slug ? getCaseStudy(slug) : undefined

  if (!study) {
    return (
      <>
        <Nav />
        <main className="max-w-3xl mx-auto px-8 pt-32 pb-24 min-h-screen">
          <Link to="/#cases" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Takaisin projekteihin
          </Link>
          <h1 className="mt-12 text-3xl font-bold text-text-primary">Projektia ei löytynyt</h1>
          <p className="mt-2 text-text-secondary">Tarkista osoite tai palaa projekteihin.</p>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="pt-32 pb-24 min-h-screen">
        {/* Hero */}
        <header className="max-w-4xl mx-auto px-8">
          <Link to="/#cases" className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors">
            <ArrowLeft className="w-4 h-4" /> Takaisin projekteihin
          </Link>

          <div className="mt-8 flex flex-wrap items-center gap-2 text-sm">
            <span className="text-accent font-medium">{study.client}</span>
            <span className="text-text-muted">·</span>
            <span className="text-text-secondary">{study.role}</span>
            <span className="text-text-muted">·</span>
            <span className="text-text-muted">{study.year}</span>
          </div>

          <h1 className="mt-3 text-4xl md:text-5xl font-bold tracking-tight text-text-primary">
            {study.title}
          </h1>
          <p className="mt-4 text-xl text-text-secondary leading-relaxed max-w-2xl">
            {study.tagline}
          </p>

          {study.links.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-3">
              {study.links.map((link) =>
                isExternal(link.href) ? (
                  <a
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog?.capture('case_study_external_link_clicked', { case_slug: slug, link_label: link.label })}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm font-medium text-text-primary hover:border-accent/50 hover:bg-bg-tertiary transition-all"
                  >
                    {link.label}
                    <ExternalLink className="w-3.5 h-3.5 text-text-muted" />
                  </a>
                ) : (
                  <Link
                    key={link.href}
                    to={link.href}
                    className="inline-flex items-center gap-2 px-5 py-2.5 bg-bg-secondary border border-border rounded-lg text-sm font-medium text-text-primary hover:border-accent/50 hover:bg-bg-tertiary transition-all"
                  >
                    {link.label}
                    <ArrowRight className="w-3.5 h-3.5 text-text-muted" />
                  </Link>
                )
              )}
            </div>
          )}
        </header>

        {/* Outcomes strip */}
        <section className="max-w-4xl mx-auto px-8 mt-14">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border">
            {study.outcomes.map((o) => (
              <div key={o.label} className="bg-bg-secondary p-6 text-center sm:text-left">
                <div className="text-2xl font-bold text-text-primary mb-1">{o.value}</div>
                <div className="text-sm text-text-muted">{o.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Problem */}
        <section className="max-w-3xl mx-auto px-8 mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-4">Ongelma</h2>
          <p className="text-lg text-text-secondary leading-relaxed">{study.problem}</p>
        </section>

        {/* Approach */}
        <section className="max-w-3xl mx-auto px-8 mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-8">Ratkaisu</h2>
          <div className="space-y-px">
            {study.approach.map((step, i) => (
              <div
                key={step.title}
                className="grid grid-cols-[auto_1fr] gap-5 p-6 bg-bg-secondary border border-border first:rounded-t-2xl last:rounded-b-2xl"
              >
                <span className="font-mono text-sm text-text-muted pt-0.5">0{i + 1}</span>
                <div>
                  <h3 className="text-base font-semibold text-text-primary mb-2">{step.title}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{step.body}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Gallery */}
        <section className="max-w-4xl mx-auto px-8 mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-8">Galleria</h2>
          {study.gallery.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {study.gallery.map((shot) => (
                <figure key={shot.src} className="overflow-hidden rounded-2xl border border-border bg-bg-secondary">
                  <img src={shot.src} alt={shot.caption} className="w-full aspect-video object-cover" />
                  <figcaption className="p-4 text-sm text-text-muted">{shot.caption}</figcaption>
                </figure>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="flex flex-col items-center justify-center aspect-video rounded-2xl border border-dashed border-border bg-bg-secondary/50 text-text-muted"
                >
                  <ImageIcon className="w-6 h-6 mb-2 opacity-50" />
                  <span className="text-sm">Kuva tulossa</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Highlights */}
        <section className="max-w-3xl mx-auto px-8 mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-8">Mitä mukana</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {study.highlights.map((h) => (
              <div key={h} className="flex items-start gap-3 p-4 bg-bg-secondary border border-border rounded-xl">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span className="text-sm text-text-secondary leading-relaxed">{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Stack */}
        <section className="max-w-3xl mx-auto px-8 mt-20">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-accent mb-8">Stack</h2>
          <div className="space-y-5">
            {study.stack.map((group) => (
              <div key={group.group} className="flex flex-col sm:flex-row sm:items-center gap-3">
                <span className="text-xs font-mono uppercase tracking-wider text-text-muted w-40 shrink-0">
                  {group.group}
                </span>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="px-3 py-1.5 rounded-lg text-sm border border-border bg-bg-tertiary text-text-secondary">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="max-w-3xl mx-auto px-8 mt-24">
          <div className="surface-card rounded-2xl p-8 md:p-10 text-center">
            <h2 className="text-2xl font-semibold text-text-primary mb-3">Rakennetaanko sinulle vastaava?</h2>
            <p className="text-text-secondary mb-6 max-w-lg mx-auto">
              Kerro projektistasi — katsotaan miten sama koneisto-ajattelu ratkaisee sinun ongelmasi.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="mailto:sami@rascalai.fi"
                onClick={() => posthog?.capture('case_study_contact_clicked', { case_slug: slug })}
                className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Ota yhteyttä <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <Link
                to="/#cases"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-tertiary border border-border text-text-primary font-semibold rounded-xl hover:border-border-hover transition-colors"
              >
                Muut projektit
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
