# リファクタリング安全ガイド

**日付**: 2025年9月21日
**対象**: Dandori Scheduler プロジェクト

## 🚨 Webpack Runtime Error 再発防止

### 根本原因
- **Service Worker/PWAキャッシュ**が古いwebpackランタイムをキャッシュ
- 新しいコードチャンクと古いランタイムの不整合でエラー発生
- `__webpack_require__` で `factory === undefined` → `reading 'call'` エラー

### 恒久対策チェックリスト

#### 1. 開発中はService Worker無効化

**コード例（推奨実装）:**
```javascript
// app/layout.tsx または任意の初期化コード
if (typeof window !== 'undefined') {
  // 開発環境ではService Worker登録を無効化
  if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').catch(() => {});
  }
}
```

#### 2. next-pwa使用時の必須設定

**next.config.js:**
```javascript
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV !== 'production', // ← 必須！
  register: false, // 開発時は手動登録も無効
  skipWaiting: false
});
```

#### 3. import経路の統一

**✅ 統一ルール:**
- `@/constants/settings` のみ使用
- 相対パス禁止: `../constants/settings` ❌
- 大文字違い禁止: `@/Constants/settings` ❌
- barrel export禁止: `@/constants/index` ❌

#### 4. 開発起動時の安全確保

**推奨起動コマンド:**
```bash
# 他のNext.jsプロセスを確実に終了
pkill -f "next|vercel|node.*next" || true && npm run dev -- --port 3001
```

**package.json追加推奨:**
```json
{
  "scripts": {
    "dev:safe": "pkill -f 'next|vercel|node.*next' || true && npm run dev -- --port 3001"
  }
}
```

#### 5. hydration安定化（設定ページ）

**✅ 実装済み対策:**
- 非決定値（日時・乱数）はサーバーで生成してprops渡し
- ブラウザAPIは `useEffect` 後に実行
- `notFound()`/`redirect()` はサーバーコンポーネントのみ

## 🛡️ トラブル時のリカバリ手順

### 3点セット（怪しい動作を感じたら即実行）

1. **DevTools → Application → Clear site data**
2. **Service Worker → すべて Unregister**
3. **ハードリロード（⌘+Shift+R）**

### Gitでの安全復旧

```bash
# 現在の安定版に復旧
git checkout v1.3-stable-settings-split

# 前の安定版に復旧（リファクタリング前）
git checkout v1.2-stable-before-refactor

# タグ一覧確認
git tag --sort=-creatordate
```

## 🔧 開発環境の設定確認

### next.config.js チェックポイント

```javascript
const nextConfig = {
  webpack: (config, { dev }) => {
    // エイリアス統一
    config.resolve.alias['@'] = path.resolve(__dirname, './');

    // 開発時のFast Refresh無効化（安定性重視）
    if (dev) {
      config.plugins = config.plugins.filter(
        (p) => p.constructor?.name !== 'ReactRefreshPlugin'
      );
    }
    return config;
  },
}
```

### 推奨追加設定

```javascript
// Service Worker完全無効化（開発時）
if (dev) {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env.DISABLE_SW': JSON.stringify('true')
    })
  );
}
```

## 📋 CI/CD設定（推奨）

### pre-commit hooks

```bash
# Husky設定例
npx husky add .husky/pre-commit "npm run build"
npx husky add .husky/pre-commit "npm run type-check"
```

### GitHub Actions（推奨）

```yaml
- name: Build check
  run: npm run build
- name: Type check
  run: npm run type-check
```

## 🎯 リファクタリング時の安全原則

### 段階的アプローチ（必須）

1. **Gitタグ作成** - 各段階でバックアップ
2. **1つずつ変更** - 複数コンポーネント同時変更禁止
3. **動作確認** - 各変更後に必ず確認
4. **即座復旧** - 問題発生時は即座にタグに戻る

### 危険な作業パターン（回避）

- ❌ 大規模一括リファクタリング
- ❌ 状態管理の大幅変更
- ❌ import経路の大量変更
- ❌ 複数ファイル同時編集

## 📝 日常の注意事項

1. **キャッシュを疑う** - 原因不明のエラーはまずキャッシュクリア
2. **段階的確認** - 小さな変更でも必ず動作確認
3. **UIレイアウト注意** - 特にSettingsClient.tsx変更時
4. **Service Worker警戒** - ブラウザキャッシュが原因の問題が多発

---

**重要**: このガイドは実際の障害から学んだ教訓です。必ず守って安全な開発を継続してください。