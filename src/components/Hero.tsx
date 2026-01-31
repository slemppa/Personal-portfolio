export default function Hero() {
  return (
    <section className="min-h-screen flex items-center px-8 pt-24 pb-16">
      <div className="max-w-3xl mx-auto">
        <p className="text-accent font-medium mb-4 animate-fade-in-up animation-delay-100">
          Hei, olen Sami
        </p>
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight mb-6 bg-gradient-to-b from-text-primary to-text-secondary bg-clip-text text-transparent animate-fade-in-up animation-delay-200">
          Rakennan AI-järjestelmiä<br />jotka tekevät oikeasti töitä
        </h1>
        <p className="text-xl text-text-secondary mb-8 max-w-xl animate-fade-in-up animation-delay-300">
          Full-stack kehittäjä & AI-automaatioiden rakentaja.
          CTO @ Rascal AI. Autan pk-yrityksiä automatisoimaan myyntiä ja asiakaspalvelua.
        </p>
        <div className="flex flex-wrap gap-3 mb-10 animate-fade-in-up animation-delay-400">
          <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
            CTO & Co-Founder @ Rascal AI
          </span>
          <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
            Yrittäjä @ Mak8r.fi
          </span>
          <span className="px-4 py-2 bg-bg-secondary border border-border rounded-full text-sm text-text-secondary">
            Content Creator @ YouTube
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
    </section>
  )
}
