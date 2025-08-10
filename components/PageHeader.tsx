'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import DandoriLogo from '@/components/DandoriLogo';

type Props = { onMenuClick?: () => void };

export default function PageHeader({ onMenuClick }: Props) {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        {/* モバイル（≤ md）: ハンバーガー + タイトル */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            type="button"
            aria-label="メニューを開く"
            onClick={onMenuClick}
            className="p-2 -ml-2"
          >
            <Menu size={24} />
          </button>
          <span className="text-lg font-semibold text-slate-800">
            Dandori Scheduler
          </span>
        </div>

        {/* デスクトップ（≥ md）: 40x40 ロゴのみ */}
        <div className="hidden md:flex items-center">
          <Link href="/" aria-label="ホーム">
            <DandoriLogo size={40} />
          </Link>
        </div>

        {/* 右側スペーサー（将来のアクション領域） */}
        <div className="w-10 h-10" />
      </div>
    </header>
  );
}