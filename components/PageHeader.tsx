'use client';

import Link from 'next/link';
import { Menu } from 'lucide-react';
import DandoriLogo from '@/components/DandoriLogo';

type Props = { onMenuClick?: () => void };

export default function PageHeader({ onMenuClick }: Props) {
  return (
    <header className="w-full border-b bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center">
        {/* デスクトップ（全画面）: 40x40 ロゴのみ */}
        <div className="flex items-center">
          <Link href="/demo" aria-label="ホーム">
            <DandoriLogo size={40} />
          </Link>
        </div>
      </div>
    </header>
  );
}