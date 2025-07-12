'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaBars, FaTimes, FaChevronDown } from 'react-icons/fa';

export default function Header() {
  const [menuAberto, setMenuAberto] = useState(false);

  const toggleMenu = () => setMenuAberto((prev) => !prev);
  const closeMenu = () => setMenuAberto(false);

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-orange-600 hover:opacity-80">
          Solar Invest
        </Link>

        {/* Mobile button */}
        <button
          onClick={toggleMenu}
          className="md:hidden text-orange-600 text-2xl focus:outline-none"
          aria-label="Abrir menu"
        >
          {menuAberto ? <FaTimes /> : <FaBars />}
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex gap-6 text-sm font-medium text-gray-700 items-center relative">
          <Link href="/" className="hover:text-orange-600">Início</Link>
          <Link href="/solucoes" className="hover:text-orange-600">Soluções</Link>
          <Link href="/sobre" className="hover:text-orange-600">Sobre</Link>
          <Link href="/contato" className="hover:text-orange-600">Contato</Link>
        </nav>
      </div>

      {/* Mobile menu */}
      {menuAberto && (
        <div className="md:hidden bg-white px-4 pb-4 shadow transition-all duration-300 ease-in-out">
          <nav className="flex flex-col gap-4 text-gray-700 text-sm font-medium">
            <Link href="/" onClick={closeMenu} className="hover:text-orange-600">Início</Link>
            <Link href="/solucoes" onClick={closeMenu} className="hover:text-orange-600">Soluções</Link>
            <Link href="/sobre" onClick={closeMenu} className="hover:text-orange-600">Sobre</Link>
            <Link href="/contato" onClick={closeMenu} className="hover:text-orange-600">Contato</Link>
          </nav>
        </div>
      )}
    </header>
  );
}