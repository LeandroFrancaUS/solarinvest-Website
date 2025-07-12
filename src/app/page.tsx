import Hero from '@/components/Hero'
import Beneficios from '@/components/Beneficios'
import ComoFunciona from '@/app/comofunciona/page'
export const metadata = {
  title: 'Energia Solar Inteligente | Solar Invest Solutions',
  description: 'Economize com energia solar híbrida, off-grid e sustentável. Soluções acessíveis para residências, negócios e comunidades remotas.',
  keywords: [
    'energia solar',
    'solarinvest',
    'solar',
    'solar invest',
    'painel solar',
    'off-grid',
    'energia renovável',
    'fotovoltaica',
    'híbrida',
    'comunidade solar',
  ],
  authors: [{ name: 'SolarInvest Solutions' }],
  creator: 'SolarInvest Solutions',
};

export default function Home() {
  return (
    <>
      <Hero />
      <Beneficios />
      <ComoFunciona />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800">
        <h1 className="text-4xl font-bold">Bem-vindo à SolarInvest Solutions</h1>
        <p className="mt-4 text-lg">
          Energia solar inteligente, acessível e sustentável para o seu futuro.
        </p>
      </main>
    </>
  );
}