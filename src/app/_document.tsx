/* 🌐 globals.css — estilos globais do site SolarInvest */

/* 🧩 Diretivas do Tailwind */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 🎨 Variáveis de cor para temas claro/escuro */
:root {
  --foreground-rgb: 17, 24, 39;
  --background-start-rgb: 255, 255, 255;
  --background-end-rgb: 255, 255, 255;
}

@media (prefers-color-scheme: dark) {
  :root {
    --foreground-rgb: 255, 255, 255;
    --background-start-rgb: 0, 0, 0;
    --background-end-rgb: 0, 0, 0;
  }
}

/* 🎯 Scroll suave para âncoras e navegação */
html {
  scroll-behavior: smooth;
}

/* 🌍 Estilo global do corpo da página */
body {
  @apply font-sans text-gray-900 bg-white;
  background: linear-gradient(
    to bottom,
    transparent,
    rgb(var(--background-end-rgb))
  ) rgb(var(--background-start-rgb));
}

/* 📏 Padding horizontal global para todas as páginas */
main {
  @apply px-4 sm:px-6 lg:px-8;
}

/* 🧱 Estilo consistente para todos os títulos */
h1, h2, h3, h4 {
  @apply font-heading font-bold text-gray-900;
}

/* 🧩 Links e botões elegantes */
a {
  @apply text-primary hover:text-primary-dark transition-colors;
}

/* 🔘 Botões modernos e acessíveis */
button {
  @apply font-semibold rounded-lg shadow hover:shadow-md transition-all;
}

/* ✅ Remove outline e box-shadow ao clicar */
a:focus, button:focus {
  outline: none;
  box-shadow: none;
}

/* 🔗 Estilo do menu de navegação */
nav a {
  @apply px-3 py-2 text-sm font-medium transition-colors;
}

/* 🔶 Link ativo no menu: laranja vibrante, sublinhado e negrito */
nav a.active {
  @apply text-orange-500 font-bold underline decoration-orange-400 underline-offset-8;
}

/* 🔁 Hover no menu: sublinhado laranja */
nav a:hover {
  @apply underline decoration-orange-400 underline-offset-8;
}

/* 🧱 Container padrão reutilizável (opcional) */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}