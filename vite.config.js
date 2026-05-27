import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.VITE_RIOT_API_KEY': JSON.stringify('RGAPI-74c81461-9529-4e37-bd43-1090864f80d1')
  }
})
