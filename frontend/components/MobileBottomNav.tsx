'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Heart, Compass, MapPin } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname.startsWith('/admin')) {
    return null;
  }

  const navItems = [
    {
      label: 'Prayers',
      href: '/prayer-times',
      icon: Clock,
      isActive: pathname === '/prayer-times',
    },
    {
      label: 'Donate',
      href: '/donate',
      icon: Heart,
      isActive: pathname === '/donate',
      highlight: true,
    },
    {
      label: 'Qibla',
      href: '/qibla',
      icon: Compass,
      isActive: pathname === '/qibla',
    },
    {
      label: 'Find Us',
      href: '/contact',
      icon: MapPin,
      isActive: pathname === '/contact',
    },
  ];

  return (
    <>
      <nav
        className="mobile-bottom-nav"
        aria-label="Mobile quick actions"
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 999,
          backgroundColor: 'rgba(255, 255, 255, 0.96)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderTop: '1px solid #e2e8f0',
          boxShadow: '0 -4px 16px rgba(0, 0, 0, 0.06)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          padding: '0.45rem 0.5rem calc(0.45rem + env(safe-area-inset-bottom, 0px))',
        }}
      >
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              href={item.href}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.2rem',
                textDecoration: 'none',
                flex: 1,
                padding: '0.3rem',
                borderRadius: '8px',
                color: item.isActive
                  ? '#059669'
                  : item.highlight
                  ? '#e11d48'
                  : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: item.highlight ? '34px' : '26px',
                  height: item.highlight ? '34px' : '26px',
                  borderRadius: item.highlight ? '9999px' : '0',
                  backgroundColor: item.highlight ? '#ffe4e6' : 'transparent',
                }}
              >
                <Icon
                  size={item.highlight ? 18 : 20}
                  fill={item.highlight ? 'currentColor' : 'none'}
                  strokeWidth={item.isActive || item.highlight ? 2.3 : 1.8}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: item.isActive || item.highlight ? 800 : 600,
                  letterSpacing: '0.2px',
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <style jsx global>{`
        @media (min-width: 768px) {
          .mobile-bottom-nav {
            display: none !important;
          }
        }
        @media (max-width: 767px) {
          body {
            padding-bottom: calc(62px + env(safe-area-inset-bottom, 0px)) !important;
          }
        }
      `}</style>
    </>
  );
}
