import { useEffect, useRef } from 'react'

/**
 * Cursor-tracking spotlight for a group of cards.
 *
 * Attach the returned ref to a container; any descendant carrying the
 * `.spotlight` class then gets `--mx` / `--my` custom properties updated as the
 * pointer moves over it, which the CSS turns into a soft accent glow that
 * follows the cursor. One delegated listener covers every card in the group, so
 * lists stay cheap. Pointer-only and skipped under reduced-motion.
 */
export function useSpotlight<T extends HTMLElement>() {
  const ref = useRef<T>(null)

  useEffect(() => {
    const root = ref.current
    if (!root) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    function onMove(e: PointerEvent) {
      const card = (e.target as HTMLElement).closest<HTMLElement>('.spotlight')
      if (!card) return
      const r = card.getBoundingClientRect()
      card.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
      card.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
    }

    root.addEventListener('pointermove', onMove, { passive: true })
    return () => root.removeEventListener('pointermove', onMove)
  }, [])

  return ref
}
