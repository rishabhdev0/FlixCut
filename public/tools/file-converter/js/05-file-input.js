// ─── FILE INPUT ─────────────────────────────
const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>addFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>addFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dov'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');addFiles(e.dataTransfer.files);});

async function addFiles(list){
  const allowed=convMode==='pdf-to-img'
    ? f=>f.type==='application/pdf'||f.name.toLowerCase().endsWith('.pdf')
    : f=>f.type.startsWith('image/');
  let arr=[...list].filter(allowed);if(!arr.length){toast('No supported files found');return;}
  arr=arr.filter(f=>f.size<=MAX_SINGLE_FILE_BYTES);
  if(!arr.length){toast('File too large. Max 150 MB each.');return;}
  const used=files.reduce((a,f)=>a+f.size,0);
  arr=arr.slice(0,Math.max(0,MAX_FILES-files.length));
  arr=arr.filter((f,i)=>used+arr.slice(0,i+1).reduce((a,x)=>a+x.size,0)<=MAX_BATCH_BYTES);
  if(!arr.length){toast('Batch limit reached. Max 50 files / 600 MB.');return;}
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
