import Hero from '@/components/Hero'
import Beneficios from '@/components/Beneficios'
import ComoFunciona from '@/components/ComoFunciona'

export default function Home() {
  return (
    <>
      <Hero />
      <Beneficios />
      <ComoFunciona />
      <main className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-yellow-100 to-orange-200 text-gray-800">
        <h1 className="text-4xl font-bold">Bem-vindo à Solar Invest Solutions</h1>
        <p className="mt-4 text-lg">
          Energia solar inteligente, acessível e sustentável para o seu futuro.
        </p>
      </main>
    </>
  );
}