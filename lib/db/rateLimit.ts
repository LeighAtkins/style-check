import { v4 as uuidv4 } from "uuid";
import { KV_KEYS, getValue, setValue } from "./kv";

const DAILY_LIMIT = parseInt(process.env.NEXT_PUBLIC_DAILY_LIMIT || "5", 10);

interface RateLimitData {
  count: number;
  resetAt: string;
}

function getNextMidnightUTC(): string {
  const tomorrow = new Date();
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);
  return tomorrow.toISOString();
}

function getTTLSeconds(resetAt: string): number {
  const resetTime = new Date(resetAt).getTime();
  const now = Date.now();
  return Math.max(1, Math.floor((resetTime - now) / 1000));
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: string;
}

export async function checkRateLimit(userId: string): Promise<RateLimitResult> {
  const key = KV_KEYS.rateLimit(userId);
  const data = await getValue<RateLimitData>(key);
  const now = new Date();
  const resetAt = getNextMidnightUTC();

  // No data or expired - user has full quota
  if (!data || new Date(data.resetAt) <= now) {
    return {
      allowed: true,
      remaining: DAILY_LIMIT,
      resetAt,
    };
  }

  const remaining = Math.max(0, DAILY_LIMIT - data.count);
  return {
    allowed: remaining > 0,
    remaining,
    resetAt: data.resetAt,
  };
}

export async function incrementRateLimit(userId: string): Promise<void> {
  const key = KV_KEYS.rateLimit(userId);
  const data = await getValue<RateLimitData>(key);
  const resetAt = getNextMidnightUTC();
  const now = new Date();

  if (!data || new Date(data.resetAt) <= now) {
    // Start new period
    await setValue(key, { count: 1, resetAt }, { ex: 86400 });
  } else {
    // Increment existing
    const ttl = getTTLSeconds(data.resetAt);
    await setValue(
      key,
      { count: data.count + 1, resetAt: data.resetAt },
      { ex: ttl }
    );
  }
}

export async function getRemainingGenerations(
  userId: string
): Promise<{ remaining: number; resetAt: string }> {
  const result = await checkRateLimit(userId);
  return {
    remaining: result.remaining,
    resetAt: result.resetAt,
  };
}

export function generateUserId(): string {
  return uuidv4();
}

export { DAILY_LIMIT };
