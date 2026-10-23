import { defineConfig } from 'vite';
import Https from 'https';
import Path from 'path';
import react from '@vitejs/plugin-react';

const EXCHANGE_HOST = 'us-central1-undercard-509ba.cloudfunctions.net';

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
  server: {
    proxy: {
      '/login/exchange': {
        agent: new Https.Agent({ servername: EXCHANGE_HOST }),
        changeOrigin: false,
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            proxyReq.setHeader('host', EXCHANGE_HOST);
          });
        },
        rewrite: () => '/login-exchange',
        target: `https://${EXCHANGE_HOST}`,
      },
    },
  },
  resolve: {
    alias: {
      '~': Path.resolve(__dirname, './src'),
    },
  },
});
