import { IllustrativeTag, Lines } from './parts'

// Abstracted, client-free representation of a multi-surface banking product.
// No real names, figures, account numbers or screens: amounts are deliberately skeletal.
export function FinanceCover() {
  return (
    <figure className="ill ill--finance" role="img" aria-label="Abstract illustration of one interface system across three surfaces: a web dashboard, a mobile app, and a teller-machine screen. Contains no client screens or data.">
      <div className="fin-web ill-app">
        <div className="fin-web__side" aria-hidden="true">
          <span className="fin-dot" />
          <Lines widths={[70, 54, 62, 48]} />
        </div>
        <div className="fin-web__main" aria-hidden="true">
          <span className="fin-label">Overview</span>
          <div className="fin-cards">
            <span className="fin-card"><span className="fin-label">Account A</span><span className="fin-amount" /></span>
            <span className="fin-card"><span className="fin-label">Account B</span><span className="fin-amount fin-amount--short" /></span>
          </div>
          <div className="fin-chart">
            {[40, 62, 48, 78, 56, 70, 88].map((h, i) => (
              <span key={i} style={{ height: `${h}%` }} className={i === 6 ? 'is-active' : ''} />
            ))}
          </div>
          <ul className="fin-list">
            {['Transfer', 'Deposit', 'Bill payment'].map((t) => (
              <li key={t}><span className="fin-icon" /><span>{t}</span><span className="fin-amount fin-amount--line" /></li>
            ))}
          </ul>
        </div>
      </div>

      <div className="fin-phone" aria-hidden="true">
        <span className="fin-label">Balance</span>
        <span className="fin-amount" />
        <span className="fin-phone__actions"><span>Send</span><span>Pay</span><span>Load</span></span>
        <Lines widths={[90, 70, 80]} />
      </div>

      <div className="fin-teller" aria-hidden="true">
        <span className="fin-teller__title">Select a transaction</span>
        <span className="fin-teller__grid">
          <span>Withdraw</span><span>Deposit</span><span>Balance</span><span>Transfer</span>
        </span>
      </div>

      <IllustrativeTag>Abstracted illustration · no client screens or data</IllustrativeTag>
    </figure>
  )
}
