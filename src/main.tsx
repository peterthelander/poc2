import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import { initTheme } from './lib/theme'

window.addEventListener('error', e => console.log('window error:', e.message))
window.addEventListener('unhandledrejection', e => console.log('promise rejection:', e.reason))

initTheme()

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
