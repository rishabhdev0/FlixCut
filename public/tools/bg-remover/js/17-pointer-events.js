/* ── Pointer events ── */
hitCvs.addEventListener('mousedown',onDown);
hitCvs.addEventListener('mousemove',onMove);
hitCvs.addEventListener('mouseup',onUp);
hitCvs.addEventListener('mouseleave',()=>{hideRing();stopBrush();});
hitCvs.addEventListener('contextmenu',e=>{e.preventDefault();if(currentTool==='wand'){const{x,y}=getImgCoords(e);runMagicWand(x,y,false);}});
hitCvs.addEventListener('touchstart',e=>{e.preventDefault();onDown(e);},{passive:false});
hitCvs.addEventListener('touchmove',e=>{e.preventDefault();onMove(e);},{passive:false});
hitCvs.addEventListener('touchend',e=>{e.preventDefault();onUp(e);},{passive:false});

function onDown(e){
  const{x,y}=getImgCoords(e);
  if(currentTool==='pan'){panning=true;panStart={x:e.clientX||(e.touches&&e.touches[0].clientX)||0,y:e.clientY||(e.touches&&e.touches[0].clientY)||0};scrollStart={x:CC.scrollLeft,y:CC.scrollTop};return;}
  if(currentTool==='crop'){const h=getCropHandleAt(x,y);if(h){cropDragging=true;cropHandle=h.id;cropStart={x,y,rect:{...cropRect}};}else if(x>=cropRect.x&&x<=cropRect.x+cropRect.w&&y>=cropRect.y&&y<=cropRect.y+cropRect.h){cropDragging=true;cropHandle='move';cropStart={x,y,rect:{...cropRect}};}return;}
  if(currentTool==='wand'){runMagicWand(x,y,true);return;}
  if(currentTool==='erase'||currentTool==='restore') startBrush(x,y);
}
function onMove(e){
  const{x,y}=getImgCoords(e);
  const r=hitCvs.getBoundingClientRect();
  const cx=(e.touches?e.touches[0].clientX:e.clientX)-r.left;
  const cy=(e.touches?e.touches[0].clientY:e.clientY)-r.top;
  if(currentTool==='pan'&&panning){const mx=e.clientX||(e.touches&&e.touches[0].clientX)||0,my=e.clientY||(e.touches&&e.touches[0].clientY)||0;CC.scrollLeft=scrollStart.x-(mx-panStart.x);CC.scrollTop=scrollStart.y-(my-panStart.y);return;}
  if(currentTool==='crop'&&cropDragging){
    const dx=x-cropStart.x,dy=y-cropStart.y,r0=cropStart.rect;
    if(cropHandle==='move'){cropRect.x=Math.max(0,Math.min(imgW-cropRect.w,r0.x+dx));cropRect.y=Math.max(0,Math.min(imgH-cropRect.h,r0.y+dy));}
    else{let{x:rx,y:ry,w:rw,h:rh}=r0;if(cropHandle.includes('l')){rx+=dx;rw-=dx;}if(cropHandle.includes('r'))rw+=dx;if(cropHandle.includes('t')){ry+=dy;rh-=dy;}if(cropHandle.includes('b'))rh+=dy;if(rw>10&&rh>10)cropRect={x:Math.max(0,rx),y:Math.max(0,ry),w:Math.min(imgW,rw),h:Math.min(imgH,rh)};}
    drawCrop();return;
  }
  if(currentTool==='erase'||currentTool==='restore'){showRing(cx,cy);contBrush(x,y);}
  else hideRing();
}
function onUp(){panning=false;cropDragging=false;stopBrush();}
