'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export default function SplashScreen({ children }: { children: React.ReactNode }) {
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {showSplash && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white">
          <div className="flex items-center justify-center p-6">
            <Image
              src="/LogoNatal2.png"
              alt="SolarInvest - Versão Natal"
              width={360}
              height={360}
              priority
              className="h-auto w-auto max-h-[70vh] max-w-[70vw] object-contain sm:max-h-[60vh] sm:max-w-[50vw]"
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
