import { createClient } from "@vercel/kv";

// Create KV client with Vercel's Upstash integration variable names
const kv = createClient({
  url: process.env.STORAGE_KV_REST_API_URL || process.env.KV_REST_API_URL || "",
  token: process.env.STORAGE_KV_REST_API_TOKEN || process.env.KV_REST_API_TOKEN || "",
});

// Key patterns
export const KV_KEYS = {
  fabric: (id: string) => `fabric:${id}`,
  fabricIndex: "fabrics:index",
  fabricsByCategory: (category: string) => `fabrics:category:${category}`,
  rateLimit: (userId: string) => `ratelimit:${userId}`,
  gallery: (userId: string) => `gallery:${userId}`,
} as const;

// Generic KV operations
export async function getValue<T>(key: string): Promise<T | null> {
  return kv.get<T>(key);
}

export async function setValue<T>(
  key: string,
  value: T,
  options?: { ex?: number }
): Promise<void> {
  if (options?.ex) {
    await kv.set(key, value, { ex: options.ex });
  } else {
    await kv.set(key, value);
  }
}

export async function deleteValue(key: string): Promise<void> {
  await kv.del(key);
}

export async function getSetMembers(key: string): Promise<string[]> {
  return kv.smembers(key);
}

export async function addToSet(key: string, ...members: string[]): Promise<void> {
  for (const member of members) {
    await kv.sadd(key, member);
  }
}

export async function removeFromSet(key: string, member: string): Promise<void> {
  await kv.srem(key, member);
}

export { kv };
