import React from 'react';
import Link from 'next/link';
import { BookOpen, Users, Clock, MapPin, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'Community Programmes & Services | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Explore our programmes, educational study circles, youth development, and welfare services in Balsall Heath, Birmingham.',
};

async function getActivities() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/activities`, { cache: 'no-store' });
    if (res.ok) {
      return res.json();
    }
  } catch (err) {
    console.warn('Could not fetch activities for SSR:', err);
  }
  return [];
}

export default async function ActivitiesPage() {
  const activities = await getActivities();

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
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
            Programmes & Welfare Services
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Community Activities & Services
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            الأنشطة والخدمات المجتمعية
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Educational classes, youth mentorship, sisterhood gatherings, and charitable welfare for Balsall Heath and Birmingham.
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          {activities.length > 0 ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
                gap: '2rem',
              }}
            >
              {activities.map((act: any) => (
                <div key={act.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span className="badge">{act.category}</span>
                  </div>

                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem', color: 'var(--color-primary-800)' }}>
                    {act.title}
                  </h2>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>
                    {act.shortDescription}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                    {act.scheduleInfo && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Clock size={16} style={{ color: 'var(--color-primary-600)' }} />
                        <span><strong>Schedule:</strong> {act.scheduleInfo}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <MapPin size={16} style={{ color: 'var(--color-primary-600)' }} />
                      <span>{act.location}</span>
                    </div>
                  </div>

                  <Link
                    href={`/activities/${act.slug}`}
                    className="btn btn-outline"
                    style={{ width: '100%', justifyContent: 'center' }}
                  >
                    View Full Details <ArrowRight size={16} />
                  </Link>
                </div>
              ))}
            </div>
          ) : (
            <div className="card" style={{ padding: '3rem', textAlign: 'center' }}>
              <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                Currently updating our community programmes timetable.
              </p>
              <Link href="/contact" className="btn btn-primary">
                Inquire About Classes & Services
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
