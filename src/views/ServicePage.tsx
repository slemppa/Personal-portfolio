import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Markdown from '../components/Markdown'
import ContactForm from '../components/ContactForm'
import type { ServicePage as ServicePageData } from '../lib/servicePages'

/**
 * Template for the Finnish service, guide and about pages: one H1, a short
 * direct answer under it, question-shaped H2 sections, a visible FAQ and a
 * contact form. Content lives in lib/servicePages.ts.
 */
export default function ServicePage({ page }: { page: ServicePageData }) {
  return (
    <>
      <Nav lang="fi" />
      <main className="mx-auto min-h-screen max-w-3xl px-8 pb-24 pt-32">
        <article>
          <header className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-text-primary md:text-5xl">{page.h1}</h1>
            <div className="mt-6 text-lg">
              <Markdown>{page.lead}</Markdown>
            </div>
          </header>

          {page.sections.map((section) => (
            <section key={section.heading} className="mt-14">
              <h2 className="mb-4 text-2xl font-semibold text-text-primary">{section.heading}</h2>
              <Markdown>{section.body}</Markdown>
            </section>
          ))}

          {page.faq.length > 0 && (
            <section className="mt-16" aria-labelledby="ukk">
              <h2 id="ukk" className="mb-6 text-2xl font-semibold text-text-primary">
                Usein kysytyt kysymykset
              </h2>
              <div className="space-y-3">
                {page.faq.map((item) => (
                  <details key={item.question} className="rounded-xl border border-border bg-bg-secondary p-5" open>
                    <summary className="cursor-pointer font-semibold text-text-primary">
                      <h3 className="inline">{item.question}</h3>
                    </summary>
                    <div className="mt-3">
                      <Markdown>{item.answer}</Markdown>
                    </div>
                  </details>
                ))}
              </div>
            </section>
          )}
        </article>

        <section className="mt-20 rounded-2xl border border-border bg-bg-secondary p-8">
          <h2 className="mb-2 text-center text-2xl font-semibold text-text-primary">{page.cta.title}</h2>
          <p className="mx-auto mb-8 max-w-lg text-center text-text-secondary">{page.cta.body}</p>
          <div className="mx-auto max-w-lg">
            <ContactForm source={`service:${page.slug}`} lang="fi" />
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
