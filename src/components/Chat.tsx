import React, { useEffect, useRef, useState } from 'react'
import { mockChat } from '../services/llm'
import { getItem, setItem } from '../lib/storage'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

const STORAGE_KEY = 'poc2.chat'

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AbortController>()

  useEffect(() => {
    const raw = getItem(STORAGE_KEY)
    if (raw) {
      try {
        setMessages(JSON.parse(raw))
      } catch {}
    }
  }, [])

  useEffect(() => {
    setItem(STORAGE_KEY, JSON.stringify(messages.slice(-10)))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const content = input.trim()
    if (!content || streaming) return
    const userMsg: Message = { id: crypto.randomUUID(), role: 'user', text: content, ts: Date.now() }
    const assistantMsg: Message = { id: crypto.randomUUID(), role: 'assistant', text: '', ts: Date.now() }
    setMessages(m => [...m, userMsg, assistantMsg])
    setInput('')
    setStreaming(true)
    const controller = new AbortController()
    controllerRef.current = controller
    try {
      for await (const ev of mockChat(content, { signal: controller.signal })) {
        if ('token' in ev) {
          setMessages(m => m.map(msg => msg.id === assistantMsg.id ? { ...msg, text: msg.text + (msg.text ? ' ' : '') + ev.token } : msg))
        }
      }
    } finally {
      setStreaming(false)
      controllerRef.current = undefined
    }
  }

  const stop = () => controllerRef.current?.abort()

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 24 * 6) + 'px'
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-blue-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <form onSubmit={e => { e.preventDefault(); send() }} className="sticky bottom-0 bg-white dark:bg-neutral-900 pt-2">
        <div className="flex items-end gap-2">
          <textarea
            aria-label="Message"
            className="flex-1 resize-none rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-2 text-sm text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-48 overflow-y-auto"
            value={input}
            onChange={handleChange}
            onKeyDown={handleKey}
            disabled={streaming}
            rows={1}
          />
          {streaming ? (
            <button type="button" onClick={stop} aria-label="Stop generation" className="h-10 px-4 rounded-md bg-red-600 text-white">
              Stop
            </button>
          ) : (
            <button type="submit" aria-label="Send" disabled={!input.trim()} className="h-10 px-4 rounded-md bg-blue-600 text-white disabled:opacity-50">
              Send
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
