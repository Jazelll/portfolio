import { useCallback } from 'react'
import { flushSync } from 'react-dom'
import { Link, useNavigate } from 'react-router-dom'

// Shared-element name for the project cover: a canvas card and the case-study hero both carry it,
// so the browser morphs one into the other during navigation.
export const HERO_TRANSITION = 'project-hero'

// Navigates inside a View Transition when the browser supports it and motion is allowed;
// otherwise it is a plain navigation.
export function useTransitionNavigate() {
  const navigate = useNavigate()

  return useCallback(
    (to, options, prepare) => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      if (!document.startViewTransition || reduce) {
        navigate(to, options)
        return
      }
      prepare?.()
      document.startViewTransition(() => {
        flushSync(() => navigate(to, options))
      })
    },
    [navigate],
  )
}

// A Link that navigates through useTransitionNavigate. Modified clicks (new tab, etc.) behave natively.
export default function TransitionLink({ to, state, onBeforeTransition, onClick, ...rest }) {
  const go = useTransitionNavigate()

  const handleClick = (e) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    e.preventDefault()
    go(to, { state }, onBeforeTransition)
  }

  return <Link to={to} state={state} onClick={handleClick} {...rest} />
}
