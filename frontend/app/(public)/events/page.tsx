import React from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Upcoming Events & Courses | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Upcoming events, community lectures, educational courses, and study circles at Alfalah Community Support Centre in Birmingham.',
};

async function getEvents() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/events`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn('Could not fetch events for SSR:', err);
  }
  return [];
}

export default async function EventsPage() {
  const events = await getEvents();

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
            Community Calendar & Lectures
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Upcoming Events & Courses
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            الفعاليات والمحاضرات القادمة
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Stay connected with educational courses, spiritual reminders, and community gatherings hosted at Alfalah Centre.
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          {events.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {events.map((ev: any) => {
                const startDate = new Date(ev.startTime);
                const formattedDate = startDate.toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });
                const formattedTime = startDate.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: false,
                });

                return (
                  <div key={ev.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <span className="badge">{ev.category}</span>
                      {ev.isFeatured && <span className="badge badge-gold">Featured</span>}
                    </div>

                    <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-primary-800)' }}>
                      {ev.title}
                    </h2>

                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                      {ev.summary}
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Calendar size={16} style={{ color: 'var(--color-primary-600)' }} />
                        <span>{formattedDate} at {formattedTime}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <MapPin size={16} style={{ color: 'var(--color-primary-600)' }} />
                        <span>{ev.venue}</span>
                      </div>
                    </div>

                    <Link
                      href={`/events/${ev.slug}`}
                      className="btn btn-outline"
                      style={{ width: '100%', justifyContent: 'center' }}
                    >
                      Event Details <ArrowRight size={16} />
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="card" style={{ padding: '3.5rem', textAlign: 'center', maxWidth: '650px', margin: '0 auto' }}>
              <Calendar size={36} style={{ color: 'var(--color-primary-600)', margin: '0 auto 1rem' }} />
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                No Upcoming Scheduled Events Right Now
              </h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                New circles, courses, and community programmes are announced regularly. Please check our announcements or subscribe for updates.
              </p>
              <Link href="/announcements" className="btn btn-outline">
                Check Community Announcements
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
