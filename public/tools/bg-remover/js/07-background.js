/* ── Background ── */
function updatePreviewLayout(){
  const layout=getOutputLayout();
  canvasW=layout.cw;canvasH=layout.ch;imageX=layout.dx;imageY=layout.dy;
  bgCvs.width=canvasW;bgCvs.height=canvasH;
  bgCvs.style.left='0px';bgCvs.style.top='0px';bgCvs.style.width=canvasW+'px';bgCvs.style.height=canvasH+'px';
  [origCvs,resCvs,cropCvs,hitCvs].forEach(c=>{
    c.style.left=imageX+'px';
    c.style.top=imageY+'px';
    c.style.width=imgW+'px';
    c.style.height=imgH+'px';
  });
  CS.style.width=canvasW+'px';
  CS.style.height=canvasH+'px';
  drawBg();
  if(compareActive) updateCompareClip();
  applyZoom();
}

function drawBg() {
  bgCtx.clearRect(0,0,canvasW,canvasH);
  if(bgImg) {
    bgCtx.drawImage(bgImg, 0,0, canvasW, canvasH);
  } else if(bgColor==='transparent') {
    const s=18;
    for(let y=0;y<canvasH;y+=s) for(let x=0;x<canvasW;x+=s) {
      bgCtx.fillStyle = ((x/s+y/s)%2===0) ? '#e8e2d8' : '#f3efe4';
      bgCtx.fillRect(x,y,s,s);
    }
  } else {
    bgCtx.fillStyle = bgColor;
    bgCtx.fillRect(0,0,canvasW,canvasH);
  }
}
