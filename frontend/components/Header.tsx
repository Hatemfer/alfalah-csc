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
  Building,
  Sparkles,
  Users,
  Camera,
  Coins,
  BookOpen,
  GraduationCap,
  HeartHandshake,
  FileText,
  LucideIcon,
} from 'lucide-react';

interface SubNavItem {
  label: string;
  href: string;
  desc: string;
  icon: LucideIcon;
  badge?: string;
}

interface NavGroup {
  id: string;
  label: string;
  baseHref: string;
  items: SubNavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    id: 'about',
    label: 'About Us',
    baseHref: '/about',
    items: [
      {
        label: 'Our Story & Vision',
        href: '/about',
        desc: 'Serving Balsall Heath & Birmingham since 2012',
        icon: Building,
      },
      {
        label: 'Facilities & Centre Tour',
        href: '/about#facilities',
        desc: 'Prayer halls, STEM lab, Sakeena hub & courtyard',
        icon: Sparkles,
      },
      {
        label: 'Leadership & Scholars',
        href: '/about#scholars',
        desc: 'Resident scholars, trustees & management',
        icon: Users,
      },
      {
        label: 'Photo & Video Gallery',
        href: '/gallery',
        desc: 'Walkthrough tour, youth workshops & community',
        icon: Camera,
      },
      {
        label: 'Charity Governance',
        href: '/about#governance',
        desc: 'Official UK Charity #1150221 & annual reports',
        icon: ShieldCheck,
      },
    ],
  },
  {
    id: 'prayers',
    label: 'Prayers & Worship',
    baseHref: '/prayer-times',
    items: [
      {
        label: 'Daily Prayer Timetable',
        href: '/prayer-times',
        desc: 'Live countdown, start times & Iqamah congregation',
        icon: Clock,
      },
      {
        label: 'Friday Jumu’ah Prayers',
        href: '/prayer-times#jumuah',
        desc: 'Khutbah at 13:00, English summary & parking guide',
        icon: Users,
      },
      {
        label: 'Monthly Timetable (PDF)',
        href: '/prayer-times#monthly',
        desc: 'Printable monthly prayer calendar for home',
        icon: FileText,
      },
      {
        label: 'Qibla Direction Finder',
        href: '/qibla',
        desc: 'Interactive digital compass calibrated for Birmingham',
        icon: Compass,
      },
    ],
  },
  {
    id: 'services',
    label: 'Services & Welfare',
    baseHref: '/services',
    items: [
      {
        label: 'All Community Services',
        href: '/services',
        desc: 'Overview of community support & pastoral care',
        icon: HeartHandshake,
      },
      {
        label: '100% Zakat & Foodbank Relief',
        href: '/services#welfare',
        desc: '0% admin fee, emergency food parcels & hardship grants',
        icon: Coins,
        badge: '100% Policy',
      },
      {
        label: 'Nikah (Marriage) Solemnisation',
        href: '/services#nikah',
        desc: 'Sunnah ceremony, certificates & pre-marriage advice',
        icon: Users,
      },
      {
        label: 'Janazah & Bereavement Support',
        href: '/services#janazah',
        desc: '24/7 burial liaison, ritual washing & grief care',
        icon: ShieldCheck,
      },
      {
        label: 'School & Neighbour Visits',
        href: '/services#visits',
        desc: 'Welcoming Birmingham schools, colleges & guests',
        icon: Building,
      },
    ],
  },
  {
    id: 'academy',
    label: 'Academy & Youth',
    baseHref: '/activities',
    items: [
      {
        label: 'Alfalah Academy Overview',
        href: '/activities',
        desc: 'Weekend Madrasah, Quran Tajweed & Islamic studies',
        icon: BookOpen,
      },
      {
        label: 'Weekly Tafsir Series',
        href: '/activities#tafsir',
        desc: 'Surah al-Hujurat with Sheikh Jamal (Saturdays post-Maghrib)',
        icon: GraduationCap,
        badge: 'Weekly',
      },
      {
        label: 'Youth STEM & Electronics Lab',
        href: '/activities#stem',
        desc: 'Hands-on robotics, coding & circuit workbench',
        icon: Sparkles,
      },
      {
        label: 'Sakeena Sisters Hub',
        href: '/activities#sisters',
        desc: 'Dedicated sisters circles, well-being & private hall',
        icon: Users,
      },
      {
        label: 'Community Announcements',
        href: '/announcements',
        desc: 'Latest news, Eid notices & community bulletins',
        icon: Calendar,
      },
    ],
  },
  {
    id: 'appeals',
    label: 'Appeals & Giving',
    baseHref: '/donate',
    items: [
      {
        label: 'Building Purchase Appeal',
        href: '/donate?category=purchase',
        desc: 'Secure 89 Tindal St permanently (£600k target)',
        icon: Building,
        badge: 'Urgent',
      },
      {
        label: '100% Zakat Al-Mal Fund',
        href: '/donate?category=zakat',
        desc: '0% administration deduction, direct to Birmingham needy',
        icon: Coins,
      },
      {
        label: 'Sadaqah Jariyah & General Fund',
        href: '/donate?category=sadaqah',
        desc: 'Continuous reward supporting daily operations & youth',
        icon: HeartHandshake,
      },
      {
        label: 'Direct Bank Transfer (Al Rayan)',
        href: '/donate?tab=bank',
        desc: '0% transaction fees via UK bank transfer & Gift Aid',
        icon: ShieldCheck,
      },
    ],
  },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpandedGroup, setMobileExpandedGroup] = useState<string | null>(null);
  const pathname = usePathname();
  const navRef = useRef<HTMLDivElement>(null);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

  // Handle outside click to close dropdowns
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close dropdown on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileOpen(false);
  }, [pathname]);

  const handleMouseEnter = (groupId: string) => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setActiveDropdown(groupId);
  };

  const handleMouseLeave = () => {
    closeTimeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  const isGroupActive = (group: NavGroup) => {
    if (pathname === group.baseHref) return true;
    return group.items.some((item) => {
      const itemPath = item.href.split('?')[0].split('#')[0];
      return pathname === itemPath && itemPath !== '/';
    });
  };

  return (
    <header
      ref={navRef}
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
      {/* Top Banner with Charity Registration & Live Dates (Crisp & Dignified) */}
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
          padding: '0.65rem 1.25rem',
        }}
      >
        {/* Brand Logo & Emblem */}
        <Logo size="md" />

        {/* Desktop Navigation with Dropdowns */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '0.5rem',
          }}
          className="desktop-nav"
        >
          {/* Home Link */}
          <Link
            href="/"
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.92rem',
              fontWeight: pathname === '/' ? 700 : 500,
              color: pathname === '/' ? 'var(--color-primary-900)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast), background-color var(--transition-fast)',
            }}
          >
            Home
          </Link>

          {/* Dropdown Groups */}
          {NAV_GROUPS.map((group) => {
            const isOpen = activeDropdown === group.id;
            const active = isGroupActive(group);

            return (
              <div
                key={group.id}
                style={{ position: 'relative' }}
                onMouseEnter={() => handleMouseEnter(group.id)}
                onMouseLeave={handleMouseLeave}
              >
                <button
                  type="button"
                  onClick={() => setActiveDropdown(isOpen ? null : group.id)}
                  aria-expanded={isOpen}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    padding: '0.5rem 0.75rem',
                    fontSize: '0.92rem',
                    fontWeight: active ? 700 : 500,
                    color: active ? 'var(--color-primary-900)' : 'var(--text-secondary)',
                    backgroundColor: isOpen ? '#f1f5f9' : 'transparent',
                    border: 'none',
                    borderRadius: 'var(--radius-sm)',
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)',
                  }}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    size={14}
                    style={{
                      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      opacity: 0.7,
                    }}
                  />
                </button>

                {/* Dropdown Card */}
                {isOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: group.id === 'appeals' ? 'auto' : 0,
                      right: group.id === 'appeals' ? 0 : 'auto',
                      width: '360px',
                      backgroundColor: '#ffffff',
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 12px 32px -4px rgba(15, 23, 42, 0.12), 0 4px 12px -2px rgba(15, 23, 42, 0.06)',
                      padding: '0.6rem',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.25rem',
                      zIndex: 120,
                      animation: 'fadeInDown 0.18s ease-out forwards',
                    }}
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setActiveDropdown(null)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '0.75rem',
                            padding: '0.65rem 0.75rem',
                            borderRadius: '10px',
                            textDecoration: 'none',
                            transition: 'background-color 0.15s ease',
                          }}
                          className="dropdown-item"
                        >
                          <div
                            style={{
                              width: '34px',
                              height: '34px',
                              borderRadius: '8px',
                              backgroundColor: '#ecfdf5',
                              color: '#065f46',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              marginTop: '2px',
                            }}
                          >
                            <Icon size={17} />
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '0.5rem',
                              }}
                            >
                              <span
                                style={{
                                  fontSize: '0.88rem',
                                  fontWeight: 700,
                                  color: '#0f172a',
                                }}
                              >
                                {item.label}
                              </span>
                              {item.badge && (
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 800,
                                    backgroundColor:
                                      item.badge === 'Urgent'
                                        ? '#fee2e2'
                                        : item.badge === 'Weekly'
                                        ? '#e0e7ff'
                                        : '#d1fae5',
                                    color:
                                      item.badge === 'Urgent'
                                        ? '#991b1b'
                                        : item.badge === 'Weekly'
                                        ? '#3730a3'
                                        : '#065f46',
                                    padding: '0.15rem 0.45rem',
                                    borderRadius: '9999px',
                                  }}
                                >
                                  {item.badge}
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                fontSize: '0.76rem',
                                color: '#64748b',
                                margin: '0.15rem 0 0',
                                lineHeight: 1.35,
                              }}
                            >
                              {item.desc}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Direct Link */}
          <Link
            href="/contact"
            style={{
              padding: '0.5rem 0.75rem',
              fontSize: '0.92rem',
              fontWeight: pathname === '/contact' ? 700 : 500,
              color: pathname === '/contact' ? 'var(--color-primary-900)' : 'var(--text-secondary)',
              borderRadius: 'var(--radius-sm)',
              textDecoration: 'none',
              transition: 'color var(--transition-fast), background-color var(--transition-fast)',
            }}
          >
            Contact
          </Link>
        </nav>

        {/* Actions (Donate CTA + Mobile Toggle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {/* Always visible Donate CTA on mobile and desktop */}
          <Link
            href="/donate"
            className="btn btn-accent header-donate-cta"
            style={{
              padding: '0.5rem 1.25rem',
              fontSize: '0.9rem',
              borderRadius: 'var(--radius-full)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              fontWeight: 800,
              boxShadow: '0 2px 10px var(--color-accent-shadow)',
              whiteSpace: 'nowrap',
            }}
          >
            <Heart size={15} style={{ fill: 'currentColor' }} />
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

      {/* Mobile Drawer Accordion */}
      {mobileOpen && (
        <div
          style={{
            backgroundColor: 'var(--bg-surface)',
            borderTop: '1px solid var(--border-color)',
            padding: '1.25rem 1.25rem 2rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.6rem',
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

          {/* Home Direct Link */}
          <Link
            href="/"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: pathname === '/' ? 700 : 600,
              color: pathname === '/' ? 'var(--color-primary-800)' : 'var(--text-primary)',
              padding: '0.65rem 0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              textDecoration: 'none',
            }}
          >
            Home
          </Link>

          {/* Mobile Accordion Groups */}
          {NAV_GROUPS.map((group) => {
            const isExpanded = mobileExpandedGroup === group.id;
            const active = isGroupActive(group);

            return (
              <div
                key={group.id}
                style={{
                  borderBottom: '1px solid var(--border-subtle)',
                  paddingBottom: isExpanded ? '0.5rem' : '0',
                }}
              >
                <button
                  type="button"
                  onClick={() => setMobileExpandedGroup(isExpanded ? null : group.id)}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.7rem 0.5rem',
                    background: 'none',
                    border: 'none',
                    fontSize: '1rem',
                    fontWeight: active ? 700 : 600,
                    color: active ? 'var(--color-primary-800)' : 'var(--text-primary)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span>{group.label}</span>
                  <ChevronDown
                    size={16}
                    style={{
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease',
                      opacity: 0.6,
                    }}
                  />
                </button>

                {isExpanded && (
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '0.4rem',
                      paddingLeft: '0.5rem',
                      paddingTop: '0.25rem',
                    }}
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileOpen(false)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.65rem',
                            padding: '0.5rem 0.5rem',
                            borderRadius: 'var(--radius-sm)',
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            backgroundColor: '#f8fafc',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
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
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: '0.86rem', fontWeight: 600, color: '#0f172a' }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{item.desc}</div>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* Contact Direct Link */}
          <Link
            href="/contact"
            onClick={() => setMobileOpen(false)}
            style={{
              fontSize: '1rem',
              fontWeight: pathname === '/contact' ? 700 : 600,
              color: pathname === '/contact' ? 'var(--color-primary-800)' : 'var(--text-primary)',
              padding: '0.65rem 0.5rem',
              borderBottom: '1px solid var(--border-subtle)',
              textDecoration: 'none',
            }}
          >
            Contact
          </Link>

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
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        :global(.dropdown-item:hover) {
          background-color: #f8fafc !important;
        }
        :global(.dropdown-item:hover span) {
          color: #064e3b !important;
        }
        @media (max-width: 768px) {
          .header-meta-desktop {
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

