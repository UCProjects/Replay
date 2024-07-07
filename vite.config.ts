import { defineConfig } from 'vite';
import Path from 'path';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: [
            'react',
            'react-dom',
            'react-router-dom',
          ],
          mui: [
            '@mui/material',
            '@mui/icons-material',
            '@emotion/styled',
            '@emotion/react',
          ],
          firebase: [
            'firebase/app',
            'firebase/auth',
            'firebase/storage',
            'firebase/firestore',
          ],
          plugins: [
            'banana-i18n',
            'axios',
          ],
        },
      },
    },
  },
  plugins: [react()],
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, './src'),
    },
  },
});
