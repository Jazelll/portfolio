// Shared building blocks for the illustrative (non-screenshot) project compositions.

export function IllustrativeTag({ children = 'Illustrative concept, not a production screenshot' }) {
  return <span className="ill-tag">{children}</span>
}

// An abstract "photo": tonal field + horizon + sun. Reads as imagery without pretending to be real user content.
export function PhotoTile({ tone = 'clay', variant = 0, className = '' }) {
  const hills = [
    'M0 70 Q25 48 50 62 T100 54 V100 H0Z',
    'M0 64 Q30 72 55 52 T100 66 V100 H0Z',
    'M0 58 L30 40 L52 60 L74 44 L100 62 V100 H0Z',
  ]
  return (
    <span className={`photo photo--${tone} ${className}`} aria-hidden="true">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none">
        <circle cx={variant === 1 ? 26 : 72} cy="30" r="9" className="photo__sun" />
        <path d={hills[variant % hills.length]} className="photo__hill" />
      </svg>
    </span>
  )
}

export function MapField({ pins = [] }) {
  return (
    <div className="map-field" aria-hidden="true">
      <svg viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice">
        <path className="map-water" d="M0 190 C60 170 90 210 150 200 S260 160 300 190 S380 230 400 210 V260 H0Z" />
        <g className="map-contour">
          <path d="M40 60 C90 30 160 40 190 80 S270 120 330 70" />
          <path d="M20 100 C80 70 150 80 190 115 S280 150 360 105" />
          <path d="M60 140 C110 120 160 130 200 150 S290 170 380 140" />
        </g>
        <g className="map-road">
          <path d="M0 40 L120 90 L230 70 L400 120" />
          <path d="M150 0 L170 120 L140 260" />
          <path d="M260 0 L290 140 L330 260" />
        </g>
        <path className="map-route" d="M84 76 C130 110 170 96 214 128 S280 120 300 88" />
      </svg>
      {pins.map((p, i) => (
        <span key={i} className={`map-pin${p.active ? ' is-active' : ''}`} style={{ left: `${p.x}%`, top: `${p.y}%` }}>
          {p.label && <span className="map-pin__label">{p.label}</span>}
        </span>
      ))}
    </div>
  )
}

export function Lines({ widths = [80, 60], className = '' }) {
  return (
    <span className={`lines ${className}`} aria-hidden="true">
      {widths.map((w, i) => (
        <span key={i} style={{ width: `${w}%` }} />
      ))}
    </span>
  )
}
