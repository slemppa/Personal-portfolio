import { Mail, Linkedin, Youtube, Github, ArrowRight, Calendar, MessageSquare } from 'lucide-react'

const links = [
  { icon: Linkedin, label: 'LinkedIn', href: 'https://linkedin.com/in/samikiias', description: 'Verkostoidu' },
  { icon: Youtube, label: 'YouTube', href: 'https://youtube.com/@samikiias', description: 'Katso sisältöä' },
  { icon: Github, label: 'GitHub', href: 'https://github.com/slemppa', description: 'Tutustu koodiin' }
]

const companies = [
  {
    name: 'Rascal AI',
    role: 'CTO',
    description: 'AI-pohjaiset myynti- ja asiakaspalveluautomaatiot pk-yrityksille',
    href: 'https://rascalai.fi'
  },
  {
    name: 'Rascal Pages',
    role: 'Founder',
    description: 'AI-pohjaiset verkkosivut ja sisällöntuotanto',
    href: 'https://rascalpages.fi'
  },
  {
    name: 'Mak8r.fi',
    role: 'Founder',
    description: 'AI-automaatiokonsultointia ja räätälöityjä järjestelmiä',
    href: 'https://mak8r.fi'
  }
]

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-8">
      {/* CTA Banner */}
      <div className="max-w-4xl mx-auto mb-16">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-accent via-purple-500 to-emerald-500 p-[1px]">
          <div className="bg-bg-primary rounded-3xl p-8 md:p-12">
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full mb-6">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                <span className="text-emerald-400 text-sm font-medium">Vapaita aikoja helmikuussa</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                <span className="text-text-primary">Rakennetaan jotain </span>
                <span className="bg-gradient-to-r from-accent via-purple-400 to-emerald-400 bg-clip-text text-transparent">merkittävää</span>
              </h2>

              <p className="text-text-secondary text-lg mb-8 max-w-xl mx-auto">
                Kerro projektistasi ja katsotaan miten AI-automaatiot voivat säästää aikaasi ja tehostaa liiketoimintaasi.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:sami@rascalai.fi"
                  className="group inline-flex items-center justify-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-purple-500 text-white font-semibold rounded-xl hover:-translate-y-1 hover:shadow-xl hover:shadow-accent/25 transition-all duration-300"
                >
                  <Mail className="w-5 h-5" />
                  sami@rascalai.fi
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Social links */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-accent" />
              Seuraa ja verkostoidu
            </h3>
            <div className="space-y-3">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-4 p-4 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 hover:bg-bg-tertiary transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                    <link.icon className="w-5 h-5 text-accent" />
                  </div>
                  <div className="flex-1">
                    <span className="font-medium text-text-primary">{link.label}</span>
                    <p className="text-sm text-text-muted">{link.description}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </a>
              ))}
            </div>
          </div>

          {/* Companies */}
          <div>
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-accent" />
              Yritykset
            </h3>
            <div className="space-y-3">
              {companies.map((company) => (
                <a
                  key={company.name}
                  href={company.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block p-6 bg-bg-secondary border border-border rounded-xl hover:border-accent/50 hover:bg-bg-tertiary transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="text-lg font-semibold bg-gradient-to-r from-accent to-purple-500 bg-clip-text text-transparent">
                      {company.name}
                    </h4>
                    <span className="px-2 py-0.5 bg-accent/10 rounded text-xs text-accent font-medium">
                      {company.role}
                    </span>
                  </div>
                  <p className="text-text-secondary text-sm">{company.description}</p>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
