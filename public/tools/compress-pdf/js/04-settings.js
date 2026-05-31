// Settings
function setupTog(id,init,setter){
  const el=document.getElementById(id);let v=init;
  el.addEventListener('click',()=>{v=!v;el.textContent=v?'ON':'OFF';el.classList.toggle('on',v);setter(v);});
}
setupTog('tog-meta',true,v=>stripMeta=v);
document.getElementById('tog-ann').addEventListener('click',()=>toast('Annotation removal needs a deeper PDF parser; disabled for now'));
setupTog('tog-recomp',true,v=>{recompImages=v;document.getElementById('img-qual-row').style.opacity=v?1:.4;});
setupTog('tog-obj',true,v=>useObjStreams=v);
document.getElementById('sl-iq').addEventListener('input',function(){imgQuality=this.value/100;document.getElementById('iq-v').textContent=this.value+'%';});
document.querySelectorAll('.ph').forEach(h=>h.addEventListener('click',()=>h.closest('.panel').classList.toggle('coll')));
document.getElementById('btn-reset').addEventListener('click',()=>{files=[];renderCards();toast('Cleared');});
document.getElementById('btn-compress').addEventListener('click',compressAll);
