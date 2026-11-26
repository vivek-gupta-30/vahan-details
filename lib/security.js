/** Best-effort in-memory rate limit (per serverless instance). */
const rateBuckets = new Map();

const MAX_LOOKUPS_PER_WINDOW = 20;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

function pruneBucket(key, windowMs) {
  const now = Date.now();
  const bucket = rateBuckets.get(key) || [];
  const fresh = bucket.filter((ts) => now - ts < windowMs);
  rateBuckets.set(key, fresh);
  return fresh;
}

export function checkRateLimit(key, limit = MAX_LOOKUPS_PER_WINDOW, windowMs = RATE_WINDOW_MS) {
  const fresh = pruneBucket(key, windowMs);
  if (fresh.length >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSec: Math.ceil(windowMs / 1000),
    };
  }
  fresh.push(Date.now());
  rateBuckets.set(key, fresh);
  return { allowed: true, remaining: Math.max(0, limit - fresh.length) };
}

export function getClientIp(request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return (
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("x-real-ip") ||
    "unknown"
  );
}

/** Indian RC formats e.g. BR32AK0131, DL1CAB1234, MH12AB1234 */
export function normalizeVehicleNumber(value) {
  return String(value || "")
    .toUpperCase()
    .replace(/[\s-]/g, "");
}

export function isValidVehicleNumber(value) {
  const v = normalizeVehicleNumber(value);
  return /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/.test(v);
}

/**
 * Reject obvious cross-site browser calls.
 * Non-browser clients without Origin are still rate-limited.
 */
export function isAllowedOrigin(request) {
  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const host = request.headers.get("host");

  if (!host) return false;

  const allowed = new Set(
    [
      `https://${host}`,
      `http://${host}`,
      process.env.APP_URL,
      process.env.URL,
      process.env.DEPLOY_PRIME_URL,
      "http://localhost:3000",
      "http://127.0.0.1:3000",
    ].filter(Boolean)
  );

  if (origin) {
    return [...allowed].some((a) => origin === a || origin.startsWith(a));
  }

  if (referer) {
    return [...allowed].some((a) => referer.startsWith(a));
  }

  return true;
}

export function lookupRateLimit(ip) {
  return checkRateLimit(`lookup:ip:${ip}`);
}
