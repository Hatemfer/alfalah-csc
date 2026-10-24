'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Clock, Calendar, Compass, ChevronRight } from 'lucide-react';

interface PrayerTimesData {
  date: string;
  fajr: { adhan: string; iqamah: string };
  sunrise: string;
  dhuhr: { adhan: string; iqamah: string };
  asr: { adhan: string; iqamah: string };
  maghrib: { adhan: string; iqamah: string };
  isha: { adhan: string; iqamah: string };
  currentPrayer: string;
  nextPrayer: string;
  nextPrayerTime: string | null;
  timezone: string;
}

export function PrayerCountdownWidget({ initialData }: { initialData?: PrayerTimesData }) {
  const [data, setData] = useState<PrayerTimesData | null>(initialData || null);
  const [countdown, setCountdown] = useState<string>('');

  useEffect(() => {
    async function loadToday() {
      try {
        const res = await fetch('/api/v1/prayer-times/today');
        if (res.ok) {
          const json = await res.json();
          setData(json);
        }
      } catch (e) {
        console.warn('Could not fetch latest live prayer times:', e);
      }
    }

    if (!data) {
      loadToday();
    }
  }, [data]);

  // Live countdown calculation
  useEffect(() => {
    if (!data || !data.nextPrayerTime) return;

    const timer = setInterval(() => {
      const now = new Date();
      const [h, m] = data.nextPrayerTime!.split(':').map(Number);
      const target = new Date(now);
      target.setHours(h, m, 0, 0);

      // If next prayer time is earlier today, target is tomorrow (e.g. after Isha waiting for Fajr)
      if (target.getTime() <= now.getTime()) {
        target.setDate(target.getDate() + 1);
      }

      const diffMs = target.getTime() - now.getTime();
      if (diffMs <= 0) {
        setCountdown('Time for prayer');
        return;
      }

      const hours = Math.floor(diffMs / (1000 * 60 * 60));
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);

      const parts = [];
      if (hours > 0) parts.push(`${hours}h`);
      parts.push(`${minutes}m`);
      parts.push(`${seconds}s`);

      setCountdown(parts.join(' '));
    }, 1000);

    return () => clearInterval(timer);
  }, [data]);

  if (!data) {
    return (
      <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
        <Clock size={32} style={{ color: 'var(--color-primary-600)', margin: '0 auto 0.5rem' }} />
        <p style={{ color: 'var(--text-muted)' }}>Loading prayer timetable...</p>
      </div>
    );
  }

  const prayers = [
    { name: 'Fajr', ...data.fajr },
    { name: 'Sunrise', adhan: data.sunrise, iqamah: '-' },
    { name: 'Dhuhr', ...data.dhuhr },
    { name: 'Asr', ...data.asr },
    { name: 'Maghrib', ...data.maghrib },
    { name: 'Isha', ...data.isha },
  ];

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        boxShadow: 'var(--shadow-lg)',
        overflow: 'hidden',
      }}
    >
      {/* Widget Header with Next Prayer Status */}
      <div
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Clock size={18} style={{ color: 'var(--color-accent-400)' }} />
            <span style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.9 }}>
              Next Prayer: <strong>{data.nextPrayer}</strong> at {data.nextPrayerTime}
            </span>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#fef3c7' }}>
            {countdown || 'Calculating...'}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <Link
            href="/qibla"
            className="btn btn-outline"
            style={{
              borderColor: 'rgba(255, 255, 255, 0.3)',
              color: '#ffffff',
              fontSize: '0.8rem',
              padding: '0.4rem 0.8rem',
            }}
          >
            <Compass size={14} /> Qibla Compass
          </Link>
          <Link
            href="/prayer-times"
            className="btn btn-accent"
            style={{
              fontSize: '0.8rem',
              padding: '0.4rem 0.8rem',
            }}
          >
            <Calendar size={14} /> Full Month
          </Link>
        </div>
      </div>

      {/* Prayer Table */}
      <div style={{ padding: '1rem 1.5rem', overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.95rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase' }}>
              <th style={{ padding: '0.75rem 0.5rem' }}>Prayer</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Adhan (Begins)</th>
              <th style={{ padding: '0.75rem 0.5rem' }}>Iqamah (Congregation)</th>
            </tr>
          </thead>
          <tbody>
            {prayers.map((p) => {
              const isNext = p.name === data.nextPrayer;
              return (
                <tr
                  key={p.name}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: isNext ? 'var(--color-primary-50)' : 'transparent',
                    fontWeight: isNext ? 700 : 500,
                  }}
                >
                  <td style={{ padding: '0.85rem 0.5rem', color: isNext ? 'var(--color-primary-800)' : 'var(--text-primary)' }}>
                    {p.name} {isNext && <span className="badge" style={{ fontSize: '0.7rem', marginLeft: '0.5rem' }}>Next</span>}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: 'var(--text-secondary)' }}>
                    {p.adhan}
                  </td>
                  <td style={{ padding: '0.85rem 0.5rem', color: isNext ? 'var(--color-accent-600)' : 'var(--text-primary)' }}>
                    {p.iqamah}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        style={{
          padding: '0.75rem 1.5rem',
          backgroundColor: 'var(--bg-surface-alt)',
          borderTop: '1px solid var(--border-color)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
        }}
      >
        <span>Location: Balsall Heath, Birmingham (Europe/London)</span>
        <Link href="/prayer-times" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.2rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
          View Timetable Rules & Methods <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
