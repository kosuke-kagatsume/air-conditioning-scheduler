/**
 * A/Bテスト機能
 * 段階的な機能リリースとパフォーマンステスト
 */

import { perfMonitor } from './monitoring';

interface FeatureFlag {
  name: string;
  enabled: boolean;
  percentage: number;
  description: string;
  variant?: 'A' | 'B' | 'C';
  metadata?: Record<string, any>;
}

interface ABTestResult {
  variant: string;
  timestamp: number;
  userId?: string;
  metrics?: Record<string, any>;
}

/**
 * A/Bテスト管理クラス
 */
export class ABTestManager {
  private static instance: ABTestManager;
  private features: Map<string, FeatureFlag> = new Map();
  private userAssignments: Map<string, Map<string, string>> = new Map();
  private testResults: ABTestResult[] = [];
  private readonly storageKey = 'ab_test_assignments';

  private constructor() {
    this.loadAssignments();
    this.initializeFeatures();
  }

  static getInstance(): ABTestManager {
    if (!this.instance) {
      this.instance = new ABTestManager();
    }
    return this.instance;
  }

  /**
   * 機能フラグの初期化
   */
  private initializeFeatures(): void {
    // Week 4: 5%のユーザーで新最適化をテスト
    this.registerFeature({
      name: 'enhanced_caching',
      enabled: true,
      percentage: 5,
      description: '強化されたキャッシング機構',
      variant: 'B'
    });

    this.registerFeature({
      name: 'aggressive_memoization',
      enabled: true,
      percentage: 5,
      description: '積極的なメモ化戦略',
      variant: 'B'
    });

    this.registerFeature({
      name: 'virtual_scrolling',
      enabled: true,
      percentage: 5,
      description: '仮想スクロール実装',
      variant: 'B'
    });

    this.registerFeature({
      name: 'lazy_loading',
      enabled: true,
      percentage: 5,
      description: '遅延ローディング',
      variant: 'B'
    });
  }

  /**
   * 機能フラグを登録
   */
  registerFeature(feature: FeatureFlag): void {
    this.features.set(feature.name, feature);
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`🧪 Feature registered: ${feature.name} (${feature.percentage}%)`);
    }
  }

  /**
   * ユーザーが機能を使用できるかチェック
   */
  isFeatureEnabled(featureName: string, userId?: string): boolean {
    const feature = this.features.get(featureName);
    
    if (!feature || !feature.enabled) {
      return false;
    }

    // ユーザーIDがない場合はランダム
    const userKey = userId || this.getOrCreateUserId();
    
    // 既存のアサインメントをチェック
    const assignment = this.getUserAssignment(userKey, featureName);
    if (assignment !== null) {
      return assignment === 'B' || assignment === 'C';
    }

    // 新規アサインメント
    const isEnabled = this.assignUserToTest(userKey, featureName, feature.percentage);
    
    // 結果を記録
    this.recordTestResult({
      variant: isEnabled ? 'B' : 'A',
      timestamp: Date.now(),
      userId: userKey,
      metrics: {
        feature: featureName
      }
    });

    return isEnabled;
  }

  /**
   * ユーザーのバリアント取得
   */
  getUserVariant(featureName: string, userId?: string): 'A' | 'B' | 'C' {
    const userKey = userId || this.getOrCreateUserId();
    const assignment = this.getUserAssignment(userKey, featureName);
    
    if (assignment) {
      return assignment as 'A' | 'B' | 'C';
    }

    // デフォルトはA（コントロール群）
    return 'A';
  }

  /**
   * ユーザーをテストに割り当て
   */
  private assignUserToTest(userId: string, featureName: string, percentage: number): boolean {
    // ユーザーIDとフィーチャー名からハッシュを生成
    const hash = this.hashCode(userId + featureName);
    const bucket = Math.abs(hash) % 100;
    const isEnabled = bucket < percentage;

    // アサインメントを保存
    this.setUserAssignment(userId, featureName, isEnabled ? 'B' : 'A');
    
    return isEnabled;
  }

  /**
   * ユーザーIDを取得または作成
   */
  private getOrCreateUserId(): string {
    if (typeof window === 'undefined') {
      return 'server-render';
    }

    let userId = localStorage.getItem('ab_test_user_id');
    if (!userId) {
      userId = this.generateUserId();
      localStorage.setItem('ab_test_user_id', userId);
    }
    return userId;
  }

  /**
   * ユーザーID生成
   */
  private generateUserId(): string {
    return 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  /**
   * 文字列のハッシュコード生成
   */
  private hashCode(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  /**
   * ユーザーアサインメントを取得
   */
  private getUserAssignment(userId: string, featureName: string): string | null {
    const userMap = this.userAssignments.get(userId);
    return userMap ? userMap.get(featureName) || null : null;
  }

  /**
   * ユーザーアサインメントを設定
   */
  private setUserAssignment(userId: string, featureName: string, variant: string): void {
    if (!this.userAssignments.has(userId)) {
      this.userAssignments.set(userId, new Map());
    }
    this.userAssignments.get(userId)!.set(featureName, variant);
    this.saveAssignments();
  }

  /**
   * アサインメントをローカルストレージに保存
   */
  private saveAssignments(): void {
    if (typeof window === 'undefined') return;

    const data: Record<string, Record<string, string>> = {};
    this.userAssignments.forEach((features, userId) => {
      data[userId] = {};
      features.forEach((variant, feature) => {
        data[userId][feature] = variant;
      });
    });

    localStorage.setItem(this.storageKey, JSON.stringify(data));
  }

  /**
   * アサインメントをローカルストレージから読み込み
   */
  private loadAssignments(): void {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem(this.storageKey);
    if (stored) {
      try {
        const data = JSON.parse(stored);
        Object.entries(data).forEach(([userId, features]) => {
          const featureMap = new Map(Object.entries(features as Record<string, string>));
          this.userAssignments.set(userId, featureMap);
        });
      } catch (e) {
        console.error('Failed to load AB test assignments:', e);
      }
    }
  }

  /**
   * テスト結果を記録
   */
  recordTestResult(result: ABTestResult): void {
    this.testResults.push(result);
    
    // 最大1000件まで保持
    if (this.testResults.length > 1000) {
      this.testResults = this.testResults.slice(-1000);
    }
  }

  /**
   * パフォーマンスメトリクスを記録
   */
  recordPerformanceMetric(
    featureName: string, 
    metricName: string, 
    value: number,
    userId?: string
  ): void {
    const userKey = userId || this.getOrCreateUserId();
    const variant = this.getUserVariant(featureName, userKey);
    
    this.recordTestResult({
      variant,
      timestamp: Date.now(),
      userId: userKey,
      metrics: {
        feature: featureName,
        [metricName]: value
      }
    });

    if (process.env.NODE_ENV === 'development') {
      console.log(`📊 A/B Test Metric: ${featureName} (${variant}) - ${metricName}: ${value}`);
    }
  }

  /**
   * テスト結果のサマリー取得
   */
  getTestSummary(featureName: string): {
    totalUsers: number;
    variantA: number;
    variantB: number;
    variantC: number;
    avgMetrics: Record<string, { A: number; B: number; C: number }>;
  } {
    const results = this.testResults.filter(r => 
      r.metrics?.feature === featureName
    );

    const summary = {
      totalUsers: new Set(results.map(r => r.userId)).size,
      variantA: 0,
      variantB: 0,
      variantC: 0,
      avgMetrics: {} as Record<string, { A: number; B: number; C: number }>
    };

    const metricSums: Record<string, { A: number[]; B: number[]; C: number[] }> = {};

    results.forEach(result => {
      summary[`variant${result.variant}` as 'variantA' | 'variantB' | 'variantC']++;
      
      if (result.metrics) {
        Object.entries(result.metrics).forEach(([key, value]) => {
          if (key !== 'feature' && typeof value === 'number') {
            if (!metricSums[key]) {
              metricSums[key] = { A: [], B: [], C: [] };
            }
            metricSums[key][result.variant as 'A' | 'B' | 'C'].push(value);
          }
        });
      }
    });

    // 平均値を計算
    Object.entries(metricSums).forEach(([metric, values]) => {
      summary.avgMetrics[metric] = {
        A: values.A.length > 0 ? values.A.reduce((a, b) => a + b, 0) / values.A.length : 0,
        B: values.B.length > 0 ? values.B.reduce((a, b) => a + b, 0) / values.B.length : 0,
        C: values.C.length > 0 ? values.C.reduce((a, b) => a + b, 0) / values.C.length : 0
      };
    });

    return summary;
  }

  /**
   * すべてのフィーチャーフラグを取得
   */
  getAllFeatures(): FeatureFlag[] {
    return Array.from(this.features.values());
  }

  /**
   * フィーチャーフラグをリセット
   */
  resetFeature(featureName: string): void {
    this.userAssignments.forEach(features => {
      features.delete(featureName);
    });
    this.saveAssignments();
  }

  /**
   * すべてをリセット
   */
  resetAll(): void {
    this.userAssignments.clear();
    this.testResults = [];
    this.saveAssignments();
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('ab_test_user_id');
    }
  }
}

// シングルトンインスタンスをエクスポート
export const abTest = ABTestManager.getInstance();

// React Hook
export function useABTest(featureName: string, userId?: string): {
  isEnabled: boolean;
  variant: 'A' | 'B' | 'C';
  recordMetric: (metricName: string, value: number) => void;
} {
  const isEnabled = abTest.isFeatureEnabled(featureName, userId);
  const variant = abTest.getUserVariant(featureName, userId);

  const recordMetric = (metricName: string, value: number) => {
    abTest.recordPerformanceMetric(featureName, metricName, value, userId);
  };

  return { isEnabled, variant, recordMetric };
}

// 開発環境でのデバッグヘルパー
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__abTest = abTest;
  (window as any).__getABTestSummary = (feature: string) => abTest.getTestSummary(feature);
  (window as any).__resetABTest = () => abTest.resetAll();
}