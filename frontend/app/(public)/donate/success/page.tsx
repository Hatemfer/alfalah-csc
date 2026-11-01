'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import {
  CheckCircle,
  Heart,
  ShieldCheck,
  Building,
  Printer,
  ArrowRight,
  Sparkles,
  Share2,
  Mail,
  Calendar,
  CreditCard,
  Coins,
} from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const isSimulated = searchParams.get('simulated') === 'true';
  const queryAmount = searchParams.get('amount');
  const queryCoverFee = searchParams.get('coverFee') === 'true';
  const queryFee = searchParams.get('fee');
  const queryFund = searchParams.get('fund') || 'purchase';
  const queryGiftAid = searchParams.get('giftAid') === 'true';
  const queryDonorName = searchParams.get('donorName');
  const queryFrequency = searchParams.get('frequency') || 'oneoff';

  const [receiptNumber, setReceiptNumber] = useState<string>('');
  const [timestamp, setTimestamp] = useState<string>('');
  const [stripeData, setStripeData] = useState<any>(null);

  useEffect(() => {
    const year = new Date().getFullYear();
    const seq = Math.floor(100000 + Math.random() * 900000);
    setReceiptNumber(sessionId ? `STRIPE-${sessionId.slice(-8).toUpperCase()}` : `ALF-${year}-${seq}`);
    setTimestamp(
      new Date().toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    );

    if (sessionId) {
      fetch(`/api/donations/session?session_id=${encodeURIComponent(sessionId)}`)
        .then((res) => (res.ok ? res.json() : null))
        .then((data) => {
          if (data && data.isConfigured) {
            setStripeData(data);
          }
        })
        .catch((err) => console.warn('Could not fetch Stripe session details:', err));
    }
  }, [sessionId]);

  const baseAmount = stripeData?.metadata?.baseAmount
    ? parseFloat(stripeData.metadata.baseAmount)
    : queryAmount
    ? parseFloat(queryAmount)
    : 50;

  const isGiftAid = stripeData?.metadata?.giftAid
    ? stripeData.metadata.giftAid === 'true'
    : queryGiftAid;

  const resolvedDonorName = stripeData?.customerName || queryDonorName;
  const resolvedFund = stripeData?.metadata?.fundId || queryFund;
  const resolvedFrequency = stripeData?.metadata?.frequency || queryFrequency;

  const feeAmount = queryCoverFee && queryFee ? parseFloat(queryFee) : (stripeData?.metadata?.feeAmount ? parseFloat(stripeData.metadata.feeAmount) : 0);
  const totalCharged = stripeData?.amountTotal || (baseAmount + feeAmount);
  const giftAidAmount = isGiftAid ? Math.round(baseAmount * 0.25 * 100) / 100 : 0;
  const totalBenefit = baseAmount + giftAidAmount;

  const fundLabels: Record<string, string> = {
    purchase: 'Mosque Purchase Appeal (89 Tindal St)',
    zakat: 'Zakat al-Mal (100% Policy)',
    sadaqah: 'General Sadaqah & Welfare',
    academy: 'Youth & Madrasah Education Lab',
  };

  const fundName = fundLabels[resolvedFund] || fundLabels.purchase;

  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', padding: '3.5rem 1.5rem 6rem' }}>
      <div className="container" style={{ maxWidth: '720px' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#ecfdf5',
              color: '#059669',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.25)',
              marginBottom: '1.25rem',
            }}
          >
            <CheckCircle size={40} />
          </div>

          <div
            style={{
              fontSize: '1.15rem',
              color: '#059669',
              fontWeight: 800,
              marginBottom: '0.35rem',
            }}
          >
            جَزَاكُمُ اللَّهُ خَيْرًا • JazakAllahu Khayran
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.8rem, 3.5vw, 2.4rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              margin: '0 0 0.5rem',
            }}
          >
            Thank You for Your Generous Donation!
          </h1>

          <p style={{ fontSize: '0.98rem', color: '#475569', lineHeight: 1.6, maxWidth: '580px', margin: '0 auto' }}>
            Your gift has been securely received. May Allah reward you abundantly and make it a continuous source of blessings (Sadaqah Jariyah) for you and your family.
          </p>

          {isSimulated && (
            <div
              style={{
                marginTop: '1rem',
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                fontSize: '0.78rem',
                fontWeight: 700,
              }}
            >
              Demo Preview Mode (Configure STRIPE_SECRET_KEY in .env.local for live processing)
            </div>
          )}
        </div>

        {/* Printable Official Charity Tax Receipt Card */}
        <div
          className="card"
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 12px 40px rgba(15, 23, 42, 0.08)',
            border: '1px solid #e2e8f0',
            padding: '2.5rem',
            marginBottom: '2rem',
          }}
        >
          {/* Charity Header */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '1rem',
              borderBottom: '2px solid #f1f5f9',
              paddingBottom: '1.5rem',
              marginBottom: '1.75rem',
            }}
          >
            <div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  backgroundColor: '#ecfdf5',
                  color: '#047857',
                  padding: '0.2rem 0.65rem',
                  borderRadius: '9999px',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginBottom: '0.4rem',
                }}
              >
                <ShieldCheck size={14} />
                OFFICIAL UK CHARITY RECEIPT
              </div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: '0 0 0.2rem' }}>
                Alfalah Community Support Centre
              </h2>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b', lineHeight: 1.4 }}>
                89 Tindal Street, Balsall Heath, Birmingham B12 9QU<br />
                UK Registered Charity No. <strong>1150221</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 700 }}>
                Receipt Reference
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#059669', letterSpacing: '0.5px' }}>
                {receiptNumber}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                {timestamp}
              </div>
            </div>
          </div>

          {/* Donation Financial Breakdown Table */}
          <div style={{ marginBottom: '1.75rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              Donation Summary
            </div>

            <div
              style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#475569' }}>Selected Cause:</span>
                <strong style={{ color: '#0f172a' }}>{fundName}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#475569' }}>Frequency:</span>
                <strong style={{ color: '#0f172a' }}>
                  {resolvedFrequency === 'monthly' ? 'Monthly Recurring' : 'One-Off Gift'}
                </strong>
              </div>

              {resolvedDonorName && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                  <span style={{ color: '#475569' }}>Donor Name:</span>
                  <strong style={{ color: '#0f172a' }}>{resolvedDonorName}</strong>
                </div>
              )}

              <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem', display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem' }}>
                <span style={{ color: '#475569' }}>Base Donation:</span>
                <strong style={{ color: '#0f172a' }}>£{baseAmount.toFixed(2)}</strong>
              </div>

              {queryCoverFee && feeAmount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#059669' }}>
                  <span>Card Processing Fee Contribution (100% Policy):</span>
                  <strong>+£{feeAmount.toFixed(2)}</strong>
                </div>
              )}

              <div
                style={{
                  borderTop: '2px dashed #cbd5e1',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  fontSize: '1.15rem',
                  fontWeight: 800,
                  color: '#0f172a',
                }}
              >
                <span>Total Amount Charged:</span>
                <span style={{ color: '#059669' }}>£{totalCharged.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Gift Aid Highlight Box (if claimed) */}
          {isGiftAid && (
            <div
              style={{
                backgroundColor: '#ecfdf5',
                border: '1.5px solid #a7f3d0',
                borderRadius: '16px',
                padding: '1.15rem 1.25rem',
                marginBottom: '1.75rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.75rem',
              }}
            >
              <Sparkles size={22} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#065f46', fontSize: '0.95rem' }}>
                  UK Gift Aid Claimed: +£{giftAidAmount.toFixed(2)} from HMRC
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#047857', lineHeight: 1.45 }}>
                  Because you declared Gift Aid, Masjid Al Falah will claim 25p on every £1 from HMRC at zero extra cost to you.
                  Total value received by the charity: <strong>£{totalBenefit.toFixed(2)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Verification & Audit Note */}
          <div
            style={{
              fontSize: '0.78rem',
              color: '#64748b',
              lineHeight: 1.5,
              borderTop: '1px solid #f1f5f9',
              paddingTop: '1.25rem',
            }}
          >
            Alfalah Community Support Centre is registered and audited under the UK Charities Act. For questions regarding your donation or tax receipts, email us at <a href="mailto:alfalahcsc@hotmail.com" style={{ color: '#059669', fontWeight: 700 }}>alfalahcsc@hotmail.com</a> or phone <a href="tel:07429188880" style={{ color: '#059669', fontWeight: 700 }}>07429 188880</a>.
          </div>
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <button
            type="button"
            onClick={() => window.print()}
            style={{
              padding: '0.85rem 1.5rem',
              borderRadius: '14px',
              backgroundColor: '#ffffff',
              color: '#0f172a',
              border: '1.5px solid #cbd5e1',
              fontWeight: 700,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            }}
          >
            <Printer size={17} /> Print Official Receipt
          </button>

          <Link
            href="/"
            style={{
              padding: '0.85rem 1.75rem',
              borderRadius: '14px',
              backgroundColor: '#059669',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(5, 150, 105, 0.3)',
            }}
          >
            Return to Homepage <ArrowRight size={17} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#065f46', marginBottom: '0.5rem' }}>
          Generating Donation Receipt...
        </div>
        <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
          Alfalah Community Support Centre • Charity #1150221
        </p>
      </div>
    </div>
  );
}

export default function DonationSuccessPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <SuccessContent />
    </Suspense>
  );
}
