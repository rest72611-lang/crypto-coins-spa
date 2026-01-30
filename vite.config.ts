import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: "/", // Cloudflare Pages base
  plugins: [react()],
  server: { open: true },
})
