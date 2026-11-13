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
      {/* Page Header - Clean, Luminous & Modern */}
      <section
        style={{
          background: 'linear-gradient(180deg, #E0F2FE 0%, #F8FAFC 100%)',
          borderBottom: '1px solid #E2E8F0',
          padding: '2.5rem 1.25rem 2rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#0F172A',
              letterSpacing: '-0.025em',
            }}
          >
            Community Announcements
          </h1>
          <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.55, maxWidth: '640px', margin: '0 auto' }}>
            Stay updated with official statements, seasonal timetables, Eid arrangements, and centre notices.
          </p>
        </div>
      </section>

      <section style={{ padding: '2rem 0 3rem' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          {announcements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
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
                      borderLeft: a.isPinned ? '4px solid #0284C7' : '1px solid #E2E8F0',
                      padding: '1.5rem',
                      borderRadius: '16px',
                      backgroundColor: '#FFFFFF',
                      boxShadow: '0 2px 10px rgba(15, 23, 42, 0.04)',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        {a.isPinned && <span className="badge badge-gold">Pinned</span>}
                        {a.badgeText && <span className="badge">{a.badgeText}</span>}
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                        <Calendar size={14} /> {publishedDate}
                      </div>
                    </div>

                    <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.6rem' }}>
                      {a.title}
                    </h2>

                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.65, whiteSpace: 'pre-line' }}>
                      {a.content}
                    </p>
                  </div>
                );
              })}
            </div>
          ) : (
            <div
              className="card"
              style={{
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: '#FFFFFF',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 4px 16px rgba(15, 23, 42, 0.04)',
                maxWidth: '600px',
                margin: '0 auto',
              }}
            >
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: '#E0F2FE',
                  color: '#0284C7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                }}
              >
                <Bell size={26} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.35rem' }}>
                No Active Announcements
              </h3>
              <p style={{ color: '#64748B', fontSize: '0.88rem', lineHeight: 1.55, maxWidth: '420px', margin: '0 auto 1.5rem' }}>
                All current notices have concluded. Please check back soon for upcoming Eid, seasonal prayer timetables, and community notices.
              </p>
              <Link
                href="/"
                className="btn btn-primary"
                style={{
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  padding: '0.6rem 1.25rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                Return to Homepage →
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
