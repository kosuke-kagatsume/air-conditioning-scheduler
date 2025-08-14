import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // パフォーマンス監視のサンプリングレート
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // リリースとデプロイ情報
  release: process.env.VERCEL_GIT_COMMIT_SHA || "development",
  environment: process.env.VERCEL_ENV || "development",
  
  // デバッグモード（開発時のみ）
  debug: process.env.NODE_ENV === "development",
  
  // エラーフィルタリング
  beforeSend(event, hint) {
    // ヘルスチェックエンドポイントのエラーを無視
    if (event.request?.url?.includes("/api/health")) {
      return null;
    }
    return event;
  },
  
  // 無視するエラー
  ignoreErrors: [
    // Prismaの接続エラー（一時的なもの）
    "PrismaClientKnownRequestError",
    // Next.jsの既知のエラー
    "NEXT_NOT_FOUND",
    "NEXT_REDIRECT",
  ],
  
  // トランザクション名の正規化
  beforeTransaction(transaction) {
    // 動的ルートパラメータを正規化
    if (transaction.name) {
      transaction.name = transaction.name
        .replace(/\/[a-f0-9]{24}/g, "/[id]") // MongoDB ObjectID
        .replace(/\/\d+/g, "/[id]") // 数値ID
        .replace(/\/[A-Za-z0-9-_]+/g, "/[slug]"); // スラッグ
    }
    return transaction;
  },
});