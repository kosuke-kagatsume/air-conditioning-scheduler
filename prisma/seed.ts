import { PrismaClient } from '@prisma/client'
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

  // 管理者ユーザー作成
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      email: 'admin@dandori.jp',
      password: adminPassword,
      name: '管理者',
      role: 'ADMIN',
      phone: '090-1111-1111',
      companyId: company.id,
    },
  })

  console.log('✅ Admin user created')

  // 親方作成
  const masterPassword = await bcrypt.hash('master123', 10)
  const master = await prisma.user.create({
    data: {
      email: 'master@dandori.jp',
      password: masterPassword,
      name: '山田太郎',
      role: 'MASTER_WORKER',
      phone: '090-2222-2222',
      companyId: company.id,
      workerProfile: {
        create: {
          maxDailySlots: 5,
          workAreas: ['東京都', '神奈川県', '埼玉県'],
          availableMorning: true,
          availableNight: true,
          availableWeekend: true,
          availableHoliday: false,
          rating: 4.8,
          completedJobs: 156,
          hasLiabilityInsurance: true,
          hasAccidentInsurance: true,
          certifications: ['第二種電気工事士', '冷媒取扱技術者', 'フルハーネス特別教育'],
        },
      },
    },
  })

  console.log('✅ Master worker created')

  // 職人作成
  const workerPassword = await bcrypt.hash('worker123', 10)
  const workers = await Promise.all([
    prisma.user.create({
      data: {
        email: 'takahashi@dandori.jp',
        password: workerPassword,
        name: '高橋次郎',
        role: 'WORKER',
        phone: '090-3333-3333',
        companyId: company.id,
        workerProfile: {
          create: {
            maxDailySlots: 3,
            workAreas: ['東京都', '神奈川県'],
            availableMorning: true,
            availableNight: false,
            availableWeekend: true,
            availableHoliday: false,
            rating: 4.5,
            completedJobs: 89,
            hasLiabilityInsurance: true,
            hasAccidentInsurance: true,
            certifications: ['第二種電気工事士', '高所作業車運転'],
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        email: 'sato@dandori.jp',
        password: workerPassword,
        name: '佐藤健一',
        role: 'WORKER',
        phone: '090-4444-4444',
        companyId: company.id,
        workerProfile: {
          create: {
            maxDailySlots: 4,
            workAreas: ['東京都', '埼玉県', '千葉県'],
            availableMorning: false,
            availableNight: true,
            availableWeekend: false,
            availableHoliday: false,
            rating: 4.3,
            completedJobs: 67,
            hasLiabilityInsurance: true,
            hasAccidentInsurance: true,
            certifications: ['第一種電気工事士', 'ガス溶接技能'],
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
        city: '渋谷区',
        prefecture: '東京都',
        postalCode: '150-0043',
        clientName: '株式会社ABC',
        clientPhone: '03-5555-1111',
        companyId: company.id,
      },
    }),
    prisma.site.create({
      data: {
        name: '新宿マンション',
        address: '東京都新宿区西新宿3-20-2',
        city: '新宿区',
        prefecture: '東京都',
        postalCode: '160-0023',
        clientName: '新宿不動産',
        clientPhone: '03-5555-2222',
        companyId: company.id,
      },
    }),
    prisma.site.create({
      data: {
        name: '品川商業施設',
        address: '東京都港区港南2-15-3',
        city: '港区',
        prefecture: '東京都',
        postalCode: '108-0075',
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
        date: new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000),
        startTime: '09:00',
        endTime: '11:00',
        status: 'ACCEPTED',
        constructionType: 'メンテナンス',
        siteId: sites[0].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: workers[0].id,
        estimatedHours: 2,
      },
    }),
    prisma.event.create({
      data: {
        title: '新規エアコン設置工事',
        description: '3台のエアコン設置',
        date: new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000),
        startTime: '10:00',
        endTime: '17:00',
        status: 'PROPOSED',
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
        date: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000),
        startTime: '13:00',
        endTime: '16:00',
        status: 'ACCEPTED',
        constructionType: '修理',
        siteId: sites[2].id,
        companyId: company.id,
        managerId: admin.id,
        workerId: master.id,
        estimatedHours: 3,
      },
    }),
  ])

  console.log('✅ Events created')

  // 在庫アイテム作成
  const inventoryItems = await Promise.all([
    prisma.inventory.create({
      data: {
        name: 'R32冷媒',
        category: '冷媒',
        model: 'R32-10kg',
        manufacturer: 'ダイキン',
        quantity: 15,
        minQuantity: 5,
        unit: '本',
        location: '倉庫A-1',
        purchasePrice: 8000,
        sellingPrice: 12000,
      },
    }),
    prisma.inventory.create({
      data: {
        name: '冷媒配管 2分3分',
        category: '配管材',
        model: 'PC-2330',
        manufacturer: '因幡電工',
        quantity: 50,
        minQuantity: 20,
        unit: 'm',
        location: '倉庫A-2',
        purchasePrice: 800,
        sellingPrice: 1200,
      },
    }),
    prisma.inventory.create({
      data: {
        name: 'ドレンホース',
        category: '配管材',
        model: 'DH-14',
        manufacturer: '因幡電工',
        quantity: 100,
        minQuantity: 30,
        unit: 'm',
        location: '倉庫A-3',
        purchasePrice: 150,
        sellingPrice: 250,
      },
    }),
  ])

  console.log('✅ Inventory items created')

  console.log('✅ Database seeding completed!')
  console.log('\n📝 Login credentials:')
  console.log('Admin: admin@dandori.jp / admin123')
  console.log('Master: master@dandori.jp / master123')
  console.log('Worker: takahashi@dandori.jp / worker123')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })