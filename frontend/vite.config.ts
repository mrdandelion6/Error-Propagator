import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const proxyTarget = mode === 'production'
    ? process.env.VITE_LAMBDA_API_URL
    : 'http://127.0.0.1:8000';

  console.log('Build Configuration:');
  console.log('Mode:', mode);
  console.log('Proxy Target:', proxyTarget);
  console.log('Environment variables:', process.env);

  return {
    plugins: [react()],
    base: '/',
    
    server: {
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
          rewrite: (path) => {
            console.log('Rewriting path:', path);
            return path.replace(/^\/api/, '/api');
          },
        },
      },
    },

    resolve: {
      preserveSymlinks: true
    }
  }
})