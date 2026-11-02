import { useId, useState } from 'react'
import Img from './Img'

// Presents a full-length landing page capture in a browser frame, collapsed to a preview by default.
export default function PageView({ image, alt, caption, label }) {
  const [expanded, setExpanded] = useState(false)
  const id = useId()

  return (
    <figure className={`pageview${expanded ? ' is-expanded' : ''}`}>
      <div className="pageview__chrome" aria-hidden="true">
        <span /><span /><span />
        <span className="pageview__url">{label}</span>
      </div>
      <div className="pageview__viewport" id={id}>
        <Img image={image} alt={alt} sizes="(min-width: 1100px) 1100px, 100vw" />
      </div>
      <div className="pageview__foot">
        <figcaption className="meta">{caption}</figcaption>
        <button
          type="button"
          className="arrow-link pageview__toggle"
          aria-expanded={expanded}
          aria-controls={id}
          onClick={() => setExpanded((v) => !v)}
        >
          <span className="link-text">{expanded ? 'Collapse page' : 'Show full page'}</span>
          <span className="arrow" aria-hidden="true">{expanded ? '↑' : '↓'}</span>
        </button>
      </div>
    </figure>
  )
}
