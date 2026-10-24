import React from 'react';
import { QiblaCompass } from '../../../components/QiblaCompass';
import { Compass, Info, MapPin } from 'lucide-react';

export const metadata = {
  title: 'Qibla Direction Compass | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Live Qibla direction compass calibrated for Birmingham, UK. Find the direction of the Holy Kaaba with automatic orientation sensors or manual bearing indicator.',
};

export default function QiblaPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Astronomical Direction Finder
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Qibla Direction Compass
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            اتجاه القبلة نحو الكعبة المشرفة
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            Accurate bearing towards the Holy Kaaba in Mecca from Birmingham (52.4578° N, -1.8904° W).
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '750px' }}>
          {/* Compass Component */}
          <QiblaCompass />

          {/* Guidance Cards */}
          <div
            style={{
              marginTop: '2.5rem',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={18} style={{ color: 'var(--color-primary-600)' }} /> Birmingham Geodetic Data
              </h3>
              <ul style={{ listStyle: 'none', fontSize: '0.9rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                <li><strong>Centre Coordinates:</strong> 52.4578° N, 1.8904° W</li>
                <li><strong>Kaaba Coordinates:</strong> 21.4225° N, 39.8262° E</li>
                <li><strong>Qibla Bearing:</strong> ~118° (East-Southeast)</li>
                <li><strong>Great Circle Distance:</strong> Approx. 4,950 km</li>
              </ul>
            </div>

            <div className="card">
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={18} style={{ color: 'var(--color-primary-600)' }} /> Compass Accuracy Tips
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                For the most accurate reading, hold your phone flat (parallel to the ground) away from metallic surfaces, laptops, or strong magnetic fields. If the direction seems inaccurate, move your phone in a smooth figure-8 pattern to calibrate its magnetic sensor.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
