import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { LAYOUT, REGIONS, STICKY_NOTES, regionForPath } from '../../data/canvas'
import usePageMeta from '../usePageMeta'
import { HERO_TRANSITION } from '../TransitionLink'
import usePan from './usePan'
import {
  AboutRegion,
  ApproachRegion,
  ContactRegion,
  EducationRegion,
  HomeRegion,
  SkillsRegion,
  SystemRegion,
  WorkRegion,
} from './regions'
import { Inspector, LayersPanel, Toolbar } from './editor'
import { CanvasCursor, StickyNote } from './collab'
import ThemeToggle from '../ThemeToggle'

// Canvas view: the site as one board. `/canvas`, `/canvas/work`, `/canvas/about` and `/canvas/contact`
// are regions on it: visiting a route
// glides the board to its region, and dragging into another region updates the URL (and so the nav).
//
//  - ≥1024px: design-tool editor: toolbar, Pages + Layers panel, inspector, selection and zoom.
//  - 768–1023px: the bare canvas with a floating control bar.
//  - <768px: the regions stack into one long page and the routes scroll to them.

const CANVAS_QUERY = '(min-width: 768px)'
const EDITOR_QUERY = '(min-width: 1024px)'
const STORAGE_KEY = 'canvas:v4'
const UI_KEY = 'editor:ui'
const BAR_INSET = { top: 64, left: 0 } // tablet: room kept clear of the floating bar
const NO_INSET = { top: 0, left: 0 }
const BOARD_PAD = 80
// Below this zoom a frame is too small to read, so going to a section also zooms back to 100%.
const READABLE_ZOOM = 0.6

const META = {
  home: {},
  work: { title: 'Selected work', description: 'Product design, mobile, web, and landing page projects by UI/UX designer Althea Rito.' },
  approach: { title: 'Approach', description: 'How UI/UX designer Althea Rito approaches design: understand, structure, design, refine.' },
  system: { title: 'Design system', description: 'Design systems work by UI/UX designer Althea Rito: foundations, components, states and tokens.' },
  skills: { title: 'Skills', description: 'Skills and capabilities of UI/UX designer Althea Rito.' },
  education: { title: 'Education', description: 'Education of UI/UX designer Althea Rito.' },
  about: { title: 'About', description: 'Background, experience, skills, and education of UI/UX designer Althea Rito.' },
  contact: { title: 'Contact', description: 'Get in touch with UI/UX designer Althea Rito by email or LinkedIn.' },
}

// Storage can be unavailable (private mode, blocked storage); the canvas works without it.
const readJSON = (store, key) => {
  try {
    return JSON.parse(store.getItem(key)) ?? {}
  } catch {
    return {}
  }
}
const writeJSON = (store, key, patch) => {
  try {
    store.setItem(key, JSON.stringify({ ...readJSON(store, key), ...patch }))
  } catch {
    /* ignore */
  }
}
const readStored = () => readJSON(sessionStorage, STORAGE_KEY)
const writeStored = (patch) => writeJSON(sessionStorage, STORAGE_KEY, patch)

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches)
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

// Browser fullscreen for the canvas element; `supported` is false where it isn't available (e.g. iPhone).
function useFullscreen(ref) {
  const [active, setActive] = useState(false)
  const supported = document.fullscreenEnabled

  useEffect(() => {
    const onChange = () => setActive(document.fullscreenElement === ref.current)
    document.addEventListener('fullscreenchange', onChange)
    return () => document.removeEventListener('fullscreenchange', onChange)
  }, [ref])

  const toggle = () => {
    if (document.fullscreenElement) document.exitFullscreen()
    else ref.current?.requestFullscreen().catch(() => {})
  }

  return { active, supported, toggle }
}

const CONTENT = {
  home: HomeRegion,
  work: WorkRegion,
  approach: ApproachRegion,
  system: SystemRegion,
  about: AboutRegion,
  skills: SkillsRegion,
  education: EducationRegion,
  contact: ContactRegion,
}

const ROWS = REGIONS.reduce((rows, r) => {
  ;(rows[r.row] ??= []).push(r)
  return rows
}, [])

// Frames flow left to right within a row; each row starts below the tallest frame of the one above.
function layoutFrames(heights) {
  const pos = {}
  let y = LAYOUT.originY
  let width = 0
  ROWS.forEach((row) => {
    let x = LAYOUT.originX
    row.forEach((r) => {
      pos[r.id] = { x, y }
      x += r.width + LAYOUT.colGap
    })
    width = Math.max(width, x - LAYOUT.colGap)
    y += Math.max(...row.map((r) => heights[r.id])) + LAYOUT.rowGap
  })
  return { pos, heights, board: { width: width + BOARD_PAD, height: y - LAYOUT.rowGap + BOARD_PAD } }
}

// A sticky note's board position from the frame it's anchored to.
function notePosition(note, { pos, heights }) {
  const frame = REGIONS.find((r) => r.id === note.region)
  const { x, y } = pos[note.region]
  if (note.anchor === 'right') return { x: x + frame.width + note.dx, y: y + (note.dy ?? 0) }
  return { x: x + note.dx, y: y + heights[note.region] + 36 }
}

// First paint uses estimated heights; the real ones replace them before anything is shown.
const ESTIMATED = layoutFrames(Object.fromEntries(REGIONS.map((r) => [r.id, r.height ?? r.est])))

export default function SiteCanvas() {
  const location = useLocation()
  const navType = useNavigationType()
  const navigate = useNavigate()
  const region = regionForPath(location.pathname) ?? REGIONS[0]
  const canvas = useMediaQuery(CANVAS_QUERY)
  const editor = useMediaQuery(EDITOR_QUERY)
  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const boardRef = useRef(null)
  const hintId = useId()
  const fullscreen = useFullscreen(rootRef)
  const [stored] = useState(readStored)
  const [layout, setLayout] = useState(ESTIMATED)
  const [measured, setMeasured] = useState(false)
  const { board, pos: framePos } = layout
  const interacted = useRef(false)
  const [zoom, setZoom] = useState(Math.round((stored.pan?.s ?? 1) * 100))
  const [selected, setSelected] = useState(null)
  const [selRect, setSelRect] = useState(null)
  const [hover, setHover] = useState(null)
  const [hoverRect, setHoverRect] = useState(null)
  const [uiHidden, setUiHidden] = useState(() => readJSON(localStorage, UI_KEY).hidden === true)
  const inset = useMemo(() => (canvas && !editor ? BAR_INSET : NO_INSET), [canvas, editor])

  // Keep the place on the board when coming back from a case study, or on reload / history navigation.
  const [restoring] = useState(() => Boolean(stored.pan) && (navType === 'POP' || location.state?.restore))

  usePageMeta({ ...META[region.id], path: region.path })

  // Lets the shell drop the site sidebar and go edge to edge while the editor is on screen.
  useLayoutEffect(() => {
    document.documentElement.dataset.editor = 'on'
    return () => delete document.documentElement.dataset.editor
  }, [])

  const regionRef = useRef(region.id)
  regionRef.current = region.id
  const scaleRef = useRef(stored.pan?.s ?? 1)

  const regionEl = (id) => boardRef.current?.querySelector(`[data-region="${id}"]`)
  const rectOf = (el) => ({ x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })

  // Board-space rect of any element on the board, whatever its nesting or the current zoom.
  const layerRect = useCallback((id) => {
    const el = boardRef.current?.querySelector(`[data-layer="${id}"]`)
    if (!el) return null
    const b = boardRef.current.getBoundingClientRect()
    const r = el.getBoundingClientRect()
    const s = scaleRef.current
    return { x: (r.left - b.left) / s, y: (r.top - b.top) / s, width: r.width / s, height: r.height / s }
  }, [])

  // The region nearest the centre of the free viewport area.
  const regionAt = (pos, view) => {
    const s = pos.s ?? 1
    const cx = (inset.left + (view.width - inset.left) / 2 - pos.x) / s
    const cy = (inset.top + (view.height - inset.top) / 2 - pos.y) / s
    let best = null
    let bestDist = Infinity
    for (const r of REGIONS) {
      const el = regionEl(r.id)
      if (!el) continue
      const { x, y, width, height } = rectOf(el)
      const dist = Math.hypot(Math.max(x - cx, 0, cx - (x + width)), Math.max(y - cy, 0, cy - (y + height)))
      if (dist < bestDist) {
        bestDist = dist
        best = r
      }
    }
    return best
  }

  const onSettle = (pos, view) => {
    writeStored({ pan: pos })
    // With the whole board in view there's no "current" section, so leave the URL alone.
    if (board.width * pos.s <= view.width && board.height * pos.s <= view.height) return
    const here = regionAt(pos, view)
    if (here && here.id !== regionRef.current) navigate(here.path, { replace: true, state: { panned: true } })
  }

  const onZoom = useCallback((s) => {
    scaleRef.current = s
    setZoom(Math.round(s * 100))
  }, [])

  const { panToRect, focusQuietly, zoomTo, zoomBy, fit } = usePan({
    viewportRef,
    boardRef,
    board,
    enabled: canvas,
    initial: restoring ? stored.pan : { x: 0, y: 0, s: 1 },
    inset,
    onSettle,
    onZoom,
  })

  // Lay the frames out from their measured heights; frames grow when web fonts and images arrive.
  useLayoutEffect(() => {
    if (!canvas) return undefined
    const measure = () => {
      const heights = Object.fromEntries(REGIONS.map((r) => [r.id, regionEl(r.id)?.offsetHeight ?? r.est]))
      const next = layoutFrames(heights)
      setLayout((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next))
      setMeasured(true)
    }
    measure()
    const ro = new ResizeObserver(measure)
    boardRef.current.querySelectorAll('[data-region]').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas])

  // Until the visitor moves the board themselves, keep the current frame in place as the layout settles.
  useLayoutEffect(() => {
    if (!canvas || !measured || interacted.current || restoring) return
    const el = regionEl(region.id)
    if (el) panToRect(rectOf(el), { instant: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout])

  // Bring a section frame into view, zooming back in first if the board is zoomed too far out to read it.
  const goToRegion = (el, opts) =>
    panToRect(rectOf(el), { ...opts, scale: scaleRef.current < READABLE_ZOOM ? 1 : undefined })

  // Route -> board position. First run jumps (or keeps the restored spot); later runs glide and move focus.
  // Waits for the measured layout: saved positions refer to it, not to the first-paint estimate.
  const placed = useRef(false)
  useLayoutEffect(() => {
    if (!canvas) {
      placed.current = false
      return
    }
    if (!measured) return
    const el = regionEl(region.id)
    if (!placed.current) {
      placed.current = true
      // A remembered spot only wins if it's still on the region the URL names.
      const vp = viewportRef.current
      const keep = restoring && regionAt(stored.pan, { width: vp.clientWidth, height: vp.clientHeight })?.id === region.id
      if (!keep) goToRegion(el, { instant: true })
      return
    }
    if (location.state?.panned) return
    goToRegion(el)
    focusQuietly(el.querySelector('[tabindex="-1"]'))
    // Keyed on the navigation, not the path, so clicking the section you're already on still brings it back.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.key, canvas, measured])

  // Phones: routes scroll the stacked page to their region.
  const scrolled = useRef(false)
  useEffect(() => {
    if (canvas) {
      scrolled.current = false
      return
    }
    if (location.state?.panned) return
    const behavior = scrolled.current ? 'smooth' : 'instant'
    scrolled.current = true
    if (region.id === 'home') window.scrollTo({ top: 0, behavior })
    else regionEl(region.id)?.scrollIntoView({ behavior, block: 'start' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, canvas])

  // Phones: the URL (and so the menu) follows the section being read.
  useEffect(() => {
    if (canvas) return undefined
    let frame = 0
    const update = () => {
      frame = 0
      const line = window.innerHeight * 0.35
      let current = REGIONS[0]
      for (const r of REGIONS) {
        const el = regionEl(r.id)
        if (el && el.getBoundingClientRect().top <= line) current = r
      }
      if (current.id !== regionRef.current) navigate(current.path, { replace: true, state: { panned: true } })
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', onScroll)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canvas])

  /* ---------- Selection (editor) ---------- */

  useLayoutEffect(() => {
    setSelRect(selected ? layerRect(selected) : null)
  }, [selected, board, layerRect])

  useLayoutEffect(() => {
    setHoverRect(hover && hover !== selected ? layerRect(hover) : null)
  }, [hover, selected, layerRect])

  useEffect(() => {
    if (!editor) setSelected(null)
  }, [editor])

  // Clicking selects the innermost layer under the pointer; empty board clears the selection.
  // Ordinary links and buttons inside the content keep working and don't change it.
  const onBoardClick = (e) => {
    if (!editor) return
    const interactive = e.target.closest('a, button')
    if (interactive && !interactive.closest('.ws-card')) return
    setSelected(e.target.closest('[data-layer]')?.dataset.layer ?? null)
  }

  const selectFromLayers = (id) => {
    setSelected(id)
    const rect = layerRect(id)
    // Far zoomed out, jumping to a layer also brings it back to a readable size.
    if (rect) panToRect(rect, { scale: scaleRef.current < READABLE_ZOOM ? 1 : undefined })
    if (id.startsWith('project-')) focusQuietly(boardRef.current.querySelector(`[data-layer="${id}"] a`))
  }

  const onViewportKeyDown = (e) => {
    if (e.key === 'Escape' && selected) setSelected(null)
  }

  const toggleUi = useCallback(() => {
    setUiHidden((v) => {
      writeJSON(localStorage, UI_KEY, { hidden: !v })
      return !v
    })
  }, [])

  // Ctrl+\ toggles the panels, as in most design tools.
  useEffect(() => {
    if (!editor) return undefined
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === '\\') {
        e.preventDefault()
        toggleUi()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editor, toggleUi])

  /* ---------- Shared-element transition ---------- */

  // Give the shared-element name to exactly one cover, so it can morph into the case-study hero.
  const nameHero = useCallback((slug) => {
    boardRef.current?.querySelectorAll('[data-media]').forEach((el) => {
      el.style.viewTransitionName = el.closest('[data-slug]').dataset.slug === slug ? HERO_TRANSITION : ''
    })
  }, [])

  const openProject = useCallback(
    (slug) => {
      nameHero(slug)
      writeStored({ last: slug })
    },
    [nameHero],
  )

  // Coming back from a case study: the cover we left from receives the hero, then lets the name go.
  useLayoutEffect(() => {
    if (!stored.last) return undefined
    nameHero(stored.last)
    const t = setTimeout(() => nameHero(null), 1000)
    return () => clearTimeout(t)
  }, [stored.last, nameHero])

  const showPanels = editor && !uiHidden

  return (
    <div ref={rootRef} className={`site-canvas${showPanels ? ' has-panels' : ''}`}>
      {editor && (
        <Toolbar
          region={region}
          zoom={zoom}
          onZoomIn={() => zoomBy(1.25)}
          onZoomOut={() => zoomBy(0.8)}
          onZoomReset={() => zoomTo(1)}
          onFit={fit}
          fullscreen={fullscreen}
          uiHidden={uiHidden}
          onToggleUi={toggleUi}
        />
      )}

      {showPanels && <LayersPanel regionId={region.id} selectedId={selected} onSelect={selectFromLayers} onHover={setHover} />}

      {canvas && !editor && (
        <div className="ws-bar">
          <div className="ws-bar__actions">
            <ThemeToggle className="ws-bar__btn ws-bar__btn--icon" />
            <button type="button" className="ws-bar__btn" onClick={() => goToRegion(regionEl(region.id))}>
              Recenter
            </button>
            {fullscreen.supported && (
              <button type="button" className="ws-bar__btn" aria-pressed={fullscreen.active} onClick={fullscreen.toggle}>
                {fullscreen.active ? 'Exit fullscreen' : 'Fullscreen'}
              </button>
            )}
          </div>
        </div>
      )}

      <div
        ref={viewportRef}
        className="ws-viewport"
        role={canvas ? 'region' : undefined}
        aria-label={canvas ? 'Site canvas' : undefined}
        aria-describedby={canvas ? hintId : undefined}
        tabIndex={canvas ? 0 : undefined}
        onKeyDown={(e) => {
          interacted.current = true
          onViewportKeyDown(e)
        }}
        onPointerDown={() => { interacted.current = true }}
        onWheel={() => { interacted.current = true }}
      >
        {canvas && (
          <p className="visually-hidden" id={hintId}>
            The site is one canvas. Drag, scroll, or use the arrow keys while it is focused to move around; hold Ctrl
            and scroll, or press plus and minus, to zoom. The pages list jumps between sections. Tab moves through links.
          </p>
        )}
        {/* Pointer selection; keyboard users get the same through the Layers panel. */}
        <div
          ref={boardRef}
          className="ws-board"
          style={{ '--board-w': `${board.width}px`, '--board-h': `${board.height}px` }}
          onClick={onBoardClick}
        >
          {REGIONS.map((r, i) => {
            const Content = CONTENT[r.id]
            return (
              <section
                key={r.id}
                id={`region-${r.id}`}
                className={`ws-region ws-region--${r.id}`}
                data-region={r.id}
                data-layer={`region-${r.id}`}
                aria-labelledby={`region-${r.id}-title`}
                style={{
                  '--x': `${framePos[r.id].x}px`,
                  '--y': `${framePos[r.id].y}px`,
                  '--w': `${r.width}px`,
                  '--h': r.height ? `${r.height}px` : 'auto',
                  '--i': i,
                }}
              >
                <p className="ws-region__label" aria-hidden="true">
                  <span className="ws-region__num">{r.number}</span>
                  {r.label}
                </p>
                <div className="ws-region__body">
                  <Content canvas={canvas} editor={editor} selected={selected} onOpen={openProject} />
                </div>
              </section>
            )
          })}

          {canvas && STICKY_NOTES.map((n) => <StickyNote key={n.id} {...n} {...notePosition(n, layout)} />)}

          {editor && hoverRect && (
            <div className="ws-outline ws-outline--hover" style={rectStyle(hoverRect)} aria-hidden="true" />
          )}
          {editor && selRect && (
            <div className="ws-outline ws-outline--selected" style={rectStyle(selRect)} aria-hidden="true">
              <span className="ws-outline__handle" data-pos="tl" />
              <span className="ws-outline__handle" data-pos="tr" />
              <span className="ws-outline__handle" data-pos="bl" />
              <span className="ws-outline__handle" data-pos="br" />
              <span className="ws-outline__size">
                {Math.round(selRect.width)} × {Math.round(selRect.height)}
              </span>
            </div>
          )}
        </div>
        {canvas && <CanvasCursor viewportRef={viewportRef} />}
      </div>

      {showPanels && <Inspector selectedId={selected} rect={selRect} onOpenProject={openProject} onClear={() => setSelected(null)} />}
    </div>
  )
}

const rectStyle = (r) => ({ left: r.x, top: r.y, width: r.width, height: r.height })
