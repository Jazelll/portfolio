import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useNavigationType } from 'react-router-dom'
import { REGIONS, regionForPath } from '../../data/canvas'
import usePageMeta from '../usePageMeta'
import { HERO_TRANSITION } from '../TransitionLink'
import usePan from './usePan'
import { AboutRegion, ContactRegion, HomeRegion, WorkRegion } from './regions'

// The whole site as one board. `/`, `/work`, `/about` and `/contact` are regions on it: visiting a route
// glides the board to its region, and dragging into another region updates the URL (and so the sidebar).
// Below 768px the regions stack into one long page and the routes scroll to them instead.

const CANVAS_QUERY = '(min-width: 768px)'
const STORAGE_KEY = 'canvas:v2'
const INSET = { top: 64, left: 0 } // room kept clear of the floating bar
const BOARD_PAD = 80

const META = {
  home: {},
  work: { title: 'Work', description: 'Product design, mobile, web, and landing page projects by UI/UX designer Althea Rito.' },
  about: { title: 'About', description: 'Background, experience, skills, and education of UI/UX designer Althea Rito.' },
  contact: { title: 'Contact', description: 'Get in touch with UI/UX designer Althea Rito by email or LinkedIn.' },
}

// Session storage can be unavailable (private mode, blocked storage); the canvas works without it.
const readStored = () => {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}
const writeStored = (patch) => {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...readStored(), ...patch }))
  } catch {
    /* ignore */
  }
}

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

const CONTENT = { home: HomeRegion, work: WorkRegion, about: AboutRegion, contact: ContactRegion }

// Rough size before the regions are measured; generous so the first clamp never cuts content off.
const ESTIMATED_BOARD = {
  width: Math.max(...REGIONS.map((r) => r.x + r.width)) + BOARD_PAD,
  height: 2400,
}

export default function SiteCanvas() {
  const location = useLocation()
  const navType = useNavigationType()
  const navigate = useNavigate()
  const region = regionForPath(location.pathname) ?? REGIONS[0]
  const canvas = useMediaQuery(CANVAS_QUERY)
  const rootRef = useRef(null)
  const viewportRef = useRef(null)
  const boardRef = useRef(null)
  const hintId = useId()
  const fullscreen = useFullscreen(rootRef)
  const [stored] = useState(readStored)
  const [board, setBoard] = useState(ESTIMATED_BOARD)

  // Keep the place on the board when coming back from a case study, or on reload / history navigation.
  const [restoring] = useState(() => Boolean(stored.pan) && (navType === 'POP' || location.state?.restore))

  usePageMeta({ ...META[region.id], path: region.path })

  const regionRef = useRef(region.id)
  regionRef.current = region.id

  const regionEl = (id) => boardRef.current?.querySelector(`[data-region="${id}"]`)
  const rectOf = (el) => ({ x: el.offsetLeft, y: el.offsetTop, width: el.offsetWidth, height: el.offsetHeight })

  // The region nearest the centre of the free viewport area.
  const regionAt = (pos, view) => {
    const cx = INSET.left + (view.width - INSET.left) / 2 - pos.x
    const cy = INSET.top + (view.height - INSET.top) / 2 - pos.y
    let best = null
    let bestDist = Infinity
    for (const r of REGIONS) {
      const el = regionEl(r.id)
      if (!el) continue
      const { x, y, width, height } = rectOf(el)
      const dx = Math.max(x - cx, 0, cx - (x + width))
      const dy = Math.max(y - cy, 0, cy - (y + height))
      const dist = Math.hypot(dx, dy)
      if (dist < bestDist) {
        bestDist = dist
        best = r
      }
    }
    return best
  }

  const onSettle = (pos, view) => {
    writeStored({ pan: pos })
    const here = regionAt(pos, view)
    if (here && here.id !== regionRef.current) navigate(here.path, { replace: true, state: { panned: true } })
  }

  const { panToRect, focusQuietly } = usePan({
    viewportRef,
    boardRef,
    board,
    enabled: canvas,
    initial: restoring ? stored.pan : { x: 0, y: 0 },
    inset: INSET,
    onSettle,
  })

  // Size the board to its content; regions grow when web fonts arrive.
  useLayoutEffect(() => {
    if (!canvas) return undefined
    const measure = () => {
      const els = [...boardRef.current.querySelectorAll('[data-region]')]
      setBoard({
        width: Math.max(...els.map((el) => el.offsetLeft + el.offsetWidth)) + BOARD_PAD,
        height: Math.max(...els.map((el) => el.offsetTop + el.offsetHeight)) + BOARD_PAD,
      })
    }
    measure()
    const ro = new ResizeObserver(measure)
    boardRef.current.querySelectorAll('[data-region]').forEach((el) => ro.observe(el))
    return () => ro.disconnect()
  }, [canvas])

  // Route -> board position. First run jumps (or keeps the restored spot); later runs glide and move focus.
  const placed = useRef(false)
  useLayoutEffect(() => {
    if (!canvas) {
      placed.current = false
      return
    }
    const el = regionEl(region.id)
    if (!placed.current) {
      placed.current = true
      // A remembered spot only wins if it's still on the region the URL names.
      const vp = viewportRef.current
      const keep = restoring && regionAt(stored.pan, { width: vp.clientWidth, height: vp.clientHeight })?.id === region.id
      if (!keep) panToRect(rectOf(el), { instant: true })
      return
    }
    if (location.state?.panned) return
    panToRect(rectOf(el))
    focusQuietly(el.querySelector('[tabindex="-1"]'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, canvas])

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

  const number = (r) => String(REGIONS.indexOf(r) + 1).padStart(2, '0')

  return (
    <div ref={rootRef} className="site-canvas">
      {canvas && (
        <div className="ws-bar">
          <div className="ws-bar__actions">
            <p className="ws-bar__hint" id={hintId}>
              <span aria-hidden="true">Drag or scroll to explore</span>
              <span className="visually-hidden">
                The site is one canvas. Drag, scroll, or use the arrow keys while it is focused to move around;
                the menu jumps between sections. Tab moves through links.
              </span>
            </p>
            <button type="button" className="ws-bar__btn" onClick={() => panToRect(rectOf(regionEl(region.id)))}>
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
      >
        <div ref={boardRef} className="ws-board" style={{ '--board-w': `${board.width}px`, '--board-h': `${board.height}px` }}>
          {REGIONS.map((r, i) => {
            const Content = CONTENT[r.id]
            return (
              <section
                key={r.id}
                id={`region-${r.id}`}
                className={`ws-region ws-region--${r.id}`}
                data-region={r.id}
                aria-labelledby={`region-${r.id}-title`}
                style={{
                  '--x': `${r.x}px`,
                  '--y': `${r.y}px`,
                  '--w': `${r.width}px`,
                  '--h': r.height ? `${r.height}px` : 'auto',
                  '--i': i,
                }}
              >
                <p className="ws-region__label" aria-hidden="true">
                  <span className="ws-region__num">{number(r)}</span>
                  {r.label}
                </p>
                <div className="ws-region__body">
                  <Content canvas={canvas} onOpen={openProject} />
                </div>
              </section>
            )
          })}
        </div>
      </div>
    </div>
  )
}
