'use client';

import React, { useState, useMemo } from 'react';
import {
  Heart,
  ShieldCheck,
  Building,
  Coins,
  GraduationCap,
  Sparkles,
  Lock,
  ArrowRight,
  Info,
  CheckCircle,
  HelpCircle,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { calculateFeeBreakdown } from '@/utils/stripeFee';

interface StripeDonationFormProps {
  initialAmount?: number;
  initialFrequency?: 'oneoff' | 'monthly';
  initialFund?: string;
  onSelectBankTransfer?: () => void;
}

const PRESET_AMOUNTS = [
  { amount: 25, label: '£25' },
  { amount: 50, label: '£50', popular: true },
  { amount: 100, label: '£100' },
  { amount: 250, label: '£250', tier: 'One Brick' },
  { amount: 500, label: '£500', tier: 'Single Mat' },
  { amount: 1000, label: '£1,000', tier: 'Double Mat' },
];

const GIVING_CAUSES = [
  {
    id: 'purchase',
    title: 'Mosque Purchase Appeal',
    desc: 'Sadaqah Jariyah for 89 Tindal St building (£600k target)',
    icon: Building,
  },
  {
    id: 'zakat',
    title: 'Zakat al-Mal (100% Policy)',
    desc: 'Strictly distributed directly to eligible needy families',
    icon: Coins,
  },
  {
    id: 'sadaqah',
    title: 'General Sadaqah & Welfare',
    desc: 'Mosque running costs, heating, utilities & community aid',
    icon: Heart,
  },
  {
    id: 'academy',
    title: 'Youth & Madrasah Education',
    desc: 'Children classes, Tajweed & Youth STEM electronics lab',
    icon: GraduationCap,
  },
];

export default function StripeDonationForm({
  initialAmount = 50,
  initialFrequency = 'oneoff',
  initialFund = 'purchase',
  onSelectBankTransfer,
}: StripeDonationFormProps) {
  const [frequency, setFrequency] = useState<'oneoff' | 'monthly'>(initialFrequency);
  const [selectedFund, setSelectedFund] = useState<string>(initialFund);
  const [selectedAmount, setSelectedAmount] = useState<number>(initialAmount);
  const [customAmount, setCustomAmount] = useState<string>('');

  // Fee Recovery Toggle (Default to true, as recommended for charity forms)
  const [coverFee, setCoverFee] = useState<boolean>(true);

  // UK Gift Aid Declaration State
  const [giftAid, setGiftAid] = useState<boolean>(false);
  const [donorName, setDonorName] = useState<string>('');
  const [donorEmail, setDonorEmail] = useState<string>('');
  const [donorPostcode, setDonorPostcode] = useState<string>('');
  const [donorAddress, setDonorAddress] = useState<string>('');

  // Form submission & error states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Determine current active amount
  const activeAmount = useMemo(() => {
    if (customAmount && customAmount.trim() !== '') {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) || parsed < 0 ? 0 : parsed;
    }
    return selectedAmount;
  }, [customAmount, selectedAmount]);

  // Compute exact fee breakdown
  const feeBreakdown = useMemo(() => {
    return calculateFeeBreakdown(activeAmount);
  }, [activeAmount]);

  const totalToCharge = coverFee ? feeBreakdown.totalAmount : feeBreakdown.baseAmount;

  // Handle Preset Selection
  const handleSelectPreset = (amt: number) => {
    setSelectedAmount(amt);
    setCustomAmount('');
    setErrorMessage(null);
  };

  // Handle Custom Amount Input
  const handleCustomChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomAmount(e.target.value);
    setErrorMessage(null);
  };

  // Submit Donation to Stripe Checkout
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (activeAmount < 1) {
      setErrorMessage('Please choose or enter a donation amount of at least £1.00.');
      return;
    }

    if (giftAid) {
      if (!donorName.trim()) {
        setErrorMessage('Please enter your full name for the HMRC Gift Aid declaration.');
        return;
      }
      if (!donorPostcode.trim()) {
        setErrorMessage('Please enter your UK postcode for the HMRC Gift Aid declaration.');
        return;
      }
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/donations/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: activeAmount,
          frequency,
          fundId: selectedFund,
          coverFee,
          feeAmount: feeBreakdown.feeAmount,
          giftAid,
          donorName: donorName.trim(),
          donorEmail: donorEmail.trim(),
          donorPostcode: donorPostcode.trim(),
          donorAddress: donorAddress.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.url) {
        throw new Error(data.error || 'Failed to initialize payment session. Please try again.');
      }

      // Redirect donor to Stripe Checkout (or simulated receipt)
      window.location.href = data.url;
    } catch (err: any) {
      console.error('Checkout error:', err);
      setErrorMessage(err.message || 'Something went wrong. Please check your connection and try again.');
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* 1. Frequency Selector (One-Off vs Monthly) */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.6rem',
          }}
        >
          1. Donation Frequency
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '0.65rem',
          }}
        >
          <button
            type="button"
            onClick={() => setFrequency('oneoff')}
            style={{
              padding: '0.9rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: frequency === 'oneoff' ? '#059669' : '#ffffff',
              color: frequency === 'oneoff' ? '#ffffff' : '#1e293b',
              border: frequency === 'oneoff' ? '2px solid #059669' : '1.5px solid #e2e8f0',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
              boxShadow: frequency === 'oneoff' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
            }}
          >
            <Heart size={16} fill={frequency === 'oneoff' ? 'currentColor' : 'none'} />
            One-Off Donation
          </button>

          <button
            type="button"
            onClick={() => setFrequency('monthly')}
            style={{
              padding: '0.9rem 1.25rem',
              borderRadius: '14px',
              backgroundColor: frequency === 'monthly' ? '#059669' : '#ffffff',
              color: frequency === 'monthly' ? '#ffffff' : '#1e293b',
              border: frequency === 'monthly' ? '2px solid #059669' : '1.5px solid #e2e8f0',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              transition: 'all 0.15s ease',
              boxShadow: frequency === 'monthly' ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
            }}
          >
            <RefreshCw size={16} />
            <span>Monthly Recurring</span>
            <span
              style={{
                fontSize: '0.68rem',
                backgroundColor: frequency === 'monthly' ? '#064e3b' : '#ecfdf5',
                color: frequency === 'monthly' ? '#a7f3d0' : '#047857',
                padding: '2px 7px',
                borderRadius: '9999px',
                fontWeight: 700,
              }}
            >
              Sadaqah Jariyah
            </span>
          </button>
        </div>
      </div>

      {/* 2. Giving Cause Selector */}
      <div>
        <label
          style={{
            display: 'block',
            fontSize: '0.82rem',
            fontWeight: 800,
            color: '#334155',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: '0.6rem',
          }}
        >
          2. Select Giving Cause
        </label>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '0.65rem',
          }}
        >
          {GIVING_CAUSES.map((cause) => {
            const Icon = cause.icon;
            const isSelected = selectedFund === cause.id;
            return (
              <button
                key={cause.id}
                type="button"
                onClick={() => setSelectedFund(cause.id)}
                style={{
                  padding: '0.9rem 1rem',
                  borderRadius: '14px',
                  backgroundColor: isSelected ? '#ecfdf5' : '#ffffff',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '0.75rem',
                  transition: 'all 0.15s ease',
                }}
              >
                <div
                  style={{
                    width: '34px',
                    height: '34px',
                    borderRadius: '10px',
                    backgroundColor: isSelected ? '#059669' : '#f1f5f9',
                    color: isSelected ? '#ffffff' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px',
                  }}
                >
                  <Icon size={18} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.88rem', color: isSelected ? '#065f46' : '#0f172a' }}>
                    {cause.title}
                  </div>
                  <div style={{ fontSize: '0.74rem', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                    {cause.desc}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Amount Presets & Custom Input */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
          <label
            style={{
              fontSize: '0.82rem',
              fontWeight: 800,
              color: '#334155',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
            }}
          >
            3. Choose Donation Amount
          </label>
          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
            Currency: <strong>GBP (£)</strong>
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
            gap: '0.55rem',
            marginBottom: '0.75rem',
          }}
        >
          {PRESET_AMOUNTS.map((p) => {
            const isSelected = !customAmount && selectedAmount === p.amount;
            return (
              <button
                key={p.amount}
                type="button"
                onClick={() => handleSelectPreset(p.amount)}
                style={{
                  padding: '0.75rem 0.5rem',
                  borderRadius: '12px',
                  backgroundColor: isSelected ? '#059669' : '#ffffff',
                  color: isSelected ? '#ffffff' : '#0f172a',
                  border: isSelected ? '2px solid #059669' : '1.5px solid #e2e8f0',
                  fontWeight: 800,
                  fontSize: '0.98rem',
                  cursor: 'pointer',
                  textAlign: 'center',
                  position: 'relative',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.2)' : 'none',
                }}
              >
                {p.popular && (
                  <span
                    style={{
                      position: 'absolute',
                      top: '-7px',
                      right: '8px',
                      backgroundColor: '#e11d48',
                      color: '#ffffff',
                      fontSize: '0.6rem',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '4px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.4px',
                    }}
                  >
                    Popular
                  </span>
                )}
                <div>{p.label}</div>
                {p.tier && (
                  <div
                    style={{
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: isSelected ? '#a7f3d0' : '#059669',
                      marginTop: '2px',
                    }}
                  >
                    {p.tier}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Amount Field */}
        <div style={{ position: 'relative' }}>
          <span
            style={{
              position: 'absolute',
              left: '1rem',
              top: '50%',
              transform: 'translateY(-50%)',
              fontWeight: 800,
              fontSize: '1.05rem',
              color: '#059669',
            }}
          >
            £
          </span>
          <input
            type="number"
            min="1"
            max="100000"
            step="any"
            placeholder="Or enter any custom amount (e.g. 35, 150, 1500)..."
            value={customAmount}
            onChange={handleCustomChange}
            style={{
              width: '100%',
              padding: '0.8rem 1rem 0.8rem 2.25rem',
              borderRadius: '12px',
              border: customAmount ? '2px solid #059669' : '1.5px solid #cbd5e1',
              fontSize: '0.95rem',
              fontWeight: 600,
              outline: 'none',
              backgroundColor: '#ffffff',
              boxShadow: customAmount ? '0 0 0 3px rgba(5, 150, 105, 0.1)' : 'none',
            }}
          />
        </div>
      </div>

      {/* 4. Optional Fee Recovery Toggle (Cover Transaction Fees) */}
      <div
        style={{
          backgroundColor: coverFee ? '#f0fdf4' : '#f8fafc',
          border: coverFee ? '1.5px solid #86efac' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.15rem 1.25rem',
          transition: 'all 0.15s ease',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={coverFee}
            onChange={(e) => setCoverFee(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              marginTop: '2px',
              accentColor: '#059669',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                I would like to add £{feeBreakdown.feeAmount.toFixed(2)} to cover card processing fees
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: '#dcfce7',
                  color: '#15803d',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                }}
              >
                100% Policy
              </span>
            </div>

            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
              By covering the card processing cost, <strong>100% of your £{activeAmount.toFixed(2)} donation</strong> goes directly into Masjid Al Falah's building and community fund.
            </p>

            <div
              style={{
                marginTop: '0.5rem',
                fontSize: '0.78rem',
                color: '#15803d',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <CheckCircle size={14} />
              {coverFee
                ? `Total to be charged: £${feeBreakdown.totalAmount.toFixed(2)} • Masjid receives exactly £${feeBreakdown.baseAmount.toFixed(2)}`
                : `Total to be charged: £${feeBreakdown.baseAmount.toFixed(2)} • (Masjid receives ~£${(feeBreakdown.baseAmount - feeBreakdown.feeAmount).toFixed(2)} after fees)`}
            </div>
          </div>
        </label>
      </div>

      {/* 5. UK Gift Aid Declaration (+25% Free from HMRC) */}
      <div
        style={{
          backgroundColor: giftAid ? '#ecfdf5' : '#ffffff',
          border: giftAid ? '1.5px solid #059669' : '1px solid #e2e8f0',
          borderRadius: '16px',
          padding: '1.25rem',
          transition: 'all 0.15s ease',
        }}
      >
        <label
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: '0.85rem',
            cursor: 'pointer',
            userSelect: 'none',
          }}
        >
          <input
            type="checkbox"
            checked={giftAid}
            onChange={(e) => setGiftAid(e.target.checked)}
            style={{
              width: '20px',
              height: '20px',
              marginTop: '2px',
              accentColor: '#059669',
              cursor: 'pointer',
              flexShrink: 0,
            }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                Boost my donation by 25% with UK Gift Aid
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  backgroundColor: '#059669',
                  color: '#ffffff',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                }}
              >
                +25% at £0 Cost
              </span>
            </div>

            <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#475569', lineHeight: 1.45 }}>
              If you are a UK taxpayer, HMRC adds <strong>25p for every £1</strong> you donate. A £{activeAmount.toFixed(2)} gift becomes <strong>£{feeBreakdown.totalWithGiftAid.toFixed(2)}</strong> for Masjid Al Falah.
            </p>
          </div>
        </label>

        {/* Expanded HMRC Declaration Fields */}
        {giftAid && (
          <div
            style={{
              marginTop: '1.25rem',
              paddingTop: '1.25rem',
              borderTop: '1px solid #d1fae5',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.85rem',
            }}
          >
            <div style={{ fontSize: '0.8rem', color: '#065f46', fontWeight: 700, lineHeight: 1.4 }}>
              HMRC requires your full name and UK home address to validate this declaration:
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mohammed Tariq Khan"
                  value={donorName}
                  onChange={(e) => setDonorName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                  UK Postcode *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. B12 9QU"
                  value={donorPostcode}
                  onChange={(e) => setDonorPostcode(e.target.value.toUpperCase())}
                  style={{
                    width: '100%',
                    padding: '0.65rem 0.85rem',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.88rem',
                    outline: 'none',
                    backgroundColor: '#ffffff',
                    textTransform: 'uppercase',
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#334155', marginBottom: '0.25rem' }}>
                Home Address (Street &amp; Town)
              </label>
              <input
                type="text"
                placeholder="e.g. 89 Tindal Street, Balsall Heath, Birmingham"
                value={donorAddress}
                onChange={(e) => setDonorAddress(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.88rem',
                  outline: 'none',
                  backgroundColor: '#ffffff',
                }}
              />
            </div>

            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #a7f3d0',
                borderRadius: '8px',
                padding: '0.75rem',
                fontSize: '0.73rem',
                color: '#475569',
                lineHeight: 1.45,
              }}
            >
              <strong>Declaration:</strong> I confirm I am a UK Income or Capital Gains taxpayer. I want Alfalah Community Support Centre (Charity #1150221) to treat all donations I make today and in the future as Gift Aid donations.
            </div>
          </div>
        )}
      </div>

      {/* Optional Donor Email for Automated Receipt */}
      <div>
        <label style={{ display: 'block', fontSize: '0.76rem', fontWeight: 700, color: '#475569', marginBottom: '0.35rem' }}>
          Email for Official Tax Receipt (Optional)
        </label>
        <input
          type="email"
          placeholder="your.email@example.com (receives instant PDF receipt)"
          value={donorEmail}
          onChange={(e) => setDonorEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '0.65rem 0.85rem',
            borderRadius: '10px',
            border: '1px solid #cbd5e1',
            fontSize: '0.88rem',
            outline: 'none',
            backgroundColor: '#ffffff',
          }}
        />
      </div>

      {/* Error Alert Banner */}
      {errorMessage && (
        <div
          style={{
            backgroundColor: '#fef2f2',
            border: '1.5px solid #fecaca',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            color: '#991b1b',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* 6. Checkout Summary & Submit Action */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
        <button
          type="submit"
          disabled={isLoading || activeAmount < 1}
          style={{
            width: '100%',
            padding: '1.1rem 1.5rem',
            borderRadius: '16px',
            backgroundColor: '#059669',
            color: '#ffffff',
            border: 'none',
            fontWeight: 800,
            fontSize: '1.05rem',
            cursor: isLoading || activeAmount < 1 ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.6rem',
            boxShadow: '0 8px 24px rgba(5, 150, 105, 0.35)',
            transition: 'all 0.15s ease',
            opacity: isLoading || activeAmount < 1 ? 0.7 : 1,
          }}
        >
          {isLoading ? (
            <>
              <RefreshCw size={20} className="animate-spin" />
              <span>Connecting to Secure Checkout...</span>
            </>
          ) : (
            <>
              <Lock size={18} />
              <span>
                Donate £{totalToCharge.toFixed(2)} {frequency === 'monthly' ? '/ Month' : ''} Securely
              </span>
              <ArrowRight size={18} />
            </>
          )}
        </button>

        {/* Security & Payment Badges */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            fontSize: '0.76rem',
            color: '#64748b',
            padding: '0.25rem 0.5rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <ShieldCheck size={16} style={{ color: '#059669' }} />
            <span>256-bit SSL Encrypted • Powered by <strong>Stripe</strong></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontWeight: 700, color: '#334155' }}>
            <span>Apple Pay</span>
            <span>•</span>
            <span>Google Pay</span>
            <span>•</span>
            <span>Visa &amp; Mastercard</span>
          </div>
        </div>
      </div>

      {/* Switch to Bank Transfer Option */}
      {onSelectBankTransfer && (
        <div
          style={{
            textAlign: 'center',
            paddingTop: '0.5rem',
            borderTop: '1px solid #f1f5f9',
          }}
        >
          <button
            type="button"
            onClick={onSelectBankTransfer}
            style={{
              background: 'none',
              border: 'none',
              color: '#059669',
              fontWeight: 700,
              fontSize: '0.84rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              textDecoration: 'underline',
            }}
          >
            <Building size={14} /> Prefer direct Al Rayan Bank transfer (0% fees)? Switch here &rarr;
          </button>
        </div>
      )}
    </form>
  );
}
