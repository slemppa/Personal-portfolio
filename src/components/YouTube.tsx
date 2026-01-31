import { Youtube } from 'lucide-react'

export default function YouTube() {
  return (
    <section id="youtube" className="py-24 px-8 max-w-6xl mx-auto">
      <h2 className="text-3xl md:text-4xl font-semibold tracking-tight mb-2">Build in Public</h2>
      <p className="text-text-muted mb-12">Rakennan julkisesti ja jaan oppimani</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="aspect-video bg-bg-secondary border border-border rounded-2xl flex flex-col items-center justify-center gap-4">
          <Youtube className="w-16 h-16 text-red-500" />
          <p className="text-xl font-medium">@samikiias</p>
          <a
            href="https://youtube.com/@samikiias"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 bg-gradient-to-r from-accent to-purple-500 text-white font-medium rounded-lg hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/30 transition-all"
          >
            Katso kanavalla
          </a>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">AI-automaatiosisaltoa</h3>
          <p className="text-text-secondary mb-6">
            Dokumentoin matkaa AI-jarjestelmien rakentajana. Tutoriaaleja,
            projektien lapikäynteja ja ajatuksia teknologian kehityksesta.
          </p>
          <ul className="space-y-3">
            {[
              'n8n-automaatiotutoriaalit',
              'Supabase & RAG -toteutukset',
              'Voice AI -demot',
              'Startup-rakentamisen arki'
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-text-secondary">
                <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
