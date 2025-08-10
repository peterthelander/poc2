export type ChatEvent = { token: string } | { done: true }

const USE_API = true // TODO: wire via Vite define/env later

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms))
}

export async function* mockChat(
  prompt: string,
  opts?: { signal?: AbortSignal; history?: { role: string; content: string }[]; system?: string }
): AsyncGenerator<ChatEvent> {
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

export const ERROR_TOKEN = '⚠️ The service is busy. Please try again.'

export async function* apiChat(
  prompt: string,
  opts?: {
    signal?: AbortSignal
    history?: { role: string; content: string }[]
    system?: string
  }
): AsyncGenerator<ChatEvent> {
  const messages = [
    opts?.system ? { role: 'system', content: opts.system } : null,
    ...(opts?.history ?? []),
    { role: 'user', content: prompt },
  ].filter(Boolean) as { role: string; content: string }[]

  let controller: AbortController | undefined
  let signal = opts?.signal
  if (!signal) {
    controller = new AbortController()
    signal = controller.signal
    setTimeout(() => controller?.abort(), 30_000)
  }

  try {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
      signal,
    })
    if (!res.ok || !res.body) {
      yield { token: ERROR_TOKEN }
      yield { done: true }
      return
    }
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let buffer = ''
    while (true) {
      if (signal?.aborted) break
      const { value, done } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      const parts = buffer.split(/\s+/)
      buffer = parts.pop() ?? ''
      for (const token of parts) {
        if (signal?.aborted) break
        if (token) yield { token }
      }
    }
    if (!signal?.aborted) {
      if (buffer) {
        yield { token: buffer }
      }
      yield { done: true }
    }
  } catch {
    yield { token: ERROR_TOKEN }
    yield { done: true }
  }
}

export function chat(
  prompt: string,
  opts?: { signal?: AbortSignal; history?: { role: string; content: string }[]; system?: string }
) {
  return USE_API ? apiChat(prompt, opts) : mockChat(prompt, opts)
}

export function systemPrompt(): string {
  return 'You provide calm, step-by-step first-aid guidance. You are not a medical diagnosis.'
}
