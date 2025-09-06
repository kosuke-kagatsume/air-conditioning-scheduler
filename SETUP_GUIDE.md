# 🚀 DandoriScheduler サーバーサイド実装ガイド

## 現在の実装状況

### ✅ 完成しているもの
- **UI/UX**: 全画面デザイン完成
- **モバイル対応**: レスポンシブ対応済み
- **APIエンドポイント**: Prismaベースで実装済み
- **エラーハンドリング**: Sentry統合済み

### 🔧 設定が必要なもの

## 1. データベースセットアップ

### Option A: Supabase（推奨・無料）
```bash
# 1. Supabaseでプロジェクト作成
# https://app.supabase.com

# 2. 接続文字列を.env.localに追加
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres?pgbouncer=true&connection_limit=1"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# 3. スキーマをプッシュ
npx prisma db push

# 4. 初期データ投入
npx prisma db seed
```

### Option B: ローカルPostgreSQL
```bash
# 1. PostgreSQLインストール
brew install postgresql
brew services start postgresql

# 2. データベース作成
createdb dandori_scheduler

# 3. 接続文字列を.env.localに追加
DATABASE_URL="postgresql://localhost:5432/dandori_scheduler"

# 4. マイグレーション実行
npx prisma migrate dev
```

## 2. 認証設定（NextAuth）

```bash
# .env.localに追加
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NEXTAUTH_URL=http://localhost:3000

# 本番環境では
NEXTAUTH_URL=https://your-domain.com
```

## 3. APIのテスト

```bash
# 開発サーバー起動
npm run dev

# 別ターミナルでAPIテスト
# 職人一覧取得
curl http://localhost:3000/api/workers

# 職人追加
curl -X POST http://localhost:3000/api/workers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "田中太郎",
    "email": "tanaka@example.com",
    "phone": "090-1234-5678",
    "skills": ["エアコン設置", "配管工事"]
  }'
```

## 4. 本番デプロイ前のチェックリスト

### 環境変数（Vercel）
```
DATABASE_URL=<Supabase接続文字列>
NEXTAUTH_SECRET=<ランダム文字列>
NEXTAUTH_URL=https://your-domain.vercel.app
```

### セキュリティ
- [ ] CORS設定
- [ ] Rate limiting
- [ ] 入力値検証
- [ ] SQLインジェクション対策（Prisma使用で基本対策済み）

### パフォーマンス
- [ ] データベースインデックス
- [ ] APIレスポンスのキャッシュ
- [ ] 画像最適化

## 5. 実装優先順位

1. **Phase 1: 基本機能**（1週間）
   - データベース接続
   - ログイン/認証
   - 職人CRUD

2. **Phase 2: スケジュール機能**（1週間）
   - イベントCRUD
   - カレンダー連携
   - 自動割り当て

3. **Phase 3: 通知・レポート**（1週間）
   - メール通知
   - リアルタイム更新
   - PDF出力

4. **Phase 4: 運用準備**（3日）
   - バックアップ
   - 監視設定
   - ドキュメント整備

## トラブルシューティング

### Prismaエラー
```bash
# スキーマ再生成
npx prisma generate

# データベースリセット
npx prisma db push --force-reset
```

### 認証エラー
```bash
# NextAuthデバッグモード
export NEXTAUTH_URL=http://localhost:3000
export NODE_ENV=development
```

## サポート

問題が発生した場合は、以下を確認：
1. `.env.local`の環境変数
2. `prisma/schema.prisma`のモデル定義
3. Vercelのログ
4. Sentryのエラーレポート