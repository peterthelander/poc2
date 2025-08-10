export function isDebug(): boolean {
  return new URLSearchParams(window.location.search).has('debug')
}

let logs: string[] = []
let subs = new Set<() => void>()

export function getLogs() {
  return logs
}

export function subscribe(fn: () => void) {
  subs.add(fn)
  return () => subs.delete(fn)
}

export function clearLogs() {
  logs = []
  subs.forEach(fn => fn())
}

export function log(msg: unknown) {
  const line = typeof msg === 'string' ? msg : JSON.stringify(msg)
  logs.push(`[${new Date().toLocaleTimeString()}] ${line}`)
  logs = logs.slice(-200)
  subs.forEach(fn => fn())
  try {
    console.log('[DBG]', msg)
  } catch {}
}
