import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  MapPin,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  Clock,
  Heart,
  ExternalLink,
  Cpu,
  Palette,
  GraduationCap,
  Users,
  Compass,
  Coins,
  Video,
  Camera,
  Play,
  Coffee,
  HelpCircle,
  Target,
} from 'lucide-react';
import HeroSlider from '../../components/HeroSlider';
import PrayerTimetable from '../../components/PrayerTimetable';
import VirtualTourVideo from '../../components/VirtualTourVideo';
import { MosquePurchaseBanner } from '../../components/MosquePurchaseBanner';

const CENTRE_FACILITIES = [
  {
    title: 'Sakeena Learning Hub',
    image: '/images/real/sakeena-learning-hub.jpg',
    category: 'Madrasah & Academy',
    desc: 'Dedicated classrooms for Quran Tajweed, Hifz, and academic support.',
    link: '/activities',
  },
  {
    title: 'Youth STEM & Electronics Lab',
    image: '/images/real/youth-electronics-workbench.jpg',
    category: 'Robotics & Coding',
    desc: 'Practical workshop with soldering stations, circuit boards, and microcontrollers.',
    link: '/activities',
  },
  {
    title: 'Main Prayer Hall & Library',
    image: '/images/real/prayer-hall-library.jpg',
    category: 'Worship & Jumu’ah',
    desc: 'Five daily prayers, Friday khutbah at 13:00, and comprehensive Islamic library.',
    link: '/prayer-times',
  },
  {
    title: 'Sisters’ Secondary Hall',
    image: '/images/real/secondary-hall-sisters.jpg',
    category: 'Private Sisters Wing',
    desc: 'Dedicated sisters’ hall with private Wudu facilities and family study circles.',
    link: '/services',
  },
  {
    title: 'Community Marquee & Garden',
    image: '/images/real/marquee-garden.jpg',
    category: 'Hospitality & Events',
    desc: 'Covered outdoor garden for Eid tea gatherings, community lunches, and youth circles.',
    link: '/gallery',
  },
  {
    title: 'Private Courtyard & Safe Parking',
    image: '/images/real/parking-courtyard.jpg',
    category: 'Accessible Facilities',
    desc: 'On-site courtyard for accessible drop-offs, elderly worshippers, and volunteer projects.',
    link: '/about',
  },
];

async function getHomepageData() {
  const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
  try {
    const res = await fetch(`${apiBase}/activities`, { cache: 'no-store' });
    const activities = res.ok ? await res.json() : [];
    return { activities };
  } catch (err) {
    console.warn('Activities fetch failed during SSR, using fallback:', err);
    return { activities: [] };
  }
}

// 6 Core Mosque Pillars matching UK Mosque Standards
const CORE_SERVICES = [
  {
    id: 'prayers',
    title: 'Daily Prayers & Jumu’ah',
    icon: Clock,
    desc: '5 daily congregational prayers with live Iqamah timetable, Friday Jumu’ah Khutbah at 13:00, Ramadan Taraweeh, and spacious prayer halls for brothers & sisters.',
    link: '/prayer-times',
    linkText: 'Prayer Times',
  },
  {
    id: 'academy',
    title: 'Alfalah Academy & Madrasah',
    icon: BookOpen,
    desc: 'Quran recitation with Tajweed, Islamic studies (Aqeedah, Fiqh, Seerah), combined with our innovative Youth STEM Robotics lab and creative handmade crafts.',
    link: '/activities',
    linkText: 'Academy Lessons',
  },
  {
    id: 'welfare',
    title: 'Local Zakat & Welfare Relief',
    icon: Coins,
    desc: 'Direct distribution of Zakat al-Mal and Sadaqah to eligible local families in Birmingham. Emergency food aid, winter utility grants, and dignified community welfare.',
    link: '/donate?category=zakat',
    linkText: 'Donate Zakat',
  },
  {
    id: 'nikah',
    title: 'Nikah & Marriage Solemnisation',
    icon: Users,
    desc: 'Islamic marriage solemnisation in accordance with the Quran and Sunnah, pre-marital counselling, and authenticated Muslim marriage certificates.',
    link: '/services',
    linkText: 'Nikah Guidelines',
  },
  {
    id: 'janazah',
    title: 'Janazah & Bereavement Support',
    icon: ShieldCheck,
    desc: 'Compassionate 24/7 bereavement guidance, coordination of ritual Ghusl and Kafan, Janazah prayer, and liaison with Birmingham Muslim cemeteries.',
    link: '/services',
    linkText: 'Bereavement Guide',
  },
  {
    id: 'dawah',
    title: 'Dawah, Schools & New Muslims',
    icon: Compass,
    desc: 'Guided visits for Birmingham schools, colleges, and university groups, new Muslim mentorship, and free introductory Islamic literature in English.',
    link: '/services',
    linkText: 'Book a Visit',
  },
];

export default async function HomePage() {
  const { activities } = await getHomepageData();

  // Distinct authentic image helper for Academy activities
  const getActivityImage = (act: any) => {
    if (act.slug?.includes('tafsir') || act.title?.toLowerCase().includes('tafsir')) {
      return '/images/real/poster-tafsir-sheikh-jamal.jpg';
    }
    if (act.slug?.includes('essential-deen') || act.title?.toLowerCase().includes('deen')) {
      return '/images/real/prayer-hall-library.jpg';
    }
    if (act.slug?.includes('robot') || act.title?.toLowerCase().includes('robot')) {
      return '/images/real/youth-electronics-workbench.jpg';
    }
    if (act.slug?.includes('craft') || act.title?.toLowerCase().includes('craft')) {
      return '/images/real/sakeena-learning-hub.jpg';
    }
    if (act.slug?.includes('quran') || act.title?.toLowerCase().includes('quran')) {
      return '/images/hero-quran.jpg';
    }
    return act.imageUrl || '/images/hero-quran.jpg';
  };

  const getCategoryIcon = (category: string) => {
    const cat = category?.toLowerCase() || '';
    if (cat.includes('robot') || cat.includes('stem')) return <Cpu size={14} />;
    if (cat.includes('art') || cat.includes('craft')) return <Palette size={14} />;
    if (cat.includes('quran') || cat.includes('tajweed')) return <BookOpen size={14} />;
    if (cat.includes('scholar') || cat.includes('lecture') || cat.includes('deen')) return <GraduationCap size={14} />;
    if (cat.includes('sister') || cat.includes('family') || cat.includes('communit')) return <Users size={14} />;
    return <BookOpen size={14} />;
  };

  return (
    <div>
      {/* 1. Cinematic Full-Width Hero Slider */}
      <HeroSlider />

      {/* 2. Sleek Prayer Times Strip — Crisp & Modern Light Card */}
      <section style={{ backgroundColor: '#f8fafc', padding: '1.75rem 0', borderBottom: '1px solid var(--border-color)' }}>
        <div className="container">
          <PrayerTimetable variant="compact-strip" showTabs={false} />
        </div>
      </section>

      {/* 3. Urgent £600,000 Mosque Purchase Campaign Banner */}
      <MosquePurchaseBanner />

      {/* 4. Core Mosque Services (6 Pillars of UK Mosque Community) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }}>
            <h2 style={{ fontSize: 'clamp(2rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
              Serving the Community of Balsall Heath & Birmingham
            </h2>
            <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
              From daily prayers and youth education to marriage, bereavement support, and local welfare, Masjid Al Falah is committed to providing standard, comprehensive mosque services.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {CORE_SERVICES.map((service) => (
              <div
                key={service.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '1.75rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '12px',
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <service.icon size={22} />
                </div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: '0.92rem', color: '#64748b', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                  {service.desc}
                </p>
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
                  <Link
                    href={service.link}
                    style={{
                      fontSize: '0.88rem',
                      fontWeight: 800,
                      color: '#0369a1',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      textDecoration: 'none',
                    }}
                  >
                    {service.linkText} <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Real Centre Facilities & Interactive Video Tour Showcase (Using Real Video Walkthrough) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f1f5f9', borderTop: '1px solid #e2e8f0', borderBottom: '1px solid #e2e8f0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  color: '#0369a1',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                <Video size={16} /> Authentic Walkthrough Tour & Photos
              </div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Explore Our Centre & Facilities
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: 0 }}>
                A vibrant multi-facility grassroots centre at 89 Tindal Street, Balsall Heath — serving spiritual, educational, and community needs under one roof.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/gallery" className="btn btn-primary" style={{ fontSize: '0.88rem', fontWeight: 800, gap: '0.4rem' }}>
                <Camera size={15} /> View Full Photo Gallery
              </Link>
              <Link href="/about" className="btn btn-outline" style={{ fontSize: '0.88rem', fontWeight: 700 }}>
                About 89 Tindal St →
              </Link>
            </div>
          </div>

          {/* Interactive Virtual Video Tour Player Component */}
          <VirtualTourVideo />
        </div>
      </section>

      {/* 7. INSPIRED FROM GREEN LANE MASJID: Weekly Tafsir Series & Resident Scholars Spotlight */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#f8fafc',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Column 1: Real Poster Frame */}
            <div
              style={{
                position: 'relative',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 12px 30px -4px rgba(15, 23, 42, 0.15)',
                aspectRatio: '3/4',
                maxHeight: '480px',
                backgroundColor: '#0f172a',
              }}
            >
              <Image
                src="/images/real/poster-tafsir-sheikh-jamal.jpg"
                alt="Weekly Tafsir Series with Sheikh Jamal bin Saeed Al-Jabarti"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 768px) 100vw, 420px"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  color: '#ffffff',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  padding: '0.35rem 0.75rem',
                  borderRadius: '9999px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                Every Saturday Post-Maghrib
              </div>
            </div>

            {/* Column 2: Lecture Details & Hospitality */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#e0f2fe',
                  color: '#0369a1',
                  fontSize: '0.8rem',
                  fontWeight: 800,
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  marginBottom: '0.75rem',
                }}
              >
                <GraduationCap size={15} /> Knowledge & Spiritual Growth
              </div>

              <h2 style={{ fontSize: 'clamp(1.75rem, 3.2vw, 2.2rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                Weekly Tafsir Lesson (Surah Al-Hujurat) with Sheikh Jamal Al-Jabarti
              </h2>

              <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Join our resident scholar, Sheikh Jamal bin Saeed Al-Jabarti, every Saturday evening after Salat al-Maghrib for verse-by-verse Quranic reflection, practical rulings, and spiritual purification in the heart of Birmingham.
              </p>

              {/* Key Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Coffee size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Traditional Somali Spiced Tea (Shaah) & Dates</strong>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Complimentary warm hospitality served after every session to build community bonds.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Sisters’ Audio-Linked Secondary Hall</strong>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Dedicated private hall with live audio and screen link for sisters and families.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#e0f2fe', color: '#0369a1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0f172a' }}>Interactive Q&A Session</strong>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>Dedicated question period addressing family, youth, and practical everyday Islamic life.</div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
                <Link href="/activities#tafsir" className="btn btn-primary" style={{ fontWeight: 800, padding: '0.75rem 1.4rem' }}>
                  View Circle Schedule →
                </Link>
                <Link href="/contact" className="btn btn-outline" style={{ fontWeight: 700, padding: '0.75rem 1.25rem' }}>
                  Ask a Scholar
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Alfalah Academy & Educational Activities (Robotics, Handmade, Deen, Quran) */}
      <section style={{ padding: '4.5rem 0', backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: '2.5rem',
              flexWrap: 'wrap',
              gap: '1rem',
            }}
          >
            <div>
              <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                Alfalah Academy & Creative Lessons
              </h2>
              <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '680px', margin: 0 }}>
                Combining STEM robotics, handmade creative crafts, Quranic Tajweed, and foundational Deen studies to nurture confident, skilled young Muslims.
              </p>
            </div>

            <Link href="/activities" className="btn btn-outline" style={{ fontSize: '0.9rem', fontWeight: 700 }}>
              View All Academy Lessons →
            </Link>
          </div>

          {/* Activities Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {activities.length > 0 ? (
              activities.slice(0, 6).map((act: any) => (
                <div
                  key={act.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Activity Image Banner */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '200px',
                      backgroundColor: '#0f172a',
                    }}
                  >
                    <Image
                      src={getActivityImage(act)}
                      alt={act.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 380px"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.65) 100%)',
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        bottom: '12px',
                        left: '12px',
                        right: '12px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'rgba(15, 23, 42, 0.88)',
                          color: '#ffffff',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          backdropFilter: 'blur(6px)',
                        }}
                      >
                        {getCategoryIcon(act.category)} {act.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.5rem', color: '#0f172a' }}>
                      {act.title}
                    </h3>

                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, flex: 1, marginBottom: '1.25rem' }}>
                      {act.shortDescription}
                    </p>

                    {/* Schedule Pill */}
                    {act.scheduleInfo && (
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: '0.85rem',
                          color: '#0369a1',
                          backgroundColor: '#e0f2fe',
                          padding: '0.5rem 0.85rem',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '1.25rem',
                          fontWeight: 600,
                        }}
                      >
                        <Clock size={16} style={{ flexShrink: 0 }} />
                        <span>{act.scheduleInfo}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9' }}>
                      <span style={{ fontSize: '0.8rem', color: '#64748b', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                        <MapPin size={12} style={{ color: '#0369a1' }} /> {act.location || 'Alfalah Centre'}
                      </span>
                      <Link
                        href={`/activities/${act.slug}`}
                        style={{
                          fontSize: '0.88rem',
                          fontWeight: 800,
                          color: '#0369a1',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                        }}
                      >
                        Details & Enrol <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            ) : null}
          </div>
        </div>
      </section>

      {/* 9. INSPIRED FROM GREEN LANE MASJID: Welcoming Non-Muslim Neighbours, Schools & Reverts */}
      <section style={{ padding: '4rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="container">
          <div
            style={{
              backgroundColor: '#f8fafc',
              border: '1.5px solid #cbd5e1',
              borderRadius: '20px',
              padding: '2.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1.5rem',
              }}
            >
              <div style={{ maxWidth: '720px' }}>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    color: '#0369a1',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Compass size={15} /> Community Outreach & Welcome
                </div>
                <h3 style={{ fontSize: 'clamp(1.5rem, 2.5vw, 1.85rem)', fontWeight: 800, color: '#0f172a', margin: '0 0 0.5rem' }}>
                  Visiting Alfalah for the First Time?
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
                  We warmly open our doors to non-Muslim neighbours, local primary and secondary school visits across Birmingham, and provide dedicated one-to-one mentorship and free English Quran translations for new Muslims.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                <Link
                  href="/services#visits"
                  className="btn btn-primary"
                  style={{ fontWeight: 800, padding: '0.75rem 1.4rem' }}
                >
                  Book a School / Group Visit
                </Link>
                <Link
                  href="/contact"
                  className="btn btn-outline"
                  style={{ fontWeight: 700, padding: '0.75rem 1.4rem' }}
                >
                  Request Free Quran & Info
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Verified Location & Map Section */}
      <section
        style={{
          padding: '4.5rem 0',
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
        }}
      >
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '1rem', color: '#0f172a' }}>
                Location & Accessibility
              </h2>
              <p style={{ fontSize: '1rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Alfalah Community Support Centre is conveniently situated on Tindal Street in Balsall Heath, easily reachable from central Birmingham and Sparkbrook.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={22} style={{ color: '#0369a1', flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong style={{ fontSize: '1.05rem', color: '#0f172a' }}>89 Tindal Street</strong><br />
                    Balsall Heath, Birmingham<br />
                    B12 9QU, United Kingdom
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={22} style={{ color: '#0369a1', flexShrink: 0 }} />
                  <div style={{ color: '#0f172a' }}>Charity Commission Registration: <strong>#1150221</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <a
                  href="https://www.google.com/maps/place/Alfalah+Community+Support+Centre/@52.4555036,-1.8897627,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700 }}
                >
                  Open in Google Maps <ExternalLink size={15} />
                </a>
                <Link href="/contact" className="btn btn-outline" style={{ fontWeight: 700 }}>
                  Contact Office
                </Link>
              </div>
            </div>

            {/* Embedded Google Map (52.4555036, -1.8897627) */}
            <div
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid #cbd5e1',
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
