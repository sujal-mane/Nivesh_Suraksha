/**
 * Lightweight In-Memory Rate Limiter
 * Limits excessive requests per IP without requiring external Redis or databases.
 */

const ipRequestMap = new Map();
const WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // 60 requests per minute

export function rateLimiter(req, res, next) {
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  const now = Date.now();

  const record = ipRequestMap.get(ip);

  if (!record || now - record.startTime > WINDOW_MS) {
    ipRequestMap.set(ip, {
      startTime: now,
      count: 1
    });
    return next();
  }

  if (record.count >= MAX_REQUESTS) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a moment before sending another request.',
      retryAfterSeconds: Math.ceil((WINDOW_MS - (now - record.startTime)) / 1000)
    });
  }

  record.count += 1;
  next();
}

// Cleanup stale records periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, record] of ipRequestMap.entries()) {
    if (now - record.startTime > WINDOW_MS) {
      ipRequestMap.delete(ip);
    }
  }
}, WINDOW_MS);
