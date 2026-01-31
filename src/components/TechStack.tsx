const techCategories = [
  {
    title: 'Frontend',
    items: [
      { name: 'React', tooltip: 'UI-kirjasto' },
      { name: 'Next.js', tooltip: 'Metaframework' },
      { name: 'TypeScript', tooltip: 'Tyypitys' },
      { name: 'Tailwind CSS', tooltip: 'Tyylit' }
    ]
  },
  {
    title: 'Backend & Data',
    items: [
      { name: 'Node.js', tooltip: 'Runtime' },
      { name: 'Supabase', tooltip: 'BaaS & PostgreSQL' },
      { name: 'RLS', tooltip: 'Row Level Security' },
      { name: 'pgvector', tooltip: 'Vektorihaut' },
      { name: 'Multi-tenant', tooltip: 'Arkkitehtuuri' }
    ]
  },
  {
    title: 'AI & Automaatiot',
    items: [
      { name: 'RAG', tooltip: 'Retrieval-Augmented Generation' },
      { name: 'OpenAI', tooltip: 'LLM API' },
      { name: 'Anthropic', tooltip: 'LLM API' },
      { name: 'n8n', tooltip: 'Workflow-orkestrointi' },
      { name: 'Voice AI', tooltip: 'Vapi / Bland' }
    ]
  },
  {
    title: 'Integraatiot',
    items: [
      { name: 'REST APIs', tooltip: 'API-kehitys' },
      { name: 'Resend', tooltip: 'Sähköpostit' },
      { name: 'Stripe', tooltip: 'Maksut' },
      { name: 'Google APIs', tooltip: 'Drive, Calendar' }
    ]
  }
]

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Tech Stack</h2>
      <p className="text-text-muted mb-12">Työkalut joilla rakennan</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {techCategories.map((category) => (
          <div key={category.title}>
            <h3 className="text-text-muted text-sm font-medium uppercase tracking-wider mb-4">
              {category.title}
            </h3>
            <div className="flex flex-wrap gap-3">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="group relative px-4 py-3 bg-bg-secondary border border-border rounded-lg font-medium hover:border-accent hover:bg-bg-tertiary transition-all cursor-default"
                >
                  {item.name}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-bg-tertiary border border-border rounded-md text-xs text-text-muted whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity">
                    {item.tooltip}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
