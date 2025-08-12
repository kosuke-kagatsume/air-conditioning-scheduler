# 🚨 UI修正前の必須チェックリスト

## 修正前に必ず実行：

### 1. 現在の状態を保存
```bash
git add .
git commit -m "現在の状態を保存"
```

### 2. ローカルで動作確認
```bash
npm run dev
# http://localhost:3000 で確認
```

### 3. 修正後の確認
```bash
# TypeScriptエラーチェック
npm run type-check

# ビルド可能か確認
npm run build
```

### 4. 安全にデプロイ
```bash
# まずプレビューで確認
npm run deploy:preview
# URLが表示されるので確認

# 問題なければ本番へ
npm run deploy
```

## 🔥 緊急時の復旧方法

### UIが壊れた場合：
```bash
# 変更を取り消す
git reset --hard HEAD

# または前のコミットに戻る
git checkout HEAD~1
```

### Vercelで前のバージョンに戻す：
1. https://vercel.com にログイン
2. プロジェクトを選択
3. Deployments タブ
4. 動いていたバージョンの「...」メニュー
5. 「Promote to Production」をクリック

## ✅ これで安全です！