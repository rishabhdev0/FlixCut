// ─── FILE INPUT ─────────────────────────────
const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>addFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>addFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dov'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');addFiles(e.dataTransfer.files);});

async function addFiles(list){
  const used=files.reduce((a,f)=>a+f.size,0);
  const result=window.PixCutSecurity.validateFiles(list,{
    kinds:convMode==='pdf-to-img'?['pdf']:['image'],
    maxFiles:MAX_FILES,
    currentCount:files.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:used
  });
  let arr=result.allowed;
  if(!arr.length){window.PixCutSecurity.showValidationResult(result,{fallback:'No supported files found.'});return;}
  if(result.rejected.length)toast(`${result.rejected.length} file${result.rejected.length>1?'s':''} skipped. First: ${result.rejected[0].reason}`);
  for(const f of arr){
    const thumb=f.type.startsWith('image/')?await makeThumb(f):null;
    files.push({id:Date.now()+Math.random(),file:f,name:f.name,size:f.size,type:f.type||'application/pdf',thumb,converted:[],status:'wait',outSize:0});
  }
  document.getElementById('stats-bar').style.display='grid';
  renderList();toast(`${arr.length} file${arr.length>1?'s':''} added`);
}

function makeThumb(file){
  return new Promise(res=>{
    const reader=new FileReader();
    reader.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=44;c.height=44;const ctx=c.getContext('2d');ctx.fillStyle='#f3efe4';ctx.fillRect(0,0,44,44);const r=Math.min(44/img.width,44/img.height);ctx.drawImage(img,(44-img.width*r)/2,(44-img.height*r)/2,img.width*r,img.height*r);res(c.toDataURL());};img.onerror=()=>res(null);img.src=e.target.result;};
    reader.readAsDataURL(file);
  });
}

function fmtSize(b){if(!b&&b!==0)return'—';if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+'KB';return(b/1048576).toFixed(1)+'MB';}
