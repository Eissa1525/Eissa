import { createBrowserRouter, createHashRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'

// Home is eager (the hero itself lazy-loads its 3D chunk); other routes are code-split.
// Hash routing for static hosts that cannot rewrite paths (e.g. the shareable preview build).
const create = import.meta.env.VITE_HASH_ROUTER ? createHashRouter : createBrowserRouter
export const router = create([
  {
    path: '/',
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', lazy: async () => ({ Component: (await import('./pages/Work')).default }) },
      { path: 'work/:slug', lazy: async () => ({ Component: (await import('./pages/CaseStudy')).default }) },
      { path: 'about', lazy: async () => ({ Component: (await import('./pages/About')).default }) },
      { path: 'contact', lazy: async () => ({ Component: (await import('./pages/Contact')).default }) },
      { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).default }) },
    ],
  },
])
