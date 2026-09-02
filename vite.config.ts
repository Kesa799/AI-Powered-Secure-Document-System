import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  // Relative asset URLs work both locally and on GitHub Pages project sites.
  base: './',
  plugins: [react(), tailwindcss()],
})
