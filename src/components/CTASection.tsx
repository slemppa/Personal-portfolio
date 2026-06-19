import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { Mail, ArrowRight, Linkedin } from 'lucide-react'
import { usePostHog } from '@posthog/react'
import { useSpotlight } from '../hooks/useSpotlight'

type CTASectionProps = {
  /** Where this CTA lives, e.g. "blog_list" or "blog_post" — used for analytics. */
  source: string
  eyebrow?: string
  title?: ReactNode
  description?: string
  /** Secondary, lower-intent path. Internal route or hash link. */
  secondary?: { label: string; to: string }
}

/**
 * A conversion block offering two paths for different buying stages:
 * a high-intent primary action (email) and a lower-intent secondary
 * action (browse projects), plus a tertiary "just following" link
 * (LinkedIn). Placed at the end of content pages so the ask comes after
 * trust is built, not at the door.
 */
export default function CTASection({
  source,
  eyebrow = 'Otetaan seuraava askel',
  title,
  description,
  secondary = { label: 'Katso projektit', to: '/#cases' }
}: CTASectionProps) {
  const posthog = usePostHog()
  const cardRef = useSpotlight<HTMLDivElement>()

  return (
    <section className="mt-20">
      <div ref={cardRef} className="spotlight relative overflow-hidden rounded-3xl surface-card px-8 py-12 md:px-12 md:py-14 text-center">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent" aria-hidden="true" />
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-48 aurora blur-2xl opacity-70" aria-hidden="true" />

        <div className="relative">
          <span className="eyebrow text-accent">{eyebrow}</span>
          <h2 className="mt-4 text-2xl md:text-3xl font-semibold tracking-tight text-text-primary">
            {title ?? (
              <>
                Onko sinulla <span className="text-gradient-accent">vastaava ongelma</span> ratkaistavana?
              </>
            )}
          </h2>
          <p className="mt-3 text-text-secondary max-w-lg mx-auto leading-relaxed">
            {description ??
              'Kerro lyhyesti tilanteesta — vastaan itse ja katsotaan yhdessä, kannattaako se automatisoida.'}
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="mailto:sami@rascalai.fi"
              onClick={() => posthog?.capture('cta_email_clicked', { source })}
              className="group inline-flex items-center justify-center gap-2 px-6 py-3 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4" />
              Ota yhteyttä
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <Link
              to={secondary.to}
              onClick={() => posthog?.capture('cta_secondary_clicked', { source, label: secondary.label })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-bg-tertiary border border-border text-text-primary font-semibold rounded-xl hover:border-border-hover transition-colors"
            >
              {secondary.label}
            </Link>
          </div>

          <p className="mt-5 text-[13px] text-text-muted">
            Tai seuraa matkaa{' '}
            <a
              href="https://linkedin.com/in/samikiias"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog?.capture('cta_linkedin_clicked', { source })}
              className="inline-flex items-center gap-1 text-text-secondary hover:text-accent transition-colors underline-offset-4 hover:underline"
            >
              <Linkedin className="w-3.5 h-3.5" />
              LinkedInissä
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}
