const categories = [
  {
    title: 'AI & LLM',
    subtitle: 'Tekoäly ja kielimallit',
    tools: [
      {
        name: 'Claude',
        provider: 'ANTHROPIC',
        description: 'Pääasiallinen LLM tuotanto- ja kehityskäytössä. Opus, Sonnet ja Haiku eri tarpeisiin.',
        tags: ['LLM', 'Reasoning', 'Code'],
        active: true
      },
      {
        name: 'OpenAI',
        provider: 'OPENAI',
        description: 'GPT-4 ja embedding-mallit RAG-järjestelmiin. o1 ja o3 reasoning-tehtäviin.',
        tags: ['GPT-4', 'Embeddings', 'o1'],
        active: true
      },
      {
        name: 'Gemini',
        provider: 'GOOGLE',
        description: 'Googlen multimodaalinen malli. Pitkä konteksti-ikkuna ja integraatio Google-palveluihin.',
        tags: ['Multimodal', 'Long context', 'Google'],
        active: true
      },
      {
        name: 'Mistral',
        provider: 'MISTRAL AI',
        description: 'Eurooppalainen vaihtoehto. Nopea ja kustannustehokas, hyvä koodaukseen.',
        tags: ['EU', 'Fast', 'Code'],
        active: true
      },
      {
        name: 'Perplexity',
        provider: 'PERPLEXITY',
        description: 'AI-hakukone reaaliaikaiseen tiedonhakuun. Lähdeviittaukset ja tuore data.',
        tags: ['Search', 'Real-time', 'Sources'],
        active: true
      },
      {
        name: 'Leonardo.ai',
        provider: 'LEONARDO',
        description: 'AI-kuvageneraattori markkinointimateriaaleihin ja tuotekuviin.',
        tags: ['Image Gen', 'Marketing'],
        active: true
      },
      {
        name: 'Kie.ai',
        provider: 'KIE.AI',
        description: 'Videogeneraattori lyhyisiin markkinointivideoihin ja somecontentiin.',
        tags: ['Video Gen', 'Social'],
        active: true
      },
      {
        name: 'Veo 2',
        provider: 'GOOGLE',
        description: 'Googlen videomalli. Korkealaatuinen videogenerointi prompteista.',
        tags: ['Video', 'High quality'],
        active: true
      },
      {
        name: 'Sora',
        provider: 'OPENAI',
        description: 'OpenAI:n videogeneraattori. Realistiset videot tekstikuvauksista.',
        tags: ['Video', 'Realistic'],
        active: true
      },
      {
        name: 'ElevenLabs',
        provider: 'ELEVENLABS',
        description: 'AI-äänisynteesi ja voice cloning. Luonnolliset äänet eri kielillä.',
        tags: ['Voice', 'TTS', 'Clone'],
        active: true
      },
      {
        name: 'Hedra',
        provider: 'HEDRA',
        description: 'AI-avatarit ja talking head -videot. Lifelike-animaatiot kuvista.',
        tags: ['Avatar', 'Talking Head'],
        active: true
      }
    ]
  },
  {
    title: 'Development',
    subtitle: 'Kehitys ja infrastruktuuri',
    tools: [
      {
        name: 'React & Vite',
        provider: 'META • VITE',
        description: 'Nopea frontend-kehitys. Hot reload, optimoitu build ja moderni tooling.',
        tags: ['Frontend', 'Fast', 'HMR'],
        active: true
      },
      {
        name: 'Next.js & Node',
        provider: 'VERCEL',
        description: 'Full-stack kehitys. Server components, API routes ja edge functions.',
        tags: ['Full-stack', 'SSR', 'API'],
        active: true
      },
      {
        name: 'Supabase',
        provider: 'SUPABASE',
        description: 'PostgreSQL, autentikointi, RLS ja vektorihaut. Multi-tenant arkkitehtuuri.',
        tags: ['PostgreSQL', 'RLS', 'pgvector'],
        active: true
      },
      {
        name: 'Airtable',
        provider: 'AIRTABLE',
        description: 'No-code tietokanta ja CRM-pohja. Nopea prototypointi ja asiakasprojektit.',
        tags: ['No-code', 'CRM', 'Prototype'],
        active: true
      },
      {
        name: 'TypeScript',
        provider: 'MICROSOFT',
        description: 'Tyypitetty JavaScript kaikissa projekteissa. Parempi DX ja vähemmän bugeja.',
        tags: ['Types', 'DX', 'Safety'],
        active: true
      },
      {
        name: 'Vercel',
        provider: 'VERCEL',
        description: 'Edge-deployment ja CI/CD. Preview-ympäristöt jokaiselle PR:lle.',
        tags: ['Edge', 'CI/CD', 'Preview'],
        active: true
      },
      {
        name: 'Claude Code',
        provider: 'ANTHROPIC',
        description: 'Terminaalipohjainen agenttinen koodaustyökalu. Autonominen iterointi.',
        tags: ['Agentic', 'Terminal', 'AI'],
        active: true
      },
      {
        name: 'Cursor',
        provider: 'CURSOR',
        description: 'AI-first IDE. Composer, tab-completion ja codebase-aware chat.',
        tags: ['IDE', 'AI', 'Autocomplete'],
        active: true
      },
      {
        name: 'Mistral CLI',
        provider: 'MISTRAL AI',
        description: 'Mistralin terminaalityökalu. Komentorivipohjainen AI-koodausavustaja.',
        tags: ['CLI', 'Terminal', 'AI'],
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
        description: 'Self-hosted workflow-automaatiot. Täysi kontrolli dataan ja rajaton skaalaus.',
        tags: ['Self-hosted', 'Workflows', 'Open source'],
        active: true
      },
      {
        name: 'Make.com',
        provider: 'MAKE',
        description: 'Visuaalinen automaatioalusta. 1000+ integraatiota ja helppo käyttöliittymä.',
        tags: ['Visual', 'Integrations', 'No-code'],
        active: true
      },
      {
        name: 'Power Automate',
        provider: 'MICROSOFT',
        description: 'Enterprise-automaatiot. Microsoft 365 -integraatiot ja RPA-ominaisuudet.',
        tags: ['Enterprise', 'M365', 'RPA'],
        active: true
      },
      {
        name: 'GitHub',
        provider: 'MICROSOFT',
        description: 'Versionhallinta ja CI/CD. Actions-automaatiot ja yhteistyötyökalut.',
        tags: ['Git', 'Actions', 'CI/CD'],
        active: true
      },
      {
        name: 'Nango',
        provider: 'NANGO',
        description: 'Unified API integraatioihin. OAuth-hallinta ja synkronointi kolmansien osapuolien palveluihin.',
        tags: ['Integrations', 'OAuth', 'API'],
        active: true
      }
    ]
  }
]

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/20 rounded-full mb-6">
          <span className="w-2 h-2 bg-accent rounded-full"></span>
          <span className="text-accent text-sm font-medium">Päivittäisessä käytössä</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Tech Stack</h2>
        <p className="text-text-muted max-w-2xl mx-auto">
          Modernit työkalut AI-järjestelmien ja automaatioiden rakentamiseen.
          Kaikki tuotantokäytössä oikeissa projekteissa.
        </p>
      </div>

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

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
              {category.tools.map((tool) => (
                <div
                  key={tool.name}
                  className="group relative bg-bg-secondary border border-border rounded-xl p-4 hover:border-emerald-500/50 hover:bg-bg-tertiary transition-all"
                >
                  {tool.active && (
                    <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-400 rounded-full"></span>
                  )}

                  <div className="mb-2">
                    <h4 className="font-semibold text-sm text-text-primary leading-tight">{tool.name}</h4>
                    <p className="text-[10px] text-text-muted uppercase tracking-wider">{tool.provider}</p>
                  </div>

                  <p className="text-xs text-text-secondary mb-3 leading-relaxed">
                    {tool.description}
                  </p>

                  <div className="flex flex-wrap gap-1">
                    {tool.tags.slice(0, 2).map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-0.5 text-[10px] bg-bg-tertiary border border-border rounded text-text-muted"
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

      {/* Summary stats */}
      <div className="mt-16 pt-12 border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-text-primary mb-1">25+</div>
            <div className="text-sm text-text-muted">Työkalua hallinnassa</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-primary mb-1">3</div>
            <div className="text-sm text-text-muted">Osaamisaluetta</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-primary mb-1">100%</div>
            <div className="text-sm text-text-muted">Tuotantokäytössä</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-text-primary mb-1">2025</div>
            <div className="text-sm text-text-muted">Jatkuvasti päivitetty</div>
          </div>
        </div>
      </div>
    </section>
  )
}
