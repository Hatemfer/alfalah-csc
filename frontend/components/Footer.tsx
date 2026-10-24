import React from 'react';
import Link from 'next/link';
import { MapPin, Mail, ShieldCheck, Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: 'var(--bg-surface-alt)',
        borderTop: '1px solid var(--border-color)',
        paddingTop: '3.5rem',
        paddingBottom: '2rem',
        marginTop: 'auto',
      }}
    >
      <div className="container">
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '2.5rem',
            marginBottom: '3rem',
          }}
        >
          {/* Column 1: Organization Overview */}
          <div>
            <h3
              style={{
                fontSize: '1.2rem',
                fontWeight: 800,
                color: 'var(--color-primary-700)',
                marginBottom: '0.25rem',
              }}
            >
              ALFALAH COMMUNITY SUPPORT CENTRE
            </h3>
            <p className="arabic-title" style={{ fontSize: '1.1rem', color: 'var(--color-accent-600)', marginBottom: '0.75rem' }}>
              مركز الفلاح الإسلامي
            </p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.6 }}>
              A registered charity serving the faith, family, and welfare needs of the community in Balsall Heath, Birmingham.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              <ShieldCheck size={16} style={{ color: 'var(--color-primary-600)' }} />
              Registered Charity No. 1150221
            </div>
          </div>

          {/* Column 2: Navigation Links */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Quick Navigation
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/about" style={{ color: 'var(--text-secondary)' }}>About Our Centre</Link>
              </li>
              <li>
                <Link href="/prayer-times" style={{ color: 'var(--text-secondary)' }}>Prayer Timetable & Iqamah</Link>
              </li>
              <li>
                <Link href="/qibla" style={{ color: 'var(--text-secondary)' }}>Qibla Direction Compass</Link>
              </li>
              <li>
                <Link href="/activities" style={{ color: 'var(--text-secondary)' }}>Community Programmes</Link>
              </li>
              <li>
                <Link href="/events" style={{ color: 'var(--text-secondary)' }}>Upcoming Events & Circles</Link>
              </li>
              <li>
                <Link href="/announcements" style={{ color: 'var(--text-secondary)' }}>Community Notices</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Location & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>
                  89 Tindal Street, Balsall Heath,<br />
                  Birmingham, B12 9QU,<br />
                  United Kingdom
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                <a href="mailto:alfalahcsc@hotmail.com" style={{ textDecoration: 'underline' }}>
                  alfalahcsc@hotmail.com
                </a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link href="/contact" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                  Send a Message →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid var(--border-color)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
          }}
        >
          <div>
            © {currentYear} ALFALAH COMMUNITY SUPPORT CENTRE. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" style={{ color: 'var(--text-muted)' }}>Privacy Notice & Cookies</Link>
            <Link href="/admin" style={{ color: 'var(--text-muted)' }}>Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
