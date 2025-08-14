import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'],
        mono: ['"Fira Code"', 'monospace'],
      },
      colors: {
        primary: {
          DEFAULT: '#ea580c',
          dark: '#c2410c',
          light: '#f97316',
        },
        gray: {
          DEFAULT: '#6b7280',
          light: '#d1d5db',
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [],
}

export default config
