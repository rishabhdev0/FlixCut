/* ── File loading ── */
document.getElementById('file-input').addEventListener('change', e=>loadFile(e.target.files[0]));
const dz = document.getElementById('drop-zone');
dz.addEventListener('dragover', e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave', ()=>dz.classList.remove('dov'));
dz.addEventListener('drop', e=>{e.preventDefault();dz.classList.remove('dov');loadFile(e.dataTransfer.files[0]);});
document.addEventListener('paste', e=>{
  const f = [...(e.clipboardData?.files||[])].find(f=>f.type.startsWith('image/'));
  if(f) loadFile(f);
});

function loadFile(file) {
  if(!file || !file.type.startsWith('image/')) return;
  if(file.size > MAX_IMAGE_FILE_BYTES){toast('Image too large. Max 60 MB.');return;}
  cancelled = false;
  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      imgW = img.naturalWidth; imgH = img.naturalHeight;
      if(imgW * imgH > MAX_IMAGE_PIXELS){toast('Image dimensions too large. Max 50 megapixels.');return;}
      document.getElementById('orig-sz-lbl').textContent = imgW+'×'+imgH;
      [origCvs,resCvs,cropCvs,hitCvs].forEach(c=>{c.width=imgW;c.height=imgH;});
      origCtx.drawImage(img, 0, 0);
      originalPixels = origCtx.getImageData(0, 0, imgW, imgH);
      mask = new Uint8Array(imgW*imgH).fill(255);
      undoStack=[]; redoStack=[]; bgColor='transparent'; bgImg=null; currentRatio='original';
      bwMode=false; brightness=100; contrastAdj=100; saturation=100; sharpness=0; subjectOpacity=100;
      resetAdjUI();
      cropRect = {x:0,y:0,w:imgW,h:imgH};
      updateUndoBtns(); updatePreviewLayout(); drawBg(); renderResult();
      if(compareActive) setCompare(false);
      showScreen('editor');
      setTool('ai');
      requestAnimationFrame(()=>requestAnimationFrame(()=>fitZoom()));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

function resetAdjUI() {
  [['sl-br','bv',100],['sl-ct','cv',100],['sl-sa','sv',100],['sl-sh','shv',0],['sl-op','ov',100]].forEach(([id,vid,val])=>{
    document.getElementById(id).value = val;
    document.getElementById(vid).textContent = val+'%';
  });
  document.getElementById('bw-tog').textContent='OFF';
  document.getElementById('bw-tog').classList.remove('on');
  document.querySelectorAll('.rbtn').forEach(b=>b.classList.remove('on'));
  document.querySelector('[data-ratio="original"]').classList.add('on');
}
