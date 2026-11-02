import { site } from '../data/site'
import CopyEmail from './CopyEmail'
import Reveal from './Reveal'
import { ArrowRight } from './icons'

export default function ContactCard() {
  return (
    <Reveal as="section" className="contact-card" aria-labelledby="contact-card-title">
      <h2 id="contact-card-title" className="section-title">Have a project in mind?</h2>
      <p className="contact-card__text">
        I’m always open to meaningful conversations, collaborations, and opportunities.
      </p>
      <div className="btn-row">
        <a className="btn" href={`mailto:${site.email}`}>
          Email me <ArrowRight size={14} />
        </a>
        <CopyEmail />
      </div>
    </Reveal>
  )
}
