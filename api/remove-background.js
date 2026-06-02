const MAX_BYTES = 20 * 1024 * 1024;

export const config = {
  api: {
    bodyParser: false
  }
};

export default async function handler(req, res) {
  if(req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({error: 'Method not allowed'});
    return;
  }

  const apiKey = process.env.REMOVE_BG_API_KEY;
  if(!apiKey) {
    res.status(503).json({error: 'REMOVE_BG_API_KEY is not configured'});
    return;
  }

  try {
    const contentType = req.headers['content-type'] || 'application/octet-stream';
    if(!contentType.startsWith('image/')) {
      res.status(415).json({error: 'Expected raw image upload'});
      return;
    }

    const body = await readRequestBody(req);
    if(!body.length) {
      res.status(400).json({error: 'Missing image body'});
      return;
    }
    if(body.length > MAX_BYTES) {
      res.status(413).json({error: 'Image is too large'});
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
      res.status(upstream.status).json({
        error: result.toString('utf8') || 'remove.bg request failed'
      });
      return;
    }

    res.setHeader('Content-Type', upstream.headers.get('content-type') || 'image/png');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).send(result);
  } catch(error) {
    res.status(500).json({error: error.message || 'Background removal failed'});
  }
}

async function readRequestBody(req) {
  const chunks = [];
  let total = 0;
  for await (const chunk of req) {
    total += chunk.length;
    if(total > MAX_BYTES) throw new Error('Image is too large');
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}
