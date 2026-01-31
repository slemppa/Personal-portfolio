const timeline = [
  {
    title: 'Hieroja',
    description: 'Aloitin urani aivan eri alalla. Opin ymmärtämään asiakkaita ja heidän tarpeitaan käytännön työssä.',
    active: false
  },
  {
    title: 'Markkinoija',
    description: 'Haaga-Helia antoi liiketoimintaymmärryksen. Markkinoinnin kautta opin miten teknologia palvelee bisnestä.',
    active: false
  },
  {
    title: 'Kehittäjä',
    description: 'Full-stack kehitys avasi ovet. React, Node.js ja modernit työkalut mahdollistivat ideoiden toteuttamisen.',
    active: false
  },
  {
    title: 'CTO & AI Builder',
    description: 'Nyt rakennan AI-järjestelmiä jotka automatisoivat oikeita työtehtäviä. Rascal AI, Mak8r.fi ja YouTube-kanava.',
    active: true
  }
]

export default function Story() {
  return (
    <section id="story" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Tarina</h2>
      <p className="text-text-muted mb-12">Epätyypillinen polku teknologiaan</p>

      <div className="max-w-2xl mx-auto mb-12 pl-8 relative">
        <div className="absolute left-[7px] top-0 bottom-0 w-0.5 bg-border" />

        {timeline.map((item) => (
          <div key={item.title} className="relative pb-8 last:pb-0">
            <div
              className={`absolute -left-8 top-1 w-4 h-4 rounded-full border-2 ${
                item.active
                  ? 'border-accent bg-accent shadow-lg shadow-accent/50'
                  : 'border-border bg-bg-primary'
              }`}
            />
            <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
            <p className="text-text-secondary text-sm">{item.description}</p>
          </div>
        ))}
      </div>

      <blockquote className="max-w-2xl mx-auto p-8 bg-bg-secondary border-l-4 border-accent rounded-r-xl text-lg italic">
        "Epätyypillinen tausta on vahvuus – ymmärrän sekä bisneksen että teknologian kielen."
      </blockquote>
    </section>
  )
}
