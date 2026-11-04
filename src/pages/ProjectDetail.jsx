import { Link, useParams } from 'react-router-dom'
import { getAdjacent, getProject } from '../data/projects'
import { catalogueNumber } from '../data/archive'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import Img from '../components/Img'
import ProjectVisual from '../components/ProjectVisual'
import PageView from '../components/PageView'
import TransitionLink from '../components/TransitionLink'
import { BrowserFrame, SpecList } from '../components/sections/primitives'
import { MemoireFeature } from '../components/illustrations/MemoireIllustration'
import { ArrowLeft, ArrowRight } from '../components/icons'
import NotFound from './NotFound'

// Case study as a numbered chapter sheet: chapter label in the left columns, content from column 4.
// Chapters render only when the project has real content for them; nothing is filled in.

function Chapter({ id, number, title, children }) {
  return (
    <Reveal as="section" className="cs-chapter" aria-labelledby={`cs-${id}`}>
      <h2 className="cs-chapter__label" id={`cs-${id}`}>
        <span className="meta-label">{number}</span>
        {title}
      </h2>
      <div className="cs-chapter__body">{children}</div>
    </Reveal>
  )
}

function FinalDesign({ project }) {
  const { features, gallery } = project
  return (
    <>
      {features?.some((f) => f.image) && (
        <div className="cs-shots">
          {features.map((f, i) => (
            <figure key={f.title} className="cs-shot">
              <div className="cs-shot__img">
                <Img image={f.image} alt={f.alt} sizes="(min-width: 1024px) 640px, 100vw" />
              </div>
              <figcaption className="cs-shot__caption">
                <span className="meta-label">Screen {String(i + 1).padStart(2, '0')}</span>
                <h3 className="cs-shot__title">{f.title}</h3>
                <p>{f.description}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {features?.some((f) => f.illustration) && (
        <ul className="cs-ill-features">
          {features.map((f) => (
            <li key={f.title}>
              <MemoireFeature name={f.illustration} />
              <h3 className="cs-feature__title">{f.title}</h3>
              <p>{f.description}</p>
            </li>
          ))}
        </ul>
      )}

      {features && !features.some((f) => f.image || f.illustration) && (
        <ol className="cs-feature-list">
          {features.map((f, i) => (
            <li key={f.title}>
              <span className="meta-label">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="cs-feature__title">{f.title}</h3>
              <p>{f.description}</p>
            </li>
          ))}
        </ol>
      )}

      {gallery?.map((g) => (
        <PageView
          key={g.caption}
          image={g.image}
          alt={g.alt}
          caption={g.caption}
          label={`${project.title.toLowerCase().replace(/\s+/g, '')} · homepage`}
        />
      ))}
    </>
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
  const hasFinal = project.features || project.gallery
  const isPage = Boolean(project.gallery)

  const chapters = [
    { id: 'overview', title: 'Overview', content: <p className="cs-lead">{project.overview}</p> },
    {
      id: 'context',
      title: 'Context',
      content: (project.problem || project.goals) && (
        <>
          {project.problem && <p className="cs-text">{project.problem}</p>}
          {project.goals && (
            <div className="cs-goals">
              <p className="meta-label">Design goals</p>
              <ol>
                {project.goals.map((g, i) => (
                  <li key={g}><span className="meta-label">{String(i + 1).padStart(2, '0')}</span>{g}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      ),
    },
    {
      id: 'process',
      title: project.process ? `Process — ${project.process.method}` : 'Process',
      content: project.process && (
        <ol className="cs-process">
          {project.process.steps.map((s, i) => (
            <li key={s.title}>
              <span className="meta-label">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="cs-process__title">{s.title}</h3>
              <p>{s.description}</p>
            </li>
          ))}
        </ol>
      ),
    },
    { id: 'direction', title: 'Design direction', content: project.solution && <p className="cs-text">{project.solution}</p> },
    {
      id: 'final',
      title: project.features?.some((f) => f.image) || project.gallery ? 'Final design' : 'Key features',
      content: hasFinal && <FinalDesign project={project} />,
    },
    { id: 'reflection', title: 'My contribution', content: project.reflection && <p className="cs-text">{project.reflection}</p> },
  ].filter((c) => c.content)

  return (
    <article className="cs">
      <header className="cs-head">
        <TransitionLink to="/work" state={{ restore: true }} className="text-link text-link--back">
          <ArrowLeft size={14} /> Back to selected work
        </TransitionLink>
        <p className="meta-label cs-head__kicker">{project.category} / {catalogueNumber(project)}</p>
        <h1 className="cs-head__title">{project.title}</h1>
        <p className="cs-head__sub">{project.subtitle}</p>
      </header>

      {/* Not wrapped in Reveal: the hero is the shared element arriving from the catalogue. */}
      <div className={`cs-hero${isPage ? ' cs-hero--page' : ''}`}>
        {isPage ? (
          <BrowserFrame label={`${project.title.toLowerCase()} · landing page`}>
            <ProjectVisual project={project} priority sizes="(min-width: 1200px) 1200px, 100vw" />
          </BrowserFrame>
        ) : (
          <ProjectVisual project={project} priority sizes="(min-width: 1200px) 1200px, 100vw" />
        )}
      </div>
      {project.illustrative && (
        <p className="ar-illustrative meta-label">
          {project.confidential
            ? 'Professional client work. To protect client confidentiality, no real screens, names, or data are shown; visuals are abstracted illustrations.'
            : 'Final screens for this ongoing project are not yet public. Visuals are illustrative concepts, not production screenshots.'}
        </p>
      )}

      <SpecList
        className="cs-spec"
        rows={[
          ['Role', project.role.join(', ')],
          ['Platform', project.platform],
          ['Industry', project.industry],
          ['Year', project.year],
          ['Duration', project.duration],
          ['Team', project.team.join(', ')],
        ]}
      />

      {chapters.map((c, i) => (
        <Chapter key={c.id} id={c.id} number={String(i + 1).padStart(2, '0')} title={c.title}>
          {c.content}
        </Chapter>
      ))}

      <nav className="cs-pager" aria-label="More projects">
        <Link to={`/work/${prev.slug}`} className="cs-pager__link">
          <span className="meta-label"><ArrowLeft size={12} /> Previous · {catalogueNumber(prev)}</span>
          <span className="cs-pager__title">{prev.title}</span>
        </Link>
        <Link to={`/work/${next.slug}`} className="cs-pager__link cs-pager__link--next">
          <span className="meta-label">Next · {catalogueNumber(next)} <ArrowRight size={12} /></span>
          <span className="cs-pager__title">{next.title}</span>
        </Link>
      </nav>
    </article>
  )
}
