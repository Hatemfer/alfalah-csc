'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  Calendar,
  Compass,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Monitor,
  ArrowRight,
} from 'lucide-react';
import { getDaySchedule, getMonthSchedule, DayPrayerSchedule } from '@/utils/prayerTimes';

interface PrayerTimetableProps {
  initialDate?: string;
  showTabs?: boolean;
  variant?: 'compact-strip' | 'full';
}

export default function PrayerTimetable({
  showTabs = true,
  variant = 'full',
}: PrayerTimetableProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [activeTab, setActiveTab] = useState<'today' | 'month' | 'mawaqit-screen'>('today');
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const todaySchedule = useMemo(() => {
    return getDaySchedule(now);
  }, [now]);

  const monthSchedule = useMemo(() => {
    return getMonthSchedule(now.getFullYear(), selectedMonth);
  }, [now, selectedMonth]);

  // Compute next prayer and countdown
  const nextPrayerInfo = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const prayerOrder = [
      { id: 'fajr', name: 'Fajr', time: todaySchedule.fajr.adhan },
      { id: 'sunrise', name: 'Sunrise', time: todaySchedule.sunrise },
      { id: 'dhuhr', name: 'Dhuhr', time: todaySchedule.dhuhr.adhan },
      { id: 'asr', name: 'Asr', time: todaySchedule.asr.adhan },
      { id: 'maghrib', name: 'Maghrib', time: todaySchedule.maghrib.adhan },
      { id: 'isha', name: 'Isha', time: todaySchedule.isha.adhan },
    ];

    for (const p of prayerOrder) {
      const [h, m] = p.time.split(':').map(Number);
      const targetMin = h * 60 + m;
      if (targetMin > currentMinutes) {
        const diffMinutes = targetMin - currentMinutes - 1;
        const diffSeconds = 60 - currentSeconds;
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        return {
          id: p.id,
          name: p.name,
          time: p.time,
          countdown: `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(diffSeconds % 60).padStart(2, '0')}s`,
        };
      }
    }

    // Tomorrow's Fajr
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomSchedule = getDaySchedule(tomorrow);
    const [h, m] = tomSchedule.fajr.adhan.split(':').map(Number);
    const targetMin = 24 * 60 + h * 60 + m;
    const diffMinutes = targetMin - currentMinutes - 1;
    const diffSeconds = 60 - currentSeconds;
    const hours = Math.floor(diffMinutes / 60);
    const mins = diffMinutes % 60;

    return {
      id: 'fajr',
      name: "Tomorrow's Fajr",
      time: tomSchedule.fajr.adhan,
      countdown: `${String(hours).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(diffSeconds % 60).padStart(2, '0')}s`,
    };
  }, [now, todaySchedule]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // -------------------------------------------------------------
  // VARIANT: COMPACT STRIP (Clean, sleek prayer bar for Homepage)
  // -------------------------------------------------------------
  if (variant === 'compact-strip') {
    return (
      <div
        className="prayer-compact-strip"
        style={{
          backgroundColor: '#ffffff',
          color: 'var(--text-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.5rem 1.75rem',
          boxShadow: '0 4px 20px -2px rgba(6, 78, 59, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
            marginBottom: '1.25rem',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '0.85rem',
          }}
        >
          {/* Left: Date & Mosque Name */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: '#ecfdf5',
                color: '#047857',
                fontSize: '0.75rem',
                fontWeight: 800,
                padding: '0.3rem 0.75rem',
                borderRadius: '9999px',
                border: '1px solid #a7f3d0',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#10b981' }} />
              MAWAQIT TIMETABLE
            </span>
            <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
              {todaySchedule.dateStr}
            </span>
            <span style={{ fontSize: '0.88rem', color: '#64748b', fontWeight: 600 }}>
              • {todaySchedule.hijriStr}
            </span>
          </div>

          {/* Right: Next Prayer Countdown Badge & Full Link */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <div
              style={{
                backgroundColor: '#fffbeb',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '0.35rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.82rem',
                fontWeight: 800,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <span>Next: {nextPrayerInfo.name} ({nextPrayerInfo.time})</span>
              <span style={{ fontFamily: 'monospace', color: '#b45309', fontWeight: 800 }}>in {nextPrayerInfo.countdown}</span>
            </div>

            <Link
              href="/prayer-times"
              style={{
                color: '#047857',
                fontSize: '0.88rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
              }}
            >
              Full Timetable <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 6 Responsive Clean Prayer Pills */}
        <div
          className="prayer-pills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {[
            { id: 'fajr', name: 'Fajr', adhan: todaySchedule.fajr.adhan, iqamah: todaySchedule.fajr.iqamah, isNext: nextPrayerInfo.id === 'fajr' },
            { id: 'sunrise', name: 'Sunrise', adhan: todaySchedule.sunrise, iqamah: '—', isNext: nextPrayerInfo.id === 'sunrise' },
            { id: 'dhuhr', name: 'Dhuhr', adhan: todaySchedule.dhuhr.adhan, iqamah: todaySchedule.dhuhr.iqamah, isNext: nextPrayerInfo.id === 'dhuhr' },
            { id: 'asr', name: 'Asr', adhan: todaySchedule.asr.adhan, iqamah: todaySchedule.asr.iqamah, isNext: nextPrayerInfo.id === 'asr' },
            { id: 'maghrib', name: 'Maghrib', adhan: todaySchedule.maghrib.adhan, iqamah: todaySchedule.maghrib.iqamah, isNext: nextPrayerInfo.id === 'maghrib' },
            { id: 'isha', name: 'Isha', adhan: todaySchedule.isha.adhan, iqamah: todaySchedule.isha.iqamah, isNext: nextPrayerInfo.id === 'isha' },
          ].map((p) => (
            <div
              key={p.id}
              style={{
                backgroundColor: p.isNext ? '#f0fdf4' : '#f8fafc',
                border: p.isNext ? '2px solid #059669' : '1px solid #e2e8f0',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 0.5rem',
                textAlign: 'center',
                boxShadow: p.isNext ? '0 4px 12px rgba(5, 150, 105, 0.12)' : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {p.isNext && (
                <div
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 800,
                    letterSpacing: '0.05em',
                    color: '#059669',
                    textTransform: 'uppercase',
                    marginBottom: '0.2rem',
                  }}
                >
                  Active
                </div>
              )}
              <div style={{ marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.98rem', fontWeight: 800, color: p.isNext ? '#065f46' : '#1e293b' }}>
                  {p.name}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>
                Begins {p.adhan}
              </div>

              <div
                style={{
                  fontSize: '1.35rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: p.iqamah === '—' ? '#94a3b8' : (p.isNext ? '#047857' : '#059669'),
                  marginTop: '0.25rem',
                }}
              >
                {p.iqamah === '—' ? p.adhan : p.iqamah}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                {p.iqamah === '—' ? 'Sunrise' : 'Jama’ah'}
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @media (max-width: 640px) {
            .prayer-pills-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 0.5rem !important;
            }
          }
        `}</style>

        {/* Friday Jumu'ah reminder strip */}
        <div
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #f1f5f9',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: '#334155',
          }}
        >
          <span>
            <strong>Friday Congregational Service (Jumu’ah)</strong>: Khutbah & Salah at <strong style={{ color: '#047857' }}>13:00 (1:00 PM)</strong>
          </span>
          <span style={{ color: '#b45309', fontWeight: 600 }}>
            Weekly Tafsir Lecture: Every Saturday after Maghrib with Sheikh Jamal Al-Jabarti
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: FULL (Complete Tabbed Schedule for /prayer-times)
  // -------------------------------------------------------------
  return (
    <div className="prayer-timetable-container">
      {/* Top Header Card: Dates & Next Prayer Countdown */}
      <div
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0f766e 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '1.75rem 2rem',
          color: '#ffffff',
          marginBottom: '1.75rem',
          boxShadow: 'var(--shadow-lg)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(6px)',
                padding: '0.25rem 0.75rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <Clock size={13} style={{ color: '#fde68a' }} /> Live Mosque Timetable
            </span>
            <span style={{ fontSize: '0.85rem', color: '#a7f3d0', fontWeight: 600 }}>
              {todaySchedule.hijriStr}
            </span>
          </div>

          <h2
            style={{
              fontSize: '1.9rem',
              fontWeight: 800,
              color: '#ffffff',
              margin: '0 0 0.25rem',
            }}
          >
            {todaySchedule.dateStr}
          </h2>
          <p style={{ margin: 0, color: '#d1fae5', fontSize: '0.9rem' }}>
            Masjid Al Falah • 89 Tindal Street, Balsall Heath, Birmingham (B12 9QU)
          </p>
        </div>

        {/* Next Prayer Countdown Callout */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            backdropFilter: 'blur(10px)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem 1.5rem',
            textAlign: 'center',
            minWidth: '220px',
          }}
        >
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: '#fbbf24', fontWeight: 800, letterSpacing: '0.05em' }}>
            Next: {nextPrayerInfo.name} ({nextPrayerInfo.time})
          </div>
          <div
            style={{
              fontSize: '1.75rem',
              fontWeight: 800,
              fontFamily: 'monospace',
              color: '#ffffff',
              marginTop: '0.2rem',
              letterSpacing: '0.05em',
            }}
          >
            {nextPrayerInfo.countdown}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#93c5fd', marginTop: '0.25rem' }}>
            Official MAWAQIT Real-time Feed
          </div>
        </div>
      </div>

      {/* Tab Controls */}
      {showTabs && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
            borderBottom: '1px solid var(--border-color)',
            paddingBottom: '0.75rem',
          }}
        >
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setActiveTab('today')}
              style={{
                backgroundColor: activeTab === 'today' ? 'var(--color-primary-600)' : 'var(--bg-surface)',
                color: activeTab === 'today' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Clock size={16} /> Today&apos;s Schedule
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('month')}
              style={{
                backgroundColor: activeTab === 'month' ? 'var(--color-primary-600)' : 'var(--bg-surface)',
                color: activeTab === 'month' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Calendar size={16} /> Monthly Schedule ({monthNames[selectedMonth]})
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('mawaqit-screen')}
              style={{
                backgroundColor: activeTab === 'mawaqit-screen' ? 'var(--color-primary-600)' : 'var(--bg-surface)',
                color: activeTab === 'mawaqit-screen' ? '#ffffff' : 'var(--text-primary)',
                border: '1px solid var(--border-color)',
                padding: '0.55rem 1.1rem',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <Monitor size={16} /> Live Mawaqit TV Screen
            </button>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <Link
              href="/qibla"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
            >
              <Compass size={14} /> Qibla Direction
            </Link>
          </div>
        </div>
      )}

      {/* TAB 1: TODAY'S TIMETABLE */}
      {activeTab === 'today' && (
        <div>
          {/* Detailed Timetable Table */}
          <div
            className="card"
            style={{
              padding: '1.5rem',
              border: '1px solid var(--border-color)',
              marginBottom: '2rem',
              overflowX: 'auto',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                  Today&apos;s Complete Congregation Schedule
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                  Verified times for Masjid Al Falah (Birmingham B12 9QU)
                </p>
              </div>
              <span className="badge badge-primary">
                Official MAWAQIT Synced
              </span>
            </div>

            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border-color)', backgroundColor: 'var(--bg-surface-alt)' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>SALAH (PRAYER)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>ARABIC</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>BEGINS (ADHAN)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>JAMA&apos;AH (IQAMAH)</th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.85rem', fontWeight: 800, color: 'var(--text-secondary)' }}>STATUS</th>
                </tr>
              </thead>
              <tbody>
                {todaySchedule.prayers.map((pr) => {
                  const isCurrentNext = nextPrayerInfo.id === pr.id;
                  return (
                    <tr
                      key={pr.id}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isCurrentNext ? 'rgba(5, 150, 105, 0.08)' : 'transparent',
                      }}
                    >
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontSize: '0.95rem' }}>
                        {pr.nameEn}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)', fontSize: '1rem', fontFamily: 'serif' }}>
                        {pr.nameAr}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 700, fontFamily: 'monospace', fontSize: '1.05rem' }}>
                        {pr.adhan}
                      </td>
                      <td style={{ padding: '0.85rem 1rem', fontWeight: 800, fontFamily: 'monospace', fontSize: '1.15rem', color: 'var(--color-primary-700)' }}>
                        {pr.iqamah}
                      </td>
                      <td style={{ padding: '0.85rem 1rem' }}>
                        {isCurrentNext ? (
                          <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                            Next Prayer
                          </span>
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Scheduled</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Jumu'ah & Tafsir notices */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.25rem',
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
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-primary-600)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}
              >
                🕌
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-primary-700)', textTransform: 'uppercase' }}>
                  Friday Congregational Service
                </div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  Jumu&apos;ah Khutbah: 13:00 (1:00 PM)
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  English Reminder & Arabic Khutbah followed immediately by Salah.
                </div>
              </div>
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.25rem',
                display: 'flex',
                gap: '1rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--color-accent-500)',
                  color: '#1a180e',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.3rem',
                  flexShrink: 0,
                }}
              >
                📖
              </div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-accent-600)', textTransform: 'uppercase' }}>
                  Weekly Tafsir Lesson
                </div>
                <div style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  With Sheikh Jamal bin Saeed Al-Jabarti
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  Every Saturday after Maghrib prayer. Open to all brothers & sisters.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: MONTHLY TIMETABLE SCHEDULE */}
      {activeTab === 'month' && (
        <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                {monthNames[selectedMonth]} 2026 Timetable
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Full daily schedule for Masjid Al Falah (Birmingham B12 9QU)
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                type="button"
                onClick={() => setSelectedMonth(9)}
                className={`btn ${selectedMonth === 9 ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
              >
                October
              </button>
              <button
                type="button"
                onClick={() => setSelectedMonth(10)}
                className={`btn ${selectedMonth === 10 ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
              >
                November
              </button>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'center', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '2px solid var(--border-color)' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Date</th>
                  <th colSpan={2} style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Fajr</th>
                  <th style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Sunrise</th>
                  <th colSpan={2} style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Dhuhr</th>
                  <th colSpan={2} style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Asr</th>
                  <th colSpan={2} style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Maghrib</th>
                  <th colSpan={2} style={{ padding: '0.75rem', borderLeft: '1px solid var(--border-color)' }}>Isha</th>
                </tr>
                <tr style={{ backgroundColor: 'var(--bg-surface-alt)', borderBottom: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <th style={{ padding: '0.4rem', textAlign: 'left' }}>Day</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>Adhan</th>
                  <th style={{ padding: '0.4rem', color: 'var(--color-primary-700)' }}>Iqamah</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>—</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>Adhan</th>
                  <th style={{ padding: '0.4rem', color: 'var(--color-primary-700)' }}>Iqamah</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>Adhan</th>
                  <th style={{ padding: '0.4rem', color: 'var(--color-primary-700)' }}>Iqamah</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>Adhan</th>
                  <th style={{ padding: '0.4rem', color: 'var(--color-primary-700)' }}>Iqamah</th>
                  <th style={{ padding: '0.4rem', borderLeft: '1px solid var(--border-color)' }}>Adhan</th>
                  <th style={{ padding: '0.4rem', color: 'var(--color-primary-700)' }}>Iqamah</th>
                </tr>
              </thead>
              <tbody>
                {monthSchedule.map((ds) => {
                  const isToday = ds.day === now.getDate() && selectedMonth === now.getMonth();
                  return (
                    <tr
                      key={ds.day}
                      style={{
                        borderBottom: '1px solid var(--border-color)',
                        backgroundColor: isToday ? 'rgba(5, 150, 105, 0.1)' : 'transparent',
                        fontWeight: isToday ? 800 : 500,
                      }}
                    >
                      <td style={{ padding: '0.65rem 0.75rem', textAlign: 'left' }}>
                        {ds.day} {monthNames[selectedMonth].slice(0, 3)} {isToday && '⭐'}
                      </td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.fajr.adhan}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-primary-700)', fontWeight: 700, fontFamily: 'monospace' }}>{ds.fajr.iqamah}</td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.sunrise}</td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.dhuhr.adhan}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-primary-700)', fontWeight: 700, fontFamily: 'monospace' }}>{ds.dhuhr.iqamah}</td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.asr.adhan}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-primary-700)', fontWeight: 700, fontFamily: 'monospace' }}>{ds.asr.iqamah}</td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.maghrib.adhan}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-primary-700)', fontWeight: 700, fontFamily: 'monospace' }}>{ds.maghrib.iqamah}</td>
                      <td style={{ padding: '0.65rem', borderLeft: '1px solid var(--border-color)', fontFamily: 'monospace' }}>{ds.isha.adhan}</td>
                      <td style={{ padding: '0.65rem', color: 'var(--color-primary-700)', fontWeight: 700, fontFamily: 'monospace' }}>{ds.isha.iqamah}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: LIVE MAWAQIT SCREEN EMBED */}
      {activeTab === 'mawaqit-screen' && (
        <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, margin: 0, color: 'var(--text-primary)' }}>
                Official MAWAQIT Live Screen
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0.2rem 0 0' }}>
                Full TV screen view synced live with the mosque prayer hall display
              </p>
            </div>
            <a
              href="https://mawaqit.net/en/al-falah-community-support-centre-birmingham-b12-9qu-united-kingdom"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ fontSize: '0.85rem', padding: '0.45rem 0.85rem' }}
            >
              Open on Mawaqit.net <ExternalLink size={13} />
            </a>
          </div>

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
              title="Masjid Al Falah Mawaqit Display"
              width="100%"
              height="680"
              frameBorder="0"
              scrolling="no"
              style={{ border: 'none', display: 'block', width: '100%', height: '680px' }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
