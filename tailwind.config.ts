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
          50:  '#f0f5fb',   // very light blue-white
          100: '#dce8f5',   // light blue
          200: '#b8d0ea',   // soft blue
          300: '#82b0d5',   // medium blue
          400: '#4a8abb',   // medium
          500: '#2669a0',   // vivid navy
          600: '#1a5287',   // deep navy
          700: '#153d6a',   // brand navy (logo tone)
          800: '#0f2a4d',   // very dark navy
          900: '#081628',   // deepest — header/footer/text
          950: '#040c18',   // near black
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
