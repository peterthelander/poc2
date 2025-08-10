import React from 'react'

interface Props {
  role: 'user' | 'assistant'
  text: string
  isStreaming?: boolean
}

export default function MessageBubble({ role, text, isStreaming }: Props) {
  const base = "relative max-w-[80%] md:max-w-[70%] whitespace-pre-wrap px-4 py-2 text-sm md:text-base rounded-2xl shadow after:content-['']"
  const user = 'bg-blue-600 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:-mr-2 after:w-0 after:h-0 after:border-l-8 after:border-l-blue-600 after:border-t-8 after:border-t-transparent'
  const assistant = 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-bl-none after:absolute after:left-0 after:bottom-0 after:-ml-2 after:w-0 after:h-0 after:border-r-8 after:border-r-neutral-100 dark:after:border-r-neutral-800 after:border-t-8 after:border-t-transparent'
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`${base} ${role === 'user' ? user : assistant}`}>
        {text}
        {isStreaming && (
          <span className="inline-flex ml-1 gap-1 align-bottom">
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.3s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce [animation-delay:-0.15s]"></span>
            <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce"></span>
          </span>
        )}
      </div>
    </div>
  )
}
