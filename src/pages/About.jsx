import { Link } from 'react-router-dom'
import { education, experience, skills } from '../data/site'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import ContactCard from '../components/ContactCard'
import { ArrowRight } from '../components/icons'

export default function About() {
  usePageMeta({
    title: 'About',
    description: 'Background, experience, skills, and education of UI/UX designer Althea Rito.',
    path: '/about',
  })

  return (
    <div className="page">
      <Reveal as="header" className="intro">
        <h1 className="page-title">About me</h1>
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
      </Reveal>

      <section className="section" aria-labelledby="exp-title">
        <Reveal as="h2" id="exp-title" className="section-title">Experience</Reveal>
        <ol className="timeline">
          {experience.map((job) => (
            <Reveal as="li" key={job.company + job.role} className="timeline__item">
              <p className="timeline__period">{job.period}</p>
              <h3 className="timeline__role">{job.role}</h3>
              <p className="timeline__company">{job.company}</p>
              <ul className="timeline__points">
                {job.points.map((pt) => <li key={pt}>{pt}</li>)}
              </ul>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section" aria-labelledby="skills-title">
        <Reveal as="h2" id="skills-title" className="section-title">Skills & capabilities</Reveal>
        <div className="skill-groups">
          {skills.map((s) => (
            <Reveal key={s.group} className="skill-group">
              <h3 className="skill-group__title">{s.group}</h3>
              <ul className="chips chips--loose">
                {s.items.map((item) => <li key={item} className="chip">{item}</li>)}
              </ul>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="section" aria-labelledby="edu-title">
        <Reveal as="h2" id="edu-title" className="section-title">Education</Reveal>
        <Reveal className="edu">
          <p className="edu__degree">{education.degree}</p>
          <p className="edu__school">{education.school}</p>
        </Reveal>
      </section>

      <ContactCard />
    </div>
  )
}
