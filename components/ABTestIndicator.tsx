/**
 * A/Bテストインジケーター
 * 開発環境でテスト状態を表示
 */

import React from 'react';
import { abTest } from '@/lib/ab-testing';

interface ABTestIndicatorProps {
  userId?: string;
}

export default function ABTestIndicator({ userId }: ABTestIndicatorProps) {
  // 本番環境では表示しない
  if (process.env.NODE_ENV === 'production') {
    return null;
  }

  const features = abTest.getAllFeatures();
  const activeTests = features.filter(f => 
    abTest.isFeatureEnabled(f.name, userId)
  );

  if (activeTests.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-purple-100 border border-purple-300 rounded-lg p-3 shadow-lg z-50 max-w-xs">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-purple-800">
          A/Bテスト実行中 ({activeTests.length})
        </span>
      </div>
      <div className="space-y-1">
        {activeTests.map(test => (
          <div key={test.name} className="text-xs text-purple-700">
            <span className="font-medium">{test.name}:</span>
            <span className="ml-1">バリアント {abTest.getUserVariant(test.name, userId)}</span>
            <span className="ml-1 text-purple-500">({test.percentage}%)</span>
          </div>
        ))}
      </div>
      <button
        onClick={() => {
          if (window.confirm('A/Bテストの割り当てをリセットしますか？')) {
            abTest.resetAll();
            window.location.reload();
          }
        }}
        className="mt-2 text-xs text-purple-600 hover:text-purple-800 underline"
      >
        リセット
      </button>
    </div>
  );
}