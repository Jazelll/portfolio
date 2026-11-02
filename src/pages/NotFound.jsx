import { Link } from 'react-router-dom'
import usePageMeta from '../components/usePageMeta'
import { ArrowRight } from '../components/icons'

export default function NotFound() {
  usePageMeta({ title: 'Page not found' })

  return (
    <div className="page">
      <header className="intro">
        <h1 className="page-title">Page not found</h1>
        <p>The page you’re looking for doesn’t exist or has moved.</p>
        <div className="btn-row">
          <Link to="/" className="btn">Back home <ArrowRight size={14} /></Link>
          <Link to="/work" className="btn btn--ghost">Browse work</Link>
        </div>
      </header>
    </div>
  )
}
