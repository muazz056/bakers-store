import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium bakery color palette
        cream: {
          50: '#FFFEF7',
          100: '#FEF9E7',
          200: '#FDF3CF',
          300: '#FBEDB7',
          400: '#F9E79F',
          500: '#F7E187',
          DEFAULT: '#FEF9E7',
        },
        chocolate: {
          50: '#F5F0EB',
          100: '#E8DED4',
          200: '#D1BDA9',
          300: '#BA9C7E',
          400: '#A37B53',
          500: '#8B5A2B',
          600: '#6F4722',
          700: '#533419',
          800: '#362210',
          900: '#1A1107',
          DEFAULT: '#8B5A2B',
        },
        gold: {
          50: '#FDF8E8',
          100: '#FBEFD1',
          200: '#F7DFA3',
          300: '#F3CF75',
          400: '#EFBF47',
          500: '#D4AF37',
          600: '#AA8C2C',
          700: '#7F6921',
          800: '#554616',
          900: '#2A230B',
          DEFAULT: '#D4AF37',
        },
        beige: {
          50: '#FDFCFA',
          100: '#FAF7F2',
          200: '#F5EFE5',
          300: '#F0E7D8',
          400: '#EBDFCB',
          500: '#E6D7BE',
          DEFAULT: '#F5EFE5',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out forwards',
        'fade-up': 'fadeUp 0.8s ease-out forwards',
        'fade-down': 'fadeDown 0.8s ease-out forwards',
        'scale-in': 'scaleIn 0.5s ease-out forwards',
        'slide-in-left': 'slideInLeft 0.8s ease-out forwards',
        'slide-in-right': 'slideInRight 0.8s ease-out forwards',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(50px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(139, 90, 43, 0.1), 0 10px 20px -2px rgba(139, 90, 43, 0.04)',
        'soft-lg': '0 10px 40px -10px rgba(139, 90, 43, 0.15)',
        'glow': '0 0 30px rgba(212, 175, 55, 0.3)',
        'glow-soft': '0 0 20px rgba(212, 175, 55, 0.15)',
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
      },
    },
  },
  plugins: [],
};

export default config;
