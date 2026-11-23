import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Clock, MapPin, ArrowLeft, ShieldCheck, Mail } from 'lucide-react';

const FALLBACK_ACTIVITIES: Record<string, any> = {
  'first-aid-training': {
    title: 'Accredited First Aid & CPR Training',
    category: 'Certified Training • 100% Free',
    shortDescription: 'Free accredited emergency first aid course covering life-saving CPR, AED automated defibrillator use, recovery position, choking relief, and emergency wound care with an official certificate.',
    fullDescription: 'Masjid Al Falah & Community Support Centre is pleased to offer 100% free, accredited Emergency First Aid at Work & CPR training for local community members, volunteers, parents, and youth. Led by certified UK emergency medical trainers, this intensive course provides practical hands-on experience using CPR training mannequins and live AED defibrillator trainers. Every successful participant receives an official accredited certificate of completion.',
    scheduleInfo: 'Monthly Saturday Intensive: 10:00 AM – 3:30 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St, Balsall Heath, Birmingham, B12 9QU',
  },
  'safeguarding-training': {
    title: 'Certified Community Safeguarding Training',
    category: 'Certified Workshop • 100% Free',
    shortDescription: 'Comprehensive accredited safeguarding course ensuring safe spaces for our children and vulnerable adults. Learn indicators of harm, disclosure handling, and UK regulatory compliance with an official certificate.',
    fullDescription: 'Protecting the vulnerable is a sacred duty and a legal requirement for faith and community organisations. This comprehensive course covers safeguarding legislation, identifying signs of neglect or abuse, emotional wellbeing, online safety for youth, and clear escalation protocols. Open to all parents, community leaders, madrasah teachers, and volunteers free of charge, with an accredited certificate awarded upon completion.',
    scheduleInfo: 'Bi-Monthly Sunday Session: 1:30 PM – 4:30 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St, Balsall Heath, Birmingham, B12 9QU',
  },
  'youth-stem-lab': {
    title: 'Youth Electronics & STEM Robotics Lab',
    category: 'STEM & Robotics',
    shortDescription: 'A pioneering hands-on technical workshop where young Muslims build electronic circuits, solder components, program microcontrollers, and construct robotics in a supportive Islamic environment.',
    fullDescription: 'Our Youth STEM Lab empowers the next generation with practical skills in engineering, electronics, and coding. Students learn hands-on circuit design, solder safely, work with microcontrollers, and develop problem-solving habits grounded in Islamic teamwork (Ta’awun).',
    scheduleInfo: 'Every Saturday: 10:00 AM – 12:00 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St, Balsall Heath',
  },
  'sakeena-madrasah': {
    title: 'Sakeena Learning Hub (Quran & Tajweed Madrasah)',
    category: 'Quran & Tajweed',
    shortDescription: 'Accredited after-school Madrasah covering Noorani Qaida, precise Quranic Tajweed, Juz Amma memorisation, daily Duas, and foundational Islamic manners (Adab).',
    fullDescription: 'The Sakeena Learning Hub provides systematic Islamic education for children aged 5–16. Qualified teachers guide students through Quran reading with Tajweed, Hifz memorisation, practical Fiqh of Salah, and character development in small, focused groups.',
    scheduleInfo: 'Monday, Tuesday & Wednesday: 5:00 PM – 7:00 PM',
    location: 'Sakeena Hub Classrooms, 89 Tindal St, Balsall Heath',
  },
  'weekly-tafsir': {
    title: 'Weekly Tafsir with Sheikh Jamal Al-Jabarti',
    category: 'Scholar Lecture Series',
    shortDescription: 'An in-depth, verse-by-verse exploration of the Holy Quran, translating classical scholarship into practical reflections for contemporary daily life in Britain.',
    fullDescription: 'Join Sheikh Jamal bin Saeed Al-Jabarti every Saturday evening for an authentic journey through the Quran. Exploring classical Tafsir with insights directly applicable to modern challenges in the UK. Open to brothers and sisters with tea served.',
    scheduleInfo: 'Every Saturday: After Maghrib Prayer',
    location: 'Main Prayer Hall, 89 Tindal St, Balsall Heath',
  },
  'handmade-crafts': {
    title: 'Handmade Crafts & Creative Workshop',
    category: 'Handmade & Arts',
    shortDescription: 'Hands-on creative workshop combining traditional Islamic calligraphy, woodworking, sewing, and model making to foster patience, creative focus, and craftsmanship.',
    fullDescription: 'Students develop artisanal craft skills through woodworking, geometric art, and calligraphy, producing physical projects they take home while developing focus, discipline, and artistic appreciation.',
    scheduleInfo: 'Every Sunday: 11:00 AM – 1:00 PM',
    location: 'Creative Workshop Room, 89 Tindal St, Balsall Heath',
  },
};

async function getActivity(slug: string) {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/activities/${slug}`, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (data) return data;
    }
  } catch (err) {
    console.warn(`Could not fetch activity ${slug}:`, err);
  }
  return FALLBACK_ACTIVITIES[slug] || null;
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
          background: 'linear-gradient(180deg, #DCEEFF 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '3rem 1.5rem 2.5rem',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <Link
            href="/activities"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              color: '#3988CA',
              fontWeight: 600,
              fontSize: '0.9rem',
              marginBottom: '1rem',
            }}
          >
            <ArrowLeft size={16} /> Back to all activities
          </Link>

          <div style={{ marginBottom: '0.75rem' }}>
            <span className="badge" style={{ backgroundColor: '#3988CA', color: '#ffffff', fontWeight: 700 }}>
              {activity.category}
            </span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            {activity.title}
          </h1>

          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6 }}>
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
