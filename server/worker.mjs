const unavailable = () => Response.json({ error: 'Servicio de imágenes no disponible. Puedes seguir usando el atlas.' }, { status: 503, headers: { 'Cache-Control': 'no-store' } });
const permitted = pathname => /^\/api\/imagery\/(health|manifests\/202[2-5]-(0[1-9]|1[0-2])|tiles\/s2-v1-[a-f0-9]{16}\/202[2-5]-(0[1-9]|1[0-2])\/(rgb|ndvi|mndwi)\/\d{1,2}\/\d{1,6}\/\d{1,6}\.png)$/.test(pathname) || pathname === '/api/segmentation/proposals';
let originCache = { value: null, until: 0 };

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    if (url.pathname === '/__service/register') {
      if (request.method !== 'POST' || !env.SERVICE_TOKEN || request.headers.get('X-AgroCebada-Service-Token') !== env.SERVICE_TOKEN) return Response.json({ error: 'No autorizado.' }, { status: 403 });
      const data = await request.json().catch(() => null);
      if (!data || !/^https:\/\/[a-z0-9-]+\.trycloudflare\.com$/.test(data.origin)) return Response.json({ error: 'Origen no válido.' }, { status: 422 });
      await env.AGROCEBADA_SERVICE.put('rig-origin', data.origin);
      originCache = { value: data.origin, until: Date.now() + 15000 };
      return Response.json({ ok: true });
    }
    if (!url.pathname.startsWith('/api/')) return env.ASSETS.fetch(request);
    if (!permitted(url.pathname)) return Response.json({ error: 'Este recurso no existe.' }, { status: 404 });
    const segmentation = url.pathname.startsWith('/api/segmentation/');
    if (request.method !== (segmentation ? 'POST' : 'GET')) return Response.json({ error: 'Método no permitido.' }, { status: 405 });
    if (Number(request.headers.get('Content-Length') || 0) > 16384) return Response.json({ error: 'Solicitud demasiado grande.' }, { status: 413 });
    if (segmentation && request.headers.get('Origin') && request.headers.get('Origin') !== url.origin) return Response.json({ error: 'Origen no permitido.' }, { status: 403 });
    const tile = url.pathname.endsWith('.png');
    if (tile && [...url.searchParams.keys()].some(key => key !== 'threshold')) return Response.json({ error: 'Parámetros no válidos.' }, { status: 422 });
    const cacheKey = new Request(url.toString(), { method: 'GET' });
    if (tile) { const cached = await caches.default.match(cacheKey); if (cached) return cached; }
    if (!env.SERVICE_TOKEN || !env.AGROCEBADA_SERVICE) return unavailable();
    if (originCache.until < Date.now()) originCache = { value: await env.AGROCEBADA_SERVICE.get('rig-origin'), until: Date.now() + 15000 };
    if (!originCache.value) return unavailable();
    const headers = new Headers({ 'X-AgroCebada-Service-Token': env.SERVICE_TOKEN, 'X-Demo-Client': request.headers.get('CF-Connecting-IP') || 'unknown' });
    if (segmentation) headers.set('Content-Type', 'application/json');
    try {
      const body = segmentation ? await request.arrayBuffer() : undefined;
      if (body && body.byteLength > 16384) return Response.json({ error: 'Solicitud demasiado grande.' }, { status: 413 });
      const response = await fetch(originCache.value + url.pathname + url.search, { method: request.method, headers, body, signal: AbortSignal.timeout(segmentation ? 95000 : 95000) });
      if (!response.headers.get('Content-Type')?.match(/application\/json|image\/png/)) return unavailable();
      const forwarded = new Response(response.body, response);
      forwarded.headers.set('X-Content-Type-Options', 'nosniff');
      forwarded.headers.set('Referrer-Policy', 'same-origin');
      if (tile && response.ok) context.waitUntil(caches.default.put(cacheKey, forwarded.clone()));
      return forwarded;
    } catch { return unavailable(); }
  },
};
