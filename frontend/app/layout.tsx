import type { Metadata } from 'next';
import './globals.css';
import { ThemeProvider } from '../components/ThemeProvider';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const metadata: Metadata = {
  title: 'ALFALAH COMMUNITY SUPPORT CENTRE | Birmingham, UK (Charity #1150221)',
  description:
    'Official website for Alfalah Community Support Centre (مركز الفلاح الإسلامي) at 89 Tindal Street, Balsall Heath, Birmingham B12 9QU. Live prayer times, community programmes, educational circles, and notices.',
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
  openGraph: {
    title: 'ALFALAH COMMUNITY SUPPORT CENTRE — Balsall Heath, Birmingham',
    description:
      'Serving faith, family, and community in Birmingham. Daily prayer timetable, youth programmes, and community support.',
    type: 'website',
    locale: 'en_GB',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
