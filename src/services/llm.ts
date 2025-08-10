export type ChatEvent = { token: string } | { done: true }

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

export function systemPrompt(): string {
  return 'You provide calm, step-by-step first-aid guidance. You are not a medical diagnosis.'
}
