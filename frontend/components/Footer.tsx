import React from 'react';
import Link from 'next/link';
import { Logo } from './Logo';
import { MapPin, Mail, ShieldCheck, Heart, Phone } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      style={{
        backgroundColor: '#F0F9FF',
        borderTop: '1px solid #BAE6FD',
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
            <p style={{ fontSize: '0.9rem', color: '#475569', marginBottom: '1rem', lineHeight: 1.6 }}>
              A registered charity serving the faith, family, and welfare needs of the community in Balsall Heath, Birmingham.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 700, color: '#0F172A' }}>
              <ShieldCheck size={16} style={{ color: '#0284C7' }} />
              Registered Charity No. 1150221
            </div>
          </div>

          {/* Column 2: Prayers & Community Services */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#0F172A', letterSpacing: '-0.01em' }}>
              Prayers & Services
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/prayer-times" className="footer-nav-link">Daily Prayer Timetable</Link>
              </li>
              <li>
                <Link href="/prayer-times#jumuah" className="footer-nav-link">Friday Jumu’ah Prayers</Link>
              </li>
              <li>
                <Link href="/services#welfare" className="footer-nav-link">Local Zakat & Foodbank Relief</Link>
              </li>
              <li>
                <Link href="/services#nikah" className="footer-nav-link">Nikah Marriage Solemnisation</Link>
              </li>
              <li>
                <Link href="/services#janazah" className="footer-nav-link">Janazah & Bereavement Support</Link>
              </li>
              <li>
                <Link href="/services#visits" className="footer-nav-link">School & Neighbour Visits</Link>
              </li>
              <li>
                <Link href="/qibla" className="footer-nav-link">Qibla Direction Compass</Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academy, Media & Appeals */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#0F172A', letterSpacing: '-0.01em' }}>
              Academy & Appeals
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.9rem' }}>
              <li>
                <Link href="/donate?category=purchase" style={{ color: '#0284C7', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Heart size={14} style={{ fill: '#DC2626', color: '#DC2626' }} /> Mosque Purchase Appeal
                </Link>
              </li>
              <li>
                <Link href="/donate?category=zakat" className="footer-nav-link">Zakat al-Mal (Local Welfare)</Link>
              </li>
              <li>
                <Link href="/activities" className="footer-nav-link">Weekend Madrasah & Academy</Link>
              </li>
              <li>
                <Link href="/activities#tafsir" className="footer-nav-link">Weekly Tafsir (Sheikh Jamal)</Link>
              </li>
              <li>
                <Link href="/activities#stem" className="footer-nav-link">Youth STEM & Electronics Lab</Link>
              </li>
              <li>
                <Link href="/gallery" className="footer-nav-link">Virtual Tour & Photo Gallery</Link>
              </li>
              <li>
                <a
                  href="https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5023502/contact-information"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-nav-link"
                >
                  Charity Commission Register #1150221 ↗
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact & Location */}
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '1rem', color: '#0F172A', letterSpacing: '-0.01em' }}>
              Location & Contact
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem', color: '#475569' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: '#0284C7', flexShrink: 0, marginTop: '0.15rem' }} />
                <span style={{ color: '#475569' }}>
                  89 Tindal Street, Balsall Heath,<br />
                  Birmingham, B12 9QU,<br />
                  United Kingdom
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={18} style={{ color: '#0284C7', flexShrink: 0 }} />
                <a href="mailto:alfalahcsc@hotmail.com" className="footer-nav-link" style={{ textDecoration: 'underline' }}>
                  alfalahcsc@hotmail.com
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: '#0F172A' }}>
                <Phone size={18} style={{ color: '#0284C7', flexShrink: 0 }} />
                <a href="tel:07429188880" className="footer-nav-link" style={{ color: '#0F172A' }}>07429 188880</a>
              </div>
              <div style={{ marginTop: '0.5rem' }}>
                <Link
                  href="/contact"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    padding: '0.5rem 1rem',
                    backgroundColor: '#ffffff',
                    border: '1px solid #CBD5E1',
                    borderRadius: '8px',
                    color: '#0F172A',
                    textDecoration: 'none',
                    boxShadow: '0 1px 3px rgba(15, 23, 42, 0.05)',
                    transition: 'all 0.15s ease',
                  }}
                  className="footer-btn"
                >
                  Send a Message →
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            borderTop: '1px solid #BAE6FD',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
            fontSize: '0.85rem',
            color: '#64748B',
          }}
        >
          <div>
            © {currentYear} ALFALAH COMMUNITY SUPPORT CENTRE. All rights reserved.
          </div>
          <div style={{ display: 'flex', gap: '1.5rem' }}>
            <Link href="/privacy" className="footer-bottom-link">Privacy Notice & Cookies</Link>
            <Link href="/admin" className="footer-bottom-link">Administration</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
