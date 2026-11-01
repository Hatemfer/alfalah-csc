'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Calculator,
  Heart,
  ShieldCheck,
  Coins,
  Copy,
  Check,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { ZakatCalculatorModal } from './ZakatCalculatorModal';

export function ZakatWelfareCallout() {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopyBank = () => {
    navigator.clipboard.writeText(
      'Masjid Al Falah Zakat Account\nBank: Al Rayan Bank\nSort Code: 30-00-83\nAccount Number: 01298401\nReference: ZAKAT-ALFALAH'
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <>
      <div
        className="zakat-callout-card"
        style={{
          background: 'linear-gradient(135deg, #064e3b 0%, #065f46 55%, #047857 100%)',
          borderRadius: '24px',
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          gap: '1.75rem',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 20px 40px -15px rgba(6, 78, 59, 0.25)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle decorative glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top Info Badges */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.15)',
              color: '#fef08a',
              fontSize: '0.8rem',
              fontWeight: 800,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid rgba(254, 240, 138, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
            }}
          >
            <Coins size={14} />
            UK Silver Nisab 2026: £485.00
          </span>

          <span
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.1)',
              color: '#d1fae5',
              fontSize: '0.8rem',
              fontWeight: 600,
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
            }}
          >
            <ShieldCheck size={14} />
            0% Admin Fee
          </span>
        </div>

        {/* Header & Primary CTAs */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1.75rem',
          }}
        >
          <div style={{ maxWidth: '620px' }}>
            <h3
              style={{
                fontSize: 'clamp(1.4rem, 2.5vw, 1.85rem)',
                fontWeight: 800,
                margin: '0 0 0.5rem',
                color: '#ffffff',
                letterSpacing: '-0.02em',
              }}
            >
              Fulfill Your Zakat Locally in Birmingham
            </h3>
            <p style={{ color: '#e2e8f0', fontSize: '0.98rem', margin: 0, lineHeight: 1.6 }}>
              Every penny of your Zakat al-Mal is distributed directly to vetted local families,
              widows, and elders facing hardship in Balsall Heath and Sparkbrook.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="zakat-callout-actions" style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* 1. Interactive Zakat Calculator Trigger */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              style={{
                backgroundColor: '#ffffff',
                color: '#065f46',
                border: 'none',
                borderRadius: '12px',
                padding: '0.8rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.15)',
                transition: 'all 0.15s ease',
              }}
            >
              <Calculator size={18} style={{ color: '#059669' }} />
              <span>Calculate Zakat</span>
            </button>

            {/* 2. Direct Donate Button */}
            <Link
              href="/donate?category=zakat"
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                borderRadius: '12px',
                padding: '0.8rem 1.35rem',
                fontSize: '0.92rem',
                fontWeight: 700,
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                transition: 'all 0.15s ease',
              }}
            >
              <Heart size={16} fill="currentColor" />
              <span>Give Zakat Online</span>
            </Link>

            {/* 3. Request Welfare */}
            <Link
              href="/services#welfare"
              style={{
                color: '#d1fae5',
                fontSize: '0.88rem',
                fontWeight: 600,
                textDecoration: 'none',
                padding: '0.6rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <span>Need Support?</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Direct Bank Details for Zakat */}
        <div
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.2)',
            borderRadius: '14px',
            padding: '0.9rem 1.25rem',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.85rem',
            fontSize: '0.86rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 700, color: '#f8fafc' }}>
              Direct Bank Transfer (Al Rayan Bank):
            </span>
            <span>
              Sort Code: <strong style={{ fontFamily: 'monospace', color: '#6ee7b7' }}>30-00-83</strong>
            </span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>
              Account: <strong style={{ fontFamily: 'monospace', color: '#6ee7b7' }}>01298401</strong>
            </span>
            <span style={{ opacity: 0.5 }}>•</span>
            <span>
              Ref: <strong style={{ color: '#fef08a' }}>ZAKAT-ALFALAH</strong>
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyBank}
            className="zakat-callout-bank-btn"
            style={{
              background: copied ? '#059669' : 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              color: '#ffffff',
              borderRadius: '8px',
              padding: '0.45rem 0.9rem',
              fontSize: '0.82rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              transition: 'all 0.15s ease',
            }}
          >
            {copied ? <Check size={14} /> : <Copy size={14} />}
            <span>{copied ? 'Copied!' : 'Copy Bank Details'}</span>
          </button>
        </div>
      </div>

      {/* Interactive Modal */}
      <ZakatCalculatorModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      <style jsx>{`
        .zakat-callout-card {
          padding: 2.5rem;
        }
        @media (max-width: 640px) {
          .zakat-callout-card {
            padding: 1.5rem 1rem !important;
            border-radius: 16px !important;
          }
          :global(.zakat-callout-actions) {
            flex-direction: column !important;
            width: 100% !important;
            align-items: stretch !important;
          }
          :global(.zakat-callout-actions) button,
          :global(.zakat-callout-actions) a {
            width: 100% !important;
            justify-content: center !important;
          }
          :global(.zakat-callout-bank-btn) {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </>
  );
}
