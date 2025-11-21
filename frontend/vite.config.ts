import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'node:fs'
import path from 'node:path'
import dotenv from 'dotenv'

import { resolveImageminPlugin } from './config/imageminPluginLoader'
import { resolveSitemapPlugin } from './config/sitemapPluginLoader'

// Load local env files before validating required keys
['.env', '.env.local', '.env.production', '.env.production.local'].forEach(file => {
  dotenv.config({ path: file, override: false })
})

const buildId =
  process.env.VITE_APP_BUILD_ID ||
  process.env.RENDER_GIT_COMMIT ||
  process.env.GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  new Date().toISOString().replace(/[-:.TZ]/g, '')

// Ensure outDir exists before plugins write auxiliary files (e.g., sitemap/robots.txt)
const outDir = 'dist'
fs.mkdirSync(path.resolve(__dirname, outDir), { recursive: true })

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
const shouldOptimizeImages = process.env.VITE_DISABLE_IMAGE_MIN !== 'true'
const imageminPluginFactory = resolveImageminPlugin(shouldOptimizeImages)
const sitemapPluginFactory = resolveSitemapPlugin()
const sitemapHostname = process.env.VITE_SITEMAP_HOSTNAME || 'https://100daysandbeyond.com'

const plugins = [react()]
if (sitemapPluginFactory) {
  plugins.push(
    sitemapPluginFactory({
      hostname: sitemapHostname,
    }),
  )
}
if (imageminPluginFactory) {
  plugins.push(
    imageminPluginFactory({
      gifsicle: {
        optimizationLevel: 3,
      },
      optipng: {
        optimizationLevel: 5,
      },
      mozjpeg: {
        quality: 75,
      },
      svgo: {
        plugins: [
          { name: 'removeViewBox', active: false },
          { name: 'removeDimensions', active: true },
        ],
      },
    }),
  )
}

export default defineConfig({
  define: {
    __APP_BUILD_ID__: JSON.stringify(buildId),
  },
  plugins,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  optimizeDeps: {
    include: ['lucide-react'], // Force lucide-react to be pre-bundled (prevents async chunk splitting)
    exclude: ['**/*.test.tsx', '**/*.test.ts', '**/*.spec.tsx', '**/*.spec.ts'],
  },
  server: {
    port: 5173,
    host: true,
  },
  build: {
    target: 'es2018',
    outDir: 'dist',
    sourcemap: false,
    // Increase chunk size warning limit for large vendor bundles
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          const normalizedId = id.replace(/\\/g, '/')
          // Skip test files
          if (normalizedId.includes('.test.') || normalizedId.includes('.spec.') || normalizedId.includes('vitest')) {
            return undefined
          }
          // Keep all vendor code in main bundle - return undefined for node_modules
          if (normalizedId.includes('node_modules')) {
            return undefined
          }
          // Keep application code splitting for large feature modules
          if (normalizedId.includes('valuation/ValuationSuite')) {
            return 'valuation-suite'
          }
          if (normalizedId.includes('podcast/PodcastStudio')) {
            return 'podcast-studio'
          }
          if (normalizedId.includes('events/')) {
            return 'events'
          }
          if (normalizedId.includes('community/')) {
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
