/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        sage: {
          50: '#f4f6f4',
          100: '#e8ede9',
          200: '#d0dbd2',
          300: '#C0C3B9',
          400: '#9aab9e',
          500: '#769382',
          600: '#5d7869',
          700: '#4a6054',
          800: '#3d4f45',
          900: '#2a3530',
        },
        cream: {
          50: '#fdfcf8',
          100: '#F3EFE3',
          200: '#e8dfc8',
          300: '#d9cba8',
        },
      },
    },
  },
  plugins: [],
}
