// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // This tells Vite that all your files start at /exigo-tech-/
  base: '/exigo-tech-/',
})