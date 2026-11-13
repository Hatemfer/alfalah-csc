'use client';

import React, { useState } from 'react';
import { MapPin, Mail, Send, CheckCircle2, AlertCircle, ShieldCheck, Phone, MessageSquare } from 'lucide-react';

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
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      const res = await fetch(`${apiBase}/contact`, {
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
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', paddingBottom: '5rem' }}>
      {/* Page Header - Clean, Luminous & Modern Brand Gradient */}
      <section
        style={{
          background: 'linear-gradient(180deg, #e0f2fe 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '3rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '780px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4vw, 2.75rem)',
              fontWeight: 800,
              marginBottom: '0.65rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Contact Alfalah Centre
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, maxWidth: '650px', margin: '0 auto' }}>
            We welcome inquiries from community members, families, and neighbours across Birmingham.
          </p>
        </div>
      </section>

      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '2rem',
            }}
          >
            {/* Contact Information & Map */}
            <div>
              <h2 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '1.25rem', color: '#0f172a' }}>
                Centre Address & Information
              </h2>

              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '2rem',
                  marginBottom: '2rem',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {/* Location */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        border: '1px solid #d1fae5',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: '0.15rem',
                      }}
                    >
                      <MapPin size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                        Physical Location
                      </span>
                      <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.98rem' }}>
                        ALFALAH COMMUNITY SUPPORT CENTRE
                      </div>
                      <div style={{ color: '#475569', fontSize: '0.92rem', lineHeight: 1.5, marginTop: '0.15rem' }}>
                        89 Tindal Street, Balsall Heath, Birmingham, B12 9QU
                      </div>
                    </div>
                  </div>

                  {/* Telephone */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        border: '1px solid #d1fae5',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Phone size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                        Telephone
                      </span>
                      <a
                        href="tel:07429188880"
                        style={{ color: '#0f172a', fontWeight: 800, fontSize: '1.05rem', textDecoration: 'none' }}
                      >
                        07429 188880
                      </a>
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        border: '1px solid #d1fae5',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Mail size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                        Email Inquiries
                      </span>
                      <a
                        href="mailto:alfalahcsc@hotmail.com"
                        style={{ color: '#0369a1', fontWeight: 700, fontSize: '0.96rem', textDecoration: 'none' }}
                      >
                        alfalahcsc@hotmail.com
                      </a>
                    </div>
                  </div>

                  {/* Charity Reg */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '12px',
                        backgroundColor: '#e0f2fe',
                        border: '1px solid #d1fae5',
                        color: '#0369a1',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <span style={{ display: 'block', fontSize: '0.74rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.2rem' }}>
                        UK Charity Status
                      </span>
                      <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.96rem' }}>
                        Registered Charity No. 1150221
                      </span>
                    </div>
                  </div>

                  {/* Direct WhatsApp Action Button (Official WhatsApp Dark Forest Tone) */}
                  <div style={{ marginTop: '0.25rem', paddingTop: '1.25rem', borderTop: '1px solid #f1f5f9' }}>
                    <a
                      href="https://wa.me/447429188880"
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        width: '100%',
                        backgroundColor: '#075e54',
                        color: '#ffffff',
                        fontWeight: 700,
                        fontSize: '0.92rem',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.55rem',
                        borderRadius: '12px',
                        padding: '0.85rem 1.25rem',
                        textDecoration: 'none',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(7, 94, 84, 0.2)',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <MessageSquare size={18} />
                      <span>Chat on WhatsApp (07429 188880)</span>
                    </a>
                  </div>
                </div>
              </div>

              {/* Map View */}
              <div
                style={{
                  borderRadius: '16px',
                  overflow: 'hidden',
                  boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                  border: '1px solid #e2e8f0',
                  height: '260px',
                }}
              >
                <iframe
                  title="Alfalah Centre Google Map"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  src="https://maps.google.com/maps?q=52.4555036,-1.8897627+(Alfalah+Community+Support+Centre)&amp;t=&amp;z=17&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  style={{ border: 0 }}
                />
              </div>

              <div style={{ marginTop: '0.5rem', textAlign: 'right' }}>
                <a
                  href="https://www.google.com/maps/place/Alfalah+Community+Support+Centre/@52.4555036,-1.8897627,17z"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: '0.84rem', fontWeight: 700, color: '#0369a1', textDecoration: 'none' }}
                >
                  Open in Google Maps ↗
                </a>
              </div>
            </div>

            {/* Interactive Form */}
            <div>
              <div
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  boxShadow: '0 4px 20px rgba(15, 23, 42, 0.04)',
                }}
              >
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.4rem', color: '#0f172a' }}>
                  Send an Inquiry
                </h2>
                <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1.5rem', lineHeight: 1.5 }}>
                  Please fill out the form below. Messages are reviewed promptly by centre staff.
                </p>

                {successMessage && (
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#f0fdf4',
                      border: '1px solid #7dd3fc',
                      color: '#0369a1',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                    }}
                  >
                    <CheckCircle2 size={18} style={{ color: '#0284c7', flexShrink: 0 }} />
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div
                    style={{
                      padding: '1rem 1.25rem',
                      borderRadius: '12px',
                      backgroundColor: '#fef2f2',
                      border: '1px solid #fecaca',
                      color: '#991b1b',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      marginBottom: '1.5rem',
                      fontSize: '0.92rem',
                      fontWeight: 600,
                    }}
                  >
                    <AlertCircle size={18} style={{ color: '#dc2626', flexShrink: 0 }} />
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
                  <div>
                    <label
                      htmlFor="contact-name"
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}
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
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-email"
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}
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
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-subject"
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}
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
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="contact-message"
                      style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}
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
                        padding: '0.8rem 1rem',
                        borderRadius: '10px',
                        border: '1.5px solid #cbd5e1',
                        backgroundColor: '#ffffff',
                        color: '#0f172a',
                        fontSize: '0.95rem',
                        resize: 'vertical',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <p style={{ fontSize: '0.78rem', color: '#64748b', lineHeight: 1.5, margin: 0 }}>
                    Privacy Notice: Information submitted is used solely to respond to your inquiry and is never shared with third parties.
                  </p>

                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      padding: '0.9rem 1.5rem',
                      fontSize: '1rem',
                      fontWeight: 700,
                      width: '100%',
                      backgroundColor: '#0369a1',
                      color: '#ffffff',
                      borderRadius: '12px',
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(3, 105, 161, 0.25)',
                      transition: 'all 0.15s ease',
                    }}
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
