export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString('fi-FI', { year: 'numeric', month: 'long', day: 'numeric' })
}
