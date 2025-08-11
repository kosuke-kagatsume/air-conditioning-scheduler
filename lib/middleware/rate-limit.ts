import { NextRequest, NextResponse } from 'next/server'
import { cache, CacheTTL } from '@/lib/cache/redis'

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
  message?: string
}

const rateLimitConfigs: Record<string, RateLimitConfig> = {
  default: {
    maxRequests: 100,
    windowMs: 60000, // 1分
    message: 'Too many requests, please try again later.',
  },
  auth: {
    maxRequests: 5,
    windowMs: 300000, // 5分
    message: 'Too many authentication attempts.',
  },
  api: {
    maxRequests: 50,
    windowMs: 60000, // 1分
    message: 'API rate limit exceeded.',
  },
  peakHours: {
    maxRequests: 200, // 朝のピーク時は緩和
    windowMs: 60000,
    message: 'System is busy, please try again.',
  },
}

export class RateLimiter {
  private config: RateLimitConfig

  constructor(configName: string = 'default') {
    this.config = rateLimitConfigs[configName] || rateLimitConfigs.default
  }

  async check(identifier: string): Promise<{ allowed: boolean; remaining: number }> {
    const key = `rate_limit:${identifier}`
    const now = Date.now()
    const windowStart = now - this.config.windowMs

    // 現在の時間枠でのリクエスト履歴を取得
    const requests = await cache.get<number[]>(key) || []
    
    // 古いリクエストを削除
    const validRequests = requests.filter(timestamp => timestamp > windowStart)
    
    // 新しいリクエストを追加
    if (validRequests.length < this.config.maxRequests) {
      validRequests.push(now)
      await cache.set(key, validRequests, Math.ceil(this.config.windowMs / 1000))
      
      return {
        allowed: true,
        remaining: this.config.maxRequests - validRequests.length,
      }
    }

    return {
      allowed: false,
      remaining: 0,
    }
  }

  // ピーク時間の判定（朝6:00-9:00）
  static isPeakHour(): boolean {
    const hour = new Date().getHours()
    return hour >= 6 && hour <= 9
  }

  // IPアドレスまたはユーザーIDからidentifierを生成
  static getIdentifier(req: NextRequest): string {
    const forwarded = req.headers.get('x-forwarded-for')
    const ip = forwarded ? forwarded.split(',')[0] : 'unknown'
    const userId = req.headers.get('x-user-id') || ''
    
    return userId || ip
  }
}

// ミドルウェア用のヘルパー関数
export async function rateLimitMiddleware(
  req: NextRequest,
  configName?: string
): Promise<NextResponse | null> {
  // ピーク時間の場合は専用の設定を使用
  const config = RateLimiter.isPeakHour() ? 'peakHours' : (configName || 'api')
  const limiter = new RateLimiter(config)
  const identifier = RateLimiter.getIdentifier(req)
  
  const { allowed, remaining } = await limiter.check(identifier)
  
  if (!allowed) {
    return NextResponse.json(
      { error: rateLimitConfigs[config].message },
      { 
        status: 429,
        headers: {
          'X-RateLimit-Limit': String(rateLimitConfigs[config].maxRequests),
          'X-RateLimit-Remaining': String(remaining),
          'X-RateLimit-Reset': String(Date.now() + rateLimitConfigs[config].windowMs),
        }
      }
    )
  }

  return null
}