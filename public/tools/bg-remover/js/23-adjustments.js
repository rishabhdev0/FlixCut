/* ── Adjustments ── */
document.getElementById('bw-tog').addEventListener('click',function(){bwMode=!bwMode;this.textContent=bwMode?'ON':'OFF';this.classList.toggle('on',bwMode);renderResult();});
[['sl-br','bv',v=>brightness=v],['sl-ct','cv',v=>contrastAdj=v],['sl-sa','sv',v=>saturation=v],['sl-sh','shv',v=>sharpness=v],['sl-op','ov',v=>subjectOpacity=v]].forEach(([id,vid,set])=>{
  document.getElementById(id).addEventListener('input',function(){document.getElementById(vid).textContent=this.value+'%';set(parseInt(this.value));renderResult();});
});
document.querySelectorAll('.rbtn').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('.rbtn').forEach(b=>b.classList.remove('on'));
    btn.classList.add('on');
    currentRatio=btn.dataset.ratio;
    updatePreviewLayout();
    renderResult();
    fitZoom();
  });
});
