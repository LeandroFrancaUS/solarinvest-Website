'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';

// 📺 Componente leve de YouTube: carrega thumbnail, e só insere o <iframe> após o clique
export default function LiteYouTube({ videoId }: { videoId: string }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const iframeRef = useRef<HTMLDivElement>(null);

  // ✅ Garante que clique em qualquer lugar dentro da thumbnail já dispare o vídeo
  const handlePlay = () => {
    if (!isPlaying) setIsPlaying(true);
  };

  return (
    <div
      className="relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer shadow-md"
      onClick={handlePlay}
    >
      {!isPlaying ? (
        <>
          <Image
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Preview do vídeo"
            layout="fill"
            className="object-cover"
            priority
            unoptimized // YouTube thumbs já são otimizadas
          />
          {/* 🔘 Ícone de play sobre a thumbnail */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="w-20 h-20 bg-black bg-opacity-60 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 84 84">
                <polygon points="33,26 33,58 58,42" fill="white" />
              </svg>
            </div>
          </div>
        </>
      ) : (
        // ▶️ Iframe carrega somente após clique
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          className="absolute inset-0 w-full h-full"
          title="Apresentação SolarInvest"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      )}
    </div>
  );
}