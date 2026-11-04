import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { REGIONS, regionForPath } from '../data/canvas'
import ThemeToggle from './ThemeToggle'
import { ArrowRight, GitHubIcon, LinkedInIcon, MailIcon, SidebarIcon } from './icons'

const SOCIALS = [
  { href: site.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
  { href: site.github, label: 'GitHub', icon: GitHubIcon },
  { href: `mailto:${site.email}`, label: 'Email', icon: MailIcon },
]

const COLLAPSED_KEY = 'sidebar:collapsed'

// Storage can be unavailable (private mode, blocked storage); the sidebar then just starts expanded.
const readCollapsed = () => {
  try {
    return localStorage.getItem(COLLAPSED_KEY) === '1'
  } catch {
    return false
  }
}

// Fixed sidebar (shown beside case studies; the canvas editor replaces it on desktop), styled as the
// portfolio's table of contents, which can collapse to a numbered rail; an off-canvas panel behind a floating toggle on smaller screens. The collapsed state
// lives on <html data-sidebar> so the shell's offset (--sidebar-w) follows it.
export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const { pathname } = useLocation()
  const toggleRef = useRef(null)
  // The canvas keeps the URL on the section in view, so the URL is the reading position.
  const active = regionForPath(pathname)?.id ?? (pathname.startsWith('/work/') ? 'work' : null)

  useEffect(() => setOpen(false), [pathname])

  useLayoutEffect(() => {
    document.documentElement.dataset.sidebar = collapsed ? 'collapsed' : 'expanded'
    try {
      localStorage.setItem(COLLAPSED_KEY, collapsed ? '1' : '0')
    } catch {
      /* ignore */
    }
  }, [collapsed])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        setOpen(false)
        toggleRef.current?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  // Native tooltips stand in for the hidden labels on the rail.
  const tip = (label) => (collapsed ? label : undefined)

  return (
    <>
      <aside id="sidebar" className={`sidebar${open ? ' is-open' : ''}`} aria-label="Site">
        <div className="side-head">
          <Link to="/" className="profile" aria-label={`${site.name}, home`} title={tip(site.name)}>
            <span className="profile__avatar" aria-hidden="true">AR</span>
            <span className="profile__text">
              <span className="profile__name">{site.name}</span>
              <span className="profile__role">{site.role}</span>
            </span>
          </Link>
          <button
            type="button"
            className="side-collapse"
            aria-controls="sidebar"
            aria-expanded={!collapsed}
            aria-label={collapsed ? 'Expand menu' : 'Collapse menu'}
            title={collapsed ? 'Expand menu' : 'Collapse menu'}
            onClick={() => setCollapsed((v) => !v)}
          >
            <SidebarIcon size={18} />
          </button>
        </div>

        <nav aria-label="Contents" className="side-group">
          <p className="side-group__title">Contents</p>
          <ol className="side-nav side-toc">
            {REGIONS.map((s) => (
              <li key={s.id}>
                <Link
                  to={s.path}
                  className={`side-nav__link side-toc__link${active === s.id ? ' active' : ''}`}
                  aria-current={active === s.id ? 'location' : undefined}
                  title={tip(s.label)}
                >
                  <span className="side-toc__num" aria-hidden="true">{s.number}</span>
                  <span className="side-nav__label">{s.label}</span>
                </Link>
              </li>
            ))}
          </ol>
        </nav>

        <div className="side-group">
          <p className="side-group__title">Socials</p>
          <ul className="side-nav">
            {SOCIALS.map(({ href, label, icon: I }) => {
              const external = href.startsWith('http')
              return (
                <li key={label}>
                  <a
                    href={href}
                    className="side-nav__link"
                    title={tip(label)}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <I className="side-nav__icon" />
                    <span className="side-nav__label">{label}</span>
                    {external && <span className="visually-hidden"> (opens in a new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <div className="side-group">
          <ThemeToggle withLabel className="side-nav__link side-theme" />
        </div>

        <a href={`mailto:${site.email}`} className="side-cta" title={tip('Email me')}>
          <span className="side-cta__label">Email me</span>
          <ArrowRight size={14} className="side-cta__arrow" />
          <MailIcon size={16} className="side-cta__icon" />
        </a>
      </aside>

      <div className={`sidebar-scrim${open ? ' is-open' : ''}`} onClick={() => setOpen(false)} aria-hidden="true" />

      <button
        ref={toggleRef}
        type="button"
        className="sidebar-toggle"
        aria-controls="sidebar"
        aria-expanded={open}
        aria-label={open ? 'Close navigation' : 'Open navigation'}
        onClick={() => setOpen((v) => !v)}
      >
        <SidebarIcon size={18} />
      </button>
    </>
  )
}
