import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

const buildId =
  process.env.VITE_APP_BUILD_ID ||
  process.env.RENDER_GIT_COMMIT ||
  process.env.GIT_COMMIT_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  new Date().toISOString().replace(/[-:.TZ]/g, '')

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
    },
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
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
      },
    },
  },
})
