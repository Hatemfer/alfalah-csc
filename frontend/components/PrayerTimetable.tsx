'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  Clock,
  ArrowRight,
  Download,
} from 'lucide-react';
import {
  getDaySchedule,
  DayPrayerSchedule,
  to12Hour,
  getOrdinal,
  formatTimeWithMode,
} from '@/utils/prayerTimes';

// Bespoke Green Lane Masjid inspired prayer icons
function PrayerIcon({
  id,
  size = 20,
  color = 'currentColor',
}: {
  id: string;
  size?: number;
  color?: string;
}) {
  switch (id) {
    case 'fajr':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v4M4.93 10.93l2.83-2.83M2 18h20" />
          <path d="M17 18a5 5 0 0 0-10 0" />
          <path d="M19.07 10.93l-2.83-2.83" />
        </svg>
      );
    case 'sunrise':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 2v6M4.93 4.93l4.24 4.24M2 18h20M20 18a8 8 0 1 0-16 0" />
          <path d="M19.07 4.93l-4.24 4.24" />
        </svg>
      );
    case 'dhuhr':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
        </svg>
      );
    case 'asr':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <circle cx="12" cy="12" r="4" />
          <path d="M12 3v3M3 12h3M5.64 5.64l2.12 2.12M18.36 18.36l2.12 2.12M2 20h20" />
        </svg>
      );
    case 'maghrib':
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M12 10v4M4.93 10.93l2.83 2.83M2 18h20" />
          <path d="M20 18a8 8 0 0 0-16 0" />
          <path d="M19.07 10.93l-2.83 2.83" />
        </svg>
      );
    case 'isha':
    default:
      return (
        <svg
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
          <circle cx="17" cy="8" r="1" fill={color} />
        </svg>
      );
  }
}

interface PrayerTimetableProps {
  initialDate?: string;
  showTabs?: boolean;
  variant?: 'compact-strip' | 'widget' | 'full';
}

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export default function PrayerTimetable({
  showTabs = true,
  variant = 'full',
}: PrayerTimetableProps) {
  const [now, setNow] = useState<Date>(new Date());
  const [mounted, setMounted] = useState(false);
  const [use24Hour, setUse24Hour] = useState<boolean>(false);
  const [liveData, setLiveData] = useState<any>(null);
  const [jumuahTime, setJumuahTime] = useState<string>('13:00');
  const [timetablePdfUrl, setTimetablePdfUrl] = useState<string>('/downloads/AlFalah-Prayer-Timetable.pdf');

  useEffect(() => {
    setMounted(true);
    let isMounted = true;

    async function fetchLiveToday() {
      try {
        const [todayRes, settingsRes] = await Promise.all([
          fetch('/api/v1/prayer-times/today'),
          fetch('/api/v1/site-settings'),
        ]);
        if (todayRes.ok) {
          const json = await todayRes.json();
          if (isMounted) setLiveData(json);
        }
        if (settingsRes.ok) {
          const s = await settingsRes.json();
          if (isMounted) {
            if (s.jumuah_time) setJumuahTime(s.jumuah_time);
            if (s.timetable_pdf_url !== undefined) setTimetablePdfUrl(s.timetable_pdf_url);
          }
        }
      } catch (err) {
        // Fall back gracefully to local pre-computed schedule
      }
    }

    fetchLiveToday();

    const timer = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  const todaySchedule = useMemo(() => {
    const base = getDaySchedule(now);
    if (!liveData) return base;
    return {
      ...base,
      fajr: {
        adhan: liveData.fajr?.adhan || base.fajr.adhan,
        iqamah: liveData.fajr?.iqamah || base.fajr.iqamah,
      },
      sunrise: liveData.sunrise || base.sunrise,
      dhuhr: {
        adhan: liveData.dhuhr?.adhan || base.dhuhr.adhan,
        iqamah: liveData.dhuhr?.iqamah || base.dhuhr.iqamah,
      },
      asr: {
        adhan: liveData.asr?.adhan || base.asr.adhan,
        iqamah: liveData.asr?.iqamah || base.asr.iqamah,
      },
      maghrib: {
        adhan: liveData.maghrib?.adhan || base.maghrib.adhan,
        iqamah: liveData.maghrib?.iqamah || base.maghrib.iqamah,
      },
      isha: {
        adhan: liveData.isha?.adhan || base.isha.adhan,
        iqamah: liveData.isha?.iqamah || base.isha.iqamah,
      },
    };
  }, [now, liveData]);

  // Compute next prayer and real-time countdown
  const nextPrayerInfo = useMemo(() => {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const currentSeconds = now.getSeconds();

    const prayerOrder = [
      { id: 'fajr', name: 'Fajr', time: todaySchedule.fajr.adhan, iqamah: todaySchedule.fajr.iqamah },
      { id: 'sunrise', name: 'Sunrise', time: todaySchedule.sunrise, iqamah: '—' },
      { id: 'dhuhr', name: 'Dhuhr', time: todaySchedule.dhuhr.adhan, iqamah: todaySchedule.dhuhr.iqamah },
      { id: 'asr', name: 'Asr', time: todaySchedule.asr.adhan, iqamah: todaySchedule.asr.iqamah },
      { id: 'maghrib', name: 'Maghrib', time: todaySchedule.maghrib.adhan, iqamah: todaySchedule.maghrib.iqamah },
      { id: 'isha', name: 'Isha', time: todaySchedule.isha.adhan, iqamah: todaySchedule.isha.iqamah },
    ];

    for (const p of prayerOrder) {
      const [h, m] = p.time.split(':').map(Number);
      const targetMin = h * 60 + m;
      if (targetMin > currentMinutes) {
        const diffMinutes = targetMin - currentMinutes - 1;
        const diffSeconds = 60 - currentSeconds;
        const hours = Math.floor(diffMinutes / 60);
        const mins = diffMinutes % 60;
        const countdownStr = hours > 0
          ? `${hours}h ${String(mins).padStart(2, '0')}m ${String(diffSeconds % 60).padStart(2, '0')}s`
          : `${mins}m ${String(diffSeconds % 60).padStart(2, '0')}s`;

        return {
          id: p.id,
          name: p.name,
          time: p.time,
          formattedTime: use24Hour ? p.time : to12Hour(p.time),
          iqamah: p.iqamah,
          countdown: countdownStr,
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
    const countdownStr = hours > 0
      ? `${hours}h ${String(mins).padStart(2, '0')}m ${String(diffSeconds % 60).padStart(2, '0')}s`
      : `${mins}m ${String(diffSeconds % 60).padStart(2, '0')}s`;

    return {
      id: 'fajr',
      name: "Tomorrow's Fajr",
      time: tomSchedule.fajr.adhan,
      formattedTime: use24Hour ? tomSchedule.fajr.adhan : to12Hour(tomSchedule.fajr.adhan),
      iqamah: tomSchedule.fajr.iqamah,
      countdown: countdownStr,
    };
  }, [now, todaySchedule, use24Hour]);

  // Format live ticking clock for Green Lane Masjid header (e.g. "6:18:03 PM")
  const formattedLiveClock = useMemo(() => {
    if (!mounted) return '--:--:--';
    return now.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      second: '2-digit',
      hour12: !use24Hour,
    });
  }, [now, mounted, use24Hour]);

  const monthName = MONTH_NAMES[now.getMonth()];
  const dayNumber = now.getDate();
  const dayOrdinal = getOrdinal(dayNumber);

  // -------------------------------------------------------------
  // REUSABLE COMPONENT: GREEN LANE MASJID DAILY SALAT WIDGET
  // -------------------------------------------------------------
  const renderGLMSalatWidget = () => (
    <aside
      className="glm-prayer-widget"
      style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid #E2E8F0',
        boxShadow: '0 10px 30px -5px rgba(2, 132, 199, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.03)',
        overflow: 'hidden',
        width: '100%',
      }}
    >
      {/* Widget Header with Green Lane Masjid Title */}
      <div
        className="glm-widget-header"
        style={{
          backgroundColor: '#0284C7',
          backgroundImage: 'linear-gradient(135deg, #0369A1 0%, #0284C7 100%)',
          color: '#ffffff',
          padding: '1.15rem 1.4rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '2px solid #0284C7',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Clock size={20} style={{ color: '#FDE047' }} />
          <h3
            style={{
              fontSize: '1.18rem',
              fontWeight: 800,
              margin: 0,
              letterSpacing: '-0.01em',
              color: '#ffffff',
            }}
          >
            Daily Prayer Times
          </h3>
        </div>

        {/* 12h / 24h toggle pill */}
        <button
          type="button"
          onClick={() => setUse24Hour(!use24Hour)}
          className="glm-time-mode-btn"
          style={{
            background: 'rgba(255, 255, 255, 0.16)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            color: '#ffffff',
            borderRadius: '9999px',
            fontSize: '0.72rem',
            fontWeight: 800,
            padding: '0.2rem 0.6rem',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
          }}
          title="Toggle 12h / 24h time format"
        >
          {use24Hour ? '24-Hour' : '12-Hour'}
        </button>
      </div>

      {/* Date & Live Clock Banner (Green Lane Masjid Style) */}
      <div
        className="glm-date-clock-row"
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          padding: '1.1rem 1.4rem',
          backgroundColor: '#F8FAFC',
          borderBottom: '1px solid #E2E8F0',
          gap: '1rem',
          alignItems: 'center',
        }}
      >
        {/* Left: Month + Big Day Number */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
            suppressHydrationWarning
          >
            {monthName}
          </span>
          <span
            className="day-num"
            style={{
              fontSize: '1.9rem',
              fontWeight: 900,
              color: '#0369A1',
              lineHeight: 1.1,
              fontFeatureSettings: '"tnum"',
            }}
            suppressHydrationWarning
          >
            {dayNumber}
            <small
              style={{
                fontSize: '0.9rem',
                fontWeight: 700,
                color: '#64748B',
                verticalAlign: 'super',
                marginLeft: '2px',
              }}
            >
              {dayOrdinal}
            </small>
          </span>
        </div>

        {/* Right: Current Time + Live Ticking Clock */}
        <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column' }}>
          <span
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#64748B',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Current Time
          </span>
          <span
            id="clockbox"
            style={{
              fontSize: '1.65rem',
              fontWeight: 900,
              color: '#0F172A',
              fontFamily: 'system-ui, -apple-system, monospace',
              lineHeight: 1.1,
            }}
            suppressHydrationWarning
          >
            {formattedLiveClock}
          </span>
        </div>
      </div>

      {/* Next Prayer Live Countdown Bar */}
      <div
        className="glm-countdown-bar"
        style={{
          backgroundColor: '#FEF3C7',
          borderBottom: '1px solid #FDE68A',
          padding: '0.55rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.82rem',
          color: '#92400E',
          fontWeight: 700,
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }} suppressHydrationWarning>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#D97706',
              display: 'inline-block',
              animation: 'pulse 1.8s infinite',
            }}
          />
          Next: <strong>{nextPrayerInfo.name}</strong> ({nextPrayerInfo.formattedTime})
        </span>
        <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#B45309' }} suppressHydrationWarning>
          {mounted ? `in ${nextPrayerInfo.countdown}` : 'calculating...'}
        </span>
      </div>

      {/* Main Prayer Times Table (Green Lane Masjid Table Format: Start & Jamat) */}
      <div style={{ padding: '0.5rem 0' }}>
        <table
          className="glm-prayer-table"
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            fontSize: '0.94rem',
          }}
        >
          <thead>
            <tr
              style={{
                borderBottom: '1px solid #E2E8F0',
                color: '#64748B',
                fontSize: '0.76rem',
                fontWeight: 800,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              <th style={{ padding: '0.65rem 1rem', textAlign: 'left' }}>Prayer</th>
              <th style={{ padding: '0.65rem 0.5rem', textAlign: 'center', width: '36px' }}></th>
              <th style={{ padding: '0.65rem 0.75rem', textAlign: 'center', fontWeight: 800 }}>Start</th>
              <th style={{ padding: '0.65rem 1rem', textAlign: 'center', fontWeight: 800, color: '#0369A1' }}>
                Jamat
              </th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                id: 'fajr',
                name: 'Fajr',
                start: todaySchedule.fajr.adhan,
                jamat: todaySchedule.fajr.iqamah,
                isNext: nextPrayerInfo.id === 'fajr',
              },
              {
                id: 'sunrise',
                name: 'Sunrise',
                start: todaySchedule.sunrise,
                jamat: '—',
                isNext: nextPrayerInfo.id === 'sunrise',
              },
              {
                id: 'dhuhr',
                name: 'Dhuhr',
                start: todaySchedule.dhuhr.adhan,
                jamat: todaySchedule.dhuhr.iqamah,
                isNext: nextPrayerInfo.id === 'dhuhr',
              },
              {
                id: 'asr',
                name: 'Asr',
                start: todaySchedule.asr.adhan,
                jamat: todaySchedule.asr.iqamah,
                isNext: nextPrayerInfo.id === 'asr',
              },
              {
                id: 'maghrib',
                name: 'Maghrib',
                start: todaySchedule.maghrib.adhan,
                jamat: todaySchedule.maghrib.iqamah,
                isNext: nextPrayerInfo.id === 'maghrib',
              },
              {
                id: 'isha',
                name: 'Isha',
                start: todaySchedule.isha.adhan,
                jamat: todaySchedule.isha.iqamah,
                isNext: nextPrayerInfo.id === 'isha',
              },
            ].map((p, index) => {
              const formattedStart = formatTimeWithMode(p.start, use24Hour);
              const formattedJamat = p.jamat === '—' ? '—' : formatTimeWithMode(p.jamat, use24Hour);

              return (
                <tr
                  key={p.id}
                  style={{
                    borderBottom: index < 5 ? '1px solid #F1F5F9' : 'none',
                    backgroundColor: p.isNext ? '#F0F9FF' : index % 2 === 1 ? '#FAFCFF' : 'transparent',
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {/* Prayer Name */}
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      fontWeight: p.isNext ? 800 : 700,
                      color: p.isNext ? '#0284C7' : '#1E293B',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>{p.name}</span>
                    {p.isNext && (
                      <span
                        style={{
                          fontSize: '0.65rem',
                          fontWeight: 800,
                          backgroundColor: '#0284C7',
                          color: '#ffffff',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '9999px',
                          textTransform: 'uppercase',
                        }}
                      >
                        Next
                      </span>
                    )}
                  </td>

                  {/* Prayer Icon */}
                  <td style={{ padding: '0.75rem 0.5rem', textAlign: 'center' }}>
                    <span style={{ color: p.isNext ? '#0284C7' : '#64748B', display: 'inline-block' }}>
                      <PrayerIcon id={p.id} size={18} />
                    </span>
                  </td>

                  {/* Start / Adhan */}
                  <td
                    style={{
                      padding: '0.75rem 0.75rem',
                      textAlign: 'center',
                      fontWeight: 700,
                      fontFamily: 'monospace',
                      fontSize: '0.98rem',
                      color: p.isNext ? '#0284C7' : '#334155',
                    }}
                  >
                    {formattedStart}
                  </td>

                  {/* Jamat / Iqamah */}
                  <td
                    style={{
                      padding: '0.75rem 1rem',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontFamily: 'monospace',
                      fontSize: '1.05rem',
                      color: p.jamat === '—' ? '#94A3B8' : p.isNext ? '#0369A1' : '#0284C7',
                    }}
                  >
                    {formattedJamat}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Jumu'ah Khutbah Box (Green Lane Masjid Style) */}
      <div
        className="glm-jumuah-box"
        style={{
          margin: '0.75rem 1rem 1rem',
          padding: '0.9rem 1.1rem',
          backgroundColor: '#F0F9FF',
          border: '1.5px dashed #BAE6FD',
          borderRadius: '12px',
        }}
      >
        <div
          style={{
            fontSize: '0.75rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            color: '#0369A1',
            letterSpacing: '0.04em',
            marginBottom: '0.2rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
          }}
        >
          <span>🕌</span> Jumu&apos;ah Khutbah
        </div>
        <p
          style={{
            margin: 0,
            fontSize: '0.86rem',
            color: '#1E293B',
            lineHeight: 1.45,
          }}
        >
          Friday Congregational Service in <strong>English & Arabic</strong> at{' '}
          <strong style={{ color: '#0284C7' }}>13:00 (1:00 PM)</strong> sharp.
        </p>
      </div>

      {/* Full Prayer Times CTA Button (Direct PDF like Green Lane Masjid) */}
      <div className="glm-actions-box" style={{ padding: '0 1rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        <a
          href="/downloads/AlFalah-Prayer-Timetable.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="glm-full-btn"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            width: '100%',
            backgroundColor: '#0284C7',
            color: '#ffffff',
            padding: '0.85rem 1.25rem',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.95rem',
            textDecoration: 'none',
            boxShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
            transition: 'all 0.2s ease',
          }}
          title="Open official PDF timetable in browser (GLM style)"
        >
          <span>Full Prayer Times (PDF)</span>
          <ArrowRight size={17} />
        </a>

        <Link
          href="/prayer-times"
          style={{
            textAlign: 'center',
            fontSize: '0.82rem',
            color: '#0369A1',
            fontWeight: 700,
            textDecoration: 'none',
            padding: '0.2rem 0',
          }}
        >
          View Full Interactive Monthly Timetable &rarr;
        </Link>
      </div>
    </aside>
  );

  // -------------------------------------------------------------
  // VARIANT: WIDGET ONLY
  // -------------------------------------------------------------
  if (variant === 'widget') {
    return renderGLMSalatWidget();
  }

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
          boxShadow: '0 4px 20px -2px rgba(24, 51, 79, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
          border: '1px solid #E4EDF5',
        }}
      >
        {/* ROW 1: Live Badge & Full Timetable Link */}
        <div
          className="prayer-compact-top-bar"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '0.4rem',
          }}
        >
          <span
            style={{
              backgroundColor: '#DCEEFF',
              color: '#245C91',
              fontSize: '0.72rem',
              fontWeight: 800,
              padding: '0.2rem 0.6rem',
              borderRadius: '9999px',
              border: '1px solid #BADAFA',
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            Live Timetable
          </span>

          <Link
            href="/prayer-times"
            style={{
              color: '#0284C7',
              fontSize: '0.78rem',
              fontWeight: 800,
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.25rem',
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            Full Timetable <ArrowRight size={13} />
          </Link>
        </div>

        {/* ROW 2: Gregorian Date & Hijri Date */}
        <div
          className="prayer-compact-date-row"
          style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: '0.4rem',
            flexWrap: 'wrap',
            marginBottom: '0.75rem',
          }}
        >
          <span
            style={{
              fontSize: 'clamp(0.92rem, 2.5vw, 1.05rem)',
              fontWeight: 800,
              color: '#18334F',
              letterSpacing: '-0.015em',
            }}
            suppressHydrationWarning
          >
            {todaySchedule.dateStr}
          </span>
          <span
            style={{
              fontSize: '0.78rem',
              color: '#657B91',
              fontWeight: 600,
            }}
            suppressHydrationWarning
          >
            • {todaySchedule.hijriStr}
          </span>
        </div>

        {/* ROW 3: Next Prayer Countdown Bar */}
        <div
          className="prayer-countdown-bar"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            color: '#92400E',
            padding: '0.45rem 0.75rem',
            borderRadius: '10px',
            fontSize: '0.8rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }} suppressHydrationWarning>
            Next: <strong>{nextPrayerInfo.name}</strong> ({nextPrayerInfo.time})
          </span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontVariantNumeric: 'tabular-nums',
              color: '#B45309',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            suppressHydrationWarning
          >
            {mounted ? `in ${nextPrayerInfo.countdown}` : 'calculating...'}
          </span>
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
              className={`prayer-pill ${p.isNext ? 'is-next' : ''}`}
              style={{
                backgroundColor: p.isNext ? '#F0F9FF' : '#FFFFFF',
                border: p.isNext ? '2px solid #0284C7' : '1px solid #E4EDF5',
                borderRadius: 'var(--radius-md)',
                padding: '0.85rem 0.5rem',
                textAlign: 'center',
                boxShadow: p.isNext ? '0 6px 18px rgba(2, 132, 199, 0.16)' : '0 1px 3px rgba(24, 51, 79, 0.04)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ marginBottom: '0.2rem' }}>
                <span className="prayer-pill-name" style={{ fontSize: '0.96rem', fontWeight: 800, color: p.isNext ? '#0284C7' : '#0F172A' }}>
                  {p.name}
                </span>
              </div>

              <div className="prayer-pill-begins" style={{ fontSize: '0.74rem', color: '#657B91', fontWeight: 600 }}>
                Begins {p.adhan}
              </div>

              <div
                className="prayer-pill-time"
                style={{
                  fontSize: '1.32rem',
                  fontWeight: 800,
                  fontFamily: 'monospace',
                  color: p.iqamah === '—' ? '#94A3B8' : (p.isNext ? '#0284C7' : '#0F172A'),
                  marginTop: '0.2rem',
                }}
              >
                {p.iqamah === '—' ? p.adhan : p.iqamah}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#657B91', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em' }}>
                {p.iqamah === '—' ? 'Sunrise' : 'Jama’ah'}
              </div>
            </div>
          ))}
        </div>

        <style jsx>{`
          @media (max-width: 640px) {
            .prayer-pills-grid {
              grid-template-columns: repeat(3, 1fr) !important;
              gap: 0.45rem !important;
            }
            :global(.prayer-pill) {
              padding: 0.65rem 0.25rem !important;
            }
            :global(.prayer-pill-name) {
              font-size: 0.86rem !important;
            }
            :global(.prayer-pill-begins) {
              font-size: 0.68rem !important;
            }
            :global(.prayer-pill-time) {
              font-size: 1.14rem !important;
            }
          }
        `}</style>

        {/* Friday Jumu'ah reminder strip */}
        <div
          className="prayer-jumuah-strip"
          style={{
            marginTop: '1rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid #EEF4FA',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.85rem',
            color: '#0F172A',
          }}
        >
          <span>
            <strong>Friday Congregational Service (Jumu’ah)</strong>: Khutbah &amp; Salah at{' '}
            <strong style={{ color: '#0284C7' }}>{jumuahTime} ({to12Hour(jumuahTime)})</strong>
          </span>
          <span style={{ color: '#B45309', fontWeight: 600 }}>
            Weekly Tafsir Lecture: Every Saturday after Maghrib with Sheikh Jamal Al-Jabarti
          </span>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // VARIANT: FULL (Clean, Complete Production Timetable)
  // -------------------------------------------------------------
  return (
    <div className="prayer-full-wrapper" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* SECTION 1: TODAY'S LIVE CONGREGATION STRIP */}
      <div
        className="prayer-compact-strip"
        style={{
          backgroundColor: '#ffffff',
          color: 'var(--text-primary)',
          borderRadius: '16px',
          padding: '1.25rem 1.5rem',
          boxShadow: '0 4px 20px -2px rgba(24, 51, 79, 0.06), 0 2px 6px -1px rgba(0, 0, 0, 0.02)',
          border: '1px solid #E4EDF5',
        }}
      >
        {/* ROW 1: Date & 12h/24h toggle */}
        <div
          className="prayer-compact-header-row1"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem',
            marginBottom: '0.75rem',
          }}
        >
          {/* Left: Badge + Date */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', minWidth: 0 }}>
            <span
              style={{
                backgroundColor: '#DCEEFF',
                color: '#245C91',
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                border: '1px solid #BADAFA',
                display: 'inline-flex',
                alignItems: 'center',
                flexShrink: 0,
                whiteSpace: 'nowrap',
              }}
            >
              Today&apos;s Prayers
            </span>
            <div className="prayer-date-text" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#18334F', whiteSpace: 'nowrap' }} suppressHydrationWarning>
                {todaySchedule.dateStr}
              </span>
              <span className="prayer-hijri-text" style={{ fontSize: '0.8rem', color: '#657B91', fontWeight: 600, whiteSpace: 'nowrap' }} suppressHydrationWarning>
                • {todaySchedule.hijriStr}
              </span>
            </div>
          </div>

          {/* Right: 12h/24h toggle */}
          <button
            type="button"
            onClick={() => setUse24Hour(!use24Hour)}
            className="btn btn-outline prayer-format-btn"
            style={{
              fontSize: '0.74rem',
              padding: '0.25rem 0.65rem',
              fontWeight: 700,
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
            title="Toggle 12h / 24h time format"
          >
            {use24Hour ? '24h' : '12h'}
          </button>
        </div>

        {/* ROW 2: Next Prayer Countdown Bar */}
        <div
          className="prayer-countdown-bar"
          style={{
            backgroundColor: '#FFFBEB',
            border: '1px solid #FDE68A',
            color: '#92400E',
            padding: '0.45rem 0.85rem',
            borderRadius: '10px',
            fontSize: '0.82rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.5rem',
            marginBottom: '1rem',
          }}
        >
          <span style={{ whiteSpace: 'nowrap', flexShrink: 0 }} suppressHydrationWarning>
            Next: <strong>{nextPrayerInfo.name}</strong> ({nextPrayerInfo.formattedTime})
          </span>
          <span
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontVariantNumeric: 'tabular-nums',
              color: '#B45309',
              fontWeight: 800,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
            suppressHydrationWarning
          >
            {mounted ? `in ${nextPrayerInfo.countdown}` : 'calculating...'}
          </span>
        </div>

        {/* ROW 3: 6 Responsive Clean Prayer Pills */}
        <div
          className="prayer-pills-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: '0.65rem',
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
              className={`prayer-pill ${p.isNext ? 'is-next' : ''}`}
              style={{
                backgroundColor: p.isNext ? '#F0F9FF' : '#FFFFFF',
                border: p.isNext ? '2px solid #0284C7' : '1px solid #E4EDF5',
                borderRadius: '12px',
                padding: '0.75rem 0.35rem',
                textAlign: 'center',
                boxShadow: p.isNext ? '0 4px 14px rgba(2, 132, 199, 0.14)' : '0 1px 3px rgba(24, 51, 79, 0.04)',
                transition: 'all 0.2s ease',
                minWidth: 0,
              }}
            >
              <div style={{ marginBottom: '0.15rem' }}>
                <span className="prayer-pill-name" style={{ fontSize: '0.92rem', fontWeight: 800, color: p.isNext ? '#0284C7' : '#0F172A', whiteSpace: 'nowrap' }}>
                  {p.name}
                </span>
              </div>

              <div className="prayer-pill-begins" style={{ fontSize: '0.7rem', color: '#657B91', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Begins {formatTimeWithMode(p.adhan, use24Hour)}
              </div>

              <div
                className="prayer-pill-time"
                style={{
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontVariantNumeric: 'tabular-nums',
                  letterSpacing: '-0.02em',
                  color: p.iqamah === '—' ? '#94A3B8' : (p.isNext ? '#0284C7' : '#0F172A'),
                  marginTop: '0.2rem',
                  whiteSpace: 'nowrap',
                }}
              >
                {p.iqamah === '—' ? formatTimeWithMode(p.adhan, use24Hour) : formatTimeWithMode(p.iqamah, use24Hour)}
              </div>
              <div className="prayer-pill-label" style={{ fontSize: '0.64rem', color: '#657B91', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>
                {p.iqamah === '—' ? 'Sunrise' : 'Jama’ah'}
              </div>
            </div>
          ))}
        </div>

        {/* Friday Jumu'ah reminder strip */}
        <div
          className="prayer-jumuah-strip"
          style={{
            marginTop: '0.85rem',
            paddingTop: '0.65rem',
            borderTop: '1px solid #EEF4FA',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            fontSize: '0.82rem',
            color: '#0F172A',
            textAlign: 'center',
          }}
        >
          <span>
            <strong>Friday Jumu’ah Service</strong>: Khutbah &amp; Salah at{' '}
            <strong style={{ color: '#0284C7' }}>{jumuahTime} ({to12Hour(jumuahTime)})</strong> sharp
          </span>
        </div>
      </div>

      {/* SECTION 2: OFFICIAL BI-MONTHLY TIMETABLE PDF */}
      {timetablePdfUrl && timetablePdfUrl.trim().length > 0 && (
      <div
        className="official-timetable-card"
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 2px 10px rgba(0, 0, 0, 0.03)',
          padding: 'clamp(1rem, 2.5vw, 1.35rem)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div style={{ maxWidth: '580px', flex: 1, minWidth: '220px' }}>
          <h3
            className="timetable-card-title"
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.18rem)',
              fontWeight: 800,
              margin: '0 0 0.25rem',
              color: '#0F172A',
              letterSpacing: '-0.015em',
              lineHeight: 1.3,
            }}
          >
            Download Official Bi-Monthly Timetable
          </h3>
          <p
            className="timetable-card-desc"
            style={{
              fontSize: '0.84rem',
              color: '#64748B',
              margin: 0,
            }}
          >
            Printable PDF schedule for your home or workplace.
          </p>
        </div>

        <div className="timetable-card-actions">
          <a
            href={timetablePdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary timetable-card-btn"
            style={{
              padding: '0.65rem 1.25rem',
              fontWeight: 800,
              fontSize: '0.86rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              textDecoration: 'none',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.28)',
              whiteSpace: 'nowrap',
            }}
          >
            <Download size={15} /> Open Official Timetable (PDF)
          </a>
        </div>
      </div>
      )}

      {/* Responsive Styles for Clean Mobile Layout */}
      <style jsx global>{`
        @media (max-width: 640px) {
          .prayer-full-wrapper {
            gap: 0.85rem !important;
          }
          .prayer-compact-strip {
            padding: 0.75rem 0.65rem !important;
            border-radius: 12px !important;
          }
          .prayer-compact-top-bar {
            margin-bottom: 0.35rem !important;
          }
          .prayer-compact-date-row {
            margin-bottom: 0.5rem !important;
          }
          .prayer-compact-header-row1 {
            gap: 0.4rem !important;
            margin-bottom: 0.5rem !important;
          }
          .prayer-date-text span {
            font-size: 0.82rem !important;
          }
          .prayer-hijri-text {
            font-size: 0.74rem !important;
          }
          .prayer-format-btn {
            font-size: 0.7rem !important;
            padding: 0.2rem 0.5rem !important;
          }
          .prayer-countdown-bar {
            padding: 0.4rem 0.65rem !important;
            font-size: 0.76rem !important;
            margin-bottom: 0.65rem !important;
            border-radius: 8px !important;
          }
          .prayer-pills-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.35rem !important;
          }
          .prayer-pill {
            padding: 0.45rem 0.15rem !important;
            border-radius: 8px !important;
          }
          .prayer-pill-name {
            font-size: 0.8rem !important;
          }
          .prayer-pill-begins {
            font-size: 0.62rem !important;
            white-space: nowrap !important;
          }
          .prayer-pill-time {
            font-size: 0.95rem !important;
            white-space: nowrap !important;
            letter-spacing: -0.03em !important;
          }
          .prayer-pill-label {
            font-size: 0.58rem !important;
          }
          .prayer-jumuah-strip {
            font-size: 0.74rem !important;
            margin-top: 0.6rem !important;
            padding-top: 0.5rem !important;
            gap: 0.2rem !important;
          }
          .official-timetable-card {
            padding: 0.85rem 0.75rem !important;
            border-radius: 12px !important;
            gap: 0.75rem !important;
          }
          .timetable-card-title {
            font-size: 1rem !important;
            margin-bottom: 0.2rem !important;
          }
          .timetable-card-desc {
            font-size: 0.78rem !important;
            line-height: 1.4 !important;
          }
          .timetable-card-actions {
            width: 100% !important;
          }
          .timetable-card-btn {
            width: 100% !important;
            justify-content: center !important;
            font-size: 0.82rem !important;
            padding: 0.55rem 0.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}
