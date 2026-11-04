import { useId } from 'react'
import ProjectVisual from '../ProjectVisual'
import TransitionLink from '../TransitionLink'

// One project on the canvas. Position and size come in as CSS variables so the same markup
// can sit on the canvas (desktop/tablet) or flow as a list (mobile).
// In the desktop editor a click first selects the card (`selectFirst`); a second click, a double-click,
// or Enter opens it.
export default function ProjectCard({ project, variant, x, y, width, index, canvas, selectFirst, onOpen }) {
  const id = useId()
  const sizes = canvas ? `${width}px` : '(min-width: 560px) 50vw, 100vw'

  return (
    <li
      className={`ws-card ws-card--${variant}`}
      data-ws-item
      data-slug={project.slug}
      data-layer={`project-${project.slug}`}
      style={{ '--x': `${x}px`, '--y': `${y}px`, '--w': `${width}px`, '--i': index }}
    >
      <TransitionLink
        to={`/work/${project.slug}`}
        className="ws-card__link"
        draggable={false}
        aria-labelledby={`${id}-title`}
        aria-describedby={`${id}-meta ${id}-peek`}
        onBeforeTransition={() => onOpen(project.slug)}
        onClick={(e) => {
          // e.detail is 0 for keyboard activation, which should always open.
          if (selectFirst && e.detail !== 0) e.preventDefault()
        }}
      >
        <div className="ws-card__media" data-media>
          {variant === 'browser' && (
            <span className="ws-card__chrome" aria-hidden="true">
              <span /><span /><span />
            </span>
          )}
          <ProjectVisual project={project} sizes={sizes} eager={canvas} />
        </div>

        <div className="ws-card__caption">
          <span className="ws-card__num" aria-hidden="true">{project.number}</span>
          <span className="ws-card__title" id={`${id}-title`}>{project.title}</span>
          <span className="ws-card__meta" id={`${id}-meta`}>
            {project.category} · {project.year}
          </span>
        </div>

        <div className="ws-card__peek" id={`${id}-peek`}>
          <p className="ws-card__summary">{project.summary}</p>
          <p className="ws-card__role">
            <span className="ws-card__role-label">Role</span> {project.role.join(', ')}
          </p>
          <span className="ws-card__open" aria-hidden="true">Open case study →</span>
        </div>
      </TransitionLink>
    </li>
  )
}
