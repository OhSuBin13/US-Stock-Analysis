import Redis from "ioredis";
import { env } from "@/lib/env";

let redis: Redis | null = null;

export function getRedis() {
  if (!env.redisUrl) {
    return null;
  }

  if (!redis) {
    redis = new Redis(env.redisUrl, {
      maxRetriesPerRequest: 1,
      lazyConnect: true,
    });
  }

  return redis;
}

export async function cacheGetJson<T>(key: string): Promise<T | null> {
  const client = getRedis();

  if (!client) {
    return null;
  }

  const value = await client.get(key);
  return value ? (JSON.parse(value) as T) : null;
}

export async function cacheSetJson(key: string, value: unknown, ttlSeconds: number) {
  const client = getRedis();

  if (!client) {
    return;
  }

  await client.set(key, JSON.stringify(value), "EX", ttlSeconds);
}

