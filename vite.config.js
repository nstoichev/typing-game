import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Ensure production mode
    mode: 'production',
    // Minify for production
    minify: 'esbuild',
    // Source maps for production (set to false if you don't want them)
    sourcemap: false,
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
  },
  // Ensure NODE_ENV is set to production during build
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
})
