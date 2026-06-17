import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#fdf8ee',
          100: '#f7edcc',
          200: '#edd895',
          300: '#e4c574',
          400: '#d4a84b',
          500: '#c9a84c',
          600: '#a07830',
          700: '#7a5a1e',
          800: '#4a3810',
          900: '#110d03',
          950: '#080601',
        },
      },
      fontFamily: {
        sans: ['Cairo', 'sans-serif'],
        serif: ['Amiri', 'serif'],
      },
    },
  },
  plugins: [],
}
export default config
