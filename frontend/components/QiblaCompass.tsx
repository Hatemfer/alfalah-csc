'use client';

import React, { useState, useEffect } from 'react';
import { Compass, RotateCcw, AlertCircle, CheckCircle, Navigation } from 'lucide-react';

export function QiblaCompass() {
  const [deviceHeading, setDeviceHeading] = useState<number | null>(null);
  const [qiblaBearing, setQiblaBearing] = useState<number>(118.0);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [permissionState, setPermissionState] = useState<'prompt' | 'granted' | 'denied' | 'unsupported'>('prompt');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch official astronomical Qibla bearing for Birmingham
  useEffect(() => {
    async function loadQibla() {
      try {
        const res = await fetch('/api/v1/prayer-times/qibla');
        if (res.ok) {
          const json = await res.json();
          if (json.bearingDegrees) {
            setQiblaBearing(json.bearingDegrees);
          }
        }
      } catch (err) {
        console.warn('Using default Birmingham Qibla bearing 118°:', err);
      }
    }
    loadQibla();
  }, []);

  const requestCompassPermission = async () => {
    // iOS 13+ requires explicit permission request
    if (
      typeof window !== 'undefined' &&
      typeof (DeviceOrientationEvent as any)?.requestPermission === 'function'
    ) {
      try {
        const response = await (DeviceOrientationEvent as any).requestPermission();
        if (response === 'granted') {
          setPermissionState('granted');
          attachOrientationListener();
        } else {
          setPermissionState('denied');
          setErrorMessage('Motion & Orientation access was denied. You can still use the static compass bearing indicator below.');
        }
      } catch (e: any) {
        setPermissionState('denied');
        setErrorMessage(e?.message || 'Compass permission error.');
      }
    } else if (typeof window !== 'undefined' && 'ondeviceorientationabsolute' in window) {
      setPermissionState('granted');
      attachOrientationListener();
    } else if (typeof window !== 'undefined' && 'ondeviceorientation' in window) {
      setPermissionState('granted');
      attachOrientationListener();
    } else {
      setPermissionState('unsupported');
      setErrorMessage('Your browser or device does not provide magnetometer sensors. The compass bearing to the Kaaba from Birmingham is displayed below.');
    }
  };

  const attachOrientationListener = () => {
    const handleOrientation = (event: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;

      // WebKit (iOS Safari) provides compassHeading directly
      if ((event as any).webkitCompassHeading) {
        compassHeading = (event as any).webkitCompassHeading;
      } else if (event.alpha !== null) {
        // Standard Android / Chrome
        compassHeading = (360 - event.alpha) % 360;
      }

      if (compassHeading !== null) {
        setDeviceHeading(Math.round(compassHeading));
        setSensorActive(true);
      }
    };

    window.addEventListener('deviceorientationabsolute' as any, handleOrientation, true);
    window.addEventListener('deviceorientation', handleOrientation, true);
  };

  // Compass rotation angle
  const compassAngle = deviceHeading !== null ? -deviceHeading : 0;
  // Qibla needle rotation relative to device
  const needleAngle = deviceHeading !== null ? qiblaBearing - deviceHeading : qiblaBearing;
  const isFacingQibla = deviceHeading !== null && Math.abs((deviceHeading - qiblaBearing + 360) % 360) < 5;

  return (
    <div
      style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '2rem',
        boxShadow: 'var(--shadow-md)',
        maxWidth: '540px',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
        <Compass size={24} style={{ color: 'var(--color-primary-600)' }} />
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Qibla Direction (Al-Kaaba)</h3>
      </div>

      <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
        From Alfalah Centre (Birmingham, UK), the direct bearing to the Holy Kaaba in Mecca is{' '}
        <strong style={{ color: 'var(--color-primary-700)' }}>{qiblaBearing}°</strong> (East-Southeast).
      </p>

      {/* Compass Dial Visualizer */}
      <div
        style={{
          position: 'relative',
          width: '240px',
          height: '240px',
          margin: '0 auto 1.5rem',
          borderRadius: '50%',
          border: '4px solid var(--color-primary-700)',
          background: 'radial-gradient(circle, var(--bg-surface-alt) 60%, var(--border-color) 100%)',
          boxShadow: 'inset 0 0 15px rgba(0, 0, 0, 0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'transform 0.15s ease-out',
        }}
      >
        {/* Cardinal Points */}
        <span style={{ position: 'absolute', top: '8px', fontWeight: 800, fontSize: '0.85rem', color: '#dc2626' }}>N</span>
        <span style={{ position: 'absolute', right: '10px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>E</span>
        <span style={{ position: 'absolute', bottom: '8px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>S</span>
        <span style={{ position: 'absolute', left: '10px', fontWeight: 700, fontSize: '0.8rem', color: 'var(--text-muted)' }}>W</span>

        {/* Dynamic Qibla Pointer Needle */}
        <div
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            transform: `rotate(${needleAngle}deg)`,
            transition: 'transform 0.2s cubic-bezier(0.1, 0.9, 0.2, 1)',
            pointerEvents: 'none',
          }}
        >
          {/* Needle Arrow Head */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '50%',
              transform: 'translateX(-50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: '10px solid transparent',
                borderRight: '10px solid transparent',
                borderBottom: '20px solid var(--color-accent-500)',
              }}
            />
            <span
              style={{
                fontSize: '0.7rem',
                fontWeight: 800,
                color: 'var(--color-accent-600)',
                background: 'var(--bg-surface)',
                padding: '1px 6px',
                borderRadius: '4px',
                marginTop: '2px',
                boxShadow: 'var(--shadow-sm)',
              }}
            >
              QIBLA
            </span>
          </div>
        </div>

        {/* Centre Pivot */}
        <div
          style={{
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            backgroundColor: isFacingQibla ? 'var(--color-primary-500)' : 'var(--color-primary-800)',
            border: '2px solid #ffffff',
            boxShadow: 'var(--shadow-sm)',
            zIndex: 10,
          }}
        />
      </div>

      {/* Sensor Calibration & Status Feedback */}
      {isFacingQibla && (
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--color-primary-100)',
            color: 'var(--color-primary-800)',
            fontWeight: 700,
            fontSize: '0.9rem',
            marginBottom: '1rem',
          }}
        >
          <CheckCircle size={18} /> You are facing the Qibla!
        </div>
      )}

      {sensorActive ? (
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Current Device Heading: <strong>{deviceHeading}°</strong> | Qibla Angle: <strong>{qiblaBearing}°</strong>
          <p style={{ marginTop: '0.5rem', fontSize: '0.75rem' }}>
            Tip: Wave your device in a figure-8 motion if the compass needs magnetometer calibration.
          </p>
        </div>
      ) : (
        <div>
          <button
            type="button"
            onClick={requestCompassPermission}
            className="btn btn-primary"
            style={{ fontSize: '0.9rem', padding: '0.6rem 1.25rem' }}
          >
            <Navigation size={16} /> Enable Live Device Compass
          </button>
          {errorMessage && (
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
              {errorMessage}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
