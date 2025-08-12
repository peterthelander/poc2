import React, { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react'
import { chat, ERROR_TOKEN } from '../services/llm'
import { getItem, setItem } from '../lib/storage'
import { uuid } from '../lib/uuid'
import { log, isDebug } from '../lib/debug'
import { appendChunk, normalizeListBoundary } from '../lib/stream'
import MessageBubble from './MessageBubble'
import MessageInput, { MessageInputHandle } from './MessageInput'
import { Persona, PersonaKey } from '../personas'

interface Message {
  id: string
  role: 'user' | 'assistant'
  text: string
  ts: number
}

export interface ChatHandle {
  clear: () => void
}

interface Props {
  persona: Persona
  personaKey: PersonaKey
}

const Chat = forwardRef<ChatHandle, Props>(({ persona, personaKey }, ref) => {
  const STORAGE_KEY = `poc2.chat.${personaKey}`
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [streaming, setStreaming] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const controllerRef = useRef<AbortController>()
  const skipScrollRef = useRef(false)
  const inputRef = useRef<MessageInputHandle>(null)

  useImperativeHandle(ref, () => ({
    clear() {
      skipScrollRef.current = true
      stop()
      setMessages([])
      setItem(STORAGE_KEY, JSON.stringify([]))
      window.scrollTo({ top: 0, behavior: 'auto' })
      inputRef.current?.focus()
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
    if (skipScrollRef.current) {
      skipScrollRef.current = false
      return
    }
    if (messages.length === 0) return
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages])

  const send = async () => {
    const content = input.trim()
    if (!content || streaming) return
    try {
      const history = messages.slice(-6).map(m => ({ role: m.role, content: m.text }))
      const userMsg: Message = { id: uuid(), role: 'user', text: content, ts: Date.now() }
      const assistantMsg: Message = { id: uuid(), role: 'assistant', text: '', ts: Date.now() }
      setMessages(m => [...m, userMsg, assistantMsg])
      setInput('')
      setStreaming(true)
      const controller = new AbortController()
      controllerRef.current = controller
        try {
          let debugCount = 0
          for await (const ev of chat(content, {
            signal: controller.signal,
            system: persona.systemPrompt,
            history,
          })) {
            if ('token' in ev) {
              if (isDebug() && debugCount < 15) {
                log(JSON.stringify(ev.token))
                debugCount++
              }
              const chunk = ev.token
              const text =
                chunk.startsWith('- ') || /^\d+\.\s/.test(chunk)
                  ? normalizeListBoundary(assistantMsg.text, chunk)
                  : appendChunk(assistantMsg.text, chunk)
              setMessages(m =>
                m.map(msg =>
                  msg.id === assistantMsg.id
                    ? { ...msg, text }
                    : msg
                )
              )
              assistantMsg.text = text
            }
          }
        } finally {
          setStreaming(false)
          controllerRef.current = undefined
        }
      } catch (err) {
        log(err)
      console.error(err)
    }
  }

  const retry = async () => {
    const last = messages[messages.length - 1]
    const prev = messages[messages.length - 2]
    if (
      streaming ||
      !last ||
      last.role !== 'assistant' ||
      last.text !== ERROR_TOKEN ||
      !prev ||
      prev.role !== 'user'
    )
      return
    try {
      const history = messages
        .slice(0, -2)
        .slice(-6)
        .map(m => ({ role: m.role, content: m.text }))
      setMessages(m => m.map(msg => (msg.id === last.id ? { ...msg, text: '' } : msg)))
      setStreaming(true)
      const controller = new AbortController()
      controllerRef.current = controller
      try {
        let debugCount = 0
        for await (const ev of chat(prev.text, {
          signal: controller.signal,
          system: persona.systemPrompt,
          history,
        })) {
          if ('token' in ev) {
            if (isDebug() && debugCount < 15) {
              log(JSON.stringify(ev.token))
              debugCount++
            }
            const chunk = ev.token
            const text =
              chunk.startsWith('- ') || /^\d+\.\s/.test(chunk)
                ? normalizeListBoundary(last.text, chunk)
                : appendChunk(last.text, chunk)
            setMessages(m =>
              m.map(msg =>
                msg.id === last.id
                  ? { ...msg, text }
                  : msg
              )
            )
            last.text = text
          }
        }
      } finally {
        setStreaming(false)
        controllerRef.current = undefined
      }
    } catch (err) {
      log(err)
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
            persona={persona}
          />
        ))}
        {!streaming &&
          messages[messages.length - 1]?.role === 'assistant' &&
          messages[messages.length - 1]?.text === ERROR_TOKEN && (
            <div className="flex justify-center">
              <button className="text-sm text-blue-500 underline" onClick={retry}>
                Retry
              </button>
            </div>
          )}
        <div ref={bottomRef} />
      </div>
        <MessageInput
          ref={inputRef}
          value={input}
          onChange={setInput}
          onSend={send}
          onStop={stop}
          streaming={streaming}
          personaKey={personaKey}
        />
      </div>
    )
  })

Chat.displayName = 'Chat'

export default Chat
