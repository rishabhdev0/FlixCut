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
    kinds:['pdf'],
    maxFiles:MAX_FILES,
    currentCount:files.length,
    maxBatchBytes:MAX_BATCH_BYTES,
    currentBytes:used
  });
  let arr=result.allowed;
  if(!arr.length){window.PixCutSecurity.showValidationResult(result,{fallback:'Only PDF files are supported.'});return;}
  if(result.rejected.length)toast(`${result.rejected.length} PDF${result.rejected.length>1?'s':''} skipped. First: ${result.rejected[0].reason}`);
  for(const f of arr){
    let pages=null;
    try{const ab=await f.arrayBuffer();const doc=await PDFLib.PDFDocument.load(ab,{ignoreEncryption:true});pages=doc.getPageCount();}catch(e){}
    files.push({id:Date.now()+Math.random(),file:f,name:f.name,size:f.size,pages,status:'wait',outBlob:null,outSize:0,prog:0});
  }
  renderCards();toast(`${arr.length} PDF${arr.length>1?'s':''} added`);
}

function fmtSize(b){if(!b&&b!==0)return'—';if(b<1024)return b+'B';if(b<1048576)return(b/1024).toFixed(1)+' KB';return(b/1048576).toFixed(2)+' MB';}

function renderCards(){
  const empty=document.getElementById('empty-card');
  const cards=document.getElementById('file-cards');
  const addMore=document.getElementById('add-more-card');
  if(!files.length){
    empty.style.display='block';cards.style.display='none';addMore.style.display='none';
    updateSummary();updateActions();return;
  }
  empty.style.display='none';cards.style.display='flex';addMore.style.display='block';
  cards.innerHTML='';
  files.forEach((item,i)=>{
    const savings=item.outSize&&item.size?Math.round((1-item.outSize/item.size)*100):null;
    const sizeGood=savings!==null&&savings>0;
    const div=document.createElement('div');
    const safeName=esc(item.name);
    div.className=`fc fc-${item.status}`;
    div.innerHTML=`
      <div class="fc-body">
        <div class="fc-pdf-icon">
          <svg width="20" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--r)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          <span class="fc-type">PDF</span>
          ${item.pages?`<span class="fc-pages-num">${item.pages}pg</span>`:''}
        </div>
        <div class="fc-info">
          <div class="fc-name" title="${safeName}">${safeName}</div>
          <div class="fc-sizes">
            <span class="fc-before">${fmtSize(item.size)}</span>
            ${item.outSize?`
              <span class="fc-arrow"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></span>
              <span class="fc-after ${sizeGood?'good':'same'}">${fmtSize(item.outSize)}</span>
              <span class="fc-saving ${sizeGood?'good':'bad'}">${sizeGood?'-'+savings+'%':'Already optimal'}</span>
            `:''}
          </div>
          <div class="fc-prog-wrap"><div class="fc-prog-bar" id="fpb-${i}" style="width:${item.prog}%"></div></div>
          <div class="fc-status-text">${{wait:'Ready to compress',proc:'Compressing...',done:sizeGood?`Compressed — saved ${savings}%`:'Already optimal — no change needed',error:'Error during compression'}[item.status]}</div>
        </div>
        <div class="fc-btns">
          <button class="fc-btn dl" data-i="${i}" ${item.status!=='done'?'disabled':''}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
            Download
          </button>
          <button class="fc-btn del" data-i="${i}">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            Remove
          </button>
        </div>
      </div>`;
    div.querySelector('.fc-btn.dl').addEventListener('click',()=>dlFile(i));
    div.querySelector('.fc-btn.del').addEventListener('click',()=>{files.splice(i,1);renderCards();});
    cards.appendChild(div);
  });
  updateSummary();updateActions();
}

function updateSummary(){
  const done=files.filter(f=>f.status==='done');
  const totalIn=files.reduce((a,f)=>a+f.size,0);
  const totalOut=done.reduce((a,f)=>a+f.outSize,0);
  const saved=Math.max(0,totalIn-totalOut);
  document.getElementById('s-total').textContent=files.length;
  document.getElementById('s-done').textContent=done.length;
  document.getElementById('s-before').textContent=files.length?fmtSize(totalIn):'—';
  document.getElementById('s-after').textContent=done.length?fmtSize(totalOut):'—';
  document.getElementById('st-saved').textContent=saved?fmtSize(saved):'—';
}
function updateActions(){document.getElementById('btn-compress').disabled=!files.length;}
