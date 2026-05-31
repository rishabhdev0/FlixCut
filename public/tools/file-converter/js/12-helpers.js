// ─── HELPERS ────────────────────────────────
function buildFilters(){
  const fl=[];
  if(activeFilter==='grayscale')fl.push('grayscale(1)');
  else if(activeFilter==='sepia')fl.push('sepia(.9)');
  else if(activeFilter==='invert')fl.push('invert(1)');
  else if(activeFilter==='warm')fl.push('sepia(.3) saturate(1.2)');
  else if(activeFilter==='cool')fl.push('hue-rotate(30deg) saturate(.9)');
  if(brightness!==100)fl.push(`brightness(${brightness/100})`);
  if(contrast!==100)fl.push(`contrast(${contrast/100})`);
  if(saturation!==100)fl.push(`saturate(${saturation/100})`);
  return fl.join(' ');
}

function applySharpness(ctx,w,h,amount){
  if(!amount||amount<=0||w<3||h<3)return;
  const strength=Math.min(1,amount/100);
  const src=ctx.getImageData(0,0,w,h);
  const dst=ctx.createImageData(w,h);
  const s=src.data,d=dst.data,center=1+strength*4,side=-strength;
  for(let y=0;y<h;y++)for(let x=0;x<w;x++){
    const i=(y*w+x)*4;
    if(x===0||y===0||x===w-1||y===h-1){d[i]=s[i];d[i+1]=s[i+1];d[i+2]=s[i+2];d[i+3]=s[i+3];continue;}
    const up=i-w*4,down=i+w*4,left=i-4,right=i+4;
    for(let c=0;c<3;c++)d[i+c]=Math.max(0,Math.min(255,s[i+c]*center+s[up+c]*side+s[down+c]*side+s[left+c]*side+s[right+c]*side));
    d[i+3]=s[i+3];
  }
  ctx.putImageData(dst,0,0);
}

function processCanvas(source,fillWhite=false){
  const rotated=rotation===90||rotation===270;
  const baseW=rotated?source.height:source.width;
  const baseH=rotated?source.width:source.height;
  let w=baseW,h=baseH;
  if(doResize){const r=calcResize(w,h);w=r.nw;h=r.nh;}
  const out=document.createElement('canvas');out.width=w;out.height=h;
  const ctx=out.getContext('2d');
  if(fillWhite){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);}
  ctx.save();ctx.translate(w/2,h/2);
  if(flipH)ctx.scale(-1,1);
  ctx.rotate(rotation*Math.PI/180);
  const scale=Math.min(w/baseW,h/baseH);
  ctx.drawImage(source,-source.width*scale/2,-source.height*scale/2,source.width*scale,source.height*scale);
  ctx.restore();
  const fl=buildFilters();
  if(fl){const tmp=document.createElement('canvas');tmp.width=w;tmp.height=h;const tc=tmp.getContext('2d');tc.filter=fl;tc.drawImage(out,0,0);ctx.clearRect(0,0,w,h);if(fillWhite){ctx.fillStyle='#fff';ctx.fillRect(0,0,w,h);}ctx.drawImage(tmp,0,0);}
  applySharpness(ctx,w,h,sharpness);
  if(addWm&&wmText.trim())applyWatermark(ctx,w,h);
  return out;
}

function calcResize(w,h){
  if(!doResize)return{nw:w,nh:h};
  let nw=w,nh=h;
  if(maxW>0&&nw>maxW){if(keepAspect)nh=Math.round(nh*(maxW/nw));nw=maxW;}
  if(maxH>0&&nh>maxH){if(keepAspect)nw=Math.round(nw*(maxH/nh));nh=maxH;}
  return{nw:Math.max(1,nw),nh:Math.max(1,nh)};
}

function applyWatermark(ctx,w,h){
  if(!wmText.trim())return;
  const fontSize=Math.round(Math.min(w,h)*wmSize);
  ctx.save();ctx.font=`900 ${fontSize}px DM Sans, sans-serif`;ctx.globalAlpha=wmOpacity;ctx.fillStyle='#000';
  const tw=ctx.measureText(wmText).width;
  const positions={tl:[fontSize*0.5,fontSize],tc:[w/2-tw/2,fontSize],tr:[w-tw-fontSize*0.5,fontSize],cc:[w/2-tw/2,h/2+fontSize/2],bl:[fontSize*0.5,h-fontSize*0.3],bc:[w/2-tw/2,h-fontSize*0.3],br:[w-tw-fontSize*0.5,h-fontSize*0.3]};
  const[px,py]=positions[wmPos]||positions['cc'];
  ctx.fillText(wmText,px,py);ctx.restore();
}

function buildName(item,i,suffix='',ext=null){
  const outExt=ext||(outputFmt==='jpeg'?'jpg':outputFmt);
  if(!doRename){return item.name.replace(/\.[^.]+$/,'')+suffix+'.'+outExt;}
  const num=rnNum?`_${String(i+1).padStart(3,'0')}`:'';
  const base=item.name.replace(/\.[^.]+$/,'');
  return`${rnPrefix||''}${base}${num}${rnSuffix||''}.${outExt}`;
}

function loadImg(src){return new Promise((res,rej)=>{const i=new Image();i.onload=()=>res(i);i.onerror=rej;i.src=src;});}
function c2Blob(canvas,mime,q){return new Promise(res=>canvas.toBlob(res,mime,q));}
