'use client';

import { useEffect, useRef, useState } from 'react';

// Componente leve para carregar vídeos do YouTube sob demanda
export default function LiteYouTube({ videoId }: { videoId: string }) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [hasPlayed, setHasPlayed] = useState(false);

  // ✅ Quando o botão é clicado, ativa o vídeo
  const playVideo = () => {
    if (iframeRef.current && !hasPlayed) {
      iframeRef.current.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`;
      setHasPlayed(true);
    }
  };

  return (
    <div className="relative w-full aspect-video rounded-xl shadow overflow-hidden">
      {!hasPlayed && (
        <button
          onClick={playVideo}
          className="absolute inset-0 w-full h-full bg-black bg-opacity-40 flex items-center justify-center transition hover:bg-opacity-50"
          aria-label="Reproduzir vídeo"
        >
          {/* 📷 Thumbnail de alta resolução */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Miniatura do vídeo"
            className="w-full h-full object-cover absolute inset-0"
          />
          {/* ▶️ Ícone de play sobreposto */}
          <svg className="w-20 h-20 text-white z-10" fill="currentColor" viewBox="0 0 84 84">
            <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.6)" />
            <polygon points="33,26 33,58 58,42" fill="white" />
          </svg>
        </button>
      )}

      {/* 🎬 Iframe que carrega apenas após o clique */}
      <iframe
        ref={iframeRef}
        title="Vídeo de apresentação"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        loading="lazy"
        className="w-full h-full"
        style={{ border: 'none' }}
      />
    </div>
  );
}