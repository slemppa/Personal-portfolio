import { Link } from 'react-router'

const social = [
  { label: 'LinkedIn', href: 'https://linkedin.com/in/samikiias' },
  { label: 'GitHub', href: 'https://github.com/slemppa' },
  { label: 'YouTube', href: 'https://youtube.com/@samikiias' }
]

export default function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center">
              <span className="text-bg-primary font-bold text-[13px] tracking-tight">SK</span>
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-text-primary">Sami Kiias</div>
              <div className="text-[13px] text-text-muted">AI Systems Builder</div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/blog" className="text-sm text-text-secondary hover:text-text-primary transition-colors">
              Blog
            </Link>
            {social.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-text-secondary hover:text-text-primary transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-[13px] text-text-muted">© 2026 Sami Kiias. Kaikki oikeudet pidätetään.</p>
          <p className="text-[13px] text-text-muted">Rakennettu Reactilla &amp; Tailwindilla.</p>
        </div>
      </div>
    </footer>
  )
}
