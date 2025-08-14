// Polls /api/version and auto-reloads if commit changes
const INTERVAL_MS = 30000;
let reloaded = false;

function cacheBust(url: string) {
  const u = new URL(url, location.href);
  u.searchParams.set('v', String(Date.now()));
  return u.toString();
}

export function startAutoUpdate(currentSha: string) {
  async function check() {
    if (reloaded) return;
    try {
      const r = await fetch('/api/version', { cache: 'no-store' });
      if (!r.ok) return;
      const { sha } = await r.json();
      if (sha && sha !== currentSha) {
        reloaded = true;
        // Replace to avoid back button returning to stale page; add cache-buster
        location.replace(cacheBust(location.href));
      }
    } catch {}
  }
  // initial check + interval
  check();
  setInterval(check, INTERVAL_MS);
}
