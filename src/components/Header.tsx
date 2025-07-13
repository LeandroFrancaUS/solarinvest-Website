'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // ✅ Import do componente otimizado de imagem do Next.js
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false); // 🔄 Estado do menu mobile
  const [submenuOpen, setSubmenuOpen] = useState(false); // 🔽 Estado do submenu mobile
  const submenuRef = useRef<HTMLLIElement | null>(null); // 📍 Referência ao submenu

  const toggleMenu = () => setMenuOpen(!menuOpen); // 🔁 Alterna o menu mobile
  const toggleSubmenu = () => setSubmenuOpen(!submenuOpen); // 🔁 Alterna o submenu

  // 🧠 Fecha o submenu ao clicar fora
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
        setSubmenuOpen(false);
      }
    }

    if (submenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [submenuOpen]);

  // 🌐 Links principais
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
      {/* 🔶 Container principal */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* 🟠 Logo + Nome */}
        <Link href="/" className="flex items-center gap-2 text-orange-600 font-bold text-xl">
          <Image
            src="/logo.png" // ✅ Caminho correto do logo na pasta public
            alt="Logo SolarInvest"
            width={32}
            height={32}
            priority // 🔄 Carrega logo com prioridade para melhorar LCP
          />
          SolarInvest
        </Link>

        {/* 📱 Botão menu mobile */}
        <button className="md:hidden text-gray-800" onClick={toggleMenu}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>

        {/* 🖥️ Menu desktop */}
        <nav className="hidden md:flex gap-6 text-gray-800">
          {navLinks.map((link, idx) =>
            link.submenu ? (
              // 🌟 Link com submenu
              <div key={idx} className="relative group">
                <button className="hover:text-orange-600">{link.name}</button>
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
              // 🔗 Link simples
              <Link key={idx} href={link.href} className="hover:text-orange-600">
                {link.name}
              </Link>
            )
          )}
        </nav>
      </div>

      {/* 📱 Menu mobile animado */}
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
                    <button
                      onClick={toggleSubmenu}
                      className="w-full text-left text-gray-800 font-medium"
                    >
                      {link.name}
                    </button>

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