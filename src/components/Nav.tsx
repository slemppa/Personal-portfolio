export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <a href="#" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SK</span>
          </div>
          <span className="hidden sm:block text-text-primary font-semibold">Sami Kiias</span>
        </a>
        <div className="hidden md:flex items-center gap-8">
          <a href="#cases" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Projektit
          </a>
          <a href="#tech" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tech
          </a>
          <a href="#story" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tarina
          </a>
          <a
            href="#contact"
            className="px-4 py-2 bg-gradient-to-r from-accent to-purple-500 text-white text-sm font-medium rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Ota yhteyttä
          </a>
        </div>
      </div>
    </nav>
  )
}
