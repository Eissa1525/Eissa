import { Component, type ReactNode } from 'react'

/** Catches render/WebGL failures in a subtree and shows a fallback instead of a blank page. */
export default class ErrorBoundary extends Component<{ fallback: ReactNode; children: ReactNode }, { failed: boolean }> {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  componentDidCatch(error: unknown) {
    console.warn('[AETHER] scene fallback:', error)
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children
  }
}
