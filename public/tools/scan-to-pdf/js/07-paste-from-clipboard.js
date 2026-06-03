// Paste from clipboard
document.addEventListener('paste',async e=>{
  const items=[...(e.clipboardData?.items||[])];
  const imgItem=items.find(it=>it.type.startsWith('image/'));
  if(!imgItem)return;
  const blob=imgItem.getAsFile();if(!blob)return;
  const pasted=window.PixCutSecurity.validateFiles([blob],{
    kinds:['image'],
    maxFiles:MAX_FILES,
    currentCount:pages.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:pages.reduce((a,p)=>a+(p.byteSize||0),0)
  });
  if(!pasted.allowed.length){window.PixCutSecurity.showValidationResult(pasted,{fallback:'Pasted image is not supported.'});return;}
  const rawUrl=await new Promise(res=>{const r=new FileReader();r.onload=ev=>res(ev.target.result);r.readAsDataURL(blob);});
  const processedUrl=await applyFilter(rawUrl);
  addPage(rawUrl,processedUrl,blob.size);
  toast('Page added from clipboard ✓');
});

async function handleFiles(list){
  const used=pages.reduce((a,p)=>a+(p.byteSize||0),0);
  const result=window.PixCutSecurity.validateFiles(list,{
    kinds:['image'],
    maxFiles:MAX_FILES,
    currentCount:pages.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:used
  });
  let arr=result.allowed;
  if(!arr.length){window.PixCutSecurity.showValidationResult(result,{fallback:'Only JPG, PNG, WebP, GIF, BMP, HEIC, or HEIF images are supported.'});return;}
  if(result.rejected.length)toast(`${result.rejected.length} image${result.rejected.length>1?'s':''} skipped. First: ${result.rejected[0].reason}`);
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
