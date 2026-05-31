/* ── Mask operations ── */
function commitMaskEdit(before,next){
  let changed=false;
  for(let i=0;i<before.length;i++){if(before[i]!==next[i]){changed=true;break;}}
  if(!changed) return false;
  undoStack.push(before);
  if(undoStack.length>50) undoStack.shift();
  redoStack=[];
  mask=next;
  updateUndoBtns();
  renderResult();
  return true;
}
function maskNoChangeToast(){
  toast('No mask edge yet — erase, wand, crop, or run removal first');
}
function morphMask(op,radius=3){
  const before=mask.slice();
  const r=Math.ceil(radius),out=new Uint8Array(mask.length);
  for(let y=0;y<imgH;y++)for(let x=0;x<imgW;x++){
    let val=op==='grow'?0:255;
    for(let dy=-r;dy<=r;dy++)for(let dx=-r;dx<=r;dx++){
      if(dx*dx+dy*dy>r*r) continue;
      const nx=x+dx,ny=y+dy;
      if(nx<0||ny<0||nx>=imgW||ny>=imgH){
        if(op==='shrink') val=0;
        continue;
      }
      const m=mask[ny*imgW+nx];
      val=op==='grow'?Math.max(val,m):Math.min(val,m);
    }
    out[y*imgW+x]=val;
  }
  return commitMaskEdit(before,out);
}
function applyMaskBlur(radius){
  const before=mask.slice();
  blurMask(radius);
  const next=mask.slice();
  mask=before;
  return commitMaskEdit(before,next);
}
document.getElementById('mask-grow').addEventListener('click',()=>{morphMask('grow',3)?toast('Mask grown ✓'):maskNoChangeToast();});
document.getElementById('mask-shrink').addEventListener('click',()=>{morphMask('shrink',3)?toast('Mask shrunk ✓'):maskNoChangeToast();});
document.getElementById('mask-smooth').addEventListener('click',()=>{applyMaskBlur(3)?toast('Mask smoothed ✓'):maskNoChangeToast();});
document.getElementById('mask-feather').addEventListener('click',()=>{applyMaskBlur(6)?toast('Edges feathered ✓'):maskNoChangeToast();});
document.getElementById('mask-refine').addEventListener('click',()=>{const changed=morphMask('grow',2);const softened=applyMaskBlur(2);(changed||softened)?toast('Edges refined ✓'):maskNoChangeToast();});
document.getElementById('mask-invert').addEventListener('click',()=>{pushUndo();for(let i=0;i<mask.length;i++)mask[i]=255-mask[i];renderResult();toast('Mask inverted ✓');});
