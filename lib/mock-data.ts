// 共有モックデータ（実際はPrismaを使用）
export const mockEvents: Record<string, any> = {
  '1': {
    id: '1',
    title: 'オフィスビルA 空調設置',
    date: '2025-08-14',
    startTime: '09:00',
    endTime: '12:00',
    siteId: '1',
    workerId: 'worker-1',
    status: 'CONFIRMED',
  },
  '2': {
    id: '2',
    title: 'マンションB メンテナンス',
    date: '2025-08-15',
    startTime: '14:00',
    endTime: '17:00',
    siteId: '2',
    workerId: 'worker-2',
    status: 'PROPOSED',
  },
  '3': {
    id: '3',
    title: '工場C 定期点検',
    date: '2025-08-14',
    startTime: '10:00',
    endTime: '15:00',
    siteId: '3',
    workerId: 'worker-1',
    status: 'CONFIRMED',
  },
  '4': {
    id: '4',
    title: '店舗D 新規設置',
    date: '2025-08-14',
    startTime: '13:00',
    endTime: '16:00',
    siteId: '4',
    workerId: null, // 未割当
    status: 'PROPOSED',
  },
}

// モックユーザー情報
export const mockUsers: Record<string, any> = {
  'user-1': {
    id: 'user-1',
    name: '山田太郎',
    tenantId: 'tenant-1',
    role: 'ADMIN',
  },
  'worker-1': {
    id: 'worker-1',
    name: '職人太郎',
    tenantId: 'tenant-1',
    role: 'WORKER',
  },
  'worker-2': {
    id: 'worker-2',
    name: '職人次郎',
    tenantId: 'tenant-1',
    role: 'WORKER',
  },
}