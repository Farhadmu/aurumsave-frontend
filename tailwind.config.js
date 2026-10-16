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
          midnight: 'var(--aurum-midnight)',
          surface: 'var(--aurum-surface)',
          card: 'var(--aurum-card)',
          'card-hover': 'var(--aurum-card-hover)',
          border: 'var(--aurum-border)',
          'border-gold': 'var(--aurum-border-gold)',
          gold: 'var(--aurum-gold)',
          'gold-light': 'var(--aurum-gold-light)',
          'gold-dark': 'var(--aurum-gold-dark)',
          champagne: 'var(--aurum-champagne)',
          text: 'var(--aurum-text)',
          'text-muted': 'var(--aurum-text-muted)',
          'text-dim': 'var(--aurum-text-dim)',
          emerald: '#10B981',
          'emerald-glow': 'rgba(16, 185, 129, 0.2)',
          amber: '#F59E0B',
          rose: '#F43F5E',
        },
      },
      fontFamily: {
        sans: [
          'Plus Jakarta Sans',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
        serif: [
          'Cinzel',
          'Cormorant Garamond',
          'Playfair Display',
          'Georgia',
          'serif',
        ],
        mono: ['JetBrains Mono', 'Fira Code', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'gold-glow': '0 0 25px -4px rgba(212, 175, 55, 0.25)',
        'gold-glow-lg': '0 0 45px -5px rgba(212, 175, 55, 0.35)',
        'card-luxury': '0 10px 30px -10px rgba(0, 0, 0, 0.5)',
        'gold-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.15)',
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer-slow': 'shimmer 6s linear infinite',
        'float-gentle': 'float 5s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
      },
    },
  },
  plugins: [],
};
