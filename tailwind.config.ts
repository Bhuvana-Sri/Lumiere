import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FAF7F2',
          100: '#F5F0E8',
          200: '#EFEAE0',
          300: '#E8E3D8'
        },
        sage: {
          50: '#DCDFD3',
          100: '#C8CDB9',
          200: '#B8C5B0',
          400: '#8FA088',
          600: '#6E7E64',
          700: '#5C6B53'
        },
        charcoal: {
          400: '#6B6760',
          500: '#4A4742',
          700: '#2C2A26'
        },
        warmtan: {
          200: '#E5D6C3',
          300: '#DCCAB4',
          400: '#CFC4B5'
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Manrope', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      letterSpacing: {
        widest: '0.24em',
        editorial: '0.32em'
      }
    }
  },
  plugins: []
};

export default config;
