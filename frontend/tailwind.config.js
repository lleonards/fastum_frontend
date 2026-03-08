/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'dancing': ['"Dancing Script"', 'cursive'],
        'playfair': ['"Playfair Display"', 'serif'],
        'crimson': ['"Crimson Text"', 'serif'],
        'lora': ['Lora', 'serif'],
        'satisfy': ['Satisfy', 'cursive'],
        'pacifico': ['Pacifico', 'cursive'],
        'great-vibes': ['"Great Vibes"', 'cursive'],
        'cinzel': ['Cinzel', 'serif'],
        'eb-garamond': ['"EB Garamond"', 'serif'],
        'libre-baskerville': ['"Libre Baskerville"', 'serif'],
        'cormorant': ['"Cormorant Garamond"', 'serif'],
        'alex-brush': ['"Alex Brush"', 'cursive'],
        'allura': ['Allura', 'cursive'],
        'tangerine': ['Tangerine', 'cursive'],
        'ubuntu': ['Ubuntu', 'sans-serif'],
        'raleway': ['Raleway', 'sans-serif'],
        'josefin': ['"Josefin Sans"', 'sans-serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
      animation: {
        'unroll': 'unroll 1.5s ease-out forwards',
        'envelope-open': 'envelopeOpen 1s ease-out forwards',
        'gift-open': 'giftOpen 1.2s ease-out forwards',
        'fade-in': 'fadeIn 1s ease-in forwards',
        'typewriter': 'typewriter 3s steps(40) forwards',
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite',
        'ribbon-bounce': 'ribbonBounce 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.8s ease-out forwards',
        'paper-appear': 'paperAppear 1s ease-out forwards',
      },
      keyframes: {
        unroll: {
          '0%': { transform: 'scaleY(0)', transformOrigin: 'top', opacity: '0' },
          '100%': { transform: 'scaleY(1)', transformOrigin: 'top', opacity: '1' }
        },
        envelopeOpen: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-180deg)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        sparkle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.2)' }
        },
        ribbonBounce: {
          '0%': { transform: 'scaleY(1)' },
          '50%': { transform: 'scaleY(0.8) scaleX(1.1)' },
          '100%': { transform: 'scaleY(0) scaleX(0)', opacity: '0' }
        },
        slideUp: {
          '0%': { transform: 'translateY(50px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        paperAppear: {
          '0%': { transform: 'translateY(100%) scaleY(0)', opacity: '0' },
          '100%': { transform: 'translateY(0) scaleY(1)', opacity: '1' }
        },
        giftOpen: {
          '0%': { transform: 'translateY(0) rotate(0deg)' },
          '30%': { transform: 'translateY(-5px) rotate(-5deg)' },
          '60%': { transform: 'translateY(-20px) rotate(10deg)' },
          '100%': { transform: 'translateY(-60px) rotate(15deg)', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}
