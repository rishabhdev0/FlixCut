// ─── SETTINGS ───────────────────────────────
function setupSeg(id,setter){document.querySelectorAll(`#${id} .so`).forEach(o=>{o.addEventListener('click',()=>{document.querySelectorAll(`#${id} .so`).forEach(x=>x.classList.remove('on'));o.classList.add('on');setter(o.dataset.v);});});}
setupSeg('seg-fmt',v=>{outputFmt=v;updateRenamePreview();});
setupSeg('seg-pdf-size',v=>pdfPageSize=v);
setupSeg('seg-pdf-orient',v=>pdfOrient=v);
setupSeg('seg-pdf-fmt',v=>pdfImgFmt=v);
setupSeg('seg-pdf-scale',v=>pdfScale=parseInt(v));
setupSeg('seg-rot',v=>rotation=parseInt(v));
setupSeg('seg-wm-pos',v=>wmPos=v);

document.getElementById('sl-qual').addEventListener('input',function(){quality=this.value/100;document.getElementById('qual-v').textContent=this.value+'%';});
document.getElementById('sl-bri').addEventListener('input',function(){brightness=parseInt(this.value);document.getElementById('bri-v').textContent=this.value+'%';});
document.getElementById('sl-con').addEventListener('input',function(){contrast=parseInt(this.value);document.getElementById('con-v').textContent=this.value+'%';});
document.getElementById('sl-sat').addEventListener('input',function(){saturation=parseInt(this.value);document.getElementById('sat-v').textContent=this.value+'%';});
document.getElementById('sl-sha').addEventListener('input',function(){sharpness=parseInt(this.value);document.getElementById('sha-v').textContent=this.value+'%';});

document.querySelectorAll('.filter-chips .fc').forEach(fc=>{fc.addEventListener('click',()=>{document.querySelectorAll('.filter-chips .fc').forEach(x=>x.classList.remove('on'));fc.classList.add('on');activeFilter=fc.dataset.filter;});});

function setupTog(id,init,setter){const el=document.getElementById(id);let v=init;el.addEventListener('click',()=>{v=!v;el.textContent=v?'ON':'OFF';el.classList.toggle('on',v);setter(v);});}
setupTog('tog-resize',false,v=>{doResize=v;document.getElementById('resize-opts').style.display=v?'flex':'none';});
setupTog('tog-aspect',true,v=>keepAspect=v);
setupTog('tog-fliph',false,v=>flipH=v);
setupTog('tog-exif',true,v=>stripExif=v);
setupTog('tog-onepdf',false,v=>onePdfPerImg=v);
setupTog('tog-wm',false,v=>{addWm=v;document.getElementById('wm-opts').style.display=v?'flex':'none';});
setupTog('tog-rename',false,v=>{doRename=v;document.getElementById('rename-opts').style.display=v?'flex':'none';});
setupTog('tog-rn-num',true,v=>{rnNum=v;updateRenamePreview();});

document.getElementById('max-w').addEventListener('input',function(){maxW=parseInt(this.value)||0;});
document.getElementById('max-h').addEventListener('input',function(){maxH=parseInt(this.value)||0;});
document.getElementById('wm-text').addEventListener('input',function(){wmText=this.value;document.getElementById('wm-prev-text').textContent=this.value||'WATERMARK';});
document.getElementById('wm-op').addEventListener('input',function(){wmOpacity=this.value/100;document.getElementById('wm-op-v').textContent=this.value+'%';});
document.getElementById('wm-sz').addEventListener('input',function(){wmSize=this.value/100;document.getElementById('wm-sz-v').textContent=this.value+'%';});
document.getElementById('rn-prefix').addEventListener('input',function(){rnPrefix=this.value;updateRenamePreview();});
document.getElementById('rn-suffix').addEventListener('input',function(){rnSuffix=this.value;updateRenamePreview();});

function updateRenamePreview(){const ext=outputFmt==='jpeg'?'jpg':outputFmt;const num=rnNum?'_001':'';document.getElementById('rename-preview').textContent=`${rnPrefix||''}image${num}${rnSuffix||''}.${ext}`;}

document.querySelectorAll('.ph').forEach(hdr=>hdr.addEventListener('click',()=>hdr.closest('.panel').classList.toggle('coll')));
document.getElementById('btn-clear').addEventListener('click',()=>{files=[];renderList();document.getElementById('stats-bar').style.display='none';toast('Cleared');});
document.getElementById('btn-reset').addEventListener('click',()=>{files=[];renderList();document.getElementById('stats-bar').style.display='none';toast('Cleared');});
