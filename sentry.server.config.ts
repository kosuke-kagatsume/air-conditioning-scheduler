import * as Sentry from "@sentry/nextjs";

// Sentryを有効にするには有効なDSNが必要
const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// DSNが設定されていない場合はSentryを初期化しない
if (SENTRY_DSN && SENTRY_DSN !== 'your-dsn' && !SENTRY_DSN.includes('your-dsn')) {
  Sentry.init({
    dsn: SENTRY_DSN,
    
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
    beforeSendTransaction(transaction) {
      // 動的ルートパラメータを正規化
      if (transaction.transaction) {
        transaction.transaction = transaction.transaction
          .replace(/\/[a-f0-9]{24}/g, "/[id]") // MongoDB ObjectID
          .replace(/\/\d+/g, "/[id]") // 数値ID
          .replace(/\/[A-Za-z0-9-_]+/g, "/[slug]"); // スラッグ
      }
      return transaction;
    },
  });
} else {
  // Sentryが無効の場合はコンソールにメッセージを表示（開発環境のみ）
  if (process.env.NODE_ENV === "development") {
    console.log("Sentry (server) is disabled: No valid DSN provided");
  }
}