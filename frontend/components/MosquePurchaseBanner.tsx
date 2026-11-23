'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ExternalLink,
  Copy,
  Check,
  Building,
  ShieldCheck,
  ArrowRight,
} from 'lucide-react';

const PLEDGE_TIERS = [
  {
    amount: 5000,
    label: 'First Row Prayer Mat',
    badge: 'FIRST ROW',
    theme: 'blue',
    href: '/donate?amount=5000&category=purchase',
  },
  {
    amount: 1000,
    label: 'Prayer Mat Pledge',
    badge: 'POPULAR',
    theme: 'amber',
    href: '/donate?amount=1000&category=purchase',
  },
  {
    amount: 500,
    label: 'Prayer Mat Pledge',
    badge: null,
    theme: 'default',
    href: '/donate?amount=500&category=purchase',
  },
  {
    amount: 250,
    label: 'Prayer Mat Pledge',
    badge: null,
    theme: 'default',
    href: '/donate?amount=250&category=purchase',
  },
];

export function MosquePurchaseBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyBank = () => {
    const text = `AL FALAH COMMUNITY SUPPORT CENTRE — Mosque Purchase Appeal
Bank: Al Rayan Bank
Account Name: AL FALAH COMMUNITY SUPPORT CENTRE
Sort Code: 30-00-83
Account Number: 01298401
Payment Reference: MOSQUE
UK Registered Charity #1150221`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section style={{ padding: '2.5rem 0 3.5rem', backgroundColor: '#FFFFFF' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            backgroundColor: '#FFFFFF',
            borderRadius: '20px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px -5px rgba(24, 51, 79, 0.07), 0 2px 8px rgba(0, 0, 0, 0.03)',
            overflow: 'hidden',
          }}
        >
          {/* Top Decorative Gradient Accent Bar */}
          <div
            style={{
              height: '4px',
              background: 'linear-gradient(90deg, #0284C7 0%, #38BDF8 50%, #0284C7 100%)',
              width: '100%',
            }}
          />

          <div
            className="banner-main-card"
            style={{
              padding: 'clamp(1.25rem, 3vw, 2.75rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
              gap: 'clamp(1.75rem, 3vw, 2.75rem)',
              alignItems: 'center',
              boxSizing: 'border-box',
            }}
          >
            {/* Left Column: Narrative, Interactive Pledge Tiers & CTAs */}
            <div>
              {/* Trust & Category Badges */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  flexWrap: 'wrap',
                  marginBottom: '0.85rem',
                }}
              >
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    backgroundColor: '#F0F9FF',
                    color: '#0369A1',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    border: '1px solid #BAE6FD',
                  }}
                >
                  Appeal: £600k Target
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#FFFFFF',
                    color: '#475569',
                    padding: '0.25rem 0.7rem',
                    borderRadius: '9999px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <ShieldCheck size={13} color="#0284C7" />
                  100% Donation Policy
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: 'clamp(1.4rem, 2.8vw, 2.2rem)',
                  fontWeight: 800,
                  color: '#0F172A',
                  marginBottom: '0.65rem',
                  lineHeight: 1.25,
                  letterSpacing: '-0.025em',
                }}
              >
                A Permanent House of Allah in Balsall Heath
              </h2>

              {/* Story */}
              <p
                style={{
                  fontSize: '0.94rem',
                  color: '#475569',
                  lineHeight: 1.6,
                  marginBottom: '1.25rem',
                }}
              >
                Our community at 89 Tindal Street has the historic opportunity to permanently purchase the building that houses our prayer halls, youth STEM lab, and classrooms. Every brick and prayer mat pledged secures ongoing worship for generations to come.
              </p>

              {/* Clean Pledge Tiers */}
              <div style={{ marginBottom: '1.25rem' }}>
                <div
                  style={{
                    fontSize: '0.74rem',
                    fontWeight: 800,
                    color: '#334155',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    marginBottom: '0.55rem',
                  }}
                >
                  Select a Dedicated Pledge Tier:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '0.55rem',
                  }}
                  className="pledge-grid-mobile"
                >
                  {PLEDGE_TIERS.map((tier) => (
                    <Link
                      key={tier.amount}
                      href={tier.href}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '0.75rem 0.45rem',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        textAlign: 'center',
                        backgroundColor: tier.theme === 'blue'
                          ? '#F0F9FF'
                          : tier.theme === 'amber'
                          ? '#FFFBEB'
                          : '#FFFFFF',
                        border: tier.theme === 'blue'
                          ? '2px solid #0284C7'
                          : tier.theme === 'amber'
                          ? '2px solid #F59E0B'
                          : '1.5px solid #E2E8F0',
                        boxShadow: tier.theme === 'blue'
                          ? '0 4px 14px rgba(2, 132, 199, 0.12)'
                          : tier.theme === 'amber'
                          ? '0 4px 14px rgba(245, 158, 11, 0.12)'
                          : '0 1px 3px rgba(0,0,0,0.03)',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                      }}
                    >
                      {/* Top Badge Slot (equal height alignment across all 4 cards) */}
                      <div style={{ height: '20px', display: 'flex', alignItems: 'center', marginBottom: '0.25rem' }}>
                        {tier.badge ? (
                          <span
                            style={{
                              fontSize: '0.58rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '9999px',
                              textTransform: 'uppercase',
                              letterSpacing: '0.4px',
                              backgroundColor: tier.theme === 'blue' ? '#0284C7' : '#F59E0B',
                              color: tier.theme === 'blue' ? '#FFFFFF' : '#0F172A',
                            }}
                          >
                            {tier.badge}
                          </span>
                        ) : (
                          <span style={{ visibility: 'hidden', fontSize: '0.58rem', padding: '2px 7px' }}>&nbsp;</span>
                        )}
                      </div>

                      {/* Amount */}
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 900,
                          fontFamily: 'system-ui, -apple-system, sans-serif',
                          fontVariantNumeric: 'tabular-nums',
                          lineHeight: 1.1,
                          color: tier.theme === 'blue'
                            ? '#0369A1'
                            : tier.theme === 'amber'
                            ? '#B45309'
                            : '#0F172A',
                          marginBottom: '0.25rem',
                          letterSpacing: '-0.01em',
                        }}
                      >
                        £{tier.amount.toLocaleString('en-GB')}
                      </div>

                      {/* Pray Mat Label */}
                      <div
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          color: tier.theme === 'blue'
                            ? '#0369A1'
                            : tier.theme === 'amber'
                            ? '#92400E'
                            : '#64748B',
                          lineHeight: 1.2,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {tier.label}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div
                className="banner-cta-group"
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                  gap: '0.65rem',
                  marginBottom: '1.25rem',
                }}
              >
                <Link
                  href="/donate?category=purchase"
                  className="btn btn-accent"
                  style={{
                    fontWeight: 800,
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.88rem',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    boxShadow: '0 4px 14px rgba(220, 38, 38, 0.22)',
                    textDecoration: 'none',
                  }}
                >
                  <Heart size={16} fill="currentColor" />
                  <span>Donate Custom Amount</span>
                </Link>

                <a
                  href="https://donate.mydona.com/al-falah-csc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    fontWeight: 700,
                    padding: '0.75rem 1.25rem',
                    fontSize: '0.86rem',
                    borderRadius: '10px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.45rem',
                    backgroundColor: '#FFFFFF',
                    borderColor: '#BAE6FD',
                    color: '#0369A1',
                    textDecoration: 'none',
                  }}
                >
                  <span>Donate via MyDona</span>
                  <ExternalLink size={14} />
                </a>
              </div>

              {/* Modern Bank Transfer Box */}
              <div
                className="banner-bank-box"
                style={{
                  backgroundColor: '#F8FAFC',
                  border: '1px solid #E2E8F0',
                  borderRadius: '14px',
                  padding: '0.9rem 1rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.65rem',
                }}
              >
                {/* Header row: Icon + Title + 0% fee badge + Copy Button */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#0284C7',
                      textTransform: 'uppercase',
                      letterSpacing: '0.3px',
                      flex: 1,
                      minWidth: 0,
                      overflow: 'hidden',
                    }}
                  >
                    <Building size={14} style={{ flexShrink: 0 }} />
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Bank Transfer · Al Rayan Bank
                    </span>
                    <span
                      style={{
                        backgroundColor: '#DCFCE7',
                        color: '#15803D',
                        fontSize: '0.62rem',
                        fontWeight: 800,
                        padding: '1px 6px',
                        borderRadius: '4px',
                        flexShrink: 0,
                        letterSpacing: '0.3px',
                      }}
                    >
                      0% Fee
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleCopyBank}
                    style={{
                      padding: '0.32rem 0.65rem',
                      backgroundColor: '#FFFFFF',
                      color: '#0F172A',
                      border: '1px solid #BAE6FD',
                      borderRadius: '7px',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.15s ease',
                    }}
                    aria-label="Copy Bank Transfer Details"
                  >
                    {copied ? <Check size={13} color="#059669" /> : <Copy size={13} />}
                    <span>{copied ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>

                {/* Details Card */}
                <div
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E2E8F0',
                    borderRadius: '10px',
                    padding: '0.7rem 0.85rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.55rem',
                  }}
                >
                  {/* Account Name — full width */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.63rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '1px' }}>
                      Beneficiary
                    </span>
                    <span style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0F172A', lineHeight: 1.3 }}>
                      AL FALAH COMMUNITY SUPPORT CENTRE
                    </span>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

                  {/* Sort Code + Account Number side-by-side */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.63rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '1px', whiteSpace: 'nowrap' }}>
                        Sort Code
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284C7', letterSpacing: '0.5px' }}>
                        30-00-83
                      </span>
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.63rem', color: '#94A3B8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '1px', whiteSpace: 'nowrap' }}>
                        Account No.
                      </span>
                      <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace', color: '#0284C7', letterSpacing: '0.5px' }}>
                        01298401
                      </span>
                    </div>
                  </div>

                  {/* Divider */}
                  <div style={{ height: '1px', backgroundColor: '#F1F5F9' }} />

                  {/* Reference */}
                  <div>
                    <span style={{ display: 'block', fontSize: '0.63rem', color: '#92400E', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.4px', marginBottom: '1px', whiteSpace: 'nowrap' }}>
                      Payment Reference
                    </span>
                    <span style={{ fontSize: '1rem', fontWeight: 900, fontFamily: 'monospace', color: '#B45309', letterSpacing: '0.5px' }}>
                      MOSQUE
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Visual High-Res Official Appeal Poster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '340px',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 12px 30px rgba(24, 51, 79, 0.1)',
                  border: '1.5px solid #E2E8F0',
                  backgroundColor: '#FFFFFF',
                }}
              >
                <a
                  href="/al-falah-leaflet.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  title="Click to view full official appeal flyer"
                  style={{ display: 'block', textDecoration: 'none' }}
                >
                  <img
                    src="/images/client-appeal.jpg"
                    alt="Masjid Al Falah Official £600,000 Mosque Purchase Appeal Poster"
                    style={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />

                  {/* Clean bottom ribbon */}
                  <div
                    style={{
                      padding: '0.65rem 0.95rem',
                      background: 'linear-gradient(135deg, #0C4A6E 0%, #0284C7 100%)',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: '0.66rem',
                          fontWeight: 800,
                          color: '#F59E0B',
                          textTransform: 'uppercase',
                          letterSpacing: '0.4px',
                        }}
                      >
                        Official Campaign Document
                      </div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#F0F7FE' }}>
                        89 Tindal St Freehold Purchase
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '0.25rem 0.55rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        color: '#FFFFFF',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                      }}
                    >
                      <span>Expand</span>
                      <ExternalLink size={12} />
                    </span>
                  </div>
                </a>
              </div>

              {/* Trust assurance micro-bullets */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '1.25rem',
                  flexWrap: 'wrap',
                  marginTop: '0.85rem',
                  fontSize: '0.75rem',
                  color: '#657B91',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="#0284C7" />
                  <span>UK Charity #1150221</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building size={14} color="#0284C7" />
                  <span>89 Tindal St, Birmingham</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 640px) {
          .pledge-grid-mobile {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .banner-main-card {
            padding: 1rem 0.75rem !important;
          }
          .banner-bank-box {
            padding: 0.7rem 0.75rem !important;
          }
          .banner-cta-group {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </section>
  );
}
