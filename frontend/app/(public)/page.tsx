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

const DEFAULT_HOMEPAGE_ACTIVITIES = [
  {
    id: 'youth-stem-lab',
    title: 'Youth Electronics & STEM Robotics Lab',
    category: 'STEM & Robotics',
    slug: 'youth-stem-lab',
    shortDescription: 'Hands-on technical workshop where youth build electronic circuits, solder, and program robotics in a supportive Islamic environment.',
    scheduleInfo: 'Every Saturday: 10:00 AM – 12:00 PM',
    location: '89 Tindal St',
  },
  {
    id: 'first-aid-training',
    title: 'Accredited First Aid & CPR Training',
    category: 'Certified Training • Free',
    slug: 'first-aid-training',
    shortDescription: 'Accredited life-saving CPR, AED defibrillator use, and emergency wound care with an official certificate. 100% free of charge for the community.',
    scheduleInfo: 'Monthly Intensive: 10:00 AM – 3:30 PM',
    location: '89 Tindal St',
  },
  {
    id: 'safeguarding-training',
    title: 'Certified Community Safeguarding Training',
    category: 'Certified Workshop • Free',
    slug: 'safeguarding-training',
    shortDescription: 'Comprehensive accredited safeguarding course covering child protection, vulnerability awareness, and UK charity safety standards with an official certificate. 100% free.',
    scheduleInfo: 'Bi-Monthly: 1:30 PM – 4:30 PM',
    location: '89 Tindal St',
  },
  {
    id: 'sakeena-madrasah',
    title: 'Sakeena Learning Hub (Madrasah & Tajweed)',
    category: 'Quran & Tajweed',
    slug: 'sakeena-madrasah',
    shortDescription: 'Accredited after-school Madrasah covering Noorani Qaida, Quranic Tajweed, Juz Amma memorisation, and Islamic manners.',
    scheduleInfo: 'Mon, Tue & Wed: 5:00 PM – 7:00 PM',
    location: '89 Tindal St',
  },
  {
    id: 'weekly-tafsir',
    title: 'Weekly Tafsir with Sheikh Jamal Al-Jabarti',
    category: 'Scholar Lecture',
    slug: 'weekly-tafsir',
    shortDescription: 'In-depth Quranic Tafsir lecture connecting classical scholarship with practical British life. Refreshments and tea served.',
    scheduleInfo: 'Every Saturday: After Maghrib',
    location: '89 Tindal St',
  },
  {
    id: 'handmade-crafts',
    title: 'Handmade Crafts & Artisanal Workshop',
    category: 'Handmade & Arts',
    slug: 'handmade-crafts',
    shortDescription: 'Artisanal workshop combining traditional Islamic calligraphy, woodworking, sewing, and model making for youth.',
    scheduleInfo: 'Every Sunday: 11:00 AM – 1:00 PM',
    location: '89 Tindal St',
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
    link: '/services#janazah',
    linkText: 'Bereavement Guide',
    badge: 'Coming Soon Insha’Allah',
    notice: 'This service will be available in the near future, Insha’Allah.',
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
  const displayActivities = activities && activities.length >= 4 ? activities : DEFAULT_HOMEPAGE_ACTIVITIES;

  // Distinct authentic image helper for Academy activities
  const getActivityImage = (act: any) => {
    if (act.slug?.includes('first-aid') || act.title?.toLowerCase().includes('first aid')) {
      return '/images/real/first-aid-training.jpg';
    }
    if (act.slug?.includes('safeguard') || act.title?.toLowerCase().includes('safeguard')) {
      return '/images/real/safeguarding-training.jpg';
    }
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
    if (cat.includes('first aid') || cat.includes('safeguard') || cat.includes('train')) return <ShieldCheck size={14} />;
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
      <section style={{ backgroundColor: '#F7FAFE', padding: '1.75rem 0', borderBottom: '1px solid #E4EDF5' }}>
        <div className="container">
          <PrayerTimetable variant="compact-strip" showTabs={false} />
        </div>
      </section>

      {/* 3. Urgent £600,000 Mosque Purchase Campaign Banner */}
      <MosquePurchaseBanner />

      {/* 4. Core Mosque Services (6 Pillars of UK Mosque Community) */}
      <section className="home-feature-section" style={{ padding: '4.5rem 0', backgroundColor: '#F7FAFE', borderTop: '1px solid #E4EDF5', borderBottom: '1px solid #E4EDF5' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 3rem' }} className="home-section-header">
            <h2 style={{ fontSize: 'clamp(1.5rem, 3.8vw, 2.5rem)', fontWeight: 800, color: '#18334F', marginBottom: '0.75rem' }}>
              Serving the Community of Balsall Heath & Birmingham
            </h2>
            <p style={{ color: '#657B91', fontSize: '1.05rem', lineHeight: 1.6, margin: 0 }}>
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
                  padding: 'clamp(1.2rem, 2.5vw, 1.75rem)',
                  backgroundColor: '#ffffff',
                  border: '1px solid #E4EDF5',
                  borderRadius: 'var(--radius-lg)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '12px',
                      backgroundColor: '#DCEEFF',
                      color: '#245C91',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <service.icon size={22} />
                  </div>
                  {service.badge && (
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        color: '#0369A1',
                        backgroundColor: '#E0F2FE',
                        border: '1px solid #BAE6FD',
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                      }}
                    >
                      <Clock size={12} />
                      {service.badge}
                    </span>
                  )}
                </div>
                <h3 style={{ fontSize: 'clamp(1.08rem, 2.2vw, 1.25rem)', fontWeight: 800, color: '#18334F', marginBottom: '0.45rem', lineHeight: 1.3 }}>
                  {service.title}
                </h3>
                <p style={{ fontSize: 'clamp(0.85rem, 1.6vw, 0.92rem)', color: '#657B91', lineHeight: 1.55, flex: 1, marginBottom: '1.1rem' }}>
                  {service.desc}
                </p>
                {service.notice && (
                  <div
                    style={{
                      backgroundColor: '#F0F9FF',
                      border: '1px solid #BAE6FD',
                      borderRadius: '6px',
                      padding: '0.45rem 0.7rem',
                      fontSize: '0.78rem',
                      color: '#0369A1',
                      marginBottom: '0.9rem',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.4rem',
                      lineHeight: 1.4,
                    }}
                  >
                    <span style={{ fontSize: '0.82rem' }}>⏳</span>
                    <span>{service.notice}</span>
                  </div>
                )}
                <div style={{ borderTop: '1px solid #EEF4FA', paddingTop: '0.75rem' }}>
                  <Link
                    href={service.link}
                    style={{
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      color: '#3988CA',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      textDecoration: 'none',
                    }}
                  >
                    {service.linkText} <ArrowRight size={13} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Real Centre Facilities & Interactive Video Tour Showcase (Using Real Video Walkthrough) */}
      <section className="home-feature-section" style={{ padding: '4.5rem 0', backgroundColor: '#F0F7FE', borderTop: '1px solid #E4EDF5', borderBottom: '1px solid #E4EDF5' }}>
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
                  color: '#0284C7',
                  fontWeight: 700,
                  fontSize: '0.82rem',
                  textTransform: 'uppercase',
                  marginBottom: '0.35rem',
                }}
              >
                <Video size={16} /> Authentic Walkthrough Tour & Photos
              </div>
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem', letterSpacing: '-0.02em' }}>
                Explore Our Centre & Facilities
              </h2>
              <p style={{ color: '#475569', fontSize: '0.98rem', maxWidth: '680px', margin: 0, lineHeight: 1.6 }}>
                A vibrant multi-facility grassroots centre at 89 Tindal Street, Balsall Heath — serving spiritual, educational, and community needs under one roof.
              </p>
            </div>

            <div className="facilities-btn-group">
              <Link href="/gallery" className="btn btn-primary facilities-btn" style={{ fontSize: '0.84rem', fontWeight: 700, gap: '0.4rem', padding: '0.6rem 1.1rem' }}>
                <Camera size={15} /> Photo Gallery
              </Link>
              <Link href="/about" className="btn btn-outline facilities-btn" style={{ fontSize: '0.84rem', fontWeight: 700, padding: '0.6rem 1.1rem' }}>
                About 89 Tindal St →
              </Link>
            </div>
          </div>

          {/* Interactive Virtual Video Tour Player Component */}
          <VirtualTourVideo />
        </div>
      </section>

      {/* 7. INSPIRED FROM GREEN LANE MASJID: Weekly Tafsir Series & Resident Scholars Spotlight */}
      <section className="home-feature-section" style={{ padding: '4.5rem 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div
            className="home-card-inner"
            style={{
              backgroundColor: '#F7FAFE',
              borderRadius: '24px',
              border: '1px solid #E4EDF5',
              overflow: 'hidden',
              padding: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Column 1: Real Poster Frame — 100% Legible ("Lisible") Flyer */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '340px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px -4px rgba(24, 51, 79, 0.12)',
                  aspectRatio: '941/1400',
                  backgroundColor: '#F0F7FE',
                  border: '1.5px solid #E4EDF5',
                }}
              >
                <a
                  href="/images/real/poster-tafsir-sheikh-jamal.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Click to view full-size flyer"
                  style={{ display: 'block', width: '100%', height: '100%', position: 'relative' }}
                >
                  <Image
                    src="/images/real/poster-tafsir-sheikh-jamal.jpg"
                    alt="Weekly Tafsir Series with Sheikh Jamal bin Saeed Al-Jabarti"
                    fill
                    style={{ objectFit: 'contain' }}
                    sizes="(max-width: 768px) 100vw, 360px"
                  />
                </a>
                <div
                  style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    backgroundColor: '#FFFFFF',
                    color: '#245C91',
                    border: '1px solid #DCEEFF',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    boxShadow: '0 2px 6px rgba(24, 51, 79, 0.06)',
                  }}
                >
                  Every Saturday Post-Maghrib
                </div>
              </div>
            </div>

            {/* Column 2: Lecture Details & Hospitality */}
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#E0F2FE',
                  color: '#0369A1',
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

              <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2.2rem)', fontWeight: 800, color: '#0F172A', marginBottom: '0.75rem', lineHeight: 1.25 }}>
                Weekly Tafsir Lesson (Surah Al-Hujurat) with Sheikh Jamal Al-Jabarti
              </h2>

              <p style={{ color: '#475569', fontSize: '0.98rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                Join our resident scholar, Sheikh Jamal bin Saeed Al-Jabarti, every Saturday evening after Salat al-Maghrib for verse-by-verse Quranic reflection, practical rulings, and spiritual purification in the heart of Birmingham.
              </p>

              {/* Key Features */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginBottom: '1.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Coffee size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>Traditional Somali Spiced Tea (Shaah) & Dates</strong>
                    <div style={{ fontSize: '0.82rem', color: '#657B91', lineHeight: 1.45 }}>Complimentary warm hospitality served after every session to build community bonds.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Users size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>Sisters’ Audio-Linked Secondary Hall</strong>
                    <div style={{ fontSize: '0.82rem', color: '#657B91', lineHeight: 1.45 }}>Dedicated private hall with live audio and screen link for sisters and families.</div>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', backgroundColor: '#E0F2FE', color: '#0284C7', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <HelpCircle size={16} />
                  </div>
                  <div>
                    <strong style={{ fontSize: '0.92rem', color: '#0F172A' }}>Interactive Q&A Session</strong>
                    <div style={{ fontSize: '0.82rem', color: '#657B91', lineHeight: 1.45 }}>Dedicated question period addressing family, youth, and practical everyday Islamic life.</div>
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
      <section className="home-feature-section" style={{ padding: '4.5rem 0', backgroundColor: '#F7FAFE', borderTop: '1px solid #E4EDF5' }}>
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
              <h2 style={{ fontSize: 'clamp(1.4rem, 3.5vw, 2.5rem)', fontWeight: 800, color: '#18334F', marginBottom: '0.5rem' }}>
                Alfalah Academy & Creative Lessons
              </h2>
              <p style={{ color: '#657B91', fontSize: '1rem', maxWidth: '680px', margin: 0 }}>
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
            {displayActivities.slice(0, 6).map((act: any) => (
                <div
                  key={act.id}
                  className="card"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '0',
                    overflow: 'hidden',
                    backgroundColor: '#ffffff',
                    border: '1px solid #E4EDF5',
                    boxShadow: 'var(--shadow-sm)',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                >
                  {/* Activity Image Banner — Crisp, Bright & Legible */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '190px',
                      backgroundColor: '#F0F7FE',
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
                        top: '12px',
                        left: '12px',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: '#FFFFFF',
                          color: '#245C91',
                          fontWeight: 700,
                          fontSize: '0.74rem',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '9999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          border: '1px solid #DCEEFF',
                          boxShadow: '0 2px 6px rgba(24, 51, 79, 0.08)',
                        }}
                      >
                        {getCategoryIcon(act.category)} {act.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="activity-card-body" style={{ padding: 'clamp(1rem, 2.5vw, 1.35rem)', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h3 style={{ fontSize: 'clamp(1.05rem, 2.2vw, 1.2rem)', fontWeight: 800, marginBottom: '0.45rem', color: '#18334F', lineHeight: 1.3 }}>
                      {act.title}
                    </h3>

                    <p style={{ fontSize: 'clamp(0.84rem, 1.6vw, 0.9rem)', color: '#657B91', lineHeight: 1.5, flex: 1, marginBottom: '1rem' }}>
                      {act.shortDescription}
                    </p>

                    {/* Schedule Pill */}
                    {act.scheduleInfo && (
                      <div
                        className="activity-card-pill"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                          fontSize: 'clamp(0.76rem, 1.5vw, 0.82rem)',
                          color: '#245C91',
                          backgroundColor: '#DCEEFF',
                          padding: '0.4rem 0.7rem',
                          borderRadius: 'var(--radius-sm)',
                          marginBottom: '1rem',
                          fontWeight: 600,
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        <Clock size={14} style={{ flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{act.scheduleInfo}</span>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #EEF4FA', flexWrap: 'wrap' }}>
                      <span
                        style={{
                          fontSize: '0.78rem',
                          color: '#657B91',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          minWidth: 0,
                          flex: 1,
                        }}
                        title={act.location || '89 Tindal St, Balsall Heath'}
                      >
                        <MapPin size={13} style={{ color: '#3988CA', flexShrink: 0 }} />
                        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {act.location ? (act.location.includes('89 Tindal') || act.location.includes('Alfalah') ? '89 Tindal St' : act.location) : '89 Tindal St'}
                        </span>
                      </span>
                      <Link
                        href={`/activities/${act.slug}`}
                        style={{
                          fontSize: '0.82rem',
                          fontWeight: 800,
                          color: '#3988CA',
                          textDecoration: 'none',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.25rem',
                          whiteSpace: 'nowrap',
                          flexShrink: 0,
                        }}
                      >
                        Details & Enrol <ArrowRight size={13} />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* 9. INSPIRED FROM GREEN LANE MASJID: Welcoming Non-Muslim Neighbours, Schools & Reverts */}
      <section className="home-feature-section" style={{ padding: '4rem 0', backgroundColor: '#ffffff', borderTop: '1px solid #E4EDF5' }}>
        <div className="container">
          <div
            className="home-card-inner"
            style={{
              backgroundColor: '#F7FAFE',
              border: '1.5px solid #E4EDF5',
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
                    color: '#3988CA',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    marginBottom: '0.5rem',
                  }}
                >
                  <Compass size={15} /> Community Outreach & Welcome
                </div>
                <h3 style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)', fontWeight: 800, color: '#18334F', margin: '0 0 0.5rem' }}>
                  Visiting Alfalah for the First Time?
                </h3>
                <p style={{ color: '#657B91', fontSize: '0.98rem', lineHeight: 1.6, margin: 0 }}>
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
        className="home-feature-section"
        style={{
          padding: '4.5rem 0',
          backgroundColor: '#F7FAFE',
          borderTop: '1px solid #E4EDF5',
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
              <h2 style={{ fontSize: 'clamp(1.35rem, 3.5vw, 2.2rem)', fontWeight: 800, marginBottom: '0.75rem', color: '#0F172A', lineHeight: 1.25 }}>
                Location & Accessibility
              </h2>
              <p style={{ fontSize: '0.98rem', color: '#475569', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                Alfalah Community Support Centre is conveniently situated on Tindal Street in Balsall Heath, easily reachable from central Birmingham and Sparkbrook.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                  <MapPin size={22} style={{ color: '#0284C7', flexShrink: 0, marginTop: '0.2rem' }} />
                  <div>
                    <strong style={{ fontSize: '1.02rem', color: '#0F172A' }}>89 Tindal Street</strong><br />
                    <span style={{ color: '#475569' }}>Balsall Heath, Birmingham<br />
                    B12 9QU, United Kingdom</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <ShieldCheck size={22} style={{ color: '#0284C7', flexShrink: 0 }} />
                  <div style={{ color: '#0F172A', fontSize: '0.95rem' }}>Charity Commission Registration: <strong>#1150221</strong></div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
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
              className="home-map-frame"
              style={{
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-lg)',
                border: '1px solid #E4EDF5',
                height: '360px',
                background: '#E4EDF5',
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
