import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_RIOT_API_KEY': JSON.stringify('process.env.VITE_RIOT_API_KEY')
  }
})
