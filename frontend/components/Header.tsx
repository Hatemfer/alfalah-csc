'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from './Logo';
import {
  Menu,
  X,
  Heart,
  ShieldCheck,
  Calendar,
  Phone,
  Compass,
  MapPin,
  Clock,
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Home', href: '/' },
  { label: 'Prayer Times', href: '/prayer-times' },
  { label: 'Services', href: '/services' },
  { label: 'Academy & Lessons', href: '/activities' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const [formattedDates, setFormattedDates] = useState<{ greg: string; hijri: string }>({
    greg: 'Thursday, 29 October 2026',
    hijri: '18 Jumada I 1448 AH',
  });

  useEffect(() => {
    try {
      const now = new Date();
      const greg = new Intl.DateTimeFormat('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }).format(now);
      const hijri = new Intl.DateTimeFormat('en-GB-u-ca-islamic-umalqura', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      }).format(now);
      setFormattedDates({ greg, hijri });
    } catch {
      // Fallback already set
    }
  }, []);

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
      {/* Top Banner with Charity Registration & Live Dates (Light, Crisp & Dignified) */}
      <div
        style={{
          backgroundColor: '#f8fafc',
          borderBottom: '1px solid #e2e8f0',
          color: '#475569',
          padding: '0.35rem 1rem',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#047857', fontWeight: 700 }}>
            <Calendar size={13} />
            {formattedDates.greg} • {formattedDates.hijri}
          </span>
          <span style={{ opacity: 0.4 }} className="header-meta-desktop">|</span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }} className="header-meta-desktop">
            <ShieldCheck size={13} style={{ color: '#059669' }} />
            Charity <strong>#1150221</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }} className="header-meta-desktop">
            Balsall Heath, Birmingham B12 9QU
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.25rem' }}>
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
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  fontSize: '0.9rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-primary-700)' : 'var(--text-secondary)',
                  borderBottom: isActive ? '2px solid var(--color-primary-700)' : '2px solid transparent',
                  padding: '0.25rem 0',
                  transition: 'color var(--transition-fast)',
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Actions (Donate CTA + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Always visible Donate CTA on mobile and desktop */}
          <Link
            href="/donate"
            className="btn btn-accent header-donate-cta"
            style={{
              padding: '0.45rem 1.15rem',
              fontSize: '0.88rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
              whiteSpace: 'nowrap',
            }}
          >
            <Heart size={14} style={{ fill: 'currentColor' }} />
            <span>Donate</span>
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
              padding: '0.4rem',
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
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
          }}
        >
          <Link
            href="/donate"
            onClick={() => setMobileOpen(false)}
            className="btn btn-accent"
            style={{
              width: '100%',
              padding: '0.85rem',
              fontWeight: 800,
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              marginBottom: '0.5rem',
              borderRadius: 'var(--radius-md)',
            }}
          >
            <Heart size={16} style={{ fill: 'currentColor' }} />
            Donate to Masjid Purchase Appeal
          </Link>

          {/* Mobile Quick Action Buttons Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '0.5rem',
              marginBottom: '0.75rem',
            }}
          >
            <Link
              href="/prayer-times"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.35rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              <Clock size={16} style={{ color: 'var(--color-primary-600)' }} />
              Timetable
            </Link>
            <Link
              href="/qibla"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.35rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              <Compass size={16} style={{ color: 'var(--color-primary-600)' }} />
              Qibla
            </Link>
            <a
              href="https://maps.google.com/?q=89+Tindal+Street,+Birmingham+B12+9QU"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.35rem',
                padding: '0.6rem 0.35rem',
                backgroundColor: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.75rem',
                fontWeight: 600,
                color: 'var(--text-primary)',
                textDecoration: 'none',
              }}
            >
              <MapPin size={16} style={{ color: 'var(--color-primary-600)' }} />
              Find Us
            </a>
          </div>

          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              style={{
                fontSize: '1rem',
                fontWeight: pathname === item.href ? 700 : 500,
                color: pathname === item.href ? 'var(--color-primary-600)' : 'var(--text-primary)',
                padding: '0.55rem 0',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {item.label}
            </Link>
          ))}

          <div
            style={{
              paddingTop: '0.75rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.6rem',
              fontSize: '0.85rem',
            }}
          >
            <a
              href="tel:07429188880"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
              }}
            >
              <Phone size={14} style={{ color: 'var(--color-primary-600)' }} />
              07429 188880 (Direct Enquiries)
            </a>
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              style={{
                color: 'var(--text-muted)',
                fontSize: '0.8rem',
              }}
            >
              Administrator & Staff Portal →
            </Link>
          </div>
        </div>
      )}

      <style jsx>{`
        @media (max-width: 768px) {
          .header-meta-desktop {
            display: none !important;
          }
        }
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
