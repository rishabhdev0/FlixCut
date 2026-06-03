// File input
const dz=document.getElementById('drop-zone');
document.getElementById('file-input').addEventListener('change',e=>addFiles(e.target.files));
document.getElementById('add-more-input').addEventListener('change',e=>addFiles(e.target.files));
dz.addEventListener('dragover',e=>{e.preventDefault();dz.classList.add('dov');});
dz.addEventListener('dragleave',()=>dz.classList.remove('dov'));
dz.addEventListener('drop',e=>{e.preventDefault();dz.classList.remove('dov');addFiles(e.dataTransfer.files);});

async function addFiles(list){
  const used=files.reduce((a,f)=>a+f.size,0);
  const result=window.PixCutSecurity.validateFiles(list,{
    kinds:['image'],
    maxFiles:MAX_FILES,
    currentCount:files.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:used
  });
  let arr=result.allowed;
  if(!arr.length){window.PixCutSecurity.showValidationResult(result,{fallback:'Only JPG, PNG, WebP, GIF, BMP, HEIC, or HEIF images are supported.'});return;}
  if(result.rejected.length)toast(`${result.rejected.length} image${result.rejected.length>1?'s':''} skipped. First: ${result.rejected[0].reason}`);
  for(const f of arr){
    const thumb=await makeThumb(f);
    files.push({id:Date.now()+Math.random(),file:f,name:f.name,size:f.size,type:f.type,thumb,status:'wait',outBlob:null,outSize:0});
  }
  document.getElementById('stats-bar').style.display='grid';
  renderList();toast(`${arr.length} image${arr.length>1?'s':''} added`);
}

function makeThumb(file){
  return new Promise(res=>{
    const reader=new FileReader();
    reader.onload=e=>{
      const img=new Image();
      img.onload=()=>{const c=document.createElement('canvas');c.width=46;c.height=46;const ctx=c.getContext('2d');ctx.fillStyle='#f3efe4';ctx.fillRect(0,0,46,46);const r=Math.min(46/img.width,46/img.height);ctx.drawImage(img,(46-img.width*r)/2,(46-img.height*r)/2,img.width*r,img.height*r);res(c.toDataURL());};
      img.onerror=()=>res(null);img.src=e.target.result;
    };reader.readAsDataURL(file);
  });
}

function fmtSize(b){if(!b&&b!==0)return'—';if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(2)+' MB';}

function renderList(){
  const empty=document.getElementById('empty-card');
  const flc=document.getElementById('flc');
  const ul=document.getElementById('file-list');
  if(!files.length){flc.style.display='none';empty.style.display='block';document.getElementById('stats-bar').style.display='none';updateSummary();updateActions();return;}
  empty.style.display='none';flc.style.display='block';ul.innerHTML='';
  files.forEach((item,i)=>{
    const targetBytes=targetKB*1024;
    const savings=item.outSize&&item.size?Math.round((1-item.outSize/item.size)*100):null;
    const tooSmall=item.size<=targetBytes;
    const hit=item.outSize&&Math.abs(item.outSize-targetBytes)<targetBytes*.08;
    const near=item.outSize&&!hit&&Math.abs(item.outSize-targetBytes)<targetBytes*.2;
    const sClass=tooSmall?'small':hit?'hit':near?'near':'hit';
    const statusKey=item.status==='done'&&tooSmall?'small':item.status;
    const statusLabel={wait:'WAITING',proc:'COMPRESSING',done:tooSmall?'TOO SMALL':hit?'TARGET HIT ✓':'BEST POSSIBLE',error:'ERROR',small:'ALREADY SMALL'}[statusKey]||'WAITING';
    const progW=item.status==='done'||item.status==='error'?100:item.status==='proc'?50:0;
    const safeName=esc(item.name);
    const li=document.createElement('li');
    li.className=`fi fi-${statusKey}`;
    li.innerHTML=`
      <div class="fi-thumb">${item.thumb?`<img src="${item.thumb}" alt=""/>`:'<div style="width:100%;height:100%;display:grid;place-items:center;font-size:8px;font-weight:900;color:var(--muted);">IMG</div>'}</div>
      <div class="fi-info" style="flex:1;min-width:0;">
        <div class="fi-name" title="${safeName}">${safeName}</div>
        <div class="fi-sizes">
          <span class="fi-before">${fmtSize(item.size)}</span>
          ${item.outSize?`<svg class="fi-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg><span class="fi-after ${sClass}">${fmtSize(item.outSize)}</span>${savings!==null?`<span class="fi-pct ${savings>0?'good':'warn'}">${savings>0?'-'+savings+'%':'±0'}</span>`:''}`:'' }
        </div>
        <div class="fi-prog-wrap"><div class="fi-prog-bar ${statusKey}" style="width:${progW}%"></div></div>
        <div style="margin-top:5px;"><span class="fi-status ${statusKey}">${statusLabel}</span></div>
      </div>
      <div class="fi-btns">
        <button class="fi-btn dl" data-i="${i}" ${item.status!=='done'?'disabled':''} title="Download">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        </button>
        <button class="fi-btn del" data-i="${i}" title="Remove">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
        </button>
      </div>`;
    li.querySelector('.fi-btn.dl').addEventListener('click',()=>dlFile(i));
    li.querySelector('.fi-btn.del').addEventListener('click',()=>{files.splice(i,1);renderList();});
    ul.appendChild(li);
  });
  document.getElementById('flc-badge').textContent=files.length+' file'+(files.length!==1?'s':'');
  updateSummary();updateActions();
}

function updateSummary(){
  const done=files.filter(f=>f.status==='done');
  const totalIn=files.reduce((a,f)=>a+f.size,0);
  const totalOut=done.reduce((a,f)=>a+(f.outSize||0),0);
  const saved=Math.max(0,totalIn-totalOut);
  const pct=totalIn&&totalOut&&done.length?Math.round(saved/totalIn*100):0;
  document.getElementById('s-total').textContent=files.length;document.getElementById('st-total').textContent=files.length;
  document.getElementById('s-done').textContent=done.length;document.getElementById('st-done').textContent=done.length;
  document.getElementById('s-before').textContent=files.length?fmtSize(totalIn):'—';document.getElementById('st-in').textContent=files.length?fmtSize(totalIn):'—';
  document.getElementById('s-after').textContent=done.length?fmtSize(totalOut):'—';document.getElementById('st-out').textContent=done.length?fmtSize(totalOut):'—';
  document.getElementById('s-saved').textContent=saved?fmtSize(saved):'—';document.getElementById('st-save').textContent=saved?fmtSize(saved):'—';
  const bw=document.getElementById('savings-bar-wrap');
  if(done.length){bw.style.display='block';document.getElementById('savings-pct').textContent=pct+'% saved';document.getElementById('savings-bar-fill').style.width=Math.min(pct,100)+'%';}
  else bw.style.display='none';
}
function updateActions(){
  const has=files.length>0;const hasDone=files.some(f=>f.status==='done');
  document.getElementById('btn-compress').disabled=!has;
  ['btn-dl-all','btn-dl-all2'].forEach(id=>document.getElementById(id).disabled=!hasDone);
}
