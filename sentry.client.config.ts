import * as Sentry from "@sentry/nextjs";

// Sentryを有効にするには有効なDSNが必要
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// DSNが設定されていない場合はSentryを初期化しない
if (SENTRY_DSN && SENTRY_DSN !== 'your-dsn' && !SENTRY_DSN.includes('your-dsn')) {
  Sentry.init({
    dsn: SENTRY_DSN,
  
  // パフォーマンス監視のサンプリングレート（1.0 = 100%）
  tracesSampleRate: process.env.NODE_ENV === "production" ? 0.1 : 1.0,
  
  // セッションリプレイのサンプリングレート
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
  
  // リリースとデプロイ情報
  release: process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA || "development",
  environment: process.env.NEXT_PUBLIC_VERCEL_ENV || "development",
  
  // エラーフィルタリング
  beforeSend(event, hint) {
    // 開発環境では404エラーを無視
    if (process.env.NODE_ENV === "development") {
      const error = hint.originalException;
      if (error && typeof error === "object" && "status" in error && error.status === 404) {
        return null;
      }
    }
    return event;
  },
  
  // インテグレーション設定
  integrations: [
    Sentry.replayIntegration({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  
  // デバッグモード（開発時のみ）
  debug: process.env.NODE_ENV === "development",
  
  // 無視するエラー
  ignoreErrors: [
    // ブラウザ拡張機能関連のエラー
    "top.GLOBALS",
    "ResizeObserver loop limit exceeded",
    "Non-Error promise rejection captured",
    // Next.js特有のエラー
    /^Loading chunk \d+ failed/,
    /^Cannot read properties of undefined \(reading 'call'\)/,
  ],
  });
} else {
  // Sentryが無効の場合はコンソールにメッセージを表示（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("Sentry is disabled: No valid DSN provided");
  }
}