export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-8 pt-24 pb-16">
      <div className="max-w-6xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left - Text Content */}
          <div>
            <p className="text-accent font-medium mb-4 animate-fade-in-up animation-delay-100">
              Sami Kiias
            </p>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
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

          {/* Right - Profile Image */}
          <div className="flex justify-center lg:justify-end animate-fade-in-up animation-delay-300">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-purple-500/20 rounded-2xl blur-2xl"></div>
              <img
                src="/profile.jpg"
                alt="Sami Kiias"
                className="relative w-80 h-80 lg:w-96 lg:h-96 object-cover rounded-2xl border border-border shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
