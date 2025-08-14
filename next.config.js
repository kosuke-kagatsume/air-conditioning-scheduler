/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");

const nextConfig = {
  reactStrictMode: true,
}

// Sentry設定オプション
const sentryWebpackPluginOptions = {
  // Sentryの組織名とプロジェクト名
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // 認証トークン
  authToken: process.env.SENTRY_AUTH_TOKEN,
  
  // ソースマップのアップロード設定
  silent: true, // ビルド時のログを抑制
  hideSourceMaps: true, // 本番環境でソースマップを隠す
  disableLogger: true, // Sentryロガーを無効化
  
  // リリース情報の自動設定
  automaticVercelMonitoring: true,
};

// Sentry設定を適用してエクスポート
module.exports = withSentryConfig(nextConfig, sentryWebpackPluginOptions);