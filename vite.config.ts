import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import { existsSync, readFileSync } from 'node:fs';

const serviceToken = process.env.AGROCEBADA_SERVICE_TOKEN || (existsSync('.data-cache/deployment/service-token') ? readFileSync('.data-cache/deployment/service-token','utf8').trim() : '');
const serviceProxy: ProxyOptions = { target: 'http://127.0.0.1:8090', headers: { 'X-AgroCebada-Service-Token': serviceToken }, configure(proxy) { proxy.on('error', (_error, _request, response) => { if ('writeHead' in response && !response.headersSent) { response.writeHead(503, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' })); } }); } };

export default defineConfig({
  plugins: [react()], server: { strictPort: true, watch: { ignored: ['**/.data-cache/**','**/.venv/**','**/test-results/**','**/playwright-report/**'] }, proxy: { '/api/imagery': serviceProxy, '/api/segmentation': serviceProxy } },
  build: { rollupOptions: { output: { manualChunks: { mapping: ['ol', 'proj4', 'ol-mapbox-style'], material: ['@mui/material', '@emotion/react', '@emotion/styled'], react: ['react', 'react-dom'] } } } },
});
