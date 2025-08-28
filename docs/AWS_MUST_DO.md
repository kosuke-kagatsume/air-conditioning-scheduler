# 🚨 AWS移行後 必須タスクリスト

## 📅 Day 1（移行初日）- 緊急度：最高

### 1. コスト監視設定 💰
```bash
# 予算アラート設定（必須！）
aws budgets create-budget \
  --account-id YOUR_ACCOUNT \
  --budget file://budget.json \
  --notifications-with-subscribers file://notifications.json
```
**理由**: 設定ミスで高額請求を防ぐ

### 2. CloudWatch アラーム設定 🚨
```javascript
// Lambda エラー率監視
// RDS CPU使用率監視
// API Gateway 4xx/5xx監視
```
**理由**: 障害の早期発見

### 3. セキュリティグループ確認 🔒
- [ ] 不要なポートが開いていないか
- [ ] IP制限が適切か
- [ ] VPC設定の確認
**理由**: セキュリティインシデント防止

## 📅 Week 1（最初の1週間）- 緊急度：高

### 4. Lambda コールドスタート対策
```javascript
// Provisioned Concurrency設定
{
  "FunctionName": "your-function",
  "ProvisionedConcurrentExecutions": 2
}
```
**削減効果**: レスポンス時間50%改善

### 5. RDS Proxy 設定
```bash
aws rds create-db-proxy \
  --db-proxy-name your-proxy \
  --engine-family MYSQL \
  --auth Description=RDS_PROXY_AUTH
```
**削減効果**: DB接続コスト80%削減

### 6. CloudFront キャッシュ設定
```javascript
{
  "CacheBehaviors": [{
    "PathPattern": "/api/*",
    "TargetOriginId": "API-Gateway",
    "CachePolicyId": "CACHE_OPTIMIZED_POLICY",
    "TTL": 300
  }]
}
```
**削減効果**: データ転送量70%削減

## 📅 Month 1（最初の1ヶ月）- 緊急度：中

### 7. Auto Scaling 設定
```yaml
# 時間帯別スケーリング
ScalingSchedule:
  - Schedule: "cron(0 8 * * MON-FRI)"  # 平日朝
    MinCapacity: 2
    MaxCapacity: 10
  - Schedule: "cron(0 20 * * *)"       # 夜間
    MinCapacity: 0
    MaxCapacity: 2
```
**削減効果**: 夜間・週末で60%コスト削減

### 8. S3 ライフサイクル設定
```json
{
  "Rules": [{
    "Id": "ArchiveOldLogs",
    "Status": "Enabled",
    "Transitions": [
      {
        "Days": 30,
        "StorageClass": "STANDARD_IA"
      },
      {
        "Days": 90,
        "StorageClass": "GLACIER"
      }
    ]
  }]
}
```
**削減効果**: ストレージコスト85%削減

### 9. Reserved Instances 検討
```bash
# 使用状況を1ヶ月分析してから購入
aws ce get-reservation-purchase-recommendation \
  --service "Amazon RDS" \
  --lookback-period-in-days THIRTY_DAYS
```
**削減効果**: 最大72%割引

## 📊 継続監視項目

### 毎日チェック
- [ ] CloudWatch ダッシュボード
- [ ] エラー率
- [ ] レスポンスタイム

### 毎週チェック
- [ ] Cost Explorer（コスト分析）
- [ ] 使用率レポート
- [ ] セキュリティアラート

### 毎月チェック
- [ ] 請求書詳細分析
- [ ] リソース最適化提案
- [ ] Reserved Instance 購入検討

## 💡 クイック診断コマンド

```bash
# 現在のコスト確認
aws ce get-cost-and-usage \
  --time-period Start=2024-01-01,End=2024-01-31 \
  --granularity DAILY \
  --metrics "UnblendedCost" \
  --group-by Type=DIMENSION,Key=SERVICE

# 未使用リソース検出
aws ce get-savings-opportunities-details \
  --opportunity-id "All"

# パフォーマンス分析
aws cloudwatch get-metric-statistics \
  --namespace AWS/Lambda \
  --metric-name Duration \
  --dimensions Name=FunctionName,Value=your-function \
  --statistics Average \
  --start-time 2024-01-01T00:00:00Z \
  --end-time 2024-01-31T23:59:59Z \
  --period 3600
```

## 🎯 目標KPI

| 項目 | 現在（推定） | 1ヶ月後目標 | 削減率 |
|------|------------|-------------|---------|
| Lambda実行時間 | 200ms | 100ms | -50% |
| RDS接続数 | 100/秒 | 20/秒 | -80% |
| データ転送量 | 100GB/月 | 30GB/月 | -70% |
| 月額コスト | $100 | $50 | -50% |

## 📝 チェックリスト形式

### 絶対にやること ✅
- [ ] 予算アラート設定（$100超えたら通知）
- [ ] CloudWatchアラーム（エラー率1%以上で通知）
- [ ] セキュリティグループ確認
- [ ] バックアップ設定
- [ ] モニタリングダッシュボード作成

### 1週間以内にやること 📅
- [ ] Lambda Provisioned Concurrency
- [ ] RDS Proxy設定
- [ ] CloudFrontキャッシュ最適化
- [ ] S3バケットポリシー設定
- [ ] IAMロール最小権限化

### 1ヶ月以内にやること 📆
- [ ] Auto Scaling設定
- [ ] ライフサイクルポリシー
- [ ] Reserved Instance購入検討
- [ ] Cost Anomaly Detection設定
- [ ] パフォーマンステスト実施

## 🔥 緊急時の対処法

### コストが急増した場合
1. Cost Explorerで原因特定
2. 該当サービスのスケールダウン
3. 不要なリソースの即時停止

### パフォーマンスが劣化した場合
1. CloudWatch Insights で分析
2. Lambda メモリ増強
3. RDS インスタンスサイズ変更

### セキュリティアラートが出た場合
1. 該当リソースの隔離
2. CloudTrailでアクセスログ確認
3. セキュリティグループ即時修正

---

💡 **重要**: このドキュメントをAWS移行時に必ず参照してください。
最初の1週間が最も重要です！