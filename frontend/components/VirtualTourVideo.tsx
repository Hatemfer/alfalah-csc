'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Pause, Volume2, VolumeX, Maximize2, Camera, ShieldCheck, Sparkles, ArrowRight } from 'lucide-react';

const TOUR_SPOTS = [
  {
    title: 'Main Prayer Hall & Library',
    tag: 'Capacity 500+',
    image: '/images/real/prayer-hall-library.jpg',
    desc: 'Spacious hall for 5 daily prayers, Friday Jumu’ah, and rich Islamic research library.',
  },
  {
    title: 'Sakeena Learning Hub',
    tag: 'Education & Hifz',
    image: '/images/real/sakeena-learning-hub.jpg',
    desc: 'Modern classrooms equipped for Quran recitation, Tajweed, and weekend Madrasah.',
  },
  {
    title: 'Youth STEM & Electronics Lab',
    tag: 'Robotics & Tech',
    image: '/images/real/youth-electronics-workbench.jpg',
    desc: 'Practical workshop with circuit assembly, soldering irons, and hands-on coding.',
  },
  {
    title: 'Garden Marquee & Courtyard',
    tag: 'Community Gathering',
    image: '/images/real/marquee-garden.jpg',
    desc: 'Welcoming outdoor garden for Eid hospitality tea, youth halaqas, and parking.',
  },
];

export default function VirtualTourVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
      {/* Video Frame */}
      <div
        style={{
          position: 'relative',
          backgroundColor: '#0f172a',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(15, 23, 42, 0.25)',
          border: '1px solid #334155',
        }}
      >
        <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', maxHeight: '560px' }}>
          <video
            ref={videoRef}
            src="/videos/community-tour.mp4"
            poster="/images/real/mosque-exterior-main.jpg"
            playsInline
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />

          {/* Big Center Play Overlay (when paused) */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(15, 23, 42, 0.45)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '1rem',
                cursor: 'pointer',
                backdropFilter: 'blur(3px)',
                transition: 'background-color 0.2s ease',
              }}
            >
              <div
                style={{
                  width: '74px',
                  height: '74px',
                  borderRadius: '50%',
                  backgroundColor: '#064e3b',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 0 10px rgba(6, 78, 59, 0.35)',
                  transform: 'scale(1)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <Play size={32} fill="currentColor" style={{ marginLeft: '4px' }} />
              </div>
              <div style={{ textAlign: 'center', color: '#ffffff' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>Play Centre Walkthrough Tour</div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>89 Tindal Street • Balsall Heath, Birmingham</div>
              </div>
            </div>
          )}

          {/* Bottom Custom Controls Bar */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '1rem 1.5rem',
              background: 'linear-gradient(to top, rgba(15, 23, 42, 0.85) 0%, transparent 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              color: '#ffffff',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                {isPlaying ? <Pause size={17} /> : <Play size={17} fill="currentColor" style={{ marginLeft: '2px' }} />}
              </button>

              <button
                type="button"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
              </button>

              <span style={{ fontSize: '0.82rem', fontWeight: 600, color: '#e2e8f0' }}>
                Walkthrough Video Reel
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="Fullscreen video"
                style={{
                  background: 'rgba(255, 255, 255, 0.15)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: '8px',
                  padding: '0.4rem 0.6rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#ffffff',
                  cursor: 'pointer',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                }}
              >
                <Maximize2 size={15} /> Fullscreen
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 4 Interactive Facility Cards beneath Video */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem',
        }}
      >
        {TOUR_SPOTS.map((spot) => (
          <div
            key={spot.title}
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #e2e8f0',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '160px', backgroundColor: '#0f172a' }}>
              <Image src={spot.image} alt={spot.title} fill style={{ objectFit: 'cover' }} sizes="300px" />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(15, 23, 42, 0.88)',
                  color: '#ffffff',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  backdropFilter: 'blur(6px)',
                }}
              >
                {spot.tag}
              </div>
            </div>
            <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                {spot.title}
              </h4>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: 1.5, flex: 1 }}>
                {spot.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
