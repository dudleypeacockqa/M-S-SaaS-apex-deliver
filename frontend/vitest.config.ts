import path from 'node:path'
import os from 'node:os'
import fs from 'node:fs/promises'

const resolveWorkerCount = () => {
  try {
    if (typeof os.availableParallelism === 'function') {
      return os.availableParallelism()
    }
    const cpus = os.cpus?.()
    if (Array.isArray(cpus) && cpus.length > 0) {
      return cpus.length
    }
  } catch {
    // Fallback handled below
  }
  return 1
}

const resolveThreadOverride = () => {
  const override = process.env.VITEST_MAX_THREADS
  if (!override) return null
  const parsed = Number.parseInt(override, 10)
  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed
  }
  return null
}

// Default to a single worker for determinism, but allow env-based overrides so
// long coverage runs can finish within CI/CLI time limits.
const defaultThreadTarget = Math.max(1, Math.min(resolveWorkerCount(), 8))
const threadCount = Math.max(1, Math.min(resolveWorkerCount(), resolveThreadOverride() ?? defaultThreadTarget))
const singleThread = threadCount === 1

const reactPluginModule = await import('@vitejs/plugin-react').catch(() => ({
  default: () => ({
    name: 'noop-react-plugin',
  }),
}))
const react = reactPluginModule.default
const defineConfig = <T>(config: T) => config
const existingNodeOptions = process.env.NODE_OPTIONS ? process.env.NODE_OPTIONS.split(' ') : []
if (!existingNodeOptions.includes('--conditions=module-sync')) {
  existingNodeOptions.push('--conditions=module-sync')
  process.env.NODE_OPTIONS = existingNodeOptions.join(' ').trim()
}

if (!process.env.VITEST_POOL_TIMEOUT) {
  // Worker bootstrap regularly exceeds the default 10s limit on Windows
  process.env.VITEST_POOL_TIMEOUT = '120000'
}

const coverageTempDir = path.resolve(__dirname, 'coverage/.tmp')
await fs.mkdir(coverageTempDir, { recursive: true }).catch(() => {
  // Directory creation is best-effort; Vitest will fail loudly if this folder disappears later.
})

export default defineConfig({
  plugins: [react()],
  ssr: {
    noExternal: ['react-router', 'react-router-dom'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'is-potential-custom-element-name': path.resolve(__dirname, 'src/test/stubs/isPotentialCustomElementName.ts'),
      'tr46': path.resolve(__dirname, 'src/test/stubs/tr46.ts'),
      'react-router/dom': path.resolve(__dirname, 'src/test/shims/reactRouterDom.ts'),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/polyfills/localStorage.ts', './src/setupTests.ts'],
    testTimeout: 90000,
    hookTimeout: 90000,
    teardownTimeout: 90000,
    pool: 'forks',
    poolOptions: {
      forks: {
        singleFork: true,
      },
      threads: {
        singleThread,
        isolate: false,
        maxThreads: threadCount,
        minThreads: 1,
      },
    },
    env: {
      NODE_ENV: 'development', // Force React development mode for act() support
      VITE_CLERK_PUBLISHABLE_KEY: 'pk_live_Y2xlcmsuMTAwZGF5c2FuZGJleW9uZC5jb20k',
      VITE_API_URL: 'http://localhost:8000',
      VITE_APP_NAME: 'ApexDeliver',
      VITE_APP_ENV: 'test',
    },
    server: {
      deps: {
        inline: ['react-router', 'react-router-dom'],
      },
    },
    deps: {
      inline: ['react-router', 'react-router-dom'],
    },
    include: ['src/**/*.{test,spec}.{ts,tsx}'],
    exclude: [
      'node_modules/**',
      'node_modules.before-vitest/**',
    ],
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
})
