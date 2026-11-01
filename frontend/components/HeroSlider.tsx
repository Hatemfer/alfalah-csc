'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Heart,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Clock,
  MapPin,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';

interface Slide {
  id: number;
  image: string;
  badgeText: string;
  badgeStyle: 'red' | 'emerald' | 'gold';
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
    badgeStyle: 'emerald',
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
    badgeStyle: 'emerald',
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
    badgeStyle: 'emerald',
    title: 'Warmth, Brotherhood & Social Welfare',
    arabicVerse: 'إِنَّمَا الْمُؤْمِنُونَ إِخْوَةٌ',
    englishVerse: '“The believers are but brothers, so make settlement between your brothers.”',
    verseReference: 'Surah Al-Hujurat (49:10)',
    description:
      'Celebrating Eid, hosting weekly community teas, distributing Zakat relief, and bringing together diverse families across Balsall Heath and greater Birmingham.',
    primaryCtaText: 'Donate Sadaqah & Zakat',
    primaryCtaLink: '/donate?category=welfare',
    secondaryCtaText: 'Our Community Projects',
    secondaryCtaLink: '/about',
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

  // Continuous automatic background rotation every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const slide = slides[currentSlide];

  return (
    <div
      className="hero-slider-wrapper"
      style={{
        position: 'relative',
        minHeight: '620px',
        backgroundColor: '#064e3b',
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
                style={{ objectFit: 'cover', objectPosition: 'center' }}
              />
              {/* Luminous Light Green & Ocean Blue Gradient Filter (Zero Black) */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(135deg, rgba(6, 95, 70, 0.72) 0%, rgba(13, 148, 136, 0.52) 48%, rgba(2, 132, 199, 0.22) 85%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background:
                    'linear-gradient(to top, rgba(6, 78, 59, 0.65) 0%, transparent 45%)',
                }}
              />
            </div>
          );
        })}
      </div>

      {/* Main Slide Content */}
      <div
        className="container"
        style={{
          position: 'relative',
          zIndex: 10,
          paddingTop: '3.5rem',
          paddingBottom: '2.5rem',
          width: '100%',
        }}
      >
        <div style={{ maxWidth: '820px' }}>
          {/* Title */}
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 3.8rem)',
              fontWeight: 800,
              lineHeight: 1.12,
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
            style={{
              margin: '1rem 0 1.25rem',
              padding: '0.95rem 1.35rem',
              backgroundColor: 'rgba(6, 78, 59, 0.45)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderLeft: '4px solid #fbbf24',
              borderRadius: '0 10px 10px 0',
              backdropFilter: 'blur(10px)',
              maxWidth: '740px',
            }}
          >
            <p
              className="arabic-title"
              style={{
                fontSize: 'clamp(1.2rem, 2.5vw, 1.55rem)',
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
              style={{
                fontSize: 'clamp(0.92rem, 1.8vw, 1.05rem)',
                color: '#ffffff',
                fontStyle: 'italic',
                lineHeight: 1.5,
                margin: '0 0 0.25rem',
              }}
            >
              {slide.englishVerse}
            </p>
            <span
              style={{
                fontSize: '0.78rem',
                color: '#cbd5e1',
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              — {slide.verseReference}
            </span>
          </div>

          {/* Primary Action Buttons */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1.75rem' }}>
            <Link
              href={slide.primaryCtaLink}
              className="btn btn-accent"
              style={{
                fontSize: '1.05rem',
                padding: '0.85rem 1.75rem',
                fontWeight: 800,
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px rgba(225, 29, 72, 0.4)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
              }}
            >
              <Heart size={18} fill="currentColor" />
              {slide.primaryCtaText}
            </Link>

            <Link
              href={slide.secondaryCtaLink}
              className="btn btn-outline"
              style={{
                fontSize: '1rem',
                padding: '0.85rem 1.6rem',
                fontWeight: 700,
                color: '#ffffff',
                borderColor: 'rgba(255, 255, 255, 0.35)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                backdropFilter: 'blur(8px)',
              }}
            >
              {slide.secondaryCtaText}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>

      {/* Floating Bottom Quick Donation & Pledge Tier Bar */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          background: 'rgba(6, 78, 59, 0.78)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.2)',
          padding: '1.25rem 1.5rem',
        }}
      >
        <div
          className="container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1.25rem',
          }}
        >
          {/* Left: Centre Info & Location Strip */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.16)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <MapPin size={14} style={{ color: '#fbbf24' }} /> 89 Tindal Street, Balsall Heath, Birmingham (B12 9QU)
            </span>
          </div>

          {/* Right: Slide Controls & Progress Dots */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Arrows */}
            <div style={{ display: 'flex', gap: '0.35rem' }}>
              <button
                type="button"
                onClick={prevSlide}
                aria-label="Previous Slide"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronLeft size={18} />
              </button>
              <button
                type="button"
                onClick={nextSlide}
                aria-label="Next Slide"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <ChevronRight size={18} />
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
                      width: isActive ? '28px' : '8px',
                      height: '8px',
                      borderRadius: '4px',
                      backgroundColor: isActive ? 'var(--color-primary-500)' : 'rgba(255, 255, 255, 0.3)',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  />
                );
              })}
            </div>

            {/* Counter */}
            <span style={{ fontSize: '0.82rem', color: '#cbd5e1', fontWeight: 700 }}>
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
