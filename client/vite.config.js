import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/ethics_project/',
  server: {
    port: 3000,
    proxy: {
      // Proxy /api calls to the Express backend during development
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
