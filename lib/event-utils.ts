import { Event } from "@/types";
import { DataQualityMonitor, perfMonitor } from "./monitoring";
import { LoopGuard, checkArraySize, validateDateRange, safeExecute } from "./safety-guards";
import { eventCache, createCacheKey } from "./cache";

/** UI用に日付をDateへ解決した正規化型 */
export type NormalizedEvent = Event & {
  startAt: Date; // date + startTime
  endAt: Date;   // (endDate || date) + endTime（複数日は最終日の endTime まで）
};

const toDate = (ymd: string, hm = "00:00") => {
  // ymd: "YYYY-MM-DD", hm: "HH:mm"
  try {
    const result = new Date(`${ymd}T${hm}:00`);
    
    // 無効な日付をログ（UIには影響しない）
    if (isNaN(result.getTime())) {
      DataQualityMonitor.logInvalidDate(ymd, hm, 'toDate');
      return new Date(); // 安全なフォールバック
    }
    
    return result;
  } catch (error) {
    // エラーをログに記録するが、処理は続行
    console.error('Date parsing error (non-critical):', { ymd, hm, error });
    return new Date();
  }
};

/** 23:59 を"1分前"として安全に扱うためのヘルパ */
const endTimeOrDefault = (t?: string) => t ?? "23:59";
const startTimeOrDefault = (t?: string) => t ?? "00:00";

/** イベントを Date 付きへ正規化（単日/複数日どちらもOK） */
export function normalizeEvents(events: Event[]): NormalizedEvent[] {
  // キャッシュキー生成（イベントのIDリストベース）
  const cacheKey = createCacheKey(
    'normalize',
    events.map(e => `${e.id}:${e.date}:${e.endDate}:${e.startTime}:${e.endTime}`).join(',')
  );
  
  // キャッシュチェック
  const cached = eventCache.get(cacheKey) as NormalizedEvent[] | undefined;
  if (cached) {
    return cached;
  }

  const result = perfMonitor.measure('normalizeEvents', () => {
    // イベント統計をログ（UIには影響なし）
    DataQualityMonitor.logEventStats(events, 'normalizeEvents');
    
    return events.map((e) => {
      const startYmd = e.date;
      const endYmd = e.endDate ?? e.date;

      // 終了時刻が開始時刻よりも早い場合（夜間跨ぎ等）は"翌日"終了とみなす
      const st = startTimeOrDefault(e.startTime);
      const et = endTimeOrDefault(e.endTime);

      const startAt = toDate(startYmd, st);
      let endAt = toDate(endYmd, et);

      if (startYmd === endYmd && et < st) {
        // 例: 22:00 → 06:00（翌日）
        endAt = new Date(endAt.getTime() + 24 * 60 * 60 * 1000);
      }

      return { ...e, startAt, endAt };
    });
  }, { eventCount: events.length });
  
  // キャッシュに保存
  eventCache.set(cacheKey, result);
  return result;
}

/** カレンダーが"日毎の行"前提なら、複数日イベントを日単位に展開して返す */
export function explodeMultiDayForDayGrid(events: NormalizedEvent[]) {
  // キャッシュキー生成
  const cacheKey = createCacheKey(
    'explode',
    events.map(e => `${e.id}:${e.startAt.getTime()}:${e.endAt.getTime()}`).join(',')
  );
  
  // キャッシュチェック
  const cached = eventCache.get(cacheKey) as NormalizedEvent[] | undefined;
  if (cached) {
    return cached;
  }

  const out: NormalizedEvent[] = [];
  let multiDayCount = 0;

  const result = perfMonitor.measure('explodeMultiDayForDayGrid', () => {
    // 入力配列のサイズチェック
    checkArraySize(events, 'explodeMultiDayForDayGrid input');
    
    for (const ev of events) {
      const start = new Date(ev.startAt);
      const end = new Date(ev.endAt);

      // 日付範囲の検証
      if (!validateDateRange(start, end, `Event ${ev.id}`)) {
        console.warn(`Skipping invalid event: ${ev.id}`);
        continue;
      }

      // "日を跨ぐ"かどうかを判定（同日内ならそのまま push）
      const cursor = new Date(start);
      cursor.setHours(0, 0, 0, 0);

      const lastDay = new Date(end);
      lastDay.setHours(0, 0, 0, 0);

      if (cursor.getTime() === lastDay.getTime()) {
        out.push(ev);
        continue;
      }

      multiDayCount++;

      // 複数日：開始日の"その日 end"まで、途中日は終日、最終日は"日頭→end"
      // 1) 開始日
      {
        const dayEnd = new Date(cursor);
        dayEnd.setHours(23, 59, 0, 0);
        out.push({ ...ev, endAt: dayEnd });
      }

      // 2) 中間日（無限ループ防止付き）
      const loopGuard = new LoopGuard(`Event ${ev.id} middle days`, 366); // 最大1年分
      const mid = new Date(cursor);
      mid.setDate(mid.getDate() + 1);
      
      while (mid.getTime() < lastDay.getTime()) {
        loopGuard.check(); // 無限ループチェック
        
        const midStart = new Date(mid);
        midStart.setHours(0, 0, 0, 0);
        const midEnd = new Date(mid);
        midEnd.setHours(23, 59, 0, 0);
        out.push({
          ...ev,
          startAt: midStart,
          endAt: midEnd,
        });
        mid.setDate(mid.getDate() + 1);
      }

      // 3) 最終日
      {
        const finalStart = new Date(lastDay);
        finalStart.setHours(0, 0, 0, 0);
        out.push({ ...ev, startAt: finalStart, endAt: end });
      }
      
      // 出力配列のサイズチェック
      if (out.length > 1000 && out.length % 1000 === 0) {
        checkArraySize(out, 'explodeMultiDayForDayGrid output');
      }
    }

    // メモリ使用量チェック（大量イベント時の監視）
    if (out.length > 500) {
      DataQualityMonitor.logMemoryUsage('explodeMultiDayForDayGrid');
    }

    return out;
  }, { 
    inputEvents: events.length,
    outputEvents: out.length,
    multiDayEvents: multiDayCount 
  });
  
  // キャッシュに保存
  eventCache.set(cacheKey, result);
  return result;
}