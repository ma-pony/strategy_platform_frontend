import FingerprintJS from "@fingerprintjs/fingerprintjs";

const KEY = "sp_visitor_id";
let cached: string | null = null;
let inflight: Promise<string> | null = null;

export function getVisitorId(): Promise<string> {
  if (cached) return Promise.resolve(cached);
  if (inflight) return inflight;
  inflight = (async () => {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      cached = stored;
      return cached;
    }
    try {
      const fp = await FingerprintJS.load();
      const { visitorId } = await fp.get();
      localStorage.setItem(KEY, visitorId);
      cached = visitorId;
      return cached;
    } catch {
      const fallback = crypto.randomUUID();
      localStorage.setItem(KEY, fallback);
      cached = fallback;
      return cached;
    } finally {
      inflight = null;
    }
  })();
  return inflight;
}
