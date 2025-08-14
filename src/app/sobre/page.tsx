import type { Metadata } from 'next';
import SobreContent from './SobreContent';

export const metadata: Metadata = {
  title: 'Sobre a SolarInvest | Energia Solar Sustentável',
  description:
    'Conheça a missão, visão e valores da SolarInvest e como trabalhamos para democratizar o acesso à energia solar no Brasil.',
  keywords: [
    'SolarInvest',
    'sobre',
    'missão',
    'visão',
    'valores',
    'energia solar',
  ],
  openGraph: {
    title: 'Sobre a SolarInvest | Energia Solar Sustentável',
    description:
      'Conheça a missão, visão e valores da SolarInvest e como trabalhamos para democratizar o acesso à energia solar no Brasil.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sobre a SolarInvest | Energia Solar Sustentável',
    description:
      'Conheça a missão, visão e valores da SolarInvest e como trabalhamos para democratizar o acesso à energia solar no Brasil.',
  },
};

export default function SobrePage() {
  return <SobreContent />;
}
