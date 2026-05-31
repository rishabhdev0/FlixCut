// ── RENDER LIST ────────────────────────────────────────────
function renderList(){
  const ul=document.getElementById('file-list');
  ul.innerHTML='';
  if(!files.length){
    ul.innerHTML=`<li class="empty-state"><div class="es-icon"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></div><div class="es-title">No Files Yet</div><div class="es-sub">Drop PDFs and images above</div></li>`;
    updateSummary();updateMergeBtn();return;
  }
  files.forEach((item,i)=>{
    const li=document.createElement('li');
    li.className=`file-item${selectedIdx===i?' selected':''}${item.isDuplicate?' duplicate-warn':''}`;
    li.dataset.idx=i;
    const color=item.isPdf?'var(--r)':'var(--c)';
    const tColor=item.isPdf?'#fff':'var(--ink)';
    const label=item.isPdf?'PDF':(item.type.split('/')[1]||'IMG').toUpperCase().slice(0,4);
    const pgInfo=item.isPdf&&item.pages?`${item.pages} page${item.pages!==1?'s':''}`:'' ;
    const safeName=esc(item.name);
    li.innerHTML=`
      <div class="dh"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></div>
      <div class="ord">${i+1}</div>
      <div class="fi-thumb">${item.thumb?`<img src="${item.thumb}" alt=""/>`:`<div class="no-preview"><span class="fi-type" style="background:${color};color:${tColor};">${label}</span></div>`}</div>
      <div class="fi-info">
        <div class="fi-name" title="${safeName}">${safeName}${item.isDuplicate?' <span style="color:var(--o);font-size:9px;font-weight:900;">DUPLICATE</span>':''}</div>
        <div class="fi-meta"><span style="color:${color};font-weight:900;">${label}</span><span class="fi-dot"></span><span>${fmtSize(item.size)}</span>${pgInfo?`<span class="fi-dot"></span><span>${pgInfo}</span>`:''}</div>
        ${item.isPdf&&typeof item.pages==='number'&&item.pages>1?`<div class="pg-range"><span class="pg-range-lbl">Pages</span><input type="number" value="${item.pgFrom}" min="1" max="${item.pages}" data-role="pgfrom" data-i="${i}"/><span class="pg-range-sep">–</span><input type="number" value="${item.pgTo}" min="1" max="${item.pages}" data-role="pgto" data-i="${i}"/><span class="pg-range-total">of ${item.pages}</span></div>`:''}
        <div class="fi-rot"><span class="rot-lbl">Rotation</span>${[0,90,180,270].map(r=>`<button class="rot-btn${item.rotation===r?' on':''}" data-r="${r}" data-i="${i}">${r}°</button>`).join('')}</div>
      </div>
      <div class="fi-btns">
        <button class="fb arr" data-action="up" data-i="${i}" title="Move up"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"/></svg></button>
        <button class="fb arr" data-action="dn" data-i="${i}" title="Move down"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg></button>
        <button class="fb del" data-action="del" data-i="${i}" title="Remove"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
      </div>`;

    li.addEventListener('click',()=>{selectedIdx=selectedIdx===i?null:i;renderList();});

    // Actions
    li.querySelectorAll('[data-action]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const idx=parseInt(btn.dataset.i),act=btn.dataset.action;
        if(act==='up'&&idx>0){[files[idx],files[idx-1]]=[files[idx-1],files[idx]];renderList();}
        else if(act==='dn'&&idx<files.length-1){[files[idx],files[idx+1]]=[files[idx+1],files[idx]];renderList();}
        else if(act==='del'){const n=files[idx].name;files.splice(idx,1);if(selectedIdx===idx)selectedIdx=null;renderList();toast(`Removed: ${n}`);}
      });
    });
    // Page range
    li.querySelectorAll('[data-role="pgfrom"]').forEach(inp=>{inp.addEventListener('change',()=>{const i=parseInt(inp.dataset.i);const item=files[i];item.pgFrom=Math.max(1,Math.min(item.pages,parseInt(inp.value)||1));if(item.pgTo<item.pgFrom)item.pgTo=item.pgFrom;renderList();});inp.addEventListener('click',e=>e.stopPropagation());});
    li.querySelectorAll('[data-role="pgto"]').forEach(inp=>{inp.addEventListener('change',()=>{const i=parseInt(inp.dataset.i);const item=files[i];item.pgTo=Math.max(item.pgFrom||1,Math.min(item.pages,parseInt(inp.value)||item.pages));renderList();});inp.addEventListener('click',e=>e.stopPropagation());});
    // Rotation
    li.querySelectorAll('.rot-btn').forEach(btn=>{btn.addEventListener('click',e=>{e.stopPropagation();const i=parseInt(btn.dataset.i);files[i].rotation=parseInt(btn.dataset.r);renderList();});});
    // Drag
    li.draggable=true;
    li.addEventListener('dragstart',e=>{dragSrcIdx=i;li.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    li.addEventListener('dragend',()=>{li.classList.remove('dragging');document.querySelectorAll('.file-item').forEach(x=>x.classList.remove('drop-above','drop-below'));});
    li.addEventListener('dragover',e=>{e.preventDefault();if(dragSrcIdx===i)return;document.querySelectorAll('.file-item').forEach(x=>x.classList.remove('drop-above','drop-below'));const rc=li.getBoundingClientRect();li.classList.add(e.clientY<rc.top+rc.height/2?'drop-above':'drop-below');});
    li.addEventListener('dragleave',()=>li.classList.remove('drop-above','drop-below'));
    li.addEventListener('drop',e=>{e.preventDefault();li.classList.remove('drop-above','drop-below');if(dragSrcIdx===null||dragSrcIdx===i)return;const m=files.splice(dragSrcIdx,1)[0];const insertAt=dragSrcIdx<i?i:i;files.splice(dragSrcIdx<i?i:i,0,m);dragSrcIdx=null;selectedIdx=null;renderList();toast('Reordered');});

    ul.appendChild(li);
  });
  updateSummary();updateMergeBtn();
}

function updateSummary(){
  const pdfs=files.filter(f=>f.isPdf).length,imgs=files.length-pdfs;
  const size=files.reduce((a,f)=>a+f.size,0);
  const pages=files.reduce((a,f)=>{if(f.isPdf&&typeof f.pages==='number'){const from=f.pgFrom||1,to=f.pgTo||f.pages;return a+(to-from+1);}return a+1;},0);
  document.getElementById('flc-badge').textContent=files.length+' file'+(files.length!==1?'s':'');
  document.getElementById('s-total').textContent=files.length;
  document.getElementById('s-pdfs').textContent=pdfs;
  document.getElementById('s-imgs').textContent=imgs;
  document.getElementById('s-size').textContent=files.length?fmtSize(size):'—';
  document.getElementById('s-pages').textContent=pages?pages+' pg est.':'—';
}
function updateMergeBtn(){document.getElementById('btn-merge').disabled=files.length<2;}
