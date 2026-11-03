import { Link, useParams } from 'react-router-dom'
import { getAdjacent, getProject } from '../data/projects'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import Img from '../components/Img'
import ProjectVisual from '../components/ProjectVisual'
import PageView from '../components/PageView'
import TransitionLink from '../components/TransitionLink'
import { MemoireFeature } from '../components/illustrations/MemoireIllustration'
import { ArrowLeft, ArrowRight } from '../components/icons'
import NotFound from './NotFound'

// Single-column case study. Each block renders only when the project has content for it.

function Block({ title, children }) {
  return (
    <Reveal as="section" className="cs-block">
      <h2 className="section-title">{title}</h2>
      {children}
    </Reveal>
  )
}

function Features({ features }) {
  if (features.some((f) => f.image)) {
    return (
      <div className="cs-shots">
        {features.map((f) => (
          <figure key={f.title} className="cs-shot">
            <div className="cs-shot__img"><Img image={f.image} alt={f.alt} sizes="(min-width: 720px) 1100px, 180vw" /></div>
            <figcaption>
              <h3 className="cs-shot__title">{f.title}</h3>
              <p className="body-text">{f.description}</p>
            </figcaption>
          </figure>
        ))}
      </div>
    )
  }

  return (
    <ul className={`cs-features${features.some((f) => f.illustration) ? ' cs-features--ill' : ''}`}>
      {features.map((f) => (
        <li key={f.title} className="cs-feature">
          {f.illustration && <MemoireFeature name={f.illustration} />}
          <h3 className="cs-feature__title">{f.title}</h3>
          <p className="body-text">{f.description}</p>
        </li>
      ))}
    </ul>
  )
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const project = getProject(slug)

  usePageMeta({
    title: project ? `${project.title} — ${project.subtitle}` : 'Project not found',
    description: project?.summary,
    path: `/work/${slug}`,
  })

  if (!project) return <NotFound />

  const { prev, next } = getAdjacent(slug)
  const meta = [
    ['Role', project.role.join(', ')],
    ['Platform', project.platform],
    ['Industry', project.industry],
    ['Year', project.year],
    ['Duration', project.duration],
    ['Team', project.team.join(', ')],
  ].filter(([, v]) => v)

  return (
    <article className="page">
      <Reveal as="header" className="intro">
        <TransitionLink to="/work" state={{ restore: true }} className="text-link text-link--back">
          <ArrowLeft size={14} /> Back to work
        </TransitionLink>
        <h1 className="page-title">{project.title}</h1>
        <p>{project.subtitle}</p>
        <ul className="chips">
          <li className="chip">{project.category}</li>
          <li className="chip">{project.year}</li>
        </ul>
      </Reveal>

      {/* Not wrapped in Reveal: the hero is the shared element arriving from a canvas card. */}
      <div className="cs-hero">
        <ProjectVisual project={project} priority sizes="(min-width: 1024px) 760px, 100vw" />
      </div>
      {project.illustrative && (
        <p className="note">
          {project.confidential
            ? 'Professional client work. To protect client confidentiality, no real screens, names, or data are shown; visuals here are abstracted illustrations.'
            : 'Final screens for this ongoing project are not yet public. Visuals here are illustrative concepts, not production screenshots.'}
        </p>
      )}

      <Reveal>
        <dl className="meta-grid">
          {meta.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Block title="Overview">
        <p className="body-text">{project.overview}</p>
      </Block>

      {project.problem && (
        <Block title="The problem">
          <p className="body-text">{project.problem}</p>
        </Block>
      )}

      {project.solution && (
        <Block title="The response">
          <p className="body-text">{project.solution}</p>
        </Block>
      )}

      {project.goals && (
        <Block title="Design goals">
          <ol className="goal-list">
            {project.goals.map((g) => <li key={g}>{g}</li>)}
          </ol>
        </Block>
      )}

      {project.process && (
        <Block title={`Process · ${project.process.method}`}>
          <ol className="steps steps--stack">
            {project.process.steps.map((s, i) => (
              <li key={s.title} className="step">
                <span className="step__num">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="step__title">{s.title}</h3>
                <p className="step__desc">{s.description}</p>
              </li>
            ))}
          </ol>
        </Block>
      )}

      {project.features && (
        <Block title={project.features.some((f) => f.image) ? 'Final design' : 'Key features'}>
          <Features features={project.features} />
        </Block>
      )}

      {project.gallery && (
        <Block title="Final design">
          {project.gallery.map((g) => (
            <PageView key={g.caption} image={g.image} alt={g.alt} caption={g.caption} label={`${project.title.toLowerCase().replace(/\s+/g, '')} · homepage`} />
          ))}
        </Block>
      )}

      {project.reflection && (
        <Block title="My contribution">
          <p className="body-text">{project.reflection}</p>
        </Block>
      )}

      <nav className="pager" aria-label="More projects">
        <Link to={`/work/${prev.slug}`} className="pager__link">
          <span className="pager__label"><ArrowLeft size={14} /> Previous</span>
          <span className="pager__title">{prev.title}</span>
        </Link>
        <Link to={`/work/${next.slug}`} className="pager__link pager__link--next">
          <span className="pager__label">Next <ArrowRight size={14} /></span>
          <span className="pager__title">{next.title}</span>
        </Link>
      </nav>
    </article>
  )
}
