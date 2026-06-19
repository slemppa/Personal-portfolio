import { useEffect, useRef } from 'react'
import { usePostHog } from '@posthog/react'
import { ArrowRight } from 'lucide-react'
import HeroCanvas from './HeroCanvas'

const metrics = [
  { value: '50+', label: 'Tuotantoautomaatiota' },
  { value: '8–10h', label: 'Aikasäästö / asiakas / vko' },
  { value: '11v', label: 'Yrittäjäkokemus' }
]

const tech = ['n8n', 'Supabase', 'React', 'Voice AI', 'RAG', 'Multi-tenant']

export default function Hero() {
  const posthog = usePostHog()
  const portraitRef = useRef<HTMLDivElement>(null)

  // Subtle cursor-driven 3D tilt + parallax on the portrait. Pointer-only and
  // disabled under reduced-motion, so it never fights touch scroll or a11y.
  useEffect(() => {
    const el = portraitRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    let raf = 0
    let tx = 0
    let ty = 0
    let cx = 0
    let cy = 0

    function onMove(e: PointerEvent) {
      tx = (e.clientX / window.innerWidth) * 2 - 1
      ty = (e.clientY / window.innerHeight) * 2 - 1
      if (!raf) raf = requestAnimationFrame(apply)
    }
    function apply() {
      raf = 0
      cx += (tx - cx) * 0.08
      cy += (ty - cy) * 0.08
      el!.style.transform =
        `perspective(1200px) rotateY(${(-cx * 5).toFixed(2)}deg) rotateX(${(cy * 4).toFixed(2)}deg) translateX(${(cx * -14).toFixed(1)}px) scale(1.03)`
      if (Math.abs(tx - cx) > 0.001 || Math.abs(ty - cy) > 0.001) {
        raf = requestAnimationFrame(apply)
      }
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section className="relative overflow-hidden">
      {/* Aurora bloom + dotted grid, layered behind everything */}
      <div className="absolute inset-0 aurora" aria-hidden="true" />
      {/* Interactive 3D neural-network field — the showpiece on first paint */}
      <HeroCanvas />
      <div className="absolute inset-0 grid-texture" aria-hidden="true" />
      {/* Fade the texture into the page below */}
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-primary" aria-hidden="true" />

      {/* Portfolio image — softly masked into the background on the right */}
      <div
        ref={portraitRef}
        className="absolute right-0 top-0 bottom-0 w-[42%] hidden lg:block animate-fade-in-up animation-delay-300 will-change-transform"
        style={{ transformStyle: 'preserve-3d' }}
      >
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

            <h1 className="display text-[2.9rem] leading-[1.0] md:text-7xl md:leading-[0.98] mb-6 animate-fade-in-up animation-delay-200">
              <span className="text-text-primary">Automaatio on</span>
              <br />
              <span className="text-text-primary">uusi lukutaito.</span>
              <br />
              <span className="text-gradient-accent">Rakennan sillä joka päivä.</span>
            </h1>

            <p className="text-base text-text-secondary mb-3 animate-fade-in-up animation-delay-300">
              Sami Kiias · CTO @ Rascal AI · Founder @ Mak8r.fi
            </p>

            <p className="text-lg text-text-secondary mb-10 max-w-xl leading-relaxed animate-fade-in-up animation-delay-300">
              Autan pk- ja kasvuyrityksiä korvaamaan käsityön AI-järjestelmillä, jotka pyörivät
              oikeilla asiakkailla tuotannossa — multi-tenant SaaS, n8n-automaatiot ja Voice AI.
              11 vuotta yrittäjyyttä: puhun sekä bisneksen että koodin kieltä.
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
                href="#manifesto"
                onClick={() => posthog?.capture('hero_cta_clicked', { cta_label: 'Lue manifesti' })}
                className="px-5 py-3 bg-bg-secondary/60 backdrop-blur-sm border border-border text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary transition-all"
              >
                Lue manifesti
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
