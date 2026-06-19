import { ArrowRight } from 'lucide-react'
import { usePostHog } from '@posthog/react'
import Reveal from './Reveal'

// The repeated slogans on the scrolling belt. Short, punchy, brand-defining.
const belt = [
  'Automaatio on uusi lukutaito',
  'Tylsät työt kuuluvat koneille',
  'Rakennettu > ostettu',
  'Tuotantoa, ei demoja',
  'Jos teet sen kahdesti, automatisoi se',
  'Koodi on 2020-luvun kynä'
]

// The theses — the creed. Each is a single, declarative belief. The key
// phrase is lifted to text-primary so the line reads at a glance.
const theses: { n: string; lead: string; rest: string }[] = [
  {
    n: '01',
    lead: 'Automaatio ei ole IT-projekti.',
    rest: 'Se on uusi lukutaito. Kuka sen oppii, kirjoittaa oman aikansa uusiksi — kuka ei, jää lukemaan muiden tekstiä.'
  },
  {
    n: '02',
    lead: 'Tylsät työt kuuluvat koneille.',
    rest: 'Ihmiselle jää se mikä on oikeasti arvokasta: ajattelu, suhteet ja rakentaminen. Kone hoitaa toiston.'
  },
  {
    n: '03',
    lead: 'AI ei vie työtäsi.',
    rest: 'Sen vie joku, joka osaa käyttää AI:ta paremmin kuin sinä. Valinta on kumpaa puolta seisot.'
  },
  {
    n: '04',
    lead: 'Rakennettu voittaa ostetun,',
    rest: 'kun ymmärrät miten kone toimii. Valmis työkalu sopeuttaa sinut itseensä — oma järjestelmä sopeutuu sinuun.'
  },
  {
    n: '05',
    lead: 'Demo on helppo. Tuotanto on totuus.',
    rest: 'Slide deck ei pyöritä yritystä. Arvo syntyy vasta kun järjestelmä toimii oikeilla asiakkailla, joka päivä.'
  },
  {
    n: '06',
    lead: 'Jos teet sen kahdesti,',
    rest: 'kone tekee sen kolmannen kerran. Jokainen toistuva klikkaus on automaatio, jota et ole vielä rakentanut.'
  }
]

function Belt() {
  // Duplicated track: the -50% keyframe lands seamlessly on the copy.
  const items = [...belt, ...belt]
  return (
    <div className="marquee-mask relative select-none border-y border-border py-5 overflow-hidden" aria-hidden="true">
      <div className="marquee items-center gap-6">
        {items.map((phrase, i) => (
          <div key={i} className="flex items-center gap-6 shrink-0">
            <span className="text-lg md:text-xl font-semibold tracking-tight text-text-secondary whitespace-nowrap">
              {phrase}
            </span>
            <span className="text-accent" aria-hidden="true">✦</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Manifesto() {
  const posthog = usePostHog()

  return (
    <section id="manifesto" className="relative scroll-mt-20 overflow-hidden">
      {/* Soft accent bloom anchoring the creed */}
      <div
        className="pointer-events-none absolute left-1/2 top-24 -translate-x-1/2 w-[70%] h-72 aurora blur-3xl opacity-60"
        aria-hidden="true"
      />

      <Belt />

      <div className="relative max-w-6xl mx-auto px-6 sm:px-8 py-24 md:py-32">
        {/* The creed */}
        <Reveal>
          <span className="eyebrow text-accent">Manifesti</span>
          <h2 className="display display-xl mt-5 text-text-primary">
            Automaatio on
            <br />
            <span className="text-gradient-accent">uusi lukutaito.</span>
          </h2>
          <p className="mt-8 max-w-2xl text-lg md:text-xl text-text-secondary leading-relaxed">
            Edellinen sukupolvi oppi lukemaan ja kirjoittamaan. Tämä sukupolvi oppii
            saamaan koneet tekemään työn puolestaan. En myy automaatiota palveluna —
            <span className="text-text-primary"> julistan sitä taitona, jonka jokaisen kannattaa oppia.</span>
          </p>
        </Reveal>

        {/* The theses */}
        <div className="mt-16 md:mt-20 grid md:grid-cols-2 gap-x-12">
          {theses.map((t, i) => (
            <Reveal key={t.n} delay={(i % 2) * 70}>
              <div className="group flex gap-5 py-7 border-t border-border">
                <span className="font-mono text-sm text-accent pt-1 tabular-nums shrink-0">{t.n}</span>
                <p className="text-xl md:text-2xl leading-snug tracking-tight text-text-muted">
                  <span className="font-semibold text-text-primary">{t.lead}</span>{' '}
                  {t.rest}
                </p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Close — pull the believer toward the proof and the audience */}
        <Reveal delay={80}>
          <div className="mt-16 flex flex-col sm:flex-row sm:items-center gap-4">
            <a
              href="#cases"
              onClick={() => posthog?.capture('manifesto_cta_clicked', { cta_label: 'Näin se näyttää tuotannossa' })}
              className="group inline-flex items-center gap-2 px-5 py-3 bg-text-primary text-bg-primary font-semibold rounded-xl hover:opacity-90 transition-opacity"
            >
              Näin se näyttää tuotannossa
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </a>
            <a
              href="https://www.youtube.com/@samikiias?sub_confirmation=1"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => posthog?.capture('manifesto_cta_clicked', { cta_label: 'Seuraa matkaa' })}
              className="inline-flex items-center gap-2 px-5 py-3 bg-bg-secondary/60 backdrop-blur-sm border border-border text-text-primary font-semibold rounded-xl hover:border-border-hover hover:bg-bg-tertiary transition-all"
            >
              Seuraa matkaa
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
