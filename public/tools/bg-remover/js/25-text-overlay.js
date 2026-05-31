/* ── Text overlay ── */
document.getElementById('add-txt-btn').addEventListener('click',()=>{
  const txt=document.getElementById('txt-in').value.trim();if(!txt)return;
  const el=document.createElement('div');el.className='txt-overlay';el.textContent=txt;el.style.top='40%';el.style.left='10%';
  CS.appendChild(el);makeDraggable(el);document.getElementById('txt-in').value='';
  toast('Text added — drag to position, double-click to remove');
});
function makeDraggable(el){
  let ox,oy,sl,st;
  el.addEventListener('mousedown',e=>{e.stopPropagation();ox=e.clientX;oy=e.clientY;sl=el.offsetLeft;st=el.offsetTop;const mv=ev=>{el.style.left=(sl+ev.clientX-ox)+'px';el.style.top=(st+ev.clientY-oy)+'px';};const up=()=>{document.removeEventListener('mousemove',mv);document.removeEventListener('mouseup',up);};document.addEventListener('mousemove',mv);document.addEventListener('mouseup',up);});
  el.addEventListener('dblclick',()=>{if(confirm('Remove this text?'))el.remove();});
}
