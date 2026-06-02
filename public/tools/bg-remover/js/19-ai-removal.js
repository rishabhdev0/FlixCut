document.getElementById('run-ai-btn').addEventListener('click', runAI);

async function runAI() {
  if(!originalPixels) return;
  cancelled = false;

  showScreen('loading');
  const lbar   = document.getElementById('l-bar');
  const lmsg   = document.getElementById('l-msg');
  const lstage = document.getElementById('l-stage');
  const lpct   = document.getElementById('l-pct');
  lbar.style.background = '';

  function setProgress(pct, stage, msg) {
    lbar.style.width = pct + '%';
    lpct.textContent = Math.round(pct) + '%';
    if(stage) lstage.textContent = stage;
    if(msg) lmsg.textContent = msg;
  }

  try {
    await runServerAI(setProgress);
  } catch(err) {
    console.warn('Server AI unavailable, using browser AI:', err);
    await runBrowserAI(setProgress, err);
  }
}

async function runServerAI(setProgress) {
  setProgress(8, 'SERVER AI', 'Sending image to secure AI remover...');
  const inputBlob = await imageBlobForServer();
  if(cancelled) { showScreen('editor'); return; }

  const response = await fetch('/api/remove-background', {
    method: 'POST',
    headers: {'Content-Type': inputBlob.type || 'image/jpeg'},
    body: inputBlob
  });

  if(!response.ok) {
    let message = 'Server AI failed';
    try {
      const data = await response.json();
      message = data.error || message;
    } catch {}
    throw new Error(message);
  }

  setProgress(84, 'SERVER AI', 'Applying clean AI mask...');
  const resultBlob = await response.blob();
  await applyServerMaskBlob(resultBlob);
  setProgress(100, 'DONE', 'Background removed!');
  setTimeout(()=>{
    showScreen('editor');
    document.getElementById('pinfo').textContent = `AI ok (${imgW}x${imgH})`;
    toast('AI removal complete');
  }, 400);
}

async function imageBlobForServer() {
  return await new Promise(resolve => origCvs.toBlob(resolve, 'image/jpeg', 0.95));
}

async function applyServerMaskBlob(resultBlob) {
  const resultURL = URL.createObjectURL(resultBlob);
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tc = Object.assign(document.createElement('canvas'), {width: imgW, height: imgH});
      tc.getContext('2d').drawImage(img, 0, 0, imgW, imgH);
      const rd = tc.getContext('2d').getImageData(0, 0, imgW, imgH).data;
      pushUndo();
      for(let i = 0; i < mask.length; i++) mask[i] = rd[i * 4 + 3];
      URL.revokeObjectURL(resultURL);
      renderResult();
      resolve();
    };
    img.onerror = () => { URL.revokeObjectURL(resultURL); reject(new Error('Server AI result failed')); };
    img.src = resultURL;
  });
}

async function runBrowserAI(setProgress, serverError) {
  setProgress(0, 'INITIALIZING', 'Waiting for browser AI library...');

  let waited = 0;
  while(!window._segmentForeground && !window._removeBackground && waited < 30000) {
    await new Promise(r => setTimeout(r, 200));
    waited += 200;
    setProgress(Math.min(waited / 300, 10), 'LOADING', 'Loading browser AI...');
  }

  if(!window._segmentForeground && !window._removeBackground) {
    await runBackupAI(setProgress, serverError || new Error('Primary AI library failed to load'));
    return;
  }

  if(cancelled) { showScreen('editor'); return; }
  setProgress(12, 'PREPARING', 'Preparing image...');

  try {
    await runImglyAI(setProgress);
  } catch(err) {
    console.error('Browser AI error:', err);
    await runBackupAI(setProgress, err);
  }
}

async function runImglyAI(setProgress) {
  const mem = navigator.deviceMemory || 4;
  const MAX_LONG = mem <= 4 ? 1152 : 1408;
  const MAX_AREA = mem <= 4 ? 1152 * 1152 : 1408 * 1408;
  const sc = Math.min(1, MAX_LONG / Math.max(imgW, imgH), Math.sqrt(MAX_AREA / (imgW * imgH)));
  const aiW = Math.max(1, Math.round(imgW * sc));
  const aiH = Math.max(1, Math.round(imgH * sc));
  const usingProxy = sc < 0.999;

  const aiCvs = Object.assign(document.createElement('canvas'), {width: aiW, height: aiH});
  aiCvs.getContext('2d').drawImage(origCvs, 0, 0, aiW, aiH);

  if(cancelled) { showScreen('editor'); return; }
  setProgress(18, 'CONVERTING', usingProxy ? `Creating ${aiW}x${aiH} AI proxy...` : 'Encoding image...');

  const inputBlob = await new Promise(res => aiCvs.toBlob(res, 'image/jpeg', 0.92));
  if(!inputBlob) throw new Error('Image encode failed');

  if(cancelled) { showScreen('editor'); return; }

  const cfg = {
    ...(window._aiFastConfig || { model: 'small', device: 'cpu', output: { format: 'image/png', quality: 1 } }),
    progress: (key, cur, tot) => {
      if(cancelled || tot === 0) return;
      const k = String(key);
      const loading = k.includes('fetch') || k.includes('download') || k.includes('model');
      const base = loading ? 20 : 55;
      const span = loading ? 35 : 40;
      const p = base + Math.min(span, (cur / tot) * span);
      setProgress(
        p,
        loading ? 'DOWNLOADING' : 'PROCESSING',
        loading ? `Downloading AI model... (${Math.round((cur / tot) * 100)}%)` : 'Creating subject mask with AI...'
      );
    }
  };

  setProgress(20, 'DOWNLOADING', 'Fetching AI model (cached after first use)...');

  const resultBlob = window._segmentForeground
    ? await window._segmentForeground(inputBlob, cfg)
    : await window._removeBackground(inputBlob, cfg);

  if(cancelled) { showScreen('editor'); return; }
  setProgress(96, 'FINISHING', 'Applying mask...');
  await applyImglyMaskBlob(resultBlob, aiW, aiH, usingProxy);

  setProgress(100, 'DONE', 'Background removed!');
  setTimeout(()=>{
    showScreen('editor');
    document.getElementById('pinfo').textContent = `AI ok (${imgW}x${imgH})`;
    toast('AI removal complete');
  }, 400);
}

async function applyImglyMaskBlob(resultBlob, aiW, aiH, usingProxy) {
  const resultURL = URL.createObjectURL(resultBlob);
  await new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const tc = Object.assign(document.createElement('canvas'), {width: aiW, height: aiH});
      tc.getContext('2d').drawImage(img, 0, 0, aiW, aiH);
      const rd = tc.getContext('2d').getImageData(0, 0, aiW, aiH);
      pushUndo();
      upsampleAlphaMask(rd.data, aiW, aiH, i => rd.data[i + 3]);
      if(imgW * imgH <= 3000000) blurMask(usingProxy ? 1.2 : 0.6);
      URL.revokeObjectURL(resultURL);
      renderResult();
      resolve();
    };
    img.onerror = () => { URL.revokeObjectURL(resultURL); reject(new Error('Result image failed')); };
    img.src = resultURL;
  });
}

async function runBackupAI(setProgress, primaryError) {
  if(cancelled) { showScreen('editor'); return; }
  console.warn('Using backup AI removal:', primaryError);
  try {
    setProgress(18, 'BACKUP AI', 'Loading backup AI model...');
    await loadSelfieSegmentationScript();
    if(!window.SelfieSegmentation) throw new Error('Backup AI unavailable');

    const mem = navigator.deviceMemory || 4;
    const MAX_LONG = mem <= 4 ? 960 : 1280;
    const sc = Math.min(1, MAX_LONG / Math.max(imgW, imgH));
    const aiW = Math.max(1, Math.round(imgW * sc));
    const aiH = Math.max(1, Math.round(imgH * sc));
    const aiCvs = Object.assign(document.createElement('canvas'), {width: aiW, height: aiH});
    aiCvs.getContext('2d').drawImage(origCvs, 0, 0, aiW, aiH);

    setProgress(38, 'BACKUP AI', 'Creating subject mask...');
    const segmenter = new window.SelfieSegmentation({
      locateFile: file => `https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/${file}`
    });
    segmenter.setOptions({modelSelection: 1, selfieMode: false});

    const results = await new Promise((resolve, reject) => {
      let done = false;
      const timer = setTimeout(() => { if(!done) reject(new Error('Backup AI timed out')); }, 30000);
      segmenter.onResults(res => {
        done = true;
        clearTimeout(timer);
        resolve(res);
      });
      segmenter.send({image: aiCvs}).catch(reject);
    });

    if(cancelled) { segmenter.close?.(); showScreen('editor'); return; }
    if(!results || !results.segmentationMask) throw new Error('Backup AI mask failed');

    setProgress(82, 'BACKUP AI', 'Applying backup mask...');
    const maskCvs = Object.assign(document.createElement('canvas'), {width: aiW, height: aiH});
    const maskCtx = maskCvs.getContext('2d');
    maskCtx.drawImage(results.segmentationMask, 0, 0, aiW, aiH);
    const md = maskCtx.getImageData(0, 0, aiW, aiH).data;

    pushUndo();
    upsampleAlphaMask(md, aiW, aiH, readBackupMaskAlpha);
    if(imgW * imgH <= 3000000) blurMask(0.7);
    segmenter.close?.();
    renderResult();

    setProgress(100, 'DONE', 'Background removed with backup AI!');
    setTimeout(() => {
      showScreen('editor');
      document.getElementById('pinfo').textContent = `AI backup ok (${imgW}x${imgH})`;
      toast('Backup AI removal complete');
    }, 400);
  } catch(err) {
    console.error('Backup AI error:', err);
    setProgress(100, 'ERROR', 'AI removal failed: ' + (err.message || 'Unknown error'));
    document.getElementById('l-bar').style.background = 'var(--r)';
    setTimeout(() => showScreen('editor'), 3000);
  }
}

function upsampleAlphaMask(data, srcW, srcH, readAlpha) {
  const sxMap = new Uint32Array(imgW);
  for(let x = 0; x < imgW; x++) sxMap[x] = Math.min(srcW - 1, Math.floor(x * srcW / imgW)) * 4;
  for(let y = 0; y < imgH; y++) {
    const syOff = Math.min(srcH - 1, Math.floor(y * srcH / imgH)) * srcW * 4;
    const rowOff = y * imgW;
    for(let x = 0; x < imgW; x++) {
      mask[rowOff + x] = Math.max(0, Math.min(255, readAlpha(syOff + sxMap[x])));
    }
  }
}

function readBackupMaskAlpha(data, i) {
  const raw = Math.max(data[i], data[i + 1], data[i + 2], data[i + 3]);
  const p = raw / 255;
  if(p <= 0.08) return 0;
  if(p >= 0.24) return 255;
  const t = (p - 0.08) / 0.16;
  return Math.round((t * t * (3 - 2 * t)) * 255);
}

function loadSelfieSegmentationScript() {
  if(window.SelfieSegmentation) return Promise.resolve();
  if(window._selfieSegmentationLoading) return window._selfieSegmentationLoading;
  window._selfieSegmentationLoading = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation@0.1/selfie_segmentation.js';
    script.async = true;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Backup AI library failed to load'));
    document.head.appendChild(script);
  });
  return window._selfieSegmentationLoading;
}

document.getElementById('l-cancel').addEventListener('click', () => {
  cancelled = true;
  showScreen('editor');
});
