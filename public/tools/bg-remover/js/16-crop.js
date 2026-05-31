/* ── Crop ── */
const HS=10;
function getCropHandles(){const{x,y,w,h}=cropRect;return[{id:'tl',x,y},{id:'tc',x:x+w/2,y},{id:'tr',x:x+w,y},{id:'ml',x,y:y+h/2},{id:'mr',x:x+w,y:y+h/2},{id:'bl',x,y:y+h},{id:'bc',x:x+w/2,y:y+h},{id:'br',x:x+w,y:y+h}];}
function drawCrop(){
  cropCtx.clearRect(0,0,imgW,imgH);
  if(currentTool!=='crop') return;
  const{x,y,w,h}=cropRect;
  cropCtx.fillStyle='rgba(24,24,24,0.45)';cropCtx.fillRect(0,0,imgW,imgH);cropCtx.clearRect(x,y,w,h);
  cropCtx.strokeStyle='#181818';cropCtx.lineWidth=2/zoom;cropCtx.strokeRect(x,y,w,h);
  const hs=HS/zoom;
  cropCtx.fillStyle='#ffdf5b';cropCtx.strokeStyle='#181818';cropCtx.lineWidth=2/zoom;
  getCropHandles().forEach(h=>{cropCtx.beginPath();cropCtx.rect(h.x-hs/2,h.y-hs/2,hs,hs);cropCtx.fill();cropCtx.stroke();});
}
function getCropHandleAt(x,y){const hs=(HS+4)/zoom;return getCropHandles().find(h=>Math.abs(h.x-x)<hs&&Math.abs(h.y-y)<hs)||null;}
function applyCrop(){
  const{x,y,w,h}=cropRect;if(w<4||h<4)return;
  const np=new ImageData(w,h);
  for(let py=0;py<h;py++)for(let px=0;px<w;px++){const si=((y+py)*imgW+(x+px))*4,di=(py*w+px)*4;np.data[di]=originalPixels.data[si];np.data[di+1]=originalPixels.data[si+1];np.data[di+2]=originalPixels.data[si+2];np.data[di+3]=originalPixels.data[si+3];}
  const nm=new Uint8Array(w*h);
  for(let py=0;py<h;py++)for(let px=0;px<w;px++) nm[py*w+px]=mask[(y+py)*imgW+(x+px)];
  pushUndo();imgW=w;imgH=h;
  [origCvs,resCvs,cropCvs,hitCvs].forEach(c=>{c.width=imgW;c.height=imgH;});
  origCtx.putImageData(np,0,0);originalPixels=np;mask=nm;
  cropRect={x:0,y:0,w:imgW,h:imgH};
  updatePreviewLayout();drawBg();renderResult();cropCtx.clearRect(0,0,imgW,imgH);
  setTool('erase');toast('Crop applied ✓');
}
