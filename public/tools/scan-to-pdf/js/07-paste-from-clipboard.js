// Paste from clipboard
document.addEventListener('paste',async e=>{
  const items=[...(e.clipboardData?.items||[])];
  const imgItem=items.find(it=>it.type.startsWith('image/'));
  if(!imgItem)return;
  const blob=imgItem.getAsFile();if(!blob)return;
  const rawUrl=await new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(blob);});
  const processedUrl=await applyFilter(rawUrl);
  addPage(rawUrl,processedUrl);
  toast('Page added from clipboard ✓');
});

async function handleFiles(list){
  let arr=[...list].filter(f=>f.type.startsWith('image/'));
  if(!arr.length){toast('Only image files supported');return;}
  arr=arr.filter(f=>f.size<=MAX_SINGLE_FILE_BYTES);
  if(!arr.length){toast('Image too large. Max 60 MB each.');return;}
  const used=pages.reduce((a,p)=>a+(p.byteSize||0),0);
  arr=arr.slice(0,Math.max(0,MAX_FILES-pages.length));
  arr=arr.filter((f,i)=>used+arr.slice(0,i+1).reduce((a,x)=>a+x.size,0)<=MAX_BATCH_BYTES);
  if(!arr.length){toast('Batch limit reached. Max 60 pages / 500 MB.');return;}
  for(const f of arr){
    const rawUrl=await fileToDataUrl(f);
    const processedUrl=await applyFilter(rawUrl);
    addPage(rawUrl,processedUrl,f.size);
  }
  toast(`${arr.length} page${arr.length>1?'s':''} added`);
}

function fileToDataUrl(f){
  return new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.readAsDataURL(f);});
}
