// Lightweight DOM wiring shared by Nav, Footer and the homepage. Kept apart
// from ./effects.ts so pages that only need hover/nav don't ship the
// homepage animations.

type Disposer = () => void

/** Apply `data-hover` style overrides on pointer enter, restore on leave. */
export function wireHover(root: ParentNode): Disposer {
  const els = Array.from(root.querySelectorAll<HTMLElement>('[data-hover]'))
  const cleanups: Disposer[] = []
  els.forEach((el) => {
    const hover = el.getAttribute('data-hover') || ''
    const enter = () => {
      el.dataset.baseStyle = el.getAttribute('style') || ''
      el.style.cssText = el.dataset.baseStyle + ';' + hover
    }
    const leave = () => {
      el.style.cssText = el.dataset.baseStyle || ''
    }
    el.addEventListener('mouseenter', enter)
    el.addEventListener('mouseleave', leave)
    cleanups.push(() => {
      el.removeEventListener('mouseenter', enter)
      el.removeEventListener('mouseleave', leave)
    })
  })
  return () => cleanups.forEach((c) => c())
}

/** Translucent blur background on the fixed nav once the page is scrolled. */
export function wireNav(nav: HTMLElement): Disposer {
  const onScroll = () => {
    const sc = window.scrollY || document.documentElement.scrollTop
    if (sc > 40) {
      nav.style.background = 'rgba(10,11,13,.72)'
      nav.style.backdropFilter = 'blur(14px)'
      ;(nav.style as CSSStyleDeclaration & { webkitBackdropFilter?: string }).webkitBackdropFilter =
        'blur(14px)'
      nav.style.borderBottomColor = 'rgba(255,255,255,.08)'
    } else {
      nav.style.background = 'transparent'
      nav.style.backdropFilter = 'none'
      nav.style.borderBottomColor = 'transparent'
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true })
  onScroll()
  return () => window.removeEventListener('scroll', onScroll)
}
