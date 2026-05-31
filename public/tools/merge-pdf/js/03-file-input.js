// ── FILE INPUT ─────────────────────────────────────────────
const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>addFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>addFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',e=>{if(!dz.contains(e.relatedTarget))dz.classList.remove('dov');});
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');addFiles(e.dataTransfer.files);});

const SUPPORTED=new Set(['application/pdf','image/jpeg','image/jpg','image/png','image/webp','image/gif','image/bmp','image/tiff']);

async function addFiles(fileList){
  let arr=[...fileList].filter(f=>SUPPORTED.has(f.type)||f.name.toLowerCase().endsWith('.pdf'));
  if(!arr.length){toast('No supported files found');return;}
  arr=arr.filter(f=>f.size<=MAX_SINGLE_FILE_BYTES);
  if(!arr.length){toast('File too large. Max 200 MB each.');return;}
  const used=files.reduce((a,f)=>a+f.size,0);
  arr=arr.slice(0,Math.max(0,MAX_FILES-files.length));
  arr=arr.filter((f,i)=>used+arr.slice(0,i+1).reduce((a,x)=>a+x.size,0)<=MAX_BATCH_BYTES);
  if(!arr.length){toast('Batch limit reached. Max 75 files / 800 MB.');return;}
  const existingNames=new Set(files.map(f=>f.name+f.size));
  for(const f of arr){
    const id=`${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const isPdf=f.type==='application/pdf'||f.name.toLowerCase().endsWith('.pdf');
    const isDup=existingNames.has(f.name+f.size);
    if(isDup)toast(`Duplicate: ${f.name}`);
    const item={id,file:f,name:f.name,size:f.size,type:f.type||'application/pdf',isPdf,thumb:null,pages:null,pgFrom:1,pgTo:null,rotation:0,isDuplicate:isDup};
    if(isPdf){
      try{const ab=await f.arrayBuffer();const doc=await PDFLib.PDFDocument.load(ab,{ignoreEncryption:true});item.pages=doc.getPageCount();item.pgTo=item.pages;item.thumb=await renderPdfThumb(new Uint8Array(ab));}catch(e){item.pages='?';item.pgTo='?';}
    }else{item.thumb=await renderImgThumb(f);}
    files.push(item);existingNames.add(f.name+f.size);
  }
  dz.classList.add('compact');renderList();toast(`Added ${arr.length} file${arr.length>1?'s':''}`);
}

async function renderPdfThumb(pdfData){
  try{const pdf=await pdfjsLib.getDocument({data:pdfData,verbosity:0}).promise;const page=await pdf.getPage(1);const vp=page.getViewport({scale:.3});const c=document.createElement('canvas');c.width=vp.width;c.height=vp.height;await page.render({canvasContext:c.getContext('2d'),viewport:vp}).promise;return c.toDataURL();}catch(e){return null;}
}
function renderImgThumb(file){
  return new Promise(res=>{
    const reader=new FileReader();
    reader.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');c.width=46;c.height=58;const ctx=c.getContext('2d');ctx.fillStyle='#f3efe4';ctx.fillRect(0,0,46,58);const r=Math.min(46/img.width,58/img.height);ctx.drawImage(img,(46-img.width*r)/2,(58-img.height*r)/2,img.width*r,img.height*r);res(c.toDataURL());};img.onerror=()=>res(null);img.src=e.target.result;};
    reader.readAsDataURL(file);
  });
}

function fmtSize(b){if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+'KB';return(b/1048576).toFixed(1)+'MB';}
