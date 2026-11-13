import React from 'react';
import Link from 'next/link';
import {
  BookOpen,
  Heart,
  Users,
  Compass,
  MapPin,
  Calendar,
  CheckCircle2,
  Phone,
  Mail,
  ShieldCheck,
  ArrowRight,
  ExternalLink,
  Clock,
  Coins,
} from 'lucide-react';

export const metadata = {
  title: 'Mosque Services | ALFALAH COMMUNITY SUPPORT CENTRE (Birmingham)',
  description:
    'Comprehensive Islamic and community services at Masjid Al Falah Birmingham (Charity #1150221): Daily Prayers, Jumu’ah, Alfalah Academy, Nikah Marriage, Janazah Funeral, Zakat Relief, and School Visits.',
};

const SERVICES = [
  {
    id: 'prayers',
    title: 'Daily Prayers & Friday Jumu’ah',
    icon: Clock,
    badge: 'Spiritual Core',
    desc: 'Five daily congregational prayers with live Iqamah timetable, Friday Jumu’ah Khutbah at 13:00, Ramadan Taraweeh, and Eid congregations. Dedicated, clean prayer facilities for both brothers and sisters.',
    features: [
      '5 Daily Congregational Prayers with precise Iqamah schedule',
      'Friday Jumu’ah Khutbah delivered in English & Arabic at 13:00',
      'Clean ablution (Wudu) areas with accessibility for elderly worshippers',
      'Taraweeh, Tahajjud, and Eid prayers during holy seasons',
    ],
    ctaText: 'View Prayer Timetable',
    ctaLink: '/prayer-times',
  },
  {
    id: 'academy',
    title: 'Alfalah Academy & Youth Madrasah',
    icon: BookOpen,
    badge: 'Education & STEM',
    desc: 'A comprehensive educational centre combining foundational Islamic studies and Quran Tajweed with innovative modern STEM robotics, arts, and creative workshops for children aged 6–16.',
    features: [
      'Quranic Tajweed recitation & Hifz memorisation classes',
      'Pioneering Youth STEM & Robotics Lab (Lego WeDo & coding)',
      'Creative handmade arts, calligraphy, and craft workshops',
      'Qualified, DBS-checked male and female Muslim teachers',
    ],
    ctaText: 'Explore Academy Lessons',
    ctaLink: '/activities',
  },
  {
    id: 'welfare',
    title: 'Local Zakat & Community Welfare Relief',
    icon: Coins,
    badge: 'Direct Community Impact',
    desc: 'Direct distribution of Zakat al-Mal and emergency hardship funds to eligible local families, providing essential food vouchers, utility support, and warm community spaces in Birmingham.',
    features: [
      '100% direct distribution — zero administrative deductions',
      'Local hardship grants for eligible widows, orphans, and families',
      'Emergency food parcel support in South Birmingham',
      'Warm community space and hot meals for elderly and vulnerable neighbours',
    ],
    ctaText: 'Donate Zakat Online',
    ctaLink: '/donate?category=zakat',
  },
  {
    id: 'nikah',
    title: 'Nikah & Islamic Marriage Solemnisation',
    icon: Users,
    badge: 'Family Services',
    desc: 'Official Islamic marriage solemnisation conducted by certified mosque Imams in strict accordance with the Quran and Sunnah, complete with authenticated Muslim marriage certificates.',
    features: [
      'Islamic marriage solemnisation ceremony at the mosque or venue',
      'Pre-marital Islamic counselling and guidance',
      'Official authenticated Islamic Marriage Certificate issued',
      'Transparent verification of Wali, witnesses, and Mahr requirements',
    ],
    ctaText: 'Enquire for Nikah Booking',
    ctaLink: '/contact',
  },
  {
    id: 'janazah',
    title: 'Janazah & Bereavement Guidance',
    icon: ShieldCheck,
    badge: '24/7 Bereavement',
    desc: 'Compassionate, step-by-step guidance for grieving families during times of bereavement. Coordination of Islamic washing (Ghusl), shrouding (Kafan), Janazah prayer, and cemetery arrangements.',
    features: [
      'Step-by-step guidance on registering a death in Birmingham',
      'Facilities and coordination for ritual Ghusl and Kafan',
      'Congregational Salat al-Janazah (Funeral Prayer) at the mosque',
      'Liaison with Birmingham cemeteries (Handsworth, Sutton New Hall)',
    ],
    ctaText: 'Bereavement Support Info',
    ctaLink: '/contact',
  },
  {
    id: 'dawah',
    title: 'Dawah, New Muslims & Guided School Visits',
    icon: Compass,
    badge: 'Community Outreach',
    desc: 'Welcoming non-Muslim neighbours, local Birmingham school tours, university student visits, and tailored mentorship and free Quran resources for new brothers and sisters embracing Islam.',
    features: [
      'Hosted educational tours for Birmingham schools and colleges',
      'New Muslim mentorship, buddy system, and Shahadah certificates',
      'Free translated Qurans and introductory Islamic literature in English',
      'Interfaith dialogues and open community exhibitions',
    ],
    ctaText: 'Book a Mosque Visit',
    ctaLink: '/contact',
  },
];

export default function ServicesPage() {
  return (
    <div style={{ backgroundColor: '#f8fafc', paddingBottom: '5rem' }}>
      {/* Header Banner - Clean, Luminous & Modern */}
      <section
        style={{
          background: 'linear-gradient(180deg, #DCEEFF 0%, #f8fafc 100%)',
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
            Mosque & Community Services
          </h1>
          <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: 1.6, maxWidth: '680px', margin: '0 auto' }}>
            Masjid Al Falah provides dedicated spiritual, educational, welfare, and family services to nurture our community at 89 Tindal Street, Birmingham.
          </p>
        </div>
      </section>

      {/* Services Grid */}
      <section style={{ padding: '3.5rem 0' }}>
        <div className="container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
            }}
          >
            {SERVICES.map((srv) => (
              <div
                key={srv.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  padding: '2rem',
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: 'var(--shadow-sm)',
                }}
              >
                <div style={{ marginBottom: '1.25rem' }}>
                  <div
                    style={{
                      width: '48px',
                      height: '48px',
                      borderRadius: '12px',
                      backgroundColor: '#DCEEFF',
                      color: '#3988CA',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <srv.icon size={24} />
                  </div>
                </div>

                <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                  {srv.title}
                </h2>

                <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem', flex: 1 }}>
                  {srv.desc}
                </p>

                {/* Key Features Bullet List */}
                <div style={{ marginBottom: '1.75rem', borderTop: '1px solid #f1f5f9', paddingTop: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', marginBottom: '0.65rem', letterSpacing: '0.5px' }}>
                    What We Provide:
                  </div>
                  <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {srv.features.map((feat, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.85rem', color: '#334155', lineHeight: 1.4 }}>
                        <CheckCircle2 size={15} style={{ color: '#3988CA', flexShrink: 0, marginTop: '2px' }} />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href={srv.ctaLink}
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    padding: '0.75rem',
                    fontWeight: 800,
                    fontSize: '0.88rem',
                    justifyContent: 'center',
                    gap: '0.45rem',
                  }}
                >
                  {srv.ctaText} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>

          {/* Quick Mosque Office Contact & Support Box */}
          <div
            style={{
              marginTop: '3.5rem',
              backgroundColor: '#ffffff',
              border: '2px solid #3988CA',
              borderRadius: 'var(--radius-lg)',
              padding: 'clamp(1.25rem, 4vw, 2rem)',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
              gap: '1.5rem',
              alignItems: 'center',
            }}
          >
            <div>
              <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.4rem' }}>
                Need Assistance or Pastoral Guidance?
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                Our Imams and community administration team are here to assist with Nikah solemnisation, bereavement guidance, welfare applications, and school visits.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem', color: '#0f172a' }}>
                <MapPin size={18} style={{ color: '#3988CA', flexShrink: 0 }} />
                <span>89 Tindal Street, Balsall Heath, Birmingham, B12 9QU</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', fontSize: '0.92rem', color: '#0f172a' }}>
                <ShieldCheck size={18} style={{ color: '#3988CA', flexShrink: 0 }} />
                <span>Registered UK Charity <strong>#1150221</strong></span>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <Link href="/contact" className="btn btn-primary" style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', fontWeight: 800 }}>
                  Contact Mosque Office →
                </Link>
                <Link href="/donate" className="btn btn-outline" style={{ padding: '0.65rem 1.25rem', fontSize: '0.88rem', fontWeight: 700 }}>
                  Support Our Work
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
