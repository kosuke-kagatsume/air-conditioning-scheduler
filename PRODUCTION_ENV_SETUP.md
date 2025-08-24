# 🔧 本番環境変数設定ガイド

## Vercelダッシュボードで設定する環境変数

### 🔐 **必須設定**

#### 1. データベース設定
```bash
# Vercel Postgresを使用する場合
DATABASE_URL="postgresql://..."
# または外部PostgreSQL
DATABASE_URL="postgresql://username:password@host:5432/database"
```

#### 2. 認証設定
```bash
# NextAuth.js設定
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="生成したランダム文字列（32文字以上）"

# 生成方法：
# openssl rand -base64 32
```

#### 3. リアルタイム通知（Pusher）
```bash
PUSHER_APP_ID="your-pusher-app-id"
NEXT_PUBLIC_PUSHER_KEY="your-pusher-key"
PUSHER_SECRET="your-pusher-secret"
NEXT_PUBLIC_PUSHER_CLUSTER="ap3"
```

### 📧 **推奨設定**

#### 4. メール送信（Resend）
```bash
RESEND_API_KEY="re_your_actual_api_key"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

#### 5. エラー監視（Sentry）
```bash
NEXT_PUBLIC_SENTRY_DSN="https://your-dsn@sentry.io/project-id"
SENTRY_ORG="your-organization"
SENTRY_PROJECT="dandori-scheduler"
```

## 📝 設定手順

### Step 1: Vercelダッシュボードにアクセス
1. https://vercel.com/dashboard にログイン
2. プロジェクト「air-conditioning-scheduler」を選択
3. Settings タブをクリック
4. Environment Variables を選択

### Step 2: 環境変数を追加
各環境変数を以下の設定で追加：
- **Name**: 変数名
- **Value**: 値
- **Environment**: Production, Preview, Development（すべてチェック）

### Step 3: 必要なサービスの設定

#### Pusher設定：
1. https://pusher.com でアカウント作成
2. 新しいアプリを作成（Region: Asia Pacific (Tokyo)）
3. App Keys から各値を取得

#### Resend設定（推奨）：
1. https://resend.com でアカウント作成
2. API Keyを生成
3. 送信ドメインを設定

#### Sentry設定（推奨）：
1. https://sentry.io でアカウント作成
2. プロジェクト作成（Platform: Next.js）
3. DSNを取得

## 🗄️ データベース設定

### Option A: Vercel Postgres（推奨）
1. Vercel Dashboard → Storage → Create Database
2. Postgres を選択
3. 自動的に環境変数が設定される

### Option B: 外部PostgreSQL
- AWS RDS、Google Cloud SQL、Railway等を使用
- CONNECTION_STRING形式で設定

## 🚀 デプロイ後の確認

### 必須チェック項目：
- [ ] アプリケーションが正常に起動
- [ ] ログイン機能が動作
- [ ] データベース接続が成功
- [ ] 通知機能が動作
- [ ] AI最適化が実行可能
- [ ] PDF生成が動作

### デバッグ方法：
1. Vercel Dashboard → Functions → View Function Logs
2. Runtime Logs でエラーを確認
3. 必要に応じて環境変数を修正

## 🔒 セキュリティベストプラクティス

1. **強力なシークレット生成**
```bash
openssl rand -base64 32
```

2. **環境変数の分離**
- 本番環境のシークレットは絶対に開発環境で使用しない
- .env.local は gitignore に含まれることを確認

3. **定期的なシークレット更新**
- 月1回程度でシークレットを更新
- 侵害の疑いがある場合は即座に更新

## 🔧 トラブルシューティング

### よくあるエラーと解決方法：

#### 1. "NEXTAUTH_SECRET is not set"
→ NEXTAUTH_SECRET環境変数を設定

#### 2. "Database connection failed"
→ DATABASE_URL形式を確認、SSL設定を追加

#### 3. "Pusher connection failed"
→ PUSHER関連の環境変数をすべて確認

#### 4. "Build failed"
→ package.json の依存関係を確認

---

最終更新: 2025-08-24
担当者: AI Assistant