export default function Hero() {
  return (
    <section className="min-h-screen relative overflow-hidden">
      {/* Background Image - Right Side, 50% height */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-[50vh] hidden lg:block animate-fade-in-up animation-delay-300">
        <div className="absolute inset-0 bg-gradient-to-r from-bg-primary to-transparent z-10 w-24"></div>
        <img
          src="/portfolio-hero-fix.png"
          alt="Sami Kiias"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Text Content - 2/3 width, centered */}
      <div className="min-h-screen flex items-center justify-center px-8 lg:pr-[33%]">
        <div className="max-w-2xl">
          <p className="text-accent font-medium mb-4 animate-fade-in-up animation-delay-100">
            Sami Kiias
          </p>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
            Rakennan AI-järjestelmiä jotka tekevät oikeasti töitä
          </h1>
          <p className="text-lg text-text-secondary mb-6 animate-fade-in-up animation-delay-300">
            CTO & Co-Founder @ Rascal AI. Rakennan multi-tenant SaaS-alustoja,
            n8n-automaatioita ja voice AI -integraatioita. Markkinointitausta
            Haaga-Heliasta + full-stack kehitys = ymmärrän mitä bisnes oikeesti tarvii.
          </p>
          <p className="text-text-muted mb-8 animate-fade-in-up animation-delay-300">
            Dokumentoin matkan YouTubessa (@samikiias). Building in public, virheet mukaan lukien.
          </p>

          <div className="flex flex-wrap gap-3 mb-8 animate-fade-in-up animation-delay-400">
            <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
              CTO @ Rascal AI
            </span>
            <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
              Founder @ Mak8r.fi
            </span>
            <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
              @samikiias
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-8 animate-fade-in-up animation-delay-400">
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              n8n
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              Supabase
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              Voice AI
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              React
            </span>
            <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400">
              Full-stack
            </span>
          </div>

          <div className="flex gap-4 animate-fade-in-up animation-delay-500">
            <a
              href="#contact"
              className="px-6 py-3 bg-gradient-to-r from-accent to-purple-500 text-white font-medium rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all"
            >
              Ota yhteyttä
            </a>
            <a
              href="https://youtube.com/@samikiias"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 bg-bg-tertiary border border-border text-text-primary font-medium rounded-lg hover:bg-bg-secondary hover:border-border-hover transition-all"
            >
              YouTube
            </a>
          </div>
        </div>
      </div>

      {/* Mobile Image */}
      <div className="lg:hidden px-8 pb-16">
        <img
          src="/portfolio-hero-fix.png"
          alt="Sami Kiias"
          className="w-full h-64 object-cover object-top rounded-2xl"
        />
      </div>
    </section>
  )
}
