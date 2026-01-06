import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
// import { VitePWA } from 'vite-plugin-pwa'
import path from 'path'

export default defineConfig({
  plugins: [
    vue(),
    // VitePWA({
    //   registerType: 'autoUpdate',
    //   includeAssets: ['icon.svg'],
    //   manifest: {
    //     name: 'نظام ريحانة للكاشير',
    //     short_name: 'ريحانة كاشير',
    //     description: 'نظام إدارة المبيعات والمخزون',
    //     theme_color: '#ffffff',
    //     background_color: '#ffffff',
    //     display: 'standalone',
    //     orientation: 'landscape',
    //     start_url: '.',
    //     icons: [
    //       {
    //         src: 'icon.svg',
    //         sizes: 'any',
    //         type: 'image/svg+xml',
    //         purpose: 'any maskable'
    //       }
    //     ]
    //   }
    // })
  ],
  base: './',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,
    port: 3002,
    strictPort: true, // Allow fallback to other ports
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
  }
})
