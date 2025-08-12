'use client';

import Link from 'next/link';
import { Menu, Bell, User } from 'lucide-react';

interface PageHeaderProps {
  onMenuClick?: () => void;
}

export default function PageHeader({ onMenuClick }: PageHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 h-14 border-b bg-white flex items-center justify-between px-4">
      {/* 左側: ハンバーガーメニュー + タイトル */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <span className="text-xl font-semibold text-gray-900">
          Dandori Scheduler
        </span>
      </div>

      {/* 右側: 管理者/職人 + 通知 + ユーザー */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <button className="px-3 py-1 text-sm font-medium text-gray-700 bg-gray-100 rounded">
            管理者
          </button>
          <button className="px-3 py-1 text-sm font-medium text-gray-500">
            職人
          </button>
        </div>
        
        <button className="relative p-2 hover:bg-gray-100 rounded-lg">
          <Bell size={20} className="text-gray-600" />
          <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            3
          </span>
        </button>
        
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <User size={20} className="text-gray-600" />
        </button>
      </div>
    </header>
  );
}