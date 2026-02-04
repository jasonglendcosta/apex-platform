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
        // Strategy Theme - Primary Colors
        apex: {
          dark: '#0a0a0f',
          darker: '#050508',
          card: '#12121a',
          border: '#1e1e2a',
          pink: '#D86DCB',
          'pink-light': '#E891DE',
          'pink-dark': '#B84DAB',
          purple: '#8B5CF6',
          cyan: '#22D3EE',
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
        },
        // Status Colors for Units
        status: {
          available: '#10B981',    // Green
          reserved: '#F59E0B',     // Amber
          booked: '#3B82F6',       // Blue
          'spa-signed': '#8B5CF6', // Purple
          'spa-executed': '#6366F1', // Indigo
          registered: '#0EA5E9',   // Sky
          sold: '#6B7280',         // Gray
          blocked: '#EF4444',      // Red
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'apex-gradient': 'linear-gradient(135deg, #D86DCB 0%, #8B5CF6 50%, #22D3EE 100%)',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(216, 109, 203, 0.3)',
        'glow-lg': '0 0 40px rgba(216, 109, 203, 0.4)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config
