/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        aurum: {
          navy: '#0B1020',
          surface: '#121A2B',
          card: '#182238',
          border: '#233252',
          gold: '#D9B66D',
          'gold-light': '#F3E4C3',
          'gold-dark': '#A88439',
          ivory: '#F6F2E9',
          muted: '#9CA7BA',
          slate: '#6B7A99',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
        serif: ['var(--font-cormorant)', 'serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -5px rgba(217, 182, 109, 0.25)',
        'gold-glow-lg': '0 0 40px -5px rgba(217, 182, 109, 0.35)',
        'surface-subtle': '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
      },
    },
  },
  plugins: [],
};
