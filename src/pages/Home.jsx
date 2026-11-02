import { Link } from 'react-router-dom'
import { featuredProjects, projects } from '../data/projects'
import { approach } from '../data/site'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import ProjectList from '../components/ProjectList'
import ContactCard from '../components/ContactCard'
import { ArrowRight } from '../components/icons'

const SYSTEM_TOPICS = [
  'Reusable components',
  'Typography & color foundations',
  'Component states & interaction patterns',
  'Cross-platform consistency',
  'Design documentation',
]

export default function Home() {
  usePageMeta({ path: '/' })

  return (
    <div className="page">
      <Reveal as="header" className="intro">
        <h1 className="page-title">Hi, I’m Althea.</h1>
        <p>
          I’m a UI/UX designer focused on creating <mark>intuitive, accessible, and scalable</mark> digital
          products.
        </p>
        <p>
          I work across <mark>research, interaction design, and visual systems</mark> to turn complex requirements
          into clear user experiences. Currently a UI/UX Designer at <mark>Traxion Tech, Inc.</mark>
        </p>
      </Reveal>

      <section className="section" aria-labelledby="work-title">
        <Reveal as="h2" id="work-title" className="section-title">What I’ve been working on</Reveal>
        <ProjectList projects={featuredProjects} />
        <Reveal>
          <Link to="/work" className="text-link text-link--arrow">
            See all {projects.length} projects <ArrowRight size={14} />
          </Link>
        </Reveal>
      </section>

      <section className="section" aria-labelledby="approach-title">
        <Reveal as="h2" id="approach-title" className="section-title">How I approach design</Reveal>
        <ol className="steps">
          {approach.map((s, i) => (
            <Reveal as="li" key={s.title} className="step" delay={i * 60}>
              <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="step__title">{s.title}</h3>
              <p className="step__desc">{s.description}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="systems-title">
        <Reveal as="h2" id="systems-title" className="section-title">Consistency starts with a system</Reveal>
        <Reveal>
          <p className="body-text">
            I help create scalable interface systems that make digital products more consistent, maintainable, and
            easier to evolve. At Traxion Tech, I initiated and helped establish a design system used across{' '}
            <mark>web applications, mobile applications, and cash teller machine interfaces</mark>.
          </p>
          <ul className="chips chips--loose">
            {SYSTEM_TOPICS.map((t) => <li key={t} className="chip">{t}</li>)}
          </ul>
        </Reveal>
      </section>

      <ContactCard />
    </div>
  )
}
