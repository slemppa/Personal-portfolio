import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Menu, X, ExternalLink } from 'lucide-react'

const navLinks = [
  { label: 'Projektit', href: '/#cases' },
  { label: 'Tech', href: '/#tech' },
  { label: 'Tarina', href: '/#story' }
]

const companyLinks = [
  { label: 'Rascal AI', href: 'https://rascalai.fi' },
  { label: 'Mak8r.fi', href: 'https://mak8r.fi' }
]

export default function Nav() {
  const [open, setOpen] = useState(false)

  // Estä taustan vieritys kun mobiilivalikko on auki
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-primary/80 backdrop-blur-xl border-b border-border">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-purple-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SK</span>
          </div>
          <span className="hidden sm:block text-text-primary font-semibold">Sami Kiias</span>
        </Link>

        {/* Desktop-valikko */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors"
            >
              {link.label}
            </a>
          ))}
          <Link to="/blog" className="text-text-secondary text-sm font-medium hover:text-text-primary transition-colors">
            Blog
          </Link>

          <span className="w-px h-5 bg-border" aria-hidden="true" />

          {companyLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-text-secondary text-sm font-medium hover:text-accent transition-colors"
            >
              {link.label}
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ))}

          <a
            href="/#contact"
            className="px-4 py-2 bg-gradient-to-r from-accent to-purple-500 text-white text-sm font-medium rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Ota yhteyttä
          </a>
        </div>

        {/* Mobiilin hampurilaispainike */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden flex items-center justify-center w-10 h-10 -mr-2 text-text-primary"
          aria-label={open ? 'Sulje valikko' : 'Avaa valikko'}
          aria-expanded={open}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobiilivalikko */}
      {open && (
        <div className="md:hidden border-t border-border bg-bg-primary/95 backdrop-blur-xl">
          <div className="px-6 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setOpen(false)}
                className="py-3 text-text-secondary text-base font-medium hover:text-text-primary transition-colors"
              >
                {link.label}
              </a>
            ))}
            <Link
              to="/blog"
              onClick={() => setOpen(false)}
              className="py-3 text-text-secondary text-base font-medium hover:text-text-primary transition-colors"
            >
              Blog
            </Link>

            <div className="my-2 border-t border-border" />
            <span className="text-xs font-semibold uppercase tracking-wider text-text-muted mb-1">Yritykset</span>
            {companyLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3 text-text-secondary text-base font-medium hover:text-accent transition-colors"
              >
                {link.label}
                <ExternalLink className="w-4 h-4" />
              </a>
            ))}

            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 px-4 py-3 bg-gradient-to-r from-accent to-purple-500 text-white text-base font-medium rounded-lg text-center"
            >
              Ota yhteyttä
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
