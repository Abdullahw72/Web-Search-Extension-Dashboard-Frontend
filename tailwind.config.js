/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        'brand-purple': '#6845D2',
        'brand-purple-inactive': '#B7A6E9',
        'brand-background': '#FBFAFF',
        'brand-text': '#292D32',
        'brand-text-inactive': '#5F6062',
        primary: {
          DEFAULT: '#6845D2',
          50: '#F3F0FD',
          100: '#E6DFFB',
          200: '#D0C2F7',
          300: '#B9A4F3',
          400: '#A287EF',
          500: '#6845D2',
          600: '#5A3BC0',
          700: '#4C31AE',
          800: '#3E279C',
          900: '#301D8A',
          inactive: '#B7A6E9',
        },
        background: {
          DEFAULT: '#FBFAFF',
        },
        text: {
          DEFAULT: '#292D32',
          inactive: '#5F6062',
        }
      }
    },
  },
  plugins: [],
}