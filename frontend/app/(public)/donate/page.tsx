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
    const fullDetails = `AL FALAH COMMUNITY SUPPORT CENTRE — Official Bank Donation Details
Bank: Al Rayan Bank
Sort Code: 30-00-83
Account Number: 01298401
Account Name: AL FALAH COMMUNITY SUPPORT CENTRE
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
          background: 'linear-gradient(180deg, #DCEEFF 0%, #f8fafc 100%)',
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
              backgroundColor: '#E0F2FE',
              color: '#0369A1',
              border: '1px solid #BAE6FD',
              borderRadius: '9999px',
              padding: '0.35rem 0.95rem',
              fontSize: '0.8rem',
              fontWeight: 700,
              marginBottom: '0.75rem',
            }}
          >
            <ShieldCheck size={15} color="#0284C7" />
            <span>UK Registered Charity #1150221 • 100% Secure Donations</span>
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.5rem, 3.8vw, 2.5rem)',
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
              fontSize: 'clamp(0.88rem, 2vw, 1rem)',
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
            marginBottom: '2rem',
          }}
        >
          {/* 1. FREQUENCY SEGMENTED PILL */}
          <div style={{ maxWidth: '460px', margin: '0 auto 1.75rem', width: '100%' }}>
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
                className="donate-freq-btn"
                style={{
                  backgroundColor: frequency === 'oneoff' ? '#ffffff' : 'transparent',
                  color: frequency === 'oneoff' ? '#0284C7' : '#64748b',
                  boxShadow: frequency === 'oneoff' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
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
                className="donate-freq-btn"
                style={{
                  backgroundColor: frequency === 'monthly' ? '#ffffff' : 'transparent',
                  color: frequency === 'monthly' ? '#0284C7' : '#64748b',
                  boxShadow: frequency === 'monthly' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
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
                    className={`donate-amount-btn ${isSelected ? 'active' : ''}`}
                    style={{
                      position: 'relative',
                      backgroundColor: isSelected ? '#E0F2FE' : '#ffffff',
                      color: isSelected ? '#0284C7' : '#0f172a',
                      border: isSelected ? '2px solid #0284C7' : '1.5px solid #e2e8f0',
                      boxShadow: isSelected ? '0 2px 8px rgba(2, 132, 199, 0.18)' : 'none',
                    }}
                  >
                    <span className="preset-amount-val">£{opt.amount}</span>
                    {frequency === 'monthly' && (
                      <span className="preset-amount-sub">/mo</span>
                    )}
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
                  color: customAmount ? '#0284C7' : '#64748b',
                }}
              >
                £
              </span>
              <input
                type="number"
                min="1"
                placeholder="Enter other amount (e.g. 35, 150)..."
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  padding: '0.75rem 1rem 0.75rem 2.25rem',
                  borderRadius: '12px',
                  border: customAmount ? '2px solid #0284C7' : '1.5px solid #e2e8f0',
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
                      border: isSelected ? '2px solid #0284C7' : '1.5px solid #e2e8f0',
                      backgroundColor: isSelected ? '#F0F9FF' : '#ffffff',
                      color: isSelected ? '#0F172A' : '#1e293b',
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
                          backgroundColor: isSelected ? '#0284C7' : '#f1f5f9',
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
                        <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#0F172A' : '#0f172a', lineHeight: 1.3 }}>
                          {fund.label}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: isSelected ? '#0284C7' : '#64748b', fontWeight: 500, marginTop: '0.15rem', lineHeight: 1.25 }}>
                          {fund.sublabel}
                        </div>
                      </div>
                    </div>

                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '2px solid #0284C7' : '2px solid #cbd5e1',
                        backgroundColor: isSelected ? '#0284C7' : 'transparent',
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
                  backgroundColor: '#E0F2FE',
                  border: '1px solid #BAE6FD',
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
                  <Calculator size={18} style={{ color: '#0284C7', flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                      Need help calculating your Zakat?
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#0284C7', marginTop: '0.1rem' }}>
                      Based on UK Silver Nisab: £485.00
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setZakatModalOpen(true)}
                  style={{
                    backgroundColor: '#0284C7',
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
            <div className="pay-method-switcher">
              {/* Option 1: Bank Transfer (First option as requested) */}
              <button
                id="pay-method-bank"
                type="button"
                onClick={() => setPaymentMethod('bank')}
                className={`pay-method-btn ${paymentMethod === 'bank' ? 'selected' : ''}`}
              >
                <div className={`pay-method-icon ${paymentMethod === 'bank' ? 'icon-active' : ''}`}>
                  <Building size={18} />
                </div>
                <div>
                  <div className="pay-method-label">
                    Bank Transfer (0% Fee)
                  </div>
                  <div className="pay-method-desc">
                    Al Rayan Bank • Direct UK Transfer
                  </div>
                </div>
              </button>

              {/* Option 2: MyDona QR / Apple Pay */}
              <button
                id="pay-method-mydona"
                type="button"
                onClick={() => setPaymentMethod('mydona')}
                className={`pay-method-btn ${paymentMethod === 'mydona' ? 'selected' : ''}`}
              >
                <div className={`pay-method-icon ${paymentMethod === 'mydona' ? 'icon-active' : ''}`}>
                  <QrCode size={18} />
                </div>
                <div>
                  <div className="pay-method-label">
                    MyDona QR / Apple Pay
                  </div>
                  <div className="pay-method-desc">
                    Apple Pay, Google Pay & UK Cards
                  </div>
                </div>
              </button>
            </div>

            {/* TAB CONTENT: 1. BANK TRANSFER (DEFAULT) */}
            {paymentMethod === 'bank' ? (
              <div
                id="bank-transfer"
                className="bank-transfer-card"
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderTop: '3px solid #0284C7',
                  borderRadius: '16px',
                  padding: '1.25rem',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.06)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                }}
              >
                {/* Header with Title and Full-width Copy All Button */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div
                      style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '8px',
                        backgroundColor: '#E0F2FE',
                        color: '#0284C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Building size={18} />
                    </div>
                    <div>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                        Al Rayan Bank Details
                      </h3>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0, lineHeight: 1.4 }}>
                        Direct UK transfer with <strong>0% transaction fees</strong>
                      </p>
                    </div>
                  </div>

                  {/* Primary One-Tap Copy All Button */}
                  <button
                    type="button"
                    onClick={handleCopyAll}
                    style={{
                      width: '100%',
                      padding: '0.65rem 1rem',
                      fontSize: '0.84rem',
                      fontWeight: 700,
                      borderRadius: '8px',
                      border: 'none',
                      background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                      color: '#ffffff',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.45rem',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {copiedAll ? <CheckCheck size={16} /> : <Copy size={16} />}
                    <span>{copiedAll ? 'All Transfer Details Copied!' : 'Copy All Transfer Details'}</span>
                  </button>
                </div>

                {/* Cohesive Receipt Card (100% Width Rows — No Broken Wrapping) */}
                <div
                  className="bank-receipt-box"
                  style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden',
                  }}
                >
                  {/* Row 1: Sort Code */}
                  <div
                    className="bank-row"
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #e2e8f0',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: '0.67rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                        Sort Code
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284C7', letterSpacing: '1px' }}>
                        30-00-83
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('30-00-83', 'sort-code')}
                      aria-label="Copy Sort Code"
                      className="bank-copy-btn"
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                    >
                      {copiedField === 'sort-code' ? <Check size={13} color="#0284C7" /> : <Copy size={13} />}
                      <span>{copiedField === 'sort-code' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Row 2: Account Number */}
                  <div
                    className="bank-row"
                    style={{
                      padding: '0.75rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderBottom: '1px solid #e2e8f0',
                      gap: '0.5rem',
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <span style={{ display: 'block', fontSize: '0.67rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '2px' }}>
                        Account Number
                      </span>
                      <span style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284C7', letterSpacing: '1px' }}>
                        01298401
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('01298401', 'account-number')}
                      aria-label="Copy Account Number"
                      className="bank-copy-btn"
                      style={{ padding: '0.4rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                    >
                      {copiedField === 'account-number' ? <Check size={13} color="#0284C7" /> : <Copy size={13} />}
                      <span>{copiedField === 'account-number' ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>

                  {/* Row 3: Beneficiary Name — Two-Tier Layout for full width on mobile */}
                  <div
                    className="bank-row bank-row-beneficiary"
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #e2e8f0',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.67rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Beneficiary Account Name
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy('AL FALAH COMMUNITY SUPPORT CENTRE', 'beneficiary')}
                        aria-label="Copy Beneficiary Name"
                        className="bank-copy-btn"
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#334155', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                      >
                        {copiedField === 'beneficiary' ? <Check size={13} color="#0284C7" /> : <Copy size={13} />}
                        <span>{copiedField === 'beneficiary' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div style={{ fontSize: '0.96rem', fontWeight: 800, color: '#0f172a', lineHeight: 1.35, letterSpacing: '-0.01em' }}>
                      AL FALAH COMMUNITY SUPPORT CENTRE
                    </div>
                  </div>

                  {/* Row 4: Payment Reference (Highlighted) — Two-Tier Layout */}
                  <div
                    className="bank-row bank-row-reference"
                    style={{
                      padding: '0.75rem 1rem',
                      backgroundColor: '#FFFBEB',
                      borderBottom: '1px solid #FDE68A',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem', gap: '0.5rem' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'baseline', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.67rem', color: '#92400E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                          Payment Reference
                        </span>
                        <span style={{ fontSize: '0.67rem', color: '#B45309', fontWeight: 600 }}>
                          (Quote in your app)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleCopy(paymentReference, 'reference')}
                        aria-label="Copy Payment Reference"
                        className="bank-copy-btn"
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '6px', border: '1px solid #FCD34D', backgroundColor: '#ffffff', color: '#92400E', cursor: 'pointer', fontSize: '0.74rem', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '0.3rem', flexShrink: 0 }}
                      >
                        {copiedField === 'reference' ? <Check size={13} color="#B45309" /> : <Copy size={13} />}
                        <span>{copiedField === 'reference' ? 'Copied' : 'Copy'}</span>
                      </button>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 900, fontFamily: 'monospace', color: '#B45309', letterSpacing: '0.5px' }}>
                      {paymentReference}
                    </div>
                  </div>

                  {/* Row 5: Bank Name */}
                  <div
                    className="bank-row"
                    style={{
                      padding: '0.65rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <span style={{ display: 'block', fontSize: '0.67rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        Bank Name
                      </span>
                      <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                        Al Rayan Bank
                      </span>
                    </div>
                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#0284C7', backgroundColor: '#E0F2FE', padding: '3px 8px', borderRadius: '6px', flexShrink: 0 }}>
                      UK Islamic Bank
                    </span>
                  </div>
                </div>

                {/* Helpful Instruction Note */}
                <div style={{ backgroundColor: '#F0F9FF', border: '1px solid #BAE6FD', borderRadius: '10px', padding: '0.75rem 1rem', fontSize: '0.8rem', color: '#0369A1', lineHeight: 1.5 }}>
                  <strong>How to transfer:</strong> In your UK banking app, select <em>Pay Someone New</em>, enter Account Name <strong>Al Falah Community Support Centre</strong>, Sort Code <strong>30-00-83</strong>, Account <strong>01298401</strong>, and quote <strong>{paymentReference}</strong> as payment reference.
                </div>

                {/* WhatsApp Confirmation Row */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    padding: '0.85rem 1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        backgroundColor: '#E0F2FE',
                        color: '#0284C7',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={16} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                        Need instant receipt on WhatsApp?
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Send us a message after completing your transfer.
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
                      padding: '0.55rem 1rem',
                      background: 'linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%)',
                      color: '#ffffff',
                      borderRadius: '8px',
                      textDecoration: 'none',
                      fontWeight: 700,
                      fontSize: '0.82rem',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      boxShadow: '0 2px 8px rgba(2, 132, 199, 0.22)',
                      transition: 'transform 0.15s ease, box-shadow 0.15s ease',
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
                className="mydona-portal-card"
              >
                <div className="mydona-header">
                  <h3 className="mydona-title">
                    Instant Giving via MyDona
                  </h3>
                  <p className="mydona-subtitle">
                    Give securely in seconds with <strong>Apple Pay</strong>, <strong>Google Pay</strong>, or <strong>UK Debit/Credit Cards</strong> via our official MyDona giving portal.
                  </p>
                </div>

                {/* Two-Column Responsive Layout: Action Column First on Mobile, QR Column Second */}
                <div className="mydona-layout-grid">
                  {/* Column: Direct Actions & Quick Links */}
                  <div className="mydona-actions-col">
                    {/* Primary Direct Giving CTA */}
                    <a
                      href={MYDONA_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mydona-open-btn"
                    >
                      <span>Open MyDona Giving Page</span>
                      <ExternalLink size={17} />
                    </a>

                    {/* Quick Link Copy Box */}
                    <div className="mydona-copy-box">
                      <span className="mydona-copy-url">
                        donate.mydona.com/al-falah-csc
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(MYDONA_URL, 'mydona-url')}
                        className="mydona-copy-btn"
                      >
                        {copiedField === 'mydona-url' ? <Check size={13} color="#0284C7" /> : <Copy size={13} />}
                        <span>{copiedField === 'mydona-url' ? 'Copied' : 'Copy Link'}</span>
                      </button>
                    </div>

                    {/* Supported Payment Badges */}
                    <div>
                      <div className="mydona-badges-title">
                        Supported Instant Payment Methods
                      </div>
                      <div className="mydona-badges-row">
                        <span className="badge-apple">
                           Apple Pay
                        </span>
                        <span className="badge-gpay">
                          G Pay
                        </span>
                        <span className="badge-visa">
                          VISA
                        </span>
                        <span className="badge-mastercard">
                          Mastercard
                        </span>
                      </div>
                    </div>

                    {/* Trust bullet points */}
                    <div className="mydona-trust-box">
                      <div className="mydona-trust-item">
                        <ShieldCheck size={14} color="#0284C7" style={{ flexShrink: 0 }} />
                        <span>Direct official disbursement to Al-Falah CSC (Charity #1150221)</span>
                      </div>
                      <div className="mydona-trust-item">
                        <Check size={14} color="#0284C7" style={{ flexShrink: 0 }} />
                        <span>Instant digital donation receipt delivered to your email</span>
                      </div>
                    </div>
                  </div>

                  {/* Column: Clean QR Code Presentation */}
                  <div className="mydona-qr-col">
                    <div className="mydona-qr-wrapper">
                      <div className="mydona-qr-img-box">
                        <Image
                          src="/images/mydona-qr-blue.png"
                          alt="Masjid Al Falah MyDona Official QR Code"
                          width={200}
                          height={200}
                          priority
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxWidth: '180px',
                            display: 'block',
                            margin: '0 auto',
                            borderRadius: '10px',
                          }}
                        />
                      </div>
                      <div className="mydona-qr-caption">
                        <Smartphone size={14} color="#0284C7" />
                        <span>Scan with Phone Camera</span>
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#0F172A', fontWeight: 800, fontSize: '0.95rem' }}>
              <ShieldCheck size={20} color="#0284C7" />
              <span>UK Charity Commission Verified</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>AL FALAH COMMUNITY SUPPORT CENTRE</strong> is an officially registered UK charity (No. <strong>1150221</strong>) operating in Balsall Heath, Birmingham.
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Building size={14} style={{ color: '#0284C7' }} />
                <span>89 Tindal Street, Balsall Heath, Birmingham B12 9QU</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Phone size={14} style={{ color: '#0284C7' }} />
                <a href="tel:07429188880" style={{ color: 'inherit', textDecoration: 'none' }}>07429 188880</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Mail size={14} style={{ color: '#0284C7' }} />
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
                color: '#0284C7',
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
              <HelpCircle size={16} style={{ color: '#0284C7' }} />
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

      <style jsx>{`
        .pay-method-switcher {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 0.65rem;
          margin-bottom: 1.25rem;
        }
        .pay-method-btn {
          padding: 0.85rem 1rem;
          border-radius: 14px;
          border: 1.5px solid #e2e8f0;
          background-color: #ffffff;
          color: #475569;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          transition: all 0.15s ease;
          text-align: left;
        }
        .pay-method-btn.selected {
          border: 2px solid #0284C7;
          background-color: #F0F9FF;
          color: #0F172A;
          box-shadow: 0 4px 14px rgba(2, 132, 199, 0.12);
        }
        .pay-method-icon {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background-color: #f1f5f9;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }
        .pay-method-icon.icon-active {
          background-color: #0284C7;
          color: #ffffff;
        }
        .pay-method-label {
          font-size: 0.92rem;
          font-weight: 800;
          color: #0f172a;
          line-height: 1.2;
        }
        .pay-method-desc {
          font-size: 0.74rem;
          color: #64748b;
          font-weight: 600;
          margin-top: 0.1rem;
        }
        .pay-method-btn.selected .pay-method-desc {
          color: #0284C7;
        }

        .mydona-portal-card {
          background-color: #ffffff;
          border: 1px solid #e2e8f0;
          border-top: 3px solid #0284C7;
          border-radius: 16px;
          padding: 1.5rem;
          box-shadow: 0 4px 20px rgba(15, 23, 42, 0.06);
        }
        .mydona-header {
          text-align: center;
          margin-bottom: 1.25rem;
        }
        .mydona-title {
          font-size: 1.35rem;
          font-weight: 800;
          color: #0f172a;
          margin-bottom: 0.35rem;
          letter-spacing: -0.02em;
        }
        .mydona-subtitle {
          font-size: 0.9rem;
          color: #475569;
          max-width: 520px;
          margin: 0 auto;
          line-height: 1.5;
        }
        .mydona-layout-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.5rem;
          align-items: center;
        }
        .mydona-actions-col {
          display: flex;
          flex-direction: column;
          gap: 0.85rem;
          min-width: 0;
        }
        .mydona-open-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem 1.25rem;
          background: linear-gradient(135deg, #0284C7 0%, #0EA5E9 100%);
          color: #ffffff;
          border-radius: 12px;
          font-weight: 800;
          font-size: 0.95rem;
          text-decoration: none;
          box-shadow: 0 3px 14px rgba(2, 132, 199, 0.25);
          transition: transform 0.15s ease;
        }
        .mydona-open-btn:hover {
          transform: translateY(-1px);
        }
        .mydona-copy-box {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.55rem 0.75rem;
          background-color: #f8fafc;
          border-radius: 10px;
          border: 1px solid #e2e8f0;
          font-size: 0.8rem;
          min-width: 0;
        }
        .mydona-copy-url {
          color: #64748b;
          font-family: monospace;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
          flex: 1;
        }
        .mydona-copy-btn {
          padding: 0.35rem 0.6rem;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
          background-color: #ffffff;
          color: #0f172a;
          font-weight: 700;
          font-size: 0.72rem;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 0.3rem;
          flex-shrink: 0;
          margin-left: 0.5rem;
        }
        .mydona-badges-title {
          font-size: 0.72rem;
          font-weight: 800;
          color: #475569;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 0.4rem;
        }
        .mydona-badges-row {
          display: flex;
          gap: 0.35rem;
          flex-wrap: wrap;
          align-items: center;
        }
        .badge-apple {
          font-size: 0.74rem;
          font-weight: 800;
          color: #000000;
          background-color: #f1f5f9;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #cbd5e1;
        }
        .badge-gpay {
          font-size: 0.74rem;
          font-weight: 800;
          color: #1a73e8;
          background-color: #e8f0fe;
          padding: 3px 8px;
          border-radius: 6px;
          border: 1px solid #c2e7ff;
        }
        .badge-visa {
          font-size: 0.74rem;
          font-weight: 800;
          color: #1e40af;
          background-color: #dbeafe;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .badge-mastercard {
          font-size: 0.74rem;
          font-weight: 800;
          color: #b91c1c;
          background-color: #fee2e2;
          padding: 3px 8px;
          border-radius: 6px;
        }
        .mydona-trust-box {
          border-top: 1px solid #f1f5f9;
          padding-top: 0.65rem;
          display: flex;
          flex-direction: column;
          gap: 0.35rem;
          font-size: 0.76rem;
          color: #64748b;
        }
        .mydona-trust-item {
          display: flex;
          align-items: center;
          gap: 0.4rem;
        }
        .mydona-qr-col {
          text-align: center;
          display: flex;
          justify-content: center;
        }
        .mydona-qr-wrapper {
          display: inline-block;
          padding: 0.85rem;
          background-color: #ffffff;
          border-radius: 16px;
          border: 1.5px solid #e2e8f0;
          box-shadow: 0 6px 20px rgba(57, 136, 202, 0.08);
          max-width: 220px;
          width: 100%;
          box-sizing: border-box;
        }
        .mydona-qr-img-box {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .mydona-qr-caption {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.35rem;
          margin-top: 0.65rem;
          font-size: 0.72rem;
          font-weight: 800;
          color: #245C91;
          text-transform: uppercase;
          letter-spacing: 0.4px;
        }

        /* Responsive Breakpoints */
        @media (max-width: 680px) {
          .donate-card {
            padding: 1rem 0.65rem !important;
            border-radius: 16px !important;
          }
          .bank-transfer-card {
            padding: 0.85rem 0.65rem !important;
            border-radius: 14px !important;
          }
          .bank-row {
            padding: 0.65rem 0.75rem !important;
          }
          .bank-receipt-box {
            border-radius: 10px !important;
          }
          .bank-copy-btn {
            padding: 0.32rem 0.6rem !important;
            font-size: 0.72rem !important;
          }
          .pay-method-switcher {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .pay-method-btn {
            padding: 0.7rem 0.85rem;
          }
          .pay-method-icon {
            width: 32px;
            height: 32px;
          }
          .pay-method-label {
            font-size: 0.88rem;
          }
          .pay-method-desc {
            font-size: 0.7rem;
          }
          .mydona-portal-card {
            padding: 1.15rem 0.95rem;
          }
          .mydona-title {
            font-size: 1.2rem;
          }
          .mydona-subtitle {
            font-size: 0.82rem;
          }
          .mydona-layout-grid {
            grid-template-columns: 1fr;
            gap: 1.25rem;
          }
          .mydona-actions-col {
            order: 1;
          }
          .mydona-qr-col {
            order: 2;
          }
          .mydona-open-btn {
            padding: 0.7rem 1rem;
            font-size: 0.9rem;
          }
          .mydona-qr-wrapper {
            max-width: 170px;
            padding: 0.65rem;
          }
        }
      `}</style>
    </div>
  );
}

function DonateLoading() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0284C7', marginBottom: '0.5rem' }}>
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
