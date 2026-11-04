// Artifacts for the four-stage process (Approach frame). Each stage carries a small artifact of the kind it
// produces. The artifacts are generic drawings (skeleton bars, placeholder labels): they show the form
// of the work, never findings, quotes or metrics.

function Bars({ widths }) {
  return widths.map((w, i) => <span key={i} className="art-bar" style={{ width: `${w}%` }} />)
}

function NotesArtifact() {
  return (
    <div className="art art--notes">
      <p className="art__title">Research notes</p>
      {['Goal', 'Context', 'Pain point', 'Pain point'].map((k, i) => (
        <div key={i} className="art-row">
          <span className="art-key">{k}</span>
          <span className="art-val"><Bars widths={[[82, 54], [70], [88, 40], [64]][i]} /></span>
        </div>
      ))}
      <p className="art-hmw">How might we … ?</p>
    </div>
  )
}

function SitemapArtifact() {
  return (
    <svg className="art art--map" viewBox="0 0 220 150" role="presentation">
      <g className="art-lines">
        <path d="M110 34 V52 M40 52 H180 M40 52 V66 M110 52 V66 M180 52 V66 M110 92 V108 M80 108 H140 M80 108 V118 M140 108 V118" />
      </g>
      <g className="art-nodes">
        <rect x="82" y="12" width="56" height="22" rx="3" className="is-root" />
        <rect x="14" y="66" width="52" height="26" rx="3" />
        <rect x="84" y="66" width="52" height="26" rx="3" />
        <rect x="154" y="66" width="52" height="26" rx="3" />
        <rect x="58" y="118" width="44" height="20" rx="3" />
        <rect x="118" y="118" width="44" height="20" rx="3" />
      </g>
      <g className="art-labels">
        <text x="110" y="27">Home</text>
        <text x="40" y="83">Browse</text>
        <text x="110" y="83">Detail</text>
        <text x="180" y="83">Account</text>
        <text x="80" y="132">Step 1</text>
        <text x="140" y="132">Step 2</text>
      </g>
    </svg>
  )
}

function WireframeArtifact() {
  return (
    <div className="art art--wire">
      <span className="wire-nav"><span /><span /><span /></span>
      <span className="wire-media" />
      <span className="wire-copy"><Bars widths={[72, 92, 56]} /></span>
      <span className="wire-cta" />
    </div>
  )
}

function RefineArtifact() {
  return (
    <div className="art art--refine">
      <div className="refine-col">
        <span className="refine-tag">Before</span>
        <span className="refine-field refine-field--weak"><span className="art-bar" style={{ width: '46%' }} /></span>
        <span className="refine-btn refine-btn--weak" />
      </div>
      <div className="refine-col">
        <span className="refine-tag">After</span>
        <span className="refine-label" />
        <span className="refine-field refine-field--focus"><span className="art-bar" style={{ width: '46%' }} /></span>
        <span className="refine-btn" />
      </div>
      <div className="refine-states">
        {['Default', 'Focus', 'Error'].map((s) => <span key={s} data-state={s.toLowerCase()}>{s}</span>)}
      </div>
    </div>
  )
}

export const ARTIFACTS = [
  { el: <NotesArtifact />, caption: 'Notes & problem framing' },
  { el: <SitemapArtifact />, caption: 'Sitemap & flows' },
  { el: <WireframeArtifact />, caption: 'Wireframes' },
  { el: <RefineArtifact />, caption: 'Iterations & states' },
]
