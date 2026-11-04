import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getProject } from '../../data/projects'
import { site } from '../../data/site'
import { FRAMES, REGIONS, REGION_LAYERS } from '../../data/canvas'
import TransitionLink from '../TransitionLink'
import { ArrowRight, GitHubIcon, LinkedInIcon, MailIcon, SidebarIcon } from '../icons'

// Desktop editor chrome around the site canvas, styled after a design tool: a toolbar, a Pages + Layers
// panel on the left and an inspector on the right. Everything shown is real site content or real layout
// values; nothing here is decorative-only.

/* ---------- Layer tree ---------- */

function buildTree() {
  return REGIONS.map((r) => {
    const children = r.id === 'work'
      ? FRAMES.map((f) => ({
        id: `frame-${f.id}`,
        name: f.label,
        kind: 'frame',
        children: f.cards.map((c) => {
          const project = getProject(c.slug)
          return { id: `project-${c.slug}`, name: project.title, kind: 'project', project }
        }),
      }))
      : REGION_LAYERS[r.id].map((l) => ({ ...l, kind: 'group' }))
    return { id: `region-${r.id}`, name: r.label, kind: 'region', region: r, children }
  })
}

export const LAYER_TREE = buildTree()

// id -> { node, parent }
export const LAYER_INDEX = (() => {
  const map = {}
  const walk = (nodes, parent) => nodes.forEach((n) => {
    map[n.id] = { node: n, parent }
    if (n.children) walk(n.children, n)
  })
  walk(LAYER_TREE, null)
  return map
})()

const KIND_LABEL = { region: 'Section', frame: 'Frame', group: 'Group', project: 'Project' }

function LayerIcon({ kind }) {
  const paths = {
    region: <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />,
    frame: <path d="M8 3v18M16 3v18M3 8h18M3 16h18" />,
    group: <><rect x="4" y="4" width="16" height="16" rx="2" strokeDasharray="3 3" /></>,
    project: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 16 5-5 4 4 3-3 6 6" /></>,
  }
  return (
    <svg className="ed-layer__icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[kind]}
    </svg>
  )
}

/* ---------- Toolbar ---------- */

export function Toolbar({ region, zoom, onZoomIn, onZoomOut, onZoomReset, onFit, fullscreen, uiHidden, onToggleUi }) {
  return (
    <header className="ed-toolbar">
      <div className="ed-toolbar__start">
        <button
          type="button"
          className="ed-icon-btn"
          aria-pressed={!uiHidden}
          aria-label={uiHidden ? 'Show panels' : 'Hide panels'}
          title={`${uiHidden ? 'Show' : 'Hide'} panels (Ctrl+\\)`}
          onClick={onToggleUi}
        >
          <SidebarIcon size={16} />
        </button>
        <NavLink to="/" className="ed-mark" aria-label={`${site.name}, home`}>AR</NavLink>
      </div>

      <p className="ed-toolbar__doc">
        <span className="ed-toolbar__owner">{site.name}</span>
        <span aria-hidden="true">/</span>
        <span className="ed-toolbar__page">{region.label}</span>
      </p>

      <div className="ed-toolbar__end">
        <div className="ed-zoom" role="group" aria-label="Zoom">
          <button type="button" className="ed-icon-btn" onClick={onZoomOut} aria-label="Zoom out" title="Zoom out (−)">−</button>
          <button type="button" className="ed-zoom__value" onClick={onZoomReset} title="Zoom to 100% (Shift+0)">
            <span className="visually-hidden">Zoom level </span>{zoom}%
          </button>
          <button type="button" className="ed-icon-btn" onClick={onZoomIn} aria-label="Zoom in" title="Zoom in (+)">+</button>
          <button type="button" className="ed-btn ed-btn--quiet" onClick={onFit} title="Zoom to fit (Shift+1)">Fit</button>
        </div>
        {fullscreen.supported && (
          <button type="button" className="ed-btn ed-btn--quiet" aria-pressed={fullscreen.active} onClick={fullscreen.toggle}>
            {fullscreen.active ? 'Exit' : 'Present'}
          </button>
        )}
        <a className="ed-btn ed-btn--ink" href={`mailto:${site.email}`}>
          Email me <ArrowRight size={13} />
        </a>
      </div>
    </header>
  )
}

/* ---------- Pages + Layers ---------- */

function LayerRow({ node, depth, selected, open, onToggle, onSelect, onHover }) {
  const hasChildren = Boolean(node.children?.length)
  return (
    <div
      className={`ed-layer${selected ? ' is-selected' : ''}`}
      style={{ '--depth': depth }}
      onPointerEnter={() => onHover(node.id)}
      onPointerLeave={() => onHover(null)}
    >
      {hasChildren ? (
        <button
          type="button"
          className="ed-layer__caret"
          aria-expanded={open}
          aria-label={`${open ? 'Collapse' : 'Expand'} ${node.name}`}
          onClick={() => onToggle(node.id)}
        >
          <svg width="10" height="10" viewBox="0 0 10 10" aria-hidden="true"><path d="M3 2l4 3-4 3z" fill="currentColor" /></svg>
        </button>
      ) : (
        <span className="ed-layer__caret" aria-hidden="true" />
      )}
      <button
        type="button"
        className="ed-layer__name"
        aria-pressed={selected}
        onClick={() => onSelect(node.id)}
        onFocus={() => onHover(node.id)}
        onBlur={() => onHover(null)}
      >
        <LayerIcon kind={node.kind} />
        <span>{node.name}</span>
      </button>
    </div>
  )
}

export function LayersPanel({ regionId, selectedId, onSelect, onHover }) {
  // The current section's layers start expanded; selecting a layer opens its ancestors.
  const [open, setOpen] = useState(() => new Set([`region-${regionId}`, 'frame-product', 'frame-web']))

  useEffect(() => {
    setOpen((prev) => new Set(prev).add(`region-${regionId}`))
  }, [regionId])

  useEffect(() => {
    if (!selectedId) return
    const chain = []
    let p = LAYER_INDEX[selectedId]?.parent
    while (p) {
      chain.push(p.id)
      p = LAYER_INDEX[p.id].parent
    }
    if (chain.length) setOpen((prev) => new Set([...prev, ...chain]))
  }, [selectedId])

  const toggle = (id) => setOpen((prev) => {
    const next = new Set(prev)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    return next
  })

  const renderNodes = (nodes, depth) => (
    <ul className="ed-tree">
      {nodes.map((n) => (
        <li key={n.id}>
          <LayerRow
            node={n}
            depth={depth}
            selected={selectedId === n.id}
            open={open.has(n.id)}
            onToggle={toggle}
            onSelect={onSelect}
            onHover={onHover}
          />
          {n.children && open.has(n.id) && renderNodes(n.children, depth + 1)}
        </li>
      ))}
    </ul>
  )

  return (
    <aside className="ed-panel ed-panel--left" aria-label="Pages and layers">
      <nav className="ed-section" aria-label="Pages">
        <h2 className="ed-section__title">Pages</h2>
        <ul className="ed-pages">
          {REGIONS.map((r) => (
            <li key={r.id}>
              <NavLink to={r.path} end className="ed-page">
                <span className="ed-page__check" aria-hidden="true">✓</span>
                {r.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <section className="ed-section ed-section--grow" aria-label="Layers">
        <h2 className="ed-section__title">Layers</h2>
        {renderNodes(LAYER_TREE, 0)}
      </section>

      <section className="ed-section ed-section--foot" aria-label="Socials">
        <ul className="ed-socials">
          <li>
            <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="ed-social">
              <LinkedInIcon size={15} /> LinkedIn<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={site.github} target="_blank" rel="noopener noreferrer" className="ed-social">
              <GitHubIcon size={15} /> GitHub<span className="visually-hidden"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.email}`} className="ed-social"><MailIcon size={15} /> Email</a>
          </li>
        </ul>
      </section>
    </aside>
  )
}

/* ---------- Inspector ---------- */

const STYLE_TOKENS = [
  ['Ink', '--c-ink'],
  ['Muted', '--c-muted'],
  ['Border', '--c-border'],
  ['Surface', '--c-surface-2'],
  ['Background', '--c-bg'],
]

function Field({ label, value }) {
  return (
    <div className="ed-field">
      <span className="ed-field__label">{label}</span>
      <span className="ed-field__value">{value}</span>
    </div>
  )
}

function Geometry({ rect }) {
  if (!rect) return null
  return (
    <section className="ed-section">
      <h3 className="ed-section__title">Layout</h3>
      <div className="ed-fields ed-fields--grid">
        <Field label="X" value={Math.round(rect.x)} />
        <Field label="Y" value={Math.round(rect.y)} />
        <Field label="W" value={Math.round(rect.width)} />
        <Field label="H" value={Math.round(rect.height)} />
      </div>
    </section>
  )
}

function Row({ label, children }) {
  return (
    <div className="ed-row">
      <dt>{label}</dt>
      <dd>{children}</dd>
    </div>
  )
}

// Live values of the site's own tokens, so the swatches always match the theme in use.
function useTokens() {
  const [values, setValues] = useState({})
  useEffect(() => {
    const read = () => {
      const cs = getComputedStyle(document.documentElement)
      setValues(Object.fromEntries(STYLE_TOKENS.map(([, v]) => [v, cs.getPropertyValue(v).trim()])))
    }
    read()
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    mq.addEventListener('change', read)
    return () => mq.removeEventListener('change', read)
  }, [])
  return values
}

function DocumentInspector() {
  const tokens = useTokens()
  return (
    <>
      <section className="ed-section">
        <h3 className="ed-section__title">Document</h3>
        <dl className="ed-rows">
          <Row label="Owner">{site.fullName}</Row>
          <Row label="Role">{site.role}</Row>
          {site.available && <Row label="Status"><span className="ed-status"><span aria-hidden="true" />Open to opportunities</span></Row>}
        </dl>
        <p className="ed-hint">Select anything on the canvas to inspect it.</p>
      </section>

      <section className="ed-section">
        <h3 className="ed-section__title">Color styles</h3>
        <ul className="ed-swatches">
          {STYLE_TOKENS.map(([name, v]) => (
            <li key={v} className="ed-swatch">
              <span className="ed-swatch__chip" style={{ background: `var(${v})` }} aria-hidden="true" />
              <span className="ed-swatch__name">{name}</span>
              <span className="ed-swatch__hex">{tokens[v]}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="ed-section">
        <h3 className="ed-section__title">Text styles</h3>
        <ul className="ed-type">
          <li><span className="ed-type__sample ed-type__sample--display">Ag</span><span>Display<small>Manrope · 700</small></span></li>
          <li><span className="ed-type__sample">Ag</span><span>Body<small>DM Sans · 400</small></span></li>
        </ul>
      </section>
    </>
  )
}

export function Inspector({ selectedId, rect, onOpenProject, onClear }) {
  const entry = selectedId ? LAYER_INDEX[selectedId] : null
  const node = entry?.node

  return (
    <aside className="ed-panel ed-panel--right" aria-label="Inspector" aria-live="polite">
      {!node && <DocumentInspector />}

      {node && (
        <>
          <section className="ed-section ed-section--head">
            <p className="ed-kind"><LayerIcon kind={node.kind} />{KIND_LABEL[node.kind]}</p>
            <h2 className="ed-inspect-title">{node.name}</h2>
            {entry.parent && <p className="ed-parent">in {entry.parent.name}</p>}
            <button type="button" className="ed-link-btn" onClick={onClear}>Deselect <kbd>Esc</kbd></button>
          </section>

          <Geometry rect={rect} />

          {node.kind === 'project' && (
            <section className="ed-section">
              <h3 className="ed-section__title">Project</h3>
              <p className="ed-summary">{node.project.summary}</p>
              <dl className="ed-rows">
                <Row label="Category">{node.project.category}</Row>
                <Row label="Industry">{node.project.industry}</Row>
                <Row label="Platform">{node.project.platform}</Row>
                <Row label="Year">{node.project.year}</Row>
                <Row label="Duration">{node.project.duration}</Row>
                <Row label="Role">{node.project.role.join(', ')}</Row>
                <Row label="Team">{node.project.team.join(', ')}</Row>
              </dl>
              <TransitionLink
                to={`/work/${node.project.slug}`}
                className="ed-btn ed-btn--ink ed-btn--block"
                onBeforeTransition={() => onOpenProject(node.project.slug)}
              >
                Open case study <ArrowRight size={13} />
              </TransitionLink>
            </section>
          )}

          {node.kind === 'region' && (
            <section className="ed-section">
              <h3 className="ed-section__title">Section</h3>
              <dl className="ed-rows">
                <Row label="Route">{node.region.path}</Row>
                <Row label="Layers">{node.children.length}</Row>
              </dl>
            </section>
          )}

          {node.kind === 'frame' && (
            <section className="ed-section">
              <h3 className="ed-section__title">Contents</h3>
              <ul className="ed-list">
                {node.children.map((c) => <li key={c.id}>{c.name}<span>{c.project.year}</span></li>)}
              </ul>
            </section>
          )}
        </>
      )}
    </aside>
  )
}
