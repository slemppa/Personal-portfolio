import HeroCanvas from './HeroCanvas'

/**
 * A dimmed neural-network band for the top of content pages (blog, case
 * studies). Carries the hero's 3D motif across the site, then fades to the page
 * background before the content begins so readability is never compromised.
 * Sits behind page content, which must establish its own stacking context
 * (e.g. `relative z-10` on <main>).
 */
export default function PageGlow() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-x-0 top-0 h-[460px] overflow-hidden"
    >
      <div className="absolute inset-0 aurora opacity-70" />
      <HeroCanvas className="absolute inset-0 h-full w-full opacity-50" intensity={0.5} />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-bg-primary" />
    </div>
  )
}
