/**
 * 最適化された日付ユーティリティ
 * 頻繁に使用される日付計算を効率化
 */

import { memoize } from './cache';

/**
 * 月の日数を取得（メモ化済み）
 */
export const getDaysInMonth = memoize((year: number, month: number): number => {
  return new Date(year, month + 1, 0).getDate();
}, { ttl: 60 * 60 * 1000 }); // 1時間キャッシュ

/**
 * 月の最初の曜日を取得（メモ化済み）
 */
export const getFirstDayOfMonth = memoize((year: number, month: number): number => {
  return new Date(year, month, 1).getDay();
}, { ttl: 60 * 60 * 1000 });

/**
 * 日付をYYYY-MM-DD形式にフォーマット（高速版）
 */
export function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * 日付文字列をパース（キャッシュ付き）
 */
const parseDateCache = new Map<string, Date>();
export function parseDate(dateStr: string): Date {
  let date = parseDateCache.get(dateStr);
  if (!date) {
    date = new Date(dateStr);
    // キャッシュサイズ制限
    if (parseDateCache.size > 1000) {
      const firstKey = parseDateCache.keys().next().value;
      if (firstKey) {
        parseDateCache.delete(firstKey);
      }
    }
    parseDateCache.set(dateStr, date);
  }
  return new Date(date); // コピーを返す
}

/**
 * 日付が同じかチェック（高速版）
 */
export function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

/**
 * 日付範囲内かチェック
 */
export function isDateInRange(date: Date, start: Date, end: Date): boolean {
  const dateTime = date.getTime();
  return dateTime >= start.getTime() && dateTime <= end.getTime();
}

/**
 * 週の開始日を取得（日曜始まり）
 */
export function getWeekStart(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() - day);
  result.setHours(0, 0, 0, 0);
  return result;
}

/**
 * 週の終了日を取得（土曜終わり）
 */
export function getWeekEnd(date: Date): Date {
  const result = new Date(date);
  const day = result.getDay();
  result.setDate(result.getDate() + (6 - day));
  result.setHours(23, 59, 59, 999);
  return result;
}

/**
 * 月の開始日を取得
 */
export function getMonthStart(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

/**
 * 月の終了日を取得
 */
export function getMonthEnd(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
}

/**
 * 日付配列を生成（メモ化済み）
 */
export const generateDateRange = memoize(
  (start: string, end: string): Date[] => {
    const dates: Date[] = [];
    const startDate = new Date(start);
    const endDate = new Date(end);
    const current = new Date(startDate);
    
    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  },
  { ttl: 5 * 60 * 1000, maxSize: 50 }
);

/**
 * 相対日付を取得（今日、明日、など）
 */
export function getRelativeDateLabel(date: Date): string | null {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  switch (diffDays) {
    case 0: return '今日';
    case 1: return '明日';
    case 2: return '明後日';
    case -1: return '昨日';
    case -2: return '一昨日';
    default: return null;
  }
}

/**
 * 営業日を計算（土日を除く）
 */
export function addBusinessDays(date: Date, days: number): Date {
  const result = new Date(date);
  let addedDays = 0;
  
  while (addedDays < days) {
    result.setDate(result.getDate() + 1);
    const dayOfWeek = result.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) { // 土日以外
      addedDays++;
    }
  }
  
  return result;
}

/**
 * 日付の差分を計算
 */
export function dateDiff(date1: Date, date2: Date, unit: 'days' | 'hours' | 'minutes' = 'days'): number {
  const diff = Math.abs(date2.getTime() - date1.getTime());
  
  switch (unit) {
    case 'days':
      return Math.floor(diff / (1000 * 60 * 60 * 24));
    case 'hours':
      return Math.floor(diff / (1000 * 60 * 60));
    case 'minutes':
      return Math.floor(diff / (1000 * 60));
    default:
      return diff;
  }
}

// 開発環境でのデバッグヘルパー
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  (window as any).__dateUtils = {
    parseDateCache,
    cacheSize: () => parseDateCache.size,
    clearCache: () => parseDateCache.clear()
  };
}