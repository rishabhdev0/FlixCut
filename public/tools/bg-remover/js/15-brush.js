/* ── Brush ── */
function applyBrushAt(x,y,restore) {
  const r=brushSize/2,str=brushOpacity/100,hf=brushHardness/100;
  const x0=Math.max(0,Math.round(x-r)),x1=Math.min(imgW-1,Math.round(x+r));
  const y0=Math.max(0,Math.round(y-r)),y1=Math.min(imgH-1,Math.round(y+r));
  for(let py=y0;py<=y1;py++)for(let px=x0;px<=x1;px++){
    const dx=px-x,dy=py-y,dist=Math.sqrt(dx*dx+dy*dy);
    if(dist>r) continue;
    const norm=dist/r;
    let a=norm<=hf?str:str*(1-(norm-hf)/(1-hf+1e-4));
    a=Math.min(1,Math.max(0,a));
    const idx=py*imgW+px;
    mask[idx]=restore?Math.min(255,mask[idx]+Math.round(a*60)):Math.max(0,mask[idx]-Math.round(a*60));
  }
}
function brushRAFLoop(){
  if(!pendingBrushPoints.length){rafId=null;return;}
  pendingBrushPoints.splice(0).forEach(p=>applyBrushAt(p.x,p.y,currentTool==='restore'));
  renderResult();
  rafId=requestAnimationFrame(brushRAFLoop);
}
function startBrush(x,y){painting=true;pushUndo();pendingBrushPoints.push({x,y});if(!rafId)rafId=requestAnimationFrame(brushRAFLoop);}
function contBrush(x,y){if(!painting)return;pendingBrushPoints.push({x,y});if(!rafId)rafId=requestAnimationFrame(brushRAFLoop);}
function stopBrush(){painting=false;}

const br=document.getElementById('brush-ring');
function updateBrushRing(){const s=brushSize*zoom;br.style.width=s+'px';br.style.height=s+'px';}
function showRing(x,y){br.style.display='block';br.style.left=x+'px';br.style.top=y+'px';}
function hideRing(){br.style.display='none';}
