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
      {/* Modern Minimalist Vector Arch & Crescent Mark */}
      <div
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '12px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
          boxShadow: '0 2px 8px rgba(6, 95, 70, 0.18)',
          transition: 'transform 0.2s ease',
        }}
      >
        <svg
          width={dimensions.imgSize * 0.62}
          height={dimensions.imgSize * 0.62}
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Elegant Pointed Islamic Arch (Mihrab) */}
          <path
            d="M 8 30 L 8 18 C 8 11.5 12.5 7 18 3.5 C 23.5 7 28 11.5 28 18 L 28 30"
            stroke="#ffffff"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Inner Slender Mihrab Line */}
          <path
            d="M 12.5 30 L 12.5 19 C 12.5 14 15.5 10.5 18 8.5 C 20.5 10.5 23.5 14 23.5 19 L 23.5 30"
            stroke="#fde68a"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.85"
          />
          {/* Golden Crescent at the Apex */}
          <path
            d="M 16.2 3.8 C 16.8 2.2 18.5 1.5 19.8 2.2 C 18.8 2.4 18 3.2 18 4.2 C 18 5.2 18.8 6 19.8 6.2 C 18.5 6.9 16.8 6.2 16.2 4.6 Z"
            fill="#fbbf24"
          />
          {/* Ground / Foundation Line */}
          <line x1="5" y1="30" x2="31" y2="30" stroke="#ffffff" strokeWidth="2.2" strokeLinecap="round" />
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
                color: '#065f46',
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
