// Shared building blocks used across the canvas frames and the case studies, so the whole portfolio reads
// as one publication rather than a set of differently styled blocks.

// A named frame nested inside a section, as in a design tool: the name sits above the frame's top edge.
// `layer` makes it selectable in the editor and listed in its Layers panel.
export function Frame({ layer, name, className = '', children }) {
  return (
    <div className={`ws-subframe ${className}`.trim()} data-layer={layer}>
      <p className="ws-subframe__label" aria-hidden="true">{name}</p>
      <div className="ws-subframe__body">{children}</div>
    </div>
  )
}

// Specification rows: label / value pairs set like a data sheet.
export function SpecList({ rows, className = '' }) {
  return (
    <dl className={`spec ${className}`.trim()}>
      {rows.filter(([, v]) => v).map(([k, v]) => (
        <div key={k} className="spec__row">
          <dt>{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

// A slim browser frame around a landing-page capture.
export function BrowserFrame({ label, children, className = '' }) {
  return (
    <div className={`frame-browser ${className}`.trim()}>
      <div className="frame-browser__bar" aria-hidden="true">
        <span /><span /><span />
        {label && <span className="frame-browser__url">{label}</span>}
      </div>
      <div className="frame-browser__view">{children}</div>
    </div>
  )
}

// Notes that an image or composition was drawn for this portfolio rather than taken from a project.
export function IllustrativeNote({ children }) {
  return <p className="ar-illustrative">{children}</p>
}
