// ── FILTER ENGINE ─────────────────────────────────────────
async function applyFilter(rawUrl){
  return new Promise(res=>{
    const img=new Image();
    img.onload=()=>{
      const c=document.getElementById('proc-canvas');
      c.width=img.naturalWidth;c.height=img.naturalHeight;
      const ctx=c.getContext('2d');
      ctx.drawImage(img,0,0);
      const filters=[];
      if(scanFilter==='bw')        filters.push('grayscale(1)','contrast(1.9)','brightness(1.1)');
      else if(scanFilter==='enhance') filters.push(`brightness(${brightness/100})`,`contrast(${contrast/100})`);
      else if(scanFilter==='gray')    filters.push('grayscale(1)');
      else if(scanFilter==='magic')   filters.push('grayscale(.9)','contrast(2.2)','brightness(1.2)','saturate(.1)');
      else if(scanFilter==='vivid')   filters.push(`brightness(${brightness/100})`,`contrast(${contrast/100})`,'saturate(1.3)');
      else{if(brightness!==100)filters.push(`brightness(${brightness/100})`);if(contrast!==100)filters.push(`contrast(${contrast/100})`);}
      if(filters.length){
        const tmp=document.createElement('canvas');tmp.width=c.width;tmp.height=c.height;
        const tc=tmp.getContext('2d');tc.filter=filters.join(' ');tc.drawImage(c,0,0);
        ctx.clearRect(0,0,c.width,c.height);ctx.drawImage(tmp,0,0);
      }
      applySharpness(ctx,c.width,c.height,sharpness);
      res(c.toDataURL('image/jpeg',0.92));
    };
    img.onerror=()=>res(rawUrl);
    img.src=rawUrl;
  });
}
