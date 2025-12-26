import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// GitHub Pages base path - update this to match your repository name
// If your repo is at github.com/username/typing-game, use '/typing-game/'
// If deploying to a custom domain or root, use '/'
const REPO_NAME = 'typing-game'

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  // Use base path for production builds, root for dev server
  const base = command === 'build' ? `/${REPO_NAME}/` : '/'
  
  return {
    plugins: [react()],
    base: base,
    optimizeDeps: {
      include: ['firebase/app', 'firebase/auth', 'firebase/firestore', 'firebase/analytics'],
    },
    resolve: {
      dedupe: ['firebase'],
    },
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      sourcemap: false,
      minify: 'esbuild', // esbuild is faster and doesn't require additional dependencies
      chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB (optional)
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Split node_modules into separate chunks
            if (id.includes('node_modules')) {
              // React and related libraries
              if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
                return 'react-vendor';
              }
              // Firebase modules
              if (id.includes('firebase')) {
                return 'firebase-vendor';
              }
              // Material-UI
              if (id.includes('@mui') || id.includes('@emotion')) {
                return 'mui-vendor';
              }
              // Other vendor libraries
              return 'vendor';
            }
          },
        },
      },
    },
  }
})
