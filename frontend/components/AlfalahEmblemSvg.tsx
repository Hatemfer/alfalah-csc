import React from 'react';

interface AlfalahEmblemSvgProps {
  size?: number;
  className?: string;
  style?: React.CSSProperties;
}

export function AlfalahEmblemSvg({
  size = 48,
  className,
  style,
}: AlfalahEmblemSvgProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-label="Masjid & Community Centre Al Falah Official Emblem"
    >
      <defs>
        {/* Emerald Radial & Linear Gradients */}
        <linearGradient id="emeraldGrad" x1="10" y1="10" x2="110" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3988CA" />
          <stop offset="50%" stopColor="#245C91" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>

        {/* Regal Gold Gradients */}
        <linearGradient id="goldGrad" x1="20" y1="10" x2="100" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="25%" stopColor="#f59e0b" />
          <stop offset="70%" stopColor="#d97706" />
          <stop offset="100%" stopColor="#92400e" />
        </linearGradient>

        <linearGradient id="flameGrad" x1="60" y1="42" x2="60" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fef08a" />
        </linearGradient>

        {/* Soft Drop Shadow for Depth */}
        <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" floodColor="#082f49" />
        </filter>
      </defs>

      {/* Outer Golden Medallion Ring */}
      <circle cx="60" cy="60" r="58" fill="url(#emeraldGrad)" stroke="url(#goldGrad)" strokeWidth="3" filter="url(#softShadow)" />

      {/* Decorative Islamic Geometric Inner Ring (Concentric Accent) */}
      <circle cx="60" cy="60" r="51.5" stroke="#fef08a" strokeWidth="0.8" strokeDasharray="2 3" opacity="0.65" />
      <circle cx="60" cy="60" r="48" stroke="url(#goldGrad)" strokeWidth="1.2" opacity="0.9" />

      {/* Stepped Islamic Mihrab Arch (Traditional Masjid Al Falah Architecture) */}
      <path
        d="M 33 88 
           L 33 54 
           C 33 40, 48 30, 60 22 
           C 72 30, 87 40, 87 54 
           L 87 88 
           Z"
        fill="#082f49"
        stroke="url(#goldGrad)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Inner Decorative Arch Foil */}
      <path
        d="M 38 88 
           L 38 56 
           C 38 44, 50 36, 60 29 
           C 70 36, 82 44, 82 56 
           L 82 88"
        stroke="#fef08a"
        strokeWidth="0.8"
        strokeDasharray="2 2"
        fill="none"
        opacity="0.75"
      />

      {/* Arch Base Stepped Foundation */}
      <path d="M 28 88 L 92 88" stroke="url(#goldGrad)" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M 24 92 L 96 92" stroke="url(#goldGrad)" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Golden Crescent & Star at the Crown Apex */}
      <path
        d="M 60 11.5 
           C 62.5 11.5, 64.5 13.5, 64.5 16 
           C 64.5 18.5, 62.5 20.5, 60 20.5 
           C 57.5 20.5, 55.5 18.5, 55.5 16 
           C 55.5 13.5, 57.5 11.5, 60 11.5 Z"
        fill="none"
      />
      {/* Upward Crescent */}
      <path
        d="M 56 12 
           C 58 13.5, 62 13.5, 64 12 
           C 63 15, 60 16, 56 12 Z"
        fill="url(#goldGrad)"
      />
      {/* Micro Star */}
      <circle cx="60" cy="9.5" r="1.2" fill="#fef08a" />

      {/* Flame of Knowledge & Light (An-Nur / Guidance / Al-Falah) */}
      <path
        d="M 60 27
           C 57 32, 54 36, 56 42
           C 58 46, 62 46, 64 42
           C 66 36, 63 32, 60 27 Z"
        fill="url(#flameGrad)"
      />
      {/* Flame Core */}
      <path
        d="M 60 33
           C 58.5 36, 57 38, 58 41
           C 59 43, 61 43, 62 41
           C 63 38, 61.5 36, 60 33 Z"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Open Quran & Sacred Wooden Rehal (Stand of Learning) */}
      {/* Wooden Rehal X-Stand Base */}
      <path
        d="M 44 86 L 76 68 M 76 86 L 44 68"
        stroke="url(#goldGrad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="60" cy="77" r="2" fill="#fef08a" />

      {/* Left Quran Page */}
      <path
        d="M 60 63
           C 54 58, 44 59, 39 63
           C 39 68, 44 73, 60 70
           Z"
        fill="#ffffff"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
      />
      {/* Left Scripture Lines */}
      <path d="M 44 63 C 48 61, 54 61, 57 63" stroke="#245C91" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 44 66 C 48 64, 54 64, 57 66" stroke="#245C91" strokeWidth="0.8" strokeLinecap="round" />

      {/* Right Quran Page */}
      <path
        d="M 60 63
           C 66 58, 76 59, 81 63
           C 81 68, 76 73, 60 70
           Z"
        fill="#ffffff"
        stroke="url(#goldGrad)"
        strokeWidth="1.2"
      />
      {/* Right Scripture Lines */}
      <path d="M 63 63 C 66 61, 72 61, 76 63" stroke="#245C91" strokeWidth="0.8" strokeLinecap="round" />
      <path d="M 63 66 C 66 64, 72 64, 76 66" stroke="#245C91" strokeWidth="0.8" strokeLinecap="round" />

      {/* Central Spine of the Quran */}
      <path d="M 60 62 L 60 71" stroke="#d97706" strokeWidth="1.5" strokeLinecap="round" />

      {/* Rays of Dawn (Al-Falah / Flourishing) spreading outwards */}
      <g stroke="url(#goldGrad)" strokeWidth="0.9" strokeLinecap="round" opacity="0.6">
        <line x1="60" y1="21" x2="60" y2="16" />
        <line x1="49" y1="26" x2="45" y2="23" />
        <line x1="71" y1="26" x2="75" y2="23" />
        <line x1="41" y1="36" x2="36" y2="34" />
        <line x1="79" y1="36" x2="84" y2="34" />
      </g>
    </svg>
  );
}
