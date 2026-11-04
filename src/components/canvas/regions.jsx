import { Link } from 'react-router-dom'
import { getProject } from '../../data/projects'
import { approach, education, experience, site, skills } from '../../data/site'
import { FRAMES, NOTE } from '../../data/canvas'
import CopyEmail from '../CopyEmail'
import ProjectCard from './ProjectCard'
import { ArrowRight, ArrowUpRight, LinkedInIcon, MailIcon } from '../icons'

// The content of each canvas region. Copy is carried over unchanged from the former Home, Work, About
// and Contact pages. Each region's main heading carries id `region-<id>-title` and tabIndex -1, so
// SiteCanvas can label the region and move focus to it on navigation.

const SYSTEM_TOPICS = [
  'Reusable components',
  'Typography & color foundations',
  'Component states & interaction patterns',
  'Cross-platform consistency',
  'Design documentation',
]

export function HomeRegion() {
  return (
    <>
      <header className="intro" data-layer="home-intro">
        <h1 className="page-title" id="region-home-title" tabIndex={-1}>Hi, I’m Althea.</h1>
        <p>
          I’m a UI/UX designer focused on creating <mark>intuitive, accessible, and scalable</mark> digital
          products.
        </p>
        <p>
          I work across <mark>research, interaction design, and visual systems</mark> to turn complex requirements
          into clear user experiences. Currently a UI/UX Designer at <mark>Traxion Tech, Inc.</mark>
        </p>
        <div className="btn-row">
          <Link to="/work" className="btn">See my work <ArrowRight size={14} /></Link>
          <Link to="/contact" className="btn btn--ghost">Get in touch</Link>
        </div>
      </header>

      <section className="section" aria-labelledby="approach-title" data-layer="home-approach">
        <h2 id="approach-title" className="section-title">How I approach design</h2>
        <ol className="steps">
          {approach.map((s, i) => (
            <li key={s.title} className="step">
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__desc">{s.description}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="systems-title" data-layer="home-system">
        <h2 id="systems-title" className="section-title">Consistency starts with a system</h2>
        <p className="body-text">
          I help create scalable interface systems that make digital products more consistent, maintainable, and
          easier to evolve. At Traxion Tech, I initiated and helped establish a design system used across{' '}
          <mark>web applications, mobile applications, and cash teller machine interfaces</mark>.
        </p>
        <ul className="chips chips--loose">
          {SYSTEM_TOPICS.map((t) => <li key={t} className="chip">{t}</li>)}
        </ul>
      </section>
    </>
  )
}

let cardIndex = 0
const frames = FRAMES.map((f) => ({
  ...f,
  cards: f.cards.map((c) => ({ ...c, project: getProject(c.slug), index: cardIndex++ })),
}))

export function WorkRegion({ canvas, editor, selected, onOpen }) {
  return (
    <>
      <header className="intro ws-work__intro">
        <h2 className="page-title" id="region-work-title" tabIndex={-1}>Selected work</h2>
        <p>
          Digital products, mobile apps, and web experiences across <mark>animal welfare, service marketplaces,
          social platforms, fintech, and events</mark>.
        </p>
      </header>

      {frames.map((f) => (
        <section
          key={f.id}
          className="ws-frame"
          data-layer={`frame-${f.id}`}
          aria-labelledby={`ws-frame-${f.id}`}
          style={{ '--x': `${f.x}px`, '--y': `${f.y}px`, '--w': `${f.width}px`, '--h': `${f.height}px` }}
        >
          <h3 className="ws-frame__label" id={`ws-frame-${f.id}`}>
            {f.label}
            <span className="ws-frame__count">{String(f.cards.length).padStart(2, '0')}</span>
          </h3>
          <ul className="ws-frame__cards">
            {f.cards.map(({ project, index, ...layout }) => (
              <ProjectCard
                key={project.slug}
                project={project}
                {...layout}
                index={index}
                canvas={canvas}
                selectFirst={editor && selected !== `project-${project.slug}`}
                onOpen={onOpen}
              />
            ))}
          </ul>
        </section>
      ))}

      {canvas && (
        <aside className="ws-note" style={{ '--x': `${NOTE.x}px`, '--y': `${NOTE.y}px`, '--w': `${NOTE.width}px` }}>
          <p className="ws-note__label">Reading the board</p>
          <p>Case studies for products sit on the left; landing pages and web work on the right. Select any project to open it.</p>
        </aside>
      )}
    </>
  )
}

export function AboutRegion() {
  return (
    <div className="ws-about">
      <div className="ws-about__main">
        <header className="intro" data-layer="about-intro">
          <h2 className="page-title" id="region-about-title" tabIndex={-1}>About me</h2>
          <p>
            I’m a UI/UX designer who enjoys turning ideas and complex requirements into <mark>clear, useful digital
            experiences</mark>.
          </p>
          <p>
            My work spans different industries and product types, from financial applications to service platforms and
            community-focused experiences. I value <mark>thoughtful structure, consistent design systems</mark>, and
            interfaces that make everyday interactions easier.
          </p>
          <p>
            Most of my work happens alongside developers, business analysts, and stakeholders in Agile teams, where good
            design means decisions that hold up in implementation.
          </p>
          <Link to="/work" className="text-link text-link--arrow">See my work <ArrowRight size={14} /></Link>
        </header>

        <section className="section" aria-labelledby="skills-title" data-layer="about-skills">
          <h3 id="skills-title" className="section-title">Skills & capabilities</h3>
          <div className="skill-groups">
            {skills.map((s) => (
              <div key={s.group} className="skill-group">
                <h4 className="skill-group__title">{s.group}</h4>
                <ul className="chips chips--loose">
                  {s.items.map((item) => <li key={item} className="chip">{item}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="section" aria-labelledby="edu-title" data-layer="about-education">
          <h3 id="edu-title" className="section-title">Education</h3>
          <div className="edu">
            <p className="edu__degree">{education.degree}</p>
            <p className="edu__school">{education.school}</p>
          </div>
        </section>
      </div>

      <section className="ws-about__side" aria-labelledby="exp-title" data-layer="about-experience">
        <h3 id="exp-title" className="section-title">Experience</h3>
        <ol className="timeline">
          {experience.map((job) => (
            <li key={job.company + job.role} className="timeline__item">
              <p className="timeline__period">{job.period}</p>
              <h4 className="timeline__role">{job.role}</h4>
              <p className="timeline__company">{job.company}</p>
              <ul className="timeline__points">
                {job.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </li>
          ))}
        </ol>
      </section>
    </div>
  )
}

// No form on purpose: there is no submission backend configured, and a form that pretends to send
// would be worse than a direct email link.
export function ContactRegion() {
  return (
    <>
      <header className="intro" data-layer="contact-intro">
        <h2 className="page-title" id="region-contact-title" tabIndex={-1}>Contact me</h2>
        <p>
          I’m always open to meaningful conversations, collaborations, and opportunities to create better digital
          experiences. <mark>Email is the quickest way</mark> to reach me.
        </p>
        <p className="status"><span className="status__dot" aria-hidden="true" />Open to opportunities</p>
      </header>

      <section className="contact-panel" aria-label="Contact details" data-layer="contact-details">
        <a className="contact-panel__email" href={`mailto:${site.email}`}>{site.email}</a>
        <div className="btn-row">
          <a className="btn" href={`mailto:${site.email}?subject=Hello%20Althea`}>
            Write an email <ArrowRight size={14} />
          </a>
          <CopyEmail />
        </div>
      </section>

      <ul className="link-list" data-layer="contact-links">
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
      </ul>
    </>
  )
}
