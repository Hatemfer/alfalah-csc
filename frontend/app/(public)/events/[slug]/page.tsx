import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Calendar, Clock, MapPin, ArrowLeft, ExternalLink } from 'lucide-react';

async function getEvent(slug: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/events/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn(`Could not fetch event ${slug}:`, err);
  }
  return null;
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEvent(params.slug);

  if (!event) {
    notFound();
  }

  const startDate = new Date(event.startTime);
  const endDate = new Date(event.endTime);
  const dateFormatted = startDate.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const timeFormatted = `${startDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })} - ${endDate.toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })}`;

  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <Link
            href="/events"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#d1fae5',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} /> Back to all events
          </Link>

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span className="badge badge-gold">{event.category}</span>
            {event.isFeatured && <span className="badge">Featured</span>}
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#ffffff',
            }}
          >
            {event.title}
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#d1fae5', lineHeight: 1.6 }}>
            {event.summary}
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary-800)' }}>
              Event Overview
            </h2>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {event.description || event.summary}
            </div>

            <div
              style={{
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Date & Time
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <Calendar size={18} style={{ color: 'var(--color-primary-600)' }} />
                  <div>
                    {dateFormatted}<br />
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 400 }}>
                      {timeFormatted} ({event.timezone})
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                  Venue
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <MapPin size={18} style={{ color: 'var(--color-primary-600)' }} />
                  {event.venue}
                </div>
              </div>
            </div>
          </div>

          {event.registrationUrl ? (
            <div
              style={{
                padding: '2rem',
                backgroundColor: 'var(--bg-surface-alt)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.25rem' }}>
                  Registration Required
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  Reserve your place through the official registration link.
                </p>
              </div>
              <a
                href={event.registrationUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                Register Online <ExternalLink size={16} />
              </a>
            </div>
          ) : (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-md)',
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
              }}
            >
              No pre-registration is needed for this event. All community members are welcome to attend.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
