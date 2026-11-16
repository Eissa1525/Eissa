import { Component, type ReactNode } from 'react';

/** Catches WebGL / asset failures so a broken 3D scene never takes the page down. */
export class CanvasBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err: unknown) { console.warn('[IRON//VOID] 3D scene unavailable, showing fallback.', err); }
  render() { return this.state.failed ? this.props.fallback : this.props.children; }
}

let probe: boolean | null = null;
/** Probed once and cached; the throwaway context is released so it never counts against the browser's limit. */
export function webglAvailable() {
  if (probe !== null) return probe;
  try {
    const c = document.createElement('canvas');
    const gl = (c.getContext('webgl2') || c.getContext('webgl')) as WebGLRenderingContext | null;
    probe = !!gl;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
  } catch { probe = false; }
  return probe;
}
