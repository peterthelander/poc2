import React, { useEffect, useRef } from 'react'

interface Props {
  value: string
  onChange: (v: string) => void
  onSend: () => void
  onStop: () => void
  streaming: boolean
}

export default function MessageInput({ value, onChange, onSend, onStop, streaming }: Props) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      onSend()
    }
  }

  const resize = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = Math.min(el.scrollHeight, 24 * 6) + 'px'
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    resize()
  }

  useEffect(() => {
    resize()
  }, [value])

  useEffect(() => {
    if (!streaming) textareaRef.current?.focus()
  }, [streaming])

  useEffect(() => {
    textareaRef.current?.focus()
  }, [])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        onSend()
      }}
      className="sticky bottom-0 bg-white dark:bg-neutral-900 pt-2 px-2 pb-[max(env(safe-area-inset-bottom),0px)]"
    >
      <div className="flex items-end gap-2 w-full overflow-hidden">
        <textarea
          ref={textareaRef}
          aria-label="Message"
          className="flex-1 min-w-0 resize-none rounded-md border border-neutral-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 p-3 text-sm md:text-base text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500 max-h-48 overflow-y-auto"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKey}
          disabled={streaming}
          rows={1}
        />
        {streaming ? (
          <button
            type="button"
            onClick={onStop}
            aria-label="Stop generation"
            className="h-11 px-4 rounded-md bg-red-600 text-white shrink-0"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            onClick={onSend}
            aria-label="Send"
            disabled={!value.trim()}
            className="h-11 px-4 rounded-md bg-blue-600 text-white disabled:opacity-50 shrink-0"
          >
            Send
          </button>
        )}
      </div>
    </form>
  )
}
