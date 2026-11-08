'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BookOpen,
  Users,
  Clock,
  MapPin,
  ArrowRight,
  Cpu,
  Palette,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  Send,
  AlertCircle,
  GraduationCap,
  ShieldCheck,
  User,
  UserCheck,
  Calendar,
  Lock,
  Check,
} from 'lucide-react';

interface Programme {
  id: string;
  title: string;
  category: string;
  categoryIcon: any;
  ageGroup: string;
  schedule: string;
  location: string;
  image: string;
  leadInstructor?: string;
  shortDesc: string;
  features: string[];
}

const PROGRAMMES: Programme[] = [
  {
    id: 'youth-stem-lab',
    title: 'Youth Electronics & STEM Robotics Lab',
    category: 'STEM & Robotics',
    categoryIcon: Cpu,
    ageGroup: 'Ages 7 – 16 (Boys & Girls)',
    schedule: 'Every Saturday: 10:00 AM – 12:00 PM',
    location: 'Sakeena Learning Hub, 89 Tindal St',
    image: '/images/real/youth-electronics-workbench.jpg',
    leadInstructor: 'Qualified Engineering Mentors',
    shortDesc: 'A pioneering hands-on technical workshop where young Muslims build electronic circuits, solder components, program microcontrollers, and construct robotics in a supportive Islamic environment.',
    features: [
      'Solderless breadboards, LED circuits, resistors, and sensors',
      'Introduction to microcontroller coding and computing logic',
      'Teamwork engineering challenges and mechanical problem solving',
      'All tools, safety equipment, and electronics kits provided',
    ],
  },
  {
    id: 'sakeena-madrasah',
    title: 'Sakeena Learning Hub (Quran & Tajweed Madrasah)',
    category: 'Quran & Tajweed',
    categoryIcon: BookOpen,
    ageGroup: 'Ages 5 – 16',
    schedule: 'Monday, Tuesday & Wednesday: 5:00 PM – 7:00 PM',
    location: 'Sakeena Hub Classrooms, 89 Tindal St',
    leadInstructor: 'Accredited Qaris & Female Teachers (DBS-Checked)',
    image: '/images/real/sakeena-learning-hub.jpg',
    shortDesc: 'Accredited after-school Madrasah covering Noorani Qaida, precise Quranic Tajweed, Juz Amma memorisation, daily Duas, and foundational Islamic manners (Adab).',
    features: [
      'Individual progress tracking with structured reading levels',
      'Qualified male and female teachers with sanad recitation',
      'Interactive whiteboards and multimedia learning tools',
      'Safe, caring, DBS-verified educational environment',
    ],
  },
  {
    id: 'weekly-tafsir',
    title: 'Weekly Tafsir with Sheikh Jamal Al-Jabarti',
    category: 'Scholar Lecture Series',
    categoryIcon: GraduationCap,
    ageGroup: 'Open to All (Youth, Adults, University Students & Elders)',
    schedule: 'Every Saturday: After Maghrib Prayer',
    location: 'Main Prayer Hall, 89 Tindal St',
    leadInstructor: 'Sheikh Jamal bin Saeed Al-Jabarti',
    image: '/images/real/poster-tafsir-sheikh-jamal.jpg',
    shortDesc: 'An in-depth, verse-by-verse exploration of the Holy Quran, translating classical scholarship into practical reflections for contemporary daily life in Britain. Light refreshments and Somali spiced tea served.',
    features: [
      'Delivered in Arabic with English commentary and live Q&A',
      'Dedicated seating and audio for both brothers and sisters',
      'Warm community tea and hospitality following the lecture',
      'Free admission — all brothers, sisters, and university students welcome',
    ],
  },
  {
    id: 'handmade-crafts',
    title: 'Handmade Crafts & Creative Workshop',
    category: 'Handmade & Arts',
    categoryIcon: Palette,
    ageGroup: 'Ages 8 – 16',
    schedule: 'Every Sunday: 11:00 AM – 1:00 PM',
    location: 'Creative Workshop Room, 89 Tindal St',
    leadInstructor: 'Experienced Artisan Mentors',
    image: '/images/real/youth-stem-workshop.jpg',
    shortDesc: 'Hands-on creative workshop combining traditional Islamic calligraphy, woodworking, sewing, and model making to foster patience (Sabr), creative focus, and craftsmanship (Ihsaan).',
    features: [
      'Arabic calligraphy and geometric Islamic patterns',
      'Woodworking and artisanal handmade crafting skills',
      'Screen-free, productive Sunday morning activity',
      'Students take home their handmade completed projects',
    ],
  },
  {
    id: 'sisters-halaqah',
    title: 'Sisters’ Weekly Halaqah & Family Circle',
    category: 'Sisters & Family',
    categoryIcon: Users,
    ageGroup: 'Sisters of All Ages & Young Children',
    schedule: 'Every Sunday: 10:30 AM – 12:30 PM',
    location: 'Secondary Hall (Private Sisters’ Wing)',
    leadInstructor: 'Resident Female Islamic Counsellors',
    image: '/images/real/secondary-hall-sisters.jpg',
    shortDesc: 'A nurturing, private gathering in the secondary hall for sisters to study practical Fiqh of worship, family life, mother-and-toddler socialisation, and mutual community sisterhood.',
    features: [
      'Separate entrance, dedicated Wudu, and private hall',
      'Family counselling and pre-marital Islamic guidance',
      'Support network for new Muslim sisters and young mothers',
      'Light refreshments and tea served in a warm atmosphere',
    ],
  },
];

export default function ActivitiesPage() {
  const [selectedProgramme, setSelectedProgramme] = useState<string>('youth-stem-lab');
  const [formData, setFormData] = useState({
    studentName: '',
    studentAge: '',
    parentName: '',
    phone: '',
    email: '',
    programmeId: 'youth-stem-lab',
    notes: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const chosen = PROGRAMMES.find((p) => p.id === formData.programmeId)?.title || formData.programmeId;
      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';

      const payload = {
        name: formData.parentName ? `${formData.parentName} (for student: ${formData.studentName})` : formData.studentName,
        email: formData.email,
        subject: `[Enrolment Inquiry] ${chosen}`,
        message: `Course Enrolment Request:
- Programme: ${chosen}
- Student Name: ${formData.studentName}
- Student Age: ${formData.studentAge || 'N/A'}
- Parent/Guardian: ${formData.parentName || 'Self'}
- Contact Phone: ${formData.phone}
- Additional Notes: ${formData.notes || 'None'}`,
      };

      const res = await fetch(`${apiBase}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || 'Submission failed. Please call us directly.');
      }

      setSuccess(true);
      setFormData({
        studentName: '',
        studentAge: '',
        parentName: '',
        phone: '',
        email: '',
        programmeId: selectedProgramme,
        notes: '',
      });
    } catch (err: any) {
      setError(err.message || 'An error occurred. Please telephone 07429 188880.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingBottom: '5rem', backgroundColor: '#f8fafc' }}>
      {/* 1. Header Banner */}
      <section
        style={{
          background: 'linear-gradient(180deg, #ecfdf5 0%, #f8fafc 100%)',
          borderBottom: '1px solid #e2e8f0',
          padding: '3rem 1.5rem 2.5rem',
          textAlign: 'center',
        }}
      >
        <div className="container" style={{ maxWidth: '850px' }}>
          <h1
            style={{
              fontSize: 'clamp(2.1rem, 4.5vw, 2.85rem)',
              fontWeight: 800,
              marginBottom: '0.6rem',
              color: '#0f172a',
              letterSpacing: '-0.025em',
            }}
          >
            Alfalah Academy & Youth Programmes
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, maxWidth: '700px', margin: '0 auto' }}>
            Empowering the next generation through our pioneering Youth STEM & Electronics Lab, accredited Sakeena Learning Hub (Madrasah), and Sheikh Jamal Al-Jabarti’s weekly Tafsir circle in Balsall Heath.
          </p>
        </div>
      </section>

      {/* 2. Programmes Grid (Rich Cards with Real Photography) */}
      <section style={{ padding: '3.5rem 0 2rem' }}>
        <div className="container" style={{ maxWidth: '1200px' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
              marginBottom: '4rem',
            }}
          >
            {PROGRAMMES.map((prog) => {
              const Icon = prog.categoryIcon;
              return (
                <div
                  key={prog.id}
                  style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 16px rgba(15, 23, 42, 0.05)',
                    display: 'flex',
                    flexDirection: 'column',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  }}
                  className="programme-card"
                >
                  {/* Photo Frame */}
                  <div
                    style={{
                      position: 'relative',
                      width: '100%',
                      height: '240px',
                      backgroundColor: '#0f172a',
                    }}
                  >
                    <Image
                      src={prog.image}
                      alt={prog.title}
                      fill
                      style={{ objectFit: 'cover' }}
                      sizes="(max-width: 768px) 100vw, 400px"
                    />
                    <div
                      style={{
                        position: 'absolute',
                        top: '12px',
                        left: '12px',
                        backgroundColor: 'rgba(5, 150, 105, 0.95)',
                        color: '#ffffff',
                        fontSize: '0.75rem',
                        fontWeight: 800,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        backdropFilter: 'blur(4px)',
                      }}
                    >
                      <Icon size={14} />
                      {prog.category}
                    </div>

                    <div
                      style={{
                        position: 'absolute',
                        bottom: '10px',
                        right: '10px',
                        backgroundColor: 'rgba(15, 23, 42, 0.85)',
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                      }}
                    >
                      {prog.ageGroup}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div style={{ padding: '1.75rem', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                      {prog.title}
                    </h2>

                    <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.25rem', flex: 1 }}>
                      {prog.shortDesc}
                    </p>

                    {/* Schedule & Location */}
                    <div
                      style={{
                        backgroundColor: '#f8fafc',
                        border: '1px solid #e2e8f0',
                        borderRadius: '12px',
                        padding: '0.85rem 1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.4rem',
                        fontSize: '0.82rem',
                        color: '#334155',
                        marginBottom: '1.25rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <Clock size={15} style={{ color: '#059669', flexShrink: 0 }} />
                        <span><strong>Schedule:</strong> {prog.schedule}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                        <MapPin size={15} style={{ color: '#059669', flexShrink: 0 }} />
                        <span>{prog.location}</span>
                      </div>
                    </div>

                    {/* Key Features */}
                    <div style={{ marginBottom: '1.5rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Highlights & Skills:
                      </div>
                      <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                        {prog.features.map((feat, idx) => (
                          <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.83rem', color: '#334155', lineHeight: 1.4 }}>
                            <CheckCircle2 size={14} style={{ color: '#059669', flexShrink: 0, marginTop: '2px' }} />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Quick Enrol Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedProgramme(prog.id);
                        setFormData((prev) => ({ ...prev, programmeId: prog.id }));
                        const el = document.getElementById('enrolment-form');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        padding: '0.75rem',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        justifyContent: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      Register / Enrol in this Class <ArrowRight size={15} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* 3. Sleek, Modern Class Registration Form */}
          <div
            id="enrolment-form"
            style={{
              maxWidth: '740px',
              margin: '0 auto',
              backgroundColor: '#ffffff',
              borderRadius: '24px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 20px 40px -15px rgba(15, 23, 42, 0.08)',
              overflow: 'hidden',
              scrollMarginTop: '100px',
            }}
          >
            {/* Minimal Emerald Top Accent */}
            <div style={{ height: '4px', backgroundColor: '#059669' }} />

            <div style={{ padding: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
              <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
                <span
                  style={{
                    backgroundColor: '#ecfdf5',
                    color: '#047857',
                    fontWeight: 700,
                    fontSize: '0.75rem',
                    padding: '0.3rem 0.85rem',
                    borderRadius: '9999px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    marginBottom: '0.65rem',
                  }}
                >
                  <Sparkles size={13} />
                  <span>Quick Registration</span>
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.6rem, 3vw, 2rem)',
                    fontWeight: 800,
                    color: '#0f172a',
                    marginBottom: '0.4rem',
                    letterSpacing: '-0.02em',
                  }}
                >
                  Register for Classes & Workshops
                </h2>
                <p style={{ fontSize: '0.92rem', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Select your programme below and fill in your details. We’ll confirm your place within 24 hours.
                </p>
              </div>

              {success ? (
                <div
                  style={{
                    backgroundColor: '#f0fdf4',
                    border: '1px solid #bbf7d0',
                    borderRadius: '16px',
                    padding: '2.5rem 1.5rem',
                    textAlign: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      backgroundColor: '#dcfce7',
                      color: '#16a34a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem',
                    }}
                  >
                    <CheckCircle2 size={32} />
                  </div>
                  <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#166534', marginBottom: '0.5rem' }}>
                    Registration Received!
                  </h3>
                  <p style={{ color: '#15803d', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                    Jazakallahu Khayran! We’ve received your details. Our education coordinator will contact you by phone or email within 24–48 hours to confirm class timing and welcome your child.
                  </p>
                  <button
                    type="button"
                    onClick={() => setSuccess(false)}
                    className="btn btn-primary"
                    style={{ fontWeight: 700, padding: '0.7rem 1.5rem', borderRadius: '12px' }}
                  >
                    Submit Another Registration
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  {error && (
                    <div
                      style={{
                        padding: '0.75rem 1rem',
                        backgroundColor: '#fee2e2',
                        color: '#991b1b',
                        borderRadius: '12px',
                        border: '1px solid #fecaca',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <AlertCircle size={16} style={{ flexShrink: 0 }} />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* 1. Sleek Interactive Programme Pills */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                      Select Programme / Class *
                    </label>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      {PROGRAMMES.map((p) => {
                        const isSelected = (formData.programmeId || selectedProgramme) === p.id;
                        const Icon = p.categoryIcon;
                        return (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => {
                              setSelectedProgramme(p.id);
                              setFormData({ ...formData, programmeId: p.id });
                            }}
                            className="programme-pill"
                            style={{
                              padding: '0.55rem 0.9rem',
                              borderRadius: '9999px',
                              border: isSelected ? '1.5px solid #059669' : '1px solid #e2e8f0',
                              backgroundColor: isSelected ? '#059669' : '#f8fafc',
                              color: isSelected ? '#ffffff' : '#334155',
                              fontSize: '0.82rem',
                              fontWeight: 700,
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected ? '0 4px 12px rgba(5, 150, 105, 0.25)' : 'none',
                            }}
                          >
                            <Icon size={14} color={isSelected ? '#ffffff' : '#059669'} />
                            <span>{p.title.split('(')[0].trim()}</span>
                            {isSelected && <Check size={13} />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 2. Student Name & Age */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Student / Attendee Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Yusuf Ahmed"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        className="enrolment-input"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.92rem',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Age (Optional for adults)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 10 yrs"
                        value={formData.studentAge}
                        onChange={(e) => setFormData({ ...formData, studentAge: e.target.value })}
                        className="enrolment-input"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.92rem',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* 3. Parent Name & Phone */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Parent / Guardian Name (if under 18)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Brother Ahmed"
                        value={formData.parentName}
                        onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                        className="enrolment-input"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.92rem',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                        Telephone / Mobile Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 07123 456789"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="enrolment-input"
                        style={{
                          width: '100%',
                          padding: '0.75rem 1rem',
                          borderRadius: '12px',
                          border: '1.5px solid #e2e8f0',
                          fontSize: '0.92rem',
                          backgroundColor: '#f8fafc',
                          color: '#0f172a',
                          outline: 'none',
                          transition: 'all 0.2s ease',
                        }}
                      />
                    </div>
                  </div>

                  {/* 4. Email */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Email Address * (for confirmation)
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="enrolment-input"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '0.92rem',
                        backgroundColor: '#f8fafc',
                        color: '#0f172a',
                        outline: 'none',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </div>

                  {/* 5. Notes */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: '#334155', marginBottom: '0.35rem' }}>
                      Special Learning Needs or Questions (Optional)
                    </label>
                    <textarea
                      rows={2}
                      placeholder="e.g. Beginner in Tajweed, has basic electronics interest..."
                      value={formData.notes}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      className="enrolment-input"
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        borderRadius: '12px',
                        border: '1.5px solid #e2e8f0',
                        fontSize: '0.92rem',
                        backgroundColor: '#f8fafc',
                        color: '#0f172a',
                        outline: 'none',
                        resize: 'vertical',
                        fontFamily: 'inherit',
                        transition: 'all 0.2s ease',
                      }}
                    />
                  </div>

                  {/* Submit Button */}
                  <div style={{ marginTop: '0.5rem' }}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        padding: '0.9rem',
                        fontWeight: 800,
                        fontSize: '0.98rem',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        borderRadius: '12px',
                        boxShadow: '0 4px 14px rgba(5, 150, 105, 0.2)',
                      }}
                    >
                      <Send size={17} />
                      <span>{loading ? 'Submitting...' : 'Complete Online Registration'}</span>
                    </button>

                    <div style={{ textAlign: 'center', fontSize: '0.78rem', color: '#64748b', marginTop: '0.75rem' }}>
                      Free registration • Questions? Call <a href="tel:07429188880" style={{ color: '#059669', fontWeight: 700 }}>07429 188880</a> or visit 89 Tindal St.
                    </div>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <style jsx global>{`
        .programme-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 28px rgba(15, 23, 42, 0.1) !important;
        }
        .enrolment-input:focus {
          background-color: #ffffff !important;
          border-color: #059669 !important;
          box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.12) !important;
        }
        .programme-pill:hover {
          border-color: #10b981 !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
}
