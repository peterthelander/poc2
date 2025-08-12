import { uuid } from './uuid'

export function isLoggingEnabled() {
  return new URLSearchParams(location.search).has('log')
}

export function hasLogConsent() {
  return localStorage.getItem('poc2.logConsent') === 'yes'
}

export function getSessionId(): string {
  const existing = localStorage.getItem('poc2.sessionId')
  if (existing) return existing
  const newId = uuid()
  localStorage.setItem('poc2.sessionId', newId)
  return newId
}

export async function logEvent(evt: { personaId: string; role: 'user' | 'assistant'; text: string }) {
  if (!isLoggingEnabled() || !hasLogConsent()) return
  const truncated = evt.text.slice(0, 4000)
  const body = {
    ts: Date.now(),
    personaId: evt.personaId,
    role: evt.role,
    text: truncated,
    sessionId: getSessionId(),
    userAgent: navigator.userAgent,
    path: location.pathname + location.search,
  }
  try {
    await fetch('/api/log', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {}
}
