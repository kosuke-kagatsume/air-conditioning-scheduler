#!/bin/bash

# 本番デプロイスクリプト
# 実行前に必要な環境変数がVercelに設定されていることを確認してください

set -e

echo "🚀 本番環境デプロイを開始します..."

# 1. 現在のブランチを確認
CURRENT_BRANCH=$(git branch --show-current)
echo "現在のブランチ: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo "⚠️  mainブランチではありません。mainブランチに切り替えてください。"
    exit 1
fi

# 2. 最新の変更をプル
echo "📥 最新の変更を取得中..."
git pull origin main

# 3. 依存関係の確認
echo "📦 依存関係を確認中..."
npm ci

# 4. 型チェック
echo "🔍 TypeScript型チェック中..."
npm run type-check || {
    echo "❌ 型エラーが検出されました。修正してから再試行してください。"
    exit 1
}

# 5. ビルドテスト（ローカル）
echo "🔨 ローカルビルドテスト中..."
npm run build || {
    echo "❌ ビルドエラーが検出されました。修正してから再試行してください。"
    exit 1
}

# 6. 重要ファイルの存在確認
echo "📋 重要ファイルの存在確認..."
files_to_check=(
    "CRITICAL_UI_PROTECTION.md"
    "DEPLOYMENT_GUIDE.md"
    "PRODUCTION_ENV_SETUP.md"
    ".env.production"
    "prisma/schema.production.prisma"
)

for file in "${files_to_check[@]}"; do
    if [ ! -f "$file" ]; then
        echo "❌ 必要なファイルが見つかりません: $file"
        exit 1
    fi
done

echo "✅ 全ファイル存在確認完了"

# 7. 本番前の最終確認
echo ""
echo "🔔 本番デプロイ前の最終確認"
echo "================================"
echo "✅ コード品質: OK"
echo "✅ ビルド: OK" 
echo "✅ 型チェック: OK"
echo "✅ 重要ファイル: OK"
echo ""

read -p "本番環境にデプロイしますか？ (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "デプロイをキャンセルしました。"
    exit 1
fi

# 8. デプロイタグを作成
DEPLOY_TAG="production-$(date +%Y%m%d-%H%M%S)"
echo "🏷️  デプロイタグを作成: $DEPLOY_TAG"
git tag -a "$DEPLOY_TAG" -m "Production deployment $(date)"

# 9. GitHubにプッシュ（Vercel自動デプロイ）
echo "📤 GitHubにプッシュ中..."
git push origin main
git push origin --tags

echo ""
echo "🎉 デプロイ完了！"
echo "================================"
echo "📊 Vercelダッシュボードで進行状況を確認してください："
echo "   https://vercel.com/dashboard"
echo ""
echo "🔧 次の手順："
echo "1. Vercelで環境変数を設定"
echo "2. データベースマイグレーション実行"
echo "3. 本番環境でのテスト実施"
echo ""
echo "📖 詳細は DEPLOYMENT_GUIDE.md を参照してください。"

# 10. ブラウザで管理画面を開く（macOS）
if [[ "$OSTYPE" == "darwin"* ]]; then
    read -p "Vercelダッシュボードを開きますか？ (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        open "https://vercel.com/dashboard"
    fi
fi

echo "🚀 デプロイスクリプト完了！"