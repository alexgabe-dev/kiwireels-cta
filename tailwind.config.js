/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'kiwi-light': '#a5caa9',
        'kiwi': '#8bc34a',
        'kiwi-dark': '#2b2926',
        'dark-bg': '#1f2937',
        'dark-card': '#374151',
        'dark-text': '#ffffff',
        'dark-text-secondary': '#e5e7eb',
        'dark-border': '#4b5563',
        'light-bg': '#ffffff',
        'light-card': '#f9fafb',
        'light-text': '#1f2937',
        'light-text-secondary': '#4b5563',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulse: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.5' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        slideInRight: 'slideInRight 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        float: 'float 3s ease-in-out infinite',
      },
      boxShadow: {
        'glow': '0 0 15px rgba(139, 195, 74, 0.5)',
        'dark-glow': '0 0 15px rgba(139, 195, 74, 0.3)',
      },
    },
  },
  plugins: [],
};