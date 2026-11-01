import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'full' | 'compact' | 'stacked';
  size?: 'sm' | 'md' | 'lg';
  linkToHome?: boolean;
}

export function Logo({
  variant = 'full',
  size = 'md',
  linkToHome = true,
}: LogoProps) {
  const dimensions = {
    sm: { imgSize: 42, titleSize: '1.05rem', subSize: '0.62rem', arabicSize: '0.85rem' },
    md: { imgSize: 50, titleSize: '1.25rem', subSize: '0.68rem', arabicSize: '1rem' },
    lg: { imgSize: 64, titleSize: '1.5rem', subSize: '0.78rem', arabicSize: '1.25rem' },
  }[size];

  const content = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
        outline: 'none',
      }}
    >
      {/* Prestigious Circular Charity Seal */}
      <div
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          boxShadow: '0 3px 12px rgba(16, 185, 129, 0.16), 0 1px 4px rgba(0, 0, 0, 0.05)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          position: 'relative',
        }}
      >
        <svg
          width={dimensions.imgSize}
          height={dimensions.imgSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <defs>
            {/* Luminous Emerald Gradient */}
            <linearGradient id="sealEmerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>

            {/* Warm Polished Gold Gradient */}
            <linearGradient id="sealGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="60%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
          </defs>

          {/* Crisp White Medallion Base */}
          <circle cx="50" cy="50" r="48" fill="#ffffff" />

          {/* Outer Prestigious Emerald Ring */}
          <circle cx="50" cy="50" r="46.5" stroke="url(#sealEmerald)" strokeWidth="2" />

          {/* Inner Refined Champagne Gold Ring */}
          <circle cx="50" cy="50" r="43" stroke="url(#sealGold)" strokeWidth="0.9" strokeOpacity="0.9" />

          {/* Subtle Islamic Sacred Geometry Micro-Pattern */}
          <circle cx="50" cy="50" r="40" stroke="#d1fae5" strokeWidth="0.8" strokeDasharray="1.5,3.5" />

          {/* Central Mosque Dome */}
          <path
            d="M 33 60 C 33 45, 41 38, 50 32 C 59 38, 67 45, 67 60 Z"
            fill="url(#sealEmerald)"
          />

          {/* Dome Spire & Upward Golden Crescent Finial */}
          <line x1="50" y1="32" x2="50" y2="25" stroke="url(#sealGold)" strokeWidth="1.8" strokeLinecap="round" />
          <path
            d="M 46.8 24.5 C 47.6 22.2 49.8 21.2 52.2 22.1 C 51 22.5 50.2 23.5 50.2 24.7 C 50.2 25.9 51 26.9 52.2 27.3 C 49.8 28.2 47.6 27.2 46.8 24.5 Z"
            fill="url(#sealGold)"
          />
          <circle cx="50" cy="20.5" r="1.3" fill="#fbbf24" />

          {/* Left Minaret with Balcony & Golden Spire */}
          <path d="M 23 62 L 23 42 L 26.5 42 L 26.5 62 Z" fill="url(#sealEmerald)" />
          <line x1="21.5" y1="42" x2="28" y2="42" stroke="url(#sealGold)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 22 42 L 24.7 34 L 27.5 42 Z" fill="url(#sealGold)" />
          <circle cx="24.7" cy="32.5" r="1" fill="#fde68a" />

          {/* Right Minaret with Balcony & Golden Spire */}
          <path d="M 73.5 62 L 73.5 42 L 77 42 L 77 62 Z" fill="url(#sealEmerald)" />
          <line x1="72" y1="42" x2="78.5" y2="42" stroke="url(#sealGold)" strokeWidth="1.4" strokeLinecap="round" />
          <path d="M 72.5 42 L 75.3 34 L 78 42 Z" fill="url(#sealGold)" />
          <circle cx="75.3" cy="32.5" r="1" fill="#fde68a" />

          {/* Welcoming Open Mihrab Doorway */}
          <path
            d="M 44 65 L 44 54 C 44 49.5, 46.5 47, 50 45 C 53.5 47, 56 49.5, 56 54 L 56 65 Z"
            fill="#ffffff"
          />
          <path
            d="M 46 65 L 46 55 C 46 51.5, 48 49.5, 50 48 C 52 49.5, 54 51.5, 54 55 L 54 65"
            stroke="url(#sealGold)"
            strokeWidth="1.2"
            fill="none"
            strokeLinecap="round"
          />

          {/* Open Quran of Knowledge & Wisdom (Flourishing / Al-Falah) */}
          <path
            d="M 49.5 64 C 44 60.5, 37.5 61, 33 64 C 33 67.5, 40 70, 49.5 68 Z"
            fill="#ffffff"
            stroke="url(#sealEmerald)"
            strokeWidth="1.1"
          />
          <path
            d="M 50.5 64 C 56 60.5, 62.5 61, 67 64 C 67 67.5, 60 70, 50.5 68 Z"
            fill="#ffffff"
            stroke="url(#sealEmerald)"
            strokeWidth="1.1"
          />
          {/* Rehal Stand */}
          <path d="M 40.5 74 L 50 68 L 59.5 74" stroke="url(#sealGold)" strokeWidth="1.5" strokeLinecap="round" fill="none" />

          {/* Lower Classical Gold Baseline Ribbon */}
          <path d="M 28 78 C 36 82.5, 64 82.5, 72 78" stroke="url(#sealGold)" strokeWidth="1.4" strokeLinecap="round" fill="none" />
        </svg>
      </div>

      {/* Typography: Clean, Modern, Prestigious */}
      {variant !== 'compact' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem' }}>
            <span
              style={{
                fontSize: dimensions.titleSize,
                fontWeight: 800,
                color: '#0f172a',
                letterSpacing: '-0.02em',
              }}
            >
              AL FALAH
            </span>
            <span
              className="arabic-title logo-arabic"
              style={{
                fontSize: dimensions.arabicSize,
                color: '#059669',
                fontWeight: 700,
              }}
            >
              مركز الفلاح
            </span>
          </div>
          <span
            style={{
              fontSize: dimensions.subSize,
              fontWeight: 700,
              letterSpacing: '0.07em',
              color: '#64748b',
              textTransform: 'uppercase',
              marginTop: '1px',
            }}
          >
            Community Support Centre
          </span>
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link href="/" style={{ textDecoration: 'none', display: 'inline-block', outline: 'none' }}>
        {content}
      </Link>
    );
  }

  return content;
}
