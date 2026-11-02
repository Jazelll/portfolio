import { site } from '../data/site'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import CopyEmail from '../components/CopyEmail'
import { ArrowRight, ArrowUpRight, LinkedInIcon, MailIcon } from '../components/icons'

// No form on purpose: there is no submission backend configured, and a form that pretends to send
// would be worse than a direct email link.
export default function Contact() {
  usePageMeta({
    title: 'Contact',
    description: 'Get in touch with UI/UX designer Althea Rito by email or LinkedIn.',
    path: '/contact',
  })

  return (
    <div className="page">
      <Reveal as="header" className="intro">
        <h1 className="page-title">Contact me</h1>
        <p>
          I’m always open to meaningful conversations, collaborations, and opportunities to create better digital
          experiences. <mark>Email is the quickest way</mark> to reach me.
        </p>
        <p className="status"><span className="status__dot" aria-hidden="true" />Open to opportunities</p>
      </Reveal>

      <Reveal as="section" className="contact-panel" aria-label="Contact details">
        <a className="contact-panel__email" href={`mailto:${site.email}`}>{site.email}</a>
        <div className="btn-row">
          <a className="btn" href={`mailto:${site.email}?subject=Hello%20Althea`}>
            Write an email <ArrowRight size={14} />
          </a>
          <CopyEmail />
        </div>
      </Reveal>

      <Reveal as="ul" className="link-list">
        <li>
          <a href={`mailto:${site.email}`} className="link-list__item">
            <MailIcon size={18} />
            <span><strong>Email</strong>{site.email}</span>
          </a>
        </li>
        <li>
          <a href={site.linkedin} target="_blank" rel="noopener noreferrer" className="link-list__item">
            <LinkedInIcon size={18} />
            <span><strong>LinkedIn</strong>linkedin.com/in/althearito</span>
            <ArrowUpRight size={14} className="link-list__ext" />
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </li>
      </Reveal>
    </div>
  )
}
