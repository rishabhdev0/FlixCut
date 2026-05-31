/* ── Undo/Redo ── */
function pushUndo(){undoStack.push(mask.slice());if(undoStack.length>50)undoStack.shift();redoStack=[];updateUndoBtns();}
function undo(){if(!undoStack.length)return;redoStack.push(mask.slice());mask=undoStack.pop();updateUndoBtns();renderResult();}
function redo(){if(!redoStack.length)return;undoStack.push(mask.slice());mask=redoStack.pop();updateUndoBtns();renderResult();}
function updateUndoBtns(){
  ['btn-undo','undo-btn'].forEach(id=>document.getElementById(id).disabled=!undoStack.length);
  ['btn-redo','redo-btn'].forEach(id=>document.getElementById(id).disabled=!redoStack.length);
}
document.getElementById('btn-undo').addEventListener('click',undo);
document.getElementById('btn-redo').addEventListener('click',redo);
document.getElementById('undo-btn').addEventListener('click',undo);
document.getElementById('redo-btn').addEventListener('click',redo);
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT') return;
  if((e.ctrlKey||e.metaKey)&&e.key==='z'){e.preventDefault();undo();}
  if((e.ctrlKey||e.metaKey)&&(e.key==='y'||e.key==='Y')){e.preventDefault();redo();}
  if(e.key==='e'||e.key==='E') setTool('erase');
  if(e.key==='r'||e.key==='R') setTool('restore');
  if(e.key==='='||e.key==='+'){zoom=Math.min(zoom*1.2,8);applyZoom();}
  if(e.key==='-'){zoom=Math.max(zoom/1.2,0.05);applyZoom();}
  if(e.key==='0') fitZoom();
  if(e.key==='['){brushSize=Math.max(2,brushSize-4);document.getElementById('brush-sz').value=brushSize;document.getElementById('brush-sz-v').textContent=brushSize+'px';updateBrushRing();}
  if(e.key===']'){brushSize=Math.min(120,brushSize+4);document.getElementById('brush-sz').value=brushSize;document.getElementById('brush-sz-v').textContent=brushSize+'px';updateBrushRing();}
});
