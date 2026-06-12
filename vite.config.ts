import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Using './' forces all assets to load relative to the index.html file
  // This solves 99% of 404s on GitHub Pages
  base: './',
})