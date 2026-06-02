// COMPRESS
async function compressAll(){
  if(!files.length){toast('Add PDFs before compressing');return;}
  document.getElementById('btn-compress').disabled=true;
  for(let i=0;i<files.length;i++){
    if(files[i].status==='done')continue;
    files[i].status='proc';files[i].prog=8;renderCards();
    try{await compressOne(i);files[i].status='done';files[i].prog=100;}
    catch(err){files[i].status='error';files[i].prog=0;console.error(err);toast('Error: '+files[i].name);}
    renderCards();
  }
  const saved=files.filter(f=>f.status==='done').reduce((a,f)=>a+Math.max(0,f.size-f.outSize),0);
  toast(`Done! Saved ${fmtSize(saved)} total ✓`);
  document.getElementById('btn-compress').disabled=false;updateActions();
}

async function compressOne(idx){
  const item=files[idx];
  const setP=p=>{files[idx].prog=p;const el=document.getElementById(`fpb-${idx}`);if(el)el.style.width=p+'%';};
  const cfg=LEVEL_CFG[level];
  setP(15);
  const ab=await item.file.arrayBuffer();
  const srcDoc=await PDFLib.PDFDocument.load(ab,{ignoreEncryption:true});
  setP(30);

  if(level==='lossless'){
    const outDoc=await PDFLib.PDFDocument.create();
    const pages=await outDoc.copyPages(srcDoc,srcDoc.getPageIndices());
    pages.forEach(p=>outDoc.addPage(p));
    if(stripMeta){outDoc.setTitle('');outDoc.setAuthor('');outDoc.setSubject('');outDoc.setKeywords([]);outDoc.setCreator('PixCut');outDoc.setProducer('PixCut PDF Optimizer');}
    setP(80);
    const bytes=await outDoc.save({useObjectStreams:true});
    const outBlob=new Blob([bytes],{type:'application/pdf'});
    item.outBlob=outBlob.size<item.size?outBlob:item.file;
    item.outSize=item.outBlob.size;return;
  }

  if(recompImages){
    const pdfJsDoc=await pdfjsLib.getDocument({data:new Uint8Array(ab),verbosity:0}).promise;
    setP(40);
    const outDoc=await PDFLib.PDFDocument.create();
    for(let p=0;p<pdfJsDoc.numPages;p++){
      const page=await pdfJsDoc.getPage(p+1);
      const vp=page.getViewport({scale:cfg.dpi/72});
      let cw=Math.round(vp.width),ch=Math.round(vp.height);
      if(cw>cfg.maxDim){ch=Math.round(ch*(cfg.maxDim/cw));cw=cfg.maxDim;}
      const vp2=page.getViewport({scale:(cfg.dpi/72)*(cw/vp.width)});
      ch=Math.round(vp2.height);
      const c=document.createElement('canvas');c.width=cw;c.height=ch;
      await page.render({canvasContext:c.getContext('2d'),viewport:vp2}).promise;
      const blob=await new Promise(r=>c.toBlob(r,'image/jpeg',imgQuality));
      const imgAb=await blob.arrayBuffer();
      const embed=await outDoc.embedJpg(imgAb);
      const pg=outDoc.addPage([embed.width,embed.height]);
      pg.drawImage(embed,{x:0,y:0,width:embed.width,height:embed.height});
      setP(40+Math.round(((p+1)/pdfJsDoc.numPages)*45));
    }
    if(stripMeta){outDoc.setTitle('');outDoc.setAuthor('');outDoc.setSubject('');outDoc.setKeywords([]);outDoc.setCreator('PixCut');outDoc.setProducer('PixCut PDF Optimizer');}
    setP(92);
    const bytes=await outDoc.save({useObjectStreams:useObjStreams});
    const outBlob=new Blob([bytes],{type:'application/pdf'});
    if(outBlob.size<item.size){item.outBlob=outBlob;item.outSize=outBlob.size;}
    else{
      const bytes2=await srcDoc.save({useObjectStreams:true});
      const outBlob2=new Blob([bytes2],{type:'application/pdf'});
      item.outBlob=outBlob2.size<item.size?outBlob2:item.file;
      item.outSize=item.outBlob.size;
    }
  } else {
    const outDoc=await PDFLib.PDFDocument.create();
    const pages=await outDoc.copyPages(srcDoc,srcDoc.getPageIndices());
    pages.forEach(p=>outDoc.addPage(p));
    if(stripMeta){outDoc.setTitle('');outDoc.setAuthor('');outDoc.setSubject('');outDoc.setKeywords([]);outDoc.setCreator('PixCut');outDoc.setProducer('PixCut PDF Optimizer');}
    setP(85);
    const bytes=await outDoc.save({useObjectStreams:useObjStreams});
    const outBlob=new Blob([bytes],{type:'application/pdf'});
    item.outBlob=outBlob.size<item.size?outBlob:item.file;
    item.outSize=item.outBlob.size;
  }
}

function dlFile(i){
  const item=files[i];if(!item.outBlob)return;
  const a=document.createElement('a');
  a.href=URL.createObjectURL(item.outBlob);
  a.download=item.name.replace('.pdf','_compressed.pdf');
  a.click();setTimeout(()=>URL.revokeObjectURL(a.href),8000);
  toast('Downloaded ✓');
}
