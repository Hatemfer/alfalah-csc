'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck,
  ExternalLink,
  RefreshCw,
  AlertTriangle,
  Building,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ZeffyEmbedProps {
  formUrl?: string;
  onSelectBankTransfer?: () => void;
}

export default function ZeffyEmbed({ formUrl: customFormUrl, onSelectBankTransfer }: ZeffyEmbedProps) {
  // Determine final embed URL from props, env, or verified default
  const envFormUrl = process.env.NEXT_PUBLIC_ZEFFY_DONATION_URL;
  const rawFormUrl =
    customFormUrl ||
    envFormUrl ||
    'https://www.zeffy.com/en-GB/embed/donation-form/alfalah-community-support-centre';

  // Ensure URL is correctly formatted for embedding
  const embedUrl = rawFormUrl.includes('/embed/')
    ? rawFormUrl
    : rawFormUrl.replace('/donation-form/', '/embed/donation-form/');

  // Direct hosted URL for fallback open-in-new-tab
  const hostedUrl = embedUrl.replace('/embed/', '/');

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [iframeHeight, setIframeHeight] = useState<number>(750);
  const [showAdminHelp, setShowAdminHelp] = useState(false);
  const [isTimedOut, setIsTimedOut] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Safety timeout: if iframe hasn't signaled load within 9 seconds, show fallback helper
  useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setIsTimedOut(true);
      }
    }, 9000);
    return () => clearTimeout(timer);
  }, [isLoading]);

  // Listen for Zeffy cross-origin auto-resize postMessage events
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (!event.origin.includes('zeffy.com')) return;

      try {
        const data = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        // Zeffy sends message with height when form dimensions change
        if (data && (data.height || data.type === 'zeffy-resize')) {
          const newHeight = Number(data.height);
          if (!isNaN(newHeight) && newHeight > 400 && newHeight < 2500) {
            setIframeHeight(newHeight + 20); // add padding buffer
            setIsLoading(false);
            setLoadError(false);
          }
        }
      } catch {
        // Non-JSON message from other extensions or analytics, safely ignore
      }
    }

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Inject official Zeffy embed script for automatic iframe management
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const scriptId = 'zeffy-embed-js';
    if (!document.getElementById(scriptId)) {
      const script = document.createElement('script');
      script.id = scriptId;
      script.src = 'https://www.zeffy.com/javascripts/zeffy-embed.js';
      script.async = true;
      script.onerror = () => {
        // Script blocked or offline, iframe fallback is active
        console.warn('Zeffy auto-resizer script could not be loaded; relying on responsive iframe container.');
      };
      document.body.appendChild(script);
    }
  }, []);

  const handleIframeLoad = () => {
    setIsLoading(false);
    setLoadError(false);
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setLoadError(true);
  };

  const handleRetry = () => {
    setIsLoading(true);
    setLoadError(false);
    setIsTimedOut(false);
    if (iframeRef.current) {
      iframeRef.current.src = embedUrl;
    }
  };

  return (
    <div style={{ width: '100%', position: 'relative' }}>
      {/* 1. Value Proposition Banner (0% Fees, UK Gift Aid, One-Off & Monthly) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '0.75rem',
          backgroundColor: '#f0fdf4',
          border: '1px solid #bae6fd',
          borderRadius: '16px',
          padding: '0.9rem 1.15rem',
          marginBottom: '1.5rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0369a1' }}>
              100% Free for Mosque
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0284c7' }}>
              0% platform & card fees deducted
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <ShieldCheck size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0369a1' }}>
              UK Gift Aid Included
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0284c7' }}>
              +25% HMRC free tax reclaim
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem' }}>
          <div
            style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              backgroundColor: '#0284c7',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <RefreshCw size={15} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0369a1' }}>
              Single & Monthly Giving
            </div>
            <div style={{ fontSize: '0.74rem', color: '#0284c7' }}>
              Custom & preset amounts supported
            </div>
          </div>
        </div>
      </div>

      {/* 2. Loading Skeleton State */}
      {isLoading && (
        <div
          role="status"
          aria-live="polite"
          style={{
            minHeight: '480px',
            backgroundColor: '#f8fafc',
            border: '1.5px dashed #cbd5e1',
            borderRadius: '16px',
            padding: '2.5rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: '1rem',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              border: '3px solid #d1fae5',
              borderTopColor: '#0284c7',
              animation: 'spin 0.9s linear infinite',
            }}
          />
          <style>{`
            @keyframes spin {
              to { transform: rotate(360deg); }
            }
          `}</style>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', color: '#0f172a', marginBottom: '0.25rem' }}>
              Loading Secure Donation Form...
            </div>
            <p style={{ fontSize: '0.85rem', color: '#64748b', maxWidth: '420px', margin: '0 auto' }}>
              Connecting directly to Zeffy’s 100% fee-free donation engine. Official UK Charity #1150221.
            </p>
          </div>
        </div>
      )}

      {/* 3. Timeout / Error Fallback Notice (if external iframe is blocked by browser) */}
      {(loadError || isTimedOut) && (
        <div
          style={{
            backgroundColor: '#fffbeb',
            border: '1.5px solid #fde68a',
            borderRadius: '14px',
            padding: '1.25rem 1.5rem',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#92400e', fontWeight: 800, fontSize: '0.92rem' }}>
            <AlertTriangle size={18} />
            <span>Having trouble loading the embedded form?</span>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#78350f', margin: 0, lineHeight: 1.5 }}>
            Some privacy extensions or strict browser tracking settings prevent embedded checkout frames from loading directly. You can complete your donation directly on the official Zeffy platform, or use our direct UK bank transfer option below.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
            <a
              href={hostedUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                padding: '0.65rem 1.15rem',
                borderRadius: '8px',
                fontWeight: 700,
                fontSize: '0.85rem',
                textDecoration: 'none',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.45rem',
              }}
            >
              Open Form on Zeffy <ExternalLink size={14} />
            </a>

            {onSelectBankTransfer && (
              <button
                type="button"
                onClick={onSelectBankTransfer}
                style={{
                  backgroundColor: '#ffffff',
                  color: '#0369a1',
                  border: '1.5px solid #0284c7',
                  padding: '0.65rem 1.15rem',
                  borderRadius: '8px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                }}
              >
                <Building size={14} /> Use Direct Bank Transfer (0% Fees)
              </button>
            )}

            <button
              type="button"
              onClick={handleRetry}
              style={{
                backgroundColor: 'transparent',
                color: '#64748b',
                border: '1px solid #cbd5e1',
                padding: '0.65rem 0.95rem',
                borderRadius: '8px',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      {/* 4. Official Zeffy Iframe Embed Container */}
      <div
        style={{
          width: '100%',
          overflow: 'hidden',
          borderRadius: '16px',
          border: '1px solid #e2e8f0',
          boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
          backgroundColor: '#ffffff',
          display: loadError ? 'none' : 'block',
        }}
      >
        <iframe
          ref={iframeRef}
          id="zeffy-donation-form"
          title="Masjid Al Falah Secure Donation Form Powered by Zeffy"
          src={embedUrl}
          style={{
            width: '100%',
            height: `${iframeHeight}px`,
            minHeight: '620px',
            border: 'none',
            display: 'block',
            overflow: 'hidden',
          }}
          allow="payment"
          {...({ allowpaymentrequest: 'true' } as any)}
          allowTransparency={true}
          onLoad={handleIframeLoad}
          onError={handleIframeError}
        />
      </div>

      {/* 5. Trustee / Administrator Campaign Setup Drawer */}
      <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
        <button
          type="button"
          onClick={() => setShowAdminHelp(!showAdminHelp)}
          style={{
            background: 'none',
            border: 'none',
            color: '#64748b',
            fontSize: '0.78rem',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            fontWeight: 600,
            textDecoration: 'underline',
          }}
        >
          <HelpCircle size={13} />
          Charity Admin: How to link your official Zeffy campaign URL
          {showAdminHelp ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>

        {showAdminHelp && (
          <div
            style={{
              marginTop: '0.75rem',
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.25rem',
              textAlign: 'left',
              fontSize: '0.82rem',
              color: '#334155',
              lineHeight: 1.6,
            }}
          >
            <div style={{ fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              Setting up your Zeffy Campaign for Masjid Al Falah:
            </div>
            <ol style={{ paddingLeft: '1.25rem', margin: 0, display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <li>
                Log into your free account at{' '}
                <a href="https://www.zeffy.com/en-GB" target="_blank" rel="noopener noreferrer" style={{ color: '#0284c7', fontWeight: 700 }}>
                  zeffy.com/en-GB
                </a>{' '}
                (registered with UK Charity #1150221).
              </li>
              <li>Under <strong>Campaigns</strong>, create a new <strong>Donation Form</strong> (e.g. &ldquo;Masjid Al Falah Community Appeal&rdquo;).</li>
              <li>Click the three dots (<strong>...</strong>) next to your campaign &rarr; <strong>Share</strong> &rarr; <strong>More ways to share</strong> &rarr; <strong>Embed</strong>.</li>
              <li>Copy your embed URL (e.g. <code>https://www.zeffy.com/en-GB/embed/donation-form/YOUR_CAMPAIGN_SLUG</code>).</li>
              <li>
                Set it in your environment: <code>NEXT_PUBLIC_ZEFFY_DONATION_URL=YOUR_COPIED_URL</code> in <code>.env.local</code>.
              </li>
            </ol>
            <div style={{ marginTop: '0.75rem', fontSize: '0.76rem', color: '#64748b' }}>
              Current Active Embed URL: <code>{embedUrl}</code>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
