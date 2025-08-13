import React, { useRef, useState } from 'react'
import './app.css'
import Chat, { ChatHandle } from './components/Chat'
import { getTheme, toggleTheme } from './lib/theme'
import { COMMIT_SHA, BUILD_TIME } from './lib/version'
import DebugOverlay from './components/DebugOverlay'
import AboutModal from './components/AboutModal'
import PrivacyModal from './components/PrivacyModal'
import LoggingNotice from './components/LoggingNotice'
import { getPersona } from './personas'
import { getItem, setItem } from './lib/storage'
import { isDebug } from './lib/debug'
import { hasLogConsent } from './lib/remoteLog'

export default function App() {
  const chatRef = useRef<ChatHandle>(null)
  const [theme, setThemeState] = useState(() => getTheme())
  const [aboutOpen, setAboutOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const [{ key: personaKey, persona }] = useState(() => {
    const params = new URLSearchParams(window.location.search)
    const urlKey = params.get('persona')
    const storedKey = getItem('poc2.persona')
    const { key, persona } = getPersona(urlKey || storedKey || undefined)
    setItem('poc2.persona', key)
    document.title = persona.title
    return { key, persona }
  })
  return (
    <div
      className={`min-h-screen flex flex-col text-neutral-900 dark:text-neutral-100 ${persona.bgLight} ${persona.bgDark}`}
    >
      <LoggingNotice />
      <header
        className={
          personaKey === 'friend'
            ? 'fixed top-0 left-0 right-0 z-20 border-b bg-purple-50/80 backdrop-blur shadow-sm'
            : 'fixed top-0 left-0 right-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur shadow-sm'
        }
      >
        <div className="mx-auto flex items-center justify-between w-full max-w-[720px] px-4 py-2">
          <h1 className="text-lg font-semibold">{persona.title}</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                toggleTheme()
                setThemeState(getTheme())
              }}
              aria-label="Toggle theme"
              title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
              className="text-lg"
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => chatRef.current?.clear()}
              className="text-sm text-blue-600 hover:underline"
            >
              Clear
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-[720px] px-4 pt-16 pb-16">
        <Chat ref={chatRef} persona={persona} personaKey={personaKey} />
      </main>
      <footer
        className={
          personaKey === 'friend'
            ? 'fixed bottom-0 left-0 right-0 text-xs text-center text-neutral-500 py-2 bg-purple-50/80 backdrop-blur border-t'
            : 'fixed bottom-0 left-0 right-0 text-xs text-center text-neutral-500 dark:text-neutral-400 py-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-t'
        }
      >
        <button onClick={() => setAboutOpen(true)} className="underline">About</button> •{' '}
        <button onClick={() => setPrivacyOpen(true)} className="underline">Privacy</button> • v0.1{' '}
        <small className="opacity-75">• {COMMIT_SHA} • {new Date(BUILD_TIME).toLocaleString()}</small>
        {isDebug() && (
          <div className="mt-1">
            <a href="?persona=aidkit&debug=1" className="underline mr-2">
              AidKit
            </a>
            <a href="?persona=friend&debug=1" className="underline mr-2">
              Friend
            </a>
            <span className="inline-block border px-1 rounded text-[10px] mr-2">
              Logging: {hasLogConsent() ? 'ON' : 'OFF'}
            </span>
            <a
              href="#"
              className="underline mr-2"
              onClick={() => {
                localStorage.setItem('poc2.logConsent', 'yes')
                location.reload()
              }}
            >
              Allow logging
            </a>
            <a
              href="#"
              className="underline"
              onClick={() => {
                localStorage.setItem('poc2.logConsent', 'no')
                location.reload()
              }}
            >
              Disable logging
            </a>
          </div>
        )}
      </footer>
      <AboutModal open={aboutOpen} onClose={() => setAboutOpen(false)} />
      <PrivacyModal open={privacyOpen} onClose={() => setPrivacyOpen(false)} />
      <DebugOverlay />
    </div>
  )
}
