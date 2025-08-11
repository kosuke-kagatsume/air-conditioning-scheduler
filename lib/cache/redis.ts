import { Redis } from '@upstash/redis'
import { LRUCache } from 'lru-cache'

// Upstash Redis クライアント（本番環境用）
const upstashRedis = process.env.UPSTASH_REDIS_REST_URL
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null

// ローカル開発用のLRUキャッシュ
const localCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5分
})

// TTL戦略
export const CacheTTL = {
  SHORT: 60,        // 1分
  MEDIUM: 300,      // 5分
  LONG: 3600,       // 1時間
  DAY: 86400,       // 24時間
} as const

export class CacheManager {
  private static instance: CacheManager
  
  static getInstance(): CacheManager {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager()
    }
    return CacheManager.instance
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      if (upstashRedis) {
        const data = await upstashRedis.get(key)
        return data as T
      } else {
        return localCache.get(key) as T | undefined || null
      }
    } catch (error) {
      console.error(`Cache get error for key ${key}:`, error)
      return null
    }
  }

  async set(key: string, value: any, ttl: number = CacheTTL.MEDIUM): Promise<void> {
    try {
      if (upstashRedis) {
        await upstashRedis.set(key, value, { ex: ttl })
      } else {
        localCache.set(key, value, { ttl: ttl * 1000 })
      }
    } catch (error) {
      console.error(`Cache set error for key ${key}:`, error)
    }
  }

  async delete(key: string): Promise<void> {
    try {
      if (upstashRedis) {
        await upstashRedis.del(key)
      } else {
        localCache.delete(key)
      }
    } catch (error) {
      console.error(`Cache delete error for key ${key}:`, error)
    }
  }

  async invalidatePattern(pattern: string): Promise<void> {
    try {
      if (upstashRedis) {
        const keys = await upstashRedis.keys(pattern)
        if (keys.length > 0) {
          await upstashRedis.del(...keys)
        }
      } else {
        // ローカルキャッシュの場合、パターンマッチング
        const keys = Array.from(localCache.keys()).filter(
          key => new RegExp(pattern.replace('*', '.*')).test(key)
        )
        keys.forEach(key => localCache.delete(key))
      }
    } catch (error) {
      console.error(`Cache invalidation error for pattern ${pattern}:`, error)
    }
  }

  // キャッシュアサイドパターンの実装
  async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttl: number = CacheTTL.MEDIUM
  ): Promise<T> {
    const cached = await this.get<T>(key)
    if (cached !== null) {
      return cached
    }

    const fresh = await fetcher()
    await this.set(key, fresh, ttl)
    return fresh
  }
}

export const cache = CacheManager.getInstance()