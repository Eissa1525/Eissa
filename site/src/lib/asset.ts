/** Resolve a file in /public against the deploy base (works under a sub-path or './' preview builds). */
export function asset(path: string) {
  if (!path || /^(https?:|data:|blob:)/.test(path)) return path
  return import.meta.env.BASE_URL + path.replace(/^\//, '')
}
