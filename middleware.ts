import { NextRequest, NextResponse } from 'next/server'
import { rateLimitMiddleware } from '@/lib/middleware/rate-limit'

export async function middleware(req: NextRequest) {
  // APIルートの場合のみレート制限を適用
  if (req.nextUrl.pathname.startsWith('/api/')) {
    // 認証エンドポイントは特別扱い
    if (req.nextUrl.pathname.startsWith('/api/auth/')) {
      const rateLimitResponse = await rateLimitMiddleware(req, 'auth')
      if (rateLimitResponse) return rateLimitResponse
    }
    
    // その他のAPIエンドポイント
    const rateLimitResponse = await rateLimitMiddleware(req, 'api')
    if (rateLimitResponse) return rateLimitResponse
  }

  // セキュリティヘッダーの追加
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'SAMEORIGIN')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin')

  return response
}

export const config = {
  matcher: [
    '/api/:path*',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}