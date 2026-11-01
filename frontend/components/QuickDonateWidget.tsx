'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Heart, ShieldCheck, ArrowRight, Building, Coins, GraduationCap, Sparkles } from 'lucide-react';

const CAUSES = [
  { id: 'purchase', label: 'Mosque Purchase Appeal', icon: Building, tag: 'Urgent (£600k)' },
  { id: 'zakat', label: 'Zakat al-Mal', icon: Coins, tag: '100% Policy' },
  { id: 'sadaqah', label: 'General Sadaqah & Welfare', icon: Heart, tag: 'Daily Care' },
  { id: 'academy', label: 'Academy & Youth STEM', icon: GraduationCap, tag: 'Education' },
];

const PRESET_AMOUNTS = [
  { amount: 25, label: '£25' },
  { amount: 50, label: '£50' },
  { amount: 100, label: '£100' },
  { amount: 250, label: '£250 (1 Brick)' },
  { amount: 500, label: '£500 (Half Mat)' },
  { amount: 1000, label: '£1,000 (Full Mat)' },
];

export default function QuickDonateWidget() {
  const router = useRouter();
  const [frequency, setFrequency] = useState<'oneoff' | 'monthly'>('oneoff');
  const [causeId, setCauseId] = useState<string>('purchase');
  const [selectedAmount, setSelectedAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');

  const currentAmount = customAmount ? parseFloat(customAmount) || 0 : selectedAmount;
  const currentCause = CAUSES.find((c) => c.id === causeId) || CAUSES[0];

  const handleDonateNow = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentAmount <= 0) return;
    const url = `/donate?amount=${currentAmount}&category=${causeId}&frequency=${frequency}`;
    router.push(url);
  };

  return (
    <div
      style={{
        backgroundColor: '#ffffff',
        border: '2px solid #10b981',
        borderRadius: 'var(--radius-lg)',
        padding: '1.75rem',
        boxShadow: '0 12px 32px -8px rgba(6, 78, 59, 0.12)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Top Banner Accent */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          borderBottom: '1px solid #f1f5f9',
          paddingBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
          <span
            style={{
              backgroundColor: '#059669',
              color: '#ffffff',
              padding: '0.2rem 0.65rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 800,
              letterSpacing: '0.5px',
            }}
          >
            QUICK DONATE
          </span>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Support Masjid Al Falah
          </h3>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem', color: '#065f46', fontWeight: 700 }}>
          <ShieldCheck size={16} style={{ color: '#059669' }} />
          UK Charity #1150221 • 100% Policy (0% Fees)
        </div>
      </div>

      <form onSubmit={handleDonateNow}>
        {/* Row 1: Frequency & Cause Selectors */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem', marginBottom: '1rem' }}>
          {/* Frequency Switcher */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Frequency
            </label>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                backgroundColor: '#f1f5f9',
                padding: '0.25rem',
                borderRadius: 'var(--radius-sm)',
                gap: '0.25rem',
              }}
            >
              <button
                type="button"
                onClick={() => setFrequency('oneoff')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '4px',
                  backgroundColor: frequency === 'oneoff' ? '#ffffff' : 'transparent',
                  color: frequency === 'oneoff' ? '#065f46' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: frequency === 'oneoff' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Single Donation
              </button>
              <button
                type="button"
                onClick={() => setFrequency('monthly')}
                style={{
                  padding: '0.5rem',
                  fontSize: '0.82rem',
                  fontWeight: 800,
                  borderRadius: '4px',
                  backgroundColor: frequency === 'monthly' ? '#ffffff' : 'transparent',
                  color: frequency === 'monthly' ? '#065f46' : '#64748b',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: frequency === 'monthly' ? '0 1px 3px rgba(0,0,0,0.06)' : 'none',
                }}
              >
                Monthly Giving
              </button>
            </div>
          </div>

          {/* Giving Cause Dropdown / Pills */}
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              Giving Cause (Intention)
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.35rem' }}>
              {CAUSES.map((c) => {
                const isSelected = causeId === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setCauseId(c.id)}
                    style={{
                      padding: '0.45rem 0.55rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      borderRadius: 'var(--radius-sm)',
                      backgroundColor: isSelected ? '#ecfdf5' : '#f8fafc',
                      color: isSelected ? '#065f46' : '#334155',
                      border: isSelected ? '1.5px solid #059669' : '1px solid #e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'left',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {c.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Row 2: Amount Selector Buttons */}
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
            Select Amount
          </label>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(90px, 1fr))',
              gap: '0.45rem',
              marginBottom: '0.55rem',
            }}
          >
            {PRESET_AMOUNTS.map((p) => {
              const isSelected = !customAmount && selectedAmount === p.amount;
              return (
                <button
                  key={p.amount}
                  type="button"
                  onClick={() => {
                    setSelectedAmount(p.amount);
                    setCustomAmount('');
                  }}
                  style={{
                    padding: '0.55rem 0.35rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? '#059669' : '#f8fafc',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    border: isSelected ? '1.5px solid #047857' : '1px solid #cbd5e1',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    textAlign: 'center',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Custom Amount Field */}
          <div style={{ position: 'relative' }}>
            <span
              style={{
                position: 'absolute',
                left: '0.85rem',
                top: '50%',
                transform: 'translateY(-50%)',
                fontWeight: 800,
                fontSize: '0.9rem',
                color: '#64748b',
              }}
            >
              £
            </span>
            <input
              type="number"
              min="1"
              placeholder="Or enter custom amount (e.g. 20, 150, 2000)..."
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              style={{
                width: '100%',
                padding: '0.55rem 0.85rem 0.55rem 2rem',
                borderRadius: 'var(--radius-sm)',
                border: customAmount ? '2px solid #059669' : '1px solid #cbd5e1',
                fontSize: '0.85rem',
                fontWeight: 600,
                outline: 'none',
                backgroundColor: '#ffffff',
              }}
            />
          </div>
        </div>

        {/* Row 3: Action Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.65rem' }}>
          <button
            type="submit"
            disabled={currentAmount <= 0}
            className="btn btn-accent"
            style={{
              padding: '0.8rem 1rem',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '0.95rem',
              cursor: currentAmount > 0 ? 'pointer' : 'not-allowed',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.45rem',
              boxShadow: '0 4px 14px rgba(225, 29, 72, 0.35)',
              transition: 'all 0.15s ease',
            }}
          >
            <Heart size={16} fill="currentColor" />
            <span>
              Donate £{currentAmount} {frequency === 'monthly' ? '/ Month' : ''} Now
            </span>
            <ArrowRight size={15} />
          </button>

          <Link
            href={`/donate?category=${causeId}&amount=${currentAmount}&tab=bank#bank-transfer`}
            style={{
              padding: '0.8rem 0.85rem',
              backgroundColor: '#ffffff',
              color: '#065f46',
              borderRadius: 'var(--radius-md)',
              border: '1.5px solid #059669',
              fontWeight: 800,
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              textDecoration: 'none',
              lineHeight: 1.2,
            }}
          >
            <Building size={15} style={{ marginRight: '0.4rem', flexShrink: 0 }} />
            Bank Transfer (0% Fees)
          </Link>
        </div>
      </form>
    </div>
  );
}
