#!/bin/bash

echo "🔍 デプロイ前チェックを開始..."

# 1. TypeScriptの型チェック
echo "📝 TypeScript型チェック..."
npm run type-check
if [ $? -ne 0 ]; then
    echo "❌ TypeScriptエラーがあります"
    exit 1
fi

# 2. ビルドテスト
echo "🏗️ ビルドテスト..."
npm run build
if [ $? -ne 0 ]; then
    echo "❌ ビルドエラーがあります"
    exit 1
fi

# 3. ローカルでの動作確認
echo "🌐 ローカルサーバーでの確認..."
echo "http://localhost:3000 でアプリケーションを確認してください"
echo "問題がなければ Ctrl+C で終了してください"
npm run dev

echo "✅ すべてのチェックが完了しました！"