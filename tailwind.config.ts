import { type Config } from 'tailwindcss'
import { fontFamily } from 'tailwindcss/defaultTheme'

export default {
  content: ['./src/**/*.tsx'],
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
  plugins: [],
} satisfies Config
