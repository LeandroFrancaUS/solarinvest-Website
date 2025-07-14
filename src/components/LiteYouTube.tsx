'use client';

import React, { useRef, useState } from 'react';

// Props do componente - espera apenas o videoId do YouTube
interface LiteYouTubeProps {
  videoId: string;
}

// Componente com função nomeada para melhor rastreabilidade em debug
export default function LiteYouTube({ videoId }: LiteYouTubeProps) {
  // Controla se o usuário clicou para carregar o vídeo
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Ref para o iframe do YouTube - agora corretamente tipado como HTMLIFrameElement
  const iframeRef = useRef<HTMLIFrameElement | null>(null);

  // Função chamada quando o usuário clica na thumbnail
  const handleClick = () => {
    setIsIframeLoaded(true);
    // Se necessário, aqui você pode também dar foco ao iframe
    iframeRef.current?.focus();
  };

  return (
    <div className="relative w-full pt-[56.25%] rounded-xl overflow-hidden shadow-lg">
      {/* Se ainda não clicou, mostramos a imagem de fundo e o botão play */}
      {!isIframeLoaded && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/60 cursor-pointer"
          onClick={handleClick}
        >
          {/* Thumbnail do vídeo do YouTube */}
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt="Thumbnail do vídeo"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Ícone play centralizado */}
          <div className="z-10">
            <svg
              className="w-20 h-20 text-white drop-shadow-md"
              fill="currentColor"
              viewBox="0 0 84 84"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="42" cy="42" r="42" fill="currentColor" opacity="0.8" />
              <polygon points="33,24 60,42 33,60" fill="black" />
            </svg>
          </div>
        </div>
      )}

      {/* Iframe é renderizado somente após o clique, com autoplay ativado */}
      {isIframeLoaded && (
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