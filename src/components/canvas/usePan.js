import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

// Pans and zooms a board inside a clipped viewport: pointer drag with momentum, wheel / trackpad to pan,
// ctrl/⌘+wheel or pinch to zoom at the cursor, arrow keys and +/− / Shift+0 / Shift+1 when focused, and
// auto-reveal of whatever receives keyboard focus. Writes the transform straight to the DOM (and the
// current zoom to --zoom) so moving never re-renders React.
//
// Sharpness: while moving, the board is a GPU layer (fast, but rasterised once and stretched). At rest it
// drops back to a plain 2D transform on whole pixels, so the browser repaints text and images crisply at
// the current zoom instead of showing a scaled bitmap.
//
// `inset` reserves room at the viewport's top/left for UI floating over the canvas: the board can be
// pulled that much further in, and revealed items stay clear of it.

const EDGE = 64 // how far the board may be pulled past its edges, in screen px
const DRAG_THRESHOLD = 6 // px of movement before a press becomes a drag (below it, clicks go through)
const REVEAL_MARGIN = 32
const LABEL_ROOM = 48 // space above a top-aligned rect for the name label that sits outside it
export const MIN_ZOOM = 0.1
export const MAX_ZOOM = 2

const easeOut = (t) => 1 - Math.pow(1 - t, 4)
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const clampZoom = (s) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, s))

const NO_INSET = { top: 0, left: 0 }

function clampAxis(value, view, total, start) {
  if (total <= view - start) return start + (view - start - total) / 2
  return Math.min(EDGE + start, Math.max(view - total - EDGE, value))
}

export default function usePan({ viewportRef, boardRef, board, enabled, initial, inset = NO_INSET, onSettle, onZoom }) {
  const pos = useRef({ x: initial.x, y: initial.y, s: initial.s ?? 1 })
  const view = useRef({ width: 0, height: 0 })
  const raf = useRef(0)
  const lastZoom = useRef(null)
  const moving = useRef(false)
  const pointerDown = useRef(false)
  const dragged = useRef(false)
  const suppressReveal = useRef(false)
  const settleRef = useRef(onSettle)
  settleRef.current = onSettle
  const zoomRef = useRef(onZoom)
  zoomRef.current = onZoom

  const clamp = useCallback(
    ({ x, y, s = pos.current.s }) => ({
      x: clampAxis(x, view.current.width, board.width * s, inset.left),
      y: clampAxis(y, view.current.height, board.height * s, inset.top),
      s,
    }),
    [board.width, board.height, inset.left, inset.top],
  )

  const apply = useCallback(() => {
    const el = boardRef.current
    if (!el) return
    const { x, y, s } = pos.current
    el.style.transform = moving.current
      ? `translate3d(${x}px, ${y}px, 0) scale(${s})`
      : `translate(${Math.round(x)}px, ${Math.round(y)}px) scale(${s})`
    if (s !== lastZoom.current) {
      lastZoom.current = s
      el.style.setProperty('--zoom', s)
      zoomRef.current?.(s)
    }
  }, [boardRef])

  const startMoving = useCallback(() => {
    if (moving.current) return
    moving.current = true
    boardRef.current?.classList.add('is-moving')
  }, [boardRef])

  // Motion has ended: repaint sharply, then report the resting position.
  const settle = useCallback(() => {
    moving.current = false
    boardRef.current?.classList.remove('is-moving')
    apply()
    settleRef.current?.({ ...pos.current }, { ...view.current })
  }, [apply, boardRef])

  const stop = () => cancelAnimationFrame(raf.current)

  // Tween any of x / y / s.
  const animateTo = useCallback(
    (target, { duration = 560 } = {}) => {
      stop()
      const to = clamp({ ...pos.current, ...target })
      if (prefersReducedMotion()) {
        pos.current = to
        apply()
        settle()
        return
      }
      const from = { ...pos.current }
      const start = performance.now()
      startMoving()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const e = easeOut(t)
        pos.current = {
          x: from.x + (to.x - from.x) * e,
          y: from.y + (to.y - from.y) * e,
          s: from.s + (to.s - from.s) * e,
        }
        apply()
        if (t < 1) raf.current = requestAnimationFrame(tick)
        else settle()
      }
      raf.current = requestAnimationFrame(tick)
    },
    [apply, clamp, settle, startMoving],
  )

  const panBy = useCallback(
    (dx, dy, opts) => animateTo({ x: pos.current.x + dx, y: pos.current.y + dy }, opts),
    [animateTo],
  )

  // Zoom keeping the board point under `at` (viewport px; default: centre) fixed on screen.
  const zoomTo = useCallback(
    (scale, { at, animate = true } = {}) => {
      stop()
      const px = at?.x ?? view.current.width / 2
      const py = at?.y ?? view.current.height / 2
      const from = { ...pos.current }
      const to = clampZoom(scale)
      const anchor = { x: (px - from.x) / from.s, y: (py - from.y) / from.s }
      const place = (s) => clamp({ x: px - anchor.x * s, y: py - anchor.y * s, s })

      if (!animate || prefersReducedMotion()) {
        pos.current = place(to)
        apply()
        return
      }
      const start = performance.now()
      startMoving()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 280)
        pos.current = place(from.s + (to - from.s) * easeOut(t))
        apply()
        if (t < 1) raf.current = requestAnimationFrame(tick)
        else settle()
      }
      raf.current = requestAnimationFrame(tick)
    },
    [apply, clamp, settle, startMoving],
  )

  const zoomBy = useCallback((factor, opts) => zoomTo(pos.current.s * factor, opts), [zoomTo])

  // Fit the whole board in view (never above 100%).
  const fit = useCallback(() => {
    const availW = view.current.width - inset.left - REVEAL_MARGIN * 2
    const availH = view.current.height - inset.top - REVEAL_MARGIN * 2
    const s = clampZoom(Math.min(availW / board.width, availH / board.height, 1))
    animateTo({ x: 0, y: 0, s }, { duration: 560 })
  }, [animateTo, board.width, board.height, inset.left, inset.top])

  // Offset needed to bring an element fully into the viewport (or its top-left, if it's bigger).
  const offsetToReveal = useCallback(
    (el) => {
      const vr = viewportRef.current.getBoundingClientRect()
      const r = el.getBoundingClientRect()
      const axis = (start, end, vStart, vEnd) => {
        if (end - start > vEnd - vStart - REVEAL_MARGIN * 2 || start < vStart + REVEAL_MARGIN) return vStart + REVEAL_MARGIN - start
        if (end > vEnd - REVEAL_MARGIN) return vEnd - REVEAL_MARGIN - end
        return 0
      }
      return {
        dx: axis(r.left, r.right, vr.left + inset.left, vr.right),
        dy: axis(r.top, r.bottom, vr.top + inset.top, vr.bottom),
      }
    },
    [viewportRef, inset.left, inset.top],
  )

  // Bring a board-space rect into view (at the current zoom, or `scale`): centred when it fits,
  // otherwise top-left aligned.
  const panToRect = useCallback(
    (rect, { instant = false, scale } = {}) => {
      const s = scale ? clampZoom(scale) : pos.current.s
      const availW = view.current.width - inset.left
      const availH = view.current.height - inset.top
      const w = rect.width * s
      const h = rect.height * s
      const x = w + REVEAL_MARGIN * 2 <= availW ? inset.left + (availW - w) / 2 - rect.x * s : inset.left + REVEAL_MARGIN - rect.x * s
      const y = h + REVEAL_MARGIN * 2 <= availH ? inset.top + (availH - h) / 2 - rect.y * s : inset.top + LABEL_ROOM - rect.y * s
      if (instant) {
        stop()
        pos.current = clamp({ x, y, s })
        apply()
        settle()
      } else {
        animateTo({ x, y, s }, { duration: 720 })
      }
    },
    [animateTo, apply, clamp, settle, inset.left, inset.top],
  )

  // Move focus without the auto-reveal pulling the board somewhere else mid-animation.
  const focusQuietly = useCallback((el) => {
    if (!el) return
    suppressReveal.current = true
    el.focus({ preventScroll: true })
    suppressReveal.current = false
  }, [])

  // Measure before paint so the restored position never flashes.
  useLayoutEffect(() => {
    const vp = viewportRef.current
    if (!enabled || !vp) return undefined

    const measure = () => {
      view.current = { width: vp.clientWidth, height: vp.clientHeight }
      pos.current = clamp(pos.current)
      apply()
    }
    measure()

    const ro = new ResizeObserver(measure)
    ro.observe(vp)
    return () => ro.disconnect()
  }, [enabled, viewportRef, clamp, apply])

  useEffect(() => {
    const vp = viewportRef.current
    if (!enabled || !vp) return undefined

    let drag = null
    let samples = []
    let wheelTimer = 0

    const momentum = (vx, vy) => {
      if (prefersReducedMotion() || Math.hypot(vx, vy) < 0.15) {
        settle()
        return
      }
      let last = performance.now()
      const tick = (now) => {
        const dt = Math.min(32, now - last)
        last = now
        const next = clamp({ x: pos.current.x + vx * dt, y: pos.current.y + vy * dt })
        if (next.x !== pos.current.x + vx * dt) vx = 0
        if (next.y !== pos.current.y + vy * dt) vy = 0
        pos.current = next
        apply()
        const decay = Math.pow(0.94, dt / 16)
        vx *= decay
        vy *= decay
        if (Math.hypot(vx, vy) > 0.02) raf.current = requestAnimationFrame(tick)
        else settle()
      }
      raf.current = requestAnimationFrame(tick)
    }

    const onPointerDown = (e) => {
      if (e.button !== 0 || e.target.closest('[data-pan-ignore]')) return
      stop()
      pointerDown.current = true
      dragged.current = false
      drag = { id: e.pointerId, sx: e.clientX, sy: e.clientY, ox: pos.current.x, oy: pos.current.y, active: false }
      samples = [{ x: e.clientX, y: e.clientY, t: e.timeStamp }]
    }

    const onPointerMove = (e) => {
      if (!drag || e.pointerId !== drag.id) return
      const dx = e.clientX - drag.sx
      const dy = e.clientY - drag.sy
      if (!drag.active) {
        if (Math.hypot(dx, dy) < DRAG_THRESHOLD) return
        drag.active = true
        startMoving()
        vp.setPointerCapture(e.pointerId)
        vp.classList.add('is-dragging')
      }
      pos.current = clamp({ x: drag.ox + dx, y: drag.oy + dy })
      apply()
      samples.push({ x: e.clientX, y: e.clientY, t: e.timeStamp })
      if (samples.length > 6) samples.shift()
    }

    const onPointerUp = (e) => {
      if (!drag || e.pointerId !== drag.id) return
      pointerDown.current = false
      const wasDrag = drag.active
      drag = null
      vp.classList.remove('is-dragging')
      if (!wasDrag) {
        if (moving.current) settle() // a press that interrupted a glide
        return
      }
      dragged.current = true
      const first = samples.find((s) => e.timeStamp - s.t < 100) ?? samples[0]
      const dt = Math.max(1, e.timeStamp - first.t)
      momentum((e.clientX - first.x) / dt, (e.clientY - first.y) / dt)
    }

    // A drag that ends over a card must not open it.
    const onClickCapture = (e) => {
      if (!dragged.current) return
      dragged.current = false
      e.preventDefault()
      e.stopPropagation()
    }

    const onWheel = (e) => {
      e.preventDefault()
      stop()
      startMoving()
      if (e.ctrlKey || e.metaKey) {
        // Pinch arrives as ctrl+wheel with small deltas; a mouse wheel notch is ~100. Cap each step.
        const factor = Math.min(1.25, Math.max(0.8, Math.exp(-e.deltaY * 0.01)))
        const vr = vp.getBoundingClientRect()
        zoomTo(pos.current.s * factor, { at: { x: e.clientX - vr.left, y: e.clientY - vr.top }, animate: false })
      } else {
        // Shift turns a plain mouse wheel into horizontal movement.
        const [dx, dy] = e.shiftKey && !e.deltaX ? [e.deltaY, 0] : [e.deltaX, e.deltaY]
        pos.current = clamp({ x: pos.current.x - dx, y: pos.current.y - dy })
        apply()
      }
      clearTimeout(wheelTimer)
      wheelTimer = setTimeout(settle, 200)
    }

    const onKeyDown = (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return
      if (e.target.closest('input, textarea, select')) return
      if (e.key === '+' || e.key === '=') {
        e.preventDefault()
        zoomBy(1.25)
        return
      }
      if (e.key === '-' || e.key === '_') {
        e.preventDefault()
        zoomBy(0.8)
        return
      }
      if (e.shiftKey && e.code === 'Digit0') {
        e.preventDefault()
        zoomTo(1)
        return
      }
      if (e.shiftKey && e.code === 'Digit1') {
        e.preventDefault()
        fit()
        return
      }
      const step = e.shiftKey ? 320 : 96
      const moves = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] }
      const move = moves[e.key]
      if (!move) return
      e.preventDefault()
      panBy(move[0], move[1], { duration: 260 })
    }

    const onFocusIn = (e) => {
      if (suppressReveal.current || pointerDown.current) return
      if (e.target === vp) return
      const item = e.target.closest('[data-ws-item]') ?? e.target
      const { dx, dy } = offsetToReveal(item)
      if (dx || dy) panBy(dx, dy, { duration: 420 })
    }

    // Focus can scroll even a clipped container; keep it pinned so only the transform moves the board.
    const onScroll = () => {
      vp.scrollLeft = 0
      vp.scrollTop = 0
    }

    const onDragStart = (e) => e.preventDefault()

    vp.addEventListener('pointerdown', onPointerDown)
    vp.addEventListener('pointermove', onPointerMove)
    vp.addEventListener('pointerup', onPointerUp)
    vp.addEventListener('pointercancel', onPointerUp)
    vp.addEventListener('click', onClickCapture, true)
    vp.addEventListener('wheel', onWheel, { passive: false })
    vp.addEventListener('keydown', onKeyDown)
    vp.addEventListener('focusin', onFocusIn)
    vp.addEventListener('scroll', onScroll)
    vp.addEventListener('dragstart', onDragStart)

    return () => {
      stop()
      clearTimeout(wheelTimer)
      vp.removeEventListener('pointerdown', onPointerDown)
      vp.removeEventListener('pointermove', onPointerMove)
      vp.removeEventListener('pointerup', onPointerUp)
      vp.removeEventListener('pointercancel', onPointerUp)
      vp.removeEventListener('click', onClickCapture, true)
      vp.removeEventListener('wheel', onWheel)
      vp.removeEventListener('keydown', onKeyDown)
      vp.removeEventListener('focusin', onFocusIn)
      vp.removeEventListener('scroll', onScroll)
      vp.removeEventListener('dragstart', onDragStart)
    }
  }, [enabled, viewportRef, clamp, apply, settle, startMoving, panBy, zoomTo, zoomBy, fit, offsetToReveal])

  return { panToRect, focusQuietly, zoomTo, zoomBy, fit }
}
