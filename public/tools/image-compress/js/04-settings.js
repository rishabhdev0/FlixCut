// Settings
function setupSeg(id,setter){document.querySelectorAll(`#${id} .so`).forEach(o=>{o.addEventListener('click',()=>{document.querySelectorAll(`#${id} .so`).forEach(x=>x.classList.remove('on'));o.classList.add('on');setter(o.dataset.v);});});}
setupSeg('seg-fmt',v=>outputFmt=v);
setupSeg('seg-floor',v=>minQFloor=parseInt(v));
document.querySelectorAll('.ph').forEach(h=>h.addEventListener('click',()=>h.closest('.panel').classList.toggle('coll')));
document.getElementById('btn-clear').addEventListener('click',()=>{files=[];renderList();toast('Cleared');});
document.getElementById('btn-reset').addEventListener('click',()=>{files=[];renderList();toast('Cleared');});
document.getElementById('btn-dl-all').addEventListener('click',dlAll);
document.getElementById('btn-dl-all2').addEventListener('click',dlAll);
