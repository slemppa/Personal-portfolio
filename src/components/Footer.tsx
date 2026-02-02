import { Heart, Code } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="py-12 px-8 border-t border-border">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">SK</span>
            </div>
            <span className="text-text-muted text-sm">Sami Kiias</span>
          </div>

          <p className="text-center text-sm text-text-muted flex items-center gap-1">
            Rakennettu
            <Heart className="w-4 h-4 text-red-400" />
            ja
            <Code className="w-4 h-4 text-accent" />
            &copy; 2026
          </p>

          <div className="flex gap-4">
            <a href="https://linkedin.com/in/samikiias" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors text-sm">
              LinkedIn
            </a>
            <a href="https://github.com/slemppa" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors text-sm">
              GitHub
            </a>
            <a href="https://youtube.com/@samikiias" target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent transition-colors text-sm">
              YouTube
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
