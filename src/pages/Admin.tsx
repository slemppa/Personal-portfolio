import { useEffect, useState } from 'react'
import { Link } from 'react-router'
import Nav from '../components/Nav'
import Footer from '../components/Footer'
import { applyHead } from '../lib/head'

// Lightweight private view of stored offers and captured leads. Protected by
// OFFER_API_KEY: the key is entered once and kept in localStorage, then sent as
// x-api-key to the protected list endpoints. Not linked from anywhere public.

type OfferRow = { id: string; title: string; company: string | null; language: string; createdAt: string }
type LeadRow = {
  id: number
  name: string
  email: string
  company?: string
  message: string
  marketingConsent?: boolean
  createdAt: string
}

const STORAGE_KEY = 'offer_admin_key'

function fmt(iso: string): string {
  const d = new Date(iso)
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleString('fi-FI', { dateStyle: 'short', timeStyle: 'short' })
}

export default function Admin() {
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem(STORAGE_KEY) ?? '')
  const [keyInput, setKeyInput] = useState('')
  const [data, setData] = useState<{ key: string; offers: OfferRow[]; leads: LeadRow[] } | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    applyHead({ lang: 'fi', title: 'Hallinta · Sami Kiias', canonical: '/hallinta', alternates: [] })
  }, [])

  useEffect(() => {
    if (!apiKey) return
    const ctrl = new AbortController()
    const headers = { 'x-api-key': apiKey }
    Promise.all([
      fetch('/api/offers?list=1', { headers, signal: ctrl.signal }),
      fetch('/api/contact?list=1', { headers, signal: ctrl.signal }),
    ])
      .then(async ([o, l]) => {
        if (o.status === 401 || l.status === 401) {
          setError('Väärä avain.')
          setApiKey('')
          localStorage.removeItem(STORAGE_KEY)
          return
        }
        setError('')
        setData({
          key: apiKey,
          offers: ((await o.json()).offers ?? []) as OfferRow[],
          leads: ((await l.json()).leads ?? []) as LeadRow[],
        })
      })
      .catch((e) => {
        if (e?.name !== 'AbortError') setError('Haku epäonnistui.')
      })
    return () => ctrl.abort()
  }, [apiKey])

  const ready = data?.key === apiKey
  const loading = !!apiKey && !ready && !error
  const offers = ready ? data.offers : []
  const leads = ready ? data.leads : []

  const saveKey = (e: React.FormEvent) => {
    e.preventDefault()
    const k = keyInput.trim()
    if (!k) return
    setError('')
    localStorage.setItem(STORAGE_KEY, k)
    setApiKey(k)
  }

  return (
    <>
      <Nav />
      <main className="mx-auto min-h-screen max-w-5xl px-8 pb-24 pt-32">
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-3xl font-bold text-text-primary">Hallinta</h1>
          {apiKey && (
            <button
              onClick={() => {
                localStorage.removeItem(STORAGE_KEY)
                setApiKey('')
              }}
              className="text-sm text-text-secondary hover:text-text-primary"
            >
              Kirjaudu ulos
            </button>
          )}
        </div>

        {!apiKey ? (
          <form onSubmit={saveKey} className="mt-8 max-w-sm">
            <label htmlFor="ak" className="mb-1.5 block text-sm text-text-secondary">
              Hallinta-avain (OFFER_API_KEY)
            </label>
            <input
              id="ak"
              type="password"
              value={keyInput}
              onChange={(e) => setKeyInput(e.target.value)}
              className="w-full rounded-lg border border-border bg-bg-secondary px-3.5 py-2.5 text-sm text-text-primary focus:border-accent focus:outline-none"
            />
            {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
            <button type="submit" className="mt-3 rounded-lg bg-accent px-4 py-2 text-sm font-medium text-[#0a0b0d] hover:bg-accent-hover">
              Avaa
            </button>
          </form>
        ) : (
          <>
            {loading && <p className="mt-8 text-text-secondary">Ladataan…</p>}
            {error && <p className="mt-8 text-red-400">{error}</p>}

            <section className="mt-10">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Tarjoukset ({offers.length})
              </h2>
              <div className="mt-4 overflow-x-auto rounded-xl border border-border">
                <table className="w-full min-w-[36rem] text-sm">
                  <thead>
                    <tr className="bg-bg-tertiary text-left text-xs uppercase tracking-wide text-text-muted">
                      <th className="px-4 py-3">Otsikko</th>
                      <th className="px-4 py-3">Yritys</th>
                      <th className="px-4 py-3">Luotu</th>
                      <th className="px-4 py-3">Linkki</th>
                    </tr>
                  </thead>
                  <tbody>
                    {offers.map((o) => (
                      <tr key={o.id} className="border-t border-border">
                        <td className="px-4 py-3 text-text-primary">{o.title}</td>
                        <td className="px-4 py-3 text-text-secondary">{o.company ?? '—'}</td>
                        <td className="px-4 py-3 text-text-muted">{fmt(o.createdAt)}</td>
                        <td className="px-4 py-3">
                          <Link to={`/tarjous/${o.id}`} className="text-accent hover:text-accent-hover">
                            /tarjous/{o.id}
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {offers.length === 0 && !loading && (
                      <tr>
                        <td colSpan={4} className="px-4 py-6 text-center text-text-muted">
                          Ei tarjouksia vielä.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="mt-12">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                Liidit ({leads.length})
              </h2>
              <div className="mt-4 space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="rounded-xl border border-border bg-bg-secondary p-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <p className="font-medium text-text-primary">
                        {l.name}
                        {l.company ? ` · ${l.company}` : ''}
                        {l.marketingConsent && (
                          <span className="ml-2 rounded-full bg-accent/10 px-2 py-0.5 text-xs font-normal text-accent">
                            ✓ lupa
                          </span>
                        )}
                      </p>
                      <span className="text-xs text-text-muted">{fmt(l.createdAt)}</span>
                    </div>
                    <a href={`mailto:${l.email}`} className="text-sm text-accent hover:text-accent-hover">
                      {l.email}
                    </a>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-text-secondary">{l.message}</p>
                  </div>
                ))}
                {leads.length === 0 && !loading && <p className="text-text-muted">Ei liidejä vielä.</p>}
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </>
  )
}
