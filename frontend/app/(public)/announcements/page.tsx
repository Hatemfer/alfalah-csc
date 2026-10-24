import React from 'react';
import Link from 'next/link';
import { Bell, Calendar, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Community Announcements & Notices | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Important updates, announcements, and administrative notices from Alfalah Community Support Centre in Balsall Heath, Birmingham.',
};

async function getAnnouncements() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/announcements`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn('Could not fetch announcements for SSR:', err);
  }
  return [];
}

export default async function AnnouncementsPage() {
  const announcements = await getAnnouncements();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Official Centre Notices
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Community Announcements
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            الإعلانات والبيانات الرسمية
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Stay updated with official statements, seasonal timetables, Eid arrangements, and centre notices.
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          {announcements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {announcements.map((a: any) => {
                const publishedDate = new Date(a.publishedAt).toLocaleDateString('en-GB', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                });

                return (
                  <div
                    key={a.id}
                    className="card"
                    style={{
                      borderLeft: a.isPinned ? '4px solid var(--color-accent-500)' : '1px solid var(--border-color)',
                      padding: '2rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {a.isPinned && <span className="badge badge-gold">Pinned</span>}
                        {a.badgeText && <span className="badge">{a.badgeText}</span>}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {publishedDate}
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                      {a.title}
                    </h2>

                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                      {a.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <Bell size={36} style={{ color: 'var(--color-primary-600)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                No active announcements at present
              </h3>
              <p style={{ color: 'var(--text-muted)' }}>
                Please check back soon for updates from Alfalah Community Support Centre.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
