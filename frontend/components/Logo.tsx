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
      {/* Distinctive Mosque Silhouette Mark (Lighter, Vibrant & Prestigious) */}
      <div
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '14px',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          boxShadow: '0 3px 10px rgba(16, 185, 129, 0.28)',
          transition: 'transform 0.2s ease',
        }}
      >
        <svg
          width={dimensions.imgSize * 0.72}
          height={dimensions.imgSize * 0.72}
          viewBox="0 0 44 44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Subtle Star of Guidance Glow behind Dome */}
          <circle cx="22" cy="19" r="8" fill="#ffffff" fillOpacity="0.15" />

          {/* Central Mosque Dome */}
          <path
            d="M 13 28 C 13 19, 17.5 13.5, 22 11 C 26.5 13.5, 31 19, 31 28 Z"
            fill="#ffffff"
          />

          {/* Dome Golden Crescent & Star Finial */}
          <path
            d="M 21.2 9.8 C 21.5 8.2 23 7.5 24.2 8.1 C 23.4 8.3 22.7 9 22.7 9.9 C 22.7 10.8 23.4 11.5 24.2 11.7 C 23 12.3 21.5 11.6 21.2 9.8 Z"
            fill="#fbbf24"
          />
          <circle cx="22" cy="6.8" r="0.8" fill="#fef08a" />

          {/* Left Minaret with Balcony & Spire */}
          <rect x="6.5" y="16" width="4" height="15" rx="0.75" fill="#ffffff" fillOpacity="0.95" />
          <path d="M 6 16 L 8.5 9.5 L 11 16 Z" fill="#fbbf24" />
          <circle cx="8.5" cy="8.8" r="0.75" fill="#fef08a" />
          <line x1="5.5" y1="20" x2="11.5" y2="20" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />

          {/* Right Minaret with Balcony & Spire */}
          <rect x="33.5" y="16" width="4" height="15" rx="0.75" fill="#ffffff" fillOpacity="0.95" />
          <path d="M 33 16 L 35.5 9.5 L 38 16 Z" fill="#fbbf24" />
          <circle cx="35.5" cy="8.8" r="0.75" fill="#fef08a" />
          <line x1="32.5" y1="20" x2="38.5" y2="20" stroke="#f59e0b" strokeWidth="1" strokeLinecap="round" />

          {/* Central Welcoming Mihrab Arch (Doorway to Community) */}
          <path
            d="M 18.5 31 L 18.5 24.5 C 18.5 22 20 20 22 19 C 24 20 25.5 22 25.5 24.5 L 25.5 31 Z"
            fill="#059669"
          />
          <path
            d="M 19.8 31 L 19.8 25.5 C 19.8 23.5 20.8 21.8 22 21 C 23.2 21.8 24.2 23.5 24.2 25.5 L 24.2 31 Z"
            fill="#fbbf24"
            fillOpacity="0.85"
          />

          {/* Ground Foundation Line */}
          <rect x="4" y="31" width="36" height="2" rx="1" fill="#ffffff" />
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
