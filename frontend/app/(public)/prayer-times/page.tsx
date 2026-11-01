import React from 'react';
import Link from 'next/link';
import { Clock, Calendar, Compass, MapPin, ExternalLink, Smartphone } from 'lucide-react';
import PrayerTimetable from '@/components/PrayerTimetable';

export const metadata = {
  title: 'Live Prayer Times & Mawaqit Timetable | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Live congregation prayer times and Iqamah schedule for Al Falah Community Support Centre in Balsall Heath, Birmingham (B12 9QU). Powered directly by MAWAQIT.',
};

export default function PrayerTimesPage() {
  return (
    <div style={{ paddingBottom: '6rem' }}>
      {/* Header Banner - Clean, Luminous & Modern */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: 'clamp(2rem, 5vw, 3rem) 1rem clamp(1.5rem, 3.5vw, 2.5rem)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.6rem, 4.5vw, 2.85rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.25,
            }}
          >
            Masjid Al Falah Prayer Timetable
          </h1>
          <p style={{ fontSize: 'clamp(0.88rem, 2.5vw, 1.05rem)', color: '#475569', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
            Synchronised in real-time with our mosque display board at 89 Tindal Street, Balsall Heath, Birmingham (B12 9QU).
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: 'clamp(1.25rem, 3vw, 2.5rem) 0' }}>
        <div className="container" style={{ maxWidth: '1050px' }}>
          {/* Complete Interactive Timetable (Today, Full Month Schedule, Mawaqit Screen) */}
          <PrayerTimetable variant="full" showTabs={true} />

          {/* Location & Congregation Guidelines Card */}
          <div
            className="card"
            style={{
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
            }}
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: '1.5rem' }}>
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
