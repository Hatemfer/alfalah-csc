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
    <div className="receipt-page-container">
      <div className="container" style={{ maxWidth: '680px', margin: '0 auto' }}>
        {/* Success Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: '#e0f2fe',
              color: '#0284c7',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 24px rgba(5, 150, 105, 0.22)',
              marginBottom: '1rem',
            }}
          >
            <CheckCircle size={34} />
          </div>

          <div
            style={{
              fontSize: 'clamp(0.95rem, 2.8vw, 1.15rem)',
              color: '#0284c7',
              fontWeight: 800,
              marginBottom: '0.35rem',
            }}
          >
            جَزَاكُمُ اللَّهُ خَيْرًا • JazakAllahu Khayran
          </div>

          <h1
            style={{
              fontSize: 'clamp(1.4rem, 4vw, 2.2rem)',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.02em',
              lineHeight: 1.25,
              margin: '0 0 0.45rem',
            }}
          >
            Thank You for Your Generous Donation!
          </h1>

          <p style={{ fontSize: '0.88rem', color: '#475569', lineHeight: 1.55, maxWidth: '560px', margin: '0 auto' }}>
            Your gift has been securely received. May Allah reward you abundantly and make it a continuous source of blessings (Sadaqah Jariyah) for you and your family.
          </p>

          {isSimulated && (
            <div
              style={{
                marginTop: '0.85rem',
                display: 'inline-block',
                backgroundColor: '#fef3c7',
                border: '1px solid #fde68a',
                color: '#92400e',
                padding: '0.3rem 0.8rem',
                borderRadius: '9999px',
                fontSize: '0.74rem',
                fontWeight: 700,
              }}
            >
              Demo Preview Mode • Test Receipt
            </div>
          )}
        </div>

        {/* Printable Official Charity Tax Receipt Card */}
        <div className="card receipt-card print-receipt-card">
          {/* Charity Header */}
          <div className="receipt-header">
            <div>
              <div className="receipt-badge">
                <ShieldCheck size={14} />
                <span>OFFICIAL UK CHARITY RECEIPT</span>
              </div>
              <h2 className="receipt-org-title">
                Alfalah Community Support Centre
              </h2>
              <p className="receipt-org-address">
                89 Tindal Street, Balsall Heath, Birmingham B12 9QU<br />
                UK Registered Charity No. <strong>1150221</strong>
              </p>
            </div>

            {/* Dedicated Reference Banner */}
            <div className="receipt-ref-banner">
              <div>
                <span className="receipt-ref-label">RECEIPT REFERENCE</span>
                <span className="receipt-ref-code">{receiptNumber}</span>
              </div>
              <div className="receipt-ref-date">
                {timestamp}
              </div>
            </div>
          </div>

          {/* Donation Financial Breakdown Table */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div
              style={{
                fontSize: '0.8rem',
                fontWeight: 800,
                color: '#334155',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                marginBottom: '0.65rem',
              }}
            >
              Donation Summary
            </div>

            <div className="receipt-summary-box">
              {/* Stacked Cause: Full width, never wraps awkwardly into single words */}
              <div className="receipt-row-stacked">
                <span className="receipt-row-label">Selected Cause</span>
                <span className="receipt-row-val">{fundName}</span>
              </div>

              {/* Frequency */}
              <div className="receipt-row" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                <span className="receipt-row-label">Frequency</span>
                <span className="receipt-row-val">
                  {resolvedFrequency === 'monthly' ? 'Monthly Recurring' : 'One-Off Gift'}
                </span>
              </div>

              {/* Donor Name if provided */}
              {resolvedDonorName && (
                <div className="receipt-row" style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.65rem' }}>
                  <span className="receipt-row-label">Donor Name</span>
                  <span className="receipt-row-val">{resolvedDonorName}</span>
                </div>
              )}

              {/* Base Donation */}
              <div className="receipt-row" style={{ borderTop: '1px solid #e2e8f0', paddingTop: '0.65rem' }}>
                <span className="receipt-row-label">Base Donation</span>
                <span className="receipt-row-val">£{baseAmount.toFixed(2)}</span>
              </div>

              {/* Fee Coverage */}
              {queryCoverFee && feeAmount > 0 && (
                <div className="receipt-row" style={{ color: '#0284c7' }}>
                  <span className="receipt-row-label" style={{ color: '#0284c7' }}>
                    Card Processing Fee Covered
                  </span>
                  <span className="receipt-row-val" style={{ color: '#0284c7' }}>
                    +£{feeAmount.toFixed(2)}
                  </span>
                </div>
              )}

              {/* Total Charged */}
              <div className="receipt-total-row">
                <span className="receipt-total-label">Total Amount Charged:</span>
                <span className="receipt-total-val">£{totalCharged.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Gift Aid Highlight Box (if claimed) */}
          {isGiftAid && (
            <div
              style={{
                backgroundColor: '#e0f2fe',
                border: '1.5px solid #bae6fd',
                borderRadius: '14px',
                padding: '0.9rem 1rem',
                marginBottom: '1.5rem',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.65rem',
              }}
            >
              <Sparkles size={20} style={{ color: '#0284c7', flexShrink: 0, marginTop: '2px' }} />
              <div>
                <div style={{ fontWeight: 800, color: '#0369a1', fontSize: '0.9rem' }}>
                  UK Gift Aid Claimed: +£{giftAidAmount.toFixed(2)} from HMRC
                </div>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#0284c7', lineHeight: 1.45 }}>
                  Because you declared Gift Aid, Masjid Al Falah will claim 25p on every £1 from HMRC at zero extra cost to you. Total charity benefit: <strong>£{totalBenefit.toFixed(2)}</strong>.
                </p>
              </div>
            </div>
          )}

          {/* Verification & Audit Note */}
          <div
            style={{
              fontSize: '0.75rem',
              color: '#64748b',
              lineHeight: 1.5,
              borderTop: '1px solid #f1f5f9',
              paddingTop: '1rem',
            }}
          >
            Alfalah Community Support Centre is registered and audited under the UK Charities Act. For questions regarding your donation or tax receipts, email us at{' '}
            <a href="mailto:alfalahcsc@hotmail.com" style={{ color: '#0284c7', fontWeight: 700, wordBreak: 'break-all' }}>
              alfalahcsc@hotmail.com
            </a>{' '}
            or phone{' '}
            <a href="tel:07429188880" style={{ color: '#0284c7', fontWeight: 700, whiteSpace: 'nowrap' }}>
              07429 188880
            </a>.
          </div>
        </div>

        {/* Action Buttons */}
        <div className="receipt-actions no-print">
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
              justifyContent: 'center',
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
              backgroundColor: '#0284c7',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.92rem',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
              boxShadow: '0 4px 14px rgba(2, 132, 199, 0.3)',
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
        <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1', marginBottom: '0.5rem' }}>
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
