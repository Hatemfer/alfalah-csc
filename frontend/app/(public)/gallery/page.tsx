'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Camera,
  Play,
  Heart,
  Calendar,
  Sparkles,
  MapPin,
  CheckCircle2,
  X,
  ChevronLeft,
  ChevronRight,
  Video,
} from 'lucide-react';

interface GalleryItem {
  id: string;
  title: string;
  category: 'stem' | 'worship' | 'sakeena' | 'community' | 'facilities';
  categoryLabel: string;
  image: string;
  description: string;
  aspect?: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: '1',
    title: 'Youth Electronics & Circuit Workshop',
    category: 'stem',
    categoryLabel: 'Youth & STEM Lab',
    image: '/images/real/youth-electronics-workbench.jpg',
    description: 'Hands-on practical electronics at the Sakeena Hub: students building LED circuits, sensors, and microcontrollers.',
  },
  {
    id: '2',
    title: 'Youth STEM & Robotics Teamwork',
    category: 'stem',
    categoryLabel: 'Youth & STEM Lab',
    image: '/images/real/youth-stem-workshop.jpg',
    description: 'Empowering boys and girls with modern coding logic, engineering kits, and interactive mechanical design.',
  },
  {
    id: '3',
    title: 'Practical Electronic Wiring & LEDs',
    category: 'stem',
    categoryLabel: 'Youth & STEM Lab',
    image: '/images/real/youth-circuit-led.jpg',
    description: 'Young students mastering solderless breadboards, resistors, and circuit building in our Saturday morning club.',
  },
  {
    id: '4',
    title: 'Friday Congregational Jumu’ah Service',
    category: 'worship',
    categoryLabel: 'Worship & Prayers',
    image: '/images/real/friday-khutbah-congregation.jpg',
    description: 'Worshippers listening to the Friday Khutbah delivered in English and Arabic by resident Imams at 13:00.',
  },
  {
    id: '5',
    title: 'Daily Congregational Prayer in Main Hall',
    category: 'worship',
    categoryLabel: 'Worship & Prayers',
    image: '/images/real/prayer-congregation.jpg',
    description: 'Five daily prayers in congregation uniting brothers of all ages and backgrounds across Balsall Heath.',
  },
  {
    id: '6',
    title: 'Prayer Hall & Extensive Islamic Library',
    category: 'worship',
    categoryLabel: 'Worship & Prayers',
    image: '/images/real/prayer-hall-library.jpg',
    description: 'Peaceful prayer environment with classical Arabic texts, English Quran translations, and Hadith collections.',
  },
  {
    id: '7',
    title: 'Sakeena Community Learning Hub',
    category: 'sakeena',
    categoryLabel: 'Sakeena Hub',
    image: '/images/real/sakeena-learning-hub.jpg',
    description: 'The dedicated learning space for Quran recitation, Tajweed, STEM robotics, and after-school tuition.',
  },
  {
    id: '8',
    title: 'Sakeena Learning Hub Entrance Sign',
    category: 'sakeena',
    categoryLabel: 'Sakeena Hub',
    image: '/images/real/sakeena-hub-entrance.jpg',
    description: 'Welcoming entrance to our educational wing, equipped with multimedia whiteboards and modern desks.',
  },
  {
    id: '9',
    title: 'Secondary Hall & Dedicated Sisters Space',
    category: 'facilities',
    categoryLabel: 'Facilities',
    image: '/images/real/secondary-hall-sisters.jpg',
    description: 'Spacious secondary hall dedicated to sisters’ prayers, mother & toddler groups, and weekend Tajweed classes.',
  },
  {
    id: '10',
    title: 'Centre Building Exterior (89 Tindal St)',
    category: 'facilities',
    categoryLabel: 'Facilities',
    image: '/images/real/mosque-exterior-main.jpg',
    description: 'The historic building in Balsall Heath that the community is currently fundraising £600k to permanently purchase.',
  },
  {
    id: '11',
    title: 'Private Courtyard & Safe Parking',
    category: 'facilities',
    categoryLabel: 'Facilities',
    image: '/images/real/parking-courtyard.jpg',
    description: 'Secure on-site courtyard for elderly worshipper drop-offs, school visits, and weekend community gatherings.',
  },
  {
    id: '12',
    title: 'Community Marquee & Garden Space',
    category: 'community',
    categoryLabel: 'Community Life',
    image: '/images/real/marquee-garden.jpg',
    description: 'Covered outdoor marquee used for Eid hospitality teas, community lunches, and youth mentoring circles.',
  },
  {
    id: '13',
    title: 'Eid Gathering & Hospitality Sweets',
    category: 'community',
    categoryLabel: 'Community Life',
    image: '/images/real/eid-gathering-sweets.jpg',
    description: 'Sharing Eid joy, dates, and sweets following the congregational Eid Salah with families and children.',
  },
  {
    id: '14',
    title: 'Community Tea & Brotherly Hospitality',
    category: 'community',
    categoryLabel: 'Community Life',
    image: '/images/real/eid-hospitality-tea.jpg',
    description: 'Warm Somali and Arabic spiced tea served after Saturday Tafsir lectures and community meetings.',
  },
  {
    id: '15',
    title: 'Volunteer Painting & Refurbishment Day',
    category: 'community',
    categoryLabel: 'Community Life',
    image: '/images/real/volunteer-refurbishment.jpg',
    description: 'Selfless community volunteers giving their weekends to paint, refurbish, and maintain the House of Allah.',
  },
  {
    id: '16',
    title: 'Tafsir with Sheikh Jamal Al-Jabarti Poster',
    category: 'worship',
    categoryLabel: 'Worship & Prayers',
    image: '/images/real/poster-tafsir-sheikh-jamal.jpg',
    description: 'Official announcement poster for our weekly Saturday post-Maghrib Quranic Tafsir lecture series.',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'All Photos' },
  { id: 'stem', label: 'Youth STEM & Robotics' },
  { id: 'sakeena', label: 'Sakeena Learning Hub' },
  { id: 'worship', label: 'Prayers & Worship' },
  { id: 'facilities', label: 'Mosque Facilities' },
  { id: 'community', label: 'Community & Eid' },
];

export default function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);

  const filteredItems = selectedCategory === 'all'
    ? GALLERY_ITEMS
    : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  return (
    <div style={{ paddingBottom: '5rem', backgroundColor: '#f8fafc' }}>
      {/* Header Banner */}
      <section
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '3rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 2.85rem)',
              fontWeight: 800,
              marginBottom: '0.6rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Community Life & Facilities Gallery
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            A real visual glimpse into daily life at Alfalah Community Support Centre (89 Tindal St, Birmingham): daily congregational worship, our pioneering Youth STEM Lab, Sakeena Learning Hub, and community brotherhood.
          </p>
        </div>
      </section>

      {/* Featured Video Tour Section */}
      <section style={{ padding: '2.5rem 0 1.5rem' }}>
        <div className="container" style={{ maxWidth: '1000px' }}>
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '1px solid #e2e8f0',
              overflow: 'hidden',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.06)',
            }}
          >
            <div
              style={{
                padding: '1.25rem 1.75rem',
                borderBottom: '1px solid #e2e8f0',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '0.75rem',
                backgroundColor: '#ffffff',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: '#e0f2fe',
                    color: '#0284c7',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Video size={18} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                    Video Walkthrough & Centre Atmosphere
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
                    Experience the warm, welcoming environment at 89 Tindal Street, Balsall Heath
                  </p>
                </div>
              </div>

              <span
                style={{
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#0284c7',
                  backgroundColor: '#e0f2fe',
                  padding: '0.3rem 0.75rem',
                  borderRadius: '9999px',
                }}
              >
                Official Video Tour
              </span>
            </div>

            <div style={{ position: 'relative', width: '100%', backgroundColor: '#000000', maxHeight: '540px' }}>
              <video
                controls
                playsInline
                preload="metadata"
                style={{
                  width: '100%',
                  maxHeight: '540px',
                  display: 'block',
                  margin: '0 auto',
                  objectFit: 'contain',
                }}
              >
                <source src="/videos/community-tour.mp4" type="video/mp4" />
                Your browser does not support HTML5 video streaming.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <section style={{ padding: '1.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1100px' }}>
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}
          >
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    padding: '0.5rem 1.15rem',
                    borderRadius: '9999px',
                    border: isSelected ? '1.5px solid #0284c7' : '1.5px solid #e2e8f0',
                    backgroundColor: isSelected ? '#0284c7' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#475569',
                    fontSize: '0.88rem',
                    fontWeight: isSelected ? 800 : 600,
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.25)' : 'none',
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Photo Gallery Grid */}
      <section style={{ padding: '1rem 0 3.5rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: '1.25rem',
            }}
          >
            {filteredItems.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveItem(item)}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 12px rgba(15, 23, 42, 0.04)',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  display: 'flex',
                  flexDirection: 'column',
                }}
                className="gallery-card"
              >
                {/* Photo Image Frame */}
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#0f172a',
                  }}
                >
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 380px"
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '10px',
                      left: '10px',
                      backgroundColor: 'rgba(15, 23, 42, 0.75)',
                      color: '#ffffff',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '0.25rem 0.65rem',
                      borderRadius: '9999px',
                      backdropFilter: 'blur(4px)',
                    }}
                  >
                    {item.categoryLabel}
                  </div>
                </div>

                {/* Caption */}
                <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {item.title}
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5, margin: 0, flex: 1 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom Callout: Visit in Person */}
          <div
            style={{
              marginTop: '3.5rem',
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              border: '2px solid #0284c7',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Visit Alfalah Community Support Centre in Person
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Our doors are open every day for the five daily prayers, educational classes at Sakeena Hub, and community advice. Located at 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU.
              </p>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link href="/contact" className="btn btn-primary" style={{ padding: '0.75rem 1.4rem', fontWeight: 800 }}>
                Contact & Directions →
              </Link>
              <Link href="/activities" className="btn btn-outline" style={{ padding: '0.75rem 1.4rem', fontWeight: 700 }}>
                Explore STEM & Classes
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Lightbox Modal */}
      {activeItem && (
        <div
          onClick={() => setActiveItem(null)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 1000,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1.5rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '20px',
              maxWidth: '820px',
              width: '100%',
              overflow: 'hidden',
              boxShadow: '0 25px 50px rgba(0, 0, 0, 0.35)',
              position: 'relative',
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveItem(null)}
              aria-label="Close photo preview"
              style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                zIndex: 10,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 0, 0, 0.65)',
                color: '#ffffff',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              <X size={18} />
            </button>

            {/* Modal Image */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '460px',
                backgroundColor: '#0f172a',
              }}
            >
              <Image
                src={activeItem.image}
                alt={activeItem.title}
                fill
                style={{ objectFit: 'contain' }}
                sizes="(max-width: 820px) 100vw, 820px"
              />
            </div>

            {/* Modal Caption */}
            <div style={{ padding: '1.5rem' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
                {activeItem.categoryLabel}
              </div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                {activeItem.title}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                {activeItem.description}
              </p>
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        .gallery-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1) !important;
        }
      `}</style>
    </div>
  );
}
