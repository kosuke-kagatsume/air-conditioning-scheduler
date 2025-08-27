import { PrismaClient, UserRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // 会社作成
  const company = await prisma.company.create({
    data: {
      name: '株式会社ダンドリワーク',
      address: '東京都渋谷区渋谷1-1-1',
      phone: '03-1234-5678',
      email: 'info@dandori-work.jp',
    },
  })

  console.log('✅ Company created')

  // スーパー管理者ユーザー作成
  const superadminPassword = await bcrypt.hash('dw_admin2025', 10)
  const superadmin = await prisma.user.create({
    data: {
      email: 'superadmin@dandori.com',
      password: superadminPassword,
      name: 'DW 管理者',
      role: UserRole.SUPERADMIN,
      phone: '03-0000-0000',
      // スーパー管理者は会社に所属しない
    },
  })

  console.log('✅ Superadmin user created')

  // 管理者ユーザー作成（デモアカウント）
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@demo.com',
      password: adminPassword,
      name: '山田 太郎',
      role: UserRole.ADMIN,
      phone: '090-1111-1111',
      companyId: company.id,
    },
  })

  console.log('✅ Admin user created')

  // 職人作成（デモアカウント - 鈴木一郎）
  const workerPassword = await bcrypt.hash('worker123', 10)
  const worker1 = await prisma.user.create({
    data: {
      email: 'worker1@demo.com',
      password: workerPassword,
      name: '鈴木 一郎',
      role: UserRole.WORKER,
      phone: '090-2222-2222',
      companyId: company.id,
      workerProfile: {
        create: {
          maxDailySlots: 5,
          workAreas: JSON.stringify(['東京都', '神奈川県', '埼玉県']),
          availableMorning: true,
          availableNight: true,
          availableWeekend: true,
          availableHoliday: false,
          rating: 4.8,
          completedJobs: 156,
          hasLiabilityInsurance: true,
          hasAccidentInsurance: true,
          certifications: JSON.stringify(['第二種電気工事士', '冷媒取扱技術者', 'フルハーネス特別教育']),
        },
      },
    },
  })

  console.log('✅ Demo worker (Suzuki) created')

  // 追加の職人作成
  const workers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'takahashi@dandori.jp',
        password: workerPassword,
        name: '高橋次郎',
        role: UserRole.WORKER,
        phone: '090-3333-3333',
        companyId: company.id,
        workerProfile: {
          create: {
            maxDailySlots: 3,
            workAreas: JSON.stringify(['東京都', '神奈川県']),
            availableMorning: true,
            availableNight: false,
            availableWeekend: true,
            availableHoliday: false,
            rating: 4.5,
            completedJobs: 89,
            hasLiabilityInsurance: true,
            hasAccidentInsurance: true,
            certifications: JSON.stringify(['第二種電気工事士', '高所作業車運転']),
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sato@dandori.jp',
        password: workerPassword,
        name: '佐藤健一',
        role: UserRole.WORKER,
        phone: '090-4444-4444',
        companyId: company.id,
        workerProfile: {
          create: {
            maxDailySlots: 4,
            workAreas: JSON.stringify(['東京都', '埼玉県', '千葉県']),
            availableMorning: false,
            availableNight: true,
            availableWeekend: false,
            availableHoliday: false,
            rating: 4.3,
            completedJobs: 67,
            hasLiabilityInsurance: true,
            hasAccidentInsurance: true,
            certifications: JSON.stringify(['第一種電気工事士', 'ガス溶接技能']),
          },
        },
      },
    }),
  ])

  console.log('✅ Workers created')

  // スキル作成
  const skills = await Promise.all([
    prisma.skill.create({
      data: {
        name: 'エアコン設置',
        category: '空調',
        level: 'ADVANCED',
      },
    }),
    prisma.skill.create({
      data: {
        name: '配管工事',
        category: '空調',
        level: 'INTERMEDIATE',
      },
    }),
    prisma.skill.create({
      data: {
        name: '電気工事',
        category: '電気',
        level: 'EXPERT',
      },
    }),
  ])

  console.log('✅ Skills created')

  // 現場作成
  const sites = await Promise.all([
    prisma.site.create({
      data: {
        name: '渋谷オフィスビル',
        address: '東京都渋谷区道玄坂2-10-7',
        clientName: '株式会社ABC',
        clientPhone: '03-5555-1111',
        companyId: company.id,
      },
    }),
    prisma.site.create({
      data: {
        name: '新宿マンション',
        address: '東京都新宿区西新宿3-20-2',
        clientName: '新宿不動産',
        clientPhone: '03-5555-2222',
        companyId: company.id,
      },
    }),
    prisma.site.create({
      data: {
        name: '品川商業施設',
        address: '東京都港区港南2-15-3',
        clientName: '品川デベロップメント',
        clientPhone: '03-5555-3333',
        companyId: company.id,
      },
    }),
  ])

  console.log('✅ Sites created')

  // イベント（予定）作成
  const today = new Date()
  const events = await Promise.all([
    prisma.event.create({
      data: {
        title: 'エアコン定期メンテナンス',
        description: '年次メンテナンス作業',
        startDate: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        endDate: null,
        isMultiDay: false,
        startTime: '09:00',
        endTime: '11:00',
        status: 'SCHEDULED',
        constructionType: 'メンテナンス',
        siteId: sites[0].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: worker1.id,
        estimatedHours: 2,
      },
    }),
    prisma.event.create({
      data: {
        title: '新規エアコン設置工事',
        description: '3台のエアコン設置',
        startDate: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        endDate: null,
        isMultiDay: false,
        startTime: '10:00',
        endTime: '17:00',
        status: 'SCHEDULED',
        constructionType: '新規設置',
        siteId: sites[1].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: workers[1].id,
        estimatedHours: 7,
      },
    }),
    prisma.event.create({
      data: {
        title: '配管修理作業',
        description: '冷媒配管の修理',
        startDate: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        endDate: null,
        isMultiDay: false,
        startTime: '13:00',
        endTime: '16:00',
        status: 'SCHEDULED',
        constructionType: '修理',
        siteId: sites[2].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: workers[0].id,
        estimatedHours: 3,
      },
    }),
    // 複数日イベントのサンプル
    prisma.event.create({
      data: {
        title: '◆大型商業施設 空調システム全面改修工事',
        description: '商業ビルの空調システムを完全に更新する大規模工事',
        startDate: new Date(today.getTime() + 10 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000),
        isMultiDay: true,
        startTime: '08:00',
        endTime: '18:00',
        status: 'SCHEDULED',
        constructionType: '大規模改修',
        siteId: sites[0].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: workers[0].id,
        estimatedHours: 40,
      },
    }),
    prisma.event.create({
      data: {
        title: '◆工場空調設備新設プロジェクト',
        description: '新工場の空調設備完全設置',
        startDate: new Date(today.getTime() + 17 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 21 * 24 * 60 * 60 * 1000),
        isMultiDay: true,
        startTime: '07:00',
        endTime: '17:00',
        status: 'SCHEDULED',
        constructionType: '新規設置',
        siteId: sites[1].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: workers[1].id,
        estimatedHours: 50,
      },
    }),
    prisma.event.create({
      data: {
        title: '◆オフィスビル全館空調点検',
        description: '25階建てビルの全館空調システム点検',
        startDate: new Date(today.getTime() + 24 * 24 * 60 * 60 * 1000),
        endDate: new Date(today.getTime() + 26 * 24 * 60 * 60 * 1000),
        isMultiDay: true,
        startTime: '09:00',
        endTime: '16:00',
        status: 'SCHEDULED',
        constructionType: 'メンテナンス',
        siteId: sites[2].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: null,
        estimatedHours: 24,
      },
    }),
  ])

  console.log('✅ Events created')

  // 在庫アイテム作成
  const inventoryItems = await Promise.all([
    prisma.inventoryItem.create({
      data: {
        name: 'R32冷媒',
        category: '冷媒',
        sku: 'R32-10KG',
        description: 'R32冷媒 10kg缶',
        currentStock: 15,
        minimumStock: 5,
        supplier: 'ダイキン',
        unitPrice: 12000,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: '冷媒配管 2分3分',
        category: '配管材',
        sku: 'PC-2330',
        description: '冷媒配管セット 2分3分',
        currentStock: 50,
        minimumStock: 20,
        supplier: '因幡電工',
        unitPrice: 1200,
      },
    }),
    prisma.inventoryItem.create({
      data: {
        name: 'ドレンホース',
        category: '配管材',
        sku: 'DH-14',
        description: 'ドレンホース 14mm',
        currentStock: 100,
        minimumStock: 30,
        supplier: '因幡電工',
        unitPrice: 250,
      },
    }),
  ])

  console.log('✅ Inventory items created')

  console.log('✅ Database seeding completed!')
  console.log('\n📝 Login credentials:')
  console.log('Superadmin: superadmin@dandori.com / dw_admin2025')
  console.log('Admin (Demo): admin@demo.com / admin123')
  console.log('Worker1 (Demo): worker1@demo.com / worker123')
  console.log('Additional workers: takahashi@dandori.jp, sato@dandori.jp / worker123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })