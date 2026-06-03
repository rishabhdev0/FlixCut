// ── FILE INPUT ─────────────────────────────────────────────
const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>addFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>addFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',e=>{if(!dz.contains(e.relatedTarget))dz.classList.remove('dov');});
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');addFiles(e.dataTransfer.files);});

const SUPPORTED=new Set(['application/pdf','image/jpeg','image/jpg','image/png','image/webp','image/gif','image/bmp','image/tiff']);

async function addFiles(fileList){
  const used=files.reduce((a,f)=>a+f.size,0);
  const result=window.PixCutSecurity.validateFiles(fileList,{
    kinds:['pdf','image'],
    maxFiles:MAX_FILES,
    currentCount:files.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:used
  });
  let arr=result.allowed;
  if(!arr.length){window.PixCutSecurity.showValidationResult(result,{fallback:'Add PDFs or supported image files.'});return;}
  if(result.rejected.length)toast(`${result.rejected.length} file${result.rejected.length>1?'s':''} skipped. First: ${result.rejected[0].reason}`);
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
