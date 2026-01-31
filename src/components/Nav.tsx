export default function Nav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-8 py-4 flex justify-between items-center">
        <a href="#" className="text-xl font-bold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
          SL
        </a>
        <div className="hidden md:flex gap-8">
          <a href="#cases" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Projektit
          </a>
          <a href="#tech" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tech
          </a>
          <a href="#story" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Tarina
          </a>
          <a href="#contact" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Yhteystiedot
          </a>
        </div>
      </div>
    </nav>
  )
}
