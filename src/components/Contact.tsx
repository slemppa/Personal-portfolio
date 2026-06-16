import { Mail, Linkedin, Youtube, Github, ArrowRight, ArrowUpRight } from 'lucide-react'
import { usePostHog } from '@posthog/react'
import Reveal from './Reveal'

const links = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/samikiias', description: 'Verkostoidu' },
  { icon: Youtube, label: 'YouTube', href: 'https://www.youtube.com/@samikiias?sub_confirmation=1', description: 'Katso sisältöä' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/slemppa', description: 'Tutustu koodiin' }
]

const companies = [
  {
    name: 'Rascal AI',
    role: 'CTO',
    description: 'AI-pohjaiset myynti- ja asiakaspalveluautomaatiot pk-yrityksille',
    href: 'https://rascalai.fi'
  },
  {
    name: 'Superhuman',
    role: 'Solo Developer',
    description: 'Henkilökohtainen iOS-valmennussovellus — HealthKit-data, periodisoitu treeniohjelma ja AI-valmentaja',
    href: 'https://superhuman-ios.vercel.app/'
  },
  {
    name: 'Mak8r.fi',
    role: 'Founder',
    description: 'AI-automaatiokonsultointia ja räätälöityjä järjestelmiä',
    href: 'https://mak8r.fi'
  }
]

export default function Contact() {
  const posthog = usePostHog()

  return (
    <section id="contact" className="py-24 px-6 sm:px-8 scroll-mt-20">
      {/* CTA Banner */}
      <div className="max-w-4xl mx-auto mb-20">
        <div className="relative overflow-hidden rounded-3xl surface-card px-8 py-14 md:px-14 md:py-20 text-center">
          {/* Aurora wash behind the CTA */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent-line to-transparent" aria-hidden="true" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[60%] h-48 aurora blur-2xl opacity-70" aria-hidden="true" />

          <div className="relative">
            <span className="eyebrow text-accent">Ota yhteyttä</span>
            <h2 className="mt-4 text-3xl md:text-[2.75rem] md:leading-[1.08] font-semibold tracking-tight">
              <span className="text-text-primary">Rakennetaan jotain </span>
              <span className="text-gradient-accent">merkittävää</span>
            </h2>

            <p className="mt-4 text-text-secondary text-lg max-w-xl mx-auto leading-relaxed">
              Kerro projektistasi ja katsotaan miten AI-automaatiot voivat säästää aikaasi ja tehostaa liiketoimintaasi.
            </p>

            <div className="mt-9 flex justify-center">
              <a
                href="mailto:sami@rascalai.fi"
                onClick={() => posthog?.capture('contact_email_clicked')}
                className="group inline-flex items-center gap-3 px-6 py-3.5 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Mail className="w-5 h-5" />
                sami@rascalai.fi
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-10">
          {/* Social links */}
          <div>
            <span className="eyebrow">Seuraa ja verkostoidu</span>
            <div className="mt-5 space-y-2">
              {links.map((link, i) => (
                <Reveal key={link.label} delay={i * 50}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog?.capture('social_link_clicked', { platform: link.label })}
                    className="group flex items-center gap-4 p-4 surface-card rounded-xl hover:border-border-hover transition-colors"
                  >
                    <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center group-hover:border-accent-line transition-colors">
                      <link.icon className="w-4 h-4 text-text-secondary group-hover:text-accent transition-colors" />
                    </div>
                    <div className="flex-1">
                      <span className="font-medium text-text-primary">{link.label}</span>
                      <p className="text-[13px] text-text-muted">{link.description}</p>
                    </div>
                    <ArrowUpRight className="w-4 h-4 text-text-muted group-hover:text-accent transition-colors" />
                  </a>
                </Reveal>
              ))}
            </div>
          </div>

          {/* Companies */}
          <div>
            <span className="eyebrow">Yritykset</span>
            <div className="mt-5 space-y-2">
              {companies.map((company, i) => (
                <Reveal key={company.name} delay={i * 50}>
                  <a
                    href={company.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => posthog?.capture('company_link_clicked', { company_name: company.name })}
                    className="group block p-5 surface-card rounded-xl hover:border-border-hover transition-colors"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <h4 className="text-base font-semibold text-text-primary tracking-tight group-hover:text-accent transition-colors">
                        {company.name}
                      </h4>
                      <span className="px-2 py-0.5 rounded-md border border-border bg-bg-tertiary/60 text-[11px] text-text-muted font-medium">
                        {company.role}
                      </span>
                      <ArrowUpRight className="w-4 h-4 ml-auto text-text-muted group-hover:text-accent transition-colors" />
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{company.description}</p>
                  </a>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
