import { NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'

// エラーレスポンスの型定義
export interface ApiError {
  success: false
  message: string
  error?: string
  details?: any
}

// 成功レスポンスの型定義
export interface ApiSuccess<T = any> {
  success: true
  data?: T
  message?: string
}

// エラーハンドリング関数
export function handleApiError(error: unknown, message = 'エラーが発生しました'): NextResponse {
  console.error('API Error:', error)
  
  // Sentryにエラーを送信
  Sentry.captureException(error)
  
  // エラーの種類に応じて適切なレスポンスを返す
  if (error instanceof Error) {
    // Prismaのエラー処理
    if (error.message.includes('P2002')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          message: '既に登録されているデータです',
          error: 'DUPLICATE_ENTRY'
        },
        { status: 400 }
      )
    }
    
    if (error.message.includes('P2025')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          message: 'データが見つかりません',
          error: 'NOT_FOUND'
        },
        { status: 404 }
      )
    }
    
    // バリデーションエラー
    if (error.message.includes('validation') || error.message.includes('required')) {
      return NextResponse.json<ApiError>(
        {
          success: false,
          message: error.message,
          error: 'VALIDATION_ERROR'
        },
        { status: 400 }
      )
    }
    
    // その他のエラー
    return NextResponse.json<ApiError>(
      {
        success: false,
        message: process.env.NODE_ENV === 'development' ? error.message : message,
        error: 'INTERNAL_ERROR'
      },
      { status: 500 }
    )
  }
  
  // 予期しないエラー
  return NextResponse.json<ApiError>(
    {
      success: false,
      message,
      error: 'UNKNOWN_ERROR'
    },
    { status: 500 }
  )
}

// 成功レスポンスヘルパー
export function successResponse<T = any>(
  data?: T,
  message?: string,
  status = 200
): NextResponse {
  return NextResponse.json<ApiSuccess<T>>(
    {
      success: true,
      data,
      message
    },
    { status }
  )
}

// 認証チェックヘルパー
export async function checkAuth(request: Request) {
  // NextAuth.jsのセッションチェック
  // TODO: NextAuth実装後に追加
  return true
}

// リクエストボディのバリデーション
export async function validateRequestBody<T>(
  request: Request,
  requiredFields: string[]
): Promise<T> {
  let body: any
  
  try {
    body = await request.json()
  } catch (error) {
    throw new Error('リクエストボディが不正です')
  }
  
  // 必須フィールドのチェック
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`${field}は必須項目です`)
    }
  }
  
  return body as T
}

// ページネーション用ヘルパー
export interface PaginationParams {
  page: number
  limit: number
  skip: number
}

export function getPaginationParams(searchParams: URLSearchParams): PaginationParams {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '20')))
  const skip = (page - 1) * limit
  
  return { page, limit, skip }
}

// 日付範囲のヘルパー
export interface DateRangeParams {
  from: Date
  to: Date
}

export function getDateRangeParams(searchParams: URLSearchParams): DateRangeParams {
  const from = searchParams.get('from')
  const to = searchParams.get('to')
  
  const now = new Date()
  const defaultFrom = new Date(now.getFullYear(), now.getMonth(), 1)
  const defaultTo = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  
  return {
    from: from ? new Date(from) : defaultFrom,
    to: to ? new Date(to) : defaultTo
  }
}

// APIレート制限（簡易版）
const rateLimitMap = new Map<string, number[]>()

export function checkRateLimit(
  identifier: string,
  maxRequests = 100,
  windowMs = 60000
): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(identifier) || []
  
  // 古いタイムスタンプを削除
  const validTimestamps = timestamps.filter(t => now - t < windowMs)
  
  if (validTimestamps.length >= maxRequests) {
    return false
  }
  
  validTimestamps.push(now)
  rateLimitMap.set(identifier, validTimestamps)
  
  return true
}