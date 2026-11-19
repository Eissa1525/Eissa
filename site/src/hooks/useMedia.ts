import { useSyncExternalStore } from 'react'

function subscribeMedia(query: string) {
  return (cb: () => void) => {
    const mq = window.matchMedia(query)
    mq.addEventListener('change', cb)
    return () => mq.removeEventListener('change', cb)
  }
}

export function useMedia(query: string, server = false) {
  return useSyncExternalStore(subscribeMedia(query), () => window.matchMedia(query).matches, () => server)
}

export const useReducedMotion = () => useMedia('(prefers-reduced-motion: reduce)')
export const useIsTouch = () => useMedia('(hover: none)')
export const useIsMobile = () => useMedia('(max-width: 767px)')

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
export const isTouch = () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches
