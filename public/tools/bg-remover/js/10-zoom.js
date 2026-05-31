/* ── Zoom ── */
function applyZoom() {
  CS.style.transform = 'scale('+zoom+')';
  CS.style.transformOrigin = 'top left';
  CS.style.width = canvasW+'px';
  CS.style.height = canvasH+'px';
  const scaledW = canvasW*zoom, scaledH = canvasH*zoom;
  CS.style.left = Math.max(0,(CC.clientWidth-scaledW)/2)+'px';
  CS.style.top = Math.max(0,(CC.clientHeight-scaledH)/2)+'px';
  CC.style.overflow = (scaledW>CC.clientWidth||scaledH>CC.clientHeight) ? 'auto' : 'hidden';
  document.getElementById('zoom-pct').textContent = Math.round(zoom*100)+'%';
  updateBrushRing();
}
function fitZoom() {
  const cW=CC.clientWidth||800, cH=CC.clientHeight||500;
  zoom = Math.min(1, (cW-4)/canvasW, (cH-4)/canvasH);
  zoom = Math.max(0.04, zoom);
  applyZoom();
}
document.getElementById('zoom-in').addEventListener('click',()=>{zoom=Math.min(zoom*1.3,8);applyZoom();});
document.getElementById('zoom-out').addEventListener('click',()=>{zoom=Math.max(zoom/1.3,0.05);applyZoom();});
document.getElementById('zoom-fit').addEventListener('click',fitZoom);
document.getElementById('zoom-1').addEventListener('click',()=>{zoom=1;applyZoom();});
CC.addEventListener('wheel',e=>{
  if(e.ctrlKey||e.metaKey){e.preventDefault();zoom=e.deltaY<0?Math.min(zoom*1.1,8):Math.max(zoom/1.1,0.05);applyZoom();}
},{passive:false});
window.addEventListener('resize',()=>{if(originalPixels) fitZoom();});
