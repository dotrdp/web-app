import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()], server: { strictPort: true },
  build: { rollupOptions: { output: { manualChunks: { mapping: ['ol', 'proj4'], material: ['@mui/material', '@emotion/react', '@emotion/styled'], react: ['react', 'react-dom'] } } } },
});
