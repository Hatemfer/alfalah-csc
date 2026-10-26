'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShieldCheck,
  CheckCircle,
  Copy,
  Check,
  Building,
  CreditCard,
  ArrowRight,
  Sparkles,
  Users,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
} from 'lucide-react';

const APPEAL_TIERS = [
  {
    id: 'mat-full',
    label: 'One Full Prayer Mat',
    amount: 1000,
    desc: 'Sponsor a full prayer carpet space in the main congregation hall as continuous Sadaqah Jariyah.',
    icon: '🕌',
    popular: true,
  },
  {
    id: 'mat-half',
    label: 'Half Prayer Mat',
    amount: 500,
    desc: 'Contribute half a prayer space to secure our permanent house of Allah in Balsall Heath.',
    icon: '🕌',
  },
  {
    id: 'brick',
    label: 'One Brick',
    amount: 250,
    desc: 'Lay a spiritual brick towards purchasing our mosque building for future generations.',
    icon: '🧱',
  },
];

const GENERAL_AMOUNTS = [10, 25, 50, 100];

export default function DonatePage() {
  const [selectedTier, setSelectedTier] = useState<string>('brick');
  const [amount, setAmount] = useState<number>(250);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [frequency, setFrequency] = useState<'one-off' | 'monthly'>('one-off');
  const [giftAid, setGiftAid] = useState<boolean>(true);
  const [coverFee, setCoverFee] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'bank' | 'card' | 'in-person'>('bank');
  const [donorName, setDonorName] = useState('');
  const [donorEmail, setDonorEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [showPosterModal, setShowPosterModal] = useState(false);

  const baseAmount = customAmount ? parseFloat(customAmount) || 0 : amount;
  const processingFee = coverFee ? Number((baseAmount * 0.02).toFixed(2)) : 0;
  const finalDonorTotal = (baseAmount + processingFee).toFixed(2);
  const giftAidAmount = giftAid && baseAmount > 0 ? (baseAmount * 0.25).toFixed(2) : '0.00';
  const totalValueToMosque = giftAid && baseAmount > 0 ? (baseAmount * 1.25).toFixed(2) : baseAmount.toFixed(2);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleCardSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!donorName || !donorEmail || baseAmount <= 0) return;
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'Why are Direct Bank Transfers 0% Fee (100% to Mosque)?',
      a: 'When you transfer directly from your UK bank app (using Al Rayan Bank, Sort Code: 30-00-83, Account: 01298401), UK Faster Payments charges zero merchant processing fees. 100% of your donation reaches Masjid Al Falah immediately.',
    },
    {
      q: 'What is the £600,000 Urgent Mosque Purchase Appeal?',
      a: 'Masjid Al Falah currently operates from 89 Tindal Street. We have a time-limited opportunity to buy out the entire building so that it becomes our permanently owned Islamic Waqf, safeguarding daily prayers and youth Quranic education for generations to come.',
    },
    {
      q: 'How does UK Gift Aid increase my donation by 25%?',
      a: 'Because Alfalah Community Support Centre is a registered UK charity (#1150221), HMRC refunds 25p on every £1 donated by UK taxpayers at zero cost to you. For example, your £250 brick donation yields £312.50 to the mosque!',
    },
    {
      q: 'Can I pay my Zakat al-Mal towards this appeal?',
      a: 'Yes, we have a strictly segregated Zakat fund. Simply specify "ZAKAT" in your transfer reference, and it will be audited and allocated in 100% accordance with Shariah guidelines.',
    },
  ];

  return (
    <div style={{ paddingBottom: '5rem' }}>
      {/* Header Banner - Urgent Appeal & Lighter Palette */}
      <section
        style={{
          background: 'linear-gradient(135deg, #065f46 0%, #047857 50%, #0d9488 100%)',
          color: '#ffffff',
          padding: '4rem 1.5rem',
          textAlign: 'center',
          position: 'relative',
        }}
      >
        <div className="container" style={{ maxWidth: '880px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: '#dc2626',
              color: '#ffffff',
              padding: '0.4rem 1.1rem',
              borderRadius: '9999px',
              fontSize: '0.85rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              marginBottom: '1.25rem',
              boxShadow: '0 4px 14px rgba(220, 38, 38, 0.4)',
            }}
          >
            🚨 Urgent Appeal: Help Us Purchase Our Mosque
          </div>

          <h1
            style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.15,
              marginBottom: '1rem',
              color: '#ffffff',
            }}
          >
            A Permanent Home for Worship & Education
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.5rem', color: '#fef3c7', marginBottom: '1rem' }}>
            مَّن ذَا الَّذِي يُقْرِضُ اللَّهَ قَرْضًا حَسَنًا فَيُضَاعِفَهُ لَهُ
          </p>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#d1fae5',
              lineHeight: 1.6,
              maxWidth: '720px',
              margin: '0 auto 1.5rem',
            }}
          >
            Masjid Al Falah aims to purchase the building which is already our mosque at 89 Tindal Street, Balsall Heath. Every donation brings us closer to establishing a permanent house of Allah.
          </p>

          {/* Goal Highlight Pill */}
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '1rem',
              backgroundColor: 'rgba(0, 0, 0, 0.25)',
              backdropFilter: 'blur(10px)',
              padding: '0.75rem 1.5rem',
              borderRadius: 'var(--radius-lg)',
              border: '1.5px solid var(--color-accent-400)',
            }}
          >
            <div style={{ textAlign: 'left' }}>
              <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#fef3c7' }}>
                Our Fundraising Goal
              </span>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', lineHeight: 1.1 }}>
                £600,000
              </div>
            </div>
            <div style={{ height: '36px', width: '1px', backgroundColor: 'rgba(255,255,255,0.2)' }} />
            <div style={{ fontSize: '0.85rem', color: '#ecfdf5', maxWidth: '280px', textAlign: 'left' }}>
              &ldquo;Whoever builds a mosque for Allah, Allah will build for him a house in Paradise.&rdquo;
            </div>
          </div>
        </div>
      </section>

      {/* Main Container */}
      <div className="container" style={{ marginTop: '-2.5rem', position: 'relative', zIndex: 10, maxWidth: '1100px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2rem',
            alignItems: 'start',
          }}
        >
          {/* Left Column: Specific Appeal Tiers */}
          <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                1. Select Your Pledge Tier
              </h2>
              <span className="badge badge-gold" style={{ fontSize: '0.75rem' }}>
                Sadaqah Jariyah
              </span>
            </div>

            {/* Official Campaign Tiers */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {APPEAL_TIERS.map((tier) => {
                const isSelected = selectedTier === tier.id && !customAmount;
                return (
                  <div
                    key={tier.id}
                    onClick={() => {
                      setSelectedTier(tier.id);
                      setAmount(tier.amount);
                      setCustomAmount('');
                    }}
                    style={{
                      border: isSelected ? '2px solid var(--color-primary-600)' : '1px solid var(--border-color)',
                      backgroundColor: isSelected ? 'rgba(5, 150, 105, 0.06)' : 'var(--bg-surface)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem 1.25rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all var(--transition-fast)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                      <span style={{ fontSize: '1.8rem', lineHeight: 1 }}>{tier.icon}</span>
                      <div>
                        <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {tier.label}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                          {tier.desc}
                        </div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '0.75rem' }}>
                      <span style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                        £{tier.amount}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* General & Custom Amount Chips */}
            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                Or Contribute Any Amount (£ GBP):
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(65px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                {GENERAL_AMOUNTS.map((amt) => {
                  const isSelected = amount === amt && selectedTier === 'custom' && !customAmount;
                  return (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => {
                        setSelectedTier('custom');
                        setAmount(amt);
                        setCustomAmount('');
                      }}
                      style={{
                        padding: '0.75rem 0.5rem',
                        borderRadius: 'var(--radius-md)',
                        border: isSelected ? '2px solid var(--color-primary-600)' : '1px solid var(--border-color)',
                        backgroundColor: isSelected ? 'rgba(5, 150, 105, 0.1)' : 'var(--bg-surface-alt)',
                        color: isSelected ? 'var(--color-primary-700)' : 'var(--text-primary)',
                        fontWeight: 800,
                        fontSize: '1rem',
                        cursor: 'pointer',
                      }}
                    >
                      £{amt}
                    </button>
                  );
                })}
              </div>

              {/* Custom Input */}
              <div style={{ position: 'relative' }}>
                <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', fontWeight: 700, color: 'var(--text-muted)' }}>
                  £
                </span>
                <input
                  type="number"
                  min="1"
                  placeholder="Enter other custom amount (e.g. 5000)..."
                  value={customAmount}
                  onChange={(e) => {
                    setCustomAmount(e.target.value);
                    setSelectedTier('custom');
                  }}
                  className="form-input"
                  style={{ paddingLeft: '2.25rem', fontWeight: 600, fontSize: '0.95rem' }}
                />
              </div>
            </div>

            {/* UK Gift Aid (+25%) Box */}
            <div
              style={{
                backgroundColor: 'rgba(217, 119, 6, 0.08)',
                border: '1.5px solid var(--color-accent-400)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                marginBottom: '1.5rem',
              }}
            >
              <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={giftAid}
                  onChange={(e) => setGiftAid(e.target.checked)}
                  style={{ width: '18px', height: '18px', marginTop: '0.2rem', accentColor: 'var(--color-primary-600)' }}
                />
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-accent-700)' }}>
                    Add Gift Aid (+25% UK Tax Bonus at £0 cost to you)
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem', lineHeight: 1.45 }}>
                    I am a UK taxpayer. Reclaim 25p on every £1 from HMRC for Alfalah Community Support Centre (Charity #1150221).
                  </div>
                </div>
              </label>

              {giftAid && baseAmount > 0 && (
                <div
                  style={{
                    marginTop: '0.75rem',
                    paddingTop: '0.75rem',
                    borderTop: '1px dashed rgba(217, 119, 6, 0.3)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '0.85rem',
                  }}
                >
                  <span style={{ color: 'var(--text-secondary)' }}>HMRC Gift Aid Boost:</span>
                  <span style={{ fontWeight: 800, color: 'var(--color-primary-700)' }}>+£{giftAidAmount}</span>
                </div>
              )}
            </div>

            {/* Impact Value to Mosque */}
            <div
              style={{
                backgroundColor: 'var(--bg-surface-alt)',
                borderRadius: 'var(--radius-md)',
                padding: '1rem',
                border: '1px solid var(--border-color)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Total Benefit Received by Mosque:
                </span>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-primary-700)' }}>
                  £{totalValueToMosque}
                </div>
              </div>
              <span className="badge badge-primary" style={{ fontSize: '0.8rem' }}>
                Charity #1150221
              </span>
            </div>
          </div>

          {/* Right Column: 0% Fee Payment Options & Official Bank Details */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card" style={{ padding: '2rem', boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-primary)' }}>
                2. Select Giving Method
              </h2>

              {/* Tab Selector */}
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  borderBottom: '1px solid var(--border-color)',
                  marginBottom: '1.5rem',
                  paddingBottom: '0.5rem',
                }}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('bank')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'bank' ? 'var(--color-primary-600)' : 'transparent',
                    color: activeTab === 'bank' ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <Building size={16} /> Direct Bank Transfer (0% Fees)
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('card')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'card' ? 'var(--color-primary-600)' : 'transparent',
                    color: activeTab === 'card' ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <CreditCard size={16} /> Online Card
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('in-person')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.55rem 0.95rem',
                    borderRadius: 'var(--radius-md)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    backgroundColor: activeTab === 'in-person' ? 'var(--color-primary-600)' : 'transparent',
                    color: activeTab === 'in-person' ? '#ffffff' : 'var(--text-secondary)',
                  }}
                >
                  <Users size={16} /> In Person
                </button>
              </div>

              {/* TAB 1: DIRECT BANK TRANSFER (0% FEES - 100% RECEIVED) */}
              {activeTab === 'bank' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(5, 150, 105, 0.08)',
                      border: '2px solid var(--color-primary-600)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <span className="badge badge-primary" style={{ fontSize: '0.75rem', fontWeight: 800 }}>
                        ⭐ RECOMMENDED — 0% FEES
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: 'var(--text-primary)', fontWeight: 600, lineHeight: 1.5, marginBottom: '1rem' }}>
                      Transfer directly via your UK banking app (Barclays, Lloyds, Monzo, Al Rayan, etc.). <strong>100% of your money reaches the mosque with zero fees deducted!</strong>
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Bank Name:</span>
                        <strong>Al Rayan Bank</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Account Number (A/N):</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary-700)' }}>01298401</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy('01298401', 'acc')}
                            title="Copy Account Number"
                            className="btn btn-outline"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedField === 'acc' ? <Check size={12} /> : <Copy size={12} />} Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Sort Code:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <strong style={{ fontSize: '1.15rem', color: 'var(--color-primary-700)' }}>30-00-83</strong>
                          <button
                            type="button"
                            onClick={() => handleCopy('30-00-83', 'sort')}
                            title="Copy Sort Code"
                            className="btn btn-outline"
                            style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
                          >
                            {copiedField === 'sort' ? <Check size={12} /> : <Copy size={12} />} Copy
                          </button>
                        </div>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.4rem' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Account Name:</span>
                        <strong style={{ fontSize: '0.85rem' }}>ALFALAH COMMUNITY SUPPORT CENTRE</strong>
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ color: 'var(--text-muted)' }}>Payment Reference:</span>
                        <strong style={{ color: 'var(--color-accent-700)' }}>PURCHASE-MOSQUE</strong>
                      </div>
                    </div>
                  </div>

                  {/* Official Poster Teaser Card */}
                  <div
                    style={{
                      border: '1px solid var(--border-color)',
                      borderRadius: 'var(--radius-md)',
                      padding: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '1rem',
                      backgroundColor: 'var(--bg-surface-alt)',
                    }}
                  >
                    <div style={{ width: '60px', height: '80px', position: 'relative', borderRadius: '4px', overflow: 'hidden', flexShrink: 0 }}>
                      <Image
                        src="/images/client-appeal.jpg"
                        alt="Appeal Poster Preview"
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem' }}>Official Appeal Poster</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
                        View our £600,000 mosque purchase campaign leaflet.
                      </div>
                      <a
                        href="/images/client-appeal.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline"
                        style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                      >
                        <Download size={13} /> View Full Poster Flyer
                      </a>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: ONLINE CARD CHECKOUT WITH COVER FEE TOGGLE */}
              {activeTab === 'card' && (
                <div>
                  {submitted ? (
                    <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
                      <CheckCircle size={52} style={{ color: 'var(--color-primary-600)', margin: '0 auto 1rem' }} />
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        Jazakum Allahu Khairan!
                      </h3>
                      <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                        Thank you for pledging <strong>£{baseAmount}</strong> towards the purchase of Masjid Al Falah. A confirmation has been sent to <strong>{donorEmail}</strong>.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSubmitted(false);
                          setDonorName('');
                          setDonorEmail('');
                        }}
                        className="btn btn-outline"
                      >
                        Make Another Pledge
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleCardSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                          Donor Name *
                        </label>
                        <input
                          type="text"
                          required
                          value={donorName}
                          onChange={(e) => setDonorName(e.target.value)}
                          placeholder="Full Name"
                          className="form-input"
                        />
                      </div>

                      <div>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.4rem' }}>
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={donorEmail}
                          onChange={(e) => setDonorEmail(e.target.value)}
                          placeholder="donor@example.com"
                          className="form-input"
                        />
                      </div>

                      {/* Cover the 0% fee toggle */}
                      <div style={{ backgroundColor: 'var(--bg-surface-alt)', padding: '0.85rem', borderRadius: 'var(--radius-md)', border: '1px dashed var(--border-color)' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                          <input
                            type="checkbox"
                            checked={coverFee}
                            onChange={(e) => setCoverFee(e.target.checked)}
                            style={{ accentColor: 'var(--color-primary-600)' }}
                          />
                          <span>
                            <strong>Cover the 2% fee (+£{processingFee})</strong> so 100% of my £{baseAmount} reaches the mosque.
                          </span>
                        </label>
                      </div>

                      <button
                        type="submit"
                        disabled={baseAmount <= 0}
                        className="btn btn-accent"
                        style={{
                          padding: '0.95rem',
                          fontSize: '1.05rem',
                          fontWeight: 800,
                          width: '100%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                        }}
                      >
                        <Heart size={18} />
                        Confirm & Donate £{finalDonorTotal}
                      </button>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: IN PERSON */}
              {activeTab === 'in-person' && (
                <div style={{ backgroundColor: 'var(--bg-surface-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                    Visit Masjid Al Falah in Balsall Heath
                  </h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1rem' }}>
                    You can donate cash or use our contactless digital card terminal during daily prayers and Friday Jumu&apos;ah:
                  </p>
                  <p style={{ fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    📍 <strong>89 Tindal Street, Balsall Heath, Birmingham, B12 9QU</strong>
                  </p>
                  <Link href="/contact" className="btn btn-primary" style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>
                    View Mosque Map & Directions →
                  </Link>
                </div>
              )}
            </div>

            {/* Official Charity Commission Card */}
            <div className="card" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-surface)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <ShieldCheck size={26} style={{ color: 'var(--color-primary-600)' }} />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0 }}>Registered UK Charity #1150221</h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Regulated under the UK Charities Act</span>
                </div>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginBottom: '0.75rem' }}>
                All donations are audited, transparent, and dedicated strictly to the purchase and maintenance of Masjid Al Falah.
              </p>
              <a
                href="https://register-of-charities.charitycommission.gov.uk/charity-search/-/charity-details/5033068"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-primary-600)', textDecoration: 'underline' }}
              >
                Verify on UK Charity Commission Register ↗
              </a>
            </div>
          </div>
        </div>

        {/* FAQs Accordion */}
        <div style={{ marginTop: '4rem', maxWidth: '820px', margin: '4rem auto 0' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <span className="badge" style={{ marginBottom: '0.5rem' }}>Common Questions</span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 800 }}>Donations & Mosque Purchase FAQs</h2>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div
                  key={index}
                  className="card"
                  style={{
                    padding: '1.25rem',
                    border: '1px solid var(--border-color)',
                    cursor: 'pointer',
                    backgroundColor: 'var(--bg-surface)',
                  }}
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, margin: 0, color: 'var(--text-primary)' }}>
                      {faq.q}
                    </h3>
                    {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                  {isOpen && (
                    <p style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                      {faq.a}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
