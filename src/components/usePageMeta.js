import { useEffect } from 'react'
import { site } from '../data/site'

const setMeta = (selector, attr, value) => {
  const el = document.head.querySelector(selector)
  if (el) el.setAttribute(attr, value)
}

export default function usePageMeta({ title, description = site.description, path = '' }) {
  useEffect(() => {
    const full = title ? `${title} — Althea Rito` : 'Althea Rito — UI/UX Designer'
    const url = new URL(path, site.url).href
    document.title = full
    setMeta('meta[name="description"]', 'content', description)
    setMeta('meta[property="og:title"]', 'content', full)
    setMeta('meta[property="og:description"]', 'content', description)
    setMeta('meta[property="og:url"]', 'content', url)
    setMeta('link[rel="canonical"]', 'href', url)
  }, [title, description, path])
}
