# Dandori Scheduler - Claude開発ログ

## 🏷️ 現在の安定バージョン
**タグ**: `v1.7-major-settings-refactor-complete`
**日付**: 2025年9月21日
**状況**: ✅ 完全動作中・設定画面リファクタリング完了

## 📋 実行可能なコマンド

### 開発サーバー起動
```bash
npm run dev -- --port 3001
```

### 安全な復旧方法
```bash
# 現在の安定版に戻す
git checkout v1.7-major-settings-refactor-complete

# 前の安定版に戻す（部分リファクタリング後）
git checkout v1.6-calendar-display-tab-success

# さらに前の安定版に戻す
git checkout v1.3-stable-settings-split
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
2. **設定ファイル大規模リファクタリング完了（2025年9月21日）**
   - `app/settings/page.tsx`: 3,357行 → 55行（サーバーコンポーネント）
   - `constants/settings.json`: 設定データ外部化
3. **全設定タブのコンポーネント分離完了**
   - `components/settings/NotificationsTab.tsx`: 通知設定タブ（78行）
   - `components/settings/CalendarDisplayTab.tsx`: カレンダー表示タブ（92行）
   - `components/settings/CalendarConfigTab.tsx`: カレンダー設定タブ（490行）
   - `components/settings/AutoAssignmentRules.tsx`: 自動割当ルール（176行）
   - `components/settings/WorkersTab.tsx`: 職人管理タブ（336行）
   - `components/settings/PermissionsTab.tsx`: 権限管理タブ（557行）
   - `components/settings/ReportsTab.tsx`: レポート設定タブ（433行）
   - `utils/settingsHelpers.ts`: 共通ヘルパー関数とスタイル定義（126行）
   - **SettingsClient.tsx: 3,327行 → 1,282行（61%削減！）**

### 🚨 残存課題
1. **SettingsClient.tsx まだ1,282行** - さらなる分割可能
2. **ApprovalTab未分離** - 必要に応じて分離可能
3. **27個のuseState** - 状態管理の改善余地あり

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