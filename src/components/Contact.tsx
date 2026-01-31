import { Mail, Linkedin, Youtube, Github } from 'lucide-react'

const links = [
  { icon: Mail, label: 'sami@rascalai.fi', href: 'mailto:sami@rascalai.fi' },
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/samikiias' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@samikiias' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/samikiias' }
]

const companies = [
  {
    name: 'Rascal AI',
    description: 'AI-pohjaiset myynti- ja asiakaspalveluautomaatiot',
    href: 'https://rascal.ai'
  },
  {
    name: 'Mak8r.fi',
    description: 'AI-automaatiokonsultointia pk-yrityksille',
    href: 'https://mak8r.fi'
  }
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Ota yhteyttä</h2>
      <p className="text-text-muted mb-12">Keskustellaan miten voin auttaa</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-4">
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target={link.href.startsWith('mailto') ? undefined : '_blank'}
              rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
              className="flex items-center gap-4 p-4 bg-bg-secondary border border-border rounded-xl hover:border-accent hover:bg-bg-tertiary transition-all"
            >
              <link.icon className="w-6 h-6 text-accent flex-shrink-0" />
              <span className="font-medium">{link.label}</span>
            </a>
          ))}
        </div>

        <div className="space-y-4">
          {companies.map((company) => (
            <a
              key={company.name}
              href={company.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent hover:translate-x-1 transition-all"
            >
              <h3 className="text-lg font-semibold mb-2 bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                {company.name}
              </h3>
              <p className="text-text-secondary text-sm">{company.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
