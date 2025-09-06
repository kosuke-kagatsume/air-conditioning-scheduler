# AWS セットアップ手順

## 1. AWS CLIの設定

ターミナルで以下のコマンドを実行してAWS認証情報を設定してください：

```bash
aws configure
```

以下の情報を入力してください：
- AWS Access Key ID: [あなたのアクセスキー]
- AWS Secret Access Key: [あなたのシークレットキー]
- Default region name: ap-northeast-1
- Default output format: json

## 2. Amplify CLIの設定

```bash
amplify configure
```

手順：
1. ブラウザが開いてAWSコンソールにログイン
2. IAMユーザーの作成（amplify-dandori-user）
3. AdministratorAccess-Amplify ポリシーをアタッチ
4. アクセスキーとシークレットキーをコピー
5. ターミナルに戻って入力

## 3. Amplifyプロジェクトの初期化

```bash
# プロジェクトディレクトリで実行
amplify init
```

以下の設定を選択：
```
? Enter a name for the project: dandorischeduler
? Enter a name for the environment: prod
? Choose your default editor: Visual Studio Code
? Choose the type of app that you're building: javascript
? What javascript framework are you using: react
? Source Directory Path: .
? Distribution Directory Path: .next
? Build Command: npm run build
? Start Command: npm run start
```

## 4. Amplify Hostingの追加

```bash
amplify add hosting
```

選択：
```
? Select the plugin module to execute: Hosting with Amplify Console
? Choose a type: Continuous deployment (Git-based deployments)
```

## 5. GitHubとの連携

1. GitHubリポジトリと連携
2. ブランチを選択（main）
3. サービスロールの作成または選択

## 6. 環境変数の設定

Amplify Consoleで以下を設定：
```
NODE_ENV=production
DATABASE_URL=[後でRDSのURLを設定]
NEXTAUTH_SECRET=[openssl rand -base64 32で生成]
NEXTAUTH_URL=https://[your-amplify-url].amplifyapp.com
```

## 7. amplify.ymlの作成

プロジェクトルートに`amplify.yml`を作成済み（確認してください）

## 8. デプロイ実行

```bash
amplify push
amplify publish
```

## 次のステップ

1. RDS PostgreSQLの作成
2. データベース接続文字列の取得
3. Amplify環境変数に設定
4. Prismaマイグレーション実行

---

準備ができたら、上記のコマンドを順番に実行してください。