/**
 * 安全機構とガード処理
 * 無限ループ、メモリリーク、異常データを防ぐ
 */

interface SafetyLimits {
  maxIterations: number;
  maxArraySize: number;
  maxExecutionTime: number;
  maxEventDays: number;
}

// 安全制限の定義
export const SAFETY_LIMITS: SafetyLimits = {
  maxIterations: 1000,      // ループ最大回数
  maxArraySize: 10000,      // 配列最大サイズ
  maxExecutionTime: 5000,   // 最大実行時間（ms）
  maxEventDays: 365,        // イベントの最大日数（1年）
};

/**
 * ループカウンター
 * 無限ループを防ぐためのカウンター
 */
export class LoopGuard {
  private iterations = 0;
  private readonly maxIterations: number;
  private readonly context: string;
  private startTime: number;

  constructor(context: string, maxIterations = SAFETY_LIMITS.maxIterations) {
    this.context = context;
    this.maxIterations = maxIterations;
    this.startTime = Date.now();
  }

  /**
   * イテレーションをチェック
   * @throws Error 制限を超えた場合
   */
  check(): void {
    this.iterations++;
    
    // イテレーション数チェック
    if (this.iterations > this.maxIterations) {
      const error = new Error(
        `🔴 Loop guard triggered: ${this.context} exceeded ${this.maxIterations} iterations`
      );
      console.error(error.message, {
        iterations: this.iterations,
        context: this.context,
      });
      throw error;
    }

    // 実行時間チェック
    const elapsed = Date.now() - this.startTime;
    if (elapsed > SAFETY_LIMITS.maxExecutionTime) {
      const error = new Error(
        `🔴 Timeout guard triggered: ${this.context} exceeded ${SAFETY_LIMITS.maxExecutionTime}ms`
      );
      console.error(error.message, {
        elapsed,
        context: this.context,
      });
      throw error;
    }
  }

  /**
   * 現在のイテレーション数を取得
   */
  getIterations(): number {
    return this.iterations;
  }
}

/**
 * 配列サイズガード
 * メモリ不足を防ぐ
 */
export function checkArraySize(array: any[], context: string): void {
  if (array.length > SAFETY_LIMITS.maxArraySize) {
    const warning = `🟡 Large array detected in ${context}: ${array.length} items`;
    console.warn(warning);
    
    // 開発環境では詳細情報を出力
    if (process.env.NODE_ENV === 'development') {
      console.warn('Array size details:', {
        size: array.length,
        limit: SAFETY_LIMITS.maxArraySize,
        context,
        memoryUsage: typeof process !== 'undefined' ? process.memoryUsage() : 'N/A'
      });
    }
  }
}

/**
 * 日付範囲の検証
 * 異常な日付範囲を防ぐ
 */
export function validateDateRange(
  startDate: Date, 
  endDate: Date, 
  context: string
): boolean {
  // 日付の有効性チェック
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
    console.error(`🔴 Invalid date in ${context}:`, { startDate, endDate });
    return false;
  }

  // 終了日が開始日より前
  if (endDate < startDate) {
    console.warn(`🟡 End date before start date in ${context}:`, { startDate, endDate });
    return false;
  }

  // 日数チェック
  const daysDiff = Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  if (daysDiff > SAFETY_LIMITS.maxEventDays) {
    console.error(
      `🔴 Date range too large in ${context}: ${daysDiff} days (max: ${SAFETY_LIMITS.maxEventDays})`
    );
    return false;
  }

  return true;
}

/**
 * メモリ使用量チェッカー
 */
export class MemoryGuard {
  private static readonly WARNING_THRESHOLD = 0.7;  // 70%
  private static readonly ERROR_THRESHOLD = 0.9;    // 90%

  static check(context: string): void {
    if (typeof window !== 'undefined' && 'memory' in performance) {
      const memory = (performance as any).memory;
      const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
      const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
      const usage = memory.usedJSHeapSize / memory.jsHeapSizeLimit;

      if (usage > this.ERROR_THRESHOLD) {
        console.error(
          `🔴 Critical memory usage in ${context}: ${usedMB}MB / ${limitMB}MB (${Math.round(usage * 100)}%)`
        );
        // 緊急時のメモリ解放を試みる
        this.attemptMemoryCleanup();
      } else if (usage > this.WARNING_THRESHOLD) {
        console.warn(
          `🟡 High memory usage in ${context}: ${usedMB}MB / ${limitMB}MB (${Math.round(usage * 100)}%)`
        );
      }
    }
  }

  private static attemptMemoryCleanup(): void {
    // ガベージコレクションの強制実行を試みる（ブラウザによっては無効）
    if (typeof window !== 'undefined' && 'gc' in window) {
      try {
        (window as any).gc();
        console.log('🟢 Forced garbage collection');
      } catch (e) {
        console.log('ℹ️ Manual GC not available');
      }
    }
  }
}

/**
 * 再帰深度ガード
 */
export class RecursionGuard {
  private static readonly MAX_DEPTH = 100;
  private static depths = new Map<string, number>();

  static enter(context: string): void {
    const current = this.depths.get(context) || 0;
    if (current >= this.MAX_DEPTH) {
      throw new Error(`🔴 Maximum recursion depth exceeded in ${context}`);
    }
    this.depths.set(context, current + 1);
  }

  static exit(context: string): void {
    const current = this.depths.get(context) || 0;
    if (current > 0) {
      this.depths.set(context, current - 1);
    }
  }

  static reset(): void {
    this.depths.clear();
  }
}

/**
 * タイムアウト付き非同期処理ラッパー
 */
export async function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  context: string
): Promise<T> {
  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(`🔴 Operation timeout in ${context}: ${timeoutMs}ms exceeded`));
    }, timeoutMs);
  });

  try {
    return await Promise.race([promise, timeout]);
  } catch (error) {
    console.error(`Timeout error in ${context}:`, error);
    throw error;
  }
}

/**
 * エラーバウンダリ付き処理実行
 */
export function safeExecute<T>(
  fn: () => T,
  context: string,
  fallback?: T
): T | undefined {
  try {
    return fn();
  } catch (error) {
    console.error(`🔴 Error in ${context}:`, error);
    
    // 開発環境では詳細情報
    if (process.env.NODE_ENV === 'development') {
      console.error('Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
    }
    
    return fallback;
  }
}

// 開発環境でのデバッグヘルパー
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__safetyLimits = SAFETY_LIMITS;
  (window as any).__checkMemory = () => MemoryGuard.check('Manual check');
}