import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'clerk-vendor': ['@clerk/clerk-react'],
        },
      },
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    env: {
      VITE_CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k',
      VITE_API_URL: 'http://localhost:8000',
      VITE_APP_NAME: 'ApexDeliver',
      VITE_APP_ENV: 'test',
    },
  },
})

