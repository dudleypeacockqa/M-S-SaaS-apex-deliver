import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
