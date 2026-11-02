import { useState } from 'react'
import { site } from '../data/site'

export default function CopyEmail({ className = 'btn btn--ghost' }) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      window.location.href = `mailto:${site.email}`
    }
  }

  return (
    <button type="button" className={className} onClick={copy}>
      {copied ? 'Copied' : 'Copy email'}
      <span className="visually-hidden" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
    </button>
  )
}
