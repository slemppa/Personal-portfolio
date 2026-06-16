import { usePostHog } from '@posthog/react'
import { ArrowRight } from 'lucide-react'

const metrics = [
  { value: '50+', label: 'Tuotantoautomaatiota' },
  { value: '8–10h', label: 'Aikasäästö / asiakas / vko' },
  { value: '11v', label: 'Yrittäjäkokemus' }
]

const tech = ['n8n', 'Supabase', 'React', 'Voice AI', 'RAG', 'Multi-tenant']

export default function Hero() {
  const posthog = usePostHog()

  return (
    <section className="relative overflow-hidden">
      {/* Aurora bloom + dotted grid, layered behind everything */}
      <div className="absolute inset-0 aurora" aria-hidden="true" />
      <div className="absolute inset-0 grid-texture" aria-hidden="true" />
      {/* Fade the texture into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-primary" aria-hidden="true" />

      {/* Portfolio image — softly masked into the background on the right */}
      <div className="absolute right-0 top-0 bottom-0 w-[42%] hidden lg:block animate-fade-in-up animation-delay-300">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary z-10" />
        <img
          src="/portfolio-hero-fix.png"
          alt="Sami Kiias"
          className="w-full h-full object-cover object-center opacity-90"
        />
      </div>

      {/* Content */}
      <div className="relative">
        <div className="w-full max-w-6xl mx-auto px-6 sm:px-8 pt-40 pb-28 lg:pt-48 lg:pb-36">
          <div className="max-w-2xl">
            {/* Status pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-8 rounded-full border border-border bg-bg-secondary/60 backdrop-blur-sm animate-fade-in-up animation-delay-100">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400/70 animate-ping" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="text-text-secondary text-[13px] font-medium">Avoinna uusille projekteille</span>
            </div>

            <h1 className="text-[2.6rem] leading-[1.05] md:text-6xl md:leading-[1.04] font-semibold tracking-tight mb-6 animate-fade-in-up animation-delay-200">
              <span className="text-text-primary">Rakennan </span>
              <span className="text-gradient-accent">AI-järjestelmiä</span>
              <br />
              <span className="text-text-primary">jotka säästävät aikaa</span>
            </h1>

            <p className="text-base text-text-secondary mb-3 animate-fade-in-up animation-delay-300">
              CTO @ Rascal AI · Founder @ Mak8r.fi
            </p>

            <p className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed animate-fade-in-up animation-delay-300">
              Rakennan tuotantokäytössä olevia multi-tenant SaaS-järjestelmiä, n8n-automaatioita
              ja Voice AI -integraatioita. 11 vuotta yrittäjyyttä — ymmärrän sekä bisneksen että koodin.
            </p>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-3 mb-12 animate-fade-in-up animation-delay-400">
              <a
                href="#contact"
                onClick={() => posthog?.capture('hero_cta_clicked', { cta_label: 'Keskustellaan projektista' })}
                className="group inline-flex items-center gap-2 px-5 py-3 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                Keskustellaan projektista
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
              <a
                href="#cases"
                onClick={() => posthog?.capture('hero_cta_clicked', { cta_label: 'Katso projektit' })}
                className="px-5 py-3 bg-bg-secondary/60 backdrop-blur-sm border border-border text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary transition-all"
              >
                Katso projektit
              </a>
            </div>

            {/* Metrics — hairline-separated, not boxed */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-4 mb-10 animate-fade-in-up animation-delay-400">
              {metrics.map((m, i) => (
                <div key={m.label} className="flex items-center gap-8">
                  {i > 0 && <span className="hidden sm:block w-px h-9 bg-border" aria-hidden="true" />}
                  <div>
                    <div className="text-2xl font-semibold tracking-tight text-text-primary tabular-nums">{m.value}</div>
                    <div className="text-[13px] text-text-muted">{m.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 animate-fade-in-up animation-delay-500">
              {tech.map((t) => (
                <span
                  key={t}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-text-muted border border-border bg-bg-secondary/40 hover:border-border-hover hover:text-text-secondary transition-colors cursor-default"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
