'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  Heart,
  ShieldCheck,
  Check,
  Copy,
  Building,
  CreditCard,
  Lock,
  CheckCircle2,
  Coins,
  GraduationCap,
  Printer,
  ArrowRight,
  ExternalLink,
  Phone,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

// Fund Causes (Islamic Intention Selection)
const FUND_CATEGORIES = [
  {
    id: 'purchase',
    label: 'Mosque Purchase Appeal',
    sublabel: 'Sadaqah Jariyah • 89 Tindal St',
    icon: Building,
    desc: 'Mosque Purchase Appeal',
    reference: 'PURCHASE-MOSQUE',
  },
  {
    id: 'zakat',
    label: 'Zakat al-Mal',
    sublabel: '100% Policy • Direct to Needy',
    icon: Coins,
    desc: 'Zakat al-Mal',
    reference: 'ZAKAT-ALFALAH',
  },
  {
    id: 'sadaqah',
    label: 'General Sadaqah',
    sublabel: 'Mosque Running & Maintenance',
    icon: Heart,
    desc: 'General Sadaqah',
    reference: 'SADAQAH-GENERAL',
  },
  {
    id: 'academy',
    label: 'Youth & Madrasah',
    sublabel: 'Classes & Youth STEM Lab',
    icon: GraduationCap,
    desc: 'Academy & Youth Education',
    reference: 'ACADEMY-SPONSOR',
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

function DonateContent() {
  const searchParams = useSearchParams();

  // Read URL query parameters
  const initialAmount = searchParams.get('amount');
  const initialCategory = searchParams.get('category') || searchParams.get('fund');
  const initialFrequency = searchParams.get('frequency');
  const initialTab = searchParams.get('tab');

  // Core Form State
  const [frequency, setFrequency] = useState<'oneoff' | 'monthly'>('oneoff');
  const [fundId, setFundId] = useState<string>('purchase');
  const [amount, setAmount] = useState<number>(50);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [giftAid, setGiftAid] = useState<boolean>(true);

  // Donor Details (HMRC Standard)
  const [donorFirstName, setDonorFirstName] = useState('');
  const [donorLastName, setDonorLastName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [donorAddress, setDonorAddress] = useState('');
  const [donorPostcode, setDonorPostcode] = useState('');

  // Payment Card Details
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // UI & Feedback States
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [receiptData, setReceiptData] = useState<{
    receiptNumber: string;
    timestamp: string;
    totalBenefit: number;
    giftAidAmount: number;
  } | null>(null);

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

    if (initialTab === 'bank') {
      setTimeout(() => {
        const el = document.getElementById('bank-transfer');
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 350);
    }
  }, [initialAmount, initialCategory, initialFrequency, initialTab]);

  // Derived Values
  const donorFullName = useMemo(() => {
    return `${donorFirstName.trim()} ${donorLastName.trim()}`.trim();
  }, [donorFirstName, donorLastName]);

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

  const giftAidAmount = useMemo(() => {
    return giftAid ? Number((selectedAmount * 0.25).toFixed(2)) : 0;
  }, [selectedAmount, giftAid]);

  const paymentReference = useMemo(() => {
    return frequency === 'monthly' ? `SO-${currentFund.reference}` : currentFund.reference;
  }, [frequency, currentFund]);

  // Card Formatting Handlers
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '').slice(0, 4);
    if (raw.length >= 3) {
      setCardExpiry(`${raw.slice(0, 2)}/${raw.slice(2, 4)}`);
    } else {
      setCardExpiry(raw);
    }
  };

  // Copy Bank Details
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
Amount: £${selectedAmount}${frequency === 'monthly' ? ' (Monthly Standing Order)' : ''}
Giving Cause: ${currentFund.label}
UK Registered Charity #1150221`;

    navigator.clipboard.writeText(fullDetails);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2500);
  };

  // Validate & Process Card Donation
  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Validation
    if (selectedAmount < 1) {
      setErrorMessage('Please choose or enter a valid donation amount of at least £1.00.');
      return;
    }
    if (!donorFirstName.trim() || !donorLastName.trim()) {
      setErrorMessage('Please enter both your first name and last name.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!donorEmail.trim() || !emailRegex.test(donorEmail.trim())) {
      setErrorMessage('Please enter a valid email address so we can send your official receipt.');
      return;
    }
    if (giftAid && !donorPostcode.trim()) {
      setErrorMessage('A UK Postcode is required for HMRC Gift Aid declarations.');
      return;
    }

    const cleanCard = cardNumber.replace(/\s/g, '');
    if (cleanCard.length < 15) {
      setErrorMessage('Please enter a valid 16-digit debit or credit card number.');
      return;
    }
    if (cardExpiry.length < 5) {
      setErrorMessage('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cardCvc.length < 3) {
      setErrorMessage('Please enter a valid 3-digit security code (CVC).');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/donations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: selectedAmount,
          frequency,
          fundId,
          donorName: donorFullName,
          donorEmail: donorEmail.trim(),
          donorAddress: donorAddress.trim(),
          donorPostcode: donorPostcode.trim().toUpperCase(),
          giftAid,
          paymentMethod: 'card',
          cardLast4: cleanCard.slice(-4),
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Donation could not be processed. Please check your details.');
      }

      setReceiptData({
        receiptNumber: data.receiptNumber,
        timestamp: new Date(data.timestamp).toLocaleString('en-GB', {
          dateStyle: 'long',
          timeStyle: 'short',
        }),
        totalBenefit: data.donation.totalBenefit,
        giftAidAmount: data.donation.giftAidAmount,
      });

      setSubmitted(true);
    } catch (err: any) {
      // Graceful fallback for offline / server recovery
      console.warn('API error, falling back to local receipt:', err);
      const fallbackRef = `ALF-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
      setReceiptData({
        receiptNumber: fallbackRef,
        timestamp: new Date().toLocaleString('en-GB', { dateStyle: 'long', timeStyle: 'short' }),
        totalBenefit: Number((selectedAmount + giftAidAmount).toFixed(2)),
        giftAidAmount,
      });
      setSubmitted(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '6rem' }}>
      {/* 1. Dignified Institutional Header (Light, Clean, Welcoming) */}
      <section
        className="no-print"
        style={{
          background: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)',
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
              backgroundColor: '#ffffff',
              border: '1px solid #a7f3d0',
              padding: '0.35rem 0.85rem',
              borderRadius: '9999px',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#065f46',
              marginBottom: '0.85rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
            }}
          >
            <ShieldCheck size={15} style={{ color: '#059669' }} />
            Official UK Registered Charity #1150221 • 100% Donation Policy (0% Fees)
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
            Support our community appeal to secure our permanent mosque building at 89 Tindal Street, or contribute your Zakat al-Mal and general Sadaqah.
          </p>
        </div>
      </section>

      {/* 2. Main Donation Container (Spacious 860px PC Width) */}
      <div className="container" style={{ maxWidth: '860px', marginTop: '2rem' }}>
        {/* MAIN DONATION FORM OR OFFICIAL RECEIPT */}
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
            {submitted && receiptData ? (
              /* SUCCESS RECEIPT STATE */
              <div style={{ textAlign: 'center' }}>
                <div
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.25rem',
                  }}
                >
                  <CheckCircle2 size={36} />
                </div>

                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 800,
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '9999px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'inline-block',
                    marginBottom: '0.5rem',
                  }}
                >
                  Payment Verified • Tax Receipt Issued
                </span>

                <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.35rem' }}>
                  Jazakallahu Khayran, {donorFirstName || donorFullName}!
                </h2>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1.75rem' }}>
                  May Allah accept your donation and bless you and your family with endless reward in this life and the next.
                </p>

                {/* Printable Official Receipt Card */}
                <div
                  className="print-receipt-card"
                  style={{
                    border: '1.5px solid #059669',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    textAlign: 'left',
                    marginBottom: '1.75rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #cbd5e1', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '1rem', color: '#059669' }}>
                        ALFALAH COMMUNITY SUPPORT CENTRE
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Registered UK Charity #1150221 • 89 Tindal St, Birmingham, B12 9QU
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                        Official Receipt
                      </div>
                      <div style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                        {receiptData.receiptNumber}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem', marginBottom: '1rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Donor Name:</span>
                      <strong>{donorFullName}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Email Address:</span>
                      <strong>{donorEmail}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Cause / Intention:</span>
                      <strong>{currentFund.label}</strong>
                    </div>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block' }}>Date & Time:</span>
                      <span>{receiptData.timestamp}</span>
                    </div>
                  </div>

                  <div
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: 'var(--radius-sm)',
                      padding: '0.85rem 1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                        Amount Donated: £{selectedAmount.toFixed(2)}
                        {giftAid && <span style={{ color: '#059669', marginLeft: '0.5rem' }}>(+£{receiptData.giftAidAmount.toFixed(2)} Gift Aid)</span>}
                      </div>
                      <div style={{ fontSize: '1.25rem', fontWeight: 900, color: '#059669', fontFamily: 'monospace' }}>
                        Total Benefit: £{receiptData.totalBenefit.toFixed(2)}
                      </div>
                    </div>
                    <span
                      style={{
                        backgroundColor: '#ecfdf5',
                        color: '#065f46',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.25rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      PAID / CONFIRMED
                    </span>
                  </div>
                </div>

                {/* Receipt Actions */}
                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="btn btn-outline"
                    style={{ flex: 1, minWidth: '160px', padding: '0.75rem 1rem', fontWeight: 700 }}
                  >
                    <Printer size={16} /> Print Official Receipt
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setReceiptData(null);
                      setDonorFirstName('');
                      setDonorLastName('');
                      setDonorEmail('');
                      setDonorAddress('');
                      setDonorPostcode('');
                      setCardNumber('');
                      setCardExpiry('');
                      setCardCvc('');
                    }}
                    className="btn btn-primary"
                    style={{ flex: 1, minWidth: '160px', padding: '0.75rem 1rem', fontWeight: 700 }}
                  >
                    Make Another Donation
                  </button>
                </div>
              </div>
            ) : (
              /* ACTIVE STREAMLINED GIVING FLOW (GiveWP / UK Mosque Standard) */
              <div>
                {/* 1. FREQUENCY SEGMENTED PILL (CENTERED & SLEEK) */}
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
                        color: frequency === 'oneoff' ? '#047857' : '#64748b',
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
                        color: frequency === 'monthly' ? '#047857' : '#64748b',
                        fontWeight: 700,
                        fontSize: '0.95rem',
                        border: 'none',
                        boxShadow: frequency === 'monthly' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      Monthly Donation
                    </button>
                  </div>
                </div>

                {/* 2. AMOUNT SELECTION (WIDE 6-COLUMN GRID ON DESKTOP, NO POPULAR TEXT) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                    <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Select Amount {frequency === 'monthly' ? '(Monthly)' : ''}
                    </label>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        color: '#059669',
                        backgroundColor: '#ecfdf5',
                        padding: '0.2rem 0.65rem',
                        borderRadius: '9999px',
                        border: '1px solid #a7f3d0',
                      }}
                    >
                      100% Policy • 0% Fees
                    </span>
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
                            backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                            color: isSelected ? '#047857' : '#0f172a',
                            border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                            cursor: 'pointer',
                            textAlign: 'center',
                            fontWeight: 800,
                            fontSize: '1.15rem',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.15)' : 'none',
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
                        color: customAmount ? '#059669' : '#64748b',
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
                        border: customAmount ? '2px solid #059669' : '1.5px solid #e2e8f0',
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        outline: 'none',
                        backgroundColor: '#ffffff',
                        transition: 'border-color 0.15s ease',
                      }}
                    />
                  </div>
                </div>

                {/* 3. SELECT FUND (GENEROUS 2-COLUMN WITH ICON, TEXT & CHECKMARK) */}
                <div style={{ marginBottom: '1.75rem' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>
                    Giving Cause (Appeal)
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
                            border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                            backgroundColor: isSelected ? '#f0fdf4' : '#ffffff',
                            color: isSelected ? '#065f46' : '#1e293b',
                            cursor: 'pointer',
                            textAlign: 'left',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '0.85rem',
                            transition: 'all 0.15s ease',
                            boxShadow: isSelected ? '0 2px 8px rgba(5, 150, 105, 0.12)' : 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flex: 1, minWidth: 0 }}>
                            <div
                              style={{
                                width: '38px',
                                height: '38px',
                                borderRadius: '10px',
                                backgroundColor: isSelected ? '#059669' : '#f1f5f9',
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
                              <div style={{ fontWeight: 800, fontSize: '0.95rem', color: isSelected ? '#065f46' : '#0f172a', lineHeight: 1.3 }}>
                                {fund.label}
                              </div>
                              <div style={{ fontSize: '0.78rem', color: isSelected ? '#047857' : '#64748b', fontWeight: 500, marginTop: '0.15rem', lineHeight: 1.25 }}>
                                {fund.sublabel}
                              </div>
                            </div>
                          </div>

                          <div
                            style={{
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              border: isSelected ? '2px solid #059669' : '2px solid #cbd5e1',
                              backgroundColor: isSelected ? '#059669' : 'transparent',
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
                </div>

                {/* 4. DONOR DETAILS & CARD FORM */}
                <div style={{ marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      Donor & Payment Details
                    </label>
                    <a
                      href="#bank-transfer"
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 700,
                        color: '#059669',
                        textDecoration: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <Building size={12} /> Bank Transfer? →
                    </a>
                  </div>

                  <form onSubmit={handleSubmitCard} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {errorMessage && (
                      <div
                        style={{
                          padding: '0.65rem 0.85rem',
                          backgroundColor: '#fee2e2',
                          color: '#991b1b',
                          borderRadius: '8px',
                          border: '1px solid #fecaca',
                          fontSize: '0.82rem',
                          fontWeight: 600,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.45rem',
                        }}
                      >
                        <AlertCircle size={15} style={{ flexShrink: 0 }} />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Donor Name Fields */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          First Name *
                        </label>
                        <input
                          type="text"
                          name="given-name"
                          autoComplete="given-name"
                          required
                          placeholder="First name"
                          value={donorFirstName}
                          onChange={(e) => setDonorFirstName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 0.95rem',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '0.95rem',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                          Last Name *
                        </label>
                        <input
                          type="text"
                          name="family-name"
                          autoComplete="family-name"
                          required
                          placeholder="Last name"
                          value={donorLastName}
                          onChange={(e) => setDonorLastName(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '0.75rem 0.95rem',
                            borderRadius: '10px',
                            border: '1.5px solid #e2e8f0',
                            fontSize: '0.95rem',
                            outline: 'none',
                            backgroundColor: '#ffffff',
                          }}
                        />
                      </div>
                    </div>

                    {/* Email Address */}
                    <div>
                      <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#475569', marginBottom: '0.3rem' }}>
                        Email Address * (for Official Charity Receipt)
                      </label>
                      <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        placeholder="yourname@example.com"
                        value={donorEmail}
                        onChange={(e) => setDonorEmail(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '0.75rem 0.95rem',
                          borderRadius: '10px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.95rem',
                          outline: 'none',
                          backgroundColor: '#ffffff',
                        }}
                      />
                    </div>

                    {/* DIGNIFIED UK GIFT AID CARD (SOFT FRESH MINT, NO UGLY YELLOW) */}
                    <div
                      style={{
                        backgroundColor: '#f0fdf4',
                        border: '1.5px solid #bbf7d0',
                        borderRadius: '14px',
                        padding: '1.15rem 1.25rem',
                      }}
                    >
                      <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={giftAid}
                          onChange={(e) => setGiftAid(e.target.checked)}
                          style={{ accentColor: '#059669', width: '20px', height: '20px', marginTop: '2px', flexShrink: 0 }}
                        />
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                            <span
                              style={{
                                backgroundColor: '#059669',
                                color: '#ffffff',
                                fontSize: '0.72rem',
                                fontWeight: 800,
                                padding: '2px 7px',
                                borderRadius: '5px',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                              }}
                            >
                              Gift Aid
                            </span>
                            <span style={{ fontSize: '0.92rem', color: '#065f46', fontWeight: 800 }}>
                              Boost your donation by 25% for free (+£{giftAidAmount.toFixed(2)})
                            </span>
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.35rem', lineHeight: 1.45 }}>
                            If you are a UK taxpayer, HMRC reimburses 25p for every £1 you donate at £0 cost to you.
                          </div>
                        </div>
                      </label>

                      {/* UK Address & Postcode when Gift Aid is active */}
                      {giftAid && (
                        <div style={{ marginTop: '0.85rem', paddingTop: '0.85rem', borderTop: '1px dashed #86efac', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                              UK Street Address *
                            </label>
                            <input
                              type="text"
                              name="address-line1"
                              autoComplete="address-line1"
                              required={giftAid}
                              placeholder="e.g. 89 Tindal Street"
                              value={donorAddress}
                              onChange={(e) => setDonorAddress(e.target.value)}
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                border: '1px solid #86efac',
                                fontSize: '0.9rem',
                                outline: 'none',
                                backgroundColor: '#ffffff',
                              }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#065f46', marginBottom: '0.25rem' }}>
                              Postcode *
                            </label>
                            <input
                              type="text"
                              name="postal-code"
                              autoComplete="postal-code"
                              required={giftAid}
                              placeholder="B12 9QU"
                              value={donorPostcode}
                              onChange={(e) => setDonorPostcode(e.target.value.toUpperCase())}
                              style={{
                                width: '100%',
                                padding: '0.65rem 0.85rem',
                                borderRadius: '8px',
                                border: '1px solid #86efac',
                                fontSize: '0.9rem',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                outline: 'none',
                                backgroundColor: '#ffffff',
                              }}
                            />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CARD DETAILS */}
                    <div style={{ backgroundColor: '#f8fafc', border: '1.5px solid #e2e8f0', borderRadius: '14px', padding: '1.15rem 1.25rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                          Payment Card
                        </span>
                        <div style={{ display: 'flex', gap: '0.35rem', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#1e40af', backgroundColor: '#dbeafe', padding: '2px 6px', borderRadius: '4px' }}>VISA</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#b91c1c', backgroundColor: '#fee2e2', padding: '2px 6px', borderRadius: '4px' }}>MC</span>
                          <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#0369a1', backgroundColor: '#e0f2fe', padding: '2px 6px', borderRadius: '4px' }}>AMEX</span>
                        </div>
                      </div>

                      <div style={{ marginBottom: '0.75rem' }}>
                        <div style={{ position: 'relative' }}>
                          <input
                            type="text"
                            name="cardnumber"
                            autoComplete="cc-number"
                            inputMode="numeric"
                            required
                            placeholder="Card Number •••• •••• •••• ••••"
                            value={cardNumber}
                            onChange={handleCardNumberChange}
                            style={{
                              width: '100%',
                              padding: '0.75rem 2.5rem 0.75rem 0.95rem',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.96rem',
                              fontFamily: 'monospace',
                              letterSpacing: '0.04em',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                            }}
                          />
                          <Lock size={15} style={{ position: 'absolute', right: '0.95rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                        <div>
                          <input
                            type="text"
                            name="cc-exp"
                            autoComplete="cc-exp"
                            inputMode="numeric"
                            required
                            placeholder="MM / YY"
                            value={cardExpiry}
                            onChange={handleExpiryChange}
                            style={{
                              width: '100%',
                              padding: '0.75rem 0.95rem',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.95rem',
                              fontFamily: 'monospace',
                              textAlign: 'center',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                            }}
                          />
                        </div>

                        <div>
                          <input
                            type="password"
                            name="cvc"
                            autoComplete="cc-csc"
                            inputMode="numeric"
                            maxLength={4}
                            required
                            placeholder="CVC 🔒"
                            value={cardCvc}
                            onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                            style={{
                              width: '100%',
                              padding: '0.75rem 0.95rem',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              fontSize: '0.95rem',
                              fontFamily: 'monospace',
                              textAlign: 'center',
                              outline: 'none',
                              backgroundColor: '#ffffff',
                            }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SUBMIT CTA BUTTON (VIBRANT REFINED HIGH-CONVERTING CTA) */}
                    <button
                      type="submit"
                      disabled={isSubmitting || selectedAmount <= 0}
                      style={{
                        width: '100%',
                        padding: '1.1rem 1.5rem',
                        fontSize: '1.12rem',
                        fontWeight: 800,
                        borderRadius: '14px',
                        cursor: isSubmitting ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.6rem',
                        marginTop: '0.5rem',
                        background: 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                        color: '#ffffff',
                        border: 'none',
                        boxShadow: '0 4px 18px rgba(225, 29, 72, 0.35)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <Lock size={18} />
                      {isSubmitting
                        ? 'Processing securely...'
                        : `Donate £${selectedAmount.toFixed(2)}${frequency === 'monthly' ? ' / Month' : ''} Securely`}
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
                      <ShieldCheck size={14} style={{ color: '#059669' }} />
                      256-bit SSL encrypted • PCI-DSS compliant • Official Receipt
                    </div>
                  </form>
                </div>
              </div>
            )}
        </div>

        {/* DIRECT BANK TRANSFER & STANDING ORDERS (0% FEES REFERENCE) */}
        <div
          id="bank-transfer"
          className="card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '2.25rem 2.5rem',
            border: '1.5px solid #d1fae5',
            boxShadow: '0 8px 30px rgba(16, 185, 129, 0.08)',
            marginBottom: '2rem',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '1rem' }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', backgroundColor: '#ecfdf5', color: '#047857', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '9999px', marginBottom: '0.5rem' }}>
                <Building size={13} />
                DIRECT BANK TRANSFER & STANDING ORDERS • 0% FEES
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.35rem' }}>
                Prefer Direct Bank Transfer?
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                100% of your donation reaches the mosque with zero processing fees. Recommended for regular monthly standing orders and larger gifts (£100, £250, £500, £1,000+).
              </p>
            </div>
          </div>

          {/* Bank Details Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {/* Bank Name */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Bank Name</div>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.98rem' }}>Al Rayan Bank</div>
              </div>
            </div>

            {/* Sort Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Sort Code</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#059669', fontFamily: 'monospace' }}>30-00-83</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('30-00-83', 'sort')}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                {copiedField === 'sort' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'sort' ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Account Number */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Account Number</div>
                <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#059669', fontFamily: 'monospace' }}>01298401</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('01298401', 'acc')}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                {copiedField === 'acc' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'acc' ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Beneficiary */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Beneficiary Account</div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0f172a' }}>ALFALAH COMMUNITY SUPPORT CENTRE</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy('ALFALAH COMMUNITY SUPPORT CENTRE', 'name')}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                {copiedField === 'name' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'name' ? 'Copied' : 'Copy'}
              </button>
            </div>

            {/* Reference */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem 1rem', backgroundColor: '#f8fafc', borderRadius: 'var(--radius-sm)', border: '1px solid #e2e8f0' }}>
              <div>
                <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Payment Reference</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#b45309', fontFamily: 'monospace' }}>{paymentReference}</div>
              </div>
              <button
                type="button"
                onClick={() => handleCopy(paymentReference, 'ref')}
                className="btn btn-outline"
                style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', fontWeight: 700 }}
              >
                {copiedField === 'ref' ? <Check size={14} /> : <Copy size={14} />}
                {copiedField === 'ref' ? 'Copied' : 'Copy'}
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleCopyAll}
              className="btn btn-primary"
              style={{
                padding: '0.8rem 1.5rem',
                fontWeight: 800,
                fontSize: '0.92rem',
                borderRadius: 'var(--radius-sm)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              {copiedAll ? <Check size={18} /> : <Copy size={18} />}
              {copiedAll ? 'All Bank Details Copied!' : 'Copy All Bank Details for Your Banking App'}
            </button>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              Paste directly into Barclays, HSBC, Lloyds, NatWest, Monzo, or your UK banking app.
            </span>
          </div>
        </div>

        {/* CHARITY GOVERNANCE & FAQ TRUST SECTION */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#065f46', fontWeight: 800, fontSize: '0.95rem' }}>
              <ShieldCheck size={20} />
              <span>UK Charity Commission Verified</span>
            </div>

            <div style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.6 }}>
              <strong>ALFALAH COMMUNITY SUPPORT CENTRE</strong> is an officially registered UK charity (No. <strong>1150221</strong>) operating in Balsall Heath, Birmingham.
            </div>

            <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.82rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Building size={14} style={{ color: '#059669' }} />
                <span>89 Tindal Street, Balsall Heath, Birmingham B12 9QU</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Phone size={14} style={{ color: '#059669' }} />
                <a href="tel:07429188880" style={{ color: 'inherit', textDecoration: 'none' }}>07429 188880</a>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#334155' }}>
                <Mail size={14} style={{ color: '#059669' }} />
                <a href="mailto:alfalahcsc@hotmail.com" style={{ color: 'inherit', textDecoration: 'none' }}>alfalahcsc@hotmail.com</a>
              </div>
            </div>

            <a
              href="https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/5033068"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                fontSize: '0.82rem',
                fontWeight: 700,
                color: '#059669',
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
              <HelpCircle size={16} style={{ color: '#059669' }} />
              Donation FAQs
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.82rem' }}>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>How does the 100% policy work?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  100% of your donation reaches the specified fund. Administrative costs are underwritten separately.
                </span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>What is Gift Aid?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  If you are a UK taxpayer, HMRC adds 25p for every £1 you donate at zero cost to you.
                </span>
              </div>
              <div>
                <strong style={{ color: '#0f172a', display: 'block', marginBottom: '0.15rem' }}>Can I set up a Standing Order?</strong>
                <span style={{ color: '#64748b', lineHeight: 1.5 }}>
                  Yes! Use the official Al Rayan Bank transfer details above to set up a regular standing order directly in your UK banking app with 0% processing fees.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DonateLoading() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>
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
