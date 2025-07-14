'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

type Props = {
  videoId: string;
};

export default function LiteYouTube({ videoId }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    setIsPlaying(true);
  };

  return (
    <motion.div
      className="relative w-full aspect-video rounded-xl shadow overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {!isPlaying ? (
        // 🖼️ Miniatura do vídeo com botão de play
        <button
          onClick={handlePlay}
          className="relative w-full h-full flex items-center justify-center group"
          aria-label="Assistir vídeo"
        >
          {/* ✅ Miniatura do vídeo carregada com next/image para performance */}
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Miniatura do vídeo"
            fill
            className="object-cover"
            priority
          />

          {/* ▶️ Botão de play sobreposto */}
          <div className="z-10 w-20 h-20 bg-black bg-opacity-50 rounded-full flex items-center justify-center transition group-hover:scale-110">
            <svg
              className="w-10 h-10 text-white"
              fill="currentColor"
              viewBox="0 0 84 84"
            >
              <polygon points="33,26 33,58 58,42" fill="white" />
            </svg>
          </div>
        </button>
      ) : (
        // ▶️ Iframe do vídeo YouTube quando em reprodução
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="Vídeo do YouTube"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
          className="w-full h-full"
        />
      )}
    </motion.div>
  );
}

// 🧾 Adiciona nome para facilitar debug e mensagens do React DevTools
LiteYouTube.displayName = 'LiteYouTube';