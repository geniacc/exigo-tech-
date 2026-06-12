import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Must start and end with a slash, and match your repo name
  base: '/exigo-tech-/',
})