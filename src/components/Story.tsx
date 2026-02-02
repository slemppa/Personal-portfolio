import { Briefcase, GraduationCap, Code, Rocket } from 'lucide-react'

const timeline = [
  {
    icon: Briefcase,
    year: '2013',
    title: 'Yrittäjä',
    subtitle: 'Ensimmäinen yritys',
    description: 'Aloitin yrittäjänä. Opin ymmärtämään asiakkaita, myyntiä ja liiketoiminnan perusteita käytännön kautta.',
    active: false
  },
  {
    icon: GraduationCap,
    year: '2018',
    title: 'Markkinoija',
    subtitle: 'Haaga-Helia',
    description: 'Liiketalouden tradenomi markkinoinnin suuntautumisella. Digitaalinen markkinointi ja analytiikka.',
    active: false
  },
  {
    icon: Code,
    year: '2021',
    title: 'Kehittäjä',
    subtitle: 'Full-stack',
    description: 'Itseoppinut kehittäjä. React, TypeScript, Node.js ja modernit pilvipalvelut. Ideat muuttuivat tuotteiksi.',
    active: false
  },
  {
    icon: Rocket,
    year: '2024',
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
    <section id="story" className="py-24 px-8 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Tarina</h2>
        <p className="text-text-muted max-w-xl mx-auto">
          Epätyypillinen polku yrittäjästä AI-järjestelmien rakentajaksi.
          Jokainen vaihe toi uuden näkökulman.
        </p>
      </div>

      {/* Timeline */}
      <div className="max-w-3xl mx-auto mb-16">
        <div className="grid gap-6">
          {timeline.map((item) => (
            <div
              key={item.title}
              className={`group relative flex gap-6 p-6 rounded-2xl border transition-all ${
                item.active
                  ? 'bg-gradient-to-r from-accent/10 to-purple-500/10 border-accent/30'
                  : 'bg-bg-secondary border-border hover:border-border-hover'
              }`}
            >
              {/* Year badge */}
              <div className="hidden sm:flex flex-col items-center">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                  item.active
                    ? 'bg-gradient-to-br from-accent to-purple-500'
                    : 'bg-bg-tertiary border border-border'
                }`}>
                  <item.icon className={`w-6 h-6 ${item.active ? 'text-white' : 'text-text-muted'}`} />
                </div>
                <span className={`mt-2 text-sm font-bold ${item.active ? 'text-accent' : 'text-text-muted'}`}>
                  {item.year}
                </span>
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="sm:hidden text-sm font-bold text-accent">{item.year}</span>
                  <h3 className="text-lg font-semibold text-text-primary">{item.title}</h3>
                  <span className="px-2 py-0.5 bg-bg-tertiary rounded text-xs text-text-muted">
                    {item.subtitle}
                  </span>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{item.description}</p>
              </div>

              {/* Active indicator */}
              {item.active && (
                <div className="absolute -right-2 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-accent to-purple-500 rounded-full" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Quote */}
      <div className="max-w-2xl mx-auto mb-12">
        <blockquote className="relative p-8 bg-bg-secondary border border-border rounded-2xl">
          <div className="absolute -top-4 left-8 text-6xl text-accent/20 font-serif">"</div>
          <p className="text-xl text-text-primary italic mb-4 relative z-10">
            Epätyypillinen tausta on vahvuus – ymmärrän sekä bisneksen että teknologian kielen.
          </p>
          <footer className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <span className="text-white text-sm font-bold">SK</span>
            </div>
            <div>
              <div className="font-medium text-text-primary">Sami Kiias</div>
              <div className="text-sm text-text-muted">CTO @ Rascal AI</div>
            </div>
          </footer>
        </blockquote>
      </div>

      {/* Credentials */}
      <div className="grid grid-cols-3 gap-4 max-w-xl mx-auto">
        {credentials.map((cred) => (
          <div key={cred.label} className="text-center p-4 bg-bg-secondary border border-border rounded-xl">
            <div className="text-2xl font-bold text-text-primary mb-1">{cred.value}</div>
            <div className="text-xs text-text-muted">{cred.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
