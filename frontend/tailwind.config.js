module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        },
        secondary: {
          400: '#29b6f6',
          500: '#03a9f4',
          600: '#039be5',
        },
        accent: {
          400: '#ffa726',
          500: '#ff9800',
          600: '#fb8c00',
        },
        luxury: {
          black: '#0f172a',
          darkGray: '#1e293b',
          gray: '#334155',
          lightGray: '#475569',
          white: '#f8fafc',
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'primary-gradient': 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
        'luxury-gradient': 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        'hero-gradient': 'linear-gradient(135deg, #0d47a1 0%, #1976d2 50%, #2196f3 100%)',
      },
      boxShadow: {
        'primary': '0 4px 20px rgba(33, 150, 243, 0.4)',
        'primary-lg': '0 10px 40px rgba(33, 150, 243, 0.6)',
        'glow-blue': '0 0 20px rgba(33, 150, 243, 0.5)',
      }
    },
  },
  plugins: [],
}
