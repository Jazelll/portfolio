// Pieces of the Design system frame. The specimen is a neutral sample built for this portfolio to show the
// shape of the work (foundations, components, states, platforms, tokens). The production system is
// client work and stays private; nothing here is taken from it.

// Contribution, worded from the experience entry and the Financial Platforms process (site.js / projects.js).
export const CONTRIBUTION = [
  ['Initiated', 'Started and helped establish a scalable design system for web, mobile and cash teller machine interfaces.'],
  ['Foundations', 'Typography, color and spacing foundations shared across platforms.'],
  ['Components', 'Reusable components with documented states and interaction patterns.'],
  ['Collaboration', 'Worked with developers, business analysts and stakeholders on usability and implementation.'],
]

const TYPE = [
  ['Display', '40 / 44', 'sp-type--display'],
  ['Heading', '24 / 32', 'sp-type--heading'],
  ['Body', '16 / 24', 'sp-type--body'],
  ['Caption', '12 / 16', 'sp-type--caption'],
]

const COLORS = {
  Primary: [['Ink', '#111111'], ['Primary', '#1F3A5F']],
  Neutral: [['900', '#262626'], ['600', '#5C5C5C'], ['300', '#C9C9C9'], ['100', '#EFEFEF']],
  Semantic: [['Success', '#2E6B4A'], ['Warning', '#94661B'], ['Error', '#A3302A']],
}

const STATES = ['Default', 'Hover', 'Focus', 'Active', 'Disabled', 'Error']

const TOKENS = [
  ['Spacing', [4, 8, 12, 16, 24, 32]],
  ['Radius', [2, 4, 8]],
  ['Type scale', [12, 14, 16, 20, 24, 40]],
]

export function Contribution() {
  return (
    <dl className="ar-contrib">
      {CONTRIBUTION.map(([k, v]) => (
        <div key={k}>
          <dt className="meta-label">{k}</dt>
          <dd>{v}</dd>
        </div>
      ))}
    </dl>
  )
}

export function Foundations() {
  return (
    <>
      <ul className="sp-type">
        {TYPE.map(([name, size, cls]) => (
          <li key={name}>
            <span className={`sp-type__sample ${cls}`}>Aa</span>
            <span className="sp-type__name">{name}</span>
            <span className="sp-type__size">{size}</span>
          </li>
        ))}
      </ul>
      {Object.entries(COLORS).map(([group, list]) => (
        <div key={group} className="sp-swatch-group">
          <p className="sp-sub">{group}</p>
          <ul className="sp-swatches">
            {list.map(([name, hex]) => (
              <li key={name}>
                <span className="sp-chip" style={{ background: hex }} />
                <span className="sp-chip__name">{name}</span>
                <span className="sp-chip__hex">{hex}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </>
  )
}

export function ComponentLibrary() {
  return (
    <div className="sp-components" aria-hidden="true">
      <div className="sp-row">
        <span className="sp-btn sp-btn--primary">Continue</span>
        <span className="sp-btn">Back</span>
        <span className="sp-btn sp-btn--ghost">Cancel</span>
      </div>
      <div className="sp-row sp-row--fields">
        <span className="sp-field"><span className="sp-field__label">Account name</span><span className="sp-input">Sample account</span></span>
        <span className="sp-field"><span className="sp-field__label">Branch</span><span className="sp-input sp-input--select">Select branch</span></span>
      </div>
      <div className="sp-tabs"><span className="is-active">Overview</span><span>Activity</span><span>Settings</span></div>
      <div className="sp-table">
        <span className="sp-table__head"><span>Reference</span><span>Status</span><span>Amount</span></span>
        {['Pending', 'Complete', 'Complete'].map((st, i) => (
          <span key={i} className="sp-table__row">
            <span className="sp-skel" style={{ width: `${[60, 72, 52][i]}%` }} />
            <span className={`sp-pill sp-pill--${st.toLowerCase()}`}>{st}</span>
            <span className="sp-skel sp-skel--end" style={{ width: `${[40, 54, 46][i]}%` }} />
          </span>
        ))}
      </div>
      <div className="sp-modal">
        <span className="sp-modal__title">Confirm this action?</span>
        <span className="sp-skel" style={{ width: '80%' }} />
        <span className="sp-row sp-row--end"><span className="sp-btn sp-btn--ghost">Cancel</span><span className="sp-btn sp-btn--primary">Confirm</span></span>
      </div>
    </div>
  )
}

export function InteractionStates() {
  return (
    <ul className="sp-states" aria-hidden="true">
      {STATES.map((s) => (
        <li key={s}>
          <span className="sp-btn sp-btn--primary" data-state={s.toLowerCase()}>Button</span>
          <span className="sp-state-name">{s}</span>
        </li>
      ))}
    </ul>
  )
}

export function Platforms() {
  return (
    <div className="sp-platforms" aria-hidden="true">
      <figure className="sp-device sp-device--web">
        <span className="sp-web">
          <span className="sp-web__side" />
          <span className="sp-web__main">
            <span className="sp-web__cards"><span /><span /><span /></span>
            <span className="sp-web__table"><span /><span /><span /></span>
          </span>
        </span>
        <figcaption>Web application</figcaption>
      </figure>
      <figure className="sp-device sp-device--mobile">
        <span className="sp-phone">
          <span className="sp-phone__card" />
          <span className="sp-phone__actions"><span /><span /><span /></span>
          <span className="sp-phone__list"><span /><span /><span /></span>
        </span>
        <figcaption>Mobile application</figcaption>
      </figure>
      <figure className="sp-device sp-device--teller">
        <span className="sp-teller">
          <span className="sp-teller__title" />
          <span className="sp-teller__grid"><span className="is-active" /><span /><span /><span /></span>
        </span>
        <figcaption>Cash teller machine</figcaption>
      </figure>
    </div>
  )
}

export function Tokens() {
  return (
    <div className="sp-tokens">
      {TOKENS.map(([name, values]) => (
        <div key={name} className="sp-token">
          <p className="sp-sub">{name}</p>
          <ul data-kind={name.toLowerCase().replace(' ', '-')}>
            {values.map((v) => (
              <li key={v} style={{ '--v': v }}>
                <span className="sp-token__viz" />
                <span className="sp-token__val">{v}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
      <div className="sp-token">
        <p className="sp-sub">Elevation</p>
        <ul data-kind="elevation">
          {[0, 1, 2].map((v) => (
            <li key={v} data-level={v}><span className="sp-token__viz" /><span className="sp-token__val">{v}</span></li>
          ))}
        </ul>
      </div>
    </div>
  )
}
