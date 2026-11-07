'use client';

import React, { useState, useEffect, useRef } from 'react';
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
  ChevronDown,
  Camera,
  GraduationCap,
  LucideIcon,
} from 'lucide-react';

interface SubItem {
  label: string;
  href: string;
  desc: string;
  icon: LucideIcon;
}

interface NavItem {
  label: string;
  href: string;
  children?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/' },
  { label: 'Prayer Times', href: '/prayer-times' },
  { label: 'Services', href: '/services' },
  { label: 'Academy', href: '/activities' },
  { label: 'About', href: '/about' },
  {
    label: 'More',
    href: '/announcements',
    children: [
      {
        label: 'Community Announcements',
        href: '/announcements',
        desc: 'Latest news, Eid notices & community bulletins',
        icon: Calendar,
      },
      {
        label: 'Events & Halaqas',
        href: '/events',
        desc: 'Upcoming study circles, workshops & programmes',
        icon: GraduationCap,
      },
      {
        label: 'Gallery & Media',
        href: '/gallery',
        desc: 'Mosque photo archive, community life & video tour',
        icon: Camera,
      },
      {
        label: 'Qibla Direction Finder',
        href: '/qibla',
        desc: 'Interactive digital compass calibrated for Birmingham',
        icon: Compass,
      },
    ],
  },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formattedDates, setFormattedDates] = useState<{ greg: string; hijri: string }>({
    greg: 'Sunday, 1 November 2026',
    hijri: '21 Jumada I 1448 AH',
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

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close menus on page route changes
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleMouseEnter = (label: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setOpenDropdown(label);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  const isItemActive = (item: NavItem) => {
    if (pathname === item.href) return true;
    if (item.children) {
      return item.children.some((child) => {
        const childPath = child.href.split('?')[0].split('#')[0];
        return pathname === childPath && childPath !== '/';
      });
    }
    return false;
  };

  return (
    <header
      ref={navRef}
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e2e8f0',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
      }}
    >
      {/* Top Banner with Live Dates & Charity Registration */}
      <div
        className="header-top-banner"
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
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#334155', fontWeight: 600 }}
            suppressHydrationWarning
          >
            <Calendar size={13} style={{ color: 'var(--color-primary-700)' }} />
            {formattedDates.greg} • {formattedDates.hijri}
          </span>
          <span style={{ opacity: 0.3 }} className="header-meta-desktop">
            |
          </span>
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#334155' }}
            className="header-meta-desktop"
          >
            <ShieldCheck size={13} style={{ color: 'var(--color-primary-700)' }} />
            Charity <strong>#1150221</strong>
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 500 }} className="header-meta-desktop">
            Balsall Heath, Birmingham B12 9QU
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className="container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.9rem 1.5rem',
        }}
      >
        {/* Brand Logo & Emblem */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav
          style={{
            alignItems: 'center',
            gap: '0.55rem',
          }}
          className="desktop-nav"
        >
          {NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isOpen = openDropdown === item.label;
            const active = isItemActive(item);

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="nav-link-item"
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    fontSize: '0.95rem',
                    fontWeight: active ? 600 : 500,
                    color: active ? '#047857' : '#475569',
                    padding: '0.55rem 0.75rem',
                    textDecoration: 'none',
                    transition: 'color 0.15s ease',
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0.65rem',
                        right: '0.65rem',
                        height: '2.5px',
                        backgroundColor: '#059669',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </Link>
              );
            }

            // Dropdown parent (e.g. More)
            return (
              <div
                key={item.label}
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(item.label)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setOpenDropdown(isOpen ? null : item.label)}
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  className="nav-link-btn"
                  style={{
                    position: 'relative',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                    background: 'none',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.95rem',
                    fontWeight: active || isOpen ? 600 : 500,
                    color: active || isOpen ? '#047857' : '#475569',
                    fontFamily: 'inherit',
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>{item.label}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      opacity: active || isOpen ? 0.9 : 0.6,
                    }}
                  />
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0.75rem',
                        right: '0.75rem',
                        height: '2.5px',
                        backgroundColor: '#059669',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                </button>

                {/* Dropdown Card */}
                {isOpen && item.children && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      right: 0,
                      width: '310px',
                      backgroundColor: '#ffffff',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
                      padding: '0.45rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.2rem',
                      zIndex: 120,
                      animation: 'fadeInDown 0.15s ease-out forwards',
                    }}
                  >
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setOpenDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.65rem',
                            padding: '0.6rem 0.65rem',
                            borderRadius: '8px',
                            textDecoration: 'none',
                            backgroundColor: isChildActive ? '#f0fdf4' : 'transparent',
                            transition: 'background-color 0.15s ease',
                          }}
                          className="dropdown-item"
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              backgroundColor: isChildActive ? '#dcfce7' : '#ecfdf5',
                              color: '#065f46',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Icon size={16} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: isChildActive ? '#065f46' : '#0f172a' }}>
                              {child.label}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '0.1rem', lineHeight: 1.3 }}>
                              {child.desc}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Actions (Donate CTA + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Always visible Donate CTA on mobile and desktop */}
          <Link
            href="/donate"
            className="btn btn-accent header-donate-cta"
            style={{
              padding: '0.62rem 1.45rem',
              fontSize: '0.94rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.28)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            <Heart size={16} style={{ fill: 'currentColor' }} />
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
            padding: '1.25rem 1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            maxHeight: 'calc(100vh - 120px)',
            overflowY: 'auto',
          }}
        >
          {/* Big Donate Appeal Button */}
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
              marginBottom: '0.35rem',
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
              marginBottom: '0.5rem',
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

          {/* Mobile Links */}
          {NAV_ITEMS.map((item) => {
            const hasChildren = Boolean(item.children && item.children.length > 0);
            const isExpanded = mobileExpandedGroup === item.label;
            const active = isItemActive(item);

            if (!hasChildren) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    fontSize: '1rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-primary-800)' : 'var(--text-primary)',
                    padding: '0.65rem 0.5rem',
                    borderBottom: '1px solid var(--border-subtle)',
                    textDecoration: 'none',
                  }}
                >
                  {item.label}
                </Link>
              );
            }

            return (
              <div
                key={item.label}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: isExpanded ? '0.4rem' : '0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    style={{
                      flex: 1,
                      fontSize: '1rem',
                      fontWeight: active ? 700 : 500,
                      color: active ? 'var(--color-primary-800)' : 'var(--text-primary)',
                      padding: '0.65rem 0.5rem',
                      textDecoration: 'none',
                    }}
                  >
                    {item.label}
                  </Link>

                  <button
                    type="button"
                    onClick={() => setMobileExpandedGroup(isExpanded ? null : item.label)}
                    aria-label={`Expand ${item.label}`}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0.65rem 0.75rem',
                      cursor: 'pointer',
                      color: 'var(--text-secondary)',
                    }}
                  >
                    <ChevronDown
                      size={16}
                      style={{
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                        transition: 'transform 0.2s ease',
                      }}
                    />
                  </button>
                </div>

                {isExpanded && item.children && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.35rem',
                      paddingLeft: '0.5rem',
                      paddingBottom: '0.4rem',
                    }}
                  >
                    {item.children.map((child) => {
                      const Icon = child.icon;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.6rem',
                            padding: '0.45rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <div
                            style={{
                              width: '26px',
                              height: '26px',
                              borderRadius: '6px',
                              backgroundColor: '#ecfdf5',
                              color: '#065f46',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            <Icon size={14} />
                          </div>
                          <div>
                            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f172a' }}>
                              {child.label}
                            </div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Mobile Footer Links */}
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
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        :global(.nav-link-item:hover),
        :global(.nav-link-btn:hover) {
          color: #047857 !important;
        }
        :global(.dropdown-item:hover) {
          background-color: #f8fafc !important;
        }
        :global(.dropdown-item:hover div) {
          color: #064e3b !important;
        }
        @media (max-width: 767px) {
          .header-meta-desktop,
          :global(.header-donate-cta) {
            display: none !important;
          }
        }
        @media (min-width: 1024px) {
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
