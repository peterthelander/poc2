import React from 'react'
import './app.css'
import Chat from './components/Chat'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="sticky top-0 z-10 border-b bg-white/90 dark:bg-neutral-900/90 backdrop-blur px-4 py-2">
        <h1 className="text-lg font-semibold">AidKit (POC2)</h1>
      </header>
      <main className="flex-1 mx-auto w-full max-w-[720px] px-4 py-4">
        <Chat />
      </main>
      <footer className="text-xs text-center text-neutral-500 dark:text-neutral-400 py-4">
        About • Privacy • v0.1
      </footer>
    </div>
  )
}
