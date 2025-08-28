# AWS デプロイメント最適化ガイド 🚀

## 現在の最適化状況

### ✅ 実装済み（フロントエンド最適化）
- キャッシング機構
- バンドルサイズ削減
- エラーハンドリング
- パフォーマンス監視

### 📋 AWS移行時に必要な追加最適化

## 1. サーバーレスアーキテクチャ最適化

### Lambda関数の最適化
```javascript
// ❌ 悪い例：毎回DBコネクション作成
exports.handler = async (event) => {
  const connection = await createDbConnection(); // 毎回作成
  // ...
};

// ✅ 良い例：コネクション再利用
let connection;
exports.handler = async (event) => {
  if (!connection) {
    connection = await createDbConnection();
  }
  // ...
};
```

### 推奨構成
```yaml
# serverless.yml の例
functions:
  api:
    handler: handler.main
    memorySize: 512  # 最適なメモリサイズ（要調整）
    timeout: 10
    reservedConcurrency: 5  # 同時実行数制限
    environment:
      NODE_ENV: production
```

## 2. データベース最適化

### RDS Proxy使用（接続プーリング）
```javascript
// RDS Proxy経由で接続
const dbConfig = {
  host: 'your-rds-proxy.proxy-xxx.us-east-1.rds.amazonaws.com',
  connectionLimit: 10,
  queueLimit: 0,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
};
```

### DynamoDB使用（NoSQL選択肢）
```javascript
// オンデマンド料金で開始
const params = {
  TableName: 'Events',
  BillingMode: 'PAY_PER_REQUEST', // 使った分だけ課金
  // 必要に応じてプロビジョンドに変更
};
```

## 3. 静的アセット最適化

### S3 + CloudFront構成
```bash
# ビルド & デプロイスクリプト
#!/bin/bash
npm run build
aws s3 sync .next/static s3://your-bucket/static --cache-control max-age=31536000
aws s3 sync public s3://your-bucket/public --cache-control max-age=86400
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### 画像最適化
```javascript
// Next.js の画像最適化設定
module.exports = {
  images: {
    loader: 'cloudinary', // または独自のCDN
    domains: ['your-cdn.com'],
    deviceSizes: [640, 750, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    formats: ['image/webp'],
  },
};
```

## 4. コスト監視設定

### CloudWatchアラーム
```javascript
const costAlarm = new cloudwatch.Alarm(stack, 'CostAlarm', {
  metric: new cloudwatch.Metric({
    namespace: 'AWS/Billing',
    metricName: 'EstimatedCharges',
    dimensions: { Currency: 'USD' },
  }),
  threshold: 100, // $100を超えたらアラート
  evaluationPeriods: 1,
});
```

### タグベースのコスト追跡
```javascript
// すべてのリソースにタグ付け
const tags = {
  'Project': 'air-conditioning-scheduler',
  'Environment': process.env.STAGE,
  'Team': 'engineering',
  'CostCenter': 'product',
};
```

## 5. 推定月額コスト（東京リージョン）

### 小規模（~1000ユーザー）
- Lambda: $5-10
- RDS (t4g.micro): $15-20
- S3 + CloudFront: $5-10
- **合計: 約$25-40/月**

### 中規模（~10,000ユーザー）
- Lambda: $50-100
- RDS (t4g.small + Read Replica): $60-80
- S3 + CloudFront: $30-50
- ElastiCache: $25-35
- **合計: 約$165-265/月**

### 大規模（100,000+ユーザー）
- Lambda: $500-1000
- Aurora Serverless v2: $300-500
- S3 + CloudFront: $200-400
- ElastiCache: $100-200
- **合計: 約$1,100-2,100/月**

## 6. コスト削減テクニック

### 1. Reserved Instances / Savings Plans
```bash
# 1年または3年契約で最大72%割引
# RDS、EC2、Lambdaで利用可能
```

### 2. スポットインスタンス活用
```javascript
// バッチ処理やテスト環境で使用
const spotFleet = new ec2.SpotFleet(stack, 'SpotFleet', {
  targetCapacity: 2,
  maxPrice: 0.05, // 最大入札価格
});
```

### 3. 自動スケーリング設定
```javascript
// 夜間・週末は縮小
const scalingSchedule = {
  schedules: [
    {
      name: 'scale-down-night',
      schedule: 'cron(0 20 * * ? *)', // 20:00 JST
      minCapacity: 0,
      maxCapacity: 1,
    },
    {
      name: 'scale-up-morning',
      schedule: 'cron(0 7 * * ? *)', // 7:00 JST
      minCapacity: 1,
      maxCapacity: 10,
    },
  ],
};
```

### 4. データライフサイクル管理
```javascript
// 古いデータをGlacierに移動
const lifecycleRule = {
  id: 'archive-old-data',
  status: 'Enabled',
  transitions: [
    {
      days: 30,
      storageClass: 'STANDARD_IA', // 低頻度アクセス
    },
    {
      days: 90,
      storageClass: 'GLACIER', // アーカイブ
    },
  ],
};
```

## 7. 監視とアラート

### 異常検知
```javascript
// Lambda関数のエラー率監視
const errorRate = new cloudwatch.MathExpression({
  expression: 'errors / invocations * 100',
  usingMetrics: {
    errors: lambdaFunction.metricErrors(),
    invocations: lambdaFunction.metricInvocations(),
  },
});

new cloudwatch.Alarm(stack, 'ErrorAlarm', {
  metric: errorRate,
  threshold: 1, // エラー率1%以上でアラート
  evaluationPeriods: 2,
});
```

### コスト異常検知
```javascript
// AWS Cost Anomaly Detection設定
const anomalyDetector = new ce.AnomalyDetector({
  name: 'cost-anomaly-detector',
  threshold: 100, // $100以上の異常を検知
});
```

## 8. パフォーマンス最適化

### API Gateway キャッシング
```javascript
const api = new apigateway.RestApi(stack, 'api', {
  cacheClusterEnabled: true,
  cacheClusterSize: '0.5', // GB
  cacheTtl: Duration.minutes(5),
  cacheDataEncrypted: true,
});
```

### DynamoDB Accelerator (DAX)
```javascript
// マイクロ秒レベルのレイテンシー
const daxCluster = new dax.CfnCluster(stack, 'DaxCluster', {
  clusterName: 'events-cache',
  nodeType: 'dax.t2.small',
  replicationFactor: 2,
});
```

## 9. セキュリティ最適化（コスト影響あり）

### WAF設定
```javascript
// DDoS攻撃防止（不要なトラフィック削減）
const webAcl = new waf.WebAcl(stack, 'WebAcl', {
  rules: [
    {
      name: 'RateLimitRule',
      priority: 1,
      statement: {
        rateBasedStatement: {
          limit: 2000, // 5分あたり2000リクエスト
          aggregateKeyType: 'IP',
        },
      },
      action: { block: {} },
    },
  ],
});
```

## 10. 実装チェックリスト

- [ ] Lambda関数のコールドスタート最適化
- [ ] RDS Proxy設定
- [ ] CloudFront キャッシング設定
- [ ] S3 ライフサイクルポリシー
- [ ] CloudWatch ダッシュボード作成
- [ ] Cost Explorer 予算アラート設定
- [ ] Auto Scaling 設定
- [ ] バックアップ戦略
- [ ] ディザスタリカバリ計画
- [ ] セキュリティグループ最適化

## まとめ

現在のフロントエンド最適化により：
- **基本的なコスト削減は達成** ✅
- APIコール削減でLambda実行回数減少
- キャッシュによりデータ転送量削減

AWS移行時の追加最適化で期待できる削減：
- **さらに30-50%のコスト削減可能**
- 適切なインスタンスサイズ選定
- オートスケーリング活用
- リザーブドインスタンス割引

推定ROI：
- 初期設定工数: 40-60時間
- 月額削減額: $50-500（規模による）
- 投資回収期間: 2-3ヶ月