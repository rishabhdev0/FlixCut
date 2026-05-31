// ── RENDER PAGES ──────────────────────────────────────────
function renderPages(){
  const empty=document.getElementById('pages-empty');
  const grid=document.getElementById('pages-grid');
  const addMoreRow=document.getElementById('add-more-row');
  document.getElementById('pc-badge').textContent=pages.length+' page'+(pages.length!==1?'s':'');
  document.getElementById('s-pages').textContent=pages.length;
  if(!pages.length){
    empty.style.display='flex';grid.style.display='none';addMoreRow.style.display='none';
    updateActions();return;
  }
  empty.style.display='none';grid.style.display='grid';addMoreRow.style.display='block';
  grid.innerHTML='';
  pages.forEach((pg,i)=>{
    const div=document.createElement('div');
    div.className='page-card';
    div.innerHTML=`
      <img class="pg-thumb" src="${pg.processedUrl}" alt="Page ${i+1}" loading="lazy"/>
      <div class="pg-footer">
        <span class="pg-num">Pg ${i+1}</span>
        <div class="pg-actions">
          <button class="pa up" data-i="${i}" title="Move up">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
          </button>
          <button class="pa dn" data-i="${i}" title="Move down">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
          </button>
          <button class="pa del" data-i="${i}" title="Delete">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
      </div>`;
    // Click to preview
    div.querySelector('.pg-thumb').addEventListener('click',()=>openPreview(i));
    // Actions
    div.querySelector('.pa.up').addEventListener('click',e=>{e.stopPropagation();if(i>0){[pages[i],pages[i-1]]=[pages[i-1],pages[i]];renderPages();}});
    div.querySelector('.pa.dn').addEventListener('click',e=>{e.stopPropagation();if(i<pages.length-1){[pages[i],pages[i+1]]=[pages[i+1],pages[i]];renderPages();}});
    div.querySelector('.pa.del').addEventListener('click',e=>{e.stopPropagation();pages.splice(i,1);renderPages();toast('Page removed');});
    grid.appendChild(div);
  });
  updateActions();
}

function updateActions(){
  document.getElementById('btn-generate').disabled=!pages.length;
}
