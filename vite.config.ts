import { defineConfig, type ProxyOptions } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync } from 'node:fs';

const serviceToken = process.env.AGROCEBADA_SERVICE_TOKEN || (existsSync('.data-cache/deployment/service-token') ? readFileSync('.data-cache/deployment/service-token','utf8').trim() : '');
const serviceProxy: ProxyOptions = { target: 'http://127.0.0.1:8090', headers: { 'X-AgroCebada-Service-Token': serviceToken }, configure(proxy) { proxy.on('error', (_error, _request, response) => { if ('writeHead' in response && !response.headersSent) { response.writeHead(503, { 'Content-Type': 'application/json' }); response.end(JSON.stringify({ error: 'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' })); } }); } };

export default defineConfig({
  plugins: [react(), tailwindcss()], resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, server: { strictPort: true, allowedHosts: ['.ngrok-free.app'], watch: { ignored: ['**/.data-cache/**','**/.venv/**','**/test-results/**','**/playwright-report/**'] }, proxy: { '/api/imagery': serviceProxy, '/api/segmentation': serviceProxy } },
  preview: { allowedHosts: ['.ngrok-free.app'] },
  build: { rollupOptions: { output: { manualChunks: { mapping: ['ol', 'proj4', 'ol-mapbox-style'], react: ['react', 'react-dom'] } } } },
});
