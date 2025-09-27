# Dandori Scheduler

エアコン工事の日程管理システム

## 🚀 Quickstart

```bash
# Node.js v22.18.0を使用
nvm use

# 依存関係インストール（lockfile厳守）
npm install --frozen-lockfile

# 環境変数設定
cp .env.example .env.local
# .env.localに実際の値を設定（1Passwordから取得）

# 開発サーバー起動
npm run dev
# → http://localhost:3003
```

## 📝 Scripts

```bash
npm run dev        # 開発サーバー起動
npm run build      # プロダクションビルド
npm run start      # プロダクションサーバー起動
npm run lint       # ESLint実行
npm run test       # テスト実行
npm run type-check # TypeScript型チェック
```

## 🔄 開発フロー

1. **Issue作成** → タスクを明確化
2. **ブランチ作成**: `feature/YYYYMMDD-topic` 形式
3. **開発** → コミット（conventional commits推奨）
4. **PR作成** → CI通過確認
5. **レビュー** → 1名以上の承認必須
6. **マージ** → `main`ブランチへ
7. **自動デプロイ** → Vercelが本番環境へ自動反映

## 🚨 トラブルシュート

### Webpack Runtime Error
ブラウザでエラーが発生する場合：
1. ブラウザのService Workerをクリア
2. `rm -rf .next` で.nextフォルダ削除
3. `npm run dev`で再起動
4. それでも解決しない場合: `?__disableSW=1` をURLに追加

### 依存関係の問題
```bash
# lockfileを厳守してインストール
npm install --frozen-lockfile

# キャッシュクリア
npm cache clean --force
```

### 環境変数が反映されない
1. `.env.local`の設定を確認
2. 開発サーバーを再起動
3. `NEXT_PUBLIC_`プレフィックスの確認（クライアント側で使う変数）

## 🏗️ プロジェクト構造

```
air-conditioning-scheduler/
├── app/                  # Next.js App Router
│   ├── api/             # APIルート
│   ├── dashboard/       # ダッシュボード
│   ├── demo/           # デモページ
│   └── settings/       # 設定画面
├── components/          # Reactコンポーネント
├── lib/                # ユーティリティ
├── public/             # 静的ファイル
└── constants/          # 定数定義
```

## 🔐 環境変数

実際の値は1Passwordの「Dandori Scheduler – Env」に保管。
必要な変数は`.env.example`を参照。

## 📦 デプロイ

### 本番環境
- **自動**: `main`ブランチへのマージで自動デプロイ
- **URL**: https://air-conditioning-scheduler-1flmigzd9-kosukes-projects-c6ad92ba.vercel.app

### ロールバック
Vercelダッシュボード → Deployments → 前のデプロイを選択 → "Promote to Production"

## 📚 関連ドキュメント

- [CLAUDE.md](./CLAUDE.md) - 開発履歴とトラブルシューティング
- [ARCHITECTURE.md](./ARCHITECTURE.md) - システム構成（作成予定）
- [CONTRIBUTING.md](./CONTRIBUTING.md) - コントリビューションガイド（作成予定）

## 👥 チーム

- **オーナー**: @kosuke-kagatsume
- **メンテナ**: [CODEOWNERSファイル](.github/CODEOWNERS)参照

## 📄 ライセンス

Private - 社内利用のみ # 末尾に空行など1行追加
