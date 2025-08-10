'use client'

export default function DandoriLogo({ size = 40 }: { size?: number }) {
  // 元のサイズを基準にスケールを計算
  const scale = size / 40
  
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 40 40" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 上段のバー（オレンジ） */}
      <rect x="8" y="10" width="24" height="3" rx="1.5" fill="#FF6B35"/>
      
      {/* 中段のバー（ティール） */}
      <rect x="8" y="16" width="24" height="3" rx="1.5" fill="#00BFA5"/>
      
      {/* 下段のバー（オレンジ） */}
      <rect x="8" y="22" width="18" height="3" rx="1.5" fill="#FF6B35"/>
      
      {/* 右下のドット（ティール） */}
      <circle cx="30" cy="23.5" r="2.5" fill="#00BFA5"/>
    </svg>
  )
}