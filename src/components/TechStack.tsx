const categories = [
  {
    title: 'AI & LLM',
    subtitle: 'Tekoäly ja kielimallit',
    tools: [
      {
        name: 'Claude Code',
        provider: 'ANTHROPIC',
        description: 'Terminaalipohjainen agenttinen koodaustyökalu. Lukee koodikantasi, ajaa komentoja ja iteroi autonomisesti.',
        tags: ['Agentic', 'Terminal', 'Code'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" fill="none"/>
          </svg>
        ),
        active: true
      },
      {
        name: 'OpenAI',
        provider: 'OPENAI',
        description: 'GPT-4 ja embedding-mallit RAG-järjestelmiin. Tuotantokäytössä useissa asiakasprojekteissa.',
        tags: ['GPT-4', 'Embeddings', 'API'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M22.282 9.821a5.985 5.985 0 00-.516-4.91 6.046 6.046 0 00-6.51-2.9A6.065 6.065 0 0012 .075a6.046 6.046 0 00-5.764 4.17 5.985 5.985 0 00-3.996 2.9 6.046 6.046 0 00.74 7.097 5.98 5.98 0 00.516 4.911 6.046 6.046 0 006.51 2.9A5.996 5.996 0 0012 23.925a6.046 6.046 0 005.764-4.17 5.985 5.985 0 003.996-2.9 6.046 6.046 0 00-.478-7.034zM12 20.891a3.53 3.53 0 01-2.27-.822l.112-.065 3.768-2.18a.612.612 0 00.31-.53v-5.326l1.594.923a.056.056 0 01.03.043v4.406a3.558 3.558 0 01-3.544 3.55zm-7.623-3.26a3.53 3.53 0 01-.422-2.372l.112.067 3.768 2.18a.607.607 0 00.618 0l4.601-2.66v1.847a.057.057 0 01-.023.046l-3.81 2.2a3.558 3.558 0 01-4.844-1.308zM2.95 7.958a3.53 3.53 0 011.85-1.552v4.492a.607.607 0 00.308.53l4.601 2.658-1.594.923a.056.056 0 01-.053.004l-3.81-2.2A3.558 3.558 0 012.95 7.959zm13.1 3.052l-4.6-2.66 1.593-.922a.056.056 0 01.053-.005l3.81 2.2a3.558 3.558 0 01.547 5.896v-4.478a.607.607 0 00-.303-.531zm1.587-2.39l-.112-.067-3.768-2.18a.607.607 0 00-.618 0l-4.6 2.66V7.185a.057.057 0 01.022-.046l3.81-2.2a3.558 3.558 0 015.266 3.68zm-9.979 3.283l-1.594-.923a.056.056 0 01-.03-.043V6.53a3.558 3.558 0 015.815-2.732l-.112.065-3.768 2.18a.612.612 0 00-.31.53zm.866-1.866l2.05-1.185 2.049 1.185v2.37l-2.05 1.185-2.049-1.184z" />
          </svg>
        ),
        active: true
      },
      {
        name: 'Leonardo.ai',
        provider: 'LEONARDO',
        description: 'AI-kuvageneraattori markkinointimateriaaleihin. Brändin mukaiset visuaalit ja tuotekuvat.',
        tags: ['Image Gen', 'Marketing', 'Visual'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        ),
        active: true
      }
    ]
  },
  {
    title: 'Development',
    subtitle: 'Kehitys ja infrastruktuuri',
    tools: [
      {
        name: 'React & Next.js',
        provider: 'META • VERCEL',
        description: 'Full-stack React-kehitys Next.js:llä. Server components, API routes ja edge functions.',
        tags: ['Frontend', 'Full-stack', 'SSR'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 9.861a2.139 2.139 0 100 4.278 2.139 2.139 0 000-4.278zm-5.992 6.394l-.472-.12C2.018 15.246 0 13.737 0 11.996s2.018-3.25 5.536-4.139l.472-.119.133.468a23.53 23.53 0 001.363 3.578l.101.213-.101.213a23.307 23.307 0 00-1.363 3.578l-.133.467zm12.675-4.259c.48 1.039.877 2.06 1.182 3.046 2.675-.752 4.315-1.901 4.315-3.046 0-1.146-1.641-2.294-4.315-3.046a24.788 24.788 0 01-1.182 3.046z"/>
          </svg>
        ),
        active: true
      },
      {
        name: 'Supabase',
        provider: 'SUPABASE',
        description: 'PostgreSQL, autentikointi, RLS ja vektorihaut pgvectorilla. Multi-tenant arkkitehtuuri.',
        tags: ['PostgreSQL', 'RLS', 'pgvector'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M11.9 1.036c-.015-.986-1.26-1.41-1.874-.637L.764 12.05C-.33 13.427.65 15.455 2.409 15.455h9.579l.113 7.51c.014.985 1.259 1.408 1.873.636l9.262-11.653c1.093-1.375.113-3.403-1.645-3.403h-9.642z" />
          </svg>
        ),
        active: true
      },
      {
        name: 'TypeScript',
        provider: 'MICROSOFT',
        description: 'Tyypitetty JavaScript kaikissa projekteissa. Parempi kehittäjäkokemus ja vähemmän bugeja.',
        tags: ['Types', 'DX', 'Safety'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.75c.612 0 1.154.037 1.627.111a6.38 6.38 0 011.306.34v2.458a3.95 3.95 0 00-.643-.361 5.093 5.093 0 00-.717-.26 5.453 5.453 0 00-1.426-.2c-.3 0-.573.028-.819.086a2.1 2.1 0 00-.623.242c-.17.104-.3.229-.393.374a.888.888 0 00-.14.49c0 .196.053.373.156.529.104.156.252.304.443.444s.423.276.696.41c.273.135.582.274.926.416.47.197.892.407 1.266.628.374.222.695.473.963.753.268.279.472.598.614.957.142.359.214.776.214 1.253 0 .657-.125 1.21-.373 1.656a3.033 3.033 0 01-1.012 1.085 4.38 4.38 0 01-1.487.596c-.566.12-1.163.18-1.79.18a9.916 9.916 0 01-1.84-.164 5.544 5.544 0 01-1.512-.493v-2.63a5.033 5.033 0 003.237 1.2c.333 0 .624-.03.872-.09.249-.06.456-.144.623-.25.166-.108.29-.234.373-.38a1.023 1.023 0 00-.074-1.089 2.12 2.12 0 00-.537-.5 5.597 5.597 0 00-.807-.444 27.72 27.72 0 00-1.007-.436c-.918-.383-1.602-.852-2.053-1.405-.45-.553-.676-1.222-.676-2.005 0-.614.123-1.141.369-1.582.246-.441.58-.804 1.004-1.089a4.494 4.494 0 011.47-.629 7.536 7.536 0 011.77-.201zm-15.113.188h9.563v2.166H9.506v9.646H6.789v-9.646H3.375z" />
          </svg>
        ),
        active: true
      },
      {
        name: 'Vercel',
        provider: 'VERCEL',
        description: 'Edge-deployment ja CI/CD. Preview-ympäristöt jokaiselle PR:lle automaattisesti.',
        tags: ['Edge', 'CI/CD', 'Preview'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M24 22.525H0l12-21.05 12 21.05z" />
          </svg>
        ),
        active: true
      }
    ]
  },
  {
    title: 'Automation',
    subtitle: 'Automaatiot ja integraatiot',
    tools: [
      {
        name: 'n8n',
        provider: 'N8N GMBH',
        description: 'Workflow-orkestrointi ja automaatiot. Self-hosted, täysi kontrolli dataan ja rajaton skaalaus.',
        tags: ['Workflows', 'Self-hosted', 'Integrations'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12.8 6.4V1.6L24 12l-11.2 10.4v-4.8H0V6.4h12.8z" />
          </svg>
        ),
        active: true
      },
      {
        name: 'Synthflow',
        provider: 'SYNTHFLOW',
        description: 'Voice AI puhelinpalveluihin. Luonnollinen keskustelu, ajanvaraukset ja CRM-integraatiot.',
        tags: ['Voice AI', 'Phone', 'Booking'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 2a3 3 0 00-3 3v6a3 3 0 006 0V5a3 3 0 00-3-3zm0 18a7.001 7.001 0 006.93-6H17a5 5 0 01-10 0H5.07A7.001 7.001 0 0012 20zm0 2a1 1 0 011 1v1h-2v-1a1 1 0 011-1z"/>
          </svg>
        ),
        active: true
      },
      {
        name: 'GitHub',
        provider: 'MICROSOFT',
        description: 'Versionhallinta ja CI/CD. Actions-automaatiot ja integraatiot kehitystyökaluihin.',
        tags: ['Git', 'Actions', 'CI/CD'],
        logo: (
          <svg viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
          </svg>
        ),
        active: true
      }
    ]
  }
]

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Tech Stack</h2>
      <p className="text-text-muted mb-12">Työkalut joilla rakennan</p>

      <div className="space-y-12">
        {categories.map((category) => (
          <div key={category.title}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
                <span className="text-white text-sm">⚡</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
                  {category.title}
                </h3>
                <p className="text-text-muted text-sm">{category.subtitle}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="group relative bg-bg-secondary border border-border rounded-xl p-5 hover:border-emerald-500/50 hover:bg-bg-tertiary transition-all"
                >
                  {tool.active && (
                    <span className="absolute top-4 right-4 text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full"></span>
                      KÄYTÖSSÄ
                    </span>
                  )}

                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center text-text-secondary group-hover:text-emerald-400 group-hover:border-emerald-500/30 transition-colors">
                      {tool.logo}
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary">{tool.name}</h4>
                      <p className="text-xs text-text-muted">{tool.provider}</p>
                    </div>
                  </div>

                  <p className="text-sm text-text-secondary mb-4 line-clamp-2">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {tool.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs bg-bg-tertiary border border-border rounded-md text-text-muted"
                      >
                        {tag}
                      </span>
                    ))}
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
