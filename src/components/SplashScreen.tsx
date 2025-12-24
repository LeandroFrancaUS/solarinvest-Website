'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);
  const [imageSrc, setImageSrc] = useState('/LogoNatal2.png');

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    const verifyImage = async () => {
      try {
        const response = await fetch('/LogoNatal2.png', { method: 'HEAD' });
        if (!response.ok && isMounted) {
          setImageSrc('/logo.png');
        }
      } catch (error) {
        if (isMounted) {
          setImageSrc('/logo.png');
        }
      }
    };

    void verifyImage();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex items-center justify-center p-6">
            <Image
              key={imageSrc}
              src={imageSrc}
              alt="SolarInvest"
              width={360}
              height={360}
              priority
              className="h-auto w-auto max-h-[70vh] max-w-[70vw] object-contain sm:max-h-[60vh] sm:max-w-[50vw]"
              onError={() => setImageSrc('/logo.png')}
              unoptimized
            />
          </div>
        </div>
      )}
      <div
        className={`transition-opacity duration-500 ${showSplash ? 'opacity-0' : 'opacity-100'}`}
        aria-hidden={showSplash}
      >
        {children}
      </div>
    </>
  );
}
