export function uuid() {
  const c = (globalThis as any).crypto
  if (c?.randomUUID) return c.randomUUID()
  const rnd = Math.random().toString(16).slice(2)
  return `${Date.now()}-${rnd}`
}
