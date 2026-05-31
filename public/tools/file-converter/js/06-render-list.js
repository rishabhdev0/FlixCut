// ─── RENDER LIST ────────────────────────────
function renderList(){
  const ul=document.getElementById('file-list');
  const empty=document.getElementById('empty-state');
  const flc=document.getElementById('flc');
  if(!files.length){flc.style.display='none';empty.style.display='flex';updateStats();updateActions();return;}
  empty.style.display='none';flc.style.display='block';ul.innerHTML='';

  files.forEach((item,i)=>{
    const li=document.createElement('li');
    const isPdf=item.type==='application/pdf'||item.name.toLowerCase().endsWith('.pdf');
    const typeColor=isPdf?'var(--r)':'var(--c)';
    const typeText=isPdf?'#fff':'var(--ink)';
    const typeLabel=isPdf?'PDF':(item.type.split('/')[1]||'IMG').toUpperCase().slice(0,4);
    const safeName=esc(item.name);
    const savings=item.status==='done'&&item.outSize&&item.size?Math.round((1-item.outSize/item.size)*100):null;
    const statusLabels={wait:'WAITING',proc:'CONVERTING',done:'DONE',error:'ERROR'};

    li.className=`file-item fi-${item.status}`;
    li.dataset.idx=i;li.draggable=true;

    li.innerHTML=`
      <div class="drag-h"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="5" r="1"/><circle cx="9" cy="12" r="1"/><circle cx="9" cy="19" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="12" r="1"/><circle cx="15" cy="19" r="1"/></svg></div>
      <div class="fi-thumb">${item.thumb?`<img src="${item.thumb}" alt=""/>`:`<span class="fi-type" style="background:${typeColor};color:${typeText};">${typeLabel}</span>`}</div>
      <div class="fi-info">
        <div class="fi-name" title="${safeName}">${safeName}</div>
        <div class="fi-meta">
          <span style="color:${typeColor};font-weight:900;">${typeLabel}</span>
          <span class="fi-dot"></span><span>${fmtSize(item.size)}</span>
          ${item.status==='done'&&item.outSize?`<span class="fi-dot"></span><span>${fmtSize(item.outSize)}</span>`:''}
          ${savings!==null?`<span class="fi-dot"></span><span class="fi-savings">${savings>0?'-'+savings+'%':'±0'}</span>`:''}
          ${item.converted.length>1?`<span class="fi-dot"></span><span style="color:#d96a00;">${item.converted.length} outputs</span>`:''}
        </div>
      </div>
      <div class="fi-right">
        <span class="fi-status ${item.status}">${statusLabels[item.status]}</span>
        <button class="fi-btn dl" data-i="${i}" ${item.status!=='done'?'disabled':''} title="Download">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="fi-btn del" data-i="${i}" title="Remove">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;

    li.querySelector('.fi-btn.dl').addEventListener('click',()=>dlFile(i));
    li.querySelector('.fi-btn.del').addEventListener('click',()=>{files.splice(i,1);renderList();});

    // Drag
    li.addEventListener('dragstart',e=>{dragSrcIdx=i;li.classList.add('dragging');e.dataTransfer.effectAllowed='move';});
    li.addEventListener('dragend',()=>{li.classList.remove('dragging');document.querySelectorAll('.file-item').forEach(x=>x.classList.remove('drop-above','drop-below'));});
    li.addEventListener('dragover',e=>{e.preventDefault();if(dragSrcIdx===i)return;document.querySelectorAll('.file-item').forEach(x=>x.classList.remove('drop-above','drop-below'));const rc=li.getBoundingClientRect();li.classList.add(e.clientY<rc.top+rc.height/2?'drop-above':'drop-below');});
    li.addEventListener('dragleave',()=>li.classList.remove('drop-above','drop-below'));
    li.addEventListener('drop',e=>{e.preventDefault();li.classList.remove('drop-above','drop-below');if(dragSrcIdx===null||dragSrcIdx===i)return;const m=files.splice(dragSrcIdx,1)[0];files.splice(i,0,m);dragSrcIdx=null;renderList();toast('Reordered');});

    ul.appendChild(li);
  });
  updateStats();updateActions();
}

function updateStats(){
  const done=files.filter(f=>f.status==='done');
  const totalIn=files.reduce((a,f)=>a+f.size,0);
  const totalOut=done.reduce((a,f)=>a+(f.outSize||0),0);
  const saved=Math.max(0,totalIn-totalOut);
  document.getElementById('flc-badge').textContent=files.length+' file'+(files.length!==1?'s':'');
  document.getElementById('st-total').textContent=files.length;
  document.getElementById('st-done').textContent=done.length;
  document.getElementById('st-in').textContent=files.length?fmtSize(totalIn):'—';
  document.getElementById('st-out').textContent=done.length?fmtSize(totalOut):'—';
  document.getElementById('st-save').textContent=saved?fmtSize(saved):'—';
}

function updateActions(){
  const has=files.length>0;const hasDone=files.some(f=>f.status==='done');
  document.getElementById('btn-convert').disabled=!has;
  document.getElementById('btn-dl-zip').disabled=!hasDone;
  document.getElementById('btn-zip').disabled=!hasDone;
}
