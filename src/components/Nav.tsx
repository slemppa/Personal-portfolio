import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Menu, X, ArrowUpRight } from 'lucide-react'

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
  const [scrolled, setScrolled] = useState(false)

  // Estä taustan vieritys kun mobiilivalikko on auki
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Nav saa hairline-reunan ja taustan vasta kun sivua on vieritetty
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? 'bg-bg-primary/70 backdrop-blur-xl border-b border-border'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 sm:px-8 h-16 flex justify-between items-center">
        <Link to="/" className="group flex items-center gap-2.5" onClick={() => setOpen(false)}>
          <div className="w-8 h-8 rounded-lg bg-text-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-bg-primary font-bold text-[13px] tracking-tight">SK</span>
          </div>
          <span className="hidden sm:block text-text-primary text-[15px] font-semibold tracking-tight">Sami Kiias</span>
        </Link>

        {/* Desktop-valikko */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3 py-2 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors rounded-lg"
            >
              {link.label}
            </a>
          ))}
          <Link
            to="/blog"
            className="px-3 py-2 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors rounded-lg"
          >
            Blog
          </Link>

          <span className="mx-2 w-px h-4 bg-border" aria-hidden="true" />

          {companyLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1 px-3 py-2 text-text-secondary text-sm font-medium hover:text-text-primary transition-colors rounded-lg"
            >
              {link.label}
              <ArrowUpRight className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" />
            </a>
          ))}

          <a
            href="/#contact"
            className="ml-2 px-4 py-2 bg-text-primary text-bg-primary text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
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
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
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
            <span className="eyebrow mb-1">Yritykset</span>
            {companyLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between py-3 text-text-secondary text-base font-medium hover:text-text-primary transition-colors"
              >
                {link.label}
                <ArrowUpRight className="w-4 h-4 opacity-50" />
              </a>
            ))}

            <a
              href="/#contact"
              onClick={() => setOpen(false)}
              className="mt-3 px-4 py-3 bg-text-primary text-bg-primary text-base font-semibold rounded-lg text-center"
            >
              Ota yhteyttä
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}
