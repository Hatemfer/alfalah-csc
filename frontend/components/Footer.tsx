import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
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
            <div style={{ marginBottom: '1rem' }}>
              <Logo size="md" />
            </div>
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

          {/* Column 3: Charity & Giving */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Charity & Giving
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/donate" style={{ color: 'var(--color-primary-600)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={14} style={{ fill: 'currentColor' }} /> Donate Online (Sadaqah)
                </Link>
              </li>
              <li>
                <Link href="/donate" style={{ color: 'var(--text-secondary)' }}>Zakat al-Mal (100% Policy)</Link>
              </li>
              <li>
                <Link href="/donate" style={{ color: 'var(--text-secondary)' }}>Gift Aid (+25% UK Tax Relief)</Link>
              </li>
              <li>
                <Link href="/donate" style={{ color: 'var(--text-secondary)' }}>Bank Transfer & Standing Order</Link>
              </li>
              <li>
                <a
                  href="https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/5033068"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Charity Commission Register #1150221 ↗
                </a>
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
