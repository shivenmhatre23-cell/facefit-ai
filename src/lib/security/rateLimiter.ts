/**
 * In-memory sliding window rate limiter for FaceFit AI API endpoints.
 * Protects vision and LLM quotas from spam and denial of service.
 */

interface RateLimitRecord {
  timestamps: number[];
}

class SlidingWindowRateLimiter {
  private cache: Map<string, RateLimitRecord> = new Map();
  private cleanupIntervalMs = 60 * 1000; // Cleanup stale records every minute
  private lastCleanup = Date.now();

  /**
   * Checks if an IP has exceeded the allowed request limit in the given window.
   * @param key Identifier (e.g. IP address + route)
   * @param limit Max requests allowed in window
   * @param windowMs Time window in milliseconds
   */
  check(
    key: string,
    limit: number,
    windowMs: number
  ): { allowed: boolean; remaining: number; resetMs: number } {
    this.periodicCleanup(windowMs);

    const now = Date.now();
    const record = this.cache.get(key) || { timestamps: [] };

    // Filter out timestamps outside the sliding window
    const windowStart = now - windowMs;
    const validTimestamps = record.timestamps.filter((ts) => ts > windowStart);

    if (validTimestamps.length >= limit) {
      const oldestValid = validTimestamps[0];
      const resetMs = Math.max(0, oldestValid + windowMs - now);
      return { allowed: false, remaining: 0, resetMs };
    }

    validTimestamps.push(now);
    this.cache.set(key, { timestamps: validTimestamps });

    return {
      allowed: true,
      remaining: limit - validTimestamps.length,
      resetMs: windowMs,
    };
  }

  private periodicCleanup(windowMs: number) {
    const now = Date.now();
    if (now - this.lastCleanup > this.cleanupIntervalMs) {
      this.lastCleanup = now;
      const cutoff = now - windowMs * 2;
      for (const [key, record] of this.cache.entries()) {
        const active = record.timestamps.filter((ts) => ts > cutoff);
        if (active.length === 0) {
          this.cache.delete(key);
        } else {
          this.cache.set(key, { timestamps: active });
        }
      }
    }
  }

  /**
   * Reset rate limit for an identifier (useful in testing)
   */
  reset(key: string) {
    this.cache.delete(key);
  }
}

export const rateLimiter = new SlidingWindowRateLimiter();

/**
 * Extracts client IP from Next.js request headers
 */
export function getClientIp(headers: Headers): string {
  const forwardedFor = headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  return headers.get('x-real-ip') || headers.get('cf-connecting-ip') || '127.0.0.1';
}
