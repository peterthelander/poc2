const MAX_LEN = 1800;

module.exports = async (req, res) => {
  try {
    if (req.method === 'GET') {
      res.status(200).json({ ok: true, hasWebhook: !!process.env.WEBHOOK_URL });
      return;
    }
    if (req.method !== 'POST') {
      res.status(405).end();
      return;
    }

    const url = process.env.WEBHOOK_URL;
    if (!url) {
      res.status(204).end(); // no-op if not configured
      return;
    }

    // Vercel parses JSON automatically when content-type is application/json
    const { ts, personaId, role, text, sessionId, userAgent, path } = req.body || {};
    if (
      typeof ts !== 'number' ||
      (role !== 'user' && role !== 'assistant') ||
      typeof text !== 'string' ||
      typeof personaId !== 'string' ||
      typeof sessionId !== 'string'
    ) {
      res.status(400).json({ error: 'bad_payload' });
      return;
    }

    const hdr = `[${new Date(ts).toISOString()}] persona=${personaId} session=${sessionId}`;
    const ua = userAgent ? `\nUA: ${userAgent}` : '';
    const pth = path ? `\nURL: ${path}` : '';
    const body = `\n${role}:\n${text}`;
    let content = `${hdr}${ua}${pth}${body}`;
    if (content.length > MAX_LEN) content = content.slice(0, MAX_LEN - 3) + '...';

    const resp = await fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        content,
        allowed_mentions: { parse: [] },
        username: 'POC2 Logger',
      }),
    });

    if (!resp.ok) {
      res.status(502).json({ error: 'webhook_failed', status: resp.status });
      return;
    }

    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: 'exception', message: String((err && err.message) || err) });
  }
};

module.exports.config = { runtime: 'nodejs' };

