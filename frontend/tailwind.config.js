module.exports = {
  content: [
    "./app/**/*.{js,vue,ts}",
    "./app/components/**/*.{js,vue,ts}",
    "./app/layouts/**/*.vue",
    "./app/pages/**/*.vue",
    "./app/plugins/**/*.{js,ts}",
    "./app/features/**/*.vue",
    "./app/shared/**/*.vue",
    "./app.vue",
  ],
  theme: {
    extend: {
      colors: {
        'deep-void': '#0F172A',
        'surface': '#1E293B',
        'elevated': '#334155',
        
        'cinema-rose': {
          DEFAULT: '#E11D48',
          hover: '#F43F5E',
          light: '#FB7185',
        },
        
        'white-mist': '#F8FAFC',
        'grey-text': '#94A3B8',
        'text-muted': '#64748B',
        
        'warning-amber': '#F59E0B',
        'success-green': '#22C55E',
        'error-red': '#DC2626',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif']
      },
      boxShadow: {
        'glow': '0 0 20px rgba(225, 29, 72, 0.3)',
        'glow-strong': '0 0 32px rgba(225, 29, 72, 0.5)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    }
  },
  plugins: [],
}
