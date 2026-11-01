'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  X,
  Calculator,
  Coins,
  ShieldCheck,
  HelpCircle,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface ZakatCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Current UK Nisab Benchmarks (Updated for 2026 UK Market Rates)
// Silver Nisab: 612.36g × ~£0.79/g = ~£485.00
// Gold Nisab: 87.48g × ~£68.00/g = ~£5,950.00
const SILVER_NISAB_GBP = 485;
const GOLD_NISAB_GBP = 5950;

export function ZakatCalculatorModal({ isOpen, onClose }: ZakatCalculatorModalProps) {
  const router = useRouter();
  const [nisabType, setNisabType] = useState<'silver' | 'gold'>('silver');
  const [showNisabInfo, setShowNisabInfo] = useState(false);

  // Asset inputs
  const [cashInBank, setCashInBank] = useState('');
  const [cashInHand, setCashInHand] = useState('');
  const [goldValue, setGoldValue] = useState('');
  const [silverValue, setSilverValue] = useState('');
  const [sharesInvestments, setSharesInvestments] = useState('');
  const [businessStock, setBusinessStock] = useState('');
  const [moneyOwedToYou, setMoneyOwedToYou] = useState('');

  // Liability inputs
  const [debtsDueNow, setDebtsDueNow] = useState('');
  const [billsDueNow, setBillsDueNow] = useState('');

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const parseNum = (val: string) => {
    const n = parseFloat(val);
    return isNaN(n) || n < 0 ? 0 : n;
  };

  // Calculations
  const totalCash = parseNum(cashInBank) + parseNum(cashInHand);
  const totalPreciousMetals = parseNum(goldValue) + parseNum(silverValue);
  const totalInvestments = parseNum(sharesInvestments) + parseNum(businessStock) + parseNum(moneyOwedToYou);
  const totalAssets = totalCash + totalPreciousMetals + totalInvestments;

  const totalLiabilities = parseNum(debtsDueNow) + parseNum(billsDueNow);
  const netZakatableWealth = Math.max(0, totalAssets - totalLiabilities);

  const currentNisab = nisabType === 'silver' ? SILVER_NISAB_GBP : GOLD_NISAB_GBP;
  const isEligible = netZakatableWealth >= currentNisab;

  // Zakat rate is strictly 2.5% (or 1/40th)
  const zakatDue = isEligible ? Math.round(netZakatableWealth * 0.025 * 100) / 100 : 0;

  const handleReset = () => {
    setCashInBank('');
    setCashInHand('');
    setGoldValue('');
    setSilverValue('');
    setSharesInvestments('');
    setBusinessStock('');
    setMoneyOwedToYou('');
    setDebtsDueNow('');
    setBillsDueNow('');
  };

  const handleProceedToDonate = () => {
    onClose();
    const amountParam = zakatDue > 0 ? `&amount=${zakatDue.toFixed(2)}` : '';
    router.push(`/donate?category=zakat${amountParam}`);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.65)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        animation: 'fadeIn 0.2s ease-out forwards',
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#ffffff',
          borderRadius: '24px',
          width: '100%',
          maxWidth: '820px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 25px 60px -15px rgba(15, 23, 42, 0.3)',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          animation: 'slideUp 0.25s ease-out forwards',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderBottom: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                backgroundColor: '#ecfdf5',
                color: '#065f46',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Calculator size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Al Falah Interactive Zakat Calculator
              </h2>
              <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.15rem' }}>
                Calculated strictly at 2.5% according to authentic Islamic jurisprudence (Fiqh)
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close Zakat Calculator"
            style={{
              background: '#ffffff',
              border: '1px solid #e2e8f0',
              borderRadius: '9999px',
              width: '36px',
              height: '36px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
              transition: 'all 0.15s ease',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Body */}
        <div
          style={{
            padding: '1.5rem 1.75rem',
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '1.5rem',
          }}
        >
          {/* Nisab Threshold Explanation Banner */}
          <div
            style={{
              backgroundColor: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '0.75rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46' }}>
                    Current UK Nisab Benchmark:
                  </span>
                  <span
                    style={{
                      backgroundColor: '#059669',
                      color: '#ffffff',
                      fontSize: '0.85rem',
                      fontWeight: 800,
                      padding: '0.2rem 0.65rem',
                      borderRadius: '9999px',
                      fontFamily: 'monospace',
                    }}
                  >
                    £{currentNisab.toLocaleString('en-GB', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#047857', marginTop: '0.25rem' }}>
                  {nisabType === 'silver'
                    ? 'Silver Standard (612.36g) — Recommended by UK Scholars & NZF to maximize benefit for the needy'
                    : 'Gold Standard (87.48g) — For those whose wealth is primarily held in gold bullion or jewelry'}
                </div>
              </div>

              {/* Nisab Selector Toggle */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div
                  style={{
                    display: 'flex',
                    backgroundColor: '#ffffff',
                    border: '1px solid #a7f3d0',
                    borderRadius: '8px',
                    padding: '2px',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setNisabType('silver')}
                    style={{
                      background: nisabType === 'silver' ? '#059669' : 'transparent',
                      color: nisabType === 'silver' ? '#ffffff' : '#065f46',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Silver (£{SILVER_NISAB_GBP})
                  </button>
                  <button
                    type="button"
                    onClick={() => setNisabType('gold')}
                    style={{
                      background: nisabType === 'gold' ? '#059669' : 'transparent',
                      color: nisabType === 'gold' ? '#ffffff' : '#065f46',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.35rem 0.75rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Gold (£{GOLD_NISAB_GBP.toLocaleString()})
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowNisabInfo(!showNisabInfo)}
                  aria-label="Why does Nisab change?"
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#047857',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0.2rem',
                  }}
                >
                  <HelpCircle size={18} />
                </button>
              </div>
            </div>

            {/* Why Nisab Changes Explanation Dropdown */}
            {showNisabInfo && (
              <div
                style={{
                  marginTop: '0.75rem',
                  paddingTop: '0.75rem',
                  borderTop: '1px dashed #86efac',
                  fontSize: '0.8rem',
                  color: '#064e3b',
                  lineHeight: 1.5,
                }}
              >
                <strong>Why does the Nisab change each year?</strong>
                <p style={{ margin: '0.25rem 0 0' }}>
                  In Islam, the Nisab is fixed by weight: <strong>612.36g of pure silver</strong> or{' '}
                  <strong>87.48g of pure gold</strong>. Because the price of precious metals in British Pounds (£)
                  fluctuates on the market, the monetary threshold changes every year and season. If your net wealth
                  equals or exceeds the Nisab and has been held for one lunar year (Hawl), 2.5% Zakat is obligatory.
                </p>
              </div>
            )}
          </div>

          {/* Form Sections Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {/* 1. Cash & Savings */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Coins size={18} style={{ color: '#059669' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  1. Cash & Bank Balances
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Cash in Bank Accounts (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={cashInBank}
                      onChange={(e) => setCashInBank(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Cash at Home & Foreign Currency (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={cashInHand}
                      onChange={(e) => setCashInHand(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Gold & Silver */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <TrendingUp size={18} style={{ color: '#d97706' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  2. Gold & Silver Assets
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Total Gold Value (£) (Coins, jewelry, bars)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={goldValue}
                      onChange={(e) => setGoldValue(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Total Silver Value (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={silverValue}
                      onChange={(e) => setSilverValue(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Investments & Trade Stock */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <Coins size={18} style={{ color: '#2563eb' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  3. Investments & Business
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Shares, Cryptos & Accessible ISAs (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={sharesInvestments}
                      onChange={(e) => setSharesInvestments(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Business Merchandise / Trade Inventory (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={businessStock}
                      onChange={(e) => setBusinessStock(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Money Owed to You (Strong Debts) (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={moneyOwedToYou}
                      onChange={(e) => setMoneyOwedToYou(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Deductible Liabilities */}
            <div
              style={{
                backgroundColor: '#ffffff',
                border: '1px solid #fecaca',
                borderRadius: '16px',
                padding: '1.25rem',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                <AlertCircle size={18} style={{ color: '#dc2626' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                  4. Deductible Liabilities
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Personal Debts Due Immediately (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={debtsDueNow}
                      onChange={(e) => setDebtsDueNow(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: '0.78rem', fontWeight: 600, color: '#475569', display: 'block', marginBottom: '0.3rem' }}>
                    Immediate Overdue Bills / This Month&apos;s Rent Due (£)
                  </label>
                  <div style={{ position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8', fontWeight: 600 }}>£</span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={billsDueNow}
                      onChange={(e) => setBillsDueNow(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.55rem 0.75rem 0.55rem 1.85rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        outline: 'none',
                      }}
                    />
                  </div>
                </div>

                <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4, marginTop: '0.2rem' }}>
                  * Note: Only subtract debts and bills due right now. Long-term loans (e.g. 20-year mortgage balance) are not deducted, only the current month&apos;s installment.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer / Calculation Summary */}
        <div
          style={{
            padding: '1.25rem 1.75rem',
            borderTop: '1px solid #e2e8f0',
            backgroundColor: '#f8fafc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          {/* Wealth breakdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Net Zakatable Wealth</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', fontFamily: 'monospace' }}>
                £{netZakatableWealth.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Nisab Status</div>
              {isEligible ? (
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#065f46',
                    fontSize: '0.75rem',
                    fontWeight: 800,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  <CheckCircle2 size={12} /> Zakat Obligatory
                </span>
              ) : (
                <span
                  style={{
                    backgroundColor: '#f1f5f9',
                    color: '#475569',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    padding: '0.2rem 0.55rem',
                    borderRadius: '9999px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  Below Nisab (No Zakat Due)
                </span>
              )}
            </div>

            <div style={{ borderLeft: '1px solid #cbd5e1', paddingLeft: '1.25rem' }}>
              <div style={{ fontSize: '0.75rem', color: '#047857', fontWeight: 700 }}>
                Zakat Payable (2.5%):
              </div>
              <div
                style={{
                  fontSize: '1.65rem',
                  fontWeight: 900,
                  color: isEligible ? '#059669' : '#64748b',
                  fontFamily: 'monospace',
                }}
              >
                £{zakatDue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleReset}
              className="btn btn-outline"
              style={{
                fontSize: '0.85rem',
                padding: '0.55rem 0.85rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
              }}
            >
              <RotateCcw size={14} /> Clear
            </button>

            <button
              type="button"
              onClick={handleProceedToDonate}
              disabled={zakatDue <= 0 && netZakatableWealth > 0 && !isEligible}
              style={{
                backgroundColor: isEligible ? '#059669' : '#0f172a',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                padding: '0.65rem 1.4rem',
                fontSize: '0.92rem',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
                boxShadow: isEligible ? '0 4px 14px rgba(5, 150, 105, 0.3)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <span>
                {zakatDue > 0
                  ? `Pay £${zakatDue.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Zakat Online`
                  : 'Pay Zakat al-Mal (100% Policy)'}
              </span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px) scale(0.98);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
      `}</style>
    </div>
  );
}
