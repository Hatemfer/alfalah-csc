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
  ChevronRight,
  Camera,
  GraduationCap,
  Home,
  MoreHorizontal,
  Info,
  Layers,
  LucideIcon,
  ExternalLink,
} from 'lucide-react';

interface SubItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  children?: SubItem[];
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Home', href: '/', icon: Home },
  { label: 'Prayer Times', href: '/prayer-times', icon: Clock },
  { label: 'Services', href: '/services', icon: Layers },
  { label: 'Academy', href: '/activities', icon: GraduationCap },
  { label: 'About', href: '/about', icon: Info },
  {
    label: 'More',
    href: '/announcements',
    icon: MoreHorizontal,
    children: [
      {
        label: 'Community Announcements',
        href: '/announcements',
        icon: Calendar,
      },
      {
        label: 'Events & Halaqas',
        href: '/events',
        icon: GraduationCap,
      },
      {
        label: 'Gallery & Media',
        href: '/gallery',
        icon: Camera,
      },
      {
        label: 'Qibla Direction Finder',
        href: '/qibla',
        icon: Compass,
      },
    ],
  },
  { label: 'Contact', href: '/contact', icon: Phone },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [formattedDates, setFormattedDates] = useState<{ greg: string; hijri: string }>({
    greg: 'Friday, 13 Nov 2026',
    hijri: '3 Jumada II 1448 AH',
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

  // Lock background scrolling when mobile drawer is open
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  // Close menus on page route changes or Escape key
  useEffect(() => {
    setOpenDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setMobileOpen(false);
        setOpenDropdown(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
        borderBottom: '1px solid #E4EDF5',
        boxShadow: '0 2px 10px rgba(24, 51, 79, 0.04)',
      }}
    >
      {/* Top Banner with Live Dates & Charity Registration */}
      <div
        className="header-top-banner"
        style={{
          backgroundColor: '#F7FAFE',
          borderBottom: '1px solid #E4EDF5',
          color: '#657B91',
          padding: '0.35rem 1rem',
          fontSize: '0.78rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <div className="header-meta-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', width: '100%', justifyContent: 'space-between' }}>
          <span
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', color: '#0F172A', fontWeight: 600 }}
            suppressHydrationWarning
          >
            <Calendar size={13} style={{ color: '#0284C7' }} />
            {formattedDates.greg} • {formattedDates.hijri}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }} className="header-meta-desktop">
            <span style={{ opacity: 0.3 }}>|</span>
            <span
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#0F172A' }}
            >
              <ShieldCheck size={13} style={{ color: '#0284C7' }} />
              Charity <strong>#1150221</strong>
            </span>
            <span style={{ opacity: 0.3 }}>|</span>
            <span style={{ fontSize: '0.8rem', color: '#657B91', fontWeight: 500 }}>
              Balsall Heath, Birmingham B12 9QU
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className="container header-main-container"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.85rem 1.5rem',
        }}
      >
        {/* Brand Logo & Emblem */}
        <Logo size="md" />

        {/* Desktop Navigation Links */}
        <nav
          style={{
            alignItems: 'center',
            gap: '0.45rem',
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
                    fontSize: '0.94rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? '#245C91' : '#475569',
                    padding: '0.55rem 0.75rem',
                    textDecoration: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {item.label}
                  {active && (
                    <span
                      style={{
                        position: 'absolute',
                        bottom: '0',
                        left: '0.75rem',
                        right: '0.75rem',
                        height: '2.5px',
                        backgroundColor: '#3988CA',
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
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    padding: '0.55rem 0.75rem',
                    cursor: 'pointer',
                    fontSize: '0.94rem',
                    fontWeight: active || isOpen ? 700 : 500,
                    color: active || isOpen ? '#245C91' : '#475569',
                    fontFamily: 'inherit',
                    borderRadius: '8px',
                    transition: 'all 0.15s ease',
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
                        backgroundColor: '#3988CA',
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
                      top: 'calc(100% + 6px)',
                      right: 0,
                      width: '320px',
                      backgroundColor: '#ffffff',
                      borderRadius: '14px',
                      border: '1px solid #E4EDF5',
                      boxShadow: '0 14px 35px -4px rgba(24, 51, 79, 0.12), 0 4px 12px -2px rgba(24, 51, 79, 0.06)',
                      padding: '0.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
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
                            gap: '0.75rem',
                            padding: '0.65rem 0.75rem',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            backgroundColor: isChildActive ? '#F0F7FE' : 'transparent',
                            transition: 'background-color 0.15s ease',
                          }}
                          className="dropdown-item"
                        >
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: isChildActive ? '#DCEEFF' : '#F0F7FE',
                              color: '#3988CA',
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
                            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: isChildActive ? '#245C91' : '#18334F' }}>
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
        </nav>

        {/* Actions (Donate CTA + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Donate CTA on Desktop */}
          <Link
            href="/donate"
            className="btn btn-accent header-donate-cta"
            style={{
              padding: '0.6rem 1.35rem',
              fontSize: '0.92rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 800,
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.28)',
              whiteSpace: 'nowrap',
              letterSpacing: '0.01em',
            }}
          >
            <Heart size={15} style={{ fill: 'currentColor' }} />
            <span>Donate</span>
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open mobile navigation menu"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              background: '#F0F7FE',
              border: '1px solid #DCEEFF',
              borderRadius: '10px',
              color: '#245C91',
              cursor: 'pointer',
              width: '42px',
              height: '42px',
              padding: '0',
              transition: 'all 0.15s ease',
            }}
            className="mobile-toggle"
          >
            <Menu size={22} />
          </button>
        </div>
      </div>

      {/* =========================================================================
          FULL-SCREEN MOBILE NAVIGATION DRAWER
          ========================================================================= */}
      {mobileOpen && (
        <div
          className="mobile-drawer-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 2500,
            backgroundColor: 'rgba(24, 51, 79, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            animation: 'fadeIn 0.2s ease-out',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setMobileOpen(false);
          }}
        >
          <div
            className="mobile-drawer-content"
            style={{
              position: 'relative',
              width: '100%',
              maxHeight: '100dvh',
              height: '100%',
              backgroundColor: '#FFFFFF',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.2)',
              overflow: 'hidden',
              animation: 'slideDown 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >
            {/* Top Bar of Drawer: Brand & Close Button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.85rem 1.15rem',
                borderBottom: '1px solid #E4EDF5',
                backgroundColor: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <div onClick={() => setMobileOpen(false)}>
                <Logo size="sm" linkToHome={true} />
              </div>

              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                aria-label="Close navigation menu"
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  backgroundColor: '#F0F7FE',
                  border: '1px solid #DCEEFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#245C91',
                  cursor: 'pointer',
                  transition: 'background-color 0.15s ease',
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Scrollable Navigation List */}
            <div
              style={{
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                WebkitOverflowScrolling: 'touch',
                padding: '1rem 1.15rem 3.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.55rem',
              }}
            >
              {/* Navigation Items */}
              {NAV_ITEMS.map((item) => {
                const ItemIcon = item.icon;
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
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.75rem 0.95rem',
                        borderRadius: '12px',
                        textDecoration: 'none',
                        backgroundColor: active ? '#DCEEFF' : '#FFFFFF',
                        border: active ? '1.5px solid #3988CA' : '1px solid #E4EDF5',
                        boxShadow: active ? '0 2px 8px rgba(57, 136, 202, 0.12)' : '0 1px 3px rgba(24, 51, 79, 0.02)',
                        flexShrink: 0,
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: active ? '#3988CA' : '#F0F7FE',
                          color: active ? '#FFFFFF' : '#3988CA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ItemIcon size={18} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: '0.98rem',
                            fontWeight: active ? 700 : 500,
                            color: active ? '#245C91' : '#18334F',
                          }}
                        >
                          {item.label}
                        </div>
                      </div>

                      <ChevronRight size={16} style={{ color: active ? '#3988CA' : '#8A9EA8', flexShrink: 0 }} />
                    </Link>
                  );
                }

                // Expandable Parent (More)
                return (
                  <div
                    key={item.label}
                    style={{
                      borderRadius: '12px',
                      backgroundColor: isExpanded ? '#F7FAFE' : '#FFFFFF',
                      border: isExpanded ? '1.5px solid #3988CA' : '1px solid #E4EDF5',
                      flexShrink: 0,
                      width: '100%',
                      boxSizing: 'border-box',
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setMobileExpandedGroup(isExpanded ? null : item.label)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '0.75rem 0.95rem',
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        boxSizing: 'border-box',
                      }}
                    >
                      <div
                        style={{
                          width: '36px',
                          height: '36px',
                          borderRadius: '10px',
                          backgroundColor: isExpanded ? '#3988CA' : '#F0F7FE',
                          color: isExpanded ? '#FFFFFF' : '#3988CA',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <ItemIcon size={18} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '0.98rem', fontWeight: 600, color: '#18334F' }}>
                          {item.label}
                        </div>
                      </div>

                      <ChevronDown
                        size={18}
                        style={{
                          color: isExpanded ? '#3988CA' : '#8A9EA8',
                          transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                          transition: 'transform 0.2s ease',
                          flexShrink: 0,
                        }}
                      />
                    </button>

                    {/* Accordion Sub-Items */}
                    {isExpanded && item.children && (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '0.25rem',
                          padding: '0.35rem 0.75rem 0.75rem',
                          borderTop: '1px solid #E4EDF5',
                        }}
                      >
                        {item.children.map((child) => {
                          const SubIcon = child.icon;
                          const isSubActive = pathname === child.href;
                          return (
                            <Link
                              key={child.href}
                              href={child.href}
                              onClick={() => setMobileOpen(false)}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                padding: '0.6rem 0.75rem',
                                borderRadius: '8px',
                                textDecoration: 'none',
                                backgroundColor: isSubActive ? '#DCEEFF' : 'transparent',
                                flexShrink: 0,
                                boxSizing: 'border-box',
                                transition: 'background-color 0.15s ease',
                              }}
                            >
                              <div
                                style={{
                                  width: '28px',
                                  height: '28px',
                                  borderRadius: '6px',
                                  backgroundColor: isSubActive ? '#3988CA' : '#E4EDF5',
                                  color: isSubActive ? '#FFFFFF' : '#245C91',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  flexShrink: 0,
                                }}
                              >
                                <SubIcon size={14} />
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div
                                  style={{
                                    fontSize: '0.9rem',
                                    fontWeight: isSubActive ? 700 : 500,
                                    color: isSubActive ? '#245C91' : '#18334F',
                                  }}
                                >
                                  {child.label}
                                </div>
                              </div>

                              <ChevronRight size={14} style={{ color: '#8A9EA8', flexShrink: 0 }} />
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Bottom Quick Action: Prominent Donate CTA */}
              <div style={{ marginTop: '0.75rem', flexShrink: 0 }}>
                <Link
                  href="/donate"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-accent"
                  style={{
                    width: '100%',
                    padding: '0.85rem 1.25rem',
                    borderRadius: '12px',
                    fontWeight: 800,
                    fontSize: '1rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.25)',
                    boxSizing: 'border-box',
                  }}
                >
                  <Heart size={18} fill="currentColor" />
                  <span>Donate to Masjid Appeal</span>
                </Link>
              </div>

              {/* Charity & Community Identity Card */}
              <div
                style={{
                  backgroundColor: '#F0F7FE',
                  border: '1px solid #DCEEFF',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.4rem',
                  marginTop: '0.25rem',
                  flexShrink: 0,
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', fontWeight: 800, color: '#245C91' }}>
                  <ShieldCheck size={15} color="#3988CA" />
                  <span>UK Registered Charity No. 1150221</span>
                </div>
                <div style={{ fontSize: '0.76rem', color: '#657B91', lineHeight: 1.4 }}>
                  89 Tindal Street, Balsall Heath, Birmingham B12 9QU
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '0.2rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px dashed #DCEEFF',
                  }}
                >
                  <a
                    href="tel:07429188880"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      color: '#18334F',
                      textDecoration: 'none',
                    }}
                  >
                    <Phone size={13} style={{ color: '#3988CA' }} />
                    07429 188880
                  </a>
                  <Link
                    href="/admin"
                    onClick={() => setMobileOpen(false)}
                    style={{
                      fontSize: '0.74rem',
                      color: '#657B91',
                      textDecoration: 'underline',
                    }}
                  >
                    Staff Portal →
                  </Link>
                </div>
              </div>
            </div>
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
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideDown {
          from {
            transform: translateY(-100%);
          }
          to {
            transform: translateY(0);
          }
        }
        :global(.nav-link-btn) {
          border: none !important;
          outline: none !important;
          background: transparent !important;
          box-shadow: none !important;
        }
        :global(.nav-link-item:hover),
        :global(.nav-link-btn:hover) {
          color: #3988CA !important;
          background-color: #F7FAFE !important;
        }
        :global(.dropdown-item:hover) {
          background-color: #F0F7FE !important;
        }
        :global(.dropdown-item:hover div) {
          color: #245C91 !important;
        }
        @media (max-width: 640px) {
          .header-main-container {
            padding: 0.65rem 1rem !important;
          }
        }
        @media (max-width: 767px) {
          .header-meta-wrapper {
            justify-content: center !important;
            text-align: center !important;
          }
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
