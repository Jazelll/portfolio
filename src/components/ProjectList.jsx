import { Link } from 'react-router-dom'
import ProjectVisual from './ProjectVisual'
import Reveal from './Reveal'

// Thumbnail-left project rows with tag chips.
export default function ProjectList({ projects }) {
  return (
    <ul className="project-list">
      {projects.map((p, i) => (
        <Reveal as="li" key={p.slug} delay={Math.min(i, 4) * 60}>
          <Link to={`/work/${p.slug}`} className="project-row">
            <ProjectVisual project={p} className="project-row__thumb" sizes="(min-width: 720px) 220px, 100vw" />
            <span className="project-row__body">
              <span className="project-row__title">{p.title}</span>
              <span className="project-row__summary">{p.summary}</span>
              <span className="chips">
                <span className="chip">{p.industry}</span>
                <span className="chip">{p.platform}</span>
                <span className="chip">{p.year}</span>
              </span>
            </span>
          </Link>
        </Reveal>
      ))}
    </ul>
  )
}
