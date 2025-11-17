import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const buildId =
  process.env.VITE_APP_BUILD_ID ||
  process.env.RENDER_GIT_COMMIT ||
  process.env.GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  new Date().toISOString().replace(/[-:.TZ]/g, '')

// Validate required environment variables at build time
const validateBuildEnv = () => {
  const isProduction = process.env.NODE_ENV === 'production'
  const isTest = process.env.NODE_ENV === 'test' || process.env.MODE === 'test'

  // Only validate in production builds (not dev or test)
  if (isProduction && !isTest) {
    const requiredEnvVars = {
      VITE_CLERK_PUBLISHABLE_KEY: process.env.VITE_CLERK_PUBLISHABLE_KEY,
    }

    const missingVars: string[] = []
    for (const [key, value] of Object.entries(requiredEnvVars)) {
      if (!value || (typeof value === 'string' && value.trim() === '')) {
        missingVars.push(key)
      }
    }

    if (missingVars.length > 0) {
      const errorMessage = `
╔════════════════════════════════════════════════════════════════╗
║  BUILD ERROR: Missing Required Environment Variables          ║
╚════════════════════════════════════════════════════════════════╝

The following required environment variables are missing:
${missingVars.map(v => `  - ${v}`).join('\n')}

To fix this:
1. Set the environment variables in your deployment platform (Render, Vercel, etc.)
2. For Render: Go to your service → Environment tab → Add the variables
3. Trigger a new deployment

Without these variables, the application will show an error screen in production.

Build aborted.
`
      console.error(errorMessage)
      throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`)
    }
  }
}

// Validate before building
validateBuildEnv()

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins: [
    react(),
    // Image optimization disabled temporarily due to import issues
    // TODO: Re-enable vite-plugin-imagemin after fixing import syntax
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      // ⚠️ CRITICAL - DO NOT REMOVE ⚠️
      // Forces lucide-react to single ESM build preventing chunk splitting
      // Removing this causes PRODUCTION BLANK SCREENS - See frontend/CRITICAL-VITE-CONFIG.md
      'lucide-react': path.resolve(__dirname, 'node_modules/lucide-react/dist/esm/lucide-react.js'),
    },
    // ⚠️ CRITICAL - DO NOT REMOVE ⚠️
    // Prevents multiple lucide-react instances which cause blank screens
    dedupe: ['lucide-react'],
  },
  optimizeDeps: {
    // ⚠️ CRITICAL - DO NOT ADD include: ['lucide-react'] HERE ⚠️
    // Pre-bundling lucide-react causes async loading and BLANK SCREENS
    // See frontend/CRITICAL-VITE-CONFIG.md for details
    exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size warning limit for large vendor bundles
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Skip test files entirely
          if (id.includes('.test.') || id.includes('.spec.') || id.includes('vitest')) {
            return undefined
          }
          // ⚠️⚠️⚠️ CRITICAL - DO NOT CHANGE THIS TO 'lucide-vendor' ⚠️⚠️⚠️
          // MUST return undefined to keep lucide-react in main bundle
          // Returning 'lucide-vendor' creates async chunk causing BLANK SCREENS
          // See frontend/CRITICAL-VITE-CONFIG.md - this has been debugged extensively
          if (id.includes('lucide-react')) {
            return undefined // KEEP IN MAIN BUNDLE - DO NOT CHANGE
          }
          // Core React dependencies
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor'
            }
            if (id.includes('@clerk')) {
              return 'clerk-vendor'
            }
            if (id.includes('@tanstack/react-query')) {
              return 'react-query'
            }
            // Chart libraries (often large)
            if (id.includes('recharts') || id.includes('chart.js') || id.includes('d3')) {
              return 'charts-vendor'
            }
            // Other vendor code
            return 'vendor'
          }
          // Split valuation suite into its own chunk (large component)
          if (id.includes('valuation/ValuationSuite')) {
            return 'valuation-suite'
          }
          // Split podcast studio into its own chunk
          if (id.includes('podcast/PodcastStudio')) {
            return 'podcast-studio'
          }
          // Split event components into their own chunk
          if (id.includes('events/')) {
            return 'events'
          }
          // Split community into its own chunk
          if (id.includes('community/')) {
            return 'community'
          }
        },
        // Optimize chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const name = assetInfo.name || 'asset';
          if (name.endsWith('.css')) {
            return 'assets/css/[name]-[hash][extname]';
          }
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/.test(name)) {
            return 'assets/images/[name]-[hash][extname]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/.test(name)) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
    // Enable minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // TEMPORARY: Keep console.log for debugging blank screen issue
        drop_debugger: true,
      },
    },
  },
})
