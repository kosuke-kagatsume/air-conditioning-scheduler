/**
 * パフォーマンス監視とログユーティリティ
 * UIに影響を与えずにシステムの健全性を監視
 */

interface PerformanceMetrics {
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

class PerformanceMonitor {
  private metrics: PerformanceMetrics[] = [];
  private readonly WARNING_THRESHOLD = 100; // 100ms以上は警告
  private readonly ERROR_THRESHOLD = 1000; // 1秒以上はエラー

  /**
   * パフォーマンス計測ラッパー
   */
  measure<T>(operationName: string, fn: () => T, metadata?: Record<string, any>): T {
    const start = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - start;
      
      this.recordMetric({
        operation: operationName,
        duration,
        timestamp: Date.now(),
        metadata
      });

      // 閾値チェック
      if (duration > this.ERROR_THRESHOLD) {
        console.error(`🔴 Critical performance issue: ${operationName} took ${duration.toFixed(2)}ms`, metadata);
      } else if (duration > this.WARNING_THRESHOLD) {
        console.warn(`🟡 Slow operation: ${operationName} took ${duration.toFixed(2)}ms`, metadata);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ Operation failed: ${operationName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  /**
   * 非同期処理の計測
   */
  async measureAsync<T>(
    operationName: string, 
    fn: () => Promise<T>, 
    metadata?: Record<string, any>
  ): Promise<T> {
    const start = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - start;
      
      this.recordMetric({
        operation: operationName,
        duration,
        timestamp: Date.now(),
        metadata
      });

      if (duration > this.ERROR_THRESHOLD) {
        console.error(`🔴 Critical async performance issue: ${operationName} took ${duration.toFixed(2)}ms`, metadata);
      } else if (duration > this.WARNING_THRESHOLD) {
        console.warn(`🟡 Slow async operation: ${operationName} took ${duration.toFixed(2)}ms`, metadata);
      }

      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ Async operation failed: ${operationName} after ${duration.toFixed(2)}ms`, error);
      throw error;
    }
  }

  private recordMetric(metric: PerformanceMetrics) {
    this.metrics.push(metric);
    
    // メモリ管理: 最新1000件のみ保持
    if (this.metrics.length > 1000) {
      this.metrics = this.metrics.slice(-1000);
    }
  }

  /**
   * パフォーマンスレポート生成
   */
  getReport() {
    if (this.metrics.length === 0) return null;

    const grouped = this.metrics.reduce((acc, m) => {
      if (!acc[m.operation]) {
        acc[m.operation] = [];
      }
      acc[m.operation].push(m.duration);
      return acc;
    }, {} as Record<string, number[]>);

    const report = Object.entries(grouped).map(([operation, durations]) => ({
      operation,
      count: durations.length,
      avgDuration: durations.reduce((a, b) => a + b, 0) / durations.length,
      maxDuration: Math.max(...durations),
      minDuration: Math.min(...durations)
    }));

    return report;
  }

  /**
   * コンソールにレポート出力
   */
  logReport() {
    const report = this.getReport();
    if (report) {
      console.table(report);
    }
  }
}

// シングルトンインスタンス
export const perfMonitor = new PerformanceMonitor();

/**
 * データ品質監視
 */
export class DataQualityMonitor {
  static logInvalidDate(dateStr: string, timeStr?: string, context?: string) {
    console.warn('📅 Invalid date detected:', {
      date: dateStr,
      time: timeStr,
      context,
      timestamp: new Date().toISOString()
    });
  }

  static logEventStats(events: any[], context: string) {
    const stats = {
      totalEvents: events.length,
      multiDayEvents: events.filter(e => e.endDate && e.endDate !== e.date).length,
      invalidDates: events.filter(e => !e.date || e.date === 'Invalid Date').length,
      context,
      timestamp: new Date().toISOString()
    };

    // 開発環境でのみ詳細ログ
    if (process.env.NODE_ENV === 'development') {
      console.log('📊 Event Statistics:', stats);
    }

    // 異常値の検出
    if (stats.invalidDates > 0) {
      console.error('🔴 Invalid dates found in events!', stats);
    }
    
    if (stats.totalEvents > 1000) {
      console.warn('🟡 Large number of events detected:', stats.totalEvents);
    }
  }

  static logMemoryUsage(context: string) {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      
      if (usedMB > limitMB * 0.9) {
        console.error(`🔴 Critical memory usage: ${usedMB}MB / ${limitMB}MB (${context})`);
      } else if (usedMB > limitMB * 0.7) {
        console.warn(`🟡 High memory usage: ${usedMB}MB / ${limitMB}MB (${context})`);
      }
    }
  }
}

/**
 * エラー境界ログ
 */
export function logError(error: Error, context: string, metadata?: any) {
  console.error(`❌ Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    metadata,
    timestamp: new Date().toISOString()
  });

  // 本番環境ではSentryなどに送信
  if (process.env.NODE_ENV === 'production' && typeof window !== 'undefined') {
    // Sentry.captureException(error, { extra: { context, metadata } });
  }
}

// 開発環境でのデバッグヘルパー
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__perfMonitor = perfMonitor;
  (window as any).__getPerformanceReport = () => perfMonitor.logReport();
}