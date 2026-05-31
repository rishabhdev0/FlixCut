// ─── MODE TABS ──────────────────────────────
document.querySelectorAll('.mode-tab').forEach(tab=>{
  tab.addEventListener('click',()=>{
    document.querySelectorAll('.mode-tab').forEach(t=>t.classList.remove('on'));
    tab.classList.add('on');convMode=tab.dataset.mode;
    updateModeUI();files=[];renderList();
  });
});

function updateModeUI(){
  const accepts={'img-to-img':'image/jpeg,image/png,image/webp,image/gif,image/bmp','img-to-pdf':'image/jpeg,image/png,image/webp,image/gif,image/bmp','pdf-to-img':'application/pdf,.pdf'};
  document.getElementById('file-input').accept=accepts[convMode];
  document.getElementById('add-more-input').accept=accepts[convMode];
  const titles={'img-to-img':'Drop Images Here','img-to-pdf':'Drop Images Here','pdf-to-img':'Drop PDFs Here'};
  const hints={'img-to-img':'JPG · PNG · WebP · BMP · GIF — batch convert','img-to-pdf':'Any images — each becomes a PDF page','pdf-to-img':'PDF files — each page becomes an image'};
  document.getElementById('dz-title').textContent=titles[convMode];
  document.getElementById('dz-hint').textContent=hints[convMode];
  ['fmt-img-img','fmt-img-pdf','fmt-pdf-img'].forEach(id=>document.getElementById(id).style.display='none');
  const map={'img-to-img':'fmt-img-img','img-to-pdf':'fmt-img-pdf','pdf-to-img':'fmt-pdf-img'};
  document.getElementById(map[convMode]).style.display='block';
  const chips=document.getElementById('dz-chips');
  if(convMode==='pdf-to-img')chips.innerHTML='<span class="chip" style="background:var(--r);color:#fff;">PDF</span>';
  else chips.innerHTML='<span class="chip" style="background:var(--c);">JPG</span><span class="chip" style="background:var(--c);">PNG</span><span class="chip" style="background:var(--c);">WebP</span><span class="chip" style="background:var(--c);">BMP</span><span class="chip" style="background:var(--c);">GIF</span>';
}
