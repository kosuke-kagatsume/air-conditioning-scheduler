'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Responsive } from './Visibility';
import ErrorBoundary from './ErrorBoundary';

// 動的インポート（コード分割）
// TODO: FullCalendar導入時に有効化
// const MobileCalendar = dynamic(() => import('./MobileCalendar'), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center p-8">
//       <div className="text-sm text-gray-600">カレンダーを読み込み中...</div>
//     </div>
//   ),
// });

// const DesktopCalendar = dynamic(() => import('./DesktopCalendar'), {
//   ssr: false,
//   loading: () => (
//     <div className="flex items-center justify-center p-8">
//       <div className="text-sm text-gray-600">カレンダーを読み込み中...</div>
//     </div>
//   ),
// });

// 既存のImprovedCalendarFixedもフォールバックとして使用可能
const ImprovedCalendar = dynamic(() => import('./ImprovedCalendarFixed'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center p-8">
      <div className="text-sm text-gray-600">カレンダーを読み込み中...</div>
    </div>
  ),
});

interface ResponsiveCalendarProps {
  events?: any[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (event: any) => void;
  onAddEvent?: () => void;
  useFullCalendar?: boolean; // FullCalendar使用フラグ
}

export default function ResponsiveCalendar({ 
  events = [], 
  onDateClick, 
  onEventClick, 
  onAddEvent,
  useFullCalendar = false 
}: ResponsiveCalendarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const [eventCount, setEventCount] = useState(0);

  useEffect(() => {
    setIsMounted(true);
    setEventCount(events.length);
  }, [events]);

  if (!isMounted) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-gray-600">準備中...</div>
      </div>
    );
  }

  // FullCalendarを使う場合（TODO: FullCalendar導入時に有効化）
  // if (useFullCalendar) {
  //   return (
  //     <Responsive
  //       desktop={<DesktopCalendar events={events} onDateClick={onDateClick} onEventClick={onEventClick} />}
  //       mobile={
  //         // イベント数が多い場合はlistDayビューを推奨
  //         eventCount > 20 ? (
  //           <MobileCalendar events={events} onDateClick={onDateClick} onEventClick={onEventClick} />
  //         ) : (
  //           <MobileCalendar events={events} onDateClick={onDateClick} onEventClick={onEventClick} />
  //         )
  //       }
  //     />
  //   );
  // }

  // 既存のカスタムカレンダーを使う場合
  return (
    <ErrorBoundary>
      <div className="calendar-scroll">
        <ImprovedCalendar 
          events={events}
          onDateClick={onDateClick || ((date: Date) => {})}
          onEventClick={onEventClick || ((event: any) => {})}
          onAddEvent={onAddEvent || (() => {})}
        />
      </div>
    </ErrorBoundary>
  );
}