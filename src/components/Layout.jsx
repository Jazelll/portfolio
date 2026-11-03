import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import { regionForPath } from '../data/canvas'
import { site } from '../data/site'

function ScrollManager() {
  const { pathname, hash } = useLocation()

  useEffect(() => {
    if (regionForPath(pathname)) return // canvas regions position themselves (see SiteCanvas)
    if (hash) {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) {
        el.scrollIntoView()
        return
      }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])

  return null
}

function SiteFooter() {
  return (
    <footer className="site-footer">
      <p>© {new Date().getFullYear()} {site.fullName}</p>
      <button type="button" className="text-link" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
        Back to top ↑
      </button>
    </footer>
  )
}

export default function Layout() {
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <ScrollManager />
      <Sidebar />
      <div className="shell">
        <main id="main" className="panel" tabIndex={-1}>
          <Outlet />
          <SiteFooter />
        </main>
      </div>
    </>
  )
}
