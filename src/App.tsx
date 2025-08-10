import React, { useRef } from 'react'
import './app.css'
import Chat, { ChatHandle } from './components/Chat'

export default function App() {
  const chatRef = useRef<ChatHandle>(null)

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100">
      <header className="fixed top-0 left-0 right-0 z-20 border-b bg-white/80 dark:bg-neutral-900/80 backdrop-blur shadow-sm">
        <div className="mx-auto flex items-center justify-between w-full max-w-[720px] px-4 py-2">
          <h1 className="text-lg font-semibold">AidKit (POC2)</h1>
          <button
            onClick={() => chatRef.current?.clear()}
            className="text-sm text-blue-600 hover:underline"
          >
            Clear
          </button>
        </div>
      </header>
      <main className="flex-1 mx-auto w-full max-w-[720px] px-4 pt-16 pb-4">
        <Chat ref={chatRef} />
      </main>
      <footer className="text-xs text-center text-neutral-500 dark:text-neutral-400 py-4">
        About • Privacy • v0.1
      </footer>
    </div>
  )
}
