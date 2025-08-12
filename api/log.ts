// Minimal process type for accessing environment variables
declare const process: { env: Record<string, string | undefined> }

export const config = { runtime: 'nodejs18.x' }

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return new Response('Bad Request', { status: 400 })
  }

  const url = process.env.WEBHOOK_URL
  if (!url) {
    return new Response(null, { status: 204 })
  }

  let body: any
  try {
    body = await req.json()
  } catch {
    return new Response('Bad Request', { status: 400 })
  }

  const { ts, personaId, role, text, sessionId, userAgent, path } = body ?? {}
  if (
    typeof ts !== 'number' ||
    typeof personaId !== 'string' ||
    (role !== 'user' && role !== 'assistant') ||
    typeof text !== 'string' ||
    typeof sessionId !== 'string' ||
    (userAgent !== undefined && typeof userAgent !== 'string') ||
    (path !== undefined && typeof path !== 'string')
  ) {
    return new Response('Bad Request', { status: 400 })
  }

  const hdr = `[${new Date(ts).toISOString()}] persona=${personaId} session=${sessionId}`
  const ua = userAgent ? `\nUA: ${userAgent}` : ''
  const urlPath = path ? `\nURL: ${path}` : ''
  const bodyText = `\n${role}:\n${text}`
  let content = `${hdr}${ua}${urlPath}${bodyText}`
  if (content.length > 1800) content = content.slice(0, 1797) + '...'

  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        content,
        allowed_mentions: { parse: [] },
        username: 'POC2 Logger',
      }),
    })
    if (!resp.ok) {
      return new Response('Upstream error', { status: 500 })
    }
    return new Response(null, { status: 204 })
  } catch {
    return new Response('Upstream error', { status: 500 })
  }
}

