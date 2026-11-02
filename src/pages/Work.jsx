import { useSearchParams } from 'react-router-dom'
import { FILTERS, projects } from '../data/projects'
import usePageMeta from '../components/usePageMeta'
import Reveal from '../components/Reveal'
import ProjectList from '../components/ProjectList'
import ContactCard from '../components/ContactCard'

export default function Work() {
  usePageMeta({
    title: 'Work',
    description: 'Product design, mobile, web, and landing page projects by UI/UX designer Althea Rito.',
    path: '/work',
  })

  const [params, setParams] = useSearchParams()
  const requested = params.get('filter')
  const active = FILTERS.some((f) => f.id === requested) ? requested : 'all'
  const matches = (p, id) => id === 'all' || p.filters.includes(id)
  const visible = projects.filter((p) => matches(p, active))

  const choose = (id) => {
    const next = new URLSearchParams(params)
    if (id === 'all') next.delete('filter')
    else next.set('filter', id)
    setParams(next, { replace: true, preventScrollReset: true })
  }

  return (
    <div className="page">
      <Reveal as="header" className="intro">
        <h1 className="page-title">Selected work</h1>
        <p>
          Digital products, mobile apps, and web experiences across <mark>animal welfare, service marketplaces,
          social platforms, fintech, and events</mark>.
        </p>
      </Reveal>

      <div className="filters" role="group" aria-label="Filter projects by type">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            className="filter"
            aria-pressed={active === f.id}
            onClick={() => choose(f.id)}
          >
            {f.label}
            <span className="filter__count">{projects.filter((p) => matches(p, f.id)).length}</span>
          </button>
        ))}
      </div>
      <p className="visually-hidden" aria-live="polite">
        Showing {visible.length} {visible.length === 1 ? 'project' : 'projects'}
      </p>

      <section className="section section--tight" aria-label="Projects">
        <ProjectList projects={visible} />
      </section>

      <ContactCard />
    </div>
  )
}
