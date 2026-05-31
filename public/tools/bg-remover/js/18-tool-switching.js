/* ── Tool switching ── */
function setTool(name){
  currentTool=name;
  document.querySelectorAll('[data-tool]').forEach(b=>b.classList.toggle('active',b.dataset.tool===name));
  ['ai-opts','wand-opts','brush-opts','crop-opts','pan-opts'].forEach(id=>document.getElementById(id).style.display='none');
  const map={ai:'ai-opts',wand:'wand-opts',erase:'brush-opts',restore:'brush-opts',crop:'crop-opts',pan:'pan-opts'};
  if(map[name]) document.getElementById(map[name]).style.display='flex';
  const names={ai:'AI Auto Remove',wand:'Magic Wand',erase:'Erase Brush',restore:'Restore Brush',crop:'Crop Tool',pan:'Pan & Zoom'};
  document.getElementById('tool-name').textContent=names[name]||name;
  hitCvs.style.cursor=name==='pan'?'grab':name==='crop'?'crosshair':name==='wand'?'cell':'none';
  if(name==='crop'){cropRect={x:0,y:0,w:imgW,h:imgH};drawCrop();}else cropCtx.clearRect(0,0,imgW,imgH);
  if(name==='erase'||name==='restore') updateBrushRing(); else hideRing();
}
document.querySelectorAll('[data-tool]').forEach(btn=>btn.addEventListener('click',()=>setTool(btn.dataset.tool)));
document.getElementById('apply-crop-btn').addEventListener('click',applyCrop);
document.getElementById('cancel-crop-btn').addEventListener('click',()=>{cropCtx.clearRect(0,0,imgW,imgH);setTool('erase');});
document.getElementById('btn-reset-mask').addEventListener('click',()=>{pushUndo();mask.fill(255);renderResult();toast('Mask reset');});
document.getElementById('btn-invert').addEventListener('click',()=>{pushUndo();for(let i=0;i<mask.length;i++)mask[i]=255-mask[i];renderResult();toast('Mask inverted');});
