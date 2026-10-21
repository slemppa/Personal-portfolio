import type { MigrateDownArgs, MigrateUpArgs } from '@payloadcms/db-postgres'

// SEO-auditin (2026-10) korjaus: hakutuloksen otsikot ja kuvaukset niille
// julkaistuille postauksille, joiden oma otsikko tai kuvaus ei mahdu
// 30–60 / 70–160 merkkiin. Ei ylikirjoita administa jo täytettyä kenttää.
const META: { slug: string; lang: 'fi' | 'en'; metaTitle?: string; metaDescription?: string }[] = [
  { slug: 'konversio-optimointi-lisaa-liideja-ilman-lisaa-liikennetta', lang: 'fi', metaDescription: 'Näin pk-yritys saa nykyisestä liikenteestä enemmän liidejä: selkeämpi viesti, vähemmän kitkaa ja oikeat mittarit etusivulla, palvelusivuilla ja blogissa.' },
  { slug: 'konversio-optimointi-lisaa-liideja-ilman-lisaa-liikennetta', lang: 'en', metaTitle: 'Conversion optimization: more leads without more traffic', metaDescription: 'How an SME turns existing website visitors into leads: a clearer message, less friction and the right metrics on the homepage, service pages and blog.' },
  { slug: 'sisaltostrategia-hinta-mista-kustannus-syntyy-yritykselle', lang: 'en', metaTitle: 'Content strategy pricing: what it costs an SME', metaDescription: 'What a content strategy costs, what drives the price, how freelancers, agencies and AI-assisted models differ, and when it pays off for an SME.' },
  { slug: 'sivustouudistus-seo-valta-nakyvyyden-romahdus-nyt', lang: 'fi', metaDescription: 'Kolmivaiheinen malli orgaanisen näkyvyyden turvaamiseen sivustouudistuksessa: mitä tehdä ennen julkaisua, julkaisupäivänä ja 30 päivää sen jälkeen.' },
  { slug: 'sivustouudistus-seo-valta-nakyvyyden-romahdus-nyt', lang: 'en', metaTitle: 'Website redesign SEO: avoid a visibility crash', metaDescription: 'A three-phase framework to protect organic visibility in a website redesign: what to do before launch, on launch day and in the first 30 days.' },
  { slug: 'markkinoinnin-automaatio-ai-ja-chatgpt-kaytantoon', lang: 'fi', metaDescription: 'Markkinoinnin automaatio pk-yritykselle: mitä kannattaa automatisoida, missä tekoäly ja ChatGPT oikeasti auttavat ja miten malli pysyy hallinnassa.' },
  { slug: 'markkinoinnin-automaatio-ai-ja-chatgpt-kaytantoon', lang: 'en', metaTitle: 'Marketing automation: putting AI and ChatGPT to work', metaDescription: 'Marketing automation for SMEs: what to automate, where AI and ChatGPT genuinely help, and how to build a model that saves time and stays in control.' },
  { slug: 'rascal-crm-vs-hubspot-salesforce-pipedrive-zoho-freshworks', lang: 'fi', metaTitle: 'Rascal CRM vs. HubSpot, Pipedrive ja muut: mitä eroaa', metaDescription: 'CRM-vertailu myyntitiimille: mitä HubSpot, Salesforce, Pipedrive, Zoho ja Freshsales tekevät hyvin, missä tarvitaan lisäosia ja mitä Rascal CRM tuo.' },
  { slug: 'rascal-crm-vs-hubspot-salesforce-pipedrive-zoho-freshworks', lang: 'en', metaTitle: 'Rascal CRM vs. HubSpot, Pipedrive and others: what differs', metaDescription: 'A CRM comparison for sales teams: what HubSpot, Salesforce, Pipedrive, Zoho and Freshsales do well, where add-ons are needed and what Rascal CRM builds in.' },
  { slug: 'sisaltomarkkinointi-ai-kayttotapaukset-pk-yritykselle', lang: 'en', metaDescription: 'Seven practical AI use cases for SME content marketing, with input→output examples, time-saving estimates and honest limitations, without the hype.' },
  { slug: 'kaksi-paivaa-kaksi-anthropic-uutista-mita-sonnet-5-ja-fable-5-opettavat-mallidependenssista', lang: 'fi', metaTitle: 'Kun malli katoaa yön yli – miksi ajan useaa mallia', metaDescription: 'Sonnet 5 halpensi agenttityön ja Fable 5 katosi kahdeksi viikoksi vientirajoitusten takia. Siksi en enää nojaa tuotannossa yhteen malliin.' },
  { slug: 'kaksi-paivaa-kaksi-anthropic-uutista-mita-sonnet-5-ja-fable-5-opettavat-mallidependenssista', lang: 'en', metaTitle: 'When a model vanishes overnight: why I run several', metaDescription: 'Sonnet 5 made agentic work cheaper and Fable 5 vanished for two weeks over export controls. Why I no longer rely on a single model in production.' },
  { slug: 'nain-superhuman-on-rakennettu', lang: 'fi', metaDescription: 'Superhuman on henkilökohtainen valmennussovellus, joka yhdistää terveyden, treenin ja ravinnon yhdeksi tarinaksi ja antaa neuvot sinun datasi pohjalta.' },
  { slug: 'halvempi-malli-voi-olla-kallein-paatos', lang: 'fi', metaTitle: '95 % halvempi malli voi olla agenttiprojektin kallein päätös' },
  { slug: 'halvempi-malli-voi-olla-kallein-paatos', lang: 'en', metaTitle: "A 95% cheaper model can be an agent project's costliest call" },
]

export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  for (const { slug, lang, metaTitle, metaDescription } of META) {
    const { docs } = await payload.find({
      collection: 'posts',
      where: { slug: { equals: slug }, lang: { equals: lang } },
      limit: 1,
      req,
    })
    const doc = docs[0]
    if (!doc) {
      payload.logger.warn(`seo backfill: ${lang}/${slug} puuttuu, ohitetaan`)
      continue
    }
    // Luonnoksen päivitys tällä tavalla julkaisisi sen; jätetään adminiin.
    if (doc._status !== 'published') {
      payload.logger.warn(`seo backfill: ${lang}/${slug} ei ole julkaistu, ohitetaan`)
      continue
    }
    const data = {
      ...(metaTitle && !doc.metaTitle ? { metaTitle } : {}),
      ...(metaDescription && !doc.metaDescription ? { metaDescription } : {}),
    }
    if (Object.keys(data).length === 0) continue
    await payload.update({ collection: 'posts', id: doc.id, data, req, context: { skipRevalidate: true } })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {}
