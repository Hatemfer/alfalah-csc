import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Donate to Masjid Al Falah | Official UK Charity #1150221',
  description:
    'Support our Mosque Purchase Appeal at 89 Tindal Street, Balsall Heath, Birmingham, or contribute your Zakat al-Mal and Sadaqah via Apple Pay, Google Pay, card, or direct bank transfer with optional fee coverage.',
  keywords: [
    'Masjid Al Falah donation',
    'Alfalah Community Support Centre',
    'Charity 1150221',
    'Mosque Purchase Appeal Birmingham',
    'Zakat al-Mal Birmingham',
    'Sadaqah Jariyah Birmingham',
    'Stripe Charity Donation UK',
    'Apple Pay Mosque Donation',
  ],
  openGraph: {
    title: 'Donate to Masjid Al Falah | Official UK Charity #1150221',
    description:
      'Support our community appeal at 89 Tindal Street, Birmingham. 100% Donation Policy with optional fee coverage.',
    url: 'https://alfalahcsc.com/donate',
    type: 'website',
  },
};

export default function DonateLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
