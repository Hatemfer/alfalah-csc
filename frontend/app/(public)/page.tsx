import React from 'react';
import Link from 'next/link';
import { PrayerCountdownWidget } from '../../components/PrayerCountdownWidget';
import {
  MapPin,
  Calendar,
  BookOpen,
  Users,
  Bell,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  Compass,
} from 'lucide-react';

async function getHomepageData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const [sectionsRes, activitiesRes, announcementsRes, eventsRes] = await Promise.all([
      fetch(`${apiBase}/homepage`, { cache: 'no-store' }),
      fetch(`${apiBase}/activities`, { cache: 'no-store' }),
      fetch(`${apiBase}/announcements`, { cache: 'no-store' }),
      fetch(`${apiBase}/events`, { cache: 'no-store' }),
    ]);

    const sections = sectionsRes.ok ? await sectionsRes.json() : [];
    const activities = activitiesRes.ok ? await activitiesRes.json() : [];
    const announcements = announcementsRes.ok ? await announcementsRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    return { sections, activities, announcements, events };
  } catch (err) {
    console.warn('API fetch failed during SSR, using fallback:', err);
    return { sections: [], activities: [], announcements: [], events: [] };
  }
}

export default async function HomePage() {
  const { sections, activities, announcements, events } = await getHomepageData();

  // Find CMS configured sections or fallback to approved copy
  const heroSection = sections.find((s: any) => s.sectionKey === 'hero');
  const aboutSection = sections.find((s: any) => s.sectionKey === 'about_intro');

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '4.5rem 1.5rem',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <div className="container" style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <span className="badge badge-gold" style={{ fontSize: '0.85rem' }}>
                <ShieldCheck size={14} /> Registered Charity No. 1150221
              </span>
              <span className="arabic-title" style={{ fontSize: '1.25rem', color: '#fef3c7' }}>
                مركز الفلاح الإسلامي
              </span>
            </div>

            <h1
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.25rem)',
                fontWeight: 800,
                lineHeight: 1.15,
                letterSpacing: '-0.03em',
                marginBottom: '1.25rem',
                color: '#ffffff',
              }}
            >
              {heroSection?.title || 'Serving Faith, Family, and Community in Birmingham'}
            </h1>

            <p
              style={{
                fontSize: '1.15rem',
                color: '#d1fae5',
                marginBottom: '2rem',
                lineHeight: 1.6,
                maxWidth: '650px',
              }}
            >
              {heroSection?.content ||
                'Welcome to ALFALAH COMMUNITY SUPPORT CENTRE. Located in Balsall Heath, Birmingham, we provide congregation prayers, educational study circles, youth mentorship, and community welfare support.'}
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link
                href="/prayer-times"
                className="btn btn-accent"
                style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}
              >
                <Clock size={18} /> Daily Prayer Timetable
              </Link>
              <Link
                href="/activities"
                className="btn btn-outline"
                style={{
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                  color: '#ffffff',
                  padding: '0.85rem 1.75rem',
                  fontSize: '1rem',
                }}
              >
                <BookOpen size={18} /> Our Community Programmes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Grid: Prayer Widget & Announcements */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2.5rem',
              alignItems: 'start',
            }}
          >
            {/* Live Prayer Times Widget */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Daily Prayer Timetable</h2>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Balsall Heath (UK)</span>
              </div>
              <PrayerCountdownWidget />
            </div>

            {/* Announcements & Notices */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Bell size={20} style={{ color: 'var(--color-accent-500)' }} /> Important Notices
                </h2>
                <Link href="/announcements" style={{ fontSize: '0.85rem', color: 'var(--color-primary-600)', fontWeight: 600 }}>
                  View All →
                </Link>
              </div>

              {announcements.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {announcements.slice(0, 3).map((a: any) => (
                    <div key={a.id} className="card" style={{ padding: '1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--color-primary-800)' }}>
                          {a.title}
                        </h3>
                        {a.badgeText && (
                          <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                            {a.badgeText}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                        {a.content}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="card" style={{ padding: '2rem', textAlign: 'center' }}>
                  <p style={{ color: 'var(--text-muted)' }}>No current announcements. Check back soon for community updates.</p>
                </div>
              )}

              {/* Quick Qibla Banner */}
              <div
                className="card"
                style={{
                  marginTop: '1.5rem',
                  background: 'var(--bg-surface-alt)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1.25rem',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <Compass size={18} style={{ color: 'var(--color-primary-600)' }} /> Need to find Qibla?
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                    Use our live astronomical compass calibrated for Birmingham (~118° ESE).
                  </p>
                </div>
                <Link href="/qibla" className="btn btn-outline" style={{ fontSize: '0.85rem', padding: '0.4rem 0.85rem' }}>
                  Open Compass →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section Preview */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-surface)',
          borderTop: '1px solid var(--border-subtle)',
          borderBottom: '1px solid var(--border-subtle)',
        }}
      >
        <div className="container">
          <div style={{ maxWidth: '850px', margin: '0 auto', textAlign: 'center' }}>
            <span className="badge" style={{ marginBottom: '0.75rem' }}>
              Charity Organisation
            </span>
            <h2 style={{ fontSize: '2.25rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--color-primary-800)' }}>
              {aboutSection?.title || 'About Alfalah Community Support Centre'}
            </h2>
            <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: '2rem' }}>
              {aboutSection?.content ||
                'ALFALAH COMMUNITY SUPPORT CENTRE (مركز الفلاح الإسلامي) is established at 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU. As a registered charity (No. 1150221), our mission is to support our neighbourhood through educational opportunities, spiritual welfare, youth empowerment, and fostering peace and solidarity across Birmingham.'}
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <Link href="/about" className="btn btn-primary">
                Learn More About Our Mission <ArrowRight size={16} />
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Contact Our Team
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Activities & Community Services Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-page)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-gold" style={{ marginBottom: '0.5rem' }}>
                Services & Community Welfare
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800 }}>Community Programmes</h2>
            </div>
            <Link href="/activities" className="btn btn-outline" style={{ fontSize: '0.9rem' }}>
              Explore All Programmes →
            </Link>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '2rem',
            }}
          >
            {activities.length > 0 ? (
              activities.slice(0, 3).map((act: any) => (
                <div key={act.id} className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <span className="badge" style={{ fontSize: '0.75rem' }}>{act.category}</span>
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                    {act.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', flex: 1, marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    {act.shortDescription}
                  </p>
                  {act.scheduleInfo && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                      <strong>Schedule:</strong> {act.scheduleInfo}
                    </div>
                  )}
                  <Link
                    href={`/activities/${act.slug}`}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      fontWeight: 600,
                      color: 'var(--color-primary-600)',
                      fontSize: '0.9rem',
                    }}
                  >
                    View Details <ArrowRight size={15} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>New programmes are being scheduled. Check back shortly.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Location & Visit Us Section */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-surface-alt)',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
              alignItems: 'center',
            }}
          >
            <div>
              <span className="badge" style={{ marginBottom: '0.75rem' }}>Visit Our Centre</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem' }}>
                Location & Accessibility
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Alfalah Community Support Centre is conveniently situated in Balsall Heath, easily accessible from central Birmingham.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                  <div>
                    <strong>89 Tindal Street</strong><br />
                    Balsall Heath, Birmingham<br />
                    B12 9QU, United Kingdom
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                  <div>Charity Commission Number: <strong>1150221</strong></div>
                </div>
              </div>

              <Link href="/contact" className="btn btn-primary">
                Get Directions & Send Inquiry
              </Link>
            </div>

            {/* Clean Map Placeholder / Embed Frame */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                height: '320px',
                background: '#e2e8f0',
              }}
            >
              <iframe
                title="Alfalah Community Support Centre Location Map"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://www.openstreetmap.org/export/embed.html?bbox=-1.895%2C52.455%2C-1.885%2C52.460&amp;layer=mapnik&amp;marker=52.4578%2C-1.8904"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
