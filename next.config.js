/** @type {import('next').NextConfig} */
const { withSentryConfig } = require("@sentry/nextjs");
const path = require('path');

const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  images: {
    domains: ['localhost', 'amplifyapp.com'],
  },
  webpack: (config, { dev }) => {
    // alias は 1 本化（@ → プロジェクトルート）
    config.resolve.alias['@'] = path.resolve(__dirname, './');

    // シンプルな設定に戻す（開発時のみFast Refreshを無効化）
    if (dev) {
      // React Refresh (Fast Refresh) を無効化 → フルリロード運用
      config.plugins = config.plugins.filter(
        (p) => p.constructor?.name !== 'ReactRefreshPlugin'
      );
    }
    return config;
  },
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