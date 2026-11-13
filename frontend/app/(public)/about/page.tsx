import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Users,
  MapPin,
  Mail,
  ArrowRight,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  Phone,
  Compass,
  Building,
} from 'lucide-react';

export const metadata = {
  title: 'About Us | ALFALAH COMMUNITY SUPPORT CENTRE (Birmingham)',
  description:
    'Discover the story, mission, and facilities of Alfalah Community Support Centre (Charity #1150221) at 89 Tindal Street, Balsall Heath, Birmingham. Home to the Sakeena Learning Hub, Youth STEM Lab, and 5 daily prayers.',
};

const FACILITIES = [
  {
    title: 'Main Prayer Hall & Islamic Library',
    image: '/images/real/prayer-hall-library.jpg',
    desc: 'Accommodating hundreds of worshippers for the five daily prayers and Friday Jumu’ah, surrounded by an extensive collection of Quranic Tafsir and Hadith texts.',
  },
  {
    title: 'Sakeena Community Learning Hub',
    image: '/images/real/sakeena-learning-hub.jpg',
    desc: 'Dedicated educational wing equipped with modern desks and interactive whiteboards for accredited Quranic Tajweed, Hifz, and academic support.',
  },
  {
    title: 'Youth STEM & Electronics Lab',
    image: '/images/real/youth-electronics-workbench.jpg',
    desc: 'Practical workshop with soldering stations, circuit boards, microcontrollers, and robotics kits empowering boys and girls with real technical skills.',
  },
  {
    title: 'Sisters’ Secondary Hall',
    image: '/images/real/secondary-hall-sisters.jpg',
    desc: 'Spacious, private second hall with dedicated Wudu facilities, hosting sisters’ study circles, mother & toddler groups, and weekend Madrasah.',
  },
  {
    title: 'Community Marquee & Garden',
    image: '/images/real/marquee-garden.jpg',
    desc: 'Covered outdoor garden used for Eid morning tea hospitality, youth mentoring circles, and community barbecue gatherings.',
  },
  {
    title: 'Private Courtyard & Safe Parking',
    image: '/images/real/parking-courtyard.jpg',
    desc: 'Secure on-site courtyard for accessible drop-offs, elderly worshippers, and community volunteer project days.',
  },
];

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '5rem', backgroundColor: '#f8fafc' }}>
      {/* 1. Header Banner with Clean Luminous Feel */}
      <section
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '3.5rem 1.5rem 3rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 3rem)',
              fontWeight: 800,
              marginBottom: '0.75rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            About Alfalah Community Support Centre
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#475569', lineHeight: 1.6, maxWidth: '720px', margin: '0 auto' }}>
            Rooted at 89 Tindal Street, Balsall Heath, Birmingham (Charity #1150221) — dedicated to daily worship, the pioneering Sakeena Learning Hub, Youth STEM education, and local welfare.
          </p>
        </div>
      </section>

      {/* 2. Centre Mission & Real Building Story */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '1050px' }}>
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: 'clamp(1.25rem, 4vw, 2.5rem)',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
              marginBottom: '3rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              <div>
                <h2 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
                  Our Mission & Identity
                </h2>
                <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.8, marginBottom: '1rem' }}>
                  <strong>ALFALAH COMMUNITY SUPPORT CENTRE (مركز الفلاح)</strong> was established to fulfill essential spiritual, educational, and social welfare needs in South Birmingham.
                </p>
                <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.8, marginBottom: '1rem' }}>
                  Unlike conventional prayer halls, Alfalah combines traditional Islamic scholarship with forward-looking youth empowerment. Alongside five daily prayers and Friday Jumu’ah, we operate the <strong>Sakeena Community Learning Hub</strong> and the groundbreaking <strong>Youth STEM & Robotics Lab</strong>, giving young Muslims the confidence and technical skills to excel in modern Britain.
                </p>
                <p style={{ fontSize: '1.02rem', color: '#475569', lineHeight: 1.8, margin: 0 }}>
                  We are registered with the Charity Commission for England and Wales (Charity Number: <strong>1150221</strong>) and governed with total transparency, accountability, and safeguarding oversight.
                </p>
              </div>

              {/* Real Building Exterior Photo */}
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '380px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                }}
              >
                <Image
                  src="/images/real/mosque-exterior-main.jpg"
                  alt="Alfalah Community Support Centre 89 Tindal St Birmingham"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 500px"
                />
                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    padding: '1rem 1.25rem',
                    background: 'linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.8) 100%)',
                    color: '#ffffff',
                  }}
                >
                  <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>89 Tindal Street, Balsall Heath</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.9 }}>Birmingham B12 9QU • UK Registered Charity #1150221</div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Facilities Showcase (Real Visual Grid) */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Our Centre Facilities
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#64748b', maxWidth: '640px', margin: '0 auto' }}>
              Equipped to serve worshippers, students, sisters, and families under one roof
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {FACILITIES.map((fac) => (
              <div
                key={fac.title}
                style={{
                  backgroundColor: '#ffffff',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 4px 14px rgba(15, 23, 42, 0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                <div style={{ position: 'relative', width: '100%', height: '220px', backgroundColor: '#0f172a' }}>
                  <Image
                    src={fac.image}
                    alt={fac.title}
                    fill
                    style={{ objectFit: 'cover' }}
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                </div>
                <div style={{ padding: '1.4rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                    {fac.title}
                  </h3>
                  <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.6, margin: 0, flex: 1 }}>
                    {fac.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* 5. Community Self-Reliance & Volunteers */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              padding: 'clamp(1.25rem, 4vw, 2.5rem)',
              boxShadow: '0 8px 30px rgba(15, 23, 42, 0.05)',
              marginBottom: '3rem',
            }}
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
                gap: '2rem',
                alignItems: 'center',
              }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '340px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.08)',
                }}
              >
                <Image
                  src="/images/real/volunteer-refurbishment.jpg"
                  alt="Community Volunteers Refurbishing Alfalah Centre"
                  fill
                  style={{ objectFit: 'cover' }}
                  sizes="(max-width: 768px) 100vw, 500px"
                />
              </div>

              <div>
                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
                  Built by the Community, for the Community
                </h2>
                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '1rem' }}>
                  Alfalah thrives through the dedication of grassroots volunteers. Local brothers and youth have personally painted halls, constructed classrooms, wired electronic equipment, and maintained our premises with their own hands.
                </p>
                <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.7, marginBottom: '1.5rem' }}>
                  Under the spiritual guidance of our resident scholar <strong>Sheikh Jamal bin Saeed Al-Jabarti</strong>, the centre maintains a welcoming, non-sectarian environment open to Muslims of all backgrounds and neighbours across Birmingham.
                </p>

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <Link href="/gallery" className="btn btn-primary" style={{ padding: '0.7rem 1.35rem', fontWeight: 800 }}>
                    View Community Gallery & Video Tour →
                  </Link>
                  <Link href="/donate" className="btn btn-outline" style={{ padding: '0.7rem 1.35rem', fontWeight: 700 }}>
                    Support Building Purchase
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* 6. Legal & Charity Registration Transparency */}
          <div
            style={{
              backgroundColor: '#e0f2fe',
              border: '1.5px solid #0ea5e9',
              borderRadius: '20px',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                <ShieldCheck size={18} /> Official Charity Commission Registration
              </div>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.4rem' }}>
                Regulated UK Charity #1150221
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#334155', lineHeight: 1.6, margin: 0 }}>
                Alfalah Community Support Centre operates in strict compliance with the Charities Act 2011. Every donation is audited, gift-aid verified, and directed directly towards community benefit and our £600k freehold mosque purchase.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.9rem', color: '#0f172a' }}>
              <div><strong>Registered Office:</strong> 89 Tindal St, Birmingham, B12 9QU</div>
              <div><strong>Bank:</strong> Al Rayan Bank (Sort: 30-00-83, Acc: 01298401)</div>
              <div><strong>Email:</strong> <a href="mailto:alfalahcsc@hotmail.com" style={{ textDecoration: 'underline' }}>alfalahcsc@hotmail.com</a></div>
              <div><strong>Telephone:</strong> <a href="tel:07429188880" style={{ fontWeight: 700 }}>07429 188880</a></div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
