'use client';

import { FaInstagram, FaWhatsapp } from 'react-icons/fa';

/**
 * Rodapé moderno e profissional da SolarInvest.
 * Exibe redes sociais, informações de contato e direitos autorais.
 */
export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* 🏢 Nome da empresa e aviso de direitos autorais */}
        <div className="text-center md:text-left text-sm">
          <p className="font-semibold text-lg">SolarInvest</p>
          <p className="text-gray-400">© {new Date().getFullYear()} SolarInvest. Todos os direitos reservados.</p>
        </div>

        {/* 📍 Localização e telefone */}
        <div className="text-sm text-center">
          <p>Anápolis - GO</p>
          <p>Telefone: (62) 98170-4303</p>
        </div>

        {/* 🌐 Ícones das redes sociais */}
        <div className="flex gap-4">
          <a
            href="https://www.instagram.com/solarinvest.br/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram"
            className="text-white hover:text-orange-400 transition"
          >
            <FaInstagram size={24} />
          </a>
          <a
            href="https://wa.me/5562981704303"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="WhatsApp"
            className="text-white hover:text-green-400 transition"
          >
            <FaWhatsapp size={24} />
          </a>
        </div>
      </div>
    </footer>
  );
}