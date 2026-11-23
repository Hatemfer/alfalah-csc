import React from 'react';
import PrayerTimetable from '@/components/PrayerTimetable';

export const metadata = {
  title: 'Prayer Timetable & Congregation Times | AL FALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Official prayer timetable for Masjid Al Falah (Birmingham B12 9QU). Live daily Start & Jamat times and official downloadable PDF timetable.',
};

export default function PrayerTimesPage() {
  return (
    <div style={{ paddingBottom: '3.5rem' }}>
      {/* Header Banner — Clean, Minimal Hero */}
      <section
        style={{
          background: 'linear-gradient(180deg, #E0F2FE 0%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
          padding: 'clamp(1.25rem, 3vw, 2rem) 1rem clamp(1rem, 2.5vw, 1.5rem)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '700px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.5vw, 2.25rem)',
              fontWeight: 800,
              marginBottom: '0.35rem',
              color: '#0F172A',
              letterSpacing: '-0.025em',
              lineHeight: 1.2,
            }}
          >
            Prayer Timetable
          </h1>

          <p
            style={{
              fontSize: 'clamp(0.85rem, 1.6vw, 0.95rem)',
              color: '#475569',
              lineHeight: 1.5,
              maxWidth: '520px',
              margin: '0 auto',
            }}
          >
            Daily start and congregation (Jama&apos;ah) times for Masjid Al Falah in Balsall Heath.
          </p>
        </div>
      </section>

      {/* Main Content Area */}
      <section style={{ padding: 'clamp(1rem, 2.5vw, 1.75rem) 0' }}>
        <div className="container" style={{ maxWidth: '1150px' }}>
          {/* Clean, Full Production Timetable */}
          <PrayerTimetable variant="full" />
        </div>
      </section>
    </div>
  );
}
