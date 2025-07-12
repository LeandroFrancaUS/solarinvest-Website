'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  // 🔄 Estado para controlar se o menu mobile está aberto
  const [menuOpen, setMenuOpen] = useState(false);

  // 🔽 Estado para controlar se o submenu "Soluções" está aberto no mobile
  const [submenuOpen, setSubmenuOpen] = useState(false);

  // 📍 Referência ao submenu para detectar clique fora dele
  const submenuRef = useRef<HTMLLIElement | null>(null);

  // 🔁 Alterna o menu mobile (abre ou fecha)
  const toggleMenu = () => setMenuOpen(!menuOpen);

  // 🔁 Alterna o submenu "Soluções" (abre ou fecha)
  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen);

  // 🧠 Fecha o submenu ao clicar fora dele
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node)
      ) {
        setSubmenuOpen(false);
      }
    }

    // Só adiciona o event listener quando o submenu está aberto
    if (submenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    // Limpa o listener ao desmontar ou quando submenu fecha
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [submenuOpen]);

  // 🌐 Lista de links principais do menu
  const navLinks = [
    { name: 'Início', href: '/' },
    { name: 'Como Funciona', href: '/comofunciona' },
    {
      name: 'Soluções',
      submenu: [
        { name: 'Residencial', href: '/solucoes#residencial' },
        { name: 'Condomínios', href: '/solucoes#condominios' },
        { name: 'Off-grid', href: '/solucoes#offgrid' },
      ],
    },
    { name: 'Sobre', href: '/sobre' },
    { name: 'Contato', href: '/contato' },
  ];

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      {/* 🔶 Container principal do header */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🟠 Logo e nome da empresa */}
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
          <img src="/logo-solarinvest.svg" alt="Logo SolarInvest" className="w-8 h-8" />
          SolarInvest
        </Link>

        {/* 📱 Botão hamburguer para abrir menu mobile */}
        <button className="md:hidden text-gray-800" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* 🖥️ Menu de navegação para desktop */}
        <nav className="hidden md:flex gap-6 text-gray-800">
          {navLinks.map((link, idx) =>
            link.submenu ? (
              // 🌟 Item com submenu
              <div key={idx} className="relative group">
                <button className="hover:text-orange-600">{link.name}</button>
                {/* 🔽 Submenu ao passar o mouse */}
                <div className="absolute left-0 mt-2 bg-white rounded shadow-md opacity-0 group-hover:opacity-100 transition duration-200 pointer-events-none group-hover:pointer-events-auto">
                  {link.submenu.map((sublink, subIdx) => (
                    <Link
                      key={subIdx}
                      href={sublink.href}
                      className="block px-4 py-2 text-sm hover:bg-orange-100"
                    >
                      {sublink.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // 🔗 Links simples
              <Link key={idx} href={link.href} className="hover:text-orange-600">
                {link.name}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* 📱 Menu mobile com animação */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0 }}
            animate={{ height: 'auto' }}
            exit={{ height: 0 }}
            className="md:hidden overflow-hidden bg-orange-50"
          >
            <ul className="flex flex-col px-6 py-4 space-y-3">
              {navLinks.map((link, idx) =>
                link.submenu ? (
                  <li key={idx} ref={submenuRef}>
                    {/* 🔘 Botão para submenu no mobile */}
                    <button
                      onClick={toggleSubmenu}
                      className="w-full text-left text-gray-800 font-medium"
                    >
                      {link.name}
                    </button>

                    {/* 🎬 Submenu animado (mobile) */}
                    <AnimatePresence>
                      {submenuOpen && (
                        <motion.ul
                          initial={{ opacity: 0, y: -5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="ml-4 mt-2 space-y-1"
                        >
                          {link.submenu.map((sublink, subIdx) => (
                            <li key={subIdx}>
                              <Link
                                href={sublink.href}
                                className="block text-sm text-gray-700 hover:text-orange-600"
                                onClick={() => {
                                  setMenuOpen(false);
                                  setSubmenuOpen(false);
                                }}
                              >
                                {sublink.name}
                              </Link>
                            </li>
                          ))}
                        </motion.ul>
                      )}
                    </AnimatePresence>
                  </li>
                ) : (
                  // 🔗 Link simples no mobile
                  <li key={idx}>
                    <Link
                      href={link.href}
                      className="text-gray-800 font-medium hover:text-orange-600"
                      onClick={() => setMenuOpen(false)}
                    >
                      {link.name}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}