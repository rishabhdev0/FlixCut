/* ── Magic Wand ── */
function colorDist(d,idx,r,g,b){const dr=d[idx]-r,dg=d[idx+1]-g,db=d[idx+2]-b;return Math.sqrt(dr*dr+dg*dg+db*db);}
function runMagicWand(sx,sy,remove) {
  if(sx<0||sy<0||sx>=imgW||sy>=imgH) return;
  pushUndo();
  const data=originalPixels.data, si=(sy*imgW+sx)*4;
  const sr=data[si],sg=data[si+1],sb=data[si+2],thresh=wandTolerance,maxQ=imgW*imgH;
  const qx=new Int32Array(maxQ),qy=new Int32Array(maxQ);let head=0,tail=0;
  qx[tail]=sx;qy[tail]=sy;tail++;
  const visited=new Uint8Array(imgW*imgH);visited[sy*imgW+sx]=1;
  const DX=[-1,1,0,0],DY=[0,0,-1,1];
  while(head!==tail){
    const cx=qx[head],cy=qy[head];head++;
    const ci=(cy*imgW+cx)*4;
    if(colorDist(data,ci,sr,sg,sb)>thresh) continue;
    mask[cy*imgW+cx]=remove?0:255;
    for(let d=0;d<4;d++){
      const nx=cx+DX[d],ny=cy+DY[d];
      if(nx<0||ny<0||nx>=imgW||ny>=imgH) continue;
      const ni=ny*imgW+nx;
      if(!visited[ni]){visited[ni]=1;if(tail<maxQ){qx[tail]=nx;qy[tail]=ny;tail++;}}
    }
  }
  if(wandFeather>0) blurMask(wandFeather);
  renderResult();
}
