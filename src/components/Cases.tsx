import { Sparkles, Phone, Clock, Users, Activity, Brain, Wallet, Shield } from 'lucide-react'

const cases = [
  {
    icon: Sparkles,
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
    title: 'Superhuman',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    description: 'Henkilökohtainen iOS-valmennussovellus. Yhdistää HealthKit-datan, periodisoidun treeniohjelman ja AI-valmentajan, joka muistaa ja perustelee neuvonsa omalla datalla.',
    results: [
      { icon: Activity, value: 'iOS', label: 'HealthKit-data' },
      { icon: Brain, value: 'AI-valmentaja', label: 'pgvector-muisti' }
    ],
    tech: ['SwiftUI', 'Supabase', 'Deno', 'pgvector', 'HealthKit'],
    featured: false
  },
  {
    icon: Wallet,
    title: 'Pesä',
    client: 'Henkilökohtainen projekti',
    role: 'Solo Developer',
    description: 'Local-first kirjekuoribudjetointi, joka tuo YNAB-metodologian suomalaiseen arkeen. Palkkavetoinen työnkulku, täysi tavoite-, tili- ja tapahtumahallinta sekä kaksikielinen käyttöliittymä — yksityisyys edellä, data pysyy laitteella.',
    results: [
      { icon: Wallet, value: 'Kirjekuoret', label: 'YNAB-metodi' },
      { icon: Shield, value: 'Local-first', label: 'Data laitteella' }
    ],
    tech: ['React Native', 'Expo', 'TypeScript', 'Drizzle', 'SQLite'],
    featured: false
  }
]

export default function Cases() {
  return (
    <section id="cases" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight">Projektit</h2>
      </div>
      <p className="text-text-muted mb-12 ml-13">Todistettuja tuloksia tuotantojärjestelmistä</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((item) => (
          <article
            key={item.title}
            className={`group relative bg-bg-secondary border rounded-2xl p-8 hover:-translate-y-1 transition-all duration-300 ${
              item.featured
                ? 'border-accent/30 hover:border-accent/60 hover:shadow-xl hover:shadow-accent/10'
                : 'border-border hover:border-border-hover'
            }`}
          >
            {item.featured && (
              <div className="absolute -top-3 right-6 px-3 py-1 bg-gradient-to-r from-accent to-purple-500 rounded-full text-xs font-medium text-white">
                Featured
              </div>
            )}

            <div className="flex items-start justify-between mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-bg-tertiary to-bg-secondary border border-border rounded-xl flex items-center justify-center group-hover:border-accent/30 transition-colors">
                <item.icon className="w-6 h-6 text-accent" />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-xl font-semibold mb-1 text-text-primary">{item.title}</h3>
              <div className="flex items-center gap-2 text-sm">
                <span className="text-accent">{item.client}</span>
                <span className="text-text-muted">·</span>
                <span className="text-text-muted">{item.role}</span>
              </div>
            </div>

            <p className="text-text-secondary text-sm mb-6 leading-relaxed">{item.description}</p>

            {/* Results metrics */}
            <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-bg-tertiary/50 rounded-xl border border-border/50">
              {item.results.map((result, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
                    <result.icon className="w-4 h-4 text-accent" />
                  </div>
                  <div>
                    <div className="text-lg font-bold text-text-primary">{result.value}</div>
                    <div className="text-xs text-text-muted">{result.label}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              {item.tech.map((t) => (
                <span key={t} className="px-3 py-1 bg-bg-tertiary border border-border/50 rounded-full text-xs text-text-muted hover:text-accent hover:border-accent/30 transition-colors">
                  {t}
                </span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
