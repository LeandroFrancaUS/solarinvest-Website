'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Coluna 1: Logo + Descrição */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-2">Solar Invest</h2>
          <p className="text-sm text-gray-300">
            Soluções inteligentes em energia solar para residências, condomínios e pequenas empresas.
          </p>
        </div>

        {/* Coluna 2: Navegação */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-1">Navegação</h3>
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Início</Link>
          <Link href="/solucoes" className="text-sm text-gray-300 hover:text-white">Soluções</Link>
          <Link href="/sobre" className="text-sm text-gray-300 hover:text-white">Sobre</Link>
          <Link href="/contato" className="text-sm text-gray-300 hover:text-white">Contato</Link>
        </div>

        {/* Coluna 3: Redes Sociais */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Fale conosco</h3>
          <div className="flex items-center gap-4 mt-2">
            <a href="https://wa.me/5511999999999" target="_blank" rel="noopener noreferrer">
              <FaWhatsapp className="text-2xl text-green-400 hover:text-green-500" />
            </a>
            <a href="https://instagram.com/solarinvest" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl text-pink-400 hover:text-pink-500" />
            </a>
            <a href="https://linkedin.com/company/solarinvest" target="_blank" rel="noopener noreferrer">
              <FaLinkedin className="text-2xl text-blue-400 hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6">
        &copy; {new Date().getFullYear()} Solar Invest Solutions. Todos os direitos reservados.
      </div>
    </footer>
  );
}