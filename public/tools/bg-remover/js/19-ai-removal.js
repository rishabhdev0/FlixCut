/* ════════════════════════════════════════
   AI REMOVAL — complete, working version
   ════════════════════════════════════════ */
document.getElementById('run-ai-btn').addEventListener('click', runAI);

async function runAI() {
  if(!originalPixels) return;
  cancelled = false;

  // Show loading screen with animation
  showScreen('loading');
  const lbar   = document.getElementById('l-bar');
  const lmsg   = document.getElementById('l-msg');
  const lstage = document.getElementById('l-stage');
  const lpct   = document.getElementById('l-pct');
  lbar.style.background = '';

  function setProgress(pct, stage, msg) {
    lbar.style.width = pct+'%';
    lpct.textContent = Math.round(pct)+'%';
    if(stage) lstage.textContent = stage;
    if(msg)   lmsg.textContent   = msg;
  }

  setProgress(0, 'INITIALIZING', 'Waiting for AI library...');

  // Wait up to 30s for the ES module to load
  let waited = 0;
  while(!window._segmentForeground && !window._removeBackground && waited < 30000) {
    await new Promise(r=>setTimeout(r,200));
    waited += 200;
    setProgress(Math.min(waited/300, 10), 'LOADING', 'Loading AI library...');
  }

  if(!window._segmentForeground && !window._removeBackground) {
    setProgress(100,'ERROR','AI library failed to load — check internet connection');
    document.getElementById('l-bar').style.background='var(--r)';
    setTimeout(()=>showScreen('editor'), 3000);
    return;
  }

  if(cancelled) { showScreen('editor'); return; }
  setProgress(12, 'PREPARING', 'Preparing image...');

  try {
    // Build an adaptive AI proxy. The final download still keeps full original size.
    const mem = navigator.deviceMemory || 4;
    const MAX_LONG = mem <= 4 ? 1152 : 1408;
    const MAX_AREA = mem <= 4 ? 1152*1152 : 1408*1408;
    const sc  = Math.min(1, MAX_LONG / Math.max(imgW, imgH), Math.sqrt(MAX_AREA / (imgW * imgH)));
    const aiW = Math.max(1, Math.round(imgW * sc));
    const aiH = Math.max(1, Math.round(imgH * sc));
    const usingProxy = sc < 0.999;

    // Scale the already-loaded original canvas for AI without another full-size copy.
    const aiCvs = Object.assign(document.createElement('canvas'),{width:aiW,height:aiH});
    aiCvs.getContext('2d').drawImage(origCvs, 0, 0, aiW, aiH);

    if(cancelled) { showScreen('editor'); return; }
    setProgress(18, 'CONVERTING', usingProxy ? `Creating ${aiW}×${aiH} AI proxy...` : 'Encoding image...');

    const inputBlob = await new Promise(res => aiCvs.toBlob(res, 'image/jpeg', 0.92));
    if(!inputBlob) throw new Error('Image encode failed');

    if(cancelled) { showScreen('editor'); return; }

    const cfg = {
      ...(window._aiFastConfig || { model: 'small', device: 'cpu', output: { format: 'image/png', quality: 1 } }),
      progress: (key, cur, tot) => {
        if(cancelled) return;
        if(tot === 0) return;
        const k = String(key);
        const loading = k.includes('fetch') || k.includes('download') || k.includes('model');
        const base = loading ? 20 : 55;
        const span = loading ? 35 : 40;
        const p = base + Math.min(span, (cur/tot)*span);
        const stage = loading ? 'DOWNLOADING' : 'PROCESSING';
        const msg   = loading
          ? `Downloading AI model... (${Math.round((cur/tot)*100)}%)`
          : 'Creating subject mask with AI...';
        setProgress(p, stage, msg);
      }
    };

    setProgress(20, 'DOWNLOADING', 'Fetching AI model (cached after first use)...');

    const resultBlob = window._segmentForeground
      ? await window._segmentForeground(inputBlob, cfg)
      : await window._removeBackground(inputBlob, cfg);

    if(cancelled) { showScreen('editor'); return; }
    setProgress(96, 'FINISHING', 'Applying mask...');

    // Decode result
    const resultURL = URL.createObjectURL(resultBlob);
    await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        // Read alpha at AI resolution
        const tc = Object.assign(document.createElement('canvas'),{width:aiW,height:aiH});
        tc.getContext('2d').drawImage(img, 0, 0, aiW, aiH);
        const rd = tc.getContext('2d').getImageData(0, 0, aiW, aiH);

        pushUndo();

        // Upsample mask back to full resolution without resizing the final image.
        const sxMap = new Uint32Array(imgW);
        for(let x=0;x<imgW;x++) sxMap[x] = Math.min(aiW-1, Math.floor(x*aiW/imgW)) * 4;
        for(let y=0;y<imgH;y++) {
          const syOff = Math.min(aiH-1, Math.floor(y*aiH/imgH)) * aiW * 4;
          const rowOff = y * imgW;
          for(let x=0;x<imgW;x++) {
            mask[rowOff+x] = rd.data[syOff + sxMap[x] + 3];
          }
        }
        if(imgW * imgH <= 3000000) blurMask(usingProxy ? 1.2 : 0.6);

        URL.revokeObjectURL(resultURL);
        renderResult();
        setProgress(100, 'DONE', 'Background removed!');
        setTimeout(()=>{
          showScreen('editor');
          document.getElementById('pinfo').textContent = `AI ✓ (${imgW}×${imgH})`;
          toast('AI removal complete ✓');
        }, 400);
        resolve();
      };
      img.onerror = () => { URL.revokeObjectURL(resultURL); reject(new Error('Result image failed')); };
      img.src = resultURL;
    });

  } catch(err) {
    if(!cancelled) {
      console.error('AI error:', err);
      setProgress(100, 'ERROR', '⚠ ' + (err.message||'Unknown error'));
      document.getElementById('l-bar').style.background='var(--r)';
      setTimeout(()=>showScreen('editor'), 3000);
    }
  }
}

document.getElementById('l-cancel').addEventListener('click',()=>{
  cancelled=true;
  showScreen('editor');
});
