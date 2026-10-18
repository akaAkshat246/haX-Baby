/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        oled: "#040404",
        surface: "#090b10",
        card: "#0e1117",
        cardHover: "#131720",
        shine: {
          green: "#00ff66",
          lime: "#00f59b",
          cyan: "#00e5ff",
          amber: "#ffb703",
          purple: "#b266ff",
          crimson: "#ff3366",
        },
        void: {
          900: "#040404",
          800: "#090b10",
          700: "#0e1117",
          600: "#151922",
        },
        glitch: {
          cyan: "#00e5ff",
          magenta: "#ff3366",
          amber: "#ffb703",
          green: "#00ff66",
        },
        muted: "#9da3b4",
        dim: "#555c6d",
        paper: "#f4f4f6",
        ink: "#040404",
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        serif: ['Georgia', '"Playfair Display"', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace'],
        pixel: ['"Press Start 2P"', 'monospace'],
        vt: ['"VT323"', 'monospace'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      animation: {
        'glitch-flicker': 'glitch 2s infinite',
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-glow': 'pulseGlow 2s ease-in-out infinite',
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0, 0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-1px, -1px)' },
          '60%': { transform: 'translate(2px, 1px)' },
          '80%': { transform: 'translate(1px, -2px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        }
      }
    },
  },
  plugins: [],
}
