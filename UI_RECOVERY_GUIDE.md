# 🆘 DandoriScheduler UI復旧ガイド

## 🚨 緊急時：UIが崩れた場合の復旧手順

### 🔒 安全な状態のコミット
**コミットID**: `8482630`
**日時**: 2025-08-12
**状態**: ✅ UI正常動作確認済み

---

## ⚡ 即座に復旧する方法

### 1. ローカル環境での復旧
```bash
cd /Users/dw100/Documents/air-conditioning-scheduler-latest

# 現在の変更を一時保存（必要に応じて）
git stash

# 安全な状態に戻る
git checkout 8482630

# 強制的に安全な状態に戻る（緊急時）
git reset --hard 8482630
```

### 2. Vercelへの緊急デプロイ
```bash
# 安全な状態から即座にデプロイ
vercel --prod

# または特定のコミットからデプロイ
git checkout 8482630
vercel --prod
```

---

## 🎯 復旧後の確認項目

### ✅ チェックリスト
- [ ] トップページ表示: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app
- [ ] デモログイン: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app/login/demo
- [ ] メインカレンダー: `/demo`
- [ ] ダッシュボード: `/dashboard`
- [ ] 職人管理: `/workers`
- [ ] サイドバー表示
- [ ] モバイル表示

---

## 🔧 開発時の安全策

### 変更前の必須作業
```bash
# 1. 現在の状態をコミット
git add -A
git commit -m "変更前のバックアップ"

# 2. ローカルで動作確認
npm run dev
# http://localhost:3001 で確認

# 3. 問題なければデプロイ
vercel --prod
```

---

## 🆘 パニック時の3ステップ

### Step 1: 深呼吸 🫁

### Step 2: 安全な状態に戻る
```bash
cd /Users/dw100/Documents/air-conditioning-scheduler-latest
git reset --hard 8482630
```

### Step 3: すぐにデプロイ
```bash
vercel --prod
```

---

## 📞 緊急連絡先

**本番URL**: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app
**ローカル**: http://localhost:3001
**安全なコミット**: `8482630`

---

## 🎯 よくある問題と解決策

### 問題1: サイドバーが表示されない
```tsx
// components/Sidebar.tsx の確認ポイント
className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out bg-white shadow-lg border-r border-gray-200 lg:translate-x-0"
```

### 問題2: レイアウトが崩れる
```tsx
// AppLayout.tsx の確認ポイント
<div className="flex h-screen bg-gray-50">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden">
    <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-4">
```

### 問題3: スタイルが効かない
1. Tailwindの設定確認: `tailwind.config.js`
2. CSS importの確認: `app/globals.css`
3. キャッシュクリア: `rm -rf .next && npm run dev`

---

## 🔄 このガイドの更新

UIを修正・改善した後は必ずこのガイドを更新：

1. 新しい安全なコミットIDを記録
2. 復旧手順をテスト
3. チェックリストを更新

**最終更新**: 2025-08-12
**次回更新予定**: UI変更後すぐに