# UI開発ガイドライン

## 🛡️ UI崩れを防ぐための開発フロー

### 1. 開発前の準備
```bash
# developmentブランチで作業
git checkout development

# 最新の状態を取得
git pull origin main
```

### 2. 開発中の確認
```bash
# ローカルで確認
npm run dev

# TypeScript型チェック
npm run type-check

# ビルドチェック
npm run build
```

### 3. デプロイ前のチェック
```bash
# 自動チェックスクリプトを実行
npm run pre-deploy

# プレビューデプロイ（本番前のテスト）
npm run deploy:preview
```

## 🎨 スタイリングのルール

### インラインスタイル vs CSS Modules
- **インラインスタイル**: 動的な値や一時的な修正に使用
- **CSS Modules**: 再利用可能なコンポーネントスタイルに使用
- **Tailwind CSS**: ユーティリティクラスとして使用

### スタイル優先順位
1. CSS Modules（`.module.css`）
2. Tailwind Classes
3. インラインスタイル（最後の手段）

## 🔍 デバッグ方法

### UIが崩れた時のチェックリスト
1. **ブラウザのDevToolsで確認**
   - 要素のスタイルを検証
   - 競合するCSSルールがないか確認

2. **z-indexの確認**
   - モーダル: 100以上
   - ヘッダー: 50
   - 通常コンテンツ: 1-10

3. **position属性の確認**
   - fixed要素は親要素に依存しない
   - absolute要素は親のrelativeに依存

## 📸 ビジュアルテスト

### スナップショットの更新
```bash
# 新しいUIが正しい場合
npm run test:visual:update
```

### テストの実行
```bash
npm run test:visual
```

## 🚀 安全なデプロイ

### プレビューデプロイの活用
1. `npm run deploy:preview`でプレビュー環境にデプロイ
2. URLを共有して確認
3. 問題なければ本番デプロイ

### ロールバック方法
```bash
# Vercelのダッシュボードから過去のデプロイを選択
# または
vercel rollback [deployment-url]
```

## 📝 よくあるUI問題と解決策

### 1. モーダルが表示されない
- z-indexを確認
- position: fixedが設定されているか確認

### 2. クリックが効かない
- pointer-events: noneが設定されていないか確認
- 他の要素が重なっていないか確認

### 3. レイアウトが崩れる
- flexboxやgridの設定を確認
- widthやheightの単位を確認（%, px, vw/vh）

## 🔧 トラブルシューティング

### 緊急時の対応
1. `git stash`で変更を一時保存
2. `git checkout main`で安定版に戻す
3. 問題を特定してから修正

### サポート
問題が解決しない場合は、以下の情報と共に報告：
- ブラウザとバージョン
- 画面サイズ
- エラーメッセージ（DevToolsのConsole）
- スクリーンショット