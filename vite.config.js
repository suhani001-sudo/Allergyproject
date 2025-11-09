import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Allergyproject/', // 👈 your GitHub repo name here
  server: {
    port: 5174,
    strictPort: true, // Exit if port is already in use
  },
})
