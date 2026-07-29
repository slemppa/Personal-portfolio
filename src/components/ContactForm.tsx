import { useState } from 'react'
import { Send, Check } from 'lucide-react'

// Lead-capture form. Posts to /api/contact, which stores the lead in Neon and
// (when configured) emails a notification. Includes a hidden honeypot field to
// deflect basic bots.

type State = 'idle' | 'sending' | 'ok' | 'error'

const input =
  'w-full rounded-lg border border-border bg-bg-secondary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-accent focus:outline-none transition-colors'

export default function ContactForm({ source = 'yhteys' }: { source?: string }) {
  const [state, setState] = useState<State>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form))
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, source }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('ok')
      form.reset()
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-border bg-bg-secondary p-5">
        <Check className="mt-0.5 shrink-0 text-accent" size={20} />
        <div>
          <p className="font-medium text-text-primary">Kiitos, viesti on lähetetty!</p>
          <p className="mt-1 text-sm text-text-secondary">Palaan sinulle pian sähköpostitse.</p>
        </div>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Honeypot — hidden from users, tempting to bots. */}
      <input type="text" name="website" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cf-name" className="mb-1.5 block text-sm text-text-secondary">
            Nimi *
          </label>
          <input id="cf-name" name="name" required maxLength={200} className={input} placeholder="Matti Meikäläinen" />
        </div>
        <div>
          <label htmlFor="cf-company" className="mb-1.5 block text-sm text-text-secondary">
            Yritys
          </label>
          <input id="cf-company" name="company" maxLength={200} className={input} placeholder="Yritys Oy" />
        </div>
      </div>

      <div>
        <label htmlFor="cf-email" className="mb-1.5 block text-sm text-text-secondary">
          Sähköposti *
        </label>
        <input id="cf-email" name="email" type="email" required maxLength={320} className={input} placeholder="matti@yritys.fi" />
      </div>

      <div>
        <label htmlFor="cf-message" className="mb-1.5 block text-sm text-text-secondary">
          Viesti *
        </label>
        <textarea id="cf-message" name="message" required rows={5} maxLength={5000} className={input} placeholder="Kerro lyhyesti mitä olette tekemässä ja missä voisin auttaa." />
      </div>

      {state === 'error' && (
        <p className="text-sm text-red-400">Lähetys ei onnistunut. Yritä uudelleen tai laita sähköpostia osoitteeseen sami@mak8r.fi.</p>
      )}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2.5 text-sm font-medium text-[#0a0b0d] transition-colors hover:bg-accent-hover disabled:opacity-60"
      >
        <Send size={16} />
        {state === 'sending' ? 'Lähetetään…' : 'Lähetä viesti'}
      </button>
    </form>
  )
}
