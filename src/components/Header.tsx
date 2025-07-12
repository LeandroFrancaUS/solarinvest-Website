'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="bg-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        {/* LOGO + NAME */}
        <Link href="/" className="flex items-center space-x-2">
          <img
            src="/images/logo.png"
            alt="SolarInvest Logo"
            className="h-10 w-auto"
          />
          <span className="text-xl font-bold text-orange-600">SolarInvest</span>
        </Link>

        {/* MOBILE BUTTON */}
        <button
          className="md:hidden text-gray-800"
          onClick={toggleMenu}
          aria-label="Menu"
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* NAVIGATION */}
        <nav
          className={`${
            isOpen ? 'block' : 'hidden'
          } absolute md:relative bg-white top-16 md:top-0 left-0 w-full md:w-auto md:flex items-center gap-6 px-4 py-4 md:py-0 md:px-0 z-20 shadow md:shadow-none`}
        >
          <Link href="/" className="text-gray-700 hover:text-orange-600">
            Início
          </Link>
          <Link href="/comofunciona" className="text-gray-700 hover:text-orange-600">
            Como Funciona
          </Link>
          <Link href="/solucoes" className="text-gray-700 hover:text-orange-600">
            Soluções
          </Link>
          <Link href="/sobre" className="text-gray-700 hover:text-orange-600">
            Sobre
          </Link>
          <Link href="/contato" className="text-gray-700 hover:text-orange-600">
            Contato
          </Link>
        </nav>
      </div>
    </header>
  );
}