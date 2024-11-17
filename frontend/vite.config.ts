import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: '/',
  
  server: { // only used in development
    proxy: {
      '/api': {
        target: mode === 'production'
          ? process.env.VITE_LAMBDA_API_URL
          : 'http://127.0.0.1:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },

  resolve: {
    preserveSymlinks: true
  }
}))