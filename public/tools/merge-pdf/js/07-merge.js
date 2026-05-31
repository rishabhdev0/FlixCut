// ── MERGE ─────────────────────────────────────────────────
document.getElementById('btn-merge').addEventListener('click',doMerge);

async function doMerge(){
  if(files.length<2){toast('Add at least 2 files to merge');return;}
  const userPass=document.getElementById('user-pass').value;
  const ownerPass=document.getElementById('owner-pass').value||userPass;
  if(addPass&&!userPass){toast('Enter an open password first');document.getElementById('user-pass').focus();return;}
  const progCard=document.getElementById('prog-card');
  const progMsg=document.getElementById('prog-msg');
  const progFile=document.getElementById('prog-file');
  const progBar=document.getElementById('prog-bar');
  const progPct=document.getElementById('prog-pct');
  progCard.classList.add('show');progBar.style.width='0%';progPct.textContent='0%';
  const setP=(pct,msg,file='')=>{progBar.style.width=pct+'%';progPct.textContent=Math.round(pct)+'%';if(msg)progMsg.textContent=msg;if(file!==undefined)progFile.textContent=file;};
  try{
    const{PDFDocument,rgb,StandardFonts,degrees}=PDFLib;
    const merged=await PDFDocument.create();
    const totalFiles=files.length;
    for(let i=0;i<totalFiles;i++){
      const item=files[i];const pct=(i/totalFiles)*85;
      setP(pct,`Processing ${i+1} of ${totalFiles}`,item.name);
      const ab=await item.file.arrayBuffer();
      if(item.isPdf){
        const src=await PDFDocument.load(ab,{ignoreEncryption:true});
        const totalPages=src.getPageCount();
        const from=Math.max(0,(item.pgFrom||1)-1),to=Math.min(totalPages-1,(item.pgTo||totalPages)-1);
        const indices=Array.from({length:to-from+1},(_,k)=>k+from);
        const copied=await merged.copyPages(src,indices);
        for(const page of copied){if(item.rotation)page.setRotation(degrees(page.getRotation().angle+item.rotation));merged.addPage(page);}
      }else{
        let embed;
        const lower=item.name.toLowerCase();
        try{
          if(lower.endsWith('.jpg')||lower.endsWith('.jpeg')||item.type==='image/jpeg')embed=await merged.embedJpg(ab);
          else{const blob=new Blob([ab],{type:item.type});const url=URL.createObjectURL(blob);const imgEl=await new Promise((res,rej)=>{const im=new Image();im.onload=()=>res(im);im.onerror=rej;im.src=url;});URL.revokeObjectURL(url);const c=document.createElement('canvas');c.width=imgEl.naturalWidth;c.height=imgEl.naturalHeight;c.getContext('2d').drawImage(imgEl,0,0);const pngAb=await new Promise(r=>c.toBlob(r,'image/png')).then(b=>b.arrayBuffer());embed=await merged.embedPng(pngAb);}
        }catch(e){toast(`Skipped ${item.name}`);continue;}
        let[pgW,pgH]=pageSize==='fit'?[embed.width,embed.height]:(PAGE_SIZES[pageSize]||PAGE_SIZES['A4']);
        const autoL=orientation==='auto'&&embed.width>embed.height;if(orientation==='landscape'||autoL)[pgW,pgH]=[pgH,pgW];
        const m=margin,availW=pgW-m*2,availH=pgH-m*2;
        const scale=Math.min(availW/embed.width,availH/embed.height);
        const w=embed.width*scale,h=embed.height*scale;
        const page=merged.addPage([pgW,pgH]);
        if(item.rotation)page.setRotation(degrees(item.rotation));
        page.drawImage(embed,{x:m+(availW-w)/2,y:m+(availH-h)/2,width:w,height:h});
      }
      if(addBlank&&i<totalFiles-1){const[pgW,pgH]=PAGE_SIZES[pageSize]||PAGE_SIZES['A4'];merged.addPage([pgW,pgH]);}
    }
    setP(88,'Adding page numbers & watermarks...');
    const allPages=merged.getPages();const totalMergedPages=allPages.length;
    const font=await merged.embedFont(StandardFonts.Helvetica);
    const boldFont=await merged.embedFont(StandardFonts.HelveticaBold);
    if(addPgNums){allPages.forEach((p,i)=>{const{width,height}=p.getSize();const text=`${i+1} / ${totalMergedPages}`;const tw=font.widthOfTextAtSize(text,9);let x,y;if(pgNumPos==='bottom-center'){x=(width-tw)/2;y=16;}else if(pgNumPos==='bottom-right'){x=width-tw-20;y=16;}else{x=(width-tw)/2;y=height-22;}p.drawText(text,{x,y,size:9,font,color:rgb(.5,.5,.5),opacity:.7});});}
    if(addWm&&wmText.trim()){const wmFontSize=wmSize;allPages.forEach(p=>{const{width,height}=p.getSize();const tw=boldFont.widthOfTextAtSize(wmText,wmFontSize);p.drawText(wmText,{x:(width-tw)/2,y:(height-wmFontSize)/2,size:wmFontSize,font:boldFont,color:rgb(0.5,0.5,0.5),opacity:wmOpacity,rotate:PDFLib.degrees(wmRotation)});});}
    const title=document.getElementById('meta-title').value.trim();const author=document.getElementById('meta-author').value.trim();
    if(title)merged.setTitle(title);if(author)merged.setAuthor(author);
    merged.setCreator('PixCut');merged.setProducer('PixCut PDF Engine');merged.setCreationDate(new Date());merged.setModificationDate(new Date());
    setP(94,'Saving PDF...');
    const saveOpts={useObjectStreams:compress};
    let pdfBytes=await merged.save(saveOpts);
    if(addPass){
      setP(96,'Encrypting with AES-256...');
      pdfBytes=await encryptPdfBytes(pdfBytes,userPass,ownerPass);
    }
    setP(100,'Done!');
    const fname=(document.getElementById('out-name').value.trim()||'pixcut-merged')+'.pdf';
    const blob=new Blob([pdfBytes],{type:'application/pdf'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=fname;a.click();
    setTimeout(()=>URL.revokeObjectURL(url),10000);
    toast(`Merged ${totalFiles} files → ${totalMergedPages} pages ✓`);
  }catch(err){console.error(err);progBar.style.background='var(--r)';progMsg.textContent='Error: '+err.message;toast('Merge failed: '+err.message);}
  setTimeout(()=>{progCard.classList.remove('show');progBar.style.background='';},5000);
}

async function encryptPdfBytes(pdfBytes,userPass,ownerPass){
  const logs=[],errs=[];
  const {default:QPDF}=await import('/vendor/qpdf/qpdf.mjs');
  const qpdf=await QPDF({
    noInitialRun:true,
    noExitRuntime:true,
    print:t=>logs.push(t),
    printErr:t=>errs.push(t)
  });
  qpdf.FS.writeFile('/input.pdf',new Uint8Array(pdfBytes));
  try{
    qpdf.callMain(['--encrypt',userPass,ownerPass,'256','--','/input.pdf','/encrypted.pdf']);
  }catch(err){
    const msg=errs.join('\n')||err?.message||'PDF encryption failed';
    throw new Error(msg);
  }
  try{
    return qpdf.FS.readFile('/encrypted.pdf');
  }catch(err){
    const msg=errs.join('\n')||logs.join('\n')||'Encrypted PDF was not created';
    throw new Error(msg);
  }
}
