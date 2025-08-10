import React, { useRef, useState } from 'react'
import './app.css'
import Chat, { ChatHandle } from './components/Chat'
import { Theme, getTheme, setTheme, applyTheme } from './lib/theme'
import { COMMIT_SHA, BUILD_TIME } from './lib/version'

export default function App() {
  const chatRef = useRef<ChatHandle>(null)
  const [theme, setThemeState] = useState<Theme>(() => getTheme())
  const [aboutOpen, setAboutOpen] = useState(false)
  const [privacyOpen, setPrivacyOpen] = useState(false)

  const toggleTheme = () => {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setThemeState(next)
    setTheme(next)
    applyTheme(next)
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="fixed top-0 left-0 right-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur shadow-sm">
        <div className="mx-auto flex items-center justify-between w-full max-w-[720px] px-4 py-2">
          <h1 className="text-lg font-semibold">AidKit (POC2)</h1>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleTheme}
              aria-label="Toggle theme"
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
        <Chat ref={chatRef} />
      </main>
      <footer className="fixed bottom-0 left-0 right-0 text-xs text-center text-neutral-500 dark:text-neutral-400 py-2 bg-white/80 dark:bg-neutral-900/80 backdrop-blur border-t">
        <button onClick={() => setAboutOpen(true)} className="underline">About</button> •{' '}
        <button onClick={() => setPrivacyOpen(true)} className="underline">Privacy</button> • v0.1{' '}
        <small className="opacity-75">• {COMMIT_SHA} • {new Date(BUILD_TIME).toLocaleString()}</small>
      </footer>
      <dialog open={aboutOpen} onClose={() => setAboutOpen(false)} className="p-4 rounded-md max-w-sm w-full">
        <p className="mb-2">AidKit POC2 v0.1</p>
        <form method="dialog">
          <button className="underline text-blue-600">Close</button>
        </form>
      </dialog>
      <dialog open={privacyOpen} onClose={() => setPrivacyOpen(false)} className="p-4 rounded-md max-w-sm w-full">
        <p className="mb-2">POC2: no data leaves your browser.</p>
        <form method="dialog">
          <button className="underline text-blue-600">Close</button>
        </form>
      </dialog>
    </div>
  )
}
