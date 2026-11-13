import React from 'react';

interface AlfalahSimpleLogoSvgProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AlfalahSimpleLogoSvg({
  size = 46,
  className,
  style,
}: AlfalahSimpleLogoSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="Alfalah Community Support Centre Crest"
    >
      <defs>
        {/* Modern Sky Blue Gradient */}
        <linearGradient id="emblemBlue" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3988CA" />
          <stop offset="100%" stopColor="#18334F" />
        </linearGradient>

        {/* Warm Golden Accent Gradient */}
        <linearGradient id="emblemGold" x1="0" y1="0" x2="100" y2="100" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
      </defs>

      {/* Outer Sky Blue Roundel */}
      <circle cx="50" cy="50" r="47" fill="url(#emblemBlue)" />

      {/* Clean Golden Ring */}
      <circle cx="50" cy="50" r="44.5" stroke="url(#emblemGold)" strokeWidth="1.5" opacity="0.9" />

      {/* Elegant, Minimalist Islamic Mihrab Arch */}
      <path
        d="M 28 74 
           L 28 46 
           C 28 32, 38 23, 50 16 
           C 62 23, 72 32, 72 46 
           L 72 74 
           Z"
        fill="#ffffff"
        opacity="0.98"
      />

      {/* Inner Stepped Arch (Deep Emerald Cutout) */}
      <path
        d="M 34 74 
           L 34 48 
           C 34 37, 42 30, 50 24 
           C 58 30, 66 37, 66 48 
           L 66 74 
           Z"
        fill="#18334F"
      />

      {/* Upward Crescent & Star of Guidance at the Top */}
      <circle cx="50" cy="36" r="3.5" fill="url(#emblemGold)" />
      <path
        d="M 44 43
           C 46 45.5, 54 45.5, 56 43
           C 54 48, 46 48, 44 43 Z"
        fill="url(#emblemGold)"
      />

      {/* Minimalist Open Quran / Pages of Knowledge (Al-Falah = Flourishing) */}
      <path
        d="M 50 56
           C 45 52, 38 53, 35 56
           C 35 60, 42 63, 50 61
           Z"
        fill="#ffffff"
      />
      <path
        d="M 50 56
           C 55 52, 62 53, 65 56
           C 65 60, 58 63, 50 61
           Z"
        fill="#ffffff"
      />
      <line x1="50" y1="55" x2="50" y2="62" stroke="url(#emblemGold)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Wooden Rehal Stand Base */}
      <path
        d="M 42 70 L 58 61 M 58 70 L 42 61"
        stroke="url(#emblemGold)"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <circle cx="50" cy="65.5" r="1.5" fill="#fef08a" />
    </svg>
  );
}
