export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-bg-primary via-bg-primary to-accent/5"></div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px]"></div>

      {/* Background Image - Right Side */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[40%] h-[60vh] hidden lg:block animate-fade-in-up animation-delay-300">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent z-10 w-32"></div>
        <img
          src="/portfolio-hero-fix.png"
          alt="Sami Kiias"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-transparent to-bg-primary/50 z-10"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 py-24 lg:py-0">
          <div className="max-w-2xl">
            {/* Status badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6 animate-fade-in-up animation-delay-100">
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
              <span className="text-emerald-400 text-sm font-medium">Avoin uusille projekteille</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up animation-delay-200">
              <span className="text-text-primary">Rakennan </span>
              <span className="bg-gradient-to-r from-accent via-purple-400 to-emerald-400 bg-clip-text text-transparent">AI-järjestelmiä</span>
              <br />
              <span className="text-text-primary">jotka säästävät aikaa</span>
            </h1>

            <p className="text-xl text-text-secondary mb-4 animate-fade-in-up animation-delay-300">
              CTO @ Rascal AI · Founder @ Mak8r.fi
            </p>

            <p className="text-lg text-text-muted mb-8 max-w-xl animate-fade-in-up animation-delay-300">
              Multi-tenant SaaS-arkkitehtuurit, n8n-automaatiot ja voice AI -integraatiot.
              11 vuotta yrittäjyyttä. Markkinointi + teknologia = ratkaisuja jotka toimii.
            </p>

            {/* Key metrics */}
            <div className="grid grid-cols-3 gap-6 mb-10 animate-fade-in-up animation-delay-400">
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-text-primary">50+</div>
                <div className="text-sm text-text-muted">Tuotantoautomaatiota</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-text-primary">10h</div>
                <div className="text-sm text-text-muted">Säästöä / viikko</div>
              </div>
              <div className="text-center lg:text-left">
                <div className="text-3xl font-bold text-text-primary">11v</div>
                <div className="text-sm text-text-muted">Yrittäjäkokemus</div>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-wrap gap-4 mb-10 animate-fade-in-up animation-delay-500">
              <a
                href="#contact"
                className="group px-8 py-4 bg-gradient-to-r from-accent to-purple-500 text-white font-semibold rounded-xl hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/25 transition-all duration-300"
              >
                Keskustellaan projektista
                <span className="inline-block ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </a>
              <a
                href="#cases"
                className="px-8 py-4 bg-bg-secondary border border-border text-text-primary font-semibold rounded-xl hover:bg-bg-tertiary hover:border-border-hover transition-all duration-300"
              >
                Katso projektit
              </a>
            </div>

            {/* Tech tags */}
            <div className="flex flex-wrap gap-2 animate-fade-in-up animation-delay-500">
              {['n8n', 'Supabase', 'React', 'Voice AI', 'RAG', 'Multi-tenant'].map((tech) => (
                <span
                  key={tech}
                  className="px-3 py-1.5 bg-bg-secondary/50 border border-border/50 rounded-lg text-xs text-text-muted hover:border-accent/50 hover:text-accent transition-colors cursor-default"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden lg:block">
        <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center">
          <div className="w-1 h-3 bg-text-muted rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
