import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, ArrowLeft, ShieldCheck, Mail } from 'lucide-react';

async function getActivity(slug: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/activities/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn(`Could not fetch activity ${slug}:`, err);
  }
  return null;
}

export default async function ActivityDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const activity = await getActivity(params.slug);

  if (!activity) {
    notFound();
  }

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
            href="/activities"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#d1fae5',
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} /> Back to all activities
          </Link>

          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge badge-gold">{activity.category}</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#ffffff',
            }}
          >
            {activity.title}
          </h1>

          <p style={{ fontSize: '1.15rem', color: '#d1fae5', lineHeight: 1.6 }}>
            {activity.shortDescription}
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary-800)' }}>
              About This Programme
            </h2>
            <div style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2rem' }}>
              {activity.fullDescription || activity.shortDescription}
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
                  Location
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                  <MapPin size={18} style={{ color: 'var(--color-primary-600)' }} />
                  {activity.location}
                </div>
              </div>

              {activity.scheduleInfo && (
                <div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                    Schedule
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
                    <Clock size={18} style={{ color: 'var(--color-primary-600)' }} />
                    {activity.scheduleInfo}
                  </div>
                </div>
              )}
            </div>
          </div>

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
                Interested in joining this activity?
              </h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Reach out to our centre coordinators for registration details and timings.
              </p>
            </div>
            <Link href="/contact" className="btn btn-primary">
              <Mail size={16} /> Contact Coordinator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
