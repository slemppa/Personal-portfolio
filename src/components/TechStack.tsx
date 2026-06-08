import { Brain, Terminal, Boxes, Workflow, Sparkles } from 'lucide-react'

type Tool = { name: string; primary?: boolean }

type Layer = {
  index: string
  icon: typeof Brain
  name: string
  role: string
  tools: Tool[]
}

// Stack kuvattuna järjestelmänä, ei työkalulistana: jokainen kerros
// kertoo mitä se TEKEE koneistossa. Työkalut ovat tukevaa detaljia.
const layers: Layer[] = [
  {
    index: '01',
    icon: Brain,
    name: 'Reasoning',
    role: 'Päättely ja generointi. Claude vetää tuotannossa ja kehityksessä — muut mallit erikoistehtäviin ja vertailuun.',
    tools: [
      { name: 'Claude', primary: true },
      { name: 'OpenAI' },
      { name: 'Gemini' },
      { name: 'Mistral' },
      { name: 'Perplexity' }
    ]
  },
  {
    index: '02',
    icon: Terminal,
    name: 'Build',
    role: 'Agenttinen kehitys. Kirjoitan järjestelmät Claude Codella ja kytken työkalut MCP:llä — APIn yli, ei käyttöliittymää klikkaamalla.',
    tools: [
      { name: 'Claude Code', primary: true },
      { name: 'MCP', primary: true },
      { name: 'Cursor' },
      { name: 'Mistral CLI' }
    ]
  },
  {
    index: '03',
    icon: Boxes,
    name: 'Product',
    role: 'Missä järjestelmät ajetaan. Multi-tenant SaaS, RLS-eristetty data, vektorihaut ja edge-deploy jokaiselle muutokselle.',
    tools: [
      { name: 'Supabase', primary: true },
      { name: 'React & Vite' },
      { name: 'Next.js & Node' },
      { name: 'TypeScript' },
      { name: 'Vercel' }
    ]
  },
  {
    index: '04',
    icon: Workflow,
    name: 'Automation',
    role: 'Koneiston liima. Self-hosted n8n hoitaa workflowt, webhookit ja integraatiot palasta toiseen — täysi kontrolli dataan.',
    tools: [
      { name: 'n8n', primary: true },
      { name: 'Make.com' },
      { name: 'Power Automate' },
      { name: 'GitHub Actions' },
      { name: 'Nango' },
      { name: 'Airtable' }
    ]
  },
  {
    index: '05',
    icon: Sparkles,
    name: 'Generative media',
    role: 'AI-natiivi sisältö. Kuva, video, ääni ja avatarit promptista valmiiksi materiaaliksi — sama API-logiikka kuin muuallakin.',
    tools: [
      { name: 'ElevenLabs', primary: true },
      { name: 'Leonardo.ai' },
      { name: 'Veo 2' },
      { name: 'Sora' },
      { name: 'Kie.ai' },
      { name: 'Hedra' }
    ]
  }
]

const principles = [
  {
    title: 'API-first',
    body: 'Lähes kaikki ajetaan rajapintojen yli, ei käyttöliittymistä klikkaamalla. Koneisto, ei kasa tilauksia.'
  },
  {
    title: 'Rakennettu, ei ostettu',
    body: 'Kun rakentaminen kannattaa, rakennan sen itse. Ostan vain siellä missä se ei oikeasti kannata.'
  },
  {
    title: 'Sama stack, oikeat asiakkaat',
    body: 'Tämä ei ole demo-stack. Sama koneisto pyörittää Rascal AI:ta ja asiakasprojekteja tuotannossa.'
  }
]

function Chip({ tool }: { tool: Tool }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm border transition-colors ${
        tool.primary
          ? 'border-accent/40 bg-accent-soft text-text-primary'
          : 'border-border bg-bg-tertiary text-text-secondary hover:border-border-hover'
      }`}
    >
      {tool.primary && <span className="w-1.5 h-1.5 rounded-full bg-accent" />}
      {tool.name}
    </span>
  )
}

export default function TechStack() {
  return (
    <section id="tech" className="py-24 px-8 max-w-5xl mx-auto">
      {/* Thesis */}
      <div className="max-w-3xl mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-accent-soft border border-accent/20 rounded-full mb-6">
          <span className="w-1.5 h-1.5 bg-accent rounded-full" />
          <span className="text-accent text-sm font-medium">Rakennettu, ei ostettu</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">
          Näin rakennan koneiston
        </h2>
        <p className="text-lg text-text-secondary leading-relaxed">
          En osta valmista markkinointi- tai tuotekoneistoa. Rakennan sen — AI-natiivina
          päättelystä ajoon, kytkettynä yhteen APIn yli. Sama stack pyörittää sekä omia
          tuotteitani että asiakasprojekteja.
        </p>
      </div>

      {/* Layered system */}
      <div className="relative space-y-px">
        {layers.map((layer) => (
          <div
            key={layer.name}
            className="group grid md:grid-cols-[300px_1fr] gap-6 p-6 bg-bg-secondary border border-border first:rounded-t-2xl last:rounded-b-2xl hover:bg-bg-tertiary/50 hover:border-border-hover transition-colors"
          >
            {/* Layer identity */}
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="font-mono text-xs text-text-muted">{layer.index}</span>
                <div className="w-9 h-9 rounded-lg bg-bg-tertiary border border-border flex items-center justify-center group-hover:border-accent/30 transition-colors">
                  <layer.icon className="w-4 h-4 text-accent" />
                </div>
                <h3 className="text-base font-semibold uppercase tracking-wider text-text-primary">
                  {layer.name}
                </h3>
              </div>
              <p className="text-sm text-text-muted leading-relaxed md:pr-4">{layer.role}</p>
            </div>

            {/* Tools as compact chips */}
            <div className="flex flex-wrap gap-2 content-start md:border-l md:border-border md:pl-6">
              {layer.tools.map((tool) => (
                <Chip key={tool.name} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Principles — korvaa vanity-statsit */}
      <div className="mt-16 grid md:grid-cols-3 gap-6">
        {principles.map((p, i) => (
          <div key={p.title} className="relative pl-5">
            <span className="absolute left-0 top-1 bottom-1 w-0.5 bg-accent rounded-full" />
            <span className="font-mono text-xs text-text-muted">0{i + 1}</span>
            <h4 className="text-base font-semibold text-text-primary mt-1 mb-2">{p.title}</h4>
            <p className="text-sm text-text-secondary leading-relaxed">{p.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
