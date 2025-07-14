/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // ✍️ Define fontes elegantes e modernas
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['"DM Sans"', 'sans-serif'], // Para títulos
        mono: ['"Fira Code"', 'monospace'],   // Se necessário para código
      },
      colors: {
        // 🎨 Cores personalizadas (opcional)
        primary: {
          DEFAULT: '#ea580c', // laranja SolarInvest
          dark: '#c2410c',
          light: '#f97316',
        },
        gray: {
          DEFAULT: '#6b7280',
          light: '#d1d5db',
        },
      },
    },
  },
  // ✔️ Não precisamos do plugin `@tailwindcss/aspect-ratio` pois usamos Tailwind 3+
  // plugins: [],
};