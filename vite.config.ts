import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Replace 'exigo-tech-' with the exact name of your repository
  base: '/exigo-tech-/',
})