import { Sparkles, FileText, Search, Phone, TrendingUp, Clock, Users, Zap } from 'lucide-react'

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
    icon: FileText,
    title: 'Rascal Pages',
    client: 'Rascal Company',
    role: 'Technical Lead',
    description: 'AI-pohjainen laskeutumissivugeneraattori. Analysoi brändin, generoi konvertoivan sivun ja julkaisee sen minuuteissa.',
    results: [
      { icon: Zap, value: '< 5min', label: 'Sivun luonti' },
      { icon: TrendingUp, value: '3x', label: 'Nopeampi julkaisu' }
    ],
    tech: ['Next.js', 'Supabase', 'Claude', 'Vercel'],
    featured: true
  },
  {
    icon: Search,
    title: 'RAG-järjestelmät',
    client: 'Useita asiakkaita',
    role: 'AI Architect',
    description: 'Räätälöidyt tiedonhakujärjestelmät yrityksille. Dokumenttien indeksointi, semanttinen haku ja keskusteleva käyttöliittymä.',
    results: [
      { icon: Clock, value: '90%', label: 'Nopeampi tiedonhaku' },
      { icon: Users, value: '5+', label: 'Toteutettua järjestelmää' }
    ],
    tech: ['Supabase', 'pgvector', 'n8n', 'OpenAI'],
    featured: false
  },
  {
    icon: Phone,
    title: 'Voice AI -palvelut',
    client: 'Useita asiakkaita',
    role: 'Integration Specialist',
    description: 'AI-puhelinpalvelut ja ajanvaraukset. Luonnollinen keskustelu, reaaliaikainen CRM-synkronointi ja automaattinen jälkikäsittely.',
    results: [
      { icon: Zap, value: '24/7', label: 'Saatavuus' },
      { icon: TrendingUp, value: '40%', label: 'Vähemmän no-show' }
    ],
    tech: ['Synthflow', 'n8n', 'Webhooks', 'Airtable'],
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
