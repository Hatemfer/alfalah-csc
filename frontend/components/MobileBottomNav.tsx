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
          const activeColor = item.highlight ? '#dc2626' : '#059669';
          const activeBg = item.highlight ? '#fee2e2' : '#ecfdf5';

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
                padding: '0.25rem 0.2rem',
                borderRadius: '8px',
                color: item.isActive ? activeColor : '#64748b',
                transition: 'all 0.15s ease',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '32px',
                  height: '32px',
                  borderRadius: '9999px',
                  backgroundColor: item.isActive ? activeBg : 'transparent',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <Icon
                  size={19}
                  fill={item.isActive ? 'currentColor' : 'none'}
                  strokeWidth={item.isActive ? 2.4 : 1.9}
                  style={{ color: !item.isActive && item.highlight ? '#ef4444' : 'inherit' }}
                />
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: item.isActive ? 800 : 600,
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
