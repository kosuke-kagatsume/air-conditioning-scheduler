import { Event } from "@/types";

/** UI用に日付をDateへ解決した正規化型 */
export type NormalizedEvent = Event & {
  startAt: Date; // date + startTime
  endAt: Date;   // (endDate || date) + endTime（複数日は最終日の endTime まで）
};

const toDate = (ymd: string, hm = "00:00") => {
  // ymd: "YYYY-MM-DD", hm: "HH:mm"
  return new Date(`${ymd}T${hm}:00`);
};

/** 23:59 を"1分前"として安全に扱うためのヘルパ */
const endTimeOrDefault = (t?: string) => t ?? "23:59";
const startTimeOrDefault = (t?: string) => t ?? "00:00";

/** イベントを Date 付きへ正規化（単日/複数日どちらもOK） */
export function normalizeEvents(events: Event[]): NormalizedEvent[] {
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
}

/** カレンダーが"日毎の行"前提なら、複数日イベントを日単位に展開して返す */
export function explodeMultiDayForDayGrid(events: NormalizedEvent[]) {
  const out: NormalizedEvent[] = [];

  for (const ev of events) {
    const start = new Date(ev.startAt);
    const end = new Date(ev.endAt);

    // "日を跨ぐ"かどうかを判定（同日内ならそのまま push）
    const cursor = new Date(start);
    cursor.setHours(0, 0, 0, 0);

    const lastDay = new Date(end);
    lastDay.setHours(0, 0, 0, 0);

    if (cursor.getTime() === lastDay.getTime()) {
      out.push(ev);
      continue;
    }

    // 複数日：開始日の"その日 end"まで、途中日は終日、最終日は"日頭→end"
    // 1) 開始日
    {
      const dayEnd = new Date(cursor);
      dayEnd.setHours(23, 59, 0, 0);
      out.push({ ...ev, endAt: dayEnd });
    }

    // 2) 中間日
    const mid = new Date(cursor);
    mid.setDate(mid.getDate() + 1);
    while (mid.getTime() < lastDay.getTime()) {
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
  }

  return out;
}