// ── SETTINGS ─────────────────────────────────────────────
document.querySelectorAll('.fchip').forEach(c=>{
  c.addEventListener('click',()=>{
    document.querySelectorAll('.fchip').forEach(x=>x.classList.remove('on'));
    c.classList.add('on');scanFilter=c.dataset.f;
    document.getElementById('s-filter').textContent=c.textContent;
    if(applyToAll&&pages.length)reprocessAll();
  });
});

document.getElementById('sl-bri').addEventListener('input',function(){brightness=parseInt(this.value);document.getElementById('bri-v').textContent=this.value+'%';if(applyToAll&&pages.length)debouncedReprocess();});
document.getElementById('sl-con').addEventListener('input',function(){contrast=parseInt(this.value);document.getElementById('con-v').textContent=this.value+'%';if(applyToAll&&pages.length)debouncedReprocess();});
document.getElementById('sl-sha').addEventListener('input',function(){sharpness=parseInt(this.value);document.getElementById('sha-v').textContent=this.value+'%';if(applyToAll&&pages.length)debouncedReprocess();});

let reprocessTimer;
function debouncedReprocess(){clearTimeout(reprocessTimer);reprocessTimer=setTimeout(reprocessAll,400);}

async function reprocessAll(){
  for(let i=0;i<pages.length;i++){
    pages[i].processedUrl=await applyFilter(pages[i].rawUrl);
  }
  renderPages();
}

function setupSeg(id,setter){
  document.querySelectorAll(`#${id} .so`).forEach(o=>{
    o.addEventListener('click',()=>{document.querySelectorAll(`#${id} .so`).forEach(x=>x.classList.remove('on'));o.classList.add('on');setter(o.dataset.v);updateSummary();});
  });
}
setupSeg('seg-size',v=>pageSize=v);
setupSeg('seg-orient',v=>orientation=v);
setupSeg('seg-qual',v=>quality=parseFloat(v));

function setupTog(id,init,setter){
  const el=document.getElementById(id);let v=init;
  el.addEventListener('click',()=>{v=!v;el.textContent=v?'ON':'OFF';el.classList.toggle('on',v);setter(v);});
}
setupTog('tog-all',true,v=>applyToAll=v);
setupTog('tog-pgnum',false,v=>addPageNums=v);

function updateSummary(){
  document.getElementById('s-pgsize').textContent=pageSize;
  document.getElementById('s-orient').textContent=orientation.charAt(0).toUpperCase()+orientation.slice(1);
}

document.querySelectorAll('.ph').forEach(h=>h.addEventListener('click',()=>h.closest('.panel').classList.toggle('coll')));
document.getElementById('btn-clear-all').addEventListener('click',()=>{pages=[];renderPages();toast('All pages cleared');});
document.getElementById('btn-reset').addEventListener('click',()=>{pages=[];renderPages();toast('Reset');});
