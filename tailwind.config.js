/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    screens: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    },
    extend: {
      colors: {
        monokai: {
          bg: '#272822',
          'bg-dark': '#1e1e1e', 
          'bg-light': '#3e3d32',
          green: '#a6e22e',
          red: '#f92672',
          yellow: '#e6db74',
          blue: '#66d9ef',
          purple: '#ae81ff',
          orange: '#fd971f',
          text: '#f8f8f2',
          'text-dim': '#75715e'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Courier New', 'monospace'],
        sans: ['Inter', 'system-ui', 'sans-serif']
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-gentle': 'bounce-gentle 2s infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': { 
            opacity: '1',
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 rgba(166, 226, 46, 0.7)'
          },
          '50%': { 
            opacity: '0.8',
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px rgba(166, 226, 46, 0)'
          },
        },
        'bounce-gentle': {
          '0%, 100%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(-10px)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}