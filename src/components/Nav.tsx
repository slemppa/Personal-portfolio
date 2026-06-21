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

    return () => disposers.forEach((d) => d())
  }, [html, isHome, navigate])

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} />
}
