'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import clsx from 'clsx';

export default function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔁 Fecha o menu mobile automaticamente ao mudar de rota
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const navigation = [
    { name: 'Início', href: '/' },
    { name: 'Como Funciona', href: '/comofunciona' },
    { name: 'Soluções', href: '/solucoes' },
    { name: 'Vídeos', href: '/videos' },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  const ariaLabel = menuOpen ? 'Fechar menu' : 'Abrir menu';

  return (
    <header className="fixed top-0 z-50 w-full bg-gradient-to-b from-white/70 to-orange-50/30 backdrop-blur-xl shadow-md border-b border-orange-100">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-4 py-3">

        {/* 🔆 Logo + nome fixo e profissional */}
        <Link
          href="/#hero"
          scroll={true}
          className="flex items-center gap-3 transition-colors duration-200"
        >
          <Image
            src="/LogoNatal.png"
            alt="Logo natalino da SolarInvest"
            width={40}
            height={40}
            className="w-10 h-10 object-contain"
          />
          <div className="flex flex-col leading-tight">
            <span className="text-xl sm:text-2xl font-semibold tracking-tight text-neutral-900 bg-gradient-to-r from-orange-500 to-amber-600 bg-clip-text text-transparent">
              SolarInvest
            </span>
            <span className="text-xs sm:text-sm font-semibold text-neutral-700 -mt-1 whitespace-nowrap tracking-wide">
              da economia mensal ao patrimônio real
            </span>
          </div>
        </Link>

        {/* 🖥️ Menu Desktop */}
        <nav className="hidden md:flex gap-6 items-center text-sm">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'inline-flex items-center px-2 py-1 text-base transition-colors duration-200 focus:outline-none focus:ring-0',
                  {
                    '!text-orange-400 font-bold underline underline-offset-4 decoration-orange-400': isActive,
                    'text-gray-800 hover:text-orange-400 hover:underline hover:underline-offset-4 hover:decoration-orange-400': !isActive,
                  }
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* 📱 Botão do menu mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-orange-500 focus:outline-none"
          aria-label={ariaLabel}
        >
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* 📱 Menu mobile dropdown visível quando aberto */}
      {menuOpen && (
        <nav className="md:hidden bg-white shadow-md border-t border-orange-100 z-40">
          <ul className="flex flex-col space-y-3 px-4 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={clsx(
                      'inline-flex items-center text-base transition-colors duration-200 focus:outline-none focus:ring-0',
                      {
                        '!text-orange-400 font-bold underline underline-offset-4 decoration-orange-400': isActive,
                        'text-gray-800 hover:text-orange-400 hover:underline hover:underline-offset-4 hover:decoration-orange-400': !isActive,
                      }
                    )}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      )}
    </header>
  );
}