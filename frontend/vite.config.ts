import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteImagemin from 'vite-plugin-imagemin'

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
})
