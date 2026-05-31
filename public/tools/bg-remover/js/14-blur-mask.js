/* ── Blur mask ── */
function blurMask(radius) {
  const r=Math.max(1,Math.ceil(radius)),tmp=new Float32Array(mask.length),out=new Float32Array(mask.length),out2=new Float32Array(mask.length);
  for(let i=0;i<mask.length;i++) tmp[i]=mask[i];
  for(let y=0;y<imgH;y++)for(let x=0;x<imgW;x++){let s=0,c=0;for(let dx=-r;dx<=r;dx++){const nx=x+dx;if(nx>=0&&nx<imgW){s+=tmp[y*imgW+nx];c++;}}out[y*imgW+x]=s/c;}
  for(let y=0;y<imgH;y++)for(let x=0;x<imgW;x++){let s=0,c=0;for(let dy=-r;dy<=r;dy++){const ny=y+dy;if(ny>=0&&ny<imgH){s+=out[ny*imgW+x];c++;}}out2[y*imgW+x]=s/c;}
  for(let i=0;i<mask.length;i++) mask[i]=Math.round(out2[i]);
}
