import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
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
  ExternalLink,
  Sparkles,
} from 'lucide-react';

async function getHomepageData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const [activitiesRes, announcementsRes, eventsRes] = await Promise.all([
      fetch(`${apiBase}/activities`, { cache: 'no-store' }),
      fetch(`${apiBase}/announcements`, { cache: 'no-store' }),
      fetch(`${apiBase}/events`, { cache: 'no-store' }),
    ]);

    const activities = activitiesRes.ok ? await activitiesRes.json() : [];
    const announcements = announcementsRes.ok ? await announcementsRes.json() : [];
    const events = eventsRes.ok ? await eventsRes.json() : [];

    return { activities, announcements, events };
  } catch (err) {
    console.warn('API fetch failed during SSR, using fallback:', err);
    return { activities: [], announcements: [], events: [] };
  }
}

export default async function HomePage() {
  const { activities, announcements, events } = await getHomepageData();

  return (
    <div>
      {/* Hero Section — Light, Luminous, with Real Mosque Interior Photo */}
      <section
        style={{
          background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
          padding: '3.5rem 1.5rem 4rem',
          position: 'relative',
          overflow: 'hidden',
          borderBottom: '1px solid var(--border-color)',
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
            {/* Left Column: Heading & Appeal Action */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.75rem',
                    borderRadius: '9999px',
                    letterSpacing: '0.04em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.3rem',
                    border: '1px solid #fca5a5',
                  }}
                >
                  🚨 URGENT APPEAL: £600,000 GOAL
                </span>
                <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                  <ShieldCheck size={14} /> Registered Charity No. 1150221
                </span>
              </div>

              <h1
                style={{
                  fontSize: 'clamp(2.3rem, 5vw, 3.4rem)',
                  fontWeight: 800,
                  lineHeight: 1.15,
                  letterSpacing: '-0.03em',
                  marginBottom: '0.5rem',
                  color: 'var(--text-primary)',
                }}
              >
                Masjid Al Falah
              </h1>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                <span style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--color-primary-700)' }}>
                  Community Support Centre
                </span>
                <span className="arabic-title" style={{ fontSize: '1.5rem', color: 'var(--color-accent-600)', fontWeight: 700 }}>
                  مسجد الفلاح — مركز الفلاح الإسلامي
                </span>
              </div>

              <p
                style={{
                  fontSize: '1.1rem',
                  color: 'var(--text-secondary)',
                  marginBottom: '2rem',
                  lineHeight: 1.6,
                  maxWidth: '580px',
                }}
              >
                A permanent home for daily worship, Quranic education, and community support in Balsall Heath, Birmingham. Join us in securing the purchase of our mosque building.
              </p>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                <Link
                  href="/donate"
                  className="btn btn-accent"
                  style={{
                    padding: '0.85rem 1.85rem',
                    fontSize: '1rem',
                    fontWeight: 800,
                    boxShadow: '0 4px 14px rgba(217, 119, 6, 0.35)',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Heart size={18} style={{ fill: 'currentColor' }} />
                  Help Purchase Our Mosque →
                </Link>

                <Link
                  href="/prayer-times"
                  className="btn btn-primary"
                  style={{
                    padding: '0.85rem 1.5rem',
                    fontSize: '1rem',
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Clock size={18} />
                  Live Prayer Times (Mawaqit)
                </Link>
              </div>

              {/* Quick Hadith Quote */}
              <div
                style={{
                  padding: '0.75rem 1rem',
                  backgroundColor: 'rgba(5, 150, 105, 0.06)',
                  borderLeft: '3px solid var(--color-primary-600)',
                  borderRadius: '0 var(--radius-md) var(--radius-md) 0',
                  fontSize: '0.85rem',
                  color: 'var(--text-secondary)',
                }}
              >
                &ldquo;Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.&rdquo; — Sahih al-Bukhari
              </div>
            </div>

            {/* Right Column: Mosque Interior Photo Card with Appeal Tiers */}
            <div
              className="card"
              style={{
                padding: '0',
                overflow: 'hidden',
                borderRadius: 'var(--radius-lg)',
                boxShadow: 'var(--shadow-xl)',
                border: '1px solid var(--border-color)',
                backgroundColor: 'var(--bg-surface)',
              }}
            >
              {/* Real Mosque Photo */}
              <div style={{ position: 'relative', width: '100%', height: '240px' }}>
                <Image
                  src="/images/masjid-interior.jpg"
                  alt="Masjid Al Falah Interior Hall, Birmingham"
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '12px',
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    backdropFilter: 'blur(4px)',
                    color: '#ffffff',
                    padding: '0.35rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                  }}
                >
                  📍 89 Tindal Street, Balsall Heath
                </div>
              </div>

              {/* Campaign Highlight Box */}
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <div>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Fundraising Target
                    </span>
                    <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#b91c1c' }}>
                      £600,000
                    </div>
                  </div>
                  <span className="badge badge-accent" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                    100% Policy (0% Fees)
                  </span>
                </div>

                {/* 3 Real Tiers from the Flyer */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '1.25rem' }}>
                  <Link
                    href="/donate"
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '0.75rem 0.5rem',
                      backgroundColor: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>🧱</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>One Brick</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary-700)', fontSize: '1.05rem' }}>£250</div>
                  </Link>

                  <Link
                    href="/donate"
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '0.75rem 0.5rem',
                      backgroundColor: 'var(--bg-surface-alt)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>🕌</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--text-primary)' }}>Half Mat</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-primary-700)', fontSize: '1.05rem' }}>£500</div>
                  </Link>

                  <Link
                    href="/donate"
                    style={{
                      textDecoration: 'none',
                      textAlign: 'center',
                      padding: '0.75rem 0.5rem',
                      backgroundColor: 'rgba(217, 119, 6, 0.08)',
                      borderRadius: 'var(--radius-md)',
                      border: '1.5px solid var(--color-accent-400)',
                    }}
                  >
                    <div style={{ fontSize: '1.25rem' }}>🕌</div>
                    <div style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--color-accent-700)' }}>Full Mat</div>
                    <div style={{ fontWeight: 800, color: 'var(--color-accent-600)', fontSize: '1.05rem' }}>£1,000</div>
                  </Link>
                </div>

                <Link
                  href="/donate"
                  className="btn btn-accent"
                  style={{ width: '100%', textAlign: 'center', fontSize: '0.9rem', fontWeight: 800 }}
                >
                  Pledge Online or View Bank Details →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Official MAWAQIT Live Mosque Prayer Widget Section */}
      <section style={{ padding: '3.5rem 0', backgroundColor: 'var(--bg-surface)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.4rem' }}>
                <span className="badge badge-primary" style={{ fontSize: '0.75rem' }}>
                  Live Mosque Display
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Powered by MAWAQIT</span>
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Daily Prayer Times & Iqamah Schedule
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Synchronised directly with the display screens inside Masjid Al Falah.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link href="/prayer-times" className="btn btn-outline" style={{ fontSize: '0.85rem' }}>
                Full Schedule Details →
              </Link>
            </div>
          </div>

          {/* Mawaqit Embedded Live Display */}
          <div
            className="card"
            style={{
              padding: '0.75rem',
              borderRadius: 'var(--radius-lg)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--shadow-lg)',
              backgroundColor: '#0f172a',
              overflow: 'hidden',
            }}
          >
            <iframe
              src="https://mawaqit.net/en/w/al-falah-community-support-centre-birmingham-b12-9qu-united-kingdom"
              title="Al Falah Community Support Centre Mawaqit Widget"
              width="100%"
              height="660"
              frameBorder="0"
              scrolling="no"
              style={{
                border: 'none',
                display: 'block',
                width: '100%',
                height: '660px',
                borderRadius: 'calc(var(--radius-lg) - 4px)',
              }}
            />
          </div>
        </div>
      </section>

      {/* Community Activities & Programmes Section */}
      <section style={{ padding: '4rem 0', backgroundColor: 'var(--bg-surface-alt)' }}>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Community Life</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Programmes & Educational Circles
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
                Dedicated classes and circles serving men, women, and youth in Balsall Heath.
              </p>
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
                <div key={act.id} className="card" style={{ display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-surface)' }}>
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
                      fontWeight: 700,
                      color: 'var(--color-primary-700)',
                      fontSize: '0.9rem',
                    }}
                  >
                    View Details <ArrowRight size={15} />
                  </Link>
                </div>
              ))
            ) : (
              <div className="card" style={{ gridColumn: '1 / -1', padding: '2rem', textAlign: 'center' }}>
                <p style={{ color: 'var(--text-muted)' }}>Programmes are ongoing. Visit our centre or check back for new schedules.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Correct Google Maps Location Section */}
      <section
        style={{
          padding: '4rem 0',
          backgroundColor: 'var(--bg-surface)',
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
              <span className="badge badge-primary" style={{ marginBottom: '0.75rem' }}>Visit Our Centre</span>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                Location & Accessibility
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Alfalah Community Support Centre is conveniently situated on Tindal Street in Balsall Heath, easily reachable from central Birmingham.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong style={{ fontSize: '1.05rem' }}>89 Tindal Street</strong><br />
                    Balsall Heath, Birmingham<br />
                    B12 9QU, United Kingdom
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                  <div>Charity Commission Number: <strong>1150221</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.google.com/maps/place/Alfalah+Community+Support+Centre/@52.4555036,-1.8897627,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  Open in Google Maps <ExternalLink size={15} />
                </a>
                <Link href="/contact" className="btn btn-outline">
                  Contact Office
                </Link>
              </div>
            </div>

            {/* Interactive Embedded Google Map for Exact Location (52.4555036, -1.8897627) */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid var(--border-color)',
                height: '360px',
                background: '#e2e8f0',
              }}
            >
              <iframe
                title="Alfalah Community Support Centre Google Map Location"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                marginHeight={0}
                marginWidth={0}
                src="https://maps.google.com/maps?q=52.4555036,-1.8897627+(Alfalah+Community+Support+Centre)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                style={{ border: 0 }}
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
