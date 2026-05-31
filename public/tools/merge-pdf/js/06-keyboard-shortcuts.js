// Keyboard shortcuts
document.addEventListener('keydown',e=>{
  if(e.target.tagName==='INPUT')return;
  if(e.key==='?'){document.getElementById('shortcuts-modal').classList.add('show');return;}
  if(e.key==='a'||e.key==='A'){document.getElementById('file-input').click();return;}
  if((e.ctrlKey||e.metaKey)&&e.key==='m'){e.preventDefault();doMerge();return;}
  if((e.ctrlKey||e.metaKey)&&e.key==='x'){e.preventDefault();document.getElementById('clear-all').click();return;}
  if((e.ctrlKey||e.metaKey)&&e.key==='s'){e.preventDefault();document.getElementById('sort-az').click();return;}
  if(e.key==='ArrowUp'&&selectedIdx!==null&&selectedIdx>0){[files[selectedIdx],files[selectedIdx-1]]=[files[selectedIdx-1],files[selectedIdx]];selectedIdx--;renderList();}
  if(e.key==='ArrowDown'&&selectedIdx!==null&&selectedIdx<files.length-1){[files[selectedIdx],files[selectedIdx+1]]=[files[selectedIdx+1],files[selectedIdx]];selectedIdx++;renderList();}
  if(e.key==='Delete'&&selectedIdx!==null){files.splice(selectedIdx,1);selectedIdx=null;renderList();}
});
document.getElementById('shortcuts-btn').addEventListener('click',()=>document.getElementById('shortcuts-modal').classList.add('show'));
document.getElementById('close-modal').addEventListener('click',()=>document.getElementById('shortcuts-modal').classList.remove('show'));
document.getElementById('shortcuts-modal').addEventListener('click',e=>{if(e.target===e.currentTarget)e.currentTarget.classList.remove('show');});
