'use client';

import Link from 'next/link';
import { Menu, Bell, User } from 'lucide-react';

interface PageHeaderProps {
  onMenuClick?: () => void;
}

export default function PageHeader({ onMenuClick }: PageHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-white flex items-center justify-between px-3 sm:px-4">
      {/* 左側: ハンバーガーメニュー + タイトル */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={18} className="text-gray-600 sm:w-5 sm:h-5" />
        </button>
        <span className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          Dandori Scheduler
        </span>
      </div>

      {/* 右側: 職人管理 + 設定 + 通知 + ユーザー */}
      <div className="flex items-center gap-2 sm:gap-4">
        <Link href="/workers" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900">
          <span className="text-sm sm:text-base">職人管理</span>
        </Link>
        
        <Link href="/settings" className="p-2 hover:bg-gray-100 rounded-lg text-gray-600 hover:text-gray-900">
          <span className="text-sm sm:text-base">設定</span>
        </Link>
        
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={18} className="text-gray-600 sm:w-5 sm:h-5" />
          <span className="absolute top-0.5 right-0.5 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <User size={18} className="text-gray-600 sm:w-5 sm:h-5" />
        </button>
      </div>
    </header>
  );
}