import { Search, Phone, Mail, Shield } from 'lucide-react'

const cases = [
  {
    icon: Search,
    title: 'RAG-synkronointi',
    client: 'Gold Adam',
    description: 'Google Drive -> Supabase -> semanttinen haku. Automaattinen dokumenttien indeksointi ja alykas tiedonhaku vektorihauilla.',
    tech: ['Supabase', 'pgvector', 'n8n', 'OpenAI']
  },
  {
    icon: Phone,
    title: 'Voice AI -puhelinpalvelu',
    client: 'Useita asiakkaita',
    description: 'AI-pohjaiset puhelinvastaukset ja ajanvaraukset. Luonnollinen keskustelu, CRM-integraatiot ja automaattinen jalkikasittely.',
    tech: ['Voice AI', 'n8n', 'Webhooks', 'CRM']
  },
  {
    icon: Mail,
    title: 'Rascal Mail',
    client: 'Rascal AI',
    description: 'Multi-tenant sahkopostimarkkinointijarjestelma. Row Level Security, kampanja-automaatiot ja analytiikka.',
    tech: ['React', 'Supabase', 'RLS', 'Resend']
  },
  {
    icon: Shield,
    title: 'Tietoturva-auditoinnit',
    client: 'Konsultointi',
    description: 'Prompt injection -haavoittuvuusanalyysit ja LLM-jarjestelmien tietoturvatarkastukset. Suositukset ja korjaukset.',
    tech: ['Security', 'LLM', 'Penetration testing']
  }
]

export default function Cases() {
  return (
    <section id="cases" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Projektit</h2>
      <p className="text-text-muted mb-12">Esimerkkeja toteutetuista jarjestelmista</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {cases.map((item) => (
          <article
            key={item.title}
            className="bg-bg-secondary border border-border rounded-2xl p-8 hover:border-border-hover hover:-translate-y-1 transition-all"
          >
            <div className="w-12 h-12 bg-bg-tertiary rounded-xl flex items-center justify-center mb-6">
              <item.icon className="w-6 h-6 text-accent" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
            <p className="text-accent text-sm mb-4">{item.client}</p>
            <p className="text-text-secondary text-sm mb-6">{item.description}</p>
            <div className="flex flex-wrap gap-2">
              {item.tech.map((t) => (
                <span key={t} className="px-3 py-1 bg-bg-tertiary rounded-full text-xs text-text-muted">
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
