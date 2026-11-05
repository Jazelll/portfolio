import { Link } from 'react-router-dom'
import { intro, profileFacts, site } from '../../data/site'
import { ArrowRight } from '../icons'
import { SpecList } from './primitives'

// Pieces of the Introduction frame: the opening statement and the professional facts.

export function OpeningStatement() {
  return (
    <div className="ar-intro__text">
      <p className="ar-intro__who">
        <strong>{site.name}</strong>
        <span>{site.role}</span>
      </p>
      <h1 className="ar-intro__headline" id="region-home-title" tabIndex={-1}>{intro.headline}</h1>
      <p className="ar-intro__lede">{intro.lede}</p>
      <div className="btn-row">
        <Link to="/work" className="btn">View selected work <ArrowRight size={14} /></Link>
        <Link to="/contact" className="btn btn--ghost">Get in touch</Link>
      </div>
    </div>
  )
}

export function ProfileFacts() {
  return <SpecList rows={profileFacts} className="ar-facts" />
}
