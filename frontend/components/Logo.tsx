import React from 'react';
import Link from 'next/link';
import { AlfalahSimpleLogoSvg } from './AlfalahSimpleLogoSvg';

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
    sm: { imgSize: 38, titleSize: '1.05rem', subSize: '0.62rem', arabicSize: '0.85rem' },
    md: { imgSize: 46, titleSize: '1.25rem', subSize: '0.68rem', arabicSize: '1rem' },
    lg: { imgSize: 60, titleSize: '1.5rem', subSize: '0.78rem', arabicSize: '1.25rem' },
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
      {/* Clean Modern Islamic Vector Emblem */}
      <div
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 2px 6px rgba(6, 95, 70, 0.2))',
          transition: 'transform 0.2s ease',
        }}
      >
        <AlfalahSimpleLogoSvg size={dimensions.imgSize} />
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
              className="arabic-title"
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
