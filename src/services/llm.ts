export type ChatEvent = { token: string } | { done: true }

const USE_API = (globalThis as any)?.process?.env?.USE_API === 'true'

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

export async function* mockChat(prompt: string, opts?: { signal?: AbortSignal }): AsyncGenerator<ChatEvent> {
  const text = 'Remember to stay calm and check for safety before giving first aid.'
  const tokens = text.split(' ')
  for (const token of tokens) {
    if (opts?.signal?.aborted) break
    await delay(40 + Math.random() * 20)
    yield { token }
  }
  if (!opts?.signal?.aborted) {
    yield { done: true }
  }
}

export async function* apiChat(prompt: string, opts?: { signal?: AbortSignal }): AsyncGenerator<ChatEvent> {
  const res = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages: [{ role: 'user', content: prompt }] }),
    signal: opts?.signal,
  })
  const reader = res.body?.getReader()
  if (!reader) {
    return
  }
  const decoder = new TextDecoder()
  let buffer = ''
  while (true) {
    if (opts?.signal?.aborted) break
    const { value, done } = await reader.read()
    if (done) break
    buffer += decoder.decode(value, { stream: true })
    const parts = buffer.split(/\s+/)
    buffer = parts.pop() ?? ''
    for (const token of parts) {
      if (opts?.signal?.aborted) break
      if (token) yield { token }
    }
  }
  if (!opts?.signal?.aborted) {
    if (buffer) {
      yield { token: buffer }
    }
    yield { done: true }
  }
}

export function chat(prompt: string, opts?: { signal?: AbortSignal }): AsyncGenerator<ChatEvent> {
  return USE_API ? apiChat(prompt, opts) : mockChat(prompt, opts)
}

export function systemPrompt(): string {
  return 'You provide calm, step-by-step first-aid guidance. You are not a medical diagnosis.'
}
