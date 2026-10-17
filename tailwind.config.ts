import type { Config } from 'tailwindcss'

export default {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#f8fafc',
        surface: '#ffffff',
        inset: '#f1f5f9',
        border: '#e2e8f0',
        'border-subtle': '#cbd5e1',
        'navy-brand': '#1e3a8a',
        'emerald-rec': '#059669',
        'amber-warn': '#d97706',
        'crimson-due': '#dc2626',
        'blue-admin': '#2563eb',
        'text-primary': '#0f172a',
        'text-secondary': '#475569',
        'text-muted': '#64748b'
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Roboto Mono', 'monospace'],
        serif: ['Source Serif 4', 'Merriweather', 'Georgia', 'serif']
      }
    }
  },
  plugins: []
} satisfies Config
