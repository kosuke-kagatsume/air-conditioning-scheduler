# 🔒 重要UI保護ドキュメント - 絶対変更禁止事項

## ⚠️ 警告: このファイルに記載された項目は絶対に変更してはならない

最終更新日: 2025-08-24
最終確認コミット: 413a313

---

## 1. 右パネル（プロファイル表示）

### ✅ 現在の正常動作状態
- **AdminProfile**: 管理者ログイン時に右側に固定表示
- **WorkerProfile**: 職人ログイン時に右側に固定表示
- **位置**: right: 20px, top: 80px
- **幅**: 320px
- **z-index**: 10

### 🚫 絶対に変更してはいけない箇所

#### `/app/demo/page.tsx`
```typescript
// Line 35: roleは必ず大文字
role: 'ADMIN'  // または 'WORKER'

// Line 149-153: プロファイル表示ロジック
{user?.role === 'WORKER' ? (
  <WorkerProfile user={user} />
) : (
  <AdminProfile user={user} />
)}
```

#### `/components/AdminProfile.tsx`
```typescript
// Line 58-69: 固定位置設定
position: 'fixed',
right: '20px',
top: '80px',
width: '320px',
zIndex: 10,
```

#### `/components/WorkerProfile.tsx`
```typescript
// Line 65-76: 固定位置設定
position: 'fixed',
right: '20px',
top: '80px',
width: '320px',
zIndex: 10,
```

---

## 2. ヘッダーナビゲーション

### ✅ 現在の正常動作状態
- 通知ベル（NotificationBell）: 表示
- ログアウトボタン: 表示
- 管理者/職人切り替えトグル: 削除済み（表示しない）
- 職人管理リンク: 削除済み（表示しない）
- 設定リンク: 削除済み（表示しない）

### 🚫 絶対に変更してはいけない箇所

#### `/components/AppLayout.tsx`
```typescript
// Line 55-68: ヘッダー右側要素
<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
  {/* 新しい通知システム */}
  <NotificationBell />
  
  {/* ログアウトボタン */}
  <button onClick={() => {...}}>
    <LogOut size={20} color="#4b5563" />
  </button>
</div>
```

---

## 3. カレンダー表示

### ✅ 現在の正常動作状態
- 動的な日付生成（現在日付ベース）
- 月表示で正しいイベント表示
- 週表示で正しいイベント表示

### 🚫 絶対に変更してはいけない箇所

#### `/components/Calendar/CalendarView.tsx`
```typescript
// 動的日付生成（ハードコードしない）
const now = new Date()
const events = generateMockEvents()
```

---

## 4. 重要な過去の失敗事例

### ❌ してはいけないこと
1. **roleの大文字小文字を混在させる**
   - 必ず大文字: 'ADMIN', 'WORKER', 'SUPERADMIN'
   
2. **右パネルのposition設定を変更する**
   - 固定位置が崩れて表示されなくなる
   
3. **ヘッダーに不要なリンクを追加する**
   - 職人管理、設定などは追加しない
   
4. **カレンダーの日付をハードコードする**
   - 必ず動的に現在日付から生成

---

## 5. デプロイ前チェックリスト

- [ ] 管理者でログインして右パネルが表示されるか
- [ ] 職人でログインして右パネルが表示されるか
- [ ] カレンダーにイベントが表示されるか
- [ ] ヘッダーに余計なリンクがないか
- [ ] モバイル表示が崩れていないか

---

## 6. 緊急時の復旧方法

もし誤って変更してしまった場合：

```bash
# このコミットまで戻す
git reset --hard 413a313

# または特定ファイルのみ復旧
git checkout 413a313 -- app/demo/page.tsx
git checkout 413a313 -- components/AdminProfile.tsx
git checkout 413a313 -- components/WorkerProfile.tsx
```

---

## ⚠️ 最終警告

このドキュメントに記載された内容は、長時間のデバッグと試行錯誤の末に到達した
**完全動作する状態** です。些細な変更でも全体が崩れる可能性があります。

変更が必要な場合は、必ず：
1. 別ブランチで作業
2. 十分なテスト
3. このドキュメントの更新

を行ってください。