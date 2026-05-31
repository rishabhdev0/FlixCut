// ── SETTINGS ───────────────────────────────────────────────
function setupSeg(id,setter){document.querySelectorAll(`#${id} .so`).forEach(o=>{o.addEventListener('click',()=>{document.querySelectorAll(`#${id} .so`).forEach(x=>x.classList.remove('on'));o.classList.add('on');setter(o.dataset.v);});});}
setupSeg('seg-size',v=>pageSize=v);
setupSeg('seg-orient',v=>orientation=v);
setupSeg('seg-margin',v=>margin=parseInt(v));
setupSeg('seg-pgpos',v=>pgNumPos=v);

function setupTog(id,init,setter){const el=document.getElementById(id);let v=init;el.addEventListener('click',()=>{v=!v;el.textContent=v?'ON':'OFF';el.classList.toggle('on',v);setter(v);});}
setupTog('tog-blank',false,v=>addBlank=v);
setupTog('tog-comp',true,v=>compress=v);
setupTog('tog-pgnum',false,v=>{addPgNums=v;document.getElementById('pgnum-opts').style.display=v?'block':'none';});
setupTog('tog-wm',false,v=>{addWm=v;document.getElementById('wm-opts').style.display=v?'flex':'none';});
setupTog('tog-pass',false,v=>{addPass=v;document.getElementById('pass-opts').style.display=v?'flex':'none';document.getElementById('sec-badge').style.display=v?'inline-flex':'none';if(v)toast('AES-256 encryption will be applied before download');});

document.getElementById('wm-text').addEventListener('input',function(){wmText=this.value;document.getElementById('wm-preview-text').textContent=this.value||'WATERMARK';});
document.getElementById('wm-op').addEventListener('input',function(){wmOpacity=this.value/100;document.getElementById('wm-op-v').textContent=this.value+'%';});
document.getElementById('wm-rot').addEventListener('input',function(){wmRotation=parseInt(this.value);document.getElementById('wm-rot-v').textContent=this.value+'°';document.getElementById('wm-preview-text').style.transform=`rotate(${this.value}deg)`;});
document.getElementById('wm-sz').addEventListener('input',function(){wmSize=parseInt(this.value);document.getElementById('wm-sz-v').textContent=this.value+'px';});
document.getElementById('user-pass').addEventListener('input',function(){
  const p=this.value;let score=0;
  if(p.length>=8)score++;if(p.length>=12)score++;if(/[A-Z]/.test(p))score++;if(/[0-9]/.test(p))score++;if(/[^A-Za-z0-9]/.test(p))score++;
  const bar=document.getElementById('pass-bar');const colors=['','var(--r)','var(--o)','var(--y)','var(--g)','var(--g)'];
  bar.style.width=(score*20)+'%';bar.style.background=colors[score]||'';
});

document.getElementById('sort-az').addEventListener('click',()=>{files.sort((a,b)=>a.name.localeCompare(b.name));renderList();toast('Sorted A–Z');});
document.getElementById('sort-size').addEventListener('click',()=>{files.sort((a,b)=>b.size-a.size);renderList();toast('Sorted by size');});
document.getElementById('sort-type').addEventListener('click',()=>{files.sort((a,b)=>Number(b.isPdf)-Number(a.isPdf));renderList();toast('Sorted by type');});
document.getElementById('clear-all').addEventListener('click',()=>{if(!files.length)return;files=[];selectedIdx=null;dz.classList.remove('compact');renderList();toast('Cleared');});
document.getElementById('btn-reset').addEventListener('click',()=>{files=[];selectedIdx=null;dz.classList.remove('compact');renderList();toast('Reset');});
document.querySelectorAll('.ph').forEach(hdr=>hdr.addEventListener('click',()=>hdr.closest('.panel').classList.toggle('coll')));
