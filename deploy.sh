#!/bin/bash

# デプロイスクリプト - Vercel, GitHub, ahillchan.comへ同時デプロイ

echo "🚀 デプロイを開始します..."

# 1. Vercel CLIで直接デプロイ（最速）
echo "📦 Vercelへデプロイ中..."
vercel --prod --yes

# 2. GitHubへプッシュ（バックアップ）
echo "🔄 GitHubへプッシュ中..."
git add -A
git commit -m "Deploy: $(date '+%Y-%m-%d %H:%M:%S')" || echo "変更なし"
git push origin main

# 3. ahillchan.comは自動反映されるので待機
echo "✅ デプロイ完了！"
echo ""
echo "📍 確認URL:"
echo "   - Vercel: https://air-conditioning-scheduler.vercel.app"
echo "   - Custom: https://aircon.ahillchan.com"
echo "   - GitHub: https://github.com/daiokawa/air-conditioning-scheduler"

# 完了音
afplay /System/Library/Sounds/Glass.aiff