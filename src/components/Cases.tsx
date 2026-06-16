import { Sparkles, Phone, Clock, Users, Activity, Brain, Wallet, Shield, ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { usePostHog } from '@posthog/react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const cases = [
  {
    icon: Sparkles,
    slug: 'rascal-ai',
    title: 'Rascal AI',
    client: 'Rascal Company',
    role: 'CTO & Founder',
    description: 'Multi-tenant SaaS-alusta joka automatisoi pk-yritysten markkinoinnin. Somepostaukset, uutiskirjeet ja sisällöntuotanto yhdellä klikkauksella.',
    results: [
      { icon: Clock, value: '8-10h', label: 'Säästöä viikossa' },
      { icon: Users, value: '50+', label: 'Aktiivista käyttäjää' }
    ],
    tech: ['React', 'Supabase', 'OpenAI', 'n8n', 'RLS'],
    featured: true
  },
  {
    icon: Users,
    slug: 'rascal-crm',
    title: 'Rascal CRM',
    client: 'Rascal Company',
    role: 'CTO & Founder',
    description: 'Rascal-ekosysteemin asiakkuudenhallinta ja myyntiputki. Liidit, kontaktit ja kampanjat yhdessä — mukana AI-puhelut, viestiautomaatio ja GDPR-yhteensopiva opt-out-hallinta.',
    results: [
      { icon: Phone, value: 'Voice AI', label: 'Puhelukampanjat' },
      { icon: Users, value: 'Multi-tenant', label: 'Org-eristetty data' }
    ],
    tech: ['React', 'Supabase', 'VAPI', 'n8n', 'RLS'],
    featured: true
  },
  {
    icon: Activity,
    slug: 'superhuman',
    title: 'Superhuman',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    description: 'Henkilökohtainen iOS-valmennussovellus. Yhdistää HealthKit-datan, periodisoidun treeniohjelman ja AI-valmentajan, joka muistaa ja perustelee neuvonsa omalla datalla.',
    results: [
      { icon: Activity, value: 'iOS', label: 'HealthKit-data' },
      { icon: Brain, value: 'AI-valmentaja', label: 'pgvector-muisti' }
    ],
    tech: ['React Native', 'Supabase', 'Deno', 'pgvector', 'HealthKit'],
    featured: false
  },
  {
    icon: Wallet,
    slug: 'pesa',
    title: 'Pesä',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    description: 'Local-first, joka tuo YNAB-metodologian suomalaiseen arkeen. Palkkavetoinen työnkulku, täysi tavoite-, tili- ja tapahtumahallinta sekä kaksikielinen käyttöliittymä — yksityisyys edellä, data pysyy laitteella.',
    results: [
      { icon: Wallet, value: 'Kirjekuoret', label: 'YNAB-metodi' },
      { icon: Shield, value: 'Local-first', label: 'Data laitteella' }
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Drizzle', 'SQLite'],
    featured: false
  }
]

export default function Cases() {
  const posthog = usePostHog()

  return (
    <section id="cases" className="py-24 px-6 sm:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeading
        index="01"
        eyebrow="Projektit"
        title="Tuotantojärjestelmiä, ei demoja"
        description="Todistettuja tuloksia järjestelmistä, jotka pyörivät oikeilla asiakkailla joka päivä."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-12">
        {cases.map((item, i) => (
          <Reveal key={item.title} delay={(i % 2) * 80}>
            <Link
              to={`/projektit/${item.slug}`}
              onClick={() => posthog?.capture('case_study_clicked', { case_slug: item.slug, case_title: item.title, featured: item.featured })}
              className="group relative flex h-full flex-col surface-card rounded-2xl p-7 transition-all duration-300 hover:border-border-hover hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between mb-6">
                <div className="w-11 h-11 rounded-xl bg-bg-tertiary border border-border flex items-center justify-center group-hover:border-accent-line transition-colors">
                  <item.icon className="w-5 h-5 text-accent" />
                </div>
                {item.featured && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-accent-line bg-accent-soft text-[11px] font-medium text-accent">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    Featured
                  </span>
                )}
              </div>

              <div className="mb-3">
                <h3 className="text-lg font-semibold text-text-primary tracking-tight">{item.title}</h3>
                <div className="flex items-center gap-2 text-[13px] mt-1">
                  <span className="text-accent">{item.client}</span>
                  <span className="text-text-muted">·</span>
                  <span className="text-text-muted">{item.role}</span>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-6 leading-relaxed">{item.description}</p>

              {/* Results — hairline split, quiet */}
              <div className="grid grid-cols-2 gap-px bg-border rounded-xl overflow-hidden border border-border mb-6">
                {item.results.map((result, idx) => (
                  <div key={idx} className="flex items-center gap-3 bg-bg-tertiary/60 p-4">
                    <result.icon className="w-4 h-4 text-accent shrink-0" />
                    <div className="min-w-0">
                      <div className="text-sm font-semibold text-text-primary truncate">{result.value}</div>
                      <div className="text-[11px] text-text-muted truncate">{result.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-1.5 mb-6">
                {item.tech.map((t) => (
                  <span key={t} className="px-2.5 py-1 rounded-md text-[11px] font-medium text-text-muted border border-border bg-bg-tertiary/40 group-hover:text-text-secondary transition-colors">
                    {t}
                  </span>
                ))}
              </div>

              <div className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary group-hover:text-accent transition-colors">
                Lue case study
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
