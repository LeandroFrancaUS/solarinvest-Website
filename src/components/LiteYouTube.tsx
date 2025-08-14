'use client';

import { useState, memo } from 'react';
import type { FC } from 'react';
import Image from 'next/image';

type LiteYouTubeProps = {
  videoId: string;
};

/**
 * Player leve de YouTube com lazy-load
 */
const LiteYouTubeComponent: FC<LiteYouTubeProps> = ({ videoId }) => {
  const [loaded, setLoaded] = useState(false);
  const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

  return (
    <div className="relative w-full aspect-video rounded-xl shadow overflow-hidden bg-black">
      {!loaded ? (
        <button
          onClick={() => setLoaded(true)}
          className="w-full h-full flex items-center justify-center"
          aria-label="Assistir vídeo"
        >
          <Image
            src={thumbnail}
            alt="Prévia do vídeo"
            fill
            className="absolute inset-0 object-cover"
            sizes="(max-width: 768px) 100vw, 640px"
          />
          <div className="z-10">
            <svg
              className="w-20 h-20 text-white"
              fill="currentColor"
              viewBox="0 0 84 84"
            >
              <circle cx="42" cy="42" r="42" fill="rgba(0,0,0,0.5)" />
              <polygon points="33,26 33,58 58,42" fill="white" />
            </svg>
          </div>
        </button>
      ) : (
        <iframe
          className="absolute inset-0 w-full h-full"
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&modestbranding=1`}
          title="Apresentação SolarInvest"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      )}
    </div>
  );
};

const LiteYouTube = memo(LiteYouTubeComponent);
LiteYouTube.displayName = 'LiteYouTube';

export default LiteYouTube;