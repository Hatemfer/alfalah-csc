'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Clock, MapPin, Sparkles } from 'lucide-react';

export default function LiveServicesList() {
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    async function loadActivities() {
      try {
        const res = await fetch('/api/v1/activities');
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setActivities(data);
          }
        }
      } catch (e) {
        // Fallback silently
      }
    }
    loadActivities();
  }, []);

  if (activities.length === 0) return null;

  return (
    <div style={{ marginTop: '3.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', color: '#3988CA', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.3rem' }}>
            <Sparkles size={14} /> Live Community Programmes
          </div>
          <h2 style={{ fontSize: 'clamp(1.25rem, 2.5vw, 1.75rem)', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Scheduled Activities & Certified Courses
          </h2>
        </div>
        <Link href="/activities" style={{ color: '#3988CA', fontWeight: 700, fontSize: '0.9rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', textDecoration: 'none' }}>
          View Full Academy & Enrolment →
        </Link>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.25rem',
        }}
      >
        {activities.map((act) => (
          <div
            key={act.id}
            style={{
              backgroundColor: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '16px',
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 2px 8px rgba(15, 23, 42, 0.04)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#0369A1',
                  backgroundColor: '#E0F2FE',
                  padding: '0.2rem 0.6rem',
                  borderRadius: '9999px',
                }}
              >
                {act.category}
              </span>
              {act.category?.includes('Certified') && (
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: '#065F46',
                    backgroundColor: '#ECFDF5',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '9999px',
                  }}
                >
                  Free & Certified
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', lineHeight: 1.3 }}>
              {act.title}
            </h3>

            <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.5, marginBottom: '1rem', flex: 1 }}>
              {act.shortDescription}
            </p>

            <div style={{ fontSize: '0.78rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.3rem', marginBottom: '1rem', backgroundColor: '#f8fafc', padding: '0.6rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Clock size={13} style={{ color: '#3988CA' }} />
                <span>{act.scheduleInfo || 'See timetable'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <MapPin size={13} style={{ color: '#3988CA' }} />
                <span>{act.location}</span>
              </div>
            </div>

            <Link
              href={`/activities#${act.slug || ''}`}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.35rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#3988CA',
                textDecoration: 'none',
                padding: '0.5rem',
                borderRadius: '8px',
                border: '1px solid #DCEEFF',
                backgroundColor: '#F0F9FF',
              }}
            >
              Enrol or Learn More <ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
