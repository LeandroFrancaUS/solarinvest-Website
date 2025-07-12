import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import WhatsappButton from '@/components/WhatsappButton'
import type { Metadata } from 'next'
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: 'SolarInvest Solutions',
  description: 'Energia solar inteligente e acessível.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className="font-sans text-gray-900 bg-white">
        <Header />
        {children}
        <Footer />
        <WhatsappButton />
      </body>
    </html>
  )
}