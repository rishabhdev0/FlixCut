const CACHE_VERSION = 'pixcut-offline-v1';
const CORE_CACHE = `${CACHE_VERSION}-core`;
const RUNTIME_CACHE = `${CACHE_VERSION}-runtime`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/legacy-index.html',
  '/manifest.webmanifest',
  '/favicon.ico',
  '/favicon.svg',
  '/responsive.css',
  '/tools/bg-remover.html',
  '/tools/file-converter.html',
  '/tools/merge-pdf.html',
  '/tools/image-compress.html',
  '/tools/compress-pdf.html',
  '/tools/scan-to-pdf.html',
  '/tools/add-image-pdf.html',
  '/vendor/qpdf/qpdf.mjs',
  '/tools/bg-remover/js/01-bootstrap.js',
  '/tools/bg-remover/js/02-canvas-refs.js',
  '/tools/bg-remover/js/03-state.js',
  '/tools/bg-remover/js/04-screen.js',
  '/tools/bg-remover/js/05-toast.js',
  '/tools/bg-remover/js/06-file-loading.js',
  '/tools/bg-remover/js/07-background.js',
  '/tools/bg-remover/js/08-render.js',
  '/tools/bg-remover/js/09-compare.js',
  '/tools/bg-remover/js/10-zoom.js',
  '/tools/bg-remover/js/11-coords.js',
  '/tools/bg-remover/js/12-undo-redo.js',
  '/tools/bg-remover/js/13-magic-wand.js',
  '/tools/bg-remover/js/14-blur-mask.js',
  '/tools/bg-remover/js/15-brush.js',
  '/tools/bg-remover/js/16-crop.js',
  '/tools/bg-remover/js/17-pointer-events.js',
  '/tools/bg-remover/js/18-tool-switching.js',
  '/tools/bg-remover/js/19-ai-removal.js',
  '/tools/bg-remover/js/20-mask-operations.js',
  '/tools/bg-remover/js/21-view-tabs.js',
  '/tools/bg-remover/js/22-background-swatches.js',
  '/tools/bg-remover/js/23-adjustments.js',
  '/tools/bg-remover/js/24-wand-brush-sliders.js',
  '/tools/bg-remover/js/25-text-overlay.js',
  '/tools/bg-remover/js/26-download-dropdown.js',
  '/tools/bg-remover/js/27-panel-collapse.js',
  '/tools/bg-remover/js/28-init.js',
  '/tools/file-converter/js/01-bootstrap.js',
  '/tools/file-converter/js/02-state.js',
  '/tools/file-converter/js/03-toast.js',
  '/tools/file-converter/js/04-mode-tabs.js',
  '/tools/file-converter/js/05-file-input.js',
  '/tools/file-converter/js/06-render-list.js',
  '/tools/file-converter/js/07-settings.js',
  '/tools/file-converter/js/08-convert.js',
  '/tools/file-converter/js/09-img-img.js',
  '/tools/file-converter/js/10-img-pdf.js',
  '/tools/file-converter/js/11-pdf-images.js',
  '/tools/file-converter/js/12-helpers.js',
  '/tools/file-converter/js/13-download.js',
  '/tools/file-converter/js/14-init.js',
  '/tools/merge-pdf/js/01-bootstrap.js',
  '/tools/merge-pdf/js/02-state.js',
  '/tools/merge-pdf/js/03-file-input.js',
  '/tools/merge-pdf/js/04-render-list.js',
  '/tools/merge-pdf/js/05-settings.js',
  '/tools/merge-pdf/js/06-keyboard-shortcuts.js',
  '/tools/merge-pdf/js/07-merge.js',
  '/tools/image-compress/js/01-bootstrap.js',
  '/tools/image-compress/js/02-target-selector.js',
  '/tools/image-compress/js/03-file-input.js',
  '/tools/image-compress/js/04-settings.js',
  '/tools/image-compress/js/05-compress.js',
  '/tools/compress-pdf/js/01-bootstrap.js',
  '/tools/compress-pdf/js/02-level-select.js',
  '/tools/compress-pdf/js/03-file-input.js',
  '/tools/compress-pdf/js/04-settings.js',
  '/tools/compress-pdf/js/05-compress.js',
  '/tools/scan-to-pdf/js/01-bootstrap.js',
  '/tools/scan-to-pdf/js/02-state.js',
  '/tools/scan-to-pdf/js/03-toast.js',
  '/tools/scan-to-pdf/js/04-method-tabs.js',
  '/tools/scan-to-pdf/js/05-camera.js',
  '/tools/scan-to-pdf/js/06-upload.js',
  '/tools/scan-to-pdf/js/07-paste-from-clipboard.js',
  '/tools/scan-to-pdf/js/08-filter-engine.js',
  '/tools/scan-to-pdf/js/09-add-page.js',
  '/tools/scan-to-pdf/js/10-render-pages.js',
  '/tools/scan-to-pdf/js/11-page-preview.js',
  '/tools/scan-to-pdf/js/12-settings.js',
  '/tools/scan-to-pdf/js/13-generate-pdf.js',
  '/tools/scan-to-pdf/js/14-init.js',
  '/tools/scan-to-pdf/js/15-mtab-upload-starts-active.js'
];

const CDN_ASSETS = [
  'https://unpkg.com/lucide@latest/dist/umd/lucide.min.js',
  'https://cdn.jsdelivr.net/npm/pdf-lib@1.17.1/dist/pdf-lib.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js'
];

const TOOL_ROUTE_FALLBACKS = {
  '/tools/bg-remover': '/tools/bg-remover.html',
  '/tools/file-converter': '/tools/file-converter.html',
  '/tools/merge-pdf': '/tools/merge-pdf.html',
  '/tools/image-compressor': '/tools/image-compress.html',
  '/tools/image-compress': '/tools/image-compress.html',
  '/tools/compress-pdf': '/tools/compress-pdf.html',
  '/tools/scan-to-pdf': '/tools/scan-to-pdf.html',
  '/tools/add-image-pdf': '/tools/add-image-pdf.html'
};

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CORE_CACHE)
      .then(cache => cache.addAll(CORE_ASSETS))
      .then(() => warmBuiltAssets())
      .then(() => cacheBestEffort(CDN_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => !key.startsWith(CACHE_VERSION))
        .map(key => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/')) return;

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, TOOL_ROUTE_FALLBACKS[url.pathname] || '/index.html'));
    return;
  }

  if (url.origin === self.location.origin) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});

async function networkFirst(request, fallbackUrl) {
  const cache = await caches.open(RUNTIME_CACHE);
  try {
    const response = await fetch(request);
    cache.put(request, response.clone());
    return response;
  } catch (error) {
    return (await caches.match(request)) || caches.match(fallbackUrl);
  }
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;

  const response = await fetch(request);
  const cache = await caches.open(RUNTIME_CACHE);
  cache.put(request, response.clone());
  return response;
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const fresh = fetch(request)
    .then(response => {
      cache.put(request, response.clone());
      return response;
    })
    .catch(() => cached);

  return cached || fresh;
}

async function warmBuiltAssets() {
  try {
    const response = await fetch('/index.html', { cache: 'no-store' });
    const html = await response.text();
    const builtAssets = [...html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)]
      .map(match => match[1]);

    if (!builtAssets.length) return;
    await cacheBestEffort(builtAssets);
  } catch (error) {
    // Offline cache still works for the legacy tool pages even if Vite assets cannot be warmed.
  }
}

async function cacheBestEffort(urls) {
  const cache = await caches.open(CORE_CACHE);
  await Promise.all(urls.map(async url => {
    try {
      const response = await fetch(url);
      if (response && (response.ok || response.type === 'opaque')) {
        await cache.put(url, response.clone());
      }
    } catch (error) {
      // CDN files are cached when they are first used if pre-warming is blocked.
    }
  }));
}
