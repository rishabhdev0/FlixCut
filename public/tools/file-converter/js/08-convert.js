// ─── CONVERT ────────────────────────────────
document.getElementById('btn-convert').addEventListener('click',convertAll);

async function convertAll(){
  if(!files.length)return;
  const pw=document.getElementById('prog-wrap');const pm=document.getElementById('prog-msg');const pb=document.getElementById('prog-bar');const pp=document.getElementById('prog-pct');
  pw.classList.add('show');pb.style.width='0%';pp.textContent='0%';

  if(convMode==='img-to-pdf'&&!onePdfPerImg){
    files.forEach(f=>{f.status='proc';f.converted=[];f.outSize=0;});
    renderList();pm.textContent='Building one PDF from all images...';pb.style.width='30%';pp.textContent='30%';
    try{
      await doImagesToSinglePdf();
      files.forEach(f=>f.status='done');
      pb.style.width='100%';pp.textContent='100%';pm.textContent='All done!';
      toast('Combined PDF ready ✓');
    }catch(err){
      files.forEach(f=>f.status='error');
      console.error(err);toast('PDF failed');
    }
    renderList();setTimeout(()=>pw.classList.remove('show'),3500);
    return;
  }

  for(let i=0;i<files.length;i++){
    files[i].status='proc';renderList();
    const pct=Math.round((i/files.length)*95);pb.style.width=pct+'%';pp.textContent=pct+'%';
    pm.textContent=`Converting ${files[i].name}...`;
    try{
      if(convMode==='img-to-img')await doImgToImg(i);
      else if(convMode==='img-to-pdf')await doImgToPdf(i);
      else if(convMode==='pdf-to-img')await doPdfToImg(i);
      files[i].status='done';
    }catch(err){files[i].status='error';console.error(err);toast('Error: '+files[i].name);}
    renderList();
  }
  pb.style.width='100%';pp.textContent='100%';pm.textContent='All done!';
  toast(`Converted ${files.filter(f=>f.status==='done').length} files ✓`);
  setTimeout(()=>pw.classList.remove('show'),3500);
}
