# 🚀 デプロイメントガイド

## 📋 デプロイ前チェックリスト

### 1. 環境変数の設定
Vercelダッシュボードで以下の環境変数を設定してください：

```env
# 必須設定
DATABASE_URL=your-production-database-url
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# オプション（推奨）
RESEND_API_KEY=your-resend-api-key
NEXT_PUBLIC_SENTRY_DSN=your-sentry-dsn
```

### 2. データベースのセットアップ

#### Vercel Postgresを使用する場合：
1. Vercelダッシュボードで「Storage」タブを開く
2. 「Create Database」をクリック
3. Postgres を選択
4. 環境変数が自動的に設定される

#### 外部データベースを使用する場合：
1. PostgreSQL/MySQLインスタンスを準備
2. DATABASE_URL を設定
3. Prismaスキーマを更新（必要に応じて）

### 3. 本番用マイグレーション

```bash
# 本番環境用のマイグレーション
npx prisma migrate deploy

# 初期データの投入（必要に応じて）
npx prisma db seed
```

## 🔐 セキュリティ設定

### 必須のセキュリティ対策：

1. **NEXTAUTH_SECRET の生成**
```bash
openssl rand -base64 32
```

2. **HTTPS の強制**
- Vercelは自動的にHTTPSを提供

3. **環境変数の保護**
- 本番環境の環境変数は Vercel Dashboard でのみ設定
- `.env.production` ファイルはコミットしない

## 📦 デプロイ手順

### 自動デプロイ（推奨）：

1. GitHubにプッシュ
```bash
git add .
git commit -m "Production ready"
git push origin main
```

2. Vercelが自動的にビルド・デプロイ

### 手動デプロイ：

```bash
# Vercel CLIを使用
npm i -g vercel
vercel --prod
```

## 🧪 デプロイ後のテスト

### 1. ヘルスチェック
```bash
curl https://your-domain.vercel.app/api/health
```

### 2. 機能テスト
- [ ] ログイン機能
- [ ] カレンダー表示
- [ ] 職人管理
- [ ] レポート生成
- [ ] 通知機能

### 3. パフォーマンステスト
- Vercel Analytics でパフォーマンス監視
- Lighthouse スコアの確認

## 🔄 ロールバック手順

問題が発生した場合：

1. Vercelダッシュボードで「Deployments」タブを開く
2. 前のデプロイメントを選択
3. 「Promote to Production」をクリック

## 📊 監視とログ

### Vercel Analytics
- リアルタイムトラフィック
- パフォーマンスメトリクス
- エラー率

### Sentry
- エラー追跡
- パフォーマンス監視
- ユーザーフィードバック

## 🆘 トラブルシューティング

### よくある問題と解決策：

#### 1. データベース接続エラー
```
Error: Can't reach database server
```
**解決策**: DATABASE_URL を確認、SSL設定を追加

#### 2. 認証エラー
```
Error: Please define NEXTAUTH_SECRET
```
**解決策**: NEXTAUTH_SECRET環境変数を設定

#### 3. ビルドエラー
```
Error: Module not found
```
**解決策**: 
```bash
npm ci
npm run build
```

## 📝 メンテナンスモード

メンテナンス中の表示：

1. `maintenance.json` を作成
```json
{
  "enabled": true,
  "message": "システムメンテナンス中です"
}
```

2. ミドルウェアでチェック

## 🎯 パフォーマンス最適化

### 推奨設定：

1. **画像最適化**
- next/image を使用
- WebP形式の使用

2. **キャッシング**
```typescript
// API Route でのキャッシング例
export const revalidate = 3600 // 1時間
```

3. **データベースインデックス**
```sql
CREATE INDEX idx_events_date ON Event(date);
CREATE INDEX idx_users_email ON User(email);
```

## 📱 Progressive Web App (PWA)

PWA対応（オプション）：

1. `next-pwa` パッケージをインストール
2. `manifest.json` を設定
3. Service Worker を有効化

## 🌐 国際化（i18n）

多言語対応（将来的な拡張）：

1. `next-i18next` の導入
2. 言語ファイルの準備
3. ルーティングの設定

## 📞 サポート連絡先

問題が発生した場合の連絡先：

- **技術サポート**: tech-support@dandori.com
- **緊急連絡**: emergency@dandori.com
- **Slack**: #dandori-scheduler-support

---

最終更新: 2025-08-24
バージョン: 1.0.0