// Minimal process type for accessing environment variables
declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: 'nodejs18.x' };

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }
  if (!req.headers.get('content-type')?.includes('application/json')) {
    return new Response('Bad Request', { status: 400 });
  }
  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }
  const { ts, personaId, role, text, sessionId, userAgent, path } = body ?? {};
  if (
    typeof ts !== 'number' ||
    typeof personaId !== 'string' ||
    (role !== 'user' && role !== 'assistant') ||
    typeof text !== 'string' ||
    typeof sessionId !== 'string'
  ) {
    return new Response('Bad Request', { status: 400 });
  }
  if (!process.env.SLACK_WEBHOOK_URL) {
    return new Response(null, { status: 204 });
  }
  const formattedText = `[${new Date(ts).toISOString()}] persona=${personaId} session=${sessionId}\n${role}:\n${text}\nUA: ${userAgent || '-'}\nURL: ${path || new URL(req.url).pathname}`;
  try {
    const resp = await fetch(process.env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text: formattedText }),
    });
    if (!resp.ok) {
      return new Response('Upstream error', { status: 500 });
    }
    return new Response(null, { status: 204 });
  } catch {
    return new Response('Upstream error', { status: 500 });
  }
}
