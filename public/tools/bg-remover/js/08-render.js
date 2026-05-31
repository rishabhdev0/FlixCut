/* ── Render ── */
function renderResult() {
  if(!originalPixels || !mask) return;
  if(viewMode==='original') { resCtx.putImageData(originalPixels,0,0); resCvs.style.opacity='1'; return; }
  if(viewMode==='mask') {
    const md = new ImageData(imgW,imgH);
    for(let i=0;i<mask.length;i++) { md.data[i*4]=mask[i]; md.data[i*4+1]=mask[i]; md.data[i*4+2]=mask[i]; md.data[i*4+3]=255; }
    resCtx.putImageData(md,0,0); resCvs.style.opacity='1'; return;
  }
  const src=originalPixels.data, out=new ImageData(imgW,imgH), d=out.data, op=subjectOpacity/100;
  for(let i=0;i<mask.length;i++) {
    d[i*4]=src[i*4]; d[i*4+1]=src[i*4+1]; d[i*4+2]=src[i*4+2];
    d[i*4+3]=Math.round(mask[i]*op);
  }
  const tmp = (typeof OffscreenCanvas!=='undefined') ? new OffscreenCanvas(imgW,imgH) : Object.assign(document.createElement('canvas'),{width:imgW,height:imgH});
  const tc = tmp.getContext('2d'); tc.putImageData(out,0,0);
  resCtx.clearRect(0,0,imgW,imgH);
  const fl=[];
  if(bwMode) fl.push('grayscale(1)');
  if(brightness!==100) fl.push(`brightness(${brightness/100})`);
  if(contrastAdj!==100) fl.push(`contrast(${contrastAdj/100})`);
  if(saturation!==100) fl.push(`saturate(${saturation/100})`);
  resCtx.filter = fl.length ? fl.join(' ') : 'none';
  resCtx.drawImage(tmp,0,0);
  resCtx.filter = 'none';
  applySharpness(resCtx,imgW,imgH,sharpness);
  resCvs.style.opacity = '1';
}

function applySharpness(ctx,w,h,amount){
  if(!amount || amount<=0 || w<3 || h<3) return;
  const strength=Math.min(1,amount/100);
  const src=ctx.getImageData(0,0,w,h);
  const dst=ctx.createImageData(w,h);
  const s=src.data,d=dst.data;
  const center=1+(strength*4), side=-strength;
  for(let y=0;y<h;y++){
    for(let x=0;x<w;x++){
      const i=(y*w+x)*4;
      if(x===0||y===0||x===w-1||y===h-1){
        d[i]=s[i];d[i+1]=s[i+1];d[i+2]=s[i+2];d[i+3]=s[i+3];
        continue;
      }
      const up=i-w*4,down=i+w*4,left=i-4,right=i+4;
      for(let c=0;c<3;c++){
        d[i+c]=Math.max(0,Math.min(255,
          s[i+c]*center+s[up+c]*side+s[down+c]*side+s[left+c]*side+s[right+c]*side
        ));
      }
      d[i+3]=s[i+3];
    }
  }
  ctx.putImageData(dst,0,0);
}
