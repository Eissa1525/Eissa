let cached: boolean | null = null
/** True when a WebGL2 (or WebGL1) context can be created. Cached after first call. */
export function hasWebGL(): boolean {
  if (cached !== null) return cached
  try {
    const c = document.createElement('canvas')
    cached = !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    cached = false
  }
  return cached
}
