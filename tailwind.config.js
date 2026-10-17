/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        void: {
          900: "#070712",
          800: "#0c0d1e",
          700: "#14162e",
          600: "#1e2246",
        },
        glitch: {
          cyan: "#00f0ff",
          magenta: "#ff007f",
          amber: "#ffb703",
          green: "#00ff66",
        },
        paper: "#fff7f0",
        ink: "#111122",
        retroblue: "#000080",
        winborder: "#c0c0c0",
      },
      fontFamily: {
        pixel: ['"Press Start 2P"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'glitch-flicker': 'glitch 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '80%': { transform: 'translate(1px, -2px)' },
        }
      }
    },
  },
  plugins: [],
}
