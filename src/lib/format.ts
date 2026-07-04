import type { Lang } from './parsePost'

export function formatDate(iso: string, lang: Lang = 'fi'): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  const locale = lang === 'en' ? 'en-GB' : 'fi-FI'
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'long', day: 'numeric' })
}
