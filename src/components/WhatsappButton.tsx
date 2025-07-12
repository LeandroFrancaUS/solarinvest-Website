'use client';

import { FaWhatsapp } from 'react-icons/fa';

export default function WhatsappButton() {
  const numero = '5562981704303'; // Altere para seu número real com DDI + DDD

  return (
    <a
      href={`https://wa.me/${numero}?text=Olá! Gostaria de saber mais sobre a energia solar da SolarInvest.`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 text-white px-4 py-3 rounded-full shadow-lg hover:bg-green-600 transition-colors"
    >
      <FaWhatsapp className="text-xl" />
      <span className="hidden sm:inline text-sm font-medium">Fale conosco</span>
    </a>
  );
}