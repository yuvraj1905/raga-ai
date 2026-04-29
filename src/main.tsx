import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/globals.css'
import { AppRouter } from './app/router/AppRouter'
import { AuthProvider } from './app/providers/AuthProvider'

// Register service worker once at startup (dev + prod).
// Check readyState first — if `load` already fired (possible with Vite module loading order),
// calling addEventListener('load') would wait forever.
if ('serviceWorker' in navigator) {
  const registerSW = () => navigator.serviceWorker.register('/sw.js').catch(() => {})
  if (document.readyState === 'complete') {
    registerSW()
  } else {
    window.addEventListener('load', registerSW, { once: true })
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <AppRouter />
    </AuthProvider>
  </StrictMode>
)
