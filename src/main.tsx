import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { initTheme } from './lib/theme'
import { isDebug, log } from './lib/debug'
import { COMMIT_SHA } from './lib/version'
import { startAutoUpdate } from './lib/autoUpdate'

if (isDebug()) {
  window.addEventListener('error', e => log(`error: ${e.message}`))
  window.addEventListener('unhandledrejection', e =>
    log(`unhandled: ${e.reason?.message || e.reason}`)
  )
}

initTheme()
startAutoUpdate(COMMIT_SHA)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
