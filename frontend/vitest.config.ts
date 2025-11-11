import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'node:path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'is-potential-custom-element-name': path.resolve(__dirname, 'src/test/stubs/isPotentialCustomElementName.ts'),
      'tr46': path.resolve(__dirname, 'src/test/stubs/tr46.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    testTimeout: 90000,
    hookTimeout: 90000,
    teardownTimeout: 90000,
    pool: 'threads',
    env: {
      NODE_ENV: 'development', // Force React development mode for act() support
      VITE_CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k',
      VITE_API_URL: 'http://localhost:8000',
      VITE_APP_NAME: 'ApexDeliver',
      VITE_APP_ENV: 'test',
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      exclude: [
        'src/assets/**',
        'src/**/*.d.ts',
        'src/pages/admin/**',
        'src/services/api/**',
        'src/pages/deals/DataRoom.tsx',
        'src/lib/analytics.ts',
        'src/pages/dashboard/DashboardPage.tsx',
        'src/pages/SignInPage.tsx',
        'src/pages/SignUpPage.tsx',
        'src/components/common/ErrorBoundary.tsx',
      ],
    },
  },
  poolOptions: {
    threads: {
      singleThread: true,
      minThreads: 1,
      maxThreads: 1,
    },
  },
})
