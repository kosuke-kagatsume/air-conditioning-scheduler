import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

const otpStore = new Map<string, { otp: string; expires: number }>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, email, password } = body

    if (action === 'login') {
      // データベースからユーザーを検索
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          company: true,
          workerProfile: {
            include: {
              skills: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'ユーザーが見つかりません'
        }, { status: 401 })
      }

      // パスワードを検証
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (!isValidPassword) {
        return NextResponse.json({
          success: false,
          message: 'パスワードが正しくありません'
        }, { status: 401 })
      }

      // パスワードを除外してユーザー情報を返す
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token: 'demo-token-' + user.id // デモ用トークン
      })
    }

    if (action === 'demo-login') {
      // デモログイン用（パスワードチェックなし）
      const user = await prisma.user.findUnique({
        where: { email },
        include: {
          company: true,
          workerProfile: {
            include: {
              skills: true
            }
          }
        }
      })

      if (!user) {
        return NextResponse.json({
          success: false,
          message: 'デモユーザーが見つかりません'
        }, { status: 401 })
      }

      // パスワードを除外してユーザー情報を返す
      const { password: _, ...userWithoutPassword } = user

      return NextResponse.json({
        success: true,
        user: userWithoutPassword,
        token: 'demo-token-' + user.id
      })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Auth API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'サーバーエラーが発生しました'
    }, { status: 500 })
  }
}