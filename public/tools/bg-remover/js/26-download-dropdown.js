/* ── Download dropdown ── */
const sizeDD=document.getElementById('size-dd');
const btnArr=document.getElementById('btn-dl-arr');
btnArr.addEventListener('click',e=>{
  e.stopPropagation();
  if(!sizeDD.classList.contains('open')){const rect=btnArr.getBoundingClientRect();sizeDD.style.left=rect.left+'px';sizeDD.style.bottom=(window.innerHeight-rect.top+8)+'px';sizeDD.style.top='auto';}
  sizeDD.classList.toggle('open');
});
document.querySelectorAll('.sz-opt').forEach(o=>{o.addEventListener('click',()=>{selectedSize=o.dataset.size;selectedFmt=o.dataset.fmt;sizeDD.classList.remove('open');doDownload(selectedSize,selectedFmt);});});
document.addEventListener('click',()=>sizeDD.classList.remove('open'));

function getOutputLayout(){
  let cw=imgW,ch=imgH,dx=0,dy=0,dw=imgW,dh=imgH;
  if(currentRatio!=='original'){
    const[rw,rh]=currentRatio.split(':').map(Number),tr=rw/rh,sr=imgW/imgH;
    if(tr>sr){cw=Math.round(imgH*tr);dx=Math.round((cw-imgW)/2);}
    else{ch=Math.round(imgW/tr);dy=Math.round((ch-imgH)/2);}
  }
  return{cw,ch,dx,dy,dw,dh};
}
function drawTextOverlays(ctx,dx,dy,dw,dh){
  document.querySelectorAll('.txt-overlay').forEach(el=>{
    const st=getComputedStyle(el);
    const scale=dw/imgW;
    const x=dx+el.offsetLeft*scale;
    const y=dy+el.offsetTop*scale;
    const size=(parseFloat(st.fontSize)||28)*scale;
    ctx.save();
    ctx.font=`${st.fontWeight||900} ${size}px ${st.fontFamily||'Arial'}`;
    ctx.fillStyle=st.color||'#fff';
    ctx.textBaseline='top';
    ctx.shadowColor='rgba(0,0,0,.5)';
    ctx.shadowBlur=8*scale;
    ctx.shadowOffsetX=2*scale;
    ctx.shadowOffsetY=2*scale;
    ctx.fillText(el.textContent,x,y);
    ctx.restore();
  });
}
function buildOutput(targetW,fmt){
  let {cw,ch,dx,dy,dw,dh}=getOutputLayout();
  if(targetW!=='original'){
    const scale=parseInt(targetW)/cw;
    cw=parseInt(targetW);ch=Math.round(ch*scale);
    dx=Math.round(dx*scale);dy=Math.round(dy*scale);dw=Math.round(dw*scale);dh=Math.round(dh*scale);
  }
  const out=Object.assign(document.createElement('canvas'),{width:cw,height:ch});
  const oc=out.getContext('2d');
  if(bgImg)oc.drawImage(bgImg,0,0,cw,ch);else if(bgColor!=='transparent'){oc.fillStyle=bgColor;oc.fillRect(0,0,cw,ch);}
  const tmp=Object.assign(document.createElement('canvas'),{width:imgW,height:imgH});
  const tc=tmp.getContext('2d');
  const src=originalPixels.data,rd=new ImageData(imgW,imgH),op=subjectOpacity/100;
  for(let i=0;i<mask.length;i++){rd.data[i*4]=src[i*4];rd.data[i*4+1]=src[i*4+1];rd.data[i*4+2]=src[i*4+2];rd.data[i*4+3]=Math.round(mask[i]*op);}
  tc.putImageData(rd,0,0);
  const fl=[];if(bwMode)fl.push('grayscale(1)');if(brightness!==100)fl.push(`brightness(${brightness/100})`);if(contrastAdj!==100)fl.push(`contrast(${contrastAdj/100})`);if(saturation!==100)fl.push(`saturate(${saturation/100})`);
  oc.filter=fl.length?fl.join(' '):'none';
  oc.drawImage(tmp,0,0,imgW,imgH,dx,dy,dw,dh);oc.filter='none';
  applySharpness(oc,cw,ch,sharpness);
  drawTextOverlays(oc,dx,dy,dw,dh);
  return{canvas:out,fmt};
}
function doDownload(size,fmt){
  if(!originalPixels)return;
  const{canvas,fmt:f}=buildOutput(size,fmt);
  const mime=f==='jpg'?'image/jpeg':'image/png';
  canvas.toBlob(blob=>{const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`pixcut-removed.${f}`;a.click();toast(`Saved as ${f.toUpperCase()} ✓`);},mime,f==='jpg'?0.92:1);
}
document.getElementById('btn-dl').addEventListener('click',()=>doDownload('original','png'));
document.getElementById('btn-copy').addEventListener('click',()=>{
  if(!originalPixels)return;
  buildOutput('original','png').canvas.toBlob(blob=>{navigator.clipboard.write([new ClipboardItem({'image/png':blob})]).then(()=>toast('Copied ✓')).catch(()=>toast('Copy failed — use Download'));
  },'image/png');
});
document.getElementById('btn-new').addEventListener('click',()=>{
  document.getElementById('file-input').value='';originalPixels=null;mask=null;undoStack=[];redoStack=[];
  if(compareActive)setCompare(false);showScreen('upload');
});
