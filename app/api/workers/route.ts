import { NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { prisma } from "@/lib/prisma"

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
        const workers = await prisma.worker.findMany({
          include: {
            skills: true,
            certifications: true,
            company: true
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
        const existingWorker = await prisma.worker.findUnique({
          where: { email: body.email }
        })

        if (existingWorker) {
          return NextResponse.json(
            { success: false, message: 'このメールアドレスは既に使用されています' },
            { status: 400 }
          )
        }

        // 職人を作成
        const worker = await prisma.worker.create({
          data: {
            name: body.name,
            email: body.email,
            phone: body.phone,
            emergencyContact: body.emergencyContact,
            emergencyPhone: body.emergencyPhone,
            address: body.address,
            birthDate: body.birthDate ? new Date(body.birthDate) : null,
            hireDate: body.hireDate ? new Date(body.hireDate) : null,
            employmentType: body.employmentType || 'FULL_TIME',
            hourlyRate: body.hourlyRate ? parseFloat(body.hourlyRate) : null,
            notes: body.notes,
            companyId: 'company-1', // デフォルト会社ID
            skills: {
              create: (body.skills || []).map((skill: string) => ({
                name: skill,
                level: 'INTERMEDIATE'
              }))
            },
            certifications: {
              create: (body.certifications || []).map((cert: string) => ({
                name: cert,
                issuedDate: new Date(),
                isValid: true
              }))
            }
          },
          include: {
            skills: true,
            certifications: true,
            company: true
          }
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

        // 既存の職人を更新
        const worker = await prisma.worker.update({
          where: { id },
          data: {
            ...workerData,
            birthDate: workerData.birthDate ? new Date(workerData.birthDate) : null,
            hireDate: workerData.hireDate ? new Date(workerData.hireDate) : null,
            hourlyRate: workerData.hourlyRate ? parseFloat(workerData.hourlyRate) : null,
            skills: {
              deleteMany: {},
              create: (skills || []).map((skill: string) => ({
                name: skill,
                level: 'INTERMEDIATE'
              }))
            },
            certifications: {
              deleteMany: {},
              create: (certifications || []).map((cert: string) => ({
                name: cert,
                issuedDate: new Date(),
                isValid: true
              }))
            }
          },
          include: {
            skills: true,
            certifications: true,
            company: true
          }
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

        // 職人を削除
        await prisma.worker.delete({
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