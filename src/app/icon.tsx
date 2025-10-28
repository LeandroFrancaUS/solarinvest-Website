import { ImageResponse } from 'next/og';

export const size = {
  width: 512,
  height: 512,
};

export const contentType = 'image/png';

export default function Icon() {
  return new ImageResponse(
    (
      <svg
        width="512"
        height="512"
        viewBox="0 0 512 512"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <radialGradient id="solarinvest-grad" cx="50%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#FFD15C" />
            <stop offset="45%" stopColor="#FF9E2C" />
            <stop offset="100%" stopColor="#FF6F0F" />
          </radialGradient>
          <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#C65600" floodOpacity="0.4" />
          </filter>
        </defs>
        <g filter="url(#shadow)">
          <circle cx="256" cy="256" r="224" fill="url(#solarinvest-grad)" />
        </g>
        <path
          d="M284 76L148 304h96l-48 168 184-244h-96l54-152z"
          fill="#FFFFFF"
        />
      </svg>
    ),
    {
      ...size,
    }
  );
}
