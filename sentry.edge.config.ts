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
});