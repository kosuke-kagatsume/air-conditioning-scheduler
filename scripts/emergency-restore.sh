#!/bin/bash

# 🆘 DandoriScheduler 緊急復旧スクリプト
# このスクリプトでUIの正常な状態に確実に戻せます

echo "🆘 DandoriScheduler 緊急復旧を開始します..."
echo ""

# プロジェクトディレクトリに移動
cd /Users/dw100/Documents/air-conditioning-scheduler-latest

echo "📍 現在のディレクトリ: $(pwd)"
echo ""

# 現在の状況を表示
echo "📊 現在のGit状態:"
git status --short
echo ""

# 安全な状態に復旧
echo "🔒 安全な状態 (8482630) に復旧中..."
git stash push -m "緊急復旧前の変更を一時保存 $(date)"
git checkout development
git reset --hard 8482630

echo "✅ 安全な状態に復旧完了"
echo ""

# 依存関係の確認
echo "📦 依存関係を確認中..."
npm install

# Vercelにデプロイ
echo "🚀 Vercelに緊急デプロイ中..."
vercel --prod

echo ""
echo "🎉 緊急復旧完了！"
echo ""
echo "🔗 確認URL:"
echo "   本番: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app"
echo "   デモログイン: https://air-conditioning-scheduler-ce7y5xgad-kosukes-projects-c6ad92ba.vercel.app/login/demo"
echo ""
echo "✅ UIの確認をお忘れなく！"