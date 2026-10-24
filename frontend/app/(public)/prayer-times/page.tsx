import React from 'react';
import Link from 'next/link';
import { PrayerCountdownWidget } from '../../../components/PrayerCountdownWidget';
import { Clock, Calendar, Compass, Info, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Prayer Times & Monthly Timetable | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Daily congregation prayer timetable and monthly calendar for Alfalah Community Support Centre in Balsall Heath, Birmingham (B12 9QU). Fajr, Dhuhr, Asr, Maghrib, Isha and Iqamah times.',
};

async function getPrayerData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth() + 1;

    const [todayRes, monthlyRes] = await Promise.all([
      fetch(`${apiBase}/prayer-times/today`, { cache: 'no-store' }),
      fetch(`${apiBase}/prayer-times/monthly?year=${year}&month=${month}`, { cache: 'no-store' }),
    ]);

    const today = todayRes.ok ? await todayRes.json() : null;
    const monthly = monthlyRes.ok ? await monthlyRes.json() : [];

    return { today, monthly, year, month };
  } catch (err) {
    console.warn('Could not fetch prayer times for SSR:', err);
    return { today: null, monthly: [], year: 2026, month: 10 };
  }
}

export default async function PrayerTimesPage() {
  const { today, monthly, year, month } = await getPrayerData();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Birmingham, UK (Europe/London)
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Prayer Times & Iqamah Timetable
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            مواقيت الصلاة وإقامة الجماعة
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Accurate daily congregation and beginning times for Alfalah Community Support Centre, 89 Tindal Street, Balsall Heath, B12 9QU.
          </p>
        </div>
      </section>

      <section style={{ padding: '3rem 0' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          {/* Today's Live Prayer Widget */}
          <div style={{ marginBottom: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Today’s Timetable</h2>
              <Link href="/qibla" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                <Compass size={16} /> Qibla Compass
              </Link>
            </div>
            <PrayerCountdownWidget initialData={today} />
          </div>

          {/* Monthly Timetable Table */}
          <div className="card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={20} style={{ color: 'var(--color-primary-600)' }} /> Monthly Timetable — {monthNames[month - 1]} {year}
                </h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Times calculated for Balsall Heath Birmingham coordinates (52.4578° N, -1.8904° W)
                </span>
              </div>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Date</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Fajr</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Sunrise</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Dhuhr</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Asr</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Maghrib</th>
                    <th style={{ padding: '0.75rem 0.5rem' }}>Isha</th>
                  </tr>
                </thead>
                <tbody>
                  {monthly.length > 0 ? (
                    monthly.map((row: any) => {
                      const isToday = today && row.date === today.date;
                      const dayNumber = new Date(row.date).getDate();
                      return (
                        <tr
                          key={row.date}
                          style={{
                            borderBottom: '1px solid var(--border-subtle)',
                            backgroundColor: isToday ? 'var(--color-primary-50)' : 'transparent',
                            fontWeight: isToday ? 700 : 400,
                          }}
                        >
                          <td style={{ padding: '0.75rem 0.5rem', color: isToday ? 'var(--color-primary-800)' : 'var(--text-primary)' }}>
                            {dayNumber} {monthNames[month - 1].slice(0, 3)} {isToday && <span className="badge" style={{ fontSize: '0.65rem' }}>Today</span>}
                          </td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{row.fajr.adhan} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({row.fajr.iqamah})</span></td>
                          <td style={{ padding: '0.75rem 0.5rem', color: 'var(--text-muted)' }}>{row.sunrise}</td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{row.dhuhr.adhan} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({row.dhuhr.iqamah})</span></td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{row.asr.adhan} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({row.asr.iqamah})</span></td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{row.maghrib.adhan} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({row.maghrib.iqamah})</span></td>
                          <td style={{ padding: '0.75rem 0.5rem' }}>{row.isha.adhan} <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>({row.isha.iqamah})</span></td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                        Monthly timetable is loading...
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Calculation Methodology & Disclaimer */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.75rem',
              display: 'flex',
              gap: '1rem',
              alignItems: 'flex-start',
            }}
          >
            <Info size={24} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '0.2rem' }} />
            <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Calculation Method & Overrides Notice:</strong><br />
              Beginning prayer times are calculated astronomically based on the official UK / Birmingham consensus parameters (Fajr 18.0°, Isha 18.0°, Hanafi Asr method, 1/7th high-latitude rule).
              Where the centre publishes official printed timetables or specific seasonal Iqamah adjustments, authorised administrators enter overrides directly, which take precedence over astronomical calculations.
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
