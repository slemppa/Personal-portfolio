import { Youtube, Play, ExternalLink, Video, Users, Eye } from 'lucide-react'

const topics = [
  { title: 'n8n-automaatiot', description: 'Workflow-automaatioiden rakentaminen alusta loppuun' },
  { title: 'Supabase & RAG', description: 'Vektoritietokannat ja semanttinen haku' },
  { title: 'Voice AI', description: 'AI-puhelinpalveluiden toteutus ja integraatiot' },
  { title: 'Build in Public', description: 'Startup-rakentamisen dokumentointi reaaliajassa' }
]

export default function YouTube() {
  return (
    <section id="youtube" className="py-24 px-8 bg-gradient-to-b from-bg-primary to-bg-secondary/30">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-500/10 border border-red-500/20 rounded-full mb-6">
            <Youtube className="w-4 h-4 text-red-500" />
            <span className="text-red-400 text-sm font-medium">YouTube-kanava</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-4">Build in Public</h2>
          <p className="text-text-muted max-w-xl mx-auto">
            Dokumentoin matkaa AI-järjestelmien rakentajana. Tutoriaaleja, projektien läpikäyntejä ja rehellisiä ajatuksia.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          {/* Video preview card */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="aspect-video bg-gradient-to-br from-bg-secondary to-bg-tertiary border border-border rounded-2xl overflow-hidden">
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-20 h-20 rounded-full bg-red-500/90 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 text-white ml-1" />
                  </div>
                  <p className="text-lg font-semibold text-text-primary">@samikiias</p>
                  <p className="text-sm text-text-muted">AI & Automaatio</p>
                </div>
              </div>
              <a
                href="https://youtube.com/@samikiias"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-500 text-white font-medium rounded-xl hover:-translate-y-0.5 hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                <Youtube className="w-5 h-5" />
                Tilaa kanava
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Content topics */}
          <div className="lg:col-span-3">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <Video className="w-5 h-5 text-accent" />
              Sisältöä näistä aiheista
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic) => (
                <div
                  key={topic.title}
                  className="p-4 bg-bg-secondary border border-border rounded-xl hover:border-red-500/30 transition-colors"
                >
                  <h4 className="font-semibold text-text-primary mb-1">{topic.title}</h4>
                  <p className="text-sm text-text-muted">{topic.description}</p>
                </div>
              ))}
            </div>

            {/* Value proposition */}
            <div className="mt-6 p-4 bg-bg-tertiary/50 border border-border rounded-xl">
              <p className="text-sm text-text-secondary">
                <span className="text-accent font-medium">Miksi seurata?</span> Jaan käytännön kokemuksia oikeista projekteista –
                ei teorioita vaan toimivia ratkaisuja joita voit hyödyntää omissa projekteissasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
