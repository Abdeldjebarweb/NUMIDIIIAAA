// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        playfair: ['var(--font-playfair)', 'Georgia', 'serif'],
        dm: ['var(--font-dm)', 'system-ui', 'sans-serif'],
      },
      colors: {
        green: {
          DEFAULT: '#006233',
          light: '#e8f5ee',
          mid: '#2d8a5e',
        },
        red: {
          DEFAULT: '#D21034',
          light: '#fdeaed',
        },
        'off-white': '#fafaf8',
        text: {
          DEFAULT: '#1a1a1a',
          muted: '#6b6b6b',
        },
        border: '#e2e0d8',
      },
      borderRadius: {
        xl: '16px',
        '2xl': '20px',
      },
    },
  },
  plugins: [],
}

export default config
