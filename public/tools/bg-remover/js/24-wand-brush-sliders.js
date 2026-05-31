/* ── Wand/brush sliders ── */
document.getElementById('wand-tol').addEventListener('input',function(){wandTolerance=parseInt(this.value);document.getElementById('wand-tol-v').textContent=this.value;});
document.getElementById('wand-fth').addEventListener('input',function(){wandFeather=parseInt(this.value);document.getElementById('wand-fth-v').textContent=this.value+'px';});
document.getElementById('brush-sz').addEventListener('input',function(){brushSize=parseInt(this.value);document.getElementById('brush-sz-v').textContent=this.value+'px';updateBrushRing();});
document.getElementById('brush-hd').addEventListener('input',function(){brushHardness=parseInt(this.value);document.getElementById('brush-hd-v').textContent=this.value+'%';});
document.getElementById('brush-op').addEventListener('input',function(){brushOpacity=parseInt(this.value);document.getElementById('brush-op-v').textContent=this.value+'%';});
