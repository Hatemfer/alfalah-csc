import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, Compass, MapPin, ExternalLink, Smartphone } from 'lucide-react';

export const metadata = {
  title: 'Live Prayer Times & Mawaqit Timetable | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Live congregation prayer times and Iqamah schedule for Al Falah Community Support Centre in Balsall Heath, Birmingham (B12 9QU). Powered directly by MAWAQIT.',
};

export default function PrayerTimesPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Header Banner - Lighter, Fresh & Modern */}
      <section
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 60%, #0d9488 100%)',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(8px)',
              padding: '0.4rem 1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 700,
              marginBottom: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.25)',
            }}
          >
            <Clock size={15} style={{ color: 'var(--color-accent-400)' }} />
            Official MAWAQIT Live Mosque Display
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 4vw, 3rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Masjid Al Falah Prayer Timetable
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.5rem', color: '#fef3c7', marginBottom: '0.75rem' }}>
            مواقيت الصلاة وإقامة الجماعة — مسجد الفلاح
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
            Synchronised in real-time with our mosque display board at 89 Tindal Street, Balsall Heath, Birmingham (B12 9QU).
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: '2.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1050px' }}>
          {/* Quick Notice Bar: Jumu'ah & App */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            <div
              style={{
                backgroundColor: 'rgba(5, 150, 105, 0.08)',
                border: '1.5px solid var(--color-primary-600)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
              }}
            >
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '1.1rem',
                  flexShrink: 0,
                }}
              >
                🕌
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--color-primary-700)', textTransform: 'uppercase' }}>
                  Friday Congregational Prayer
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Jumu&apos;ah Khutbah: 13:00 (1:00 PM)
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Smartphone size={28} style={{ color: 'var(--color-accent-500)' }} />
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700 }}>Follow us on MAWAQIT App</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Get live Athan & Iqamah notifications on iOS & Android</div>
                </div>
              </div>
              <a
                href="https://mawaqit.net/en/al-falah-community-support-centre-birmingham-b12-9qu-united-kingdom"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
                style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
              >
                Open in Mawaqit <ExternalLink size={13} />
              </a>
            </div>
          </div>

          {/* Official MAWAQIT Live Interactive Widget */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              boxShadow: 'var(--shadow-xl)',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              marginBottom: '3rem',
              overflow: 'hidden',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Live Mosque Display & Prayer Times
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Direct real-time feed from Masjid Al Falah's official MAWAQIT system
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <Link href="/qibla" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
                  <Compass size={15} /> Qibla Compass
                </Link>
                <Link href="/donate" className="btn btn-accent" style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}>
                  Support Mosque
                </Link>
              </div>
            </div>

            {/* Mawaqit Iframe Container */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                minHeight: '680px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                backgroundColor: '#0f172a',
              }}
            >
              <iframe
                src="https://mawaqit.net/en/w/al-falah-community-support-centre-birmingham-b12-9qu-united-kingdom"
                title="Al Falah Community Support Centre Mawaqit Live Prayer Times"
                width="100%"
                height="680"
                frameBorder="0"
                scrolling="no"
                style={{
                  border: 'none',
                  display: 'block',
                  width: '100%',
                  height: '680px',
                }}
              />
            </div>
          </div>

          {/* Location & Congregation Guidelines Card */}
          <div
            className="card"
            style={{
              padding: '2rem',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <MapPin size={18} style={{ color: 'var(--color-primary-600)' }} /> Mosque Location & Facilities
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1rem' }}>
                  <strong>Alfalah Community Support Centre</strong><br />
                  89 Tindal Street, Balsall Heath, Birmingham, B12 9QU<br />
                  Charity Commission Registration: <strong>1150221</strong>
                </p>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Equipped with clean wudu facilities, dedicated prayer areas, and educational classrooms.
                </p>
              </div>

              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '0.75rem' }}>
                  Congregation Notes
                </h3>
                <ul style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6, paddingLeft: '1.25rem' }}>
                  <li>Iqamah times indicate when the congregational prayer starts.</li>
                  <li>Please arrive 10 minutes prior to Iqamah to perform wudu and pray Tahiyyat al-Masjid.</li>
                  <li>Jumu&apos;ah Khutbah starts at 13:00 sharp every Friday.</li>
                  <li>Download the <strong>Mawaqit</strong> app on your smartphone and search for <em>&ldquo;Al Falah Community Support Centre&rdquo;</em> for instant prayer alerts.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
