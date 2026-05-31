// Target selector
document.querySelectorAll('.tg').forEach(c=>{
  c.addEventListener('click',()=>{
    document.querySelectorAll('.tg').forEach(x=>x.classList.remove('on'));
    c.classList.add('on');targetKB=parseInt(c.dataset.kb);
    document.getElementById('custom-inp').value='';updateEmptyTarget();
  });
});
document.getElementById('custom-apply').addEventListener('click',()=>{
  const v=parseInt(document.getElementById('custom-inp').value);
  if(v>=10&&v<=50000){document.querySelectorAll('.tg').forEach(x=>x.classList.remove('on'));targetKB=v;updateEmptyTarget();toast(`Target: ${v} KB`);}
  else toast('Enter 10–50000 KB');
});
document.querySelectorAll('.tmode').forEach(m=>{
  m.addEventListener('click',()=>{document.querySelectorAll('.tmode').forEach(x=>x.classList.remove('on'));m.classList.add('on');compressMode=m.dataset.mode;});
});
function updateEmptyTarget(){const l=targetKB>=1024?(targetKB/1024).toFixed(1)+' MB':targetKB+' KB';document.getElementById('empty-target').textContent=l;}
