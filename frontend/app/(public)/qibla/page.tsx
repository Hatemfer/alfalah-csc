import React from 'react';
import { QiblaCompass } from '../../../components/QiblaCompass';
import { Info } from 'lucide-react';

export const metadata = {
  title: 'Qibla Direction Compass | AL FALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Live Qibla direction compass calibrated for Birmingham, UK. Find the direction of the Holy Kaaba with automatic orientation sensors or manual bearing indicator.',
};

export default function QiblaPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header - Clean, Luminous & Modern */}
      <section
        style={{
          background: 'linear-gradient(180deg, #DCEEFF 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: 'clamp(2rem, 4vw, 3rem) 1rem clamp(1.5rem, 3vw, 2.5rem)',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: 'clamp(1.5rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.6rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Qibla Direction Compass
          </h1>
          <p style={{ fontSize: 'clamp(0.92rem, 2vw, 1.05rem)', color: '#475569', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
            Accurate bearing towards the Holy Kaaba in Mecca from Birmingham (118° East-Southeast).
          </p>
        </div>
      </section>

      <section style={{ padding: 'clamp(2rem, 4vw, 3.5rem) 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          {/* Compass Component */}
          <QiblaCompass />

          {/* Clean Accuracy Note */}
          <div
            style={{
              marginTop: '1.75rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.6rem',
              color: '#64748B',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              textAlign: 'center',
              maxWidth: '540px',
              margin: '1.75rem auto 0',
              padding: '0.75rem 1.25rem',
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '12px',
            }}
          >
            <Info size={16} style={{ color: '#0284C7', flexShrink: 0 }} />
            <span>
              For the best reading, hold your phone flat away from metallic surfaces, laptops, or magnetic cases.
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
