import { Youtube, Play, ArrowUpRight } from 'lucide-react'
import { usePostHog } from '@posthog/react'
import SectionHeading from './SectionHeading'
import Reveal from './Reveal'

const topics = [
  { title: 'n8n-automaatiot', description: 'Workflow-automaatioiden rakentaminen alusta loppuun' },
  { title: 'Supabase & RAG', description: 'Vektoritietokannat ja semanttinen haku' },
  { title: 'Voice AI', description: 'AI-puhelinpalveluiden toteutus ja integraatiot' },
  { title: 'Build in Public', description: 'Startup-rakentamisen dokumentointi reaaliajassa' }
]

export default function YouTube() {
  const posthog = usePostHog()

  return (
    <section id="youtube" className="py-24 px-6 sm:px-8 scroll-mt-20">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          index="03"
          eyebrow="YouTube · @samikiias"
          title="Build in Public"
          description="Dokumentoin matkaa AI-järjestelmien rakentajana. Tutoriaaleja, projektien läpikäyntejä ja rehellisiä ajatuksia."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch mt-12">
          {/* Video preview card */}
          <Reveal className="lg:col-span-2" as="div">
            <div className="group h-full flex flex-col">
              <div className="relative flex-1 aspect-video lg:aspect-auto surface-card rounded-2xl overflow-hidden min-h-[220px]">
                <div className="absolute inset-0 grid-texture opacity-60" aria-hidden="true" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mb-4 shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
                    <Play className="w-6 h-6 text-white ml-0.5" fill="currentColor" />
                  </div>
                  <p className="text-base font-semibold text-text-primary">@samikiias</p>
                  <p className="text-sm text-text-muted">AI &amp; Automaatio</p>
                </div>
              </div>
              <a
                href="https://www.youtube.com/@samikiias?sub_confirmation=1"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => posthog?.capture('youtube_subscribe_clicked')}
                className="mt-3 inline-flex items-center justify-center gap-2 px-6 py-3 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
              >
                <Youtube className="w-5 h-5 text-red-500" />
                Tilaa kanava
                <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          </Reveal>

          {/* Content topics */}
          <div className="lg:col-span-3">
            <span className="eyebrow">Sisältöä näistä aiheista</span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              {topics.map((topic, i) => (
                <Reveal key={topic.title} delay={i * 60}>
                  <div className="h-full surface-card rounded-xl p-5 hover:border-border-hover transition-colors">
                    <h4 className="font-semibold text-text-primary mb-1">{topic.title}</h4>
                    <p className="text-sm text-text-muted leading-relaxed">{topic.description}</p>
                  </div>
                </Reveal>
              ))}
            </div>

            <div className="mt-3 rounded-xl border border-border bg-bg-tertiary/40 p-5">
              <p className="text-sm text-text-secondary leading-relaxed">
                <span className="text-text-primary font-medium">Miksi seurata?</span> Jaan käytännön kokemuksia oikeista
                projekteista – ei teorioita vaan toimivia ratkaisuja, joita voit hyödyntää omissa projekteissasi.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
