import { createBrowserRouter } from 'react-router'
import RootLayout from './layouts/RootLayout'
import Home from './pages/Home'

// Home is eager (the hero itself lazy-loads its 3D chunk); other routes are code-split.
export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    HydrateFallback: () => null,
    children: [
      { index: true, element: <Home /> },
      { path: 'work', lazy: async () => ({ Component: (await import('./pages/Work')).default }) },
      { path: 'work/:slug', lazy: async () => ({ Component: (await import('./pages/CaseStudy')).default }) },
      { path: 'studio', lazy: async () => ({ Component: (await import('./pages/Studio')).default }) },
      { path: 'contact', lazy: async () => ({ Component: (await import('./pages/Contact')).default }) },
      { path: '*', lazy: async () => ({ Component: (await import('./pages/NotFound')).default }) },
    ],
  },
])
