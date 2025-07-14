'use client';

import { useState } from 'react';
import Image from 'next/image';

// Componente que exibe um vídeo do YouTube com carregamento leve e otimizado
export default function LiteYouTube({ videoId }: { videoId: string }) {
  // Estado para controlar se o vídeo está em reprodução
  const [isPlaying, setIsPlaying] = useState(false);

  // Lida com o clique para começar a reprodução
  const handlePlay = () => setIsPlaying(true);

  return (
    <div className="relative w-full aspect-video rounded-xl shadow overflow-hidden">
      {!isPlaying ? (
        // 📷 Thumbnail otimizada com botão de play
        <button
          onClick={handlePlay}
          className="w-full h-full relative flex items-center justify-center group"
        >
          {/* Imagem com otimização do Next.js */}
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Prévia do vídeo"
            fill
            className="object-cover"
            priority // 📌 Garante carregamento prioritário
          />
          {/* Ícone de play estilizado */}
          <svg
            className="w-16 h-16 text-white z-10 group-hover:scale-110 transition-transform"
            fill="currentColor"
            viewBox="0 0 84 84"
          >
            <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.5)" />
            <polygon points="33,26 33,58 58,42" fill="white" />
          </svg>
        </button>
      ) : (
        // ▶️ Iframe do vídeo após clique
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Vídeo do YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full"
          style={{ border: '0' }}
        />
      )}
    </div>
  );
}