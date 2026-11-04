import { Link } from 'react-router-dom'
import { intro, profileFacts, site } from '../../data/site'
import { images } from '../../data/images'
import Img from '../Img'
import { ArrowRight } from '../icons'
import { BrowserFrame, SpecList } from './primitives'

// Pieces of the Introduction frame: the opening statement, a composed preview of two real projects, and
// the professional facts.

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

export function FeaturedWork({ eager }) {
  return (
    <figure className="ar-intro__figure">
      <Link to="/work/fido" className="ar-intro__shot ar-intro__shot--web" aria-label="Fido case study">
        <BrowserFrame label="fido · landing page">
          <Img
            image={images.fido.landing.cover}
            alt="Fido landing page: “Adopt, Don’t Shop” headline above a collage of rescued pets."
            sizes="(min-width: 1024px) 480px, 92vw"
            priority={eager}
          />
        </BrowserFrame>
      </Link>
      <Link to="/work/fixo" className="ar-intro__shot ar-intro__shot--phones" aria-label="Fixo case study">
        <Img
          image={images.fixo.screens}
          alt="Three Fixo phone screens: address picker, splash screen and payment summary."
          sizes="(min-width: 1024px) 300px, 70vw"
          priority={eager}
        />
      </Link>
      <figcaption className="ar-intro__notes">
        <span className="ar-note ar-note--web"><b>001</b> Fido — responsive web, 2023</span>
        <span className="ar-note ar-note--phones"><b>002</b> Fixo — iOS & Android, 2025</span>
      </figcaption>
    </figure>
  )
}

export function ProfileFacts() {
  return <SpecList rows={profileFacts} className="ar-facts" />
}
