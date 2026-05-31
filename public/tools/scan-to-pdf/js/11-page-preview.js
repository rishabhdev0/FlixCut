// ── PAGE PREVIEW ──────────────────────────────────────────
function openPreview(i){
  document.getElementById('preview-title').textContent=`Page ${i+1} of ${pages.length}`;
  document.getElementById('preview-img').src=pages[i].processedUrl;
  document.getElementById('preview-modal').classList.add('show');
}
document.getElementById('preview-close').addEventListener('click',()=>document.getElementById('preview-modal').classList.remove('show'));
document.getElementById('preview-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('show');});
