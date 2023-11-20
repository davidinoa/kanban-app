import { nextui } from '@nextui-org/react'
import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'
import plugin from 'tailwindcss/plugin'

export default {
  content: [
    './src/**/*.tsx',
    './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        black: '#000112',
        gray: {
          50: '#f4f7fd',
          100: '#828fa3',
          200: '#3e3f4e',
          300: '#2b2c37',
          400: '#20212c',
        },
        purple: {
          50: '#a8a4ff',
          100: '#635fc7',
        },
        red: {
          50: '#ff9898',
          100: '#ea5555',
        },
        sky: '#e4ebfa',
      },
      fontFamily: {
        sans: [...fontFamily.sans],
      },
    },
  },
  darkMode: 'class',
  plugins: [
    nextui(),
    plugin(function ({ addUtilities }) {
      addUtilities({
        '.heading-sm': {
          fontWeight: '700',
          fontSize: '0.75rem',
          lineHeight: '1.25',
          letterSpacing: '2.4px',
          color: '#828fa3',
        },
      })
    }),
  ],
} satisfies Config
