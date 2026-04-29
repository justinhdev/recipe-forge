import { NextFunction, Request, Response } from "express";

type RateLimitOptions = {
  name: string;
  windowMs: number;
  maxRequests: number;
  message: string;
};

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

const stores = new Set<Map<string, RateLimitBucket>>();

function getClientKey(req: Request) {
  const forwardedFor = req.headers["x-forwarded-for"];
  const forwardedIp =
    typeof forwardedFor === "string" ? forwardedFor.split(",")[0]?.trim() : "";

  return req.ip || forwardedIp || req.socket.remoteAddress || "unknown";
}

function cleanupExpiredBuckets(
  store: Map<string, RateLimitBucket>,
  now: number
) {
  for (const [key, bucket] of store.entries()) {
    if (bucket.resetAt <= now) {
      store.delete(key);
    }
  }
}

export function createRateLimiter({
  name,
  windowMs,
  maxRequests,
  message,
}: RateLimitOptions) {
  const store = new Map<string, RateLimitBucket>();
  stores.add(store);

  return (req: Request, res: Response, next: NextFunction) => {
    const now = Date.now();
    cleanupExpiredBuckets(store, now);

    const key = `${name}:${getClientKey(req)}`;
    const bucket = store.get(key) ?? {
      count: 0,
      resetAt: now + windowMs,
    };

    if (bucket.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((bucket.resetAt - now) / 1000);

      res.setHeader("RateLimit-Limit", String(maxRequests));
      res.setHeader("RateLimit-Remaining", "0");
      res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));
      res.setHeader("Retry-After", String(Math.max(retryAfterSeconds, 1)));

      return res.status(429).json({ message });
    }

    bucket.count += 1;
    store.set(key, bucket);

    res.setHeader("RateLimit-Limit", String(maxRequests));
    res.setHeader(
      "RateLimit-Remaining",
      String(Math.max(maxRequests - bucket.count, 0))
    );
    res.setHeader("RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    next();
  };
}

export const authRateLimit = createRateLimiter({
  name: "auth",
  windowMs: 15 * 60 * 1000,
  maxRequests: 50,
  message: "Too many authentication attempts. Please try again later.",
});

export const aiRateLimit = createRateLimiter({
  name: "ai",
  windowMs: 60 * 60 * 1000,
  maxRequests: 30,
  message: "Too many recipe generation requests. Please try again later.",
});

export function resetRateLimitersForTest() {
  if (process.env.NODE_ENV !== "test") return;

  for (const store of stores) {
    store.clear();
  }
}
