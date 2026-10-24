import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Users, BookOpen, MapPin, Mail, ArrowRight } from 'lucide-react';

export const metadata = {
  title: 'About Us | ALFALAH COMMUNITY SUPPORT CENTRE (Birmingham)',
  description:
    'Learn about Alfalah Community Support Centre (Charity No. 1150221) in Balsall Heath, Birmingham. Our mission, values, and community support objectives.',
};

export default function AboutPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '1rem' }}>
            Charity Registration #1150221
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            About Our Centre
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.5rem', color: '#fef3c7', marginBottom: '1rem' }}>
            مركز الفلاح الإسلامي
          </p>
          <p style={{ fontSize: '1.1rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Dedicated to community welfare, educational enrichment, and spiritual support in Balsall Heath, Birmingham.
          </p>
        </div>
      </section>

      {/* Main Narrative */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="card" style={{ padding: '2.5rem', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '1rem' }}>
              Our Role & Purpose
            </h2>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              <strong>ALFALAH COMMUNITY SUPPORT CENTRE</strong> is a registered charity in England & Wales (Charity Number: 1150221), operating from 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '1.5rem' }}>
              The centre was established to fulfill essential religious, educational, and community welfare needs. We strive to provide a safe, welcoming, and inclusive space where individuals and families can participate in daily congregation prayers, Islamic studies, youth development activities, and social cohesion initiatives.
            </p>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Our vision is rooted in building strong community bonds, supporting those facing hardship, and encouraging positive social contribution across the wider Birmingham district.
            </p>
          </div>

          {/* Pillars & Values Grid */}
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.5rem', textAlign: 'center' }}>
            Our Core Pillars
          </h2>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '1.5rem',
              marginBottom: '3rem',
            }}
          >
            <div className="card">
              <div style={{ color: 'var(--color-primary-600)', marginBottom: '0.75rem' }}>
                <BookOpen size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Education & Learning</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Quranic recitation, Tajweed, foundational Islamic studies, and community enrichment circles for children, youth, and adults.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--color-primary-600)', marginBottom: '0.75rem' }}>
                <Users size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Community Cohesion</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Promoting mutual respect, welcoming neighbours of all backgrounds, and collaborating on civic initiatives that benefit Balsall Heath.
              </p>
            </div>

            <div className="card">
              <div style={{ color: 'var(--color-primary-600)', marginBottom: '0.75rem' }}>
                <Heart size={28} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.5rem' }}>Welfare & Compassion</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                Providing assistance, guidance, and practical support to elderly residents, vulnerable families, and community members in need.
              </p>
            </div>
          </div>

          {/* Verified Centre Information Callout */}
          <div
            style={{
              backgroundColor: 'var(--bg-surface-alt)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-lg)',
              padding: '2rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}
          >
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Official Centre Details</h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.95rem' }}>
              <li>
                <strong>English Name:</strong> ALFALAH COMMUNITY SUPPORT CENTRE
              </li>
              <li>
                <strong>Arabic Name:</strong> مركز الفلاح الإسلامي
              </li>
              <li>
                <strong>UK Registered Charity Number:</strong> 1150221
              </li>
              <li>
                <strong>Address:</strong> 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU, United Kingdom
              </li>
              <li>
                <strong>Official Email:</strong> <a href="mailto:alfalahcsc@hotmail.com" style={{ textDecoration: 'underline' }}>alfalahcsc@hotmail.com</a>
              </li>
            </ul>

            <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem' }}>
              <Link href="/contact" className="btn btn-primary">
                Contact the Centre <ArrowRight size={16} />
              </Link>
              <Link href="/prayer-times" className="btn btn-outline">
                View Prayer Timetable
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
