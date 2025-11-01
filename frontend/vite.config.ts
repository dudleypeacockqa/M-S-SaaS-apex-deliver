import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'
import path from 'node:path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Image optimization plugin (production builds only)
    viteImagemin({
      // WebP optimization
      webp: {
        quality: 85, // Balance quality vs file size (85 is high quality)
      },
      // PNG optimization
      optipng: {
        optimizationLevel: 7, // 0-7, higher = smaller files but slower builds
      },
      // JPG/JPEG optimization
      mozjpeg: {
        quality: 85,
      },
      // SVG optimization
      svgo: {
        plugins: [
          {
            name: 'removeViewBox',
            active: false, // Keep viewBox for responsive SVGs
          },
          {
            name: 'removeEmptyAttrs',
            active: true,
          },
        ],
      },
    }),
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
        manualChunks: {
          // Core React dependencies
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Authentication
          'clerk-vendor': ['@clerk/clerk-react'],
          // Data fetching & state management
          'react-query': ['@tanstack/react-query'],
          // UI libraries (if using heavy UI components)
          // Uncomment if you have these dependencies:
          // 'ui-vendor': ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],
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
