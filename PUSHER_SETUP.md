# Pusher設定手順

## 1. Pusherアカウント作成
- https://pusher.com にアクセス
- Sign upでアカウント作成

## 2. アプリ作成
- Dashboard → Create app
- App name: `dandori-scheduler`
- Cluster: **Asia Pacific (Tokyo) - ap3**
- Tech stack: Node.js/React

## 3. API Keys取得
App Keysタブで確認：
- app_id: [取得した値]
- key: [取得した値] 
- secret: [取得した値]
- cluster: ap3

## 4. Vercel環境変数更新

```bash
# CLIで更新
npx vercel env rm PUSHER_APP_ID production
npx vercel env rm NEXT_PUBLIC_PUSHER_KEY production
npx vercel env rm PUSHER_SECRET production

# 新しい値を設定
echo "[実際のapp_id]" | npx vercel env add PUSHER_APP_ID production
echo "[実際のkey]" | npx vercel env add NEXT_PUBLIC_PUSHER_KEY production
echo "[実際のsecret]" | npx vercel env add PUSHER_SECRET production
```

## 5. 機能確認
- リアルタイム通知
- チャット機能
- ステータス同期
- スケジュール変更通知

## 6. 使用例
```typescript
// クライアント側
import Pusher from 'pusher-js'

const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY!, {
  cluster: 'ap3'
})

const channel = pusher.subscribe('schedule-updates')
channel.bind('new-assignment', (data) => {
  console.log('新しい割り当て:', data)
})

// サーバー側
import Pusher from 'pusher'

const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.NEXT_PUBLIC_PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: 'ap3'
})

await pusher.trigger('schedule-updates', 'new-assignment', {
  workerId: 'worker-123',
  eventId: 'event-456',
  message: '新しい作業が割り当てられました'
})
```