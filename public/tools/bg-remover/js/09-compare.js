/* ── Compare ── */
function setCompare(on) {
  compareActive = on;
  const btn = document.getElementById('btn-compare');
  btn.style.background = on?'var(--ink)':'var(--y)';
  btn.style.color = on?'#fff':'var(--ink)';
  if(on) {
    compHandle.style.display='block'; lblBefore.style.display='block'; lblAfter.style.display='block';
    if(viewMode!=='result') { viewMode='result'; document.querySelectorAll('.vtab').forEach(x=>x.classList.remove('on')); document.querySelector('[data-view="result"]').classList.add('on'); renderResult(); }
    updateCompareClip();
  } else {
    compHandle.style.display='none'; lblBefore.style.display='none'; lblAfter.style.display='none';
    origCvs.style.opacity='0'; origCvs.style.clipPath=''; resCvs.style.clipPath='';
  }
}
function updateCompareClip() {
  if(!compareActive) return;
  origCvs.style.opacity='1';
  origCvs.style.clipPath=`inset(0 ${(100-comparePct).toFixed(2)}% 0 0)`;
  resCvs.style.clipPath=`inset(0 0 0 ${comparePct.toFixed(2)}%)`;
  compHandle.style.left=comparePct+'%';
}
document.getElementById('btn-compare').addEventListener('click',()=>setCompare(!compareActive));
compHandle.addEventListener('mousedown',e=>{e.stopPropagation();cmpDragging=true;document.addEventListener('mousemove',onCmpDrag);document.addEventListener('mouseup',()=>{cmpDragging=false;document.removeEventListener('mousemove',onCmpDrag);},{once:true});});
function onCmpDrag(e) {
  if(!cmpDragging) return;
  const r=CS.getBoundingClientRect();
  comparePct=Math.max(1,Math.min(99,((e.clientX-r.left)/r.width)*100));
  updateCompareClip();
}
