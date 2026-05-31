/* ── View tabs ── */
document.querySelectorAll('.vtab').forEach(t=>{
  t.addEventListener('click',()=>{
    if(compareActive) setCompare(false);
    viewMode=t.dataset.view;
    document.querySelectorAll('.vtab').forEach(x=>x.classList.remove('on'));
    t.classList.add('on');
    renderResult();
  });
});
