import { useEffect } from 'react'
import { useLocation } from 'react-router'

// Vie sivun ylös reitin vaihtuessa, mutta kunnioita ankkureita (#cases).
export default function ScrollToTop() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) return
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}
