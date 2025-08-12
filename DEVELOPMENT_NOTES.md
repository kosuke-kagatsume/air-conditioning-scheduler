# DandoriScheduler 開発メモ

## 🚀 開発再開時のクイックスタート

### 1. 開発サーバーの起動
```bash
cd /Users/dw100/Documents/air-conditioning-scheduler-latest
npm run dev
```
ローカル: http://localhost:3000

### 2. デプロイ（Vercel）
```bash
vercel --prod
```

## 📝 重要なURL

### 本番環境
- **最新デプロイURL**: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app
- **デモログイン画面**: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app/login/demo

### デモアカウント
1. **管理者**: 山田太郎
   - Email: admin@demo.com
   - すべての機能にアクセス可能

2. **職人1**: 鈴木一郎  
   - Email: worker1@demo.com
   - 職人向け機能のみ

3. **職人2**: 佐藤次郎
   - Email: worker2@demo.com
   - 職人向け機能のみ

## 🏗️ プロジェクト構造

```
/app                    # Next.js App Router
  /demo                 # メインカレンダー画面
  /login/demo          # デモログイン画面
  /workers             # 職人管理
  /shifts              # シフト管理
  /inventory           # 在庫管理
  /reports             # 作業報告書

/components
  /AppLayout.tsx       # 共通レイアウト
  /NotificationPanel.tsx # 通知パネル
  /WorkerProfile.tsx   # 職人プロフィール
  /Calendar/           # カレンダーコンポーネント

/lib
  /mockData.ts         # 基本モックデータ
  /mockDataExtended.ts # 拡張モックデータ（60+イベント）
  /mockWorkersExtended.ts # 15人の職人データ
  /mockWorkerSchedule.ts  # 職人スケジュール（50+）

/contexts
  /AuthContext.tsx     # 認証・権限管理
```

## 🔧 よく使うコマンド

### 開発
```bash
# 開発サーバー起動
npm run dev

# ビルド確認
npm run build

# 本番デプロイ
vercel --prod

# ログ確認
vercel logs
```

## 📊 実装済み機能

### 管理者向け機能
- ✅ ダッシュボード（売上分析、稼働状況）
- ✅ 職人管理（15人の詳細データ）
- ✅ 現場管理
- ✅ シフト管理（6週間分のデータ）
- ✅ 在庫管理
- ✅ 作業報告書の承認
- ✅ 設定管理

### 職人向け機能
- ✅ 自分のスケジュール確認
- ✅ 作業報告書作成
- ✅ 予定変更申請
- ✅ 在庫確認
- ✅ 通知確認

### 共通機能
- ✅ リアルタイム通知（ロール別）
- ✅ カレンダービュー（月/週/日）
- ✅ モバイル対応

## 🎯 デモデータの特徴

- **イベント**: 60以上（3ヶ月分、各月20個以上）
- **職人**: 15人（詳細プロフィール、スキル、資格付き）
- **シフト**: 6週間分（過去2週間+未来4週間）
- **職人スケジュール**: 50以上のアイテム
- **通知**: 25以上（管理者/職人別、優先度付き）
- **作業報告書**: 30件
- **在庫アイテム**: 15種類
- **予定変更申請**: 25件

## 🐛 既知の問題と解決策

### AuthProvider重複エラー
- layout.tsxでのみAuthProviderを使用
- 各ページコンポーネントでは使用しない

### デモログイン画面へのアクセス
- 直接URL: `/login/demo` を使用
- ルートページの「デモを見る」ボタンからもアクセス可能

## 📱 Claude（AI）への指示例

開発を再開する際、Claudeに以下のように伝えると効率的：

```
DandoriSchedulerの開発を続けます。
プロジェクトパス: /Users/dw100/Documents/air-conditioning-scheduler-latest
最新デプロイ: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app
日本語で対応してください。
```

## 📅 最終更新
- 日付: 2025年8月10日
- 最終作業: 通知システムの実装、デモログイン修正
- デプロイ状態: ✅ 正常稼働中