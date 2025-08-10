'use client'

export default function FrogLogo({ size = 40 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
      {/* カエルの形 */}
      <defs>
        <clipPath id="frogClip">
          {/* 体 */}
          <ellipse cx="50" cy="55" rx="38" ry="35"/>
          {/* 左目の突起 */}
          <ellipse cx="30" cy="30" rx="12" ry="15"/>
          {/* 右目の突起 */}
          <ellipse cx="70" cy="30" rx="12" ry="15"/>
          {/* 左足 */}
          <ellipse cx="25" cy="75" rx="15" ry="8" transform="rotate(-20 25 75)"/>
          {/* 右足 */}
          <ellipse cx="75" cy="75" rx="15" ry="8" transform="rotate(20 75 75)"/>
        </clipPath>
      </defs>
      
      {/* カラフルな横縞 */}
      <g clipPath="url(#frogClip)">
        <rect x="0" y="0" width="100" height="11" fill="#FF8C42"/>
        <rect x="0" y="11" width="100" height="11" fill="#D4A574"/>
        <rect x="0" y="22" width="100" height="11" fill="#E91E63"/>
        <rect x="0" y="33" width="100" height="11" fill="#00BCD4"/>
        <rect x="0" y="44" width="100" height="11" fill="#8BC34A"/>
        <rect x="0" y="55" width="100" height="11" fill="#FFC107"/>
        <rect x="0" y="66" width="100" height="11" fill="#E74C3C"/>
        <rect x="0" y="77" width="100" height="11" fill="#FF8C42"/>
        <rect x="0" y="88" width="100" height="12" fill="#00BCD4"/>
      </g>
      
      {/* 目 */}
      <circle cx="30" cy="32" r="4" fill="white"/>
      <circle cx="30" cy="32" r="2.5" fill="black"/>
      <circle cx="70" cy="32" r="4" fill="white"/>
      <circle cx="70" cy="32" r="2.5" fill="black"/>
    </svg>
  )
}