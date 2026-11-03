import { useCallback, useEffect, useLayoutEffect, useRef } from 'react'

// Pans a board inside a clipped viewport: pointer drag with momentum, wheel / trackpad, arrow keys, and
// auto-reveal of whatever receives keyboard focus. Writes the transform straight to the DOM so dragging
// never re-renders React.
//
// `inset` reserves room at the viewport's top/left for UI floating over the canvas: the board can be
// pulled that much further in, and revealed items stay clear of it.

const EDGE = 64 // how far the board may be pulled past its edges
const DRAG_THRESHOLD = 6 // px of movement before a press becomes a drag (below it, clicks go through)
const REVEAL_MARGIN = 32

const easeOut = (t) => 1 - Math.pow(1 - t, 4)
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const NO_INSET = { top: 0, left: 0 }

function clampAxis(value, view, total, start) {
  if (total <= view - start) return start + (view - start - total) / 2
  return Math.min(EDGE + start, Math.max(view - total - EDGE, value))
}

export default function usePan({ viewportRef, boardRef, board, enabled, initial, inset = NO_INSET, onSettle }) {
  const pos = useRef({ ...initial })
  const view = useRef({ width: 0, height: 0 })
  const raf = useRef(0)
  const pointerDown = useRef(false)
  const dragged = useRef(false)
  const suppressReveal = useRef(false)
  const settleRef = useRef(onSettle)
  settleRef.current = onSettle

  const clamp = useCallback(
    ({ x, y }) => ({
      x: clampAxis(x, view.current.width, board.width, inset.left),
      y: clampAxis(y, view.current.height, board.height, inset.top),
    }),
    [board.width, board.height, inset.left, inset.top],
  )

  const apply = useCallback(() => {
    const el = boardRef.current
    if (el) el.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`
  }, [boardRef])

  const settle = useCallback(() => settleRef.current?.({ ...pos.current }, { ...view.current }), [])

  const stop = () => cancelAnimationFrame(raf.current)

  const animateTo = useCallback(
    (target, { duration = 560 } = {}) => {
      stop()
      const to = clamp(target)
      if (prefersReducedMotion()) {
        pos.current = to
        apply()
        settle()
        return
      }
      const from = { ...pos.current }
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / duration)
        const e = easeOut(t)
        pos.current = { x: from.x + (to.x - from.x) * e, y: from.y + (to.y - from.y) * e }
        apply()
        if (t < 1) raf.current = requestAnimationFrame(tick)
        else settle()
      }
      raf.current = requestAnimationFrame(tick)
    },
    [apply, clamp, settle],
  )

  const panBy = useCallback(
    (dx, dy, opts) => animateTo({ x: pos.current.x + dx, y: pos.current.y + dy }, opts),
    [animateTo],
  )

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

  // Bring a board-space rect into view: centred when it fits the free area, otherwise top-left aligned.
  const panToRect = useCallback(
    (rect, { instant = false } = {}) => {
      const availW = view.current.width - inset.left
      const availH = view.current.height - inset.top
      const x = rect.width + REVEAL_MARGIN * 2 <= availW
        ? inset.left + (availW - rect.width) / 2 - rect.x
        : inset.left + REVEAL_MARGIN - rect.x
      const y = rect.height + REVEAL_MARGIN * 2 <= availH
        ? inset.top + (availH - rect.height) / 2 - rect.y
        : inset.top + 16 - rect.y
      if (instant) {
        stop()
        pos.current = clamp({ x, y })
        apply()
        settle()
      } else {
        animateTo({ x, y }, { duration: 720 })
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
      if (!wasDrag) return
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
      if (e.ctrlKey) return // pinch / ctrl+wheel stays browser zoom
      e.preventDefault()
      stop()
      // Shift turns a plain mouse wheel into horizontal movement.
      const [dx, dy] = e.shiftKey && !e.deltaX ? [e.deltaY, 0] : [e.deltaX, e.deltaY]
      pos.current = clamp({ x: pos.current.x - dx, y: pos.current.y - dy })
      apply()
      clearTimeout(wheelTimer)
      wheelTimer = setTimeout(settle, 200)
    }

    const onKeyDown = (e) => {
      if (e.altKey || e.metaKey || e.ctrlKey) return
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
  }, [enabled, viewportRef, clamp, apply, settle, panBy, offsetToReveal])

  return { panToRect, focusQuietly }
}
