'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Heart,
  ExternalLink,
  Target,
  Copy,
  Check,
  Building,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

const PLEDGE_TIERS = [
  {
    amount: 250,
    title: 'One Brick',
    subtitle: 'Foundational Sadaqah Jariyah',
    tag: 'Sadaqah Jariyah',
    href: '/donate?amount=250&category=purchase',
  },
  {
    amount: 500,
    title: 'One Prayer Mat',
    subtitle: 'Sponsor 1 Worshipper’s Space',
    tag: 'Community Impact',
    href: '/donate?amount=500&category=purchase',
  },
  {
    amount: 1000,
    title: 'Full Musalla Space',
    subtitle: 'Permanent House in Paradise',
    tag: 'Most Popular',
    featured: true,
    href: '/donate?amount=1000&category=purchase',
  },
];

export function MosquePurchaseBanner() {
  const [copied, setCopied] = useState(false);

  const handleCopyBank = () => {
    const text = `ALFALAH COMMUNITY SUPPORT CENTRE — Mosque Purchase Appeal
Bank: Al Rayan Bank
Sort Code: 30-00-83
Account Number: 01298401
Account Name: ALFALAH COMMUNITY SUPPORT CENTRE
Payment Reference: MOSQUE
UK Registered Charity #1150221`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <section style={{ padding: '3.5rem 0 4rem', backgroundColor: '#ffffff' }}>
      <div className="container">
        <div
          style={{
            position: 'relative',
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            border: '1px solid #e2e8f0',
            boxShadow: '0 20px 45px -12px rgba(6, 78, 59, 0.09), 0 4px 16px rgba(0, 0, 0, 0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Top Decorative Gradient Accent Bar */}
          <div
            style={{
              height: '5px',
              background: 'linear-gradient(90deg, #059669 0%, #10b981 40%, #f59e0b 80%, #d97706 100%)',
              width: '100%',
            }}
          />

          <div
            style={{
              padding: 'clamp(1.75rem, 4vw, 3rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 360px), 1fr))',
              gap: '2.5rem',
              alignItems: 'center',
            }}
          >
            {/* Left Column: Narrative, Interactive Pledge Tiers & CTAs */}
            <div>
              {/* Badges Row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '9999px',
                    fontSize: '0.76rem',
                    fontWeight: 800,
                    letterSpacing: '0.4px',
                    border: '1px solid #a7f3d0',
                  }}
                >
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', backgroundColor: '#059669' }} />
                  URGENT COMMUNITY APPEAL • TARGET £600K
                </span>

                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    backgroundColor: '#f8fafc',
                    color: '#475569',
                    padding: '0.35rem 0.75rem',
                    borderRadius: '9999px',
                    fontSize: '0.74rem',
                    fontWeight: 700,
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <ShieldCheck size={14} color="#059669" />
                  100% Donation Policy
                </span>
              </div>

              {/* Headline */}
              <h2
                style={{
                  fontSize: 'clamp(1.9rem, 3.6vw, 2.5rem)',
                  fontWeight: 800,
                  color: '#0f172a',
                  marginBottom: '0.75rem',
                  lineHeight: 1.2,
                  letterSpacing: '-0.025em',
                }}
              >
                A Permanent House of Allah in Balsall Heath
              </h2>

              {/* Subtitle / Story */}
              <p
                style={{
                  fontSize: '1rem',
                  color: '#475569',
                  lineHeight: 1.65,
                  marginBottom: '1.5rem',
                }}
              >
                Our community at 89 Tindal Street has the historic opportunity to permanently purchase the building that houses our prayer halls, youth STEM lab, and classrooms. Every brick and prayer mat pledged secures ongoing worship for generations to come.
              </p>

              {/* Interactive 3-Tier Giving Grid */}
              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.65rem' }}>
                  Select a Dedicated Pledge Tier:
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {PLEDGE_TIERS.map((tier) => (
                    <Link
                      key={tier.amount}
                      href={tier.href}
                      style={{
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        padding: '1rem 0.85rem',
                        backgroundColor: tier.featured ? '#fffbeb' : '#f8fafc',
                        border: tier.featured ? '2px solid #f59e0b' : '1.5px solid #e2e8f0',
                        borderRadius: '14px',
                        textDecoration: 'none',
                        transition: 'all 0.15s ease',
                        boxShadow: tier.featured ? '0 4px 14px rgba(245, 158, 11, 0.12)' : 'none',
                      }}
                    >
                      {tier.featured && (
                        <span
                          style={{
                            position: 'absolute',
                            top: '-9px',
                            right: '10px',
                            backgroundColor: '#f59e0b',
                            color: '#0f172a',
                            fontSize: '0.65rem',
                            fontWeight: 800,
                            padding: '1px 7px',
                            borderRadius: '9999px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.3px',
                          }}
                        >
                          Featured
                        </span>
                      )}

                      <div>
                        <div style={{ fontSize: '0.72rem', fontWeight: 700, color: tier.featured ? '#92400e' : '#64748b' }}>
                          {tier.title}
                        </div>
                        <div
                          style={{
                            fontSize: '1.4rem',
                            fontWeight: 900,
                            color: tier.featured ? '#b45309' : '#059669',
                            fontFamily: 'monospace',
                            margin: '0.2rem 0',
                          }}
                        >
                          £{tier.amount}
                        </div>
                      </div>

                      <div
                        style={{
                          fontSize: '0.72rem',
                          color: '#475569',
                          lineHeight: 1.25,
                          marginTop: '0.35rem',
                          borderTop: '1px dashed #cbd5e1',
                          paddingTop: '0.4rem',
                        }}
                      >
                        {tier.subtitle}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Main Action Buttons */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.85rem',
                  flexWrap: 'wrap',
                  marginBottom: '1.5rem',
                }}
              >
                <Link
                  href="/donate?category=purchase"
                  className="btn btn-accent"
                  style={{
                    fontWeight: 800,
                    padding: '0.85rem 1.65rem',
                    fontSize: '0.98rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    borderRadius: '12px',
                    boxShadow: '0 4px 14px rgba(185, 28, 28, 0.25)',
                  }}
                >
                  <Heart size={18} fill="currentColor" />
                  <span>Donate Custom Amount</span>
                </Link>

                <a
                  href="https://donate.mydona.com/al-falah-csc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline"
                  style={{
                    fontWeight: 700,
                    padding: '0.85rem 1.35rem',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    borderRadius: '12px',
                  }}
                >
                  <span>Donate via MyDona</span>
                  <ExternalLink size={15} />
                </a>
              </div>

              {/* Modern Bank Transfer Bar with 1-Click Copy */}
              <div
                style={{
                  backgroundColor: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '14px',
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <div
                    style={{
                      width: '34px',
                      height: '34px',
                      borderRadius: '8px',
                      backgroundColor: '#ecfdf5',
                      color: '#059669',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Building size={18} />
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                      Bank Transfer (0% Fee) • Al Rayan Bank
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', marginTop: '0.1rem' }}>
                      Sort Code: <span style={{ fontFamily: 'monospace', color: '#059669' }}>30-00-83</span> • Account: <span style={{ fontFamily: 'monospace', color: '#059669' }}>01298401</span> • Ref: <span style={{ fontFamily: 'monospace', color: '#b45309' }}>MOSQUE</span>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleCopyBank}
                  style={{
                    padding: '0.5rem 0.85rem',
                    backgroundColor: copied ? '#059669' : '#ffffff',
                    color: copied ? '#ffffff' : '#334155',
                    border: copied ? '1px solid #059669' : '1px solid #cbd5e1',
                    borderRadius: '8px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    transition: 'all 0.15s ease',
                    flexShrink: 0,
                  }}
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                  <span>{copied ? 'Copied!' : 'Copy Bank Details'}</span>
                </button>
              </div>
            </div>

            {/* Right Column: Visual High-Res Official Appeal Poster */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '380px',
                  borderRadius: '18px',
                  overflow: 'hidden',
                  boxShadow: '0 14px 35px rgba(15, 23, 42, 0.14)',
                  border: '1.5px solid #e2e8f0',
                  backgroundColor: '#ffffff',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                <a
                  href="/images/client-appeal.jpg"
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
                      padding: '0.85rem 1rem',
                      background: 'linear-gradient(180deg, #064e3b 0%, #065f46 100%)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '0.5rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#f59e0b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        Official Campaign Document
                      </div>
                      <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#f0fdf4' }}>
                        89 Tindal St Freehold Purchase
                      </div>
                    </div>

                    <span
                      style={{
                        padding: '0.35rem 0.65rem',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderRadius: '6px',
                        fontSize: '0.74rem',
                        fontWeight: 700,
                        color: '#ffffff',
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
                  marginTop: '1rem',
                  fontSize: '0.78rem',
                  color: '#64748b',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <ShieldCheck size={14} color="#059669" />
                  <span>UK Charity #1150221</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <Building size={14} color="#059669" />
                  <span>89 Tindal St, Birmingham</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
