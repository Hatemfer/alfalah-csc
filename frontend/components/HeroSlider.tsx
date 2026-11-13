'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  MapPin,
  ArrowRight,
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badgeText: string;
  badgeStyle: 'red' | 'blue' | 'gold';
  title: string;
  arabicVerse: string;
  englishVerse: string;
  verseReference: string;
  description: string;
  primaryCtaText: string;
  primaryCtaLink: string;
  secondaryCtaText: string;
  secondaryCtaLink: string;
  highlightStat?: { value: string; label: string };
}

const slides: Slide[] = [
  {
    id: 1,
    image: '/images/real/prayer-hall-library.jpg',
    badgeText: 'URGENT APPEAL • £600,000 GOAL',
    badgeStyle: 'red',
    title: 'Help Us Purchase Our Mosque',
    arabicVerse: 'مَنْ بَنَى لِلَّهِ مَسْجِدًا بَنَى اللَّهُ لَهُ بَيْتًا فِي الْجَنَّةِ',
    englishVerse: '“Whoever builds a mosque for Allah, Allah will build for them a house in Paradise.”',
    verseReference: 'Hadith • Sahih Muslim',
    description:
      'Masjid Al Falah needs your urgent support to purchase the very building we pray in at 89 Tindal Street, Balsall Heath. Every brick, prayer mat, and donation protects this house of Allah for our children and generations to come.',
    primaryCtaText: 'Help Purchase Our Mosque',
    primaryCtaLink: '/donate?category=purchase',
    secondaryCtaText: 'View Bank Details',
    secondaryCtaLink: '/donate?category=purchase#bank-transfer',
    highlightStat: { value: '£600,000', label: 'Fundraising Target' },
  },
  {
    id: 2,
    image: '/images/real/prayer-congregation.jpg',
    badgeText: 'REGISTERED CHARITY NO. 1150221 • BALSALL HEATH',
    badgeStyle: 'blue',
    title: 'A Sanctuary for Daily Worship & Community',
    arabicVerse: 'وَأَقِيمُوا الصَّلَاةَ وَآتُوا الزَّكَاةَ وَارْكَعُوا مَعَ الرَّاكِعِينَ',
    englishVerse: '“And establish prayer and give Zakat and bow with those who bow.”',
    verseReference: 'Surah Al-Baqarah (2:43)',
    description:
      'Serving hundreds of worshippers across Birmingham with 5 daily prayers, weekly Jumu’ah at 13:00, spacious prayer halls, and dedicated sisters’ prayer and learning spaces.',
    primaryCtaText: 'Live Prayer Timetable',
    primaryCtaLink: '/prayer-times',
    secondaryCtaText: 'Find Us on Google Maps',
    secondaryCtaLink: '/contact',
    highlightStat: { value: '5 Daily', label: 'Congregational Prayers' },
  },
  {
    id: 3,
    image: '/images/real/mosque-exterior-main.jpg',
    badgeText: '89 TINDAL STREET • BIRMINGHAM B12 9QU',
    badgeStyle: 'blue',
    title: 'Our Permanent Community & Learning Centre',
    arabicVerse: 'إِنَّمَا يَعْمُرُ مَسَاجِدَ اللَّهِ مَنْ آمَنَ بِاللَّهِ وَالْيَوْمِ الْآخِرِ',
    englishVerse: '“The mosques of Allah are only to be maintained by those who believe in Allah and the Last Day.”',
    verseReference: 'Surah At-Tawbah (9:18)',
    description:
      'Operating from our multi-facility premises in Balsall Heath featuring our main prayer hall, library, courtyard parking, and the Sakeena Community Learning Hub.',
    primaryCtaText: 'About Our Centre',
    primaryCtaLink: '/about',
    secondaryCtaText: 'Visit the Mosque',
    secondaryCtaLink: '/contact',
    highlightStat: { value: 'Est. 2013', label: 'Serving Birmingham' },
  },
  {
    id: 4,
    image: '/images/real/youth-electronics-workbench.jpg',
    badgeText: 'YOUTH STEM ROBOTICS & QURANIC ACADEMY',
    badgeStyle: 'gold',
    title: 'Nurturing Faith, Practical Skills & Character',
    arabicVerse: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
    englishVerse: '“The best of you are those who learn the Quran and teach it.”',
    verseReference: 'Hadith • Sahih Al-Bukhari',
    description:
      'Empowering the next generation with our pioneering Youth Electronics & STEM Workshop in the Sakeena Hub, accredited Quran classes, and weekly Tafsir lessons.',
    primaryCtaText: 'Explore Academy & STEM',
    primaryCtaLink: '/activities',
    secondaryCtaText: 'Support Youth Education',
    secondaryCtaLink: '/donate?category=academy',
    highlightStat: { value: 'STEM Lab', label: 'Electronics & Robotics' },
  },
  {
    id: 5,
    image: '/images/real/eid-hospitality-tea.jpg',
    badgeText: 'COMMUNITY BONDING & HOSPITALITY',
    badgeStyle: 'blue',
    title: 'A Warm Welcome for Faith, Family & Neighbours',
    arabicVerse: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ فَأَصْلِحُوا بَيْنَ أَخَوَيْكُمْ',
    englishVerse: '“The believers are but brothers, so make settlement between your brothers.”',
    verseReference: 'Surah Al-Hujurat (49:10)',
    description:
      'From post-Jumu’ah community tea to sisters’ study circles and neighbourhood outreach, Masjid Al Falah is a welcoming home for all.',
    primaryCtaText: 'Community Services',
    primaryCtaLink: '/services',
    secondaryCtaText: 'Donate Zakat & Sadaqah',
    secondaryCtaLink: '/donate',
    highlightStat: { value: 'Direct', label: 'Local Community Aid' },
  },
];

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  // Continuous automatic background rotation every 6 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div
      className="hero-slider-wrapper"
      style={{
        position: 'relative',
        minHeight: '580px',
        backgroundColor: '#0369a1',
        color: '#ffffff',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      {/* Background Slides with Crossfade */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, overflow: 'hidden' }}>
        {slides.map((s, index) => {
          const isActive = index === currentSlide;
          return (
            <div
              key={s.id}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1)' : 'scale(1.05)',
                transition: 'opacity 1000ms cubic-bezier(0.4, 0, 0.2, 1), transform 6000ms cubic-bezier(0.1, 0, 0.2, 1)',
                pointerEvents: 'none',
              }}
            >
              <Image
                src={s.image}
                alt={s.title}
                fill
                priority={index === 0}
                sizes="100vw"
                className="hero-slide-img"
                style={{ objectFit: 'cover', objectPosition: 'center 40%' }}
              />
              {/* Desktop: subtle left-to-right light sky-blue tint */}
              <div
                className="hero-gradient-overlay"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(2, 132, 199, 0.42) 0%, rgba(14, 165, 233, 0.24) 48%, rgba(56, 189, 248, 0.1) 85%, transparent 100%)',
                }}
              />
              {/* Desktop: lighter sky-blue bottom fade to protect text */}
              <div
                className="hero-bottom-fade"
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(2, 132, 199, 0.78) 0%, rgba(2, 132, 199, 0.35) 42%, transparent 68%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Slide Content */}
      <div
        className="container hero-slide-content-container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '3.25rem',
          paddingBottom: '2rem',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          {/* Title */}
          <h1
            className="hero-slide-title"
            style={{
              fontSize: 'clamp(2.1rem, 5vw, 3.5rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              marginBottom: '0.6rem',
              color: '#ffffff',
              textShadow: '0 2px 14px rgba(0, 0, 0, 0.5)',
            }}
          >
            {slide.title}
          </h1>

          {/* Rotating Quranic Ayah / Hadith with English Translation & Reference */}
          <div
            className="hero-ayah-container"
            style={{
              margin: '0.85rem 0 1.15rem',
              padding: '0.9rem 1.25rem',
              backgroundColor: 'rgba(14, 165, 233, 0.22)',
              border: '1px solid rgba(255, 255, 255, 0.35)',
              borderLeft: '4px solid #fbbf24',
              borderRadius: '0 10px 10px 0',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              maxWidth: '740px',
            }}
          >
            <p
              className="arabic-title hero-arabic-verse"
              style={{
                fontSize: 'clamp(1.15rem, 2.3vw, 1.5rem)',
                color: '#fef08a',
                lineHeight: 1.5,
                marginBottom: '0.35rem',
                fontWeight: 600,
                direction: 'rtl',
                textAlign: 'right',
              }}
            >
              {slide.arabicVerse}
            </p>
            <p
              className="hero-english-verse"
              style={{
                fontSize: 'clamp(0.88rem, 1.6vw, 1rem)',
                color: '#ffffff',
                fontStyle: 'italic',
                lineHeight: 1.45,
                margin: '0 0 0.25rem',
              }}
            >
              {slide.englishVerse}
            </p>
            <span
              className="hero-verse-ref"
              style={{
                fontSize: '0.75rem',
                color: '#cbd5e1',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              — {slide.verseReference}
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div
            className="hero-buttons-row"
            style={{
              display: 'flex',
              gap: '0.85rem',
              flexWrap: 'wrap',
              alignItems: 'center',
              marginTop: '1.4rem',
            }}
          >
            <Link
              href={slide.primaryCtaLink}
              className="btn btn-accent hero-cta-btn"
              style={{
                fontSize: '0.98rem',
                padding: '0.8rem 1.65rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px rgba(225, 29, 72, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
              }}
            >
              <Heart size={17} fill="currentColor" style={{ flexShrink: 0 }} />
              <span className="hero-btn-text">{slide.primaryCtaText}</span>
            </Link>

            <Link
              href={slide.secondaryCtaLink}
              className="btn btn-outline hero-cta-btn"
              style={{
                fontSize: '0.95rem',
                padding: '0.8rem 1.5rem',
                fontWeight: 700,
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(8px)',
                WebkitBackdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-md)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              <span className="hero-btn-text">{slide.secondaryCtaText}</span>
              <ArrowRight size={15} style={{ flexShrink: 0 }} />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Bottom Location & Controls Bar */}
      <div
        className="hero-bottom-bar"
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(2, 132, 199, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.3)',
          padding: '1rem 1.5rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Left: Centre Info & Location Strip — hidden on mobile */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span
              className="hero-location-badge"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MapPin size={13} style={{ color: '#fbbf24', flexShrink: 0 }} /> 89 Tindal Street, Balsall Heath, Birmingham (B12 9QU)
            </span>
          </div>

          {/* Right: Slide Controls & Progress Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {/* Arrows — hidden on mobile via CSS */}
            <div className="hero-arrows" style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={17} />
              </button>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              {slides.map((s, idx) => {
                const isActive = idx === currentSlide;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentSlide(idx)}
                    aria-label={`Go to slide ${idx + 1}`}
                    style={{
                      width: isActive ? '24px' : '7px',
                      height: '7px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? '#38bdf8' : 'rgba(255, 255, 255, 0.35)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Counter — hidden on mobile via CSS */}
            <span className="hero-slide-counter" style={{ fontSize: '0.78rem', color: '#cbd5e1', fontWeight: 700 }}>
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ── DESKTOP: unchanged ── */

        /* ── MOBILE: Full-bleed image, bottom-anchored content, clean minimal controls ── */
        @media (max-width: 768px) {
          .hero-slider-wrapper {
            min-height: calc(100svh - 76px) !important;
            min-height: calc(100vh - 76px) !important;
            justify-content: flex-end !important;
          }

          /* Full-bleed gradient: top ~45% is 100% clean photo,
             sky-blue vignette anchors bottom to make text crisp */
          .hero-gradient-overlay {
            background:
              linear-gradient(
                to bottom,
                transparent 0%,
                transparent 40%,
                rgba(2, 132, 199, 0.72) 58%,
                rgba(3, 105, 161, 0.94) 100%
              ) !important;
          }

          /* Content pushed to bottom — lets the photo breathe at the top */
          .hero-slide-content-container {
            padding-top: 0 !important;
            margin-top: auto !important;
            padding-bottom: 0.25rem !important;
          }

          /* No card — text lives directly on the gradient-protected image */
          .hero-mobile-content-card {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            border-radius: 0 !important;
            padding: 0 !important;
            margin: 0 !important;
          }

          .hero-slide-title {
            font-size: 1.38rem !important;
            line-height: 1.18 !important;
            margin-bottom: 0.35rem !important;
            text-shadow: 0 2px 16px rgba(0,0,0,0.7) !important;
          }

          /* Ayah box: compact glass */
          .hero-ayah-container {
            margin: 0.3rem 0 0.5rem !important;
            padding: 0.55rem 0.8rem !important;
            background-color: rgba(2, 100, 155, 0.35) !important;
            border-left-width: 3px !important;
            max-width: 100% !important;
          }

          .hero-arabic-verse {
            font-size: 0.96rem !important;
            line-height: 1.38 !important;
            margin-bottom: 0.15rem !important;
          }

          .hero-english-verse {
            font-size: 0.76rem !important;
            line-height: 1.32 !important;
            margin-bottom: 0.1rem !important;
          }

          .hero-verse-ref {
            font-size: 0.65rem !important;
          }

          /* Buttons: side-by-side, equal width */
          .hero-buttons-row {
            margin-top: 0.5rem !important;
            gap: 0.45rem !important;
            flex-wrap: nowrap !important;
            align-items: stretch !important;
            width: 100% !important;
          }

          :global(.hero-cta-btn) {
            padding: 0.62rem 0.75rem !important;
            font-size: 0.82rem !important;
            flex: 1 1 0% !important;
            justify-content: center !important;
            text-align: center !important;
            line-height: 1.2 !important;
            min-width: 0 !important;
          }

          :global(.hero-btn-text) {
            display: inline-block !important;
            line-height: 1.2 !important;
          }

          /* Bottom bar: minimal transparent dots directly under buttons */
          .hero-bottom-bar {
            padding: 0.35rem 1rem 0.55rem !important;
            background: transparent !important;
            border-top: none !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
          }

          /* HIDE on mobile: location badge, arrows, counter */
          .hero-location-badge {
            display: none !important;
          }
          .hero-arrows {
            display: none !important;
          }
          .hero-slide-counter {
            display: none !important;
          }
        }

        @media (max-width: 380px) {
          .hero-slide-title {
            font-size: 1.22rem !important;
            margin-bottom: 0.25rem !important;
          }
          .hero-slide-content-container {
            padding-top: 0 !important;
            margin-top: auto !important;
            padding-bottom: 0.2rem !important;
          }
          .hero-ayah-container {
            padding: 0.45rem 0.65rem !important;
            margin: 0.25rem 0 0.45rem !important;
          }
          .hero-arabic-verse {
            font-size: 0.88rem !important;
            line-height: 1.3 !important;
          }
          .hero-english-verse {
            font-size: 0.72rem !important;
            line-height: 1.25 !important;
          }
          .hero-verse-ref {
            font-size: 0.62rem !important;
          }
          .hero-buttons-row {
            flex-direction: column !important;
            gap: 0.38rem !important;
          }
          :global(.hero-cta-btn) {
            width: 100% !important;
            flex: none !important;
            font-size: 0.82rem !important;
            padding: 0.58rem 0.75rem !important;
            white-space: nowrap !important;
          }
        }
      `}</style>
    </div>
  );
}
