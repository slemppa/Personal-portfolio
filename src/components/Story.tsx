import { Briefcase, GraduationCap, Code, Rocket } from 'lucide-react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const timeline = [
  {
    icon: Briefcase,
    year: '2015',
    title: 'Yrittäjä',
    subtitle: 'Ensimmäinen yritys',
    description: 'Aloitin yrittäjänä. Opin ymmärtämään asiakkaita, myyntiä ja liiketoiminnan perusteita käytännön kautta.',
    active: false
  },
  {
    icon: GraduationCap,
    year: '2022',
    title: 'Markkinoija',
    subtitle: 'Haaga-Helia',
    description: 'Liiketalouden tradenomi markkinoinnin suuntautumisella. Digitaalinen markkinointi ja analytiikka.',
    active: false
  },
  {
    icon: Code,
    year: '2024',
    title: 'Kehittäjä',
    subtitle: 'Full-stack',
    description: 'Itseoppinut kehittäjä. React, TypeScript, Node.js ja modernit pilvipalvelut. Ideat muuttuivat tuotteiksi.',
    active: false
  },
  {
    icon: Rocket,
    year: '2025',
    title: 'CTO & AI Builder',
    subtitle: 'Rascal AI',
    description: 'Rakennan AI-järjestelmiä jotka automatisoivat oikeita työtehtäviä. Multi-tenant SaaS, RAG ja Voice AI.',
    active: true
  }
]

const credentials = [
  { label: 'Yrittäjäkokemus', value: '11 vuotta' },
  { label: 'Tuotantoautomaatioita', value: '50+' },
  { label: 'AI-työkaluja', value: '25+' }
]

export default function Story() {
  return (
    <section id="story" className="py-24 px-6 sm:px-8 max-w-6xl mx-auto scroll-mt-20">
      <SectionHeading
        index="04"
        eyebrow="Tarina"
        title="Yrittäjästä AI-rakentajaksi"
        description="Epätyypillinen polku yrittäjästä AI-järjestelmien rakentajaksi. Jokainen vaihe toi uuden näkökulman."
      />

      {/* Timeline — vertical rail with connected nodes */}
      <div className="max-w-3xl mt-14 mb-16">
        <div className="relative pl-6 sm:pl-0">
          {/* Rail */}
          <span className="absolute left-[7px] sm:left-[27px] top-2 bottom-2 w-px bg-border" aria-hidden="true" />
          <div className="flex flex-col gap-3">
            {timeline.map((item, i) => (
              <Reveal key={item.title} delay={i * 60}>
                <div className="relative flex gap-4 sm:gap-6">
                  {/* Node + year */}
                  <div className="relative flex sm:flex-col items-center shrink-0">
                    <span
                      className={`absolute -left-[22px] sm:static top-1.5 w-3.5 h-3.5 rounded-full ring-4 ring-bg-primary ${
                        item.active ? 'bg-accent' : 'bg-bg-elevated border border-border-hover'
                      }`}
                    />
                    <span className={`hidden sm:flex w-14 h-14 rounded-xl items-center justify-center mt-0 ${
                      item.active ? 'bg-accent-soft border border-accent-line' : 'bg-bg-tertiary border border-border'
                    }`}>
                      <item.icon className={`w-5 h-5 ${item.active ? 'text-accent' : 'text-text-muted'}`} />
                    </span>
                  </div>

                  {/* Content card */}
                  <div className={`flex-1 mb-1 rounded-2xl border p-5 transition-colors ${
                    item.active ? 'bg-accent-soft border-accent-line' : 'surface-card hover:border-border-hover'
                  }`}>
                    <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                      <span className={`font-mono text-xs ${item.active ? 'text-accent' : 'text-text-muted'}`}>{item.year}</span>
                      <h3 className="text-base font-semibold text-text-primary tracking-tight">{item.title}</h3>
                      <span className="px-2 py-0.5 rounded-md border border-border bg-bg-tertiary/60 text-[11px] text-text-muted">
                        {item.subtitle}
                      </span>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>

      {/* Quote */}
      <div className="max-w-3xl mb-12">
        <figure className="surface-card rounded-2xl p-8 md:p-10">
          <blockquote className="text-xl md:text-2xl text-text-primary leading-snug tracking-tight font-medium">
            “Epätyypillinen tausta on vahvuus – ymmärrän sekä bisneksen että teknologian kielen.”
          </blockquote>
          <figcaption className="mt-6 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-text-primary flex items-center justify-center">
              <span className="text-bg-primary text-xs font-bold">SK</span>
            </div>
            <div>
              <div className="text-sm font-medium text-text-primary">Sami Kiias</div>
              <div className="text-[13px] text-text-muted">CTO @ Rascal AI</div>
            </div>
          </figcaption>
        </figure>
      </div>

      {/* Credentials */}
      <div className="grid grid-cols-3 gap-px bg-border rounded-2xl overflow-hidden border border-border max-w-2xl">
        {credentials.map((cred) => (
          <div key={cred.label} className="bg-bg-secondary p-5 text-center">
            <div className="text-2xl font-semibold tracking-tight text-text-primary mb-1 tabular-nums">{cred.value}</div>
            <div className="text-xs text-text-muted">{cred.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
