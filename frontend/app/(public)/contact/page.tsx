'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Send, CheckCircle2, AlertCircle, ShieldCheck } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);

    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.message || 'Failed to submit inquiry.');
      }

      setSuccessMessage(json.message || 'Your inquiry has been submitted successfully.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err: any) {
      setErrorMessage(err.message || 'An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '4rem' }}>
      {/* Page Header */}
      <section
        style={{
          background: 'var(--hero-gradient)',
          color: '#ffffff',
          padding: '4rem 1.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '800px' }}>
          <span className="badge badge-gold" style={{ marginBottom: '0.75rem' }}>
            Get In Touch
          </span>
          <h1
            style={{
              fontSize: 'clamp(2rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.5rem',
              color: '#ffffff',
            }}
          >
            Contact Alfalah Centre
          </h1>
          <p className="arabic-title" style={{ fontSize: '1.4rem', color: '#fef3c7', marginBottom: '1rem' }}>
            تواصل معنا
          </p>
          <p style={{ fontSize: '1.05rem', color: '#d1fae5', lineHeight: 1.6 }}>
            We welcome inquiries from community members, families, and neighbours across Birmingham.
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '3rem',
            }}
          >
            {/* Contact Information & Map */}
            <div>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '1.25rem', color: 'var(--color-primary-800)' }}>
                Centre Address & Information
              </h2>

              <div className="card" style={{ padding: '1.75rem', marginBottom: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                    <MapPin size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0, marginTop: '0.2rem' }} />
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Physical Location:</strong><br />
                      <span style={{ color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                        ALFALAH COMMUNITY SUPPORT CENTRE<br />
                        89 Tindal Street, Balsall Heath,<br />
                        Birmingham, B12 9QU, United Kingdom
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Mail size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Email:</strong><br />
                      <a href="mailto:alfalahcsc@hotmail.com" style={{ color: 'var(--color-primary-700)', textDecoration: 'underline' }}>
                        alfalahcsc@hotmail.com
                      </a>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <ShieldCheck size={22} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    <div>
                      <strong style={{ fontSize: '1rem', color: 'var(--text-primary)' }}>Charity Registration:</strong><br />
                      <span style={{ color: 'var(--text-secondary)' }}>Registered Charity No. 1150221</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map View */}
              <div
                style={{
                  borderRadius: 'var(--radius-lg)',
                  overflow: 'hidden',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-color)',
                  height: '280px',
                }}
              >
                <iframe
                  title="Alfalah Centre Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=-1.895%2C52.455%2C-1.885%2C52.460&amp;layer=mapnik&amp;marker=52.4578%2C-1.8904"
                  style={{ border: 0 }}
                />
              </div>
            </div>

            {/* Interactive Form */}
            <div>
              <div className="card" style={{ padding: '2.5rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                  Send an Inquiry
                </h2>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Please fill out the form below. Messages are reviewed promptly by centre staff.
                </p>

                {successMessage && (
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-50)',
                      border: '1px solid var(--color-primary-500)',
                      color: 'var(--color-primary-900)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    <CheckCircle2 size={20} style={{ color: 'var(--color-primary-600)', flexShrink: 0 }} />
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #f87171',
                      color: '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.95rem',
                    }}
                  >
                    <AlertCircle size={20} style={{ color: '#dc2626', flexShrink: 0 }} />
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div>
                    <label
                      htmlFor="contact-name"
                      style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}
                    >
                      Your Full Name *
                    </label>
                    <input
                      id="contact-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Brother / Sister Ahmed"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}
                    >
                      Email Address *
                    </label>
                    <input
                      id="contact-email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}
                    >
                      Subject *
                    </label>
                    <input
                      id="contact-subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Inquiry regarding community programmes"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, marginBottom: '0.35rem' }}
                    >
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Please write your message here..."
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)',
                        backgroundColor: 'var(--bg-surface)',
                        color: 'var(--text-primary)',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                    Privacy Notice: Information submitted is used solely to respond to your inquiry and is never shared with third parties.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn btn-primary"
                    style={{ padding: '0.85rem', fontSize: '1rem', width: '100%' }}
                  >
                    {loading ? (
                      'Sending Inquiry...'
                    ) : (
                      <>
                        <Send size={18} /> Submit Inquiry
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
