import { useState } from 'react'
import { approach } from '../../data/site'
import { getProject, projects } from '../../data/projects'
import { FRAMES, FRAMES_HEIGHT, NOTE } from '../../data/canvas'
import { CATALOGUE_FILTERS } from '../../data/archive'
import ProjectCard from './ProjectCard'
import { ARTIFACTS } from '../sections/Approach'
import { ComponentLibrary, Contribution, Foundations, InteractionStates, Platforms, Tokens } from '../sections/SystemSheet'
import { AboutIntro, CapabilitySheet, Credential, ExperienceTimeline } from '../sections/Profile'
import { OpeningStatement, ProfileFacts } from '../sections/Intro'
import { ContactDetails, ContactInvitation } from '../sections/Contact'
import { Frame, IllustrativeNote } from '../sections/primitives'

// The contents of each section frame on the canvas. Each section sits on the board as a frame of its own
// and holds named frames for its parts, as in a design tool. Every section's main heading carries
// id `region-<id>-title` and tabIndex -1 so SiteCanvas can label the frame and move focus to it.

function Heading({ id, title, children }) {
  return (
    <header className="rg-head">
      <h2 className="rg-head__title" id={`region-${id}-title`} tabIndex={-1}>{title}</h2>
      {children && <div className="rg-head__intro">{children}</div>}
    </header>
  )
}

export function HomeRegion() {
  return (
    <div className="rg-home">
      <div className="rg-home__statement" data-layer="home-intro"><OpeningStatement /></div>
      <Frame layer="home-facts" name="Profile facts" className="rg-home__facts"><ProfileFacts /></Frame>
    </div>
  )
}

export function ApproachRegion() {
  const layers = ['understand', 'structure', 'design', 'refine']
  return (
    <>
      <Heading id="approach" title="How I approach design" />
      <ol className="rg-process">
        {approach.map((s, i) => (
          <li key={s.title}>
            <Frame layer={`approach-${layers[i]}`} name={`${String(i + 1).padStart(2, '0')} ${s.title}`} className="rg-step">
              <h3 className="ar-process__title">{s.title}</h3>
              <p className="ar-process__desc">{s.description}</p>
              <figure className="ar-process__artifact">
                <div aria-hidden="true">{ARTIFACTS[i].el}</div>
                <figcaption className="meta-label">{ARTIFACTS[i].caption}</figcaption>
              </figure>
            </Frame>
          </li>
        ))}
      </ol>
      <IllustrativeNote>Artifacts are illustrative drawings of each stage’s output, not research from a specific project.</IllustrativeNote>
    </>
  )
}

export function SystemRegion() {
  return (
    <>
      <Heading id="system" title="Consistency starts with a system">
        <p>
          I help create scalable interface systems that make digital products more consistent, maintainable, and easier
          to evolve. At Traxion Tech, I initiated and helped establish a design system used across web applications,
          mobile applications, and cash teller machine interfaces.
        </p>
      </Heading>
      <Frame layer="system-contribution" name="My contribution" className="rg-system__contrib"><Contribution /></Frame>
      <div className="rg-system__grid">
        <Frame layer="system-foundations" name="A · Foundations" className="specimen rg-system__found"><Foundations /></Frame>
        <Frame layer="system-library" name="B · Component library" className="specimen rg-system__lib"><ComponentLibrary /></Frame>
        <Frame layer="system-platforms" name="D · Cross-platform applications" className="specimen rg-system__plat"><Platforms /></Frame>
        <Frame layer="system-states" name="C · Interaction states" className="specimen rg-system__states"><InteractionStates /></Frame>
        <Frame layer="system-tokens" name="E · Design tokens" className="specimen rg-system__tokens"><Tokens /></Frame>
      </div>
      <IllustrativeNote>Specimen built for this portfolio to show the structure of the work. The production system is client work and stays private.</IllustrativeNote>
    </>
  )
}

let cardIndex = 0
const frames = FRAMES.map((f) => ({
  ...f,
  cards: f.cards.map((c) => ({ ...c, project: getProject(c.slug), index: cardIndex++ })),
}))
const years = projects.flatMap((p) => p.year.match(/\d{4}/g) ?? []).map(Number)
const span = `${Math.min(...years)} — ${projects.some((p) => /present/i.test(p.year)) ? 'Present' : Math.max(...years)}`

// Filters fade what doesn't match so the arrangement stays put on the board (on phones they hide it).
export function WorkRegion({ canvas, editor, selected, onOpen }) {
  const [filterId, setFilterId] = useState('all')
  const filter = CATALOGUE_FILTERS.find((f) => f.id === filterId)
  const count = projects.filter(filter.test).length

  return (
    <>
      <header className="rg-head rg-work__head">
        <h2 className="rg-head__title" id="region-work-title" tabIndex={-1}>An archive of digital products, interfaces, and experiences.</h2>
        <div className="rg-head__intro">
          <p>Exploring product design across mobile applications, responsive websites, fintech platforms, and digital experiences.</p>
        </div>
        <div className="rg-work__index" data-pan-ignore>
          <p className="rg-work__tally">
            <span><b>{String(projects.length).padStart(2, '0')}</b> projects</span>
            <span><b>{span}</b></span>
          </p>
          <div className="ar-filters" role="group" aria-label="Filter projects by type">
            {CATALOGUE_FILTERS.map((f) => (
              <button key={f.id} type="button" className="ar-filter" aria-pressed={filterId === f.id} onClick={() => setFilterId(f.id)}>
                {f.label}
                <span className="ar-filter__count">{projects.filter(f.test).length}</span>
              </button>
            ))}
          </div>
          <p className="visually-hidden" aria-live="polite">
            {filterId === 'all' ? `Showing all ${count} projects` : `${count} ${count === 1 ? 'project' : 'projects'} in ${filter.label}`}
          </p>
        </div>
      </header>

      <div className="rg-work__board" style={{ '--h': `${FRAMES_HEIGHT}px` }}>
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
                  dimmed={!filter.test(project)}
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
            <p>Case studies for products sit on the left; landing pages and web work on the right. Select a project, then select it again (or double-click) to open it.</p>
          </aside>
        )}
      </div>
    </>
  )
}

export function AboutRegion() {
  return (
    <>
      <Heading id="about" title="About me" />
      <div className="rg-about">
        <Frame layer="about-intro" name="About me" className="rg-about__intro"><AboutIntro /></Frame>
        <Frame layer="about-experience" name="Experience" className="rg-about__exp"><ExperienceTimeline /></Frame>
      </div>
    </>
  )
}

export function SkillsRegion() {
  return (
    <>
      <Heading id="skills" title="Skills & capabilities" />
      <Frame layer="skills-sheet" name="Specification sheet"><CapabilitySheet /></Frame>
    </>
  )
}

export function EducationRegion() {
  return (
    <>
      <Heading id="education" title="Education" />
      <Frame layer="education-credential" name="Credential"><Credential /></Frame>
    </>
  )
}

export function ContactRegion() {
  return (
    <div className="rg-contact">
      <div data-layer="contact-invitation"><ContactInvitation /></div>
      <Frame layer="contact-details" name="Details"><ContactDetails /></Frame>
    </div>
  )
}
