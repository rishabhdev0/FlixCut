// Compress
document.getElementById('btn-compress').addEventListener('click',compressAll);

async function compressAll(){
  if(!files.length){toast('Add images before compressing');return;}
  document.getElementById('btn-compress').disabled=true;
  for(let i=0;i<files.length;i++){
    if(files[i].status==='done')continue;
    files[i].status='proc';renderList();
    try{await compressOne(i);files[i].status='done';}
    catch(err){files[i].status='error';console.error(err);toast('Error: '+files[i].name);}
    renderList();
  }
  const done=files.filter(f=>f.status==='done').length;
  toast(`Compressed ${done} image${done!==1?'s':''} ✓`);
  document.getElementById('btn-compress').disabled=false;updateActions();
}

async function compressOne(i){
  const item=files[i];
  const targetBytes=targetKB*1024;
  if(item.size<=targetBytes){
    const ab=await item.file.arrayBuffer();item.outBlob=new Blob([ab],{type:item.type});item.outSize=item.size;return;
  }
  const dataUrl=await fileToDataUrl(item.file);
  const img=await loadImg(dataUrl);
  const mime=getOutputMime(item);
  const minQ=minQFloor/100;
  let lo=minQ,hi=1.0,bestBlob=null,bestSize=Infinity,itr=0;
  while(hi-lo>0.015&&itr<22){
    const mid=(lo+hi)/2;
    const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);
    const blob=await c2Blob(c,mime,mid);itr++;
    if(compressMode==='under'){
      if(blob.size<=targetBytes){lo=mid;if(Math.abs(blob.size-targetBytes)<Math.abs(bestSize-targetBytes)){bestBlob=blob;bestSize=blob.size;}}else hi=mid;
    }else{
      if(Math.abs(blob.size-targetBytes)<Math.abs(bestSize-targetBytes)){bestBlob=blob;bestSize=blob.size;}
      if(blob.size>targetBytes)hi=mid;else lo=mid;
    }
  }
  if(!bestBlob){const c=document.createElement('canvas');c.width=img.naturalWidth;c.height=img.naturalHeight;c.getContext('2d').drawImage(img,0,0);bestBlob=await c2Blob(c,mime,minQ);bestSize=bestBlob.size;}
  item.outBlob=bestBlob;item.outSize=bestSize;
}

function getOutputMime(item){
  if(outputFmt==='same'){
    if(item.type==='image/webp')return'image/webp';
    if(item.type==='image/jpeg'||item.type==='image/jpg')return'image/jpeg';
    return'image/webp';
  }
  if(outputFmt==='webp')return'image/webp';if(outputFmt==='png')return'image/png';return'image/jpeg';
}
function fileToDataUrl(f){return new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.readAsDataURL(f);});}
function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src;});}
function c2Blob(canvas,mime,q){return new Promise(res=>canvas.toBlob(res,mime,q));}

function dlFile(i){
  const item=files[i];if(!item.outBlob)return;
  const ext=item.outBlob.type==='image/webp'?'webp':item.outBlob.type==='image/png'?'png':'jpg';
  const base=item.name.replace(/\.[^.]+$/,'');
  const a=document.createElement('a');a.href=URL.createObjectURL(item.outBlob);a.download=`${base}_compressed.${ext}`;a.click();
  setTimeout(()=>URL.revokeObjectURL(a.href),8000);
}
function dlAll(){files.filter(f=>f.status==='done').forEach((_,i)=>setTimeout(()=>dlFile(files.indexOf(_)),i*200));toast('Downloading all ✓');}
