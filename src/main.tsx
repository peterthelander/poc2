import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { initTheme } from './lib/theme'
import { isDebug, log } from './lib/debug'

if (isDebug()) {
  window.addEventListener('error', e => log(`error: ${e.message}`))
  window.addEventListener('unhandledrejection', e =>
    log(`unhandled: ${e.reason?.message || e.reason}`)
  )
}

initTheme()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
