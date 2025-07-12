'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaLinkedin } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white px-4 sm:px-6 md:px-8 pt-12 pb-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {/* 🟠 Coluna 1: Logo e descrição */}
        <div>
          <h2 className="text-2xl font-bold text-orange-500 mb-2">SolarInvest</h2>
          <p className="text-sm text-gray-300 max-w-xs">
            Soluções inteligentes em energia solar para residências, condomínios e pequenas empresas.
          </p>
        </div>

        {/* 🟠 Coluna 2: Navegação */}
        <div className="flex flex-col gap-2">
          <h3 className="text-lg font-semibold mb-1">Navegação</h3>
          <Link href="/" className="text-sm text-gray-300 hover:text-white">Início</Link>
          <Link href="/solucoes" className="text-sm text-gray-300 hover:text-white">Soluções</Link>
          <Link href="/sobre" className="text-sm text-gray-300 hover:text-white">Sobre</Link>
          <Link href="/contato" className="text-sm text-gray-300 hover:text-white">Contato</Link>
        </div>

        {/* 🟠 Coluna 3: Redes sociais */}
        <div>
          <h3 className="text-lg font-semibold mb-1">Fale conosco</h3>
          <div className="flex gap-4 mt-3">
            <a href="https://wa.me/5562981704303" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp className="text-2xl text-green-400 hover:text-green-500" />
            </a>
            <a href="https://instagram.com/solarinvest.br" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <FaInstagram className="text-2xl text-pink-400 hover:text-pink-500" />
            </a>
            <a href="https://linkedin.com/company/solarinvest" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <FaLinkedin className="text-2xl text-blue-400 hover:text-blue-500" />
            </a>
          </div>
        </div>
      </div>

      {/* 🟠 Rodapé inferior com direitos autorais */}
      <div className="text-center text-sm text-gray-400 mt-12 border-t border-gray-700 pt-6 px-4">
        &copy; {new Date().getFullYear()} SolarInvest Solutions. Todos os direitos reservados.
      </div>
    </footer>
  );
}