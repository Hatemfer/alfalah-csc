import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { MapPin, Mail, ShieldCheck, Heart, Phone } from 'lucide-react';

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

          {/* Column 2: Prayers & Community Services */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Prayers & Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/prayer-times" style={{ color: 'var(--text-secondary)' }}>Daily Prayer Timetable</Link>
              </li>
              <li>
                <Link href="/prayer-times#jumuah" style={{ color: 'var(--text-secondary)' }}>Friday Jumu’ah Prayers</Link>
              </li>
              <li>
                <Link href="/services#welfare" style={{ color: 'var(--text-secondary)' }}>Local Zakat & Foodbank Relief</Link>
              </li>
              <li>
                <Link href="/services#nikah" style={{ color: 'var(--text-secondary)' }}>Nikah Marriage Solemnisation</Link>
              </li>
              <li>
                <Link href="/services#janazah" style={{ color: 'var(--text-secondary)' }}>Janazah & Bereavement Support</Link>
              </li>
              <li>
                <Link href="/services#visits" style={{ color: 'var(--text-secondary)' }}>School & Neighbour Visits</Link>
              </li>
              <li>
                <Link href="/qibla" style={{ color: 'var(--text-secondary)' }}>Qibla Direction Compass</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy, Media & Appeals */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Academy & Appeals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/donate?category=purchase" style={{ color: 'var(--color-primary-800)', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={14} style={{ fill: 'currentColor' }} /> Mosque Purchase Appeal
                </Link>
              </li>
              <li>
                <Link href="/donate?category=zakat" style={{ color: 'var(--text-secondary)' }}>Zakat al-Mal (Local Welfare)</Link>
              </li>
              <li>
                <Link href="/activities" style={{ color: 'var(--text-secondary)' }}>Weekend Madrasah & Academy</Link>
              </li>
              <li>
                <Link href="/activities#tafsir" style={{ color: 'var(--text-secondary)' }}>Weekly Tafsir (Sheikh Jamal)</Link>
              </li>
              <li>
                <Link href="/activities#stem" style={{ color: 'var(--text-secondary)' }}>Youth STEM & Electronics Lab</Link>
              </li>
              <li>
                <Link href="/gallery" style={{ color: 'var(--text-secondary)' }}>Virtual Tour & Photo Gallery</Link>
              </li>
              <li>
                <a
                  href="https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5023502/contact-information"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  Charity Commission Register #1150221 ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>
              Location & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary-700)', flexShrink: 0, marginTop: '0.15rem' }} />
                <span>
                  89 Tindal Street, Balsall Heath,<br />
                  Birmingham, B12 9QU,<br />
                  United Kingdom
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: 'var(--color-primary-700)', flexShrink: 0 }} />
                <a href="mailto:alfalahcsc@hotmail.com" style={{ textDecoration: 'underline' }}>
                  alfalahcsc@hotmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                <Phone size={18} style={{ color: 'var(--color-primary-700)', flexShrink: 0 }} />
                <a href="tel:07429188880">07429 188880</a>
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
