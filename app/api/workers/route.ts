import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { prisma } from "@/lib/prisma"
import { handleApiError, successResponse, validateRequestBody, getPaginationParams } from '@/lib/api-helpers'

export async function GET(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'GET /api/workers',
      attributes: {
        'http.method': 'GET',
        'http.route': '/api/workers',
      },
    },
    async () => {
      try {
        // 職人（WORKER, MASTER_WORKER）のユーザーを取得
        const workers = await prisma.user.findMany({
          where: {
            role: {
              in: ['WORKER', 'MASTER_WORKER']
            }
          },
          include: {
            company: true,
            workerProfile: {
              include: {
                skills: true
              }
            }
          },
          orderBy: {
            name: 'asc'
          }
        })

        return NextResponse.json({
          success: true,
          workers
        })
      } catch (error) {
        console.error('Database error:', error)
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to fetch workers',
          },
          { status: 500 }
        )
      }
    }
  )
}

export async function POST(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'POST /api/workers',
      attributes: {
        'http.method': 'POST',
        'http.route': '/api/workers',
      },
    },
    async () => {
      try {
        const body = await request.json()
        
        // 必須フィールドの検証
        if (!body.name || !body.email) {
          return NextResponse.json(
            { success: false, message: '名前とメールアドレスは必須です' },
            { status: 400 }
          )
        }

        // メールアドレスの重複チェック
        const existingUser = await prisma.user.findUnique({
          where: { email: body.email }
        })

        if (existingUser) {
          return NextResponse.json(
            { success: false, message: 'このメールアドレスは既に使用されています' },
            { status: 400 }
          )
        }

        // bcryptをインポート
        const bcrypt = require('bcryptjs')
        const hashedPassword = await bcrypt.hash(body.password || 'default123', 10)

        // 職人ユーザーを作成（トランザクション使用）
        const worker = await prisma.$transaction(async (tx) => {
          // ユーザーを作成
          const user = await tx.user.create({
            data: {
              name: body.name,
              email: body.email,
              password: hashedPassword,
              phone: body.phone,
              emergencyPhone: body.emergencyPhone,
              role: body.role || 'WORKER',
              companyId: body.companyId || 'company-1', // デフォルト会社ID
            }
          })

          // WorkerProfileを作成
          const workerProfile = await tx.workerProfile.create({
            data: {
              userId: user.id,
              certifications: body.certifications || [],
              workAreas: body.workAreas || [],
              maxDailySlots: body.maxDailySlots || 3,
              availableMorning: body.availableMorning ?? true,
              availableNight: body.availableNight ?? false,
              availableWeekend: body.availableWeekend ?? true,
              availableHoliday: body.availableHoliday ?? false,
              skills: {
                create: (body.skills || []).map((skill: string) => ({
                  name: skill,
                  category: 'GENERAL'
                }))
              }
            },
            include: {
              skills: true
            }
          })

          // 完全なユーザー情報を返す
          return await tx.user.findUnique({
            where: { id: user.id },
            include: {
              company: true,
              workerProfile: {
                include: {
                  skills: true
                }
              }
            }
          })
        })

        return NextResponse.json({
          success: true,
          worker
        })
      } catch (error) {
        console.error('Database error:', error)
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to create worker',
          },
          { status: 500 }
        )
      }
    }
  )
}

export async function PUT(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'PUT /api/workers',
      attributes: {
        'http.method': 'PUT',
        'http.route': '/api/workers',
      },
    },
    async () => {
      try {
        const body = await request.json()
        const { id, skills, certifications, ...workerData } = body

        if (!id) {
          return NextResponse.json(
            { success: false, message: '職人IDが必要です' },
            { status: 400 }
          )
        }

        // 既存の職人を更新（トランザクション使用）
        const worker = await prisma.$transaction(async (tx) => {
          // ユーザー情報を更新
          const user = await tx.user.update({
            where: { id },
            data: {
              name: workerData.name,
              phone: workerData.phone,
              emergencyPhone: workerData.emergencyPhone,
              isActive: workerData.isActive ?? true
            }
          })

          // WorkerProfileが存在する場合は更新
          const workerProfile = await tx.workerProfile.upsert({
            where: { userId: id },
            create: {
              userId: id,
              certifications: certifications || [],
              workAreas: workerData.workAreas || [],
              maxDailySlots: workerData.maxDailySlots || 3,
              availableMorning: workerData.availableMorning ?? true,
              availableNight: workerData.availableNight ?? false,
              availableWeekend: workerData.availableWeekend ?? true,
              availableHoliday: workerData.availableHoliday ?? false,
              skills: {
                create: (skills || []).map((skill: string) => ({
                  name: skill,
                  category: 'GENERAL'
                }))
              }
            },
            update: {
              certifications: certifications || [],
              workAreas: workerData.workAreas || [],
              maxDailySlots: workerData.maxDailySlots,
              availableMorning: workerData.availableMorning,
              availableNight: workerData.availableNight,
              availableWeekend: workerData.availableWeekend,
              availableHoliday: workerData.availableHoliday,
              skills: {
                deleteMany: {},
                create: (skills || []).map((skill: string) => ({
                  name: skill,
                  category: 'GENERAL'
                }))
              }
            }
          })

          // 完全なユーザー情報を返す
          return await tx.user.findUnique({
            where: { id },
            include: {
              company: true,
              workerProfile: {
                include: {
                  skills: true
                }
              }
            }
          })
        })

        return NextResponse.json({
          success: true,
          worker
        })
      } catch (error) {
        console.error('Database error:', error)
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to update worker',
          },
          { status: 500 }
        )
      }
    }
  )
}

export async function DELETE(request: NextRequest) {
  return Sentry.startSpan(
    {
      op: 'http.server',
      name: 'DELETE /api/workers',
      attributes: {
        'http.method': 'DELETE',
        'http.route': '/api/workers',
      },
    },
    async () => {
      try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        if (!id) {
          return NextResponse.json(
            { success: false, message: '職人IDが必要です' },
            { status: 400 }
          )
        }

        // 関連する予定をチェック
        const assignedEvents = await prisma.event.findMany({
          where: { workerId: id }
        })

        if (assignedEvents.length > 0) {
          return NextResponse.json(
            { 
              success: false, 
              message: 'この職人にはスケジュールが割り当てられているため削除できません。まずスケジュールの割り当てを解除してください。' 
            },
            { status: 400 }
          )
        }

        // 職人ユーザーを削除（WorkerProfileは自動的にカスケード削除される）
        await prisma.user.delete({
          where: { id }
        })

        return NextResponse.json({
          success: true,
          message: '職人が削除されました'
        })
      } catch (error) {
        console.error('Database error:', error)
        Sentry.captureException(error)
        return NextResponse.json(
          {
            success: false,
            message: 'Failed to delete worker',
          },
          { status: 500 }
        )
      }
    }
  )
}