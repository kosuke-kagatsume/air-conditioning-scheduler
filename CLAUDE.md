# Dandori Scheduler - Claude開発ログ

## 🏷️ 現在の安定バージョン
**タグ**: `v1.3-stable-settings-split`
**日付**: 2025年9月21日
**状況**: ✅ 完全動作中

## 📋 実行可能なコマンド

### 開発サーバー起動
```bash
npm run dev -- --port 3001
```

### 安全な復旧方法
```bash
# 現在の安定版に戻す
git checkout v1.3-stable-settings-split

# 前の安定版に戻す（リファクタリング前）
git checkout v1.2-stable-before-refactor
```

### 型チェック・Lint
```bash
npm run build    # プロダクションビルド
npm run type-check  # TypeScript型チェック（要確認）
npm run lint     # ESLint（要確認）
```

## 🎯 最新の成果

### ✅ 解決済み課題
1. **Webpack Runtime Error 完全解決**
   - 原因: Service Worker/PWAキャッシュ
   - 解決: ブラウザキャッシュクリア手順確立
2. **設定ファイルリファクタリング**
   - `app/settings/page.tsx`: 3,357行 → 55行（サーバーコンポーネント）
   - `constants/settings.json`: 設定データ外部化
   - `app/settings/SettingsClient.tsx`: 3,390行（クライアントコンポーネント）

### 🚨 残存課題
1. **SettingsClient.tsx が巨大** (3,390行)
2. **27個のuseState** - 状態管理混乱
3. **8つの機能が1ファイル** - コンポーネント分割未実施

## 🛠️ 次回の開発指針

### 推奨アプローチ: 段階的・安全第一
1. **フェーズ1**: 型定義強化（UIに影響なし）
2. **フェーズ2**: 1つのタブのみ分離テスト
3. **フェーズ3**: 成功したら順次拡大

### 避けるべきアプローチ
- ❌ 大規模な一括リファクタリング
- ❌ 複数のタブ同時分離
- ❌ 状態管理の大幅変更

## 🏗️ プロジェクト構造

```
air-conditioning-scheduler/
├── app/
│   ├── settings/
│   │   ├── page.tsx (55行) - サーバーコンポーネント
│   │   └── SettingsClient.tsx (3,390行) - 🚨 要分割
│   ├── demo/page.tsx - メインアプリ
│   └── dashboard/page.tsx - ダッシュボード
├── constants/
│   └── settings.json - 設定データ
└── components/ - 各種コンポーネント
```

## 🔄 トラブルシューティング

### Webpack Runtime Error 再発時
1. Chrome DevTools → Application → Service Workers → すべて Unregister
2. Application → Storage → Clear site data
3. Network → Disable cache
4. ハードリロード（⌘+Shift+R）

### 開発サーバー問題時
```bash
rm -rf .next
npm run dev -- --port 3001
```

## 📝 重要メモ

- **常にGitタグでバックアップ**: 大きな変更前に必ずタグ作成
- **段階的確認**: 各変更後に動作確認必須
- **UIレイアウト注意**: 特にSettingsClient.tsx変更時
- **Service Worker**: ブラウザキャッシュが原因の問題多発

---
**最終更新**: 2025年9月21日
**次回継続時**: この文書で現状確認から開始