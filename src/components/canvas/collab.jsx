import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

// The "shared workspace" touches on the canvas: sticky notes Althea left on the board, and a multiplayer-
// style cursor for the visitor. Nothing here pretends someone else is live on the page.

export function StickyNote({ text, link, x, y, rotate }) {
  return (
    <aside className="ws-sticky" style={{ '--x': `${x}px`, '--y': `${y}px`, '--r': `${rotate}deg` }} aria-label="Note from Althea">
      <p className="ws-sticky__text">{text}</p>
      {link && <Link to={link.to} className="ws-sticky__link">{link.label}</Link>}
      <p className="ws-sticky__author">
        <span className="ws-sticky__avatar" aria-hidden="true">AR</span>
        Althea
      </p>
    </aside>
  )
}

const finePointer = () => window.matchMedia('(hover: hover) and (pointer: fine)').matches

// The visitor's pointer drawn as a design-tool cursor with a "You" tag. Only for a mouse over the canvas;
// moves via a direct transform so it never re-renders React. Becomes a closed hand while dragging.
export function CanvasCursor({ viewportRef }) {
  const ref = useRef(null)
  const [enabled] = useState(finePointer)

  useEffect(() => {
    const vp = viewportRef.current
    const el = ref.current
    if (!enabled || !vp || !el) return undefined

    vp.classList.add('has-cursor')
    let frame = 0
    let x = 0
    let y = 0

    const paint = () => {
      frame = 0
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      el.classList.toggle('is-grabbing', vp.classList.contains('is-dragging'))
    }
    const onMove = (e) => {
      if (e.pointerType !== 'mouse') return
      const r = vp.getBoundingClientRect()
      x = e.clientX - r.left
      y = e.clientY - r.top
      el.classList.add('is-visible')
      el.classList.toggle('is-over-link', Boolean(e.target.closest?.('a, button')))
      if (!frame) frame = requestAnimationFrame(paint)
    }
    // Starting a drag captures the pointer, which fires a leave event; only hide on a real exit.
    const onLeave = () => {
      if (!vp.classList.contains('is-dragging')) el.classList.remove('is-visible')
    }
    const onButtons = () => {
      if (!frame) frame = requestAnimationFrame(paint)
    }

    vp.addEventListener('pointermove', onMove)
    vp.addEventListener('pointerleave', onLeave)
    vp.addEventListener('pointerdown', onButtons)
    vp.addEventListener('pointerup', onButtons)
    return () => {
      cancelAnimationFrame(frame)
      vp.classList.remove('has-cursor')
      vp.removeEventListener('pointermove', onMove)
      vp.removeEventListener('pointerleave', onLeave)
      vp.removeEventListener('pointerdown', onButtons)
      vp.removeEventListener('pointerup', onButtons)
    }
  }, [enabled, viewportRef])

  if (!enabled) return null

  return (
    <div ref={ref} className="ws-cursor" aria-hidden="true">
      <svg className="ws-cursor__arrow" width="22" height="22" viewBox="0 0 22 22">
        <path d="M3 2.5 18.5 9.6l-6.6 1.9-2.6 6.5L3 2.5Z" />
      </svg>
      <svg className="ws-cursor__hand" width="24" height="24" viewBox="0 0 24 24">
        <path d="M8 11V6.5a1.5 1.5 0 0 1 3 0V10m0-1.5V5a1.5 1.5 0 0 1 3 0v4.5m0-3a1.5 1.5 0 0 1 3 0V12m0-3.5a1.5 1.5 0 0 1 3 0V14a7 7 0 0 1-7 7h-1.2a6 6 0 0 1-4.6-2.2L4.4 15.5a1.5 1.5 0 0 1 2.3-1.9L8 15V11" />
      </svg>
      <span className="ws-cursor__tag">You</span>
    </div>
  )
}
