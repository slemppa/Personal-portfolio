import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import type { Lang } from '../lib/parsePost'
import { navHtml } from '../site/markup'
import { wireHover, wireNav } from '../site/effects'
import { mirrorPath, homePath } from '../lib/i18n'

/**
 * Fixed site navigation, ported from the design export. Section links are
 * in-page anchors on the homepage and absolute `/#section` (or `/en#section`)
 * links elsewhere so they always resolve back to the one-page layout in the
 * current language. The logo links home — smooth-scrolling to top on the
 * homepage, navigating home otherwise.
 */
export default function Nav({ lang = 'fi' }: { lang?: Lang }) {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const home = homePath(lang)
  const isHome = pathname === home
  const base = navHtml(lang)
  const html = isHome ? base : base.replace(/href="#/g, `href="${home}#`)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    const nav = root.querySelector<HTMLElement>('#nav')
    const disposers = [wireHover(root)]
    if (nav) disposers.push(wireNav(nav))

    const logo = root.querySelector<HTMLAnchorElement>('#nav a')
    if (logo) {
      const onLogo = (e: MouseEvent) => {
        e.preventDefault()
        if (isHome) window.scrollTo({ top: 0, behavior: 'smooth' })
        else navigate(home)
      }
      logo.addEventListener('click', onLogo)
      disposers.push(() => logo.removeEventListener('click', onLogo))
    }

    const langSwitch = root.querySelector<HTMLAnchorElement>('#lang-switch')
    if (langSwitch) {
      const onLangSwitch = (e: MouseEvent) => {
        e.preventDefault()
        navigate(mirrorPath(pathname))
      }
      langSwitch.addEventListener('click', onLangSwitch)
      disposers.push(() => langSwitch.removeEventListener('click', onLangSwitch))
    }

    // Mobile menu: toggle the `open` class on the nav, and close it whenever a
    // link inside the sheet is tapped (anchor jump or route change).
    const toggle = root.querySelector<HTMLButtonElement>('#nav-toggle')
    const links = root.querySelector<HTMLElement>('#nav-links')
    if (nav && toggle) {
      const setOpen = (open: boolean) => {
        nav.classList.toggle('open', open)
        toggle.setAttribute('aria-expanded', String(open))
      }
      const onToggle = () => setOpen(!nav.classList.contains('open'))
      toggle.addEventListener('click', onToggle)
      disposers.push(() => toggle.removeEventListener('click', onToggle))

      if (links) {
        const linkEls = Array.from(links.querySelectorAll<HTMLAnchorElement>('a'))
        const close = () => setOpen(false)
        linkEls.forEach((a) => a.addEventListener('click', close))
        disposers.push(() => linkEls.forEach((a) => a.removeEventListener('click', close)))
      }
    }

    return () => disposers.forEach((d) => d())
  }, [html, isHome, navigate, pathname, home])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}
