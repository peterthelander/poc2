import React, { useEffect, useRef, useState } from 'react'
import { isDebug, getLogs, subscribe, clearLogs } from '../lib/debug'

export default function DebugOverlay() {
  if (!isDebug()) return null

  const [logs, setLogs] = useState<string[]>(getLogs())
  const scrollRef = useRef<HTMLPreElement>(null)

  useEffect(() => {
    const unsub = subscribe(() => setLogs([...getLogs()]))
    // Wrap the unsubscribe to discard boolean return value
    return () => { unsub() }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (el) {
      el.scrollTop = el.scrollHeight
    }
  }, [logs])

  return (
    <div className="fixed z-50 bottom-16 left-2 right-2 max-h-[40vh] rounded-md border border-neutral-300 dark:border-neutral-700 bg-white/90 dark:bg-neutral-900/90 backdrop-blur p-2 text-[12px] font-mono shadow overflow-hidden">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Debug</span>
        <button onClick={clearLogs} className="text-xs text-blue-600">Clear</button>
      </div>
      <pre ref={scrollRef} className="mt-1 overflow-auto max-h-[34vh] whitespace-pre-wrap leading-[1.2]">
        {logs.join('\n')}
      </pre>
    </div>
  )
}
