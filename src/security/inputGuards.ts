export const MAX_DOCUMENT_CHARS = 200_000;
export const MAX_MESSAGE_CHARS = 8_000;
export const MAX_POLICY_FIELD_CHARS = 500;

export function isNonEmptyString(value: unknown, maxLength: number): value is string {
  return typeof value === 'string' && value.trim().length > 0 && value.length <= maxLength;
}

export function boundedString(value: unknown, maxLength: number, fallback: string): string {
  return typeof value === 'string' && value.length <= maxLength ? value : fallback;
}

export function createRateLimiter(limit: number, windowMs: number) {
  const buckets = new Map<string, { count: number; resetAt: number }>();

  return (key: string, now = Date.now()): boolean => {
    const current = buckets.get(key);
    if (!current || current.resetAt <= now) {
      buckets.set(key, { count: 1, resetAt: now + windowMs });
      if (buckets.size > 10_000) {
        for (const [bucketKey, bucket] of buckets) {
          if (bucket.resetAt <= now) buckets.delete(bucketKey);
        }
      }
      return true;
    }
    if (current.count >= limit) return false;
    current.count += 1;
    return true;
  };
}
