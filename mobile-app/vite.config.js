import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [vue()],
  server: {
    port: 5177,
    host: true,
    strictPort: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        secure: false,
      },
      '/socket.io': {
        target: 'http://127.0.0.1:3001',
        changeOrigin: true,
        ws: true,
      }
    }
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('vue') || id.includes('pinia') || id.includes('router')) {
              return 'vendor'
            }
            if (id.includes('leaflet')) {
              return 'maps'
            }
            if (id.includes('chart') || id.includes('lucide')) {
              return 'ui'
            }
            if (id.includes('socket.io') || id.includes('jsbarcode')) {
              return 'utils'
            }
          }
        }
      }
    }
  }
})
