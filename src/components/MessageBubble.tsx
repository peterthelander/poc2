import React from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeSanitize from 'rehype-sanitize'

interface Props {
  role: 'user' | 'assistant'
  text: string
  isStreaming?: boolean
}

export default function MessageBubble({ role, text, isStreaming }: Props) {
  const base = "relative max-w-[80%] md:max-w-[70%] px-4 py-2 text-sm md:text-base rounded-2xl shadow after:content-['']"
  const user = 'whitespace-pre-wrap bg-blue-600 text-white rounded-br-none after:absolute after:right-0 after:bottom-0 after:-mr-2 after:w-0 after:h-0 after:border-l-8 after:border-l-blue-600 after:border-t-8 after:border-t-transparent'
  const assistant = 'bg-neutral-100 text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100 rounded-bl-none after:absolute after:left-0 after:bottom-0 after:-ml-2 after:w-0 after:h-0 after:border-r-8 after:border-r-neutral-100 dark:after:border-r-neutral-800 after:border-t-8 after:border-t-transparent'
  return (
    <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`${base} ${role === 'user' ? user : assistant}`}
        aria-live={role === 'assistant' ? 'polite' : undefined}
      >
        {role === 'assistant' ? (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeSanitize]}
            className="prose prose-sm dark:prose-invert max-w-none"
            components={{
              p: ({ node, ...props }: any) => <p className="my-2 leading-relaxed" {...props} />,
              ul: ({ node, ...props }: any) => <ul className="my-2 ml-5 list-disc" {...props} />,
              ol: ({ node, ...props }: any) => <ol className="my-2 ml-5 list-decimal" {...props} />,
              li: ({ node, ...props }: any) => <li className="my-1" {...props} />,
              h1: (props: any) => <h1 className="text-lg font-semibold mt-3 mb-2" {...props} />,
              h2: (props: any) => <h2 className="text-base font-semibold mt-3 mb-2" {...props} />,
              h3: (props: any) => <h3 className="text-sm font-semibold mt-3 mb-1" {...props} />,
              code: ({ inline, ...props }: any) =>
                inline ? (
                  <code
                    className="px-1 py-0.5 rounded bg-neutral-200 dark:bg-neutral-700"
                    {...props}
                  />
                ) : (
                  <pre
                    className="p-2 rounded bg-neutral-900 text-neutral-100 overflow-auto"
                    {...props}
                  />
                ),
              a: ({ node, ...props }: any) => (
                <a
                  className="underline text-blue-600"
                  target="_blank"
                  rel="noopener noreferrer"
                  {...props}
                />
              ),
            }}
          >
            {text}
          </ReactMarkdown>
        ) : (
          text
        )}
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
