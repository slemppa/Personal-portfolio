import { Sparkles, FileText, Search, Phone } from 'lucide-react'

const cases = [
  {
    icon: Sparkles,
    title: 'Rascal AI',
    client: 'Rascal Company',
    description: 'AI-pohjainen markkinointiautomaatioalusta pk-yrityksille. Säästää 8-10h viikossa markkinointitehtävistä. Multi-tenant arkkitehtuuri ja RLS.',
    tech: ['React', 'Supabase', 'OpenAI', 'n8n']
  },
  {
    icon: FileText,
    title: 'Rascal Pages',
    client: 'Rascal Company',
    description: 'AI-avusteinen laskeutumissivujen rakentaja. Generoi konvertoivia sivuja automaattisesti brändin mukaan. Integroitu analytiikka.',
    tech: ['Next.js', 'Supabase', 'Claude', 'Vercel']
  },
  {
    icon: Search,
    title: 'RAG-ratkaisut',
    client: 'Asiakasprojektit',
    description: 'Räätälöidyt RAG-järjestelmät yrityksille. Dokumenttien indeksointi, semanttinen haku ja vektoritietokannat. Google Drive, Notion, SharePoint.',
    tech: ['Supabase', 'pgvector', 'n8n', 'OpenAI']
  },
  {
    icon: Phone,
    title: 'Voice AI',
    client: 'Useita asiakkaita',
    description: 'AI-pohjaiset puhelinpalvelut ja ajanvarausjärjestelmät. Luonnollinen keskustelu, CRM-integraatiot ja automaattinen jälkikäsittely.',
    tech: ['Synthflow', 'n8n', 'Webhooks', 'CRM']
  }
]

export default function Cases() {
  return (
    <section id="cases" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Projektit</h2>
      <p className="text-text-muted mb-12">Esimerkkejä toteutetuista järjestelmistä</p>

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
