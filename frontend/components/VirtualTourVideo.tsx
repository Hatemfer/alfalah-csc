'use client';

import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { Play, Pause, Volume2, VolumeX, Maximize2 } from 'lucide-react';

const TOUR_SPOTS = [
  {
    title: 'Main Prayer Hall & Library',
    tag: 'Capacity 500+',
    image: '/images/real/prayer-hall-library.jpg',
    desc: 'Spacious hall for 5 daily prayers, Friday Jumu’ah, and rich Islamic research library.',
    objectPosition: 'center 60%',
  },
  {
    title: 'Sakeena Learning Hub',
    tag: 'Education & Hifz',
    image: '/images/real/sakeena-learning-hub.jpg',
    desc: 'Modern classrooms equipped for Quran recitation, Tajweed, and weekend Madrasah.',
    objectPosition: 'center 35%',
  },
  {
    title: 'Youth STEM & Electronics Lab',
    tag: 'Robotics & Tech',
    image: '/images/real/youth-electronics-workbench.jpg',
    desc: 'Practical workshop with circuit assembly, soldering irons, and hands-on coding.',
    objectPosition: 'center 35%',
  },
  {
    title: 'Garden Marquee & Courtyard',
    tag: 'Community Gathering',
    image: '/images/real/marquee-garden.jpg',
    desc: 'Welcoming outdoor garden for Eid hospitality tea, youth halaqas, and parking.',
    objectPosition: 'center 45%',
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
          backgroundColor: '#18334F',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 40px -10px rgba(24, 51, 79, 0.15)',
          border: '1.5px solid #E4EDF5',
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

          {/* Clean Cinematic Play Overlay (visible when paused) */}
          {!isPlaying && (
            <div
              onClick={togglePlay}
              className="video-play-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background:
                  'linear-gradient(to top, rgba(15, 23, 42, 0.7) 0%, rgba(15, 23, 42, 0.1) 50%, rgba(15, 23, 42, 0.25) 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                zIndex: 10,
              }}
            >
              {/* Center Play Button */}
              <div
                className="video-play-btn"
                style={{
                  width: '62px',
                  height: '62px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 28px rgba(2, 132, 199, 0.45), 0 0 0 6px rgba(255, 255, 255, 0.22)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <Play size={26} fill="currentColor" style={{ marginLeft: '3px' }} />
              </div>

              {/* Bottom Info Pill (Left) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.7rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontSize: '0.74rem',
                  fontWeight: 700,
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#38BDF8', flexShrink: 0 }} />
                <span>Centre Walkthrough Tour</span>
              </div>

              {/* Bottom Location Pill (Right) */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  padding: '0.35rem 0.65rem',
                  borderRadius: '6px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#E0F2FE',
                  fontSize: '0.72rem',
                  fontWeight: 600,
                }}
              >
                89 Tindal St
              </div>
            </div>
          )}

          {/* Bottom Custom Controls Bar (shown when playing, or tap to show) */}
          {isPlaying && (
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                padding: '0.75rem 1.25rem',
                background: 'linear-gradient(to top, rgba(12, 74, 110, 0.9) 0%, transparent 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: '#ffffff',
                zIndex: 15,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <button
                  type="button"
                  onClick={togglePlay}
                  aria-label="Pause video"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  <Pause size={16} />
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  aria-label={isMuted ? 'Unmute video' : 'Mute video'}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    width: '34px',
                    height: '34px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#ffffff',
                    cursor: 'pointer',
                  }}
                >
                  {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                </button>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <button
                  type="button"
                  onClick={handleFullscreen}
                  aria-label="Fullscreen video"
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.65rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#ffffff',
                    cursor: 'pointer',
                    fontSize: '0.76rem',
                    fontWeight: 600,
                  }}
                >
                  <Maximize2 size={14} /> Fullscreen
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Interactive Facility Cards beneath Video — Bright, Clean & Light */}
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
              backgroundColor: '#FFFFFF',
              borderRadius: '16px',
              overflow: 'hidden',
              border: '1px solid #E4EDF5',
              boxShadow: '0 2px 8px rgba(24, 51, 79, 0.04)',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
          >
            <div style={{ position: 'relative', width: '100%', height: '170px', backgroundColor: '#F0F7FE' }}>
              <Image
                src={spot.image}
                alt={spot.title}
                fill
                style={{
                  objectFit: 'cover',
                  objectPosition: spot.objectPosition || 'center center',
                }}
                sizes="300px"
              />
              <div
                style={{
                  position: 'absolute',
                  top: '10px',
                  left: '10px',
                  backgroundColor: '#FFFFFF',
                  color: '#0284C7',
                  border: '1px solid #BAE6FD',
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.7rem',
                  borderRadius: '9999px',
                  boxShadow: '0 2px 6px rgba(15, 23, 42, 0.08)',
                }}
              >
                {spot.tag}
              </div>
            </div>
            <div style={{ padding: '1.15rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
              <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: '0 0 0.35rem' }}>
                {spot.title}
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#475569', margin: 0, lineHeight: 1.55, flex: 1 }}>
                {spot.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
