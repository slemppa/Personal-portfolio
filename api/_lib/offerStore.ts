// Persistence for offers: store a generated offer and hand back a short id, so
// offers can be shared as short links (/tarjous/<id>) and listed. All functions
// degrade to null / [] when no database is configured, so the caller can fall
// back to the stateless token link.

import { getSql, shortId } from './db.js'
import type { Offer } from './offer.js'

export type OfferSummary = {
  id: string
  title: string
  company: string | null
  language: string
  createdAt: string
}

/** Store an offer, returning its short id — or null if no DB / on error. */
export async function storeOffer(offer: Offer): Promise<string | null> {
  const sql = getSql()
  if (!sql) return null
  try {
    // Retry once on the (astronomically unlikely) id collision.
    for (let attempt = 0; attempt < 2; attempt++) {
      const id = shortId()
      try {
        await sql`
          insert into portfolio_offers (id, title, company, language, data)
          values (${id}, ${offer.title}, ${offer.recipient.company ?? null}, ${offer.language}, ${JSON.stringify(offer)})
        `
        return id
      } catch (err) {
        if (attempt === 0 && String(err).includes('portfolio_offers_pkey')) continue
        throw err
      }
    }
    return null
  } catch {
    return null
  }
}

/** Fetch a stored offer by id — or null if missing / no DB / on error. */
export async function getStoredOffer(id: string): Promise<Offer | null> {
  const sql = getSql()
  if (!sql || !id) return null
  try {
    const rows = (await sql`select data from portfolio_offers where id = ${id} limit 1`) as { data: Offer }[]
    return rows[0]?.data ?? null
  } catch {
    return null
  }
}

/** List recent offers (metadata only) for an admin view. */
export async function listOffers(limit = 100): Promise<OfferSummary[]> {
  const sql = getSql()
  if (!sql) return []
  try {
    const rows = (await sql`
      select id, title, company, language, created_at
      from portfolio_offers order by created_at desc limit ${limit}
    `) as { id: string; title: string; company: string | null; language: string; created_at: string }[]
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      company: r.company,
      language: r.language,
      createdAt: r.created_at,
    }))
  } catch {
    return []
  }
}
