# エアコンスケジューラー 引き継ぎドキュメント

## プロジェクト概要
- **プロジェクト名**: air-conditioning-scheduler
- **技術スタック**: Next.js, TypeScript, Tailwind CSS
- **デプロイ先**: Vercel
- **リポジトリ**: https://github.com/daiokawa/air-conditioning-scheduler

## 引き継ぎ手順

### 1. GitHubアクセス権の取得
現在のオーナー（daiokawa）から以下のいずれかの方法でアクセス権を取得：
- GitHubリポジトリのCollaboratorとして招待してもらう
- リポジトリをForkして独自に管理

### 2. ローカル環境のセットアップ

```bash
# リポジトリをクローン
git clone https://github.com/daiokawa/air-conditioning-scheduler.git
cd air-conditioning-scheduler

# 依存関係をインストール
npm install

# 開発サーバーを起動
npm run dev
```

### 3. Vercelへのデプロイ

#### 方法A: 既存プロジェクトへのアクセス権取得
1. 現在のオーナーからVercelチームメンバーとして招待してもらう
2. https://vercel.com/daiokawas-projects/air-conditioning-scheduler にアクセス

#### 方法B: 新規Vercelプロジェクトとしてデプロイ
```bash
# Vercel CLIをインストール（未インストールの場合）
npm i -g vercel

# デプロイ
vercel

# 以下のプロンプトに答える：
# - Set up and deploy? → Y
# - Which scope? → 自分のアカウントを選択
# - Link to existing project? → N（新規作成）
# - Project name? → 任意の名前
# - In which directory is your code located? → ./
# - Want to modify settings? → N
```

### 4. 環境変数の設定（必要な場合）
現時点では環境変数は使用していませんが、今後追加する場合：
1. Vercelダッシュボード → Settings → Environment Variables
2. 必要な環境変数を追加

## プロジェクト構造

```
air-conditioning-scheduler/
├── app/              # Next.js App Router
├── components/       # Reactコンポーネント
├── package.json      # 依存関係
├── tsconfig.json     # TypeScript設定
├── tailwind.config.js # Tailwind CSS設定
├── vercel.json       # Vercel設定
└── deploy.sh         # デプロイスクリプト

```

## 主要なコマンド

```bash
# 開発サーバー起動
npm run dev

# ビルド
npm run build

# 本番サーバー起動
npm start

# 型チェック
npm run type-check

# デプロイ（スクリプト使用）
./deploy.sh
```

## 技術的な注意点

1. **Next.js App Router**を使用
2. **TypeScript**で型安全な開発
3. **Tailwind CSS**でスタイリング
4. **Vercel**の自動デプロイ機能を活用（GitHubにpushすると自動デプロイ）

## サポート

引き継ぎに関して不明な点がある場合は、以下の方法でサポートを受けられます：

1. GitHubのIssueで質問
2. 既存のコードとドキュメントを参照
3. Vercelのドキュメント: https://vercel.com/docs

## 連絡先
- 現在のオーナー: daiokawa（GitHub）
- プロジェクトURL: https://vercel.com/daiokawas-projects/air-conditioning-scheduler

---
作成日: 2025-08-07