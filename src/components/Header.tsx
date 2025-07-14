'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Image from 'next/image';

/**
 * Cabeçalho fixo com logo, nome da empresa e navegação adaptativa.
 * Inclui destaque para a rota ativa e botão hambúrguer no mobile.
 */
export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { label: 'Início', href: '/' },
    { label: 'Como Funciona', href: '/comofunciona' },
    { label: 'Soluções', href: '/solucoes' },
    { label: 'Sobre', href: '/sobre' },
    { label: 'Contato', href: '/contato' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <header className="fixed top-0 z-50 w-full backdrop-blur bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        {/* 🌞 Logo + nome da empresa */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo SolarInvest"
            width={32}
            height={32}
            priority
          />
          <span className="text-xl font-semibold text-gray-800 tracking-tight">
            SolarInvest
          </span>
        </Link>

        {/* 📱 Botão do menu mobile */}
        <button
          className="md:hidden text-gray-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* 🖥️ Menu desktop */}
        <nav className="hidden md:flex gap-6">
          {navItems.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`transition-all font-medium text-sm tracking-wide ${
                isActive(href)
                  ? 'text-orange-500 font-bold underline underline-offset-8'
                  : 'text-gray-700 hover:text-orange-500 hover:underline'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* 📱 Menu mobile expandido */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-gray-200 px-4 pb-4 pt-2">
          <ul className="flex flex-col space-y-2">
            {navItems.map(({ label, href }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className={`block px-2 py-1 rounded transition-all ${
                    isActive(href)
                      ? 'text-orange-500 font-bold underline underline-offset-8'
                      : 'text-gray-700 hover:text-orange-500'
                  }`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}