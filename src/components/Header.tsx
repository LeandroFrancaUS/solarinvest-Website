'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import Image from 'next/image';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

  // Fecha o menu ao navegar
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Lista de links
  const links = [
    { href: '/', label: 'Início' },
    { href: '/comofunciona', label: 'Como Funciona' },
    { href: '/solucoes', label: 'Soluções' },
    { href: '/sobre', label: 'Sobre' },
    { href: '/contato', label: 'Contato' },
  ];

  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur bg-white/80 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Image src="/logo.png" alt="SolarInvest Logo" width={40} height={40} />
          <span className="text-xl font-bold text-orange-600">SolarInvest</span>
        </Link>

        {/* Menu desktop */}
        <nav className="hidden md:flex space-x-6">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`transition-colors ${
                pathname === link.href
                  ? 'text-orange-600 font-bold underline'
                  : 'text-gray-900 hover:text-orange-600'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Botão mobile */}
        <button
          className="md:hidden text-orange-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menu"
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-orange-100">
          <ul className="flex flex-col space-y-3 px-4 pb-4 pt-2">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`block transition-colors ${
                    pathname === link.href
                      ? 'text-orange-600 font-bold'
                      : 'text-gray-900 hover:text-orange-600'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}