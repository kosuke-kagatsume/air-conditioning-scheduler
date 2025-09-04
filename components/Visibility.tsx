'use client';

import { useEffect, useState, ReactNode } from 'react';

/**
 * メディアクエリを監視するカスタムフック
 */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);
  
  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handleChange = () => setMatches(mediaQuery.matches);
    
    // 初期値を設定
    handleChange();
    
    // リスナーを追加
    mediaQuery.addEventListener('change', handleChange);
    
    // クリーンアップ
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [query]);
  
  return matches;
}

interface VisibilityProps {
  children: ReactNode;
}

/**
 * デスクトップでのみ表示するコンポーネント
 * 括弧の不整合を防ぐための安全なラッパー
 */
export const DesktopOnly: React.FC<VisibilityProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? null : <>{children}</>;
};

/**
 * モバイルでのみ表示するコンポーネント
 * 括弧の不整合を防ぐための安全なラッパー
 */
export const MobileOnly: React.FC<VisibilityProps> = ({ children }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return isMobile ? <>{children}</> : null;
};

/**
 * レスポンシブ切り替えコンポーネント
 * デスクトップとモバイルで異なるコンポーネントを表示
 */
export const Responsive: React.FC<{
  desktop: ReactNode;
  mobile: ReactNode;
}> = ({ desktop, mobile }) => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  return <>{isMobile ? mobile : desktop}</>;
};