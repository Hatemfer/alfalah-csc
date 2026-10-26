import React from 'react';
import Image from 'next/image';
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
    sm: { imgSize: 36, titleSize: '1rem', subSize: '0.65rem', arabicSize: '0.85rem' },
    md: { imgSize: 48, titleSize: '1.2rem', subSize: '0.7rem', arabicSize: '1rem' },
    lg: { imgSize: 68, titleSize: '1.5rem', subSize: '0.8rem', arabicSize: '1.25rem' },
  }[size];

  const content = (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.75rem',
        textDecoration: 'none',
      }}
    >
      {/* Emblem Roundel */}
      <div
        style={{
          width: dimensions.imgSize,
          height: dimensions.imgSize,
          borderRadius: '50%',
          flexShrink: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          filter: 'drop-shadow(0 2px 6px rgba(5, 150, 105, 0.25))',
        }}
      >
        <Image
          src="/images/logo-emblem.png"
          alt="Alfalah Community Support Centre Crest"
          width={dimensions.imgSize}
          height={dimensions.imgSize}
          style={{ width: '100%', height: '100%', objectFit: 'contain' }}
          priority
        />
      </div>

      {/* Typography */}
      {variant !== 'compact' && (
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
            <span
              style={{
                fontSize: dimensions.titleSize,
                fontWeight: 800,
                color: 'var(--color-primary-700)',
                letterSpacing: '-0.02em',
              }}
            >
              ALFALAH
            </span>
            <span
              className="arabic-title"
              style={{
                fontSize: dimensions.arabicSize,
                color: 'var(--color-accent-600)',
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
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
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
      <Link href="/" style={{ textDecoration: 'none', display: 'inline-block' }}>
        {content}
      </Link>
    );
  }

  return content;
}
