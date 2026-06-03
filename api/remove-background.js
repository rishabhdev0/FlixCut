const MAX_BYTES = 20 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 8;
const rateBuckets = globalThis.__PIXCutRemoveBgRateBuckets || new Map();
globalThis.__PIXCutRemoveBgRateBuckets = rateBuckets;

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  setSecurityHeaders(res);

  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({error: 'Method not allowed'});
    return;
  }

  const rate = checkRateLimit(req);
  if(!rate.allowed) {
    res.setHeader('Retry-After', String(Math.ceil(rate.retryAfterMs / 1000)));
    res.status(429).json({error: 'Too many background removal requests. Please wait a minute and try again.'});
    return;
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if(!apiKey) {
    res.status(503).json({error: 'Background removal is not configured on this deployment.'});
    return;
  }

  try {
    const contentType = String(req.headers['content-type'] || 'application/octet-stream').split(';')[0].trim().toLowerCase();
    if(!ALLOWED_IMAGE_TYPES.has(contentType)) {
      res.status(415).json({error: 'Unsupported image type. Upload JPG, PNG, or WebP.'});
      return;
    }

    const contentLength = Number(req.headers['content-length'] || 0);
    if(contentLength > MAX_BYTES) {
      res.status(413).json({error: `Image is too large. Max ${formatMB(MAX_BYTES)}.`});
      return;
    }

    const body = await readRequestBody(req);
    if(!body.length) {
      res.status(400).json({error: 'Missing image body'});
      return;
    }
    if(body.length > MAX_BYTES) {
      res.status(413).json({error: `Image is too large. Max ${formatMB(MAX_BYTES)}.`});
      return;
    }

    const form = new FormData();
    const imageBlob = new Blob([body], {type: contentType});
    form.append('image_file', imageBlob, 'flixcut-upload.jpg');
    form.append('size', 'auto');
    form.append('format', 'png');

    const upstream = await fetch('https://api.remove.bg/v1.0/removebg', {
      method: 'POST',
      headers: {'X-Api-Key': apiKey},
      body: form
    });

    const result = Buffer.from(await upstream.arrayBuffer());
    if(!upstream.ok) {
      const fallback = upstream.status === 402
        ? 'Background removal quota is exhausted.'
        : upstream.status === 429
          ? 'Background removal service is rate limited. Try again later.'
          : 'Background removal failed. Try a clearer image or retry later.';
      res.status(upstream.status).json({
        error: readableUpstreamError(result) || fallback
      });
      return;
    }

    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(result);
  } catch(error) {
    const status = error.statusCode || 500;
    res.status(status).json({error: error.message || 'Background removal failed'});
  }
}

async function readRequestBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if(total > MAX_BYTES) {
      const error = new Error(`Image is too large. Max ${formatMB(MAX_BYTES)}.`);
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

function setSecurityHeaders(res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
}

function checkRateLimit(req) {
  const now = Date.now();
  const key = clientKey(req);
  for(const [bucketKey, bucket] of rateBuckets) {
    if(now - bucket.start > RATE_LIMIT_WINDOW_MS * 2) rateBuckets.delete(bucketKey);
  }
  const bucket = rateBuckets.get(key) || {start: now, count: 0};
  if(now - bucket.start > RATE_LIMIT_WINDOW_MS) {
    bucket.start = now;
    bucket.count = 0;
  }
  bucket.count += 1;
  rateBuckets.set(key, bucket);
  return {
    allowed: bucket.count <= RATE_LIMIT_MAX,
    retryAfterMs: Math.max(0, RATE_LIMIT_WINDOW_MS - (now - bucket.start))
  };
}

function clientKey(req) {
  const forwarded = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim();
  return forwarded || req.socket?.remoteAddress || 'unknown';
}

function formatMB(bytes) {
  return `${Math.round(bytes / 1024 / 1024)} MB`;
}

function readableUpstreamError(buffer) {
  const text = buffer.toString('utf8').trim();
  if(!text) return '';
  try {
    const data = JSON.parse(text);
    const first = data?.errors?.[0];
    return first?.title || first?.detail || data?.error || '';
  } catch {
    return text.length > 240 ? `${text.slice(0, 237)}...` : text;
  }
}
