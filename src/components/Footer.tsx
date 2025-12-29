'use client';

import Link from 'next/link';
import { FaWhatsapp, FaInstagram, FaLinkedin, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-[#0B1622] text-gray-300 pt-12 pb-8 px-4">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">

        {/* 🔆 Descrição da empresa */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-orange-500">SolarInvest</h2>
          <p className="text-sm leading-relaxed max-w-sm">
            Soluções inteligentes em energia solar para residências, condomínios e pequenas empresas.
          </p>
          <p className="text-sm text-gray-400">
            Cidade: Anápolis – GO<br />
            Tel:(62) 99515-0975
          </p>
        </div>

        {/* 🔗 Links de navegação */}
        <div className="flex flex-col space-y-2 text-sm">
          <Link href="/" className="hover:text-orange-400 transition">Início</Link>
          <Link href="/solucoes" className="hover:text-orange-400 transition">Soluções</Link>
          <Link href="/videos" className="hover:text-orange-400 transition">Vídeos</Link>
          <Link href="/sobre" className="hover:text-orange-400 transition">Sobre</Link>
          <Link href="/contato" className="hover:text-orange-400 transition">Contato</Link>
        </div>

        {/* 🌐 Redes sociais com ícones coloridos */}
        <div className="flex items-start md:justify-end space-x-6 pt-1">
          <a
            href="https://api.whatsapp.com/send/?phone=5562995150975&text=Ol%C3%A1%21+Gostaria+de+saber+mais+sobre+a+energia+solar+da+SolarInvest.&type=phone_number&app_absent=0"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="WhatsApp"
          >
            <span className="sr-only">WhatsApp oficial SolarInvest</span>
            <FaWhatsapp size={24} className="text-green-400 hover:text-green-300 transition" />
          </a>
          <a
            href="https://www.instagram.com/solarinvest.br/"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="Instagram"
          >
            <span className="sr-only">Instagram oficial SolarInvest</span>
            <FaInstagram size={24} className="text-pink-400 hover:text-pink-300 transition" />
          </a>
          <a
            href="https://www.facebook.com/SolarInvestSolutions"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="Facebook"
          >
            <span className="sr-only">Facebook oficial SolarInvest</span>
            <FaFacebook size={24} className="text-blue-500 hover:text-blue-400 transition" />
          </a>
          <a
            href="https://www.linkedin.com/company/solarinvest-solutions"
            target="_blank"
            rel="me noopener noreferrer"
            aria-label="LinkedIn"
          >
            <span className="sr-only">LinkedIn oficial SolarInvest</span>
            <FaLinkedin size={24} className="text-blue-400 hover:text-blue-300 transition" />
          </a>
        </div>
      </div>

      {/* 📌 Rodapé inferior */}
      <div className="mt-10 border-t border-gray-800 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} SolarInvest. Todos os direitos reservados.
      </div>
    </footer>
  );
}