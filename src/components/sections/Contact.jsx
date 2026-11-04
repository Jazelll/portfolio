import { site } from '../../data/site'
import CopyEmail from '../CopyEmail'
import { ArrowRight, ArrowUpRight } from '../icons'

// Pieces of the Contact frame: one invitation with the email set large, then the other ways to reach out.
// No form on purpose: there is no submission backend, and a form that pretends to send would be worse
// than a direct email link.

export function ContactInvitation() {
  return (
    <div className="ar-contact">
      <p className="ar-contact__kicker">Have a project in mind?</p>
      <h2 className="ar-contact__title" id="region-contact-title" tabIndex={-1}>Let’s create something thoughtful.</h2>
      <a className="ar-contact__email" href={`mailto:${site.email}`}>
        {site.email}
        <ArrowUpRight size={28} className="ar-contact__email-arrow" />
      </a>
      <div className="btn-row">
        <a className="btn" href={`mailto:${site.email}?subject=Hello%20Althea`}>Write an email <ArrowRight size={14} /></a>
        <CopyEmail />
      </div>
    </div>
  )
}

export function ContactDetails() {
  return (
    <dl className="ar-contact__details">
      <div>
        <dt className="meta-label">LinkedIn</dt>
        <dd>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="ar-link">
            linkedin.com/in/althearito ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </dd>
      </div>
      <div>
        <dt className="meta-label">GitHub</dt>
        <dd>
          <a href={site.github} target="_blank" rel="noopener noreferrer" className="ar-link">
            github.com/althearito ↗<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </dd>
      </div>
      <div>
        <dt className="meta-label">Location</dt>
        <dd>{site.location}</dd>
      </div>
      <div>
        <dt className="meta-label">Availability</dt>
        <dd><span className="status__dot" aria-hidden="true" /> Open to opportunities</dd>
      </div>
    </dl>
  )
}
