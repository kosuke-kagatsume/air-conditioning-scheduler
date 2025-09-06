# 🚀 AWS デプロイメントガイド - DandoriScheduler

## 推奨アーキテクチャ

### Option 1: AWS Amplify（推奨・簡単）
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Route53   │────▶│  CloudFront │────▶│   Amplify   │
│   (DNS)     │     │    (CDN)    │     │  (Next.js)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌─────────────┐     ┌──────▼──────┐
                    │   Secrets   │◀────│   RDS       │
                    │   Manager   │     │ PostgreSQL  │
                    └─────────────┘     └─────────────┘
```

### Option 2: ECS Fargate（本格運用）
```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Route53   │────▶│     ALB     │────▶│ECS Fargate  │
│   (DNS)     │     │(LoadBalancer)│     │  (Next.js)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                                │
                    ┌─────────────┐     ┌──────▼──────┐
                    │     S3      │     │   RDS       │
                    │  (Assets)   │     │ PostgreSQL  │
                    └─────────────┘     └─────────────┘
```

## 📋 AWS Amplifyでのデプロイ手順（推奨）

### 1. 事前準備
```bash
# AWS CLIインストール
brew install awscli
aws configure

# Amplify CLIインストール
npm install -g @aws-amplify/cli
amplify configure
```

### 2. RDS PostgreSQLセットアップ
```bash
# AWS ConsoleまたはCLIで作成
aws rds create-db-instance \
  --db-instance-identifier dandori-scheduler-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --engine-version 15.4 \
  --master-username postgres \
  --master-user-password YourStrongPassword123! \
  --allocated-storage 20 \
  --vpc-security-group-ids sg-xxxxxx \
  --publicly-accessible
```

### 3. Amplifyプロジェクト初期化
```bash
# プロジェクトディレクトリで実行
amplify init

# 以下の設定を選択
? Enter a name for the project: dandorischeduler
? Enter a name for the environment: production
? Choose your default editor: Visual Studio Code
? Choose the type of app: javascript
? What javascript framework are you using: react
? Source Directory Path: .
? Distribution Directory Path: .next
? Build Command: npm run build
? Start Command: npm run start
```

### 4. Amplify Hostingセットアップ
```bash
# Hostingを追加
amplify add hosting

? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Manual deployment
```

### 5. 環境変数設定
```bash
# Amplify Consoleで設定
DATABASE_URL=postgresql://username:password@your-rds-endpoint:5432/dbname
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=https://your-domain.amplifyapp.com
NODE_ENV=production
```

### 6. amplify.yml作成
```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
        - npx prisma generate
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

### 7. デプロイ実行
```bash
# 初回デプロイ
amplify publish

# 以降の更新
git push
# Amplify Consoleが自動デプロイ
```

## 🐳 ECS Fargateでのデプロイ（本格運用）

### 1. Dockerfile作成
```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --only=production
RUN npm install @prisma/client
RUN npx prisma generate

FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=deps /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY prisma ./prisma

USER nextjs
EXPOSE 3000
ENV PORT 3000

CMD ["node", "server.js"]
```

### 2. ECRにイメージプッシュ
```bash
# ECRリポジトリ作成
aws ecr create-repository --repository-name dandori-scheduler

# ログイン
aws ecr get-login-password --region ap-northeast-1 | \
  docker login --username AWS --password-stdin \
  xxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com

# ビルド＆プッシュ
docker build -t dandori-scheduler .
docker tag dandori-scheduler:latest \
  xxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/dandori-scheduler:latest
docker push xxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/dandori-scheduler:latest
```

### 3. task-definition.json
```json
{
  "family": "dandori-scheduler",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "containerDefinitions": [
    {
      "name": "dandori-scheduler",
      "image": "xxxxxxxxxxxx.dkr.ecr.ap-northeast-1.amazonaws.com/dandori-scheduler:latest",
      "portMappings": [
        {
          "containerPort": 3000,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "NODE_ENV",
          "value": "production"
        }
      ],
      "secrets": [
        {
          "name": "DATABASE_URL",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:dandori/db-url"
        },
        {
          "name": "NEXTAUTH_SECRET",
          "valueFrom": "arn:aws:secretsmanager:region:account:secret:dandori/auth-secret"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/dandori-scheduler",
          "awslogs-region": "ap-northeast-1",
          "awslogs-stream-prefix": "ecs"
        }
      }
    }
  ]
}
```

### 4. CDK/Terraformでインフラ構築（推奨）
```typescript
// cdk/lib/dandori-stack.ts
import * as cdk from 'aws-cdk-lib';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export class DandoriStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // VPC
    const vpc = new ec2.Vpc(this, 'DandoriVPC', {
      maxAzs: 2
    });

    // RDS
    const database = new rds.DatabaseInstance(this, 'Database', {
      engine: rds.DatabaseInstanceEngine.postgres({
        version: rds.PostgresEngineVersion.VER_15_4
      }),
      instanceType: ec2.InstanceType.of(
        ec2.InstanceClass.T3,
        ec2.InstanceSize.MICRO
      ),
      vpc,
      removalPolicy: cdk.RemovalPolicy.SNAPSHOT
    });

    // Fargate Service
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'Service', {
      vpc,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromEcrRepository(ecrRepo),
        environment: {
          NODE_ENV: 'production'
        },
        secrets: {
          DATABASE_URL: ecs.Secret.fromSecretsManager(dbSecret)
        }
      }
    });

    // Auto Scaling
    const scaling = fargateService.service.autoScaleTaskCount({
      maxCapacity: 10,
      minCapacity: 2
    });

    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50
    });
  }
}
```

## 💰 コスト目安（月額）

### Amplify構成
- Amplify Hosting: $12-15
- RDS t3.micro: $15-20
- CloudFront: $5-10
- **合計: 約$40-50/月**

### ECS Fargate構成
- Fargate (512CPU/1GB×2): $30-40
- ALB: $25
- RDS t3.micro: $15-20
- NAT Gateway: $45
- **合計: 約$120-150/月**

## 🔒 セキュリティ設定

### 必須設定
```bash
# Security Group
- RDS: VPC内からのみアクセス許可
- ALB: 80/443のみ開放
- Fargate: ALBからのみアクセス許可

# Secrets Manager
aws secretsmanager create-secret \
  --name dandori/database-url \
  --secret-string "postgresql://..."

# WAF設定
- SQLインジェクション対策
- XSS対策
- Rate limiting
```

## 📊 監視設定

### CloudWatch
```bash
# アラーム設定
- CPU使用率 > 80%
- メモリ使用率 > 80%
- RDS接続数 > 80
- エラーレート > 1%
- レスポンスタイム > 3秒
```

### X-Ray（オプション）
```javascript
// トレーシング有効化
import AWSXRay from 'aws-xray-sdk-core';
const https = AWSXRay.captureHTTPs(require('https'));
```

## 🚀 デプロイコマンド集

```bash
# Amplify
amplify publish

# ECS更新
aws ecs update-service \
  --cluster dandori-cluster \
  --service dandori-service \
  --force-new-deployment

# ログ確認
aws logs tail /ecs/dandori-scheduler --follow

# スケーリング
aws application-autoscaling put-scaling-policy \
  --service-namespace ecs \
  --scalable-dimension ecs:service:DesiredCount \
  --resource-id service/dandori-cluster/dandori-service \
  --policy-name cpu-scaling \
  --policy-type TargetTrackingScaling
```

## トラブルシューティング

### よくある問題
1. **RDS接続エラー**: Security Group確認
2. **メモリ不足**: Fargateのメモリ増設
3. **ビルドエラー**: node_modules削除して再インストール
4. **環境変数エラー**: Secrets Manager確認

## サポート
問題が発生した場合は、CloudWatchログを確認してください。