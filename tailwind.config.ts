// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FF7A00', // Vibrant orange
          dark: '#E06D00',
        },
        secondary: {
          DEFAULT: '#1A1A1A', // Dark bg
          light: '#2D2D2D',
        }
      },
      animation: {
        'glow': 'glow 3s ease-in-out infinite alternate',
      }
    },
  },
  plugins: [],
}
export default config