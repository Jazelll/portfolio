import { areasOfWork, capabilities, education, experience, site } from '../../data/site'
import { SpecList } from './primitives'

// Pieces of the About, Skills and Education frames. Copy and history are carried over unchanged from the
// earlier About page; nothing is added beyond the confirmed location.

export function AboutIntro() {
  return (
    <div className="ar-about__intro">
      <p className="ar-about__lead">
        I’m a UI/UX designer who enjoys turning ideas and complex requirements into clear, useful digital experiences.
      </p>
      <p>
        My work spans different industries and product types, from financial applications to service platforms and
        community-focused experiences. I value thoughtful structure, consistent design systems, and interfaces that
        make everyday interactions easier.
      </p>
      <p>
        Most of my work happens alongside developers, business analysts, and stakeholders in Agile teams, where good
        design means decisions that hold up in implementation.
      </p>
      <SpecList
        className="ar-about__facts"
        rows={[
          ['Location', site.location],
          ['Currently', `${experience[0].role}, ${experience[0].company}`],
          ['Areas of work', areasOfWork.join(' · ')],
        ]}
      />
    </div>
  )
}

export function ExperienceTimeline() {
  return (
    <ol className="ar-timeline">
      {experience.map((job) => (
        <li key={job.company + job.role} className="ar-timeline__item">
          <p className="ar-timeline__period meta-label">{job.period}</p>
          <div className="ar-timeline__body">
            <h4 className="ar-timeline__role">{job.role}</h4>
            <p className="ar-timeline__company">{job.company}</p>
            <ul className="ar-timeline__points">
              {job.points.map((pt) => <li key={pt}>{pt}</li>)}
            </ul>
          </div>
        </li>
      ))}
    </ol>
  )
}

// Specification sheet of capabilities; no proficiency levels are claimed.
export function CapabilitySheet() {
  return (
    <div className="ar-caps">
      {capabilities.map((c, i) => (
        <div key={c.group} className="ar-cap" data-layer={`skills-${i + 1}`}>
          <p className="ar-cap__num meta-label">{String(i + 1).padStart(2, '0')}</p>
          <h3 className="ar-cap__group">{c.group}</h3>
          <ul className="ar-cap__items">
            {c.items.map((item) => <li key={item}>{item}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

export function Credential() {
  return (
    <div className="ar-credential">
      <p className="ar-credential__bar meta-label">
        <span>Credential / 001</span>
        <span>Degree</span>
      </p>
      <p className="ar-credential__degree">{education.degree}</p>
      <p className="ar-credential__school">{education.school}</p>
    </div>
  )
}
