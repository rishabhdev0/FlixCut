// ─── DOWNLOAD ───────────────────────────────
function dlFile(i){
  const item=files[i];if(!item.converted.length)return;
  item.converted.forEach(({blob,name})=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),8000);});
}

document.getElementById('btn-dl-zip').addEventListener('click',downloadZip);
document.getElementById('btn-zip').addEventListener('click',downloadZip);

async function downloadZip(){
  const done=files.filter(f=>f.status==='done'&&f.converted.length);
  if(!done.length){toast('Nothing to download yet');return;}
  toast('Building ZIP...');
  try{
    const zip=new JSZip();
    for(const item of done)for(const{blob,name}of item.converted){const ab=await blob.arrayBuffer();zip.file(name,ab);}
    const zipBlob=await zip.generateAsync({type:'blob',compression:'DEFLATE',compressionOptions:{level:6}});
    const a=document.createElement('a');a.href=URL.createObjectURL(zipBlob);a.download=`pixcut-converted-${Date.now()}.zip`;a.click();
    setTimeout(()=>URL.revokeObjectURL(a.href),8000);
    toast(`ZIP ready — ${done.length} file${done.length>1?'s':''} ✓`);
  }catch(err){toast('ZIP failed: '+err.message);}
}
