import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'ALFALAH COMMUNITY SUPPORT CENTRE | Birmingham, UK (Charity #1150221)',
  description:
    'Official website for Alfalah Community Support Centre at 89 Tindal Street, Balsall Heath, Birmingham B12 9QU. Live prayer times, community programmes, educational circles, and notices.',
  keywords: [
    'Alfalah Community Support Centre',
    'Alfalah Mosque Birmingham',
    'Balsall Heath Mosque',
    'Birmingham Prayer Times',
    'B12 9QU Mosque',
    'Islamic Community Centre Birmingham',
    'Charity 1150221',
  ],
  authors: [{ name: 'Alfalah Community Support Centre' }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://alfalahcsc.com'),
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: ['/favicon.ico'],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'ALFALAH COMMUNITY SUPPORT CENTRE — Balsall Heath, Birmingham',
    description:
      'Serving faith, family, and community in Birmingham. Daily prayer timetable, youth programmes, and community support.',
    type: 'website',
    locale: 'en_GB',
    url: 'https://alfalahcsc.com',
    siteName: 'ALFALAH COMMUNITY SUPPORT CENTRE',
    images: [
      {
        url: '/images/real/mosque-exterior-main.jpg',
        width: 1200,
        height: 630,
        alt: 'Alfalah Community Support Centre - 89 Tindal St, Birmingham',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ALFALAH COMMUNITY SUPPORT CENTRE — Balsall Heath, Birmingham',
    description:
      'Official community portal and prayer timetable for Alfalah Community Support Centre (Charity #1150221).',
    images: ['/images/real/mosque-exterior-main.jpg'],
  },
};

const schemaJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': ['Mosque', 'NGO', 'CommunityCenter'],
      '@id': 'https://alfalahcsc.com/#organization',
      name: 'Alfalah Community Support Centre',
      alternateName: ['Masjid Al Falah', 'Masjid Al Falah Birmingham', 'مركز الفلاح'],
      url: 'https://alfalahcsc.com',
      logo: 'https://alfalahcsc.com/icon.svg',
      image: 'https://alfalahcsc.com/images/real/mosque-exterior-main.jpg',
      telephone: '+44 7429 188880',
      email: 'alfalahcsc@hotmail.com',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '89 Tindal Street, Balsall Heath',
        addressLocality: 'Birmingham',
        postalCode: 'B12 9QU',
        addressCountry: 'GB',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 52.4555036,
        longitude: -1.8897627,
      },
      sameAs: [
        'https://register-of-charities.charitycommission.gov.uk/en/charity-search/-/charity-details/5023502/contact-information',
        'https://donate.mydona.com/al-falah-csc',
        'https://maps.google.com/maps?cid=52.4555036,-1.8897627',
      ],
      founder: {
        '@type': 'Organization',
        name: 'Alfalah Community Support Centre Charity #1150221',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
        />
      </head>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
