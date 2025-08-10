import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { mockChat } from '../services/llm'
import { getItem, setItem } from '../lib/storage'
import { uuid } from '../lib/uuid'
import MessageBubble from './MessageBubble'
import MessageInput from './MessageInput'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

const STORAGE_KEY = 'poc2.chat'

export interface ChatHandle {
  clear: () => void
}

const Chat = forwardRef<ChatHandle>((_, ref) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AbortController>()

  useImperativeHandle(ref, () => ({
    clear() {
      stop()
      setMessages([])
      setItem(STORAGE_KEY, JSON.stringify([]))
    },
  }))

  useEffect(() => {
    const raw = getItem(STORAGE_KEY)
    if (raw) {
      try {
        setMessages(JSON.parse(raw))
      } catch {}
    }
  }, [])

  useEffect(() => {
    setItem(STORAGE_KEY, JSON.stringify(messages.slice(-20)))
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const content = input.trim()
    if (!content || streaming) return
    try {
      const userMsg: Message = { id: uuid(), role: 'user', text: content, ts: Date.now() }
      const assistantMsg: Message = { id: uuid(), role: 'assistant', text: '', ts: Date.now() }
      setMessages(m => [...m, userMsg, assistantMsg])
      setInput('')
      setStreaming(true)
      const controller = new AbortController()
      controllerRef.current = controller
      try {
        for await (const ev of mockChat(content, { signal: controller.signal })) {
          if ('token' in ev) {
            setMessages(m =>
              m.map(msg =>
                msg.id === assistantMsg.id
                  ? { ...msg, text: msg.text + (msg.text ? ' ' : '') + ev.token }
                  : msg
              )
            )
          }
        }
      } finally {
        setStreaming(false)
        controllerRef.current = undefined
      }
    } catch (err) {
      console.error(err)
    }
  }

  const stop = () => controllerRef.current?.abort()

  return (
    <div className="flex h-full flex-col">
      <div className="flex-1 overflow-y-auto space-y-4 pb-4 pb-28">
        {messages.map((m, i) => (
          <MessageBubble
            key={m.id}
            role={m.role}
            text={m.text}
            isStreaming={streaming && i === messages.length - 1 && m.role === 'assistant'}
          />
        ))}
        <div ref={bottomRef} />
      </div>
      <MessageInput
        value={input}
        onChange={setInput}
        onSend={send}
        onStop={stop}
        streaming={streaming}
      />
    </div>
  )
})

Chat.displayName = 'Chat'

export default Chat
