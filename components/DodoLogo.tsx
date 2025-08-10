'use client'

export default function DodoLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* ドードー鳥の形 */}
      <defs>
        <clipPath id="dodoClip">
          {/* 体 */}
          <ellipse cx="50" cy="60" rx="30" ry="35"/>
          {/* 頭 */}
          <ellipse cx="50" cy="30" rx="20" ry="22"/>
          {/* くちばし */}
          <path d="M 30 28 Q 20 30, 22 35 L 30 33 Z"/>
          {/* 尾 */}
          <path d="M 75 65 Q 85 70, 80 75 Q 75 70, 70 68 Z"/>
          {/* 足 */}
          <rect x="40" y="85" width="8" height="15" rx="3"/>
          <rect x="52" y="85" width="8" height="15" rx="3"/>
        </clipPath>
      </defs>
      
      {/* カラフルな横縞 */}
      <g clipPath="url(#dodoClip)">
        <rect x="0" y="0" width="100" height="11" fill="#FF8C42"/>
        <rect x="0" y="11" width="100" height="11" fill="#D4A574"/>
        <rect x="0" y="22" width="100" height="11" fill="#E91E63"/>
        <rect x="0" y="33" width="100" height="11" fill="#00BCD4"/>
        <rect x="0" y="44" width="100" height="11" fill="#8BC34A"/>
        <rect x="0" y="55" width="100" height="11" fill="#C94B4B"/>
        <rect x="0" y="66" width="100" height="11" fill="#FFC107"/>
        <rect x="0" y="77" width="100" height="11" fill="#FF8C42"/>
        <rect x="0" y="88" width="100" height="12" fill="#E91E63"/>
      </g>
      
      {/* 目 */}
      <circle cx="42" cy="28" r="3" fill="white"/>
      <circle cx="42" cy="28" r="2" fill="black"/>
    </svg>
  )
}