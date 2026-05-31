// ─── IMG → IMG ──────────────────────────────
async function doImgToImg(i){
  const item=files[i];
  const c=await buildProcessedImageCanvas(item);
  const mime=outputFmt==='webp'?'image/webp':outputFmt==='jpeg'?'image/jpeg':'image/png';
  const outBlob=await c2Blob(c,mime,quality);
  item.outSize=outBlob.size;
  item.converted=[{blob:outBlob,name:buildName(item,0)}];
}

async function buildProcessedImageCanvas(item){
  const ab=await item.file.arrayBuffer();
  const blob=new Blob([ab],{type:item.type});
  const url=URL.createObjectURL(blob);
  const img=await loadImg(url);URL.revokeObjectURL(url);
  const rotated=rotation===90||rotation===270;
  const baseW=rotated?img.naturalHeight:img.naturalWidth;
  const baseH=rotated?img.naturalWidth:img.naturalHeight;
  let w=baseW,h=baseH;
  if(doResize){const{nw,nh}=calcResize(w,h);w=nw;h=nh;}
  const c=document.createElement('canvas');c.width=w;c.height=h;
  const ctx=c.getContext('2d');
  if(outputFmt==='jpeg'){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);}
  ctx.save();ctx.translate(w/2,h/2);
  if(flipH)ctx.scale(-1,1);
  ctx.rotate(rotation*Math.PI/180);
  const scale=Math.min(w/baseW,h/baseH);
  ctx.drawImage(img,-img.naturalWidth*scale/2,-img.naturalHeight*scale/2,img.naturalWidth*scale,img.naturalHeight*scale);
  ctx.restore();
  const fl=buildFilters();
  if(fl){const tmp=document.createElement('canvas');tmp.width=w;tmp.height=h;const tc=tmp.getContext('2d');tc.filter=fl;tc.drawImage(c,0,0);ctx.clearRect(0,0,w,h);ctx.drawImage(tmp,0,0);}
  applySharpness(ctx,w,h,sharpness);
  if(addWm&&wmText.trim())applyWatermark(ctx,w,h);
  return c;
}
