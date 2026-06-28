import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { NAV_HTML } from '../site/markup'
import { wireHover, wireNav } from '../site/effects'

/**
 * Fixed site navigation, ported from the design export. Section links are
 * in-page anchors on the homepage and absolute `/#section` links elsewhere so
 * they always resolve back to the one-page layout. The logo links home —
 * smooth-scrolling to top on the homepage, navigating home otherwise.
 */
export default function Nav() {
  const ref = useRef<HTMLDivElement>(null)
  const { pathname } = useLocation()
  const navigate = useNavigate()
  const isHome = pathname === '/'
  const html = isHome ? NAV_HTML : NAV_HTML.replace(/href="#/g, 'href="/#')

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
        else navigate('/')
      }
      logo.addEventListener('click', onLogo)
      disposers.push(() => logo.removeEventListener('click', onLogo))
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
  }, [html, isHome, navigate])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}
