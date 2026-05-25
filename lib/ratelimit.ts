import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

type RateLimitResult = { success: boolean };

const hasRedis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

export const ratelimit = hasRedis
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(15, "1 h"),
      analytics: true,
    })
  : null;

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  if (!ratelimit) {
    return { success: true };
  }

  return ratelimit.limit(userId);
}
