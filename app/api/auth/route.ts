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
      // デモログイン用（データベース検索、フォールバック付き）
      try {
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

        if (user) {
          // パスワードを除外してユーザー情報を返す
          const { password: _, ...userWithoutPassword } = user
          return NextResponse.json({
            success: true,
            user: userWithoutPassword,
            token: 'demo-token-' + user.id
          })
        }
      } catch (dbError) {
        console.log('Database connection failed, using fallback data:', dbError)
      }

      // フォールバック：モックデータを使用
      const mockUsers: { [key: string]: any } = {
        'superadmin@dandori.com': {
          id: '0',
          email: 'superadmin@dandori.com',
          name: 'DW 管理者',
          role: 'SUPERADMIN',
          phone: '03-0000-0000',
          isActive: true,
          company: null,
          workerProfile: null
        },
        'admin@demo.com': {
          id: '1',
          email: 'admin@demo.com',
          name: '山田 太郎',
          role: 'ADMIN',
          phone: '090-1111-1111',
          isActive: true,
          company: { id: '1', name: '株式会社ダンドリワーク' },
          workerProfile: null
        },
        'worker1@demo.com': {
          id: '2',
          email: 'worker1@demo.com',
          name: '鈴木 一郎',
          role: 'WORKER',
          phone: '090-2222-2222',
          isActive: true,
          company: { id: '1', name: '株式会社ダンドリワーク' },
          workerProfile: {
            id: '1',
            skills: ['エアコン設置', '配管工事'],
            certifications: ['第二種電気工事士', '冷媒取扱技術者'],
            workAreas: ['東京都', '神奈川県', '埼玉県'],
            rating: 4.8
          }
        }
      }

      const mockUser = mockUsers[email]
      if (mockUser) {
        return NextResponse.json({
          success: true,
          user: mockUser,
          token: 'demo-token-' + mockUser.id
        })
      }

      return NextResponse.json({
        success: false,
        message: 'デモユーザーが見つかりません'
      }, { status: 401 })
    }

    return NextResponse.json({
      success: false,
      message: 'Invalid action'
    }, { status: 400 })

  } catch (error) {
    console.error('Auth API Error:', error)
    return NextResponse.json({
      success: false,
      message: 'サーバーエラーが発生しました: ' + (error instanceof Error ? error.message : String(error))
    }, { status: 500 })
  }
}