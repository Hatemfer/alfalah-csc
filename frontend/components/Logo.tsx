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
    sm: { imgSize: 48, titleSize: '1.18rem', subSize: '0.62rem', arabicSize: '1.05rem', gap: '0.85rem' },
    md: { imgSize: 60, titleSize: '1.42rem', subSize: '0.68rem', arabicSize: '1.25rem', gap: '1rem' },
    lg: { imgSize: 76, titleSize: '1.75rem', subSize: '0.8rem', arabicSize: '1.45rem', gap: '1.25rem' },
  }[size];

  const content = (
    <div
      className="logo-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: dimensions.gap,
        textDecoration: 'none',
        outline: 'none',
      }}
    >
      {/* Authentic Al Falah Historical Emblem */}
      <div
        className="logo-emblem-box"
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ffffff',
          boxShadow: '0 3px 12px rgba(24, 51, 79, 0.08), 0 1px 4px rgba(24, 51, 79, 0.04)',
          border: '1.5px solid #E4EDF5',
          overflow: 'hidden',
          position: 'relative',
          padding: '2px',
        }}
      >
        <img
          src="/images/brand/alfalah-emblem.png"
          alt="Al Falah Community Support Centre Official Emblem"
          width={dimensions.imgSize}
          height={dimensions.imgSize}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            borderRadius: '50%',
            display: 'block',
          }}
        />
      </div>

      {/* Typography: Prestigious, British Registered Charity Aesthetic */}
      {variant !== 'compact' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.45rem', flexWrap: 'nowrap' }}>
            <span
              className="logo-title-text"
              style={{
                fontSize: dimensions.titleSize,
                fontWeight: 800,
                color: '#18334F',
                letterSpacing: '-0.025em',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
              }}
            >
              AL FALAH
            </span>
            <span
              className="arabic-title logo-arabic"
              style={{
                fontFamily: 'Amiri, Georgia, serif',
                fontSize: dimensions.arabicSize,
                color: '#3988CA',
                fontWeight: 700,
                letterSpacing: '0.02em',
                whiteSpace: 'nowrap',
              }}
            >
              مركز الفلاح
            </span>
          </div>
          <span
            className="logo-sub-text"
            style={{
              fontSize: dimensions.subSize,
              fontWeight: 700,
              letterSpacing: '0.12em',
              color: '#657B91',
              textTransform: 'uppercase',
              marginTop: '2px',
              whiteSpace: 'nowrap',
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
