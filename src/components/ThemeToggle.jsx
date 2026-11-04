import { useEffect, useState } from 'react'

// Light / dark theme. Until the visitor picks one, the site follows the system setting; a pick is stored
// and restored before first paint by the inline script in index.html (same storage key).
const KEY = 'theme'
const EVENT = 'themechange'
const darkQuery = () => window.matchMedia('(prefers-color-scheme: dark)')

const current = () => document.documentElement.dataset.theme ?? (darkQuery().matches ? 'dark' : 'light')

export function useTheme() {
  const [theme, setTheme] = useState(current)

  useEffect(() => {
    const sync = () => setTheme(current())
    const mq = darkQuery()
    mq.addEventListener('change', sync)
    window.addEventListener(EVENT, sync)
    return () => {
      mq.removeEventListener('change', sync)
      window.removeEventListener(EVENT, sync)
    }
  }, [])

  const toggle = () => {
    const next = current() === 'dark' ? 'light' : 'dark'
    const html = document.documentElement
    html.classList.add('theme-fade')
    html.dataset.theme = next
    window.setTimeout(() => html.classList.remove('theme-fade'), 400)
    try {
      localStorage.setItem(KEY, next)
    } catch {
      /* storage unavailable: the choice lasts for this page view */
    }
    window.dispatchEvent(new Event(EVENT))
  }

  return { theme, toggle }
}

export default function ThemeToggle({ className = '', withLabel = false }) {
  const { theme, toggle } = useTheme()
  const label = theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'

  return (
    <button type="button" className={className} onClick={toggle} aria-label={withLabel ? undefined : label} title={label}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        {theme === 'dark' ? (
          <>
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
          </>
        ) : (
          <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" />
        )}
      </svg>
      {withLabel && <span className="side-nav__label">{theme === 'dark' ? 'Light theme' : 'Dark theme'}</span>}
    </button>
  )
}
