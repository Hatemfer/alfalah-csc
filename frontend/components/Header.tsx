'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from './ThemeToggle';
import { Logo } from './Logo';
import { Menu, X, Compass, Clock, Heart, ShieldCheck } from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Prayer Times', href: '/prayer-times', icon: Clock },
  { label: 'Qibla', href: '/qibla', icon: Compass },
  { label: 'Activities', href: '/activities' },
  { label: 'Events', href: '/events' },
  { label: 'Announcements', href: '/announcements' },
  { label: 'Donate', href: '/donate', icon: Heart },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backgroundColor: 'var(--nav-bg)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)',
        transition: 'background-color var(--transition-normal)',
      }}
    >
      {/* Top Banner with Charity Registration & Quick Info */}
      <div
        style={{
          backgroundColor: 'var(--color-primary-800)',
          color: '#ffffff',
          padding: '0.35rem 1rem',
          fontSize: '0.8rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
            <ShieldCheck size={14} style={{ color: 'var(--color-accent-400)' }} />
            Registered UK Charity <strong>#1150221</strong>
          </span>
          <span style={{ opacity: 0.8 }}>|</span>
          <span style={{ opacity: 0.9 }}>Balsall Heath, Birmingham B12 9QU</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span className="arabic-title" style={{ fontSize: '0.95rem', color: '#e2f5ec' }}>
            مركز الفلاح الإسلامي
          </span>
          <Link
            href="/admin"
            style={{
              fontSize: '0.75rem',
              color: '#d1fae5',
              textDecoration: 'underline',
              opacity: 0.9,
            }}
          >
            Staff Portal
          </Link>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem' }}>
        {/* Brand Logo & Emblem */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.5rem',
          }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary-600)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--color-primary-600)' : '2px solid transparent',
                  padding: '0.25rem 0',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {Icon && <Icon size={15} />}
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Theme Switcher + Donate CTA + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <ThemeToggle />

          <Link
            href="/donate"
            className="btn btn-accent"
            style={{
              padding: '0.45rem 1rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)',
              display: 'none',
              alignItems: 'center',
              gap: '0.35rem',
              fontWeight: 800,
              boxShadow: '0 2px 8px rgba(217, 119, 6, 0.35)',
            }}
            id="header-donate-cta"
          >
            <Heart size={14} style={{ fill: 'currentColor' }} />
            Donate
          </Link>

          <Link
            href="/prayer-times"
            className="btn btn-primary"
            style={{
              padding: '0.45rem 0.9rem',
              fontSize: '0.85rem',
              borderRadius: 'var(--radius-full)',
              display: 'none',
            }}
            id="header-prayer-cta"
          >
            <Clock size={14} />
            Prayer Times
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle mobile navigation menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              padding: '0.5rem',
            }}
            className="mobile-toggle"
          >
            {mobileOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem',
          }}
        >
          <Link
            href="/donate"
            onClick={() => setMobileOpen(false)}
            className="btn btn-accent"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontWeight: 800,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
            }}
          >
            <Heart size={16} style={{ fill: 'currentColor' }} />
            Donate to Support Centre
          </Link>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: pathname === item.href ? 700 : 500,
                color: pathname === item.href ? 'var(--color-primary-600)' : 'var(--text-primary)',
                padding: '0.45rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {item.label}
            </Link>
          ))}
          <div style={{ paddingTop: '0.5rem' }}>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '0.9rem',
                color: 'var(--text-muted)',
                display: 'block',
              }}
            >
              Administrator & Staff Login →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
          #header-donate-cta {
            display: inline-flex !important;
          }
          #header-prayer-cta {
            display: inline-flex !important;
          }
        }
      `}</style>
    </header>
  );
}
