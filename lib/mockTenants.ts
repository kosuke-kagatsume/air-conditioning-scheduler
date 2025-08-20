import { Tenant, TenantUser, TenantStats } from '@/types/tenant'

export const mockTenants: Tenant[] = [
  {
    id: 'tenant-1',
    name: 'yamada-kensetsu',
    companyName: '山田建設株式会社',
    address: '東京都新宿区西新宿1-1-1',
    phone: '03-1234-5678',
    email: 'admin@yamada-kensetsu.co.jp',
    logo: '/logos/yamada.png',
    primaryColor: '#1e40af',
    secondaryColor: '#3b82f6',
    plan: 'pro',
    status: 'active',
    userCount: 28,
    userLimit: 50,
    monthlyFee: 30000,
    lastLoginAt: new Date('2024-01-20T10:30:00'),
    createdAt: new Date('2023-06-15'),
    updatedAt: new Date('2024-01-20'),
    settings: {
      allowFileUpload: true,
      maxStorageGB: 100,
    }
  },
  {
    id: 'tenant-2',
    name: 'tanaka-koumuten',
    companyName: '田中工務店',
    address: '大阪府大阪市北区梅田2-2-2',
    phone: '06-9876-5432',
    email: 'info@tanaka-koumuten.jp',
    plan: 'basic',
    status: 'active',
    userCount: 8,
    userLimit: 10,
    monthlyFee: 10000,
    lastLoginAt: new Date('2024-01-19T15:45:00'),
    createdAt: new Date('2023-09-01'),
    updatedAt: new Date('2024-01-19'),
    settings: {
      allowFileUpload: true,
      maxStorageGB: 20,
    }
  },
  {
    id: 'tenant-3',
    name: 'sato-setsubi',
    companyName: '佐藤設備工業',
    address: '愛知県名古屋市中区栄3-3-3',
    phone: '052-1111-2222',
    email: 'contact@sato-setsubi.com',
    plan: 'free',
    status: 'trial',
    userCount: 2,
    userLimit: 3,
    monthlyFee: 0,
    lastLoginAt: new Date('2024-01-18T09:15:00'),
    trialEndsAt: new Date('2024-02-01'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-18'),
    settings: {
      allowFileUpload: false,
      maxStorageGB: 5,
    }
  },
  {
    id: 'tenant-4',
    name: 'suzuki-denki',
    companyName: '鈴木電気工事株式会社',
    address: '福岡県福岡市博多区博多駅前4-4-4',
    phone: '092-3333-4444',
    email: 'admin@suzuki-denki.co.jp',
    primaryColor: '#059669',
    plan: 'pro',
    status: 'active',
    userCount: 35,
    userLimit: 50,
    monthlyFee: 30000,
    lastLoginAt: new Date('2024-01-20T14:20:00'),
    createdAt: new Date('2023-03-10'),
    updatedAt: new Date('2024-01-20'),
    settings: {
      allowFileUpload: true,
      maxStorageGB: 100,
    }
  },
  {
    id: 'tenant-5',
    name: 'ito-kougyou',
    companyName: '伊藤工業',
    address: '北海道札幌市中央区大通5-5-5',
    phone: '011-5555-6666',
    email: 'info@ito-kougyou.jp',
    plan: 'basic',
    status: 'suspended',
    userCount: 12,
    userLimit: 10,
    monthlyFee: 10000,
    lastLoginAt: new Date('2024-01-10T11:30:00'),
    createdAt: new Date('2023-11-20'),
    updatedAt: new Date('2024-01-10'),
    settings: {
      allowFileUpload: true,
      maxStorageGB: 20,
    }
  },
  {
    id: 'tenant-6',
    name: 'watanabe-home',
    companyName: 'ワタナベホーム株式会社',
    address: '神奈川県横浜市西区みなとみらい6-6-6',
    phone: '045-7777-8888',
    email: 'support@watanabe-home.com',
    logo: '/logos/watanabe.png',
    primaryColor: '#dc2626',
    plan: 'enterprise',
    status: 'active',
    userCount: 120,
    userLimit: -1, // 無制限
    monthlyFee: 100000,
    lastLoginAt: new Date('2024-01-20T16:00:00'),
    createdAt: new Date('2022-12-01'),
    updatedAt: new Date('2024-01-20'),
    settings: {
      allowFileUpload: true,
      maxStorageGB: 500,
      customFields: [
        { name: '工事番号', type: 'text' },
        { name: '優先度', type: 'select', options: ['高', '中', '低'] }
      ]
    }
  }
]

export const mockTenantStats: TenantStats = {
  totalTenants: 6,
  activeTenants: 4,
  trialTenants: 1,
  totalRevenue: 180000,
  averageUsersPerTenant: 35,
  growthRate: 15.5
}

export const mockTenantUsers: Record<string, TenantUser[]> = {
  'tenant-1': [
    {
      id: 'user-t1-1',
      tenantId: 'tenant-1',
      email: 'admin@yamada-kensetsu.co.jp',
      name: '山田太郎',
      role: 'admin',
      isActive: true,
      lastLoginAt: new Date('2024-01-20T10:30:00'),
      createdAt: new Date('2023-06-15')
    },
    {
      id: 'user-t1-2',
      tenantId: 'tenant-1',
      email: 'manager1@yamada-kensetsu.co.jp',
      name: '佐藤花子',
      role: 'manager',
      isActive: true,
      lastLoginAt: new Date('2024-01-19T14:20:00'),
      createdAt: new Date('2023-06-20')
    },
    {
      id: 'user-t1-3',
      tenantId: 'tenant-1',
      email: 'staff1@yamada-kensetsu.co.jp',
      name: '鈴木一郎',
      role: 'staff',
      isActive: true,
      lastLoginAt: new Date('2024-01-18T09:15:00'),
      createdAt: new Date('2023-07-01')
    }
  ],
  'tenant-2': [
    {
      id: 'user-t2-1',
      tenantId: 'tenant-2',
      email: 'admin@tanaka-koumuten.jp',
      name: '田中次郎',
      role: 'admin',
      isActive: true,
      lastLoginAt: new Date('2024-01-19T15:45:00'),
      createdAt: new Date('2023-09-01')
    },
    {
      id: 'user-t2-2',
      tenantId: 'tenant-2',
      email: 'manager@tanaka-koumuten.jp',
      name: '高橋美咲',
      role: 'manager',
      isActive: true,
      lastLoginAt: new Date('2024-01-18T11:30:00'),
      createdAt: new Date('2023-09-05')
    }
  ]
}

// プラン情報
export const tenantPlans = {
  free: {
    name: '無料プラン',
    price: 0,
    userLimit: 3,
    features: ['基本カレンダー機能', 'モバイル対応'],
    storage: 5
  },
  basic: {
    name: 'ベーシック',
    price: 10000,
    userLimit: 10,
    features: ['全機能', 'ファイルアップロード', 'メール通知'],
    storage: 20
  },
  pro: {
    name: 'プロ',
    price: 30000,
    userLimit: 50,
    features: ['全機能', 'API連携', '優先サポート', 'カスタムフィールド'],
    storage: 100
  },
  enterprise: {
    name: 'エンタープライズ',
    price: 100000,
    userLimit: -1,
    features: ['全機能', '専用サポート', 'カスタマイズ対応', 'SLA保証'],
    storage: 500
  }
}