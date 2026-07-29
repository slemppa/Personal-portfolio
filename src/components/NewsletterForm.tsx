import { useState } from 'react'
import { t } from '../lib/i18n'
import type { Lang } from '../lib/parsePost'
import { capture } from '../lib/analytics'

type State = 'idle' | 'sending' | 'ok' | 'error'

export default function NewsletterForm({ lang, source }: { lang: Lang; source: string }) {
  const [state, setState] = useState<State>('idle')

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const email = String(new FormData(e.currentTarget).get('email') ?? '')
    setState('sending')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: email.split('@')[0] || 'Tilaaja', email, message: '(newsletter)', source, marketingConsent: true }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setState('ok')
      capture('newsletter_subscribed', { source })
    } catch {
      setState('error')
    }
  }

  if (state === 'ok') return <p className="text-sm text-text-secondary">{t(lang, 'nlOk')}</p>

  return (
    <div className="rounded-xl border border-border bg-bg-secondary p-5">
      <p className="font-medium text-text-primary">{t(lang, 'nlTitle')}</p>
      <p className="mt-1 text-sm text-text-muted">{t(lang, 'nlBody')}</p>
      <form onSubmit={onSubmit} className="mt-4 flex gap-2">
        <input
          name="email" type="email" required maxLength={320}
          placeholder={t(lang, 'nlPlaceholder')}
          className="w-full rounded-lg border border-border bg-bg-tertiary px-3.5 py-2.5 text-sm text-text-primary placeholder:text-text-muted focus:border-border-hover focus:outline-none"
        />
        <button
          type="submit" disabled={state === 'sending'}
          className="shrink-0 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-[#0a0b0d] hover:bg-accent-hover transition-colors disabled:opacity-60"
        >
          {t(lang, 'nlCta')}
        </button>
      </form>
      {state === 'error' && <p className="mt-2 text-sm text-red-400">{t(lang, 'formError')}</p>}
    </div>
  )
}
