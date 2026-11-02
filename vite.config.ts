import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      // Bản chạy thử offline (npm run build:preview): đánh dấu <html> để không đăng ký service worker.
      name: 'vac-offline-demo-flag',
      transformIndexHtml: (html) =>
        process.env.VITE_OFFLINE_DEMO === '1' ? html.replace('<html lang="vi">', '<html lang="vi" data-offline-demo>') : html,
    },
  ],
  server: {
    port: 5173,
    open: true,
  },
  build: {
    target: 'esnext',
    chunkSizeWarningLimit: 1600,
  },
});
