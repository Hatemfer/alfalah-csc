'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import {
  Heart,
  ShieldCheck,
  Check,
  Copy,
  Building,
  Coins,
  GraduationCap,
  ExternalLink,
  Phone,
  Mail,
  HelpCircle,
  Calculator,
  QrCode,
  Smartphone,
  CheckCheck,
} from 'lucide-react';
import { ZakatCalculatorModal } from '../../../components/ZakatCalculatorModal';

// Fund Causes (Islamic Intention Selection)
const FUND_CATEGORIES = [
  {
    id: 'purchase',
    label: 'Mosque Purchase Appeal',
    sublabel: 'Sadaqah Jariyah • 89 Tindal St',
    icon: Building,
    desc: 'Mosque Purchase Appeal',
    reference: 'MOSQUE',
  },
  {
    id: 'zakat',
    label: 'Zakat al-Mal',
    sublabel: 'Direct to Eligible Families',
    icon: Coins,
    desc: 'Zakat al-Mal',
    reference: 'ZAKAT',
  },
  {
    id: 'sadaqah',
    label: 'General Sadaqah',
    sublabel: 'Mosque Running & Maintenance',
    icon: Heart,
    desc: 'General Sadaqah',
    reference: 'SADAQAH',
  },
  {
    id: 'academy',
    label: 'Youth & Madrasah',
    sublabel: 'Classes & Youth STEM Lab',
    icon: GraduationCap,
    desc: 'Academy & Youth Education',
    reference: 'MADRASAH',
  },
];

// Preset Amounts for One-Off vs. Monthly Giving (UK Mosque Standard)
const ONE_OFF_PRESETS = [
  { amount: 10, label: '£10' },
  { amount: 25, label: '£25' },
  { amount: 50, label: '£50' },
  { amount: 100, label: '£100' },
  { amount: 250, label: '£250' },
  { amount: 500, label: '£500' },
];

const MONTHLY_PRESETS = [
  { amount: 10, label: '£10/mo' },
  { amount: 25, label: '£25/mo' },
  { amount: 50, label: '£50/mo' },
  { amount: 100, label: '£100/mo' },
  { amount: 250, label: '£250/mo' },
  { amount: 500, label: '£500/mo' },
];

const MYDONA_URL = 'https://donate.mydona.com/al-falah-csc';

function DonateContent() {
  const searchParams = useSearchParams();

  // Read URL query parameters
  const initialAmount = searchParams.get('amount');
  const initialCategory = searchParams.get('category') || searchParams.get('fund');
  const initialFrequency = searchParams.get('frequency');
  const initialTab = searchParams.get('tab');

  // Core Form State - Defaulting to Bank Transfer as requested
  const [frequency, setFrequency] = useState<'oneoff' | 'monthly'>('oneoff');
  const [fundId, setFundId] = useState<string>('purchase');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'bank' | 'mydona'>('bank');

  // UI & Feedback States
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [zakatModalOpen, setZakatModalOpen] = useState(false);

  // Sync with URL parameters on mount
  useEffect(() => {
    if (initialFrequency === 'monthly') setFrequency('monthly');
    else if (initialFrequency === 'oneoff') setFrequency('oneoff');

    if (initialCategory) {
      const match = FUND_CATEGORIES.find(
        (f) => f.id.toLowerCase() === initialCategory.toLowerCase()
      );
      if (match) setFundId(match.id);
    }

    if (initialAmount) {
      const parsed = parseFloat(initialAmount);
      if (!isNaN(parsed) && parsed > 0) {
        const presets = initialFrequency === 'monthly' ? MONTHLY_PRESETS : ONE_OFF_PRESETS;
        const matchingPreset = presets.find((p) => p.amount === parsed);
        if (matchingPreset) {
          setAmount(parsed);
          setCustomAmount('');
        } else {
          setAmount(0);
          setCustomAmount(parsed.toString());
        }
      }
    }

    if (initialTab === 'mydona') {
      setPaymentMethod('mydona');
    }
  }, [initialAmount, initialCategory, initialFrequency, initialTab]);

  const currentFund = useMemo(
    () => FUND_CATEGORIES.find((f) => f.id === fundId) || FUND_CATEGORIES[0],
    [fundId]
  );

  const selectedAmount = useMemo(() => {
    if (customAmount) {
      const parsed = parseFloat(customAmount);
      return !isNaN(parsed) && parsed > 0 ? parsed : 0;
    }
    return amount;
  }, [customAmount, amount]);

  const paymentReference = useMemo(() => {
    return frequency === 'monthly' ? `SO-${currentFund.reference}` : currentFund.reference;
  }, [frequency, currentFund]);

  // Copy Bank / Link Details
  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCopyAll = () => {
    const fullDetails = `ALFALAH COMMUNITY SUPPORT CENTRE — Official Bank Donation Details
Bank: Al Rayan Bank
Sort Code: 30-00-83
Account Number: 01298401
Account Name: ALFALAH COMMUNITY SUPPORT CENTRE
Payment Reference: ${paymentReference}
Cause: ${currentFund.label}${frequency === 'monthly' ? ' (Monthly Standing Order)' : ''}
UK Registered Charity #1150221`;

    navigator.clipboard.writeText(fullDetails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Dignified Institutional Header (Light, Clean, Welcoming) */}
      <section
        className="no-print"
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '2.5rem 1.5rem 2rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '860px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: '#e0f2fe',
              color: '#0369a1',
              border: '1px solid #bae6fd',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <ShieldCheck size={15} color="#0284c7" />
            <span>UK Registered Charity #1150221 • 100% Secure Donations</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Donate to Masjid Al Falah
          </h1>

          <p
            style={{
              fontSize: '1rem',
              color: '#475569',
              lineHeight: 1.6,
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            Support our community appeal to secure our permanent mosque building at 89 Tindal Street,
            or contribute your Zakat al-Mal and general Sadaqah with 0% administrative fees.
          </p>
        </div>
      </section>

      {/* 2. Main Donation Container (Spacious 860px PC Width) */}
      <div className="container" style={{ maxWidth: '860px', marginTop: '2rem' }}>
        <div
          className="card donate-card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(15, 23, 42, 0.07)',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* 1. FREQUENCY SEGMENTED PILL */}
          <div style={{ maxWidth: '460px', margin: '0 auto 1.75rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.35rem',
                backgroundColor: '#f1f5f9',
                padding: '0.35rem',
                borderRadius: '14px',
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setFrequency('oneoff');
                  if (customAmount === '') setAmount(50);
                }}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '11px',
                  backgroundColor: frequency === 'oneoff' ? '#ffffff' : 'transparent',
                  color: frequency === 'oneoff' ? '#0284c7' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  boxShadow: frequency === 'oneoff' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Single Donation
              </button>

              <button
                type="button"
                onClick={() => {
                  setFrequency('monthly');
                  if (customAmount === '') setAmount(25);
                }}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '11px',
                  backgroundColor: frequency === 'monthly' ? '#ffffff' : 'transparent',
                  color: frequency === 'monthly' ? '#0284c7' : '#64748b',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  boxShadow: frequency === 'monthly' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                Monthly Standing Order
              </button>
            </div>
          </div>

          {/* 2. AMOUNT SELECTION */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ marginBottom: '0.65rem' }}>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                1. Select Amount {frequency === 'monthly' ? '(Monthly)' : ''}
              </label>
            </div>

            {/* Preset Amount Grid */}
            <div className="donate-amount-grid" style={{ marginBottom: '0.75rem' }}>
              {(frequency === 'monthly' ? MONTHLY_PRESETS : ONE_OFF_PRESETS).map((opt) => {
                const isSelected = !customAmount && amount === opt.amount;
                return (
                  <button
                    key={opt.amount}
                    type="button"
                    onClick={() => {
                      setAmount(opt.amount);
                      setCustomAmount('');
                    }}
                    style={{
                      position: 'relative',
                      padding: '0.85rem 0.4rem',
                      borderRadius: '12px',
                      backgroundColor: isSelected ? '#e0f2fe' : '#ffffff',
                      color: isSelected ? '#0284c7' : '#0f172a',
                      border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      cursor: 'pointer',
                      textAlign: 'center',
                      fontWeight: 800,
                      fontSize: '1.15rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.15)' : 'none',
                    }}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Amount Input */}
            <div style={{ position: 'relative' }}>
              <span
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontWeight: 800,
                  fontSize: '1.05rem',
                  color: customAmount ? '#0284c7' : '#64748b',
                }}
              >
                £
              </span>
              <input
                type="number"
                min="1"
                placeholder="Other amount (e.g. 35, 150, 1000)..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.75rem 1rem 0.75rem 2.25rem',
                  borderRadius: '12px',
                  border: customAmount ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                  fontSize: '0.95rem',
                  fontWeight: 600,
                  outline: 'none',
                  backgroundColor: '#ffffff',
                  transition: 'border-color 0.15s ease',
                }}
              />
            </div>
          </div>

          {/* 3. SELECT FUND (GIVING CAUSE) */}
          <div style={{ marginBottom: '1.75rem' }}>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>
              2. Giving Cause (Appeal)
            </label>
            <div className="donate-cause-grid">
              {FUND_CATEGORIES.map((fund) => {
                const Icon = fund.icon;
                const isSelected = fundId === fund.id;
                return (
                  <button
                    key={fund.id}
                    type="button"
                    onClick={() => setFundId(fund.id)}
                    style={{
                      padding: '0.95rem 1.15rem',
                      borderRadius: '14px',
                      border: isSelected ? '2px solid #0284c7' : '1.5px solid #e2e8f0',
                      backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                      color: isSelected ? '#0369a1' : '#1e293b',
                      cursor: 'pointer',
                      textAlign: 'left',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.85rem',
                      transition: 'all 0.15s ease',
                      boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.12)' : 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '10px',
                          backgroundColor: isSelected ? '#0284c7' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : '#64748b',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Icon size={18} />
                      </div>

                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#0369a1' : '#0f172a', lineHeight: 1.3 }}>
                          {fund.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isSelected ? '#0284c7' : '#64748b', fontWeight: 500, marginTop: '0.15rem', lineHeight: 1.25 }}>
                          {fund.sublabel}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #0284c7' : '2px solid #cbd5e1',
                        backgroundColor: isSelected ? '#0284c7' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {isSelected && <Check size={12} color="#ffffff" strokeWidth={3} />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Zakat al-Mal Helper Banner */}
            {fundId === 'zakat' && (
              <div
                style={{
                  marginTop: '0.85rem',
                  backgroundColor: '#e0f2fe',
                  border: '1px solid #bae6fd',
                  borderRadius: '12px',
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Calculator size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0369a1' }}>
                      Need help calculating your Zakat?
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#0284c7', marginTop: '0.1rem' }}>
                      Based on UK Silver Nisab: £485.00
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setZakatModalOpen(true)}
                  style={{
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '0.45rem 0.95rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                  }}
                >
                  Open Calculator
                </button>
              </div>
            )}
          </div>

          {/* 4. PAYMENT METHOD SELECTOR (ONLY BANK TRANSFER & MYDONA QR) */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
              3. Select Payment Method
            </label>

            {/* Two-option payment method switcher: 1st Bank Transfer, 2nd MyDona QR */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {/* Option 1: Bank Transfer (First option as requested) */}
              <button
                id="pay-method-bank"
                type="button"
                onClick={() => setPaymentMethod('bank')}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'bank' ? '2.5px solid #0284c7' : '1.5px solid #e2e8f0',
                  backgroundColor: paymentMethod === 'bank' ? '#e0f2fe' : '#ffffff',
                  color: paymentMethod === 'bank' ? '#0369a1' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: paymentMethod === 'bank' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'bank' ? '#0284c7' : '#f1f5f9',
                    color: paymentMethod === 'bank' ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Building size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: paymentMethod === 'bank' ? '#0369a1' : '#0f172a' }}>
                    Bank Transfer (0% Fee)
                  </div>
                  <div style={{ fontSize: '0.75rem', color: paymentMethod === 'bank' ? '#0284c7' : '#64748b', fontWeight: 600, marginTop: '0.1rem' }}>
                    Al Rayan Bank • Direct UK Transfer
                  </div>
                </div>
              </button>

              {/* Option 2: MyDona QR / Apple Pay */}
              <button
                id="pay-method-mydona"
                type="button"
                onClick={() => setPaymentMethod('mydona')}
                style={{
                  padding: '1rem 1.15rem',
                  borderRadius: '14px',
                  border: paymentMethod === 'mydona' ? '2.5px solid #0284c7' : '1.5px solid #e2e8f0',
                  backgroundColor: paymentMethod === 'mydona' ? '#e0f2fe' : '#ffffff',
                  color: paymentMethod === 'mydona' ? '#0369a1' : '#475569',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  gap: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: paymentMethod === 'mydona' ? '0 4px 14px rgba(2, 132, 199, 0.15)' : 'none',
                  textAlign: 'left',
                }}
              >
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    backgroundColor: paymentMethod === 'mydona' ? '#0284c7' : '#f1f5f9',
                    color: paymentMethod === 'mydona' ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <QrCode size={20} />
                </div>
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: paymentMethod === 'mydona' ? '#0369a1' : '#0f172a' }}>
                    MyDona QR / Apple Pay
                  </div>
                  <div style={{ fontSize: '0.75rem', color: paymentMethod === 'mydona' ? '#0284c7' : '#64748b', fontWeight: 600, marginTop: '0.1rem' }}>
                    Apple Pay, Google Pay & UK Cards
                  </div>
                </div>
              </button>
            </div>

            {/* TAB CONTENT: 1. BANK TRANSFER (DEFAULT) */}
            {paymentMethod === 'bank' ? (
              <div
                id="bank-transfer"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1.5px solid #0284c7',
                  borderRadius: '20px',
                  padding: '2rem 1.75rem',
                  boxShadow: '0 8px 30px rgba(5, 150, 105, 0.08)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem',
                }}
              >
                {/* Header with Title, Subtitle, and Copy All Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1.15rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.25rem', letterSpacing: '-0.02em' }}>
                      Al Rayan Bank Transfer Details
                    </h3>
                    <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                      Transfer directly from your UK online banking app or standing order with <strong>0% fees</strong>.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyAll}
                    style={{
                      padding: '0.65rem 1.15rem',
                      fontSize: '0.84rem',
                      fontWeight: 800,
                      borderRadius: '10px',
                      border: 'none',
                      backgroundColor: copiedAll ? '#0284c7' : '#0284c7',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.2)',
                      transition: 'all 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    {copiedAll ? <CheckCheck size={16} /> : <Copy size={16} />}
                    <span>{copiedAll ? 'All Details Copied!' : 'Copy All Details'}</span>
                  </button>
                </div>

                {/* Cohesive Bank Details Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
                  {/* Beneficiary Name (Spans full width) */}
                  <div
                    style={{
                      gridColumn: '1 / -1',
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Beneficiary Account Name
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                        ALFALAH COMMUNITY SUPPORT CENTRE
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('ALFALAH COMMUNITY SUPPORT CENTRE', 'beneficiary')}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {copiedField === 'beneficiary' ? <Check size={13} color="#0284c7" /> : <Copy size={13} />}
                      {copiedField === 'beneficiary' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Sort Code */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Sort Code
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284c7', letterSpacing: '1px' }}>
                        30-00-83
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('30-00-83', 'sort-code')}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {copiedField === 'sort-code' ? <Check size={13} color="#0284c7" /> : <Copy size={13} />}
                      {copiedField === 'sort-code' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Account Number */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Account Number
                      </span>
                      <span style={{ fontSize: '1.35rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284c7', letterSpacing: '1px' }}>
                        01298401
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('01298401', 'account-number')}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {copiedField === 'account-number' ? <Check size={13} color="#0284c7" /> : <Copy size={13} />}
                      {copiedField === 'account-number' ? 'Copied' : 'Copy'}
                    </button>
                  </div>

                  {/* Bank Name */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Bank Name
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>
                        Al Rayan Bank
                      </span>
                    </div>
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0284c7', backgroundColor: '#e0f2fe', padding: '3px 8px', borderRadius: '6px' }}>
                      UK Islamic Bank
                    </span>
                  </div>

                  {/* Payment Reference */}
                  <div
                    style={{
                      backgroundColor: '#f8fafc',
                      borderRadius: '12px',
                      padding: '0.9rem 1.15rem',
                      border: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Payment Reference
                      </span>
                      <span style={{ fontSize: '1.05rem', fontWeight: 900, fontFamily: 'monospace', color: '#b45309', letterSpacing: '0.5px' }}>
                        {paymentReference}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy(paymentReference, 'reference')}
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.76rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                    >
                      {copiedField === 'reference' ? <Check size={13} color="#0284c7" /> : <Copy size={13} />}
                      {copiedField === 'reference' ? 'Copied' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Helpful Instruction Note */}
                <div style={{ backgroundColor: '#e0f2fe', border: '1px solid #bae6fd', borderRadius: '12px', padding: '0.85rem 1.15rem', fontSize: '0.84rem', color: '#0369a1', lineHeight: 1.55 }}>
                  <strong>How to transfer:</strong> Log into your UK banking app (Barclays, Lloyds, NatWest, Monzo, HSBC, Santander, etc.), select <em>Pay Someone New</em>, enter the Sort Code and Account Number above, and quote <strong>{paymentReference}</strong> so we allocate your donation to the correct cause.
                </div>

                {/* Refined WhatsApp Confirmation Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '50%',
                        backgroundColor: '#25D366',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                        Need an instant confirmation or receipt?
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                        Send us a quick message on WhatsApp after completing your transfer.
                      </div>
                    </div>
                  </div>

                  <a
                    href={`https://wa.me/447476815340?text=${encodeURIComponent(
                      `Assalamu Alaikum, I have sent a bank transfer donation for ${currentFund.label} (Payment Reference: ${paymentReference}). Please confirm receipt.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      padding: '0.65rem 1.25rem',
                      backgroundColor: '#25D366',
                      color: '#ffffff',
                      borderRadius: '10px',
                      textDecoration: 'none',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 8px rgba(37, 211, 102, 0.25)',
                      transition: 'transform 0.15s ease',
                      flexShrink: 0,
                    }}
                  >
                    <span>Notify on WhatsApp →</span>
                  </a>
                </div>
              </div>
            ) : (
              /* TAB CONTENT: 2. MYDONA QR / APPLE PAY (HIGH-END MODERN UX) */
              <div
                id="mydona-portal"
                style={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #0284c7',
                  borderRadius: '20px',
                  padding: '2rem 1.75rem',
                  boxShadow: '0 8px 30px rgba(2, 132, 199, 0.12)',
                }}
              >
                <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
                  <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem', letterSpacing: '-0.02em' }}>
                    Instant Giving via MyDona
                  </h3>
                  <p style={{ fontSize: '0.92rem', color: '#475569', maxWidth: '520px', margin: '0 auto', lineHeight: 1.55 }}>
                    Give securely in seconds with <strong>Apple Pay</strong>, <strong>Google Pay</strong>, or <strong>UK Debit/Credit Cards</strong> via our official MyDona giving portal.
                  </p>
                </div>

                {/* Two-Column Responsive Layout: Left QR Code, Right Actions & Details */}
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '1.75rem',
                    alignItems: 'center',
                  }}
                >
                  {/* Column 1: Crisp QR Code Presentation */}
                  <div style={{ textAlign: 'center' }}>
                    <div
                      style={{
                        display: 'inline-block',
                        padding: '1.15rem',
                        backgroundColor: '#ffffff',
                        borderRadius: '20px',
                        border: '2px solid #e2e8f0',
                        boxShadow: '0 10px 30px rgba(2, 132, 199, 0.1)',
                      }}
                    >
                      <Image
                        src="/images/mydona-qr.png"
                        alt="Masjid Al Falah MyDona Official QR Code"
                        width={240}
                        height={240}
                        priority
                        style={{
                          display: 'block',
                          width: '220px',
                          height: '220px',
                          borderRadius: '12px',
                        }}
                      />
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.4rem',
                          marginTop: '0.85rem',
                          fontSize: '0.78rem',
                          fontWeight: 800,
                          color: '#0369a1',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                        }}
                      >
                        <Smartphone size={15} color="#0284c7" />
                        <span>Scan with Phone Camera</span>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: Direct Actions & Assurance */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {/* Primary Direct Giving CTA */}
                    <a
                      href={MYDONA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        width: '100%',
                        padding: '1rem 1.5rem',
                        background: 'linear-gradient(135deg, #0284c7 0%, #0284c7 100%)',
                        color: '#ffffff',
                        borderRadius: '14px',
                        fontWeight: 800,
                        fontSize: '1.05rem',
                        textDecoration: 'none',
                        boxShadow: '0 4px 16px rgba(5, 150, 105, 0.35)',
                        transition: 'transform 0.15s ease',
                      }}
                    >
                      <span>Open MyDona Giving Page</span>
                      <ExternalLink size={18} />
                    </a>

                    {/* Quick Link Copy Box */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#f8fafc',
                        borderRadius: '10px',
                        border: '1px solid #e2e8f0',
                        fontSize: '0.82rem',
                      }}
                    >
                      <span style={{ color: '#64748b', fontFamily: 'monospace', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        donate.mydona.com/al-falah-csc
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(MYDONA_URL, 'mydona-url')}
                        style={{
                          padding: '0.35rem 0.65rem',
                          borderRadius: '6px',
                          border: '1px solid #cbd5e1',
                          backgroundColor: '#ffffff',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.75rem',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.3rem',
                          flexShrink: 0,
                          marginLeft: '0.5rem',
                        }}
                      >
                        {copiedField === 'mydona-url' ? <Check size={13} color="#0284c7" /> : <Copy size={13} />}
                        {copiedField === 'mydona-url' ? 'Copied' : 'Copy Link'}
                      </button>
                    </div>

                    {/* Supported Payment Badges */}
                    <div>
                      <div style={{ fontSize: '0.74rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.45rem' }}>
                        Supported Instant Payment Methods
                      </div>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#000000', backgroundColor: '#f1f5f9', padding: '4px 10px', borderRadius: '7px', border: '1px solid #cbd5e1' }}>
                           Apple Pay
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1a73e8', backgroundColor: '#e8f0fe', padding: '4px 10px', borderRadius: '7px', border: '1px solid #c2e7ff' }}>
                          G Pay
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', backgroundColor: '#dbeafe', padding: '4px 10px', borderRadius: '7px' }}>
                          VISA
                        </span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#b91c1c', backgroundColor: '#fee2e2', padding: '4px 10px', borderRadius: '7px' }}>
                          Mastercard
                        </span>
                      </div>
                    </div>

                    {/* Trust bullet points */}
                    <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.8rem', color: '#64748b' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <ShieldCheck size={15} color="#0284c7" />
                        <span>Direct official disbursement to Al-Falah CSC (Charity #1150221)</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Check size={15} color="#0284c7" />
                        <span>Instant digital donation receipt delivered to your email</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* CHARITY GOVERNANCE & FAQ TRUST SECTION */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
            gap: '1.25rem',
          }}
        >
          {/* Official Charity Governance & Bank Information */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0369a1', fontWeight: 800, fontSize: '0.95rem' }}>
              <ShieldCheck size={20} />
              <span>UK Charity Commission Verified</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>ALFALAH COMMUNITY SUPPORT CENTRE</strong> is an officially registered UK charity (No. <strong>1150221</strong>) operating in Balsall Heath, Birmingham.
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Building size={14} style={{ color: '#0284c7' }} />
                <span>89 Tindal Street, Balsall Heath, Birmingham B12 9QU</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Phone size={14} style={{ color: '#0284c7' }} />
                <a href="tel:07429188880" style={{ color: 'inherit', textDecoration: 'none' }}>07429 188880</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Mail size={14} style={{ color: '#0284c7' }} />
                <a href="mailto:alfalahcsc@hotmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>alfalahcsc@hotmail.com</a>
              </div>
            </div>

            <a
              href="https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5023502/contact-information"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#0284c7',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem',
                textDecoration: 'underline',
                marginTop: '0.25rem',
              }}
            >
              View on Charity Commission Register <ExternalLink size={13} />
            </a>
          </div>

          {/* Quick Giving FAQ */}
          <div
            className="card"
            style={{
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-lg)',
              padding: '1.5rem',
              border: '1px solid #e2e8f0',
            }}
          >
            <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <HelpCircle size={16} style={{ color: '#0284c7' }} />
              Donation FAQs
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>Where does my donation go?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  Every penny goes directly to your selected cause (Mosque Purchase Appeal, Zakat al-Mal, Youth Madrasah, or General Sadaqah).
                </span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>How can I receive a donation receipt?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  For direct bank transfers, notify us on WhatsApp with your payment reference. For MyDona payments, an official digital receipt is emailed to you instantly upon completing payment.
                </span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>Can I set up a regular Standing Order?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  Yes! Use the official Al Rayan Bank transfer details above to set up a regular monthly standing order directly in your UK banking app with 0% fees.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Zakat Calculator Modal */}
      <ZakatCalculatorModal isOpen={zakatModalOpen} onClose={() => setZakatModalOpen(false)} />
    </div>
  );
}

function DonateLoading() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.5rem' }}>
          Loading Secure Donation Form...
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Alfalah Community Support Centre • Charity #1150221
        </p>
      </div>
    </div>
  );
}

export default function DonatePage() {
  return (
    <Suspense fallback={<DonateLoading />}>
      <DonateContent />
    </Suspense>
  );
}
