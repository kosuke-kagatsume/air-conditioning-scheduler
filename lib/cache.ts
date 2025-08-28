/**
 * キャッシング機構
 * 計算結果やAPIレスポンスを効率的にキャッシュ
 */

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  hits: number;
}

interface CacheOptions {
  ttl?: number;           // Time to Live (ms)
  maxSize?: number;       // 最大エントリ数
  onEvict?: (key: string, value: any) => void;
}

/**
 * LRU（Least Recently Used）キャッシュ実装
 */
export class LRUCache<T = any> {
  private cache = new Map<string, CacheEntry<T>>();
  private readonly ttl: number;
  private readonly maxSize: number;
  private readonly onEvict?: (key: string, value: any) => void;

  constructor(options: CacheOptions = {}) {
    this.ttl = options.ttl || 5 * 60 * 1000; // デフォルト5分
    this.maxSize = options.maxSize || 100;
    this.onEvict = options.onEvict;
  }

  /**
   * キャッシュから値を取得
   */
  get(key: string): T | undefined {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return undefined;
    }

    // TTLチェック
    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return undefined;
    }

    // ヒット数を増やし、最後にアクセスされたものとして再追加
    entry.hits++;
    this.cache.delete(key);
    this.cache.set(key, entry);

    if (process.env.NODE_ENV === 'development') {
      console.log(`📦 Cache hit: ${key} (hits: ${entry.hits})`);
    }

    return entry.data;
  }

  /**
   * キャッシュに値を設定
   */
  set(key: string, value: T): void {
    // サイズ制限チェック
    if (this.cache.size >= this.maxSize) {
      this.evictOldest();
    }

    const entry: CacheEntry<T> = {
      data: value,
      timestamp: Date.now(),
      hits: 0
    };

    this.cache.set(key, entry);
  }

  /**
   * キャッシュから削除
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * キャッシュをクリア
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * キャッシュサイズ
   */
  get size(): number {
    return this.cache.size;
  }

  /**
   * キャッシュ統計
   */
  getStats(): {
    size: number;
    totalHits: number;
    averageHits: number;
    oldestEntry: number | null;
  } {
    let totalHits = 0;
    let oldestTimestamp = Infinity;

    this.cache.forEach(entry => {
      totalHits += entry.hits;
      if (entry.timestamp < oldestTimestamp) {
        oldestTimestamp = entry.timestamp;
      }
    });

    return {
      size: this.cache.size,
      totalHits,
      averageHits: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      oldestEntry: oldestTimestamp === Infinity ? null : Date.now() - oldestTimestamp
    };
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > this.ttl;
  }

  private evictOldest(): void {
    // 最も古いエントリを削除（LRU）
    const firstKey = this.cache.keys().next().value;
    if (firstKey) {
      const value = this.cache.get(firstKey);
      this.cache.delete(firstKey);
      
      if (this.onEvict && value) {
        this.onEvict(firstKey, value.data);
      }

      if (process.env.NODE_ENV === 'development') {
        console.log(`🗑️ Cache evicted: ${firstKey}`);
      }
    }
  }
}

/**
 * 関数結果のメモ化デコレータ
 */
export function memoize<T extends (...args: any[]) => any>(
  fn: T,
  options: CacheOptions = {}
): T {
  const cache = new LRUCache(options);

  return ((...args: Parameters<T>): ReturnType<T> => {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached !== undefined) {
      return cached as ReturnType<T>;
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  }) as T;
}

/**
 * 非同期関数のメモ化
 */
export function memoizeAsync<T extends (...args: any[]) => Promise<any>>(
  fn: T,
  options: CacheOptions = {}
): T {
  const cache = new LRUCache<Promise<any>>(options);
  const pendingCache = new Map<string, Promise<any>>();

  return (async (...args: Parameters<T>): Promise<ReturnType<T>> => {
    const key = JSON.stringify(args);
    
    // キャッシュチェック
    const cached = cache.get(key);
    if (cached !== undefined) {
      return cached as ReturnType<T>;
    }

    // 実行中のPromiseがあればそれを返す（重複実行防止）
    const pending = pendingCache.get(key);
    if (pending) {
      return pending as ReturnType<T>;
    }

    // 新規実行
    const promise = fn(...args);
    pendingCache.set(key, promise);

    try {
      const result = await promise;
      cache.set(key, Promise.resolve(result));
      return result;
    } finally {
      pendingCache.delete(key);
    }
  }) as T;
}

/**
 * 計算結果キャッシュ（グローバル）
 */
export const globalCache = new LRUCache({
  ttl: 10 * 60 * 1000, // 10分
  maxSize: 500
});

/**
 * イベント処理用キャッシュ
 */
export const eventCache = new LRUCache({
  ttl: 60 * 1000, // 1分（頻繁に更新される可能性）
  maxSize: 200
});

/**
 * キャッシュキー生成ヘルパー
 */
export function createCacheKey(...parts: any[]): string {
  return parts.map(p => 
    typeof p === 'object' ? JSON.stringify(p) : String(p)
  ).join(':');
}

// 開発環境でのデバッグヘルパー
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__globalCache = globalCache;
  (window as any).__eventCache = eventCache;
  (window as any).__getCacheStats = () => ({
    global: globalCache.getStats(),
    event: eventCache.getStats()
  });
}