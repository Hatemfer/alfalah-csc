import React from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Privacy Notice & Legal Disclosures | ALFALAH COMMUNITY SUPPORT CENTRE',
  description:
    'Privacy notice, cookie policy, accessibility information, and charity disclosures for Alfalah Community Support Centre (Charity No. 1150221).',
};

export default function PrivacyPage() {
  return (
    <div style={{ paddingBottom: '4rem' }}>
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '3.5rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.5rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Privacy Notice & Legal Information
          </h1>
          <p style={{ fontSize: '1rem', color: '#d1fae5' }}>
            ALFALAH COMMUNITY SUPPORT CENTRE | UK Registered Charity No. 1150221
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container" style={{ maxWidth: '850px' }}>
          <div className="card" style={{ padding: '2.5rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                1. Data Controller Information
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                ALFALAH COMMUNITY SUPPORT CENTRE (Charity No. 1150221), located at 89 Tindal Street, Balsall Heath, Birmingham, B12 9QU, United Kingdom, is the Data Controller for personal data processed through this website. Contact: <a href="mailto:alfalahcsc@hotmail.com" style={{ textDecoration: 'underline' }}>alfalahcsc@hotmail.com</a>.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                2. Information We Collect
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                We collect personal information only when voluntarily submitted by visitors (for example, names, email addresses, and message contents submitted through our public contact form). We do not collect non-essential tracking cookies or sell personal information to third parties.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                3. Cookies & Local Storage
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                This website uses strictly necessary local storage only to remember your chosen theme preference (Light/Dark mode) and authenticated staff session cookies for authorised administrators accessing the CMS dashboard. No advertising or commercial profiling cookies are deployed.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                4. Accessibility Commitment
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                We aim to follow WCAG 2.2 AA standards, ensuring accessible contrast ratios, semantic HTML structure, keyboard-operable navigation, and responsive scaling across mobile phones, tablets, and desktop devices.
              </p>
            </div>

            <div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-primary-800)', marginBottom: '0.75rem' }}>
                5. Financial & Charity Integrity
              </h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: 1.7 }}>
                In accordance with charity governance regulations, all charitable activities are conducted under the supervision of trustees registered with the Charity Commission for England and Wales (Charity Number: 1150221).
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
