// ─── IMG → PDF ──────────────────────────────
async function doImgToPdf(i){
  const{PDFDocument}=PDFLib;
  const item=files[i];
  const pdfDoc=await PDFDocument.create();
  await addImagePage(pdfDoc,item);
  pdfDoc.setCreator('PixCut');
  const bytes=await pdfDoc.save({useObjectStreams:true});
  const outBlob=new Blob([bytes],{type:'application/pdf'});
  item.outSize=outBlob.size;
  item.converted=[{blob:outBlob,name:buildName(item,0,'','pdf')}];
}

async function doImagesToSinglePdf(){
  const{PDFDocument}=PDFLib;
  const pdfDoc=await PDFDocument.create();
  for(const item of files) await addImagePage(pdfDoc,item);
  pdfDoc.setCreator('PixCut');
  const bytes=await pdfDoc.save({useObjectStreams:true});
  const outBlob=new Blob([bytes],{type:'application/pdf'});
  const first=files[0];
  first.outSize=outBlob.size;
  first.converted=[{blob:outBlob,name:doRename?`${rnPrefix||''}combined${rnSuffix||''}.pdf`:'pixcut-combined.pdf'}];
}

async function addImagePage(pdfDoc,item){
  let c;
  try{c=await buildProcessedImageCanvas(item);}
  catch(e){throw new Error('Unsupported image format');}
  const png=await c2Blob(c,'image/png',1).then(bl=>bl.arrayBuffer());
  const embed=await pdfDoc.embedPng(png);
  let[pgW,pgH]=pdfPageSize==='fit'?[embed.width,embed.height]:(PAGE_SIZES[pdfPageSize]||PAGE_SIZES['A4']);
  const autoL=pdfOrient==='auto'&&embed.width>embed.height;
  if(pdfOrient==='landscape'||autoL)[pgW,pgH]=[pgH,pgW];
  const page=pdfDoc.addPage([pgW,pgH]);
  const scale=Math.min(pgW/embed.width,pgH/embed.height);
  page.drawImage(embed,{x:(pgW-embed.width*scale)/2,y:(pgH-embed.height*scale)/2,width:embed.width*scale,height:embed.height*scale});
}
