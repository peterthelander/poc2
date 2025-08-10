// Minimal process type for accessing environment variables in edge runtime
declare const process: { env: Record<string, string | undefined> };

export const config = { runtime: 'edge' };

// Handle incoming chat completion requests
export default async function handler(req: Request): Promise<Response> {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  let body: any;
  try {
    body = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { messages, max_tokens, temperature } = body ?? {};

  // Validate messages exist and are non-empty
  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response('`messages` must be a non-empty array', { status: 400 });
  }

  // Abort controller to support cancelation
  const controller = new AbortController();
  req.signal.addEventListener('abort', () => controller.abort());

  const upstreamUrl = 'https://api.openai.com/v1/chat/completions';
  const model = (process.env.OPENAI_MODEL as string) || 'gpt-4o-mini';

  try {
    const upstream = await fetch(upstreamUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model,
        messages,
        max_tokens,
        temperature,
        stream: true,
      }),
      signal: controller.signal,
    });

    if (!upstream.ok || !upstream.body) {
      const text = await upstream.text();
      return new Response(`Upstream error: ${text}`, { status: 502 });
    }

    // Stream text deltas back to the caller
    const stream = new ReadableStream<Uint8Array>({
      async start(streamController) {
        const reader = upstream.body!.getReader();
        const decoder = new TextDecoder();
        const encoder = new TextEncoder();
        let buffer = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });

            const lines = buffer.split('\n');
            buffer = lines.pop() || '';

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed.startsWith('data:')) continue;
              const data = trimmed.slice(5).trim();

              if (data === '[DONE]') {
                streamController.close();
                return;
              }

              try {
                const json = JSON.parse(data);
                const token = json.choices?.[0]?.delta?.content;
                if (token) {
                  streamController.enqueue(encoder.encode(token));
                }
              } catch {
                // Ignore malformed JSON lines
              }
            }
          }
          streamController.close();
        } catch (err) {
          streamController.error(err);
        }
      },
    });

    return new Response(stream, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'no-store',
      },
    });
  } catch (err: any) {
    const message = typeof err?.message === 'string' ? err.message : 'Unknown error';
    return new Response(`Upstream error: ${message}`, { status: 502 });
  }
}
