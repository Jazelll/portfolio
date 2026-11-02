import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { site } from '../data/site'
import { AboutIcon, ArrowRight, GitHubIcon, HomeIcon, LinkedInIcon, MailIcon, SidebarIcon, WorkIcon } from './icons'

const NAV = [
  { to: '/', label: 'Home', icon: HomeIcon, end: true },
  { to: '/about', label: 'About', icon: AboutIcon },
  { to: '/work', label: 'Work', icon: WorkIcon },
  { to: '/contact', label: 'Contact', icon: MailIcon },
]

const SOCIALS = [
  { href: site.linkedin, label: 'LinkedIn', icon: LinkedInIcon },
  { href: site.github, label: 'GitHub', icon: GitHubIcon },
  { href: `mailto:${site.email}`, label: 'Email', icon: MailIcon },
]

// Fixed sidebar on desktop; an off-canvas panel behind a floating toggle on smaller screens.
export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  const toggleRef = useRef(null)

  useEffect(() => setOpen(false), [pathname])

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

  return (
    <>
      <aside id="sidebar" className={`sidebar${open ? ' is-open' : ''}`} aria-label="Site">
        <NavLink to="/" className="profile" aria-label={`${site.name}, home`}>
          <span className="profile__avatar" aria-hidden="true">AR</span>
          <span className="profile__text">
            <span className="profile__name">{site.name}</span>
            <span className="profile__role">{site.role}</span>
          </span>
        </NavLink>

        <nav aria-label="Primary">
          <ul className="side-nav">
            {NAV.map(({ to, label, icon: I, end }) => (
              <li key={to}>
                <NavLink to={to} end={end} className="side-nav__link">
                  <I className="side-nav__icon" />
                  <span>{label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
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
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  >
                    <I className="side-nav__icon" />
                    <span>{label}</span>
                    {external && <span className="visually-hidden"> (opens in a new tab)</span>}
                  </a>
                </li>
              )
            })}
          </ul>
        </div>

        <a href={`mailto:${site.email}`} className="side-cta">
          Email me <ArrowRight size={14} />
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
